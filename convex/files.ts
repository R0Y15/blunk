import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUser } from "./users";
import { FileTypes } from "./schema";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
    const Identity = await ctx.auth.getUserIdentity();

    if (!Identity) {
        throw new ConvexError("Unauthorized");
    }

    return await ctx.storage.generateUploadUrl();
});

async function hasAccessToOrg(
    ctx: QueryCtx | MutationCtx,
    tokenIdentifier: string,
    orgId: string
) {
    const user = await getUser(ctx, tokenIdentifier);
    const hasAccess = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);

    return hasAccess;
}

export const createFile = mutation({
    args: {
        name: v.string(),
        fileId: v.id("_storage"),
        type: FileTypes,
        orgId: v.string(),
    },
    async handler(ctx, args) {
        const Identity = await ctx.auth.getUserIdentity();

        if (!Identity) {
            throw new ConvexError("Unauthorized");
        }

        const user = await getUser(ctx, Identity.tokenIdentifier);

        const hasAccess = await hasAccessToOrg(ctx, Identity.tokenIdentifier, args.orgId);
        if (!hasAccess) {
            throw new ConvexError("Unauthorized access to this organization");
        }

        await ctx.db.insert("files", {
            name: args.name,
            orgId: args.orgId,
            fileId: args.fileId,
            type: args.type,
        });
    }
});

export const getFile = query({
    args: {
        orgId: v.string(),
        query: v.optional(v.string()),
        fav: v.optional(v.boolean())
    },
    async handler(ctx, args) {
        const Identity = await ctx.auth.getUserIdentity();

        if (!Identity) {
            return [];
        }

        const hasAccess = await hasAccessToOrg(ctx, Identity.tokenIdentifier, args.orgId);
        if (!hasAccess) {
            return [];
        }

        let files = await ctx.db
            .query("files")
            .withIndex('by_orgId', q => q.eq('orgId', args.orgId))
            .collect();

        const query = args.query;
        if (query) {
            files = files.filter((file) => file.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
        }

        if (args.fav) {
            const user = await ctx.db
                .query("users")
                .withIndex("by_tokenIdentifier", q =>
                    q.eq("tokenIdentifier", Identity.tokenIdentifier)
                )
                .first();

            if (!user) {
                return files;
            }

            const favs = await ctx.db.query("favourites")
                .withIndex("by_userId_orgId_fileId", q => q
                    .eq("userId", user._id)
                    .eq("orgId", args.orgId)
                )
                .collect();

            files = files.filter((file) => 
                favs.some((fav) => fav.fileId === file._id));
        }
        return files;
    }
})

export const deleteFile = mutation({
    args: { fileId: v.id("files") },
    async handler(ctx, args) {
        const access = await hasAccessToFile(ctx, args.fileId);

        if (!access) {
            throw new ConvexError("Unauthorized access to this organization");
        }

        await ctx.db.delete(args.fileId);
    }
})

export const toggleFav = mutation({
    args: { fileId: v.id("files") },
    async handler(ctx, args) {
        const access = await hasAccessToFile(ctx, args.fileId);

        if (!access) {
            throw new ConvexError("Unauthorized access to this organization");
        }
        const { user, file } = access;

        const fav = await ctx.db.query("favourites")
            .withIndex("by_userId_orgId_fileId", q => q
                .eq("userId", user._id)
                .eq("orgId", file.orgId)
                .eq("fileId", file._id)
            )
            .first();

        if (!fav) {
            await ctx.db.insert("favourites", {
                fileId: file._id,
                userId: user._id,
                orgId: file.orgId,
            })
        } else {
            await ctx.db.delete(fav._id);
        }
    }
})

async function hasAccessToFile(ctx: QueryCtx | MutationCtx, fileId: Id<"files">) {
    const Identity = await ctx.auth.getUserIdentity();

    if (!Identity) {
        return null;
    }

    const file = await ctx.db.get(fileId);
    if (!file) {
        return null;
    }

    const hasAccess = await hasAccessToOrg(
        ctx,
        Identity.tokenIdentifier,
        // modified - "as string"
        file.orgId as string
    );

    if (!hasAccess) {
        return null;
    }

    const user = await ctx.db.query("users")
        .withIndex("by_tokenIdentifier", q =>
            q.eq("tokenIdentifier", Identity.tokenIdentifier)
        )
        .first();

    if (!user) {
        return null;
    }

    return { user, file };
}
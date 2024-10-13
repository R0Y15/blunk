import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUser } from "./users";
import { FileTypes } from "./schema";

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

        return ctx.db.query("files").withIndex(
            'by_orgId', q => q.eq('orgId', args.orgId)
        ).collect();
    }
})

export const deleteFile = mutation({
    args: { fileId: v.id("files") },
    async handler(ctx, args) {
        const Identity = await ctx.auth.getUserIdentity();

        if (!Identity) {
            throw new ConvexError("Unauthorized access to this organization");
        }

        const file = await ctx.db.get(args.fileId);
        if (!file) {
            throw new ConvexError("File not found");
        }

        const hasAccess = await hasAccessToOrg(
            ctx,
            Identity.tokenIdentifier,
            // modified - "as string"
            file.orgId as string
        );

        if (!hasAccess) {
            throw new ConvexError("You do not have access to delete this file");
        }

        await ctx.db.delete(args.fileId);
    }
})
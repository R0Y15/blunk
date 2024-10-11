import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createFile = mutation({
    args: {
        name: v.string(),
    },
    async handler(ctx, args) {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Unauthorized");
        }

        await ctx.db.insert("files", {
            name: args.name,
        });
    }
});

export const getFile = query({
    args: {},
    async handler(ctx, args) {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            return [];
        }

        return ctx.db.query("files").collect();
    }
})
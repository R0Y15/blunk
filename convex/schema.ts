import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const FileTypes = v.union(
    v.literal("image"),
    v.literal("pdf"),
    v.literal("csv")
);

export const roles = v.union(
    v.literal("admin"),
    v.literal("member")
);

export default defineSchema({
    files: defineTable({
        name: v.string(),
        fileId: v.id("_storage"),
        type: FileTypes,
        orgId: v.optional(v.string()),
    }).index(
        "by_orgId",
        ["orgId"]
    ),

    users: defineTable({
        tokenIdentifier: v.string(),
        orgIds: v.array(v.object({
            orgId: v.string(),
            role: roles,
        })),
    }).index("by_tokenIdentifier", ["tokenIdentifier"]),

    favourites: defineTable({
        fileId: v.id("files"),
        orgId: v.optional(v.string()),
        userId: v.id("users"),
    }).index("by_userId_orgId_fileId", ["userId", "orgId", "fileId"]),
});
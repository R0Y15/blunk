import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const FileTypes = v.union(
    v.literal("image"),
    v.literal("pdf"),
    v.literal("csv"),
    v.literal("zip"),
    v.literal("doc"),
    v.literal("text"),
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
        shouldDelete: v.optional(v.boolean()),
        userId: v.id("users"),
        isGlobal: v.optional(v.boolean()),
        fileKey: v.optional(v.string()),
        globalExpiryTime: v.optional(v.number()),
        content: v.optional(v.string()),
    }).index(
        "by_orgId",
        ["orgId"]
    )
        .index(
            "by_shouldDelete",
            ["shouldDelete"]
        )
        .index(
            "by_fileKey",
            ["fileKey"]
        )
        .index(
            "by_isGlobal",
            ["isGlobal"]
        ),

    users: defineTable({
        tokenIdentifier: v.string(),
        name: v.optional(v.string()),
        image: v.optional(v.string()),
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
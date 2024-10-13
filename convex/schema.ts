import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Other tables here...

    files: defineTable({
        name: v.string(),
        fileId: v.id("_storage"),
        orgId: v.optional(v.string()),
    }).index(
        "by_orgId",
        ["orgId"]
    ),

    users: defineTable({
        tokenIdentifier: v.string(),
        orgIds: v.array(v.string()),
    }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
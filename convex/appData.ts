import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Retrieve full state of the cooperative
export const getState = query({
  args: {
    key: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const targetKey = args.key || "main";
    const existing = await ctx.db
      .query("cooperativeState")
      .withIndex("by_key", (q) => q.eq("key", targetKey))
      .first();

    if (!existing) {
      return null;
    }

    return {
      users: existing.users,
      membres: existing.membres,
      config: existing.config,
      interventions: existing.interventions,
      elevages: existing.elevages,
      parcelles: existing.parcelles,
      terrains: existing.terrains,
      collectes: existing.collectes,
      campagnes: existing.campagnes,
      activeCampagneCode: existing.activeCampagneCode,
      updatedAt: existing.updatedAt,
      updatedBy: existing.updatedBy,
      syncVersion: existing.syncVersion || 1,
    };
  },
});

// Save or merge full state of the cooperative
export const saveState = mutation({
  args: {
    key: v.optional(v.string()),
    users: v.optional(v.any()),
    membres: v.optional(v.any()),
    config: v.optional(v.any()),
    interventions: v.optional(v.any()),
    elevages: v.optional(v.any()),
    parcelles: v.optional(v.any()),
    terrains: v.optional(v.any()),
    collectes: v.optional(v.any()),
    campagnes: v.optional(v.any()),
    activeCampagneCode: v.optional(v.string()),
    updatedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const targetKey = args.key || "main";
    const now = Date.now();

    const existing = await ctx.db
      .query("cooperativeState")
      .withIndex("by_key", (q) => q.eq("key", targetKey))
      .first();

    const payload = {
      key: targetKey,
      users: args.users !== undefined ? args.users : existing?.users ?? [],
      membres: args.membres !== undefined ? args.membres : existing?.membres ?? [],
      config: args.config !== undefined ? args.config : existing?.config ?? {},
      interventions: args.interventions !== undefined ? args.interventions : existing?.interventions ?? [],
      elevages: args.elevages !== undefined ? args.elevages : existing?.elevages ?? [],
      parcelles: args.parcelles !== undefined ? args.parcelles : existing?.parcelles ?? [],
      terrains: args.terrains !== undefined ? args.terrains : existing?.terrains ?? [],
      collectes: args.collectes !== undefined ? args.collectes : existing?.collectes ?? [],
      campagnes: args.campagnes !== undefined ? args.campagnes : existing?.campagnes ?? [],
      activeCampagneCode: args.activeCampagneCode || existing?.activeCampagneCode || "CAMP-2026-A",
      updatedAt: now,
      updatedBy: args.updatedBy || "system",
      syncVersion: (existing?.syncVersion || 0) + 1,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
    } else {
      await ctx.db.insert("cooperativeState", payload);
    }

    // Log the synchronization event
    await ctx.db.insert("auditLogs", {
      timestamp: now,
      action: existing ? "UPDATE_STATE" : "INIT_STATE",
      entity: "cooperativeState",
      userId: args.updatedBy || "system",
      details: {
        usersCount: Array.isArray(payload.users) ? payload.users.length : 0,
        membresCount: Array.isArray(payload.membres) ? payload.membres.length : 0,
        collectesCount: Array.isArray(payload.collectes) ? payload.collectes.length : 0,
      },
    });

    return {
      success: true,
      updatedAt: now,
      syncVersion: payload.syncVersion,
      message: "Synchronisation Convex Cloud réussie",
    };
  },
});

// Health check ping query
export const ping = query({
  args: {},
  handler: async () => {
    return {
      status: "ok",
      serverTime: Date.now(),
      cloud: "Convex Cloud EU-West-1 (giant-bison-526)",
      version: "2026.1",
    };
  },
});

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

// Save or merge full state of the cooperative & sync individual tables
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

    // Synchronize individual tables if arrays were provided
    // 1. Membres
    if (Array.isArray(args.membres) && args.membres.length > 0) {
      for (const m of args.membres) {
        if (!m.id) continue;
        const found = await ctx.db
          .query("membres")
          .withIndex("by_memberId", (q) => q.eq("id", m.id))
          .first();
        const row = {
          id: m.id,
          codeMembre: m.codeMembre || m.code || m.id,
          nom: m.nom || "",
          prenom: m.prenom || "",
          genre: m.genre || "M",
          telephone: m.telephone,
          email: m.email,
          commune: m.commune || "Obala",
          ville: m.ville,
          pays: m.pays || "Cameroun",
          statut: m.statut || "Actif",
          partSociales: typeof m.partSociales === "number" ? m.partSociales : 1,
          dateAdhesion: m.dateAdhesion || "2021-01-01",
          activitePrincipale: m.activitePrincipale || "Agro-pastoral",
          domaineActivite: m.domaineActivite,
          specialite: m.specialite,
          sections: Array.isArray(m.sections) ? m.sections : [],
          detailsSpecifiques: m.detailsSpecifiques,
        };
        if (found) {
          await ctx.db.patch(found._id, row);
        } else {
          await ctx.db.insert("membres", row);
        }
      }
    }

    // 2. Users
    if (Array.isArray(args.users) && args.users.length > 0) {
      for (const u of args.users) {
        if (!u.id) continue;
        const found = await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => q.eq("id", u.id))
          .first();
        const row = {
          id: u.id,
          login: u.login || u.id,
          password: u.password,
          nom: u.nom || "",
          prenom: u.prenom || "",
          email: u.email,
          telephone: u.telephone,
          role: u.role || "cooperateur",
          fonction: u.fonction,
          dateAdhesion: u.dateAdhesion,
          statut: u.statut || "Actif",
          dernierAcces: u.dernierAcces,
          permissions: u.permissions,
        };
        if (found) {
          await ctx.db.patch(found._id, row);
        } else {
          await ctx.db.insert("users", row);
        }
      }
    }

    // 3. Collectes
    if (Array.isArray(args.collectes) && args.collectes.length > 0) {
      for (const c of args.collectes) {
        if (!c.id) continue;
        const found = await ctx.db
          .query("collectes")
          .filter((q) => q.eq(q.field("id"), c.id))
          .first();
        const row = {
          id: c.id,
          codeCollecte: c.codeCollecte || c.id,
          date: c.date || "2026-01-01",
          campagneCode: c.campagneCode || "CAMP-2026-A",
          membreId: c.membreId || "",
          produit: c.produit || "Maïs",
          variete: c.variete,
          quantite: typeof c.quantite === "number" ? c.quantite : 0,
          unite: c.unite || "kg",
          prixUnitaire: typeof c.prixUnitaire === "number" ? c.prixUnitaire : 0,
          montantTotal: typeof c.montantTotal === "number" ? c.montantTotal : 0,
          statutPaiement: c.statutPaiement || "Payé",
          lieuStockage: c.lieuStockage,
          qualite: c.qualite || "Grade A",
          tauxHumidite: c.tauxHumidite,
          numeroRecu: c.numeroRecu,
          agentCollecteur: c.agentCollecteur,
          lotTracabilite: c.lotTracabilite || c.lotTraçabilite,
        };
        if (found) {
          await ctx.db.patch(found._id, row);
        } else {
          await ctx.db.insert("collectes", row);
        }
      }
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
      message: "Synchronisation Convex Cloud et tables individuelles réussie",
    };
  },
});

// Direct queries for individual tables
export const getMembres = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("membres").collect();
  },
});

export const getCollectes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("collectes").collect();
  },
});

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
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
      version: "2026.2",
    };
  },
});

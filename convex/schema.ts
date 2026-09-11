import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Main centralized state store for seamless bidirectional sync
  cooperativeState: defineTable({
    key: v.string(), // "main"
    users: v.any(),
    membres: v.any(),
    config: v.any(),
    interventions: v.any(),
    elevages: v.any(),
    parcelles: v.any(),
    terrains: v.any(),
    collectes: v.any(),
    campagnes: v.any(),
    activeCampagneCode: v.string(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
    syncVersion: v.optional(v.number()),
  }).index("by_key", ["key"]),

  // Granular tables for direct relational querying
  users: defineTable({
    id: v.string(),
    login: v.string(),
    password: v.optional(v.string()),
    nom: v.string(),
    prenom: v.string(),
    email: v.string(),
    telephone: v.string(),
    role: v.string(),
    fonction: v.string(),
    dateAdhesion: v.string(),
    statut: v.string(),
    dernierAcces: v.string(),
    permissions: v.any(),
  }).index("by_login", ["login"]).index("by_userId", ["id"]),

  membres: defineTable({
    id: v.string(),
    codeMembre: v.string(),
    nom: v.string(),
    prenom: v.string(),
    genre: v.string(),
    telephone: v.string(),
    email: v.string(),
    commune: v.string(),
    ville: v.optional(v.string()),
    pays: v.optional(v.string()),
    statut: v.string(),
    partSociales: v.number(),
    dateAdhesion: v.string(),
    activitePrincipale: v.string(),
    domaineActivite: v.optional(v.string()),
    specialite: v.optional(v.string()),
    sections: v.array(v.string()),
    detailsSpecifiques: v.optional(v.any()),
  }).index("by_code", ["codeMembre"]).index("by_memberId", ["id"]),

  collectes: defineTable({
    id: v.string(),
    codeCollecte: v.string(),
    date: v.string(),
    campagneCode: v.string(),
    membreId: v.string(),
    produit: v.string(),
    variete: v.string(),
    quantite: v.number(),
    unite: v.string(),
    prixUnitaire: v.number(),
    montantTotal: v.number(),
    statutPaiement: v.string(),
    lieuStockage: v.string(),
    qualite: v.string(),
    tauxHumidite: v.optional(v.number()),
    numeroRecu: v.string(),
    agentCollecteur: v.string(),
  }).index("by_campagne", ["campagneCode"]).index("by_membre", ["membreId"]),

  auditLogs: defineTable({
    timestamp: v.number(),
    action: v.string(),
    entity: v.string(),
    userId: v.optional(v.string()),
    details: v.any(),
  }).index("by_timestamp", ["timestamp"]),
});

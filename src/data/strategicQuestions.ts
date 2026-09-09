// ========================================================
// COOPS CA NKUL FA — 8 Questions Stratégiques Décisionnelles
// Couplage Métier / Formules DAX / Requêtes SQL / Visuels
// ========================================================

export interface StrategicQuestion {
  id: string; // Q1 to Q8
  pillar: string;
  pillarColor: string;
  title: string;
  subtitle: string;
  businessIssue: string;
  keyMetric: {
    label: string;
    value: string;
    sublabel: string;
    target?: string;
    status: 'optimal' | 'warning' | 'critical';
  };
  daxMeasures: {
    primary: string;
    primaryFormula: string;
    secondary: string[];
  };
  sqlQuery: string;
  insight: string;
  actionPlan: string[];
  chartType: 'bar' | 'pie' | 'composed' | 'line';
  chartTitle: string;
  chartData: any[];
  auditData: {
    headers: string[];
    rows: (string | number)[][];
  };
}

export const STRATEGIC_QUESTIONS_DATA: StrategicQuestion[] = [
  // Q1 : FONCIER & CAPACITÉ D'ACCUEIL
  {
    id: 'Q1',
    pillar: 'Foncier & Empreinte Cadastrale',
    pillarColor: 'emerald',
    title: 'Quels terrains et parcelles sont actuellement exploités et quelle est notre superficie utile totale ?',
    subtitle: 'Cartographie relationnelle Terrains → Parcelles → Spéculations & Statut Foncier',
    businessIssue: 'Assurer la sécurisation juridique des terres coopératives (titres fonciers), optimiser le taux d’occupation des soles et éviter la sous-exploitation des parcelles.',
    keyMetric: {
      label: 'Superficie Totale Exploitée',
      value: '251.5 ha',
      sublabel: '5 Domaines • 18 Parcelles actives',
      target: 'Cible : 300 ha',
      status: 'optimal',
    },
    daxMeasures: {
      primary: 'Superficie Exploitée (ha) =\nSUM(D_Parcelles[Superficie_ha])',
      primaryFormula: `Superficie Exploitée (ha) =
SUM(D_Parcelles[Superficie_ha])

Nb Terrains Actifs =
CALCULATE(
    [Nb Terrains],
    D_Terrains[Actif] = "Oui"
)`,
      secondary: ['Nb Membres', 'Nb Exploitations', 'Nb Terrains', 'Nb Parcelles', 'Nb Terrains Actifs'],
    },
    sqlQuery: `-- Modèle en Étoile : D_Terrains & D_Parcelles
SELECT 
    t.code_terrain,
    t.nom AS nom_domaine,
    t.commune,
    t.statut_foncier,
    COUNT(p.id_parcelle) AS nb_parcelles,
    SUM(p.superficie_ha) AS superficie_totale_ha
FROM d_terrains t
JOIN d_parcelles p ON t.id_terrain = p.id_terrain
WHERE t.actif = 'Oui'
GROUP BY t.code_terrain, t.nom, t.commune, t.statut_foncier
ORDER BY superficie_totale_ha DESC;`,
    insight: 'Le Domaine de Bafia Mbam et celui de Sa’a représentent 61% de l’assise foncière globale. 100% des 5 domaines fonciers sont sous statut juridique vérifié (Titres fonciers collectifs ou conventions coutumières homologuées).',
    actionPlan: [
      'Finaliser le bornage cadastral des 12.0 ha en extension sur Sa’a',
      'Activer les 10 ha en jachère améliorée sur Obala Nord pour la campagne suivante',
      'Poursuivre la rotation agro-pastorale maïs/pâturage sur Bafia Mbam',
    ],
    chartType: 'bar',
    chartTitle: 'Superficie Exploitée par Domaine Foncier (Hectares)',
    chartData: [
      { name: 'Obala Nord', surfaceHa: 45.0, parcelles: 4, commune: 'Obala', color: '#059669' },
      { name: 'Mbalmayo Sud', surfaceHa: 38.5, parcelles: 3, commune: 'Mbalmayo', color: '#10b981' },
      { name: 'Ranch Sa’a', surfaceHa: 62.0, parcelles: 4, commune: 'Sa’a', color: '#34d399' },
      { name: 'Bafia Mbam', surfaceHa: 92.0, parcelles: 5, commune: 'Bafia', color: '#047857' },
      { name: 'Monatélé Ouest', surfaceHa: 14.0, parcelles: 2, commune: 'Monatélé', color: '#6ee7b7' },
    ],
    auditData: {
      headers: ['Code Parcelle', 'Domaine Foncier', 'Commune', 'Activité', 'Superficie (ha)', 'Statut Sol'],
      rows: [
        ['PARC-T001-P01', 'Obala Nord', 'Obala', 'Élevage Bovin', '15.0 ha', 'En exploitation'],
        ['PARC-T001-P02', 'Obala Nord', 'Obala', 'Élevage Porcin', '5.5 ha', 'En exploitation'],
        ['PARC-T001-P03', 'Obala Nord', 'Obala', 'Maïs & Soja', '14.5 ha', 'En exploitation'],
        ['PARC-T001-P04', 'Obala Nord', 'Obala', 'Semences Soja', '10.0 ha', 'En exploitation'],
        ['PARC-T002-P05', 'Mbalmayo Sud', 'Mbalmayo', 'Manioc & Plantain', '15.0 ha', 'En exploitation'],
        ['PARC-T002-P06', 'Mbalmayo Sud', 'Mbalmayo', 'Aviculture Chair', '4.0 ha', 'En exploitation'],
        ['PARC-T003-P13', 'Ranch Sa’a', 'Sa’a', 'Plantain & Pâturage', '28.0 ha', 'En exploitation'],
        ['PARC-T004-P18', 'Bafia Mbam', 'Bafia', 'Maïs & Céréales', '46.0 ha', 'En exploitation'],
      ],
    },
  },

  // Q2 : PRODUCTION VÉGÉTALE & RENDEMENT PARCELLE
  {
    id: 'Q2',
    pillar: 'Production Végétale & Rendement',
    pillarColor: 'sky',
    title: 'Quel est le rendement moyen par hectare et le taux de réalisation de la récolte par culture ?',
    subtitle: 'Évaluation des rendements unitaires (kg/ha) et comparaison Prévisionnel vs Réalisé',
    businessIssue: 'Contrôler la productivité des parcelles coopératives face aux aléas pluviométriques et valider l’atteinte des quotas d’approvisionnement des membres.',
    keyMetric: {
      label: 'Rendement Moyen Coopératif',
      value: '3 650 kg/ha',
      sublabel: 'Taux de réalisation : 102.8%',
      target: 'Référence région : 3 200 kg/ha',
      status: 'optimal',
    },
    daxMeasures: {
      primary: `Rendement Moyen (kg/ha) =
DIVIDE(
    [Production Totale (kg)],
    SUM(F_Production[Surface_ha])
)`,
      primaryFormula: `Rendement Moyen (kg/ha) =
DIVIDE(
    [Production Totale (kg)],
    SUM(F_Production[Surface_ha])
)

Taux Réalisation Récolte =
DIVIDE(
    [Production Récoltée Parcelles (kg)],
    [Production Prévue Parcelles (kg)]
)

Variation Production % =
DIVIDE(
    [Production Totale (kg)] - [Production N-1 (kg)],
    [Production N-1 (kg)]
)`,
      secondary: [
        'Production Totale (kg)',
        'Production Récoltée Parcelles (kg)',
        'Production Prévue Parcelles (kg)',
        'Variation Production %',
      ],
    },
    sqlQuery: `-- Modèle en Étoile : F_Production & D_Culture_Parcelle
SELECT 
    cp.culture_nom,
    SUM(cp.surface_cultivee_ha) AS surface_ha,
    SUM(cp.production_prevue_kg) AS prevue_kg,
    SUM(cp.production_recoltee_kg) AS recoltee_kg,
    ROUND((SUM(cp.production_recoltee_kg) / NULLIF(SUM(cp.surface_cultivee_ha), 0))::numeric, 0) AS rendement_kg_ha,
    ROUND((SUM(cp.production_recoltee_kg) / NULLIF(SUM(cp.production_prevue_kg), 0) * 100)::numeric, 1) AS tx_realisation_pct
FROM d_culture_parcelle cp
GROUP BY cp.culture_nom
ORDER BY recoltee_kg DESC;`,
    insight: 'La variété de maïs CMS 8704 Jaune a surperformé avec 3 800 kg/ha (+8.6% vs cible prévisionnelle). Le soja enregistre un taux de réalisation de 95.5%, pénalisé par un déficit pluviométrique court en floraison.',
    actionPlan: [
      'Généraliser l’inoculation rhizobienne sur le soja pour atteindre 2 400 kg/ha',
      'Déployer le maïs CMS 8704 sur les nouvelles soles de Bafia Mbam',
      'Sécuriser le calendrier de récolte avant les fortes pluies d’octobre',
    ],
    chartType: 'composed',
    chartTitle: 'Production Récoltée vs Prévue par Spéculation (Tonnes)',
    chartData: [
      { name: 'Maïs Grain', prevue: 215, recoltee: 220.7, rendement: 3.8, txReal: 102.6 },
      { name: 'Soja Grains', prevue: 22, recoltee: 21.0, rendement: 2.1, txReal: 95.5 },
      { name: 'Manioc', prevue: 330, recoltee: 345.0, rendement: 23.0, txReal: 104.5 },
      { name: 'Banane Plantain', prevue: 392, recoltee: 410.0, rendement: 14.6, txReal: 104.6 },
      { name: 'Tomate Maraîchère', prevue: 36, recoltee: 38.5, rendement: 19.2, txReal: 106.9 },
    ],
    auditData: {
      headers: ['Spéculation', 'Surface (ha)', 'Objectif (t)', 'Récolté (t)', 'Rendement (t/ha)', 'Taux Réalisation'],
      rows: [
        ['Maïs Grain (CMS 8704)', '60.5 ha', '215.0 t', '220.7 t', '3.65 t/ha', '102.6 %'],
        ['Soja Grains (TGX)', '10.0 ha', '22.0 t', '21.0 t', '2.10 t/ha', '95.5 %'],
        ['Manioc Tubercules (IRAD 8034)', '15.0 ha', '330.0 t', '345.0 t', '23.00 t/ha', '104.5 %'],
        ['Banane Plantain (Bâtard)', '28.0 ha', '392.0 t', '410.0 t', '14.64 t/ha', '104.6 %'],
      ],
    },
  },

  // Q3 : COLLECTE & APPROVISIONNEMENT
  {
    id: 'Q3',
    pillar: 'Collecte & Agrégation',
    pillarColor: 'amber',
    title: 'Quel volume de récolte avons-nous collecté auprès des producteurs et à quel prix d’achat moyen ?',
    subtitle: 'Suivi des bordereaux de pesée, prix payé au producteur et valorisation brute',
    businessIssue: 'Garantir une juste rémunération aux membres tout en préservant le différentiel de marge d’intermédiation de la coopérative face aux rabatteurs informels.',
    keyMetric: {
      label: 'Volume Total Collecté',
      value: '130 520 kg',
      sublabel: 'Prix Achat Moyen : 292.5 FCFA/kg',
      target: 'Montant : 38 182 000 FCFA',
      status: 'optimal',
    },
    daxMeasures: {
      primary: `Prix Achat Moyen (FCFA/kg) =
DIVIDE(
    [Montant Collecte (FCFA)],
    [Quantité Collectée (kg)]
)`,
      primaryFormula: `Prix Achat Moyen (FCFA/kg) =
DIVIDE([Montant Collecte (FCFA)], [Quantité Collectée (kg)])

Quantité Collectée (kg) =
SUM(F_Collecte[Quantite_kg])

Montant Collecte (FCFA) =
SUM(F_Collecte[Montant_FCFA])

Nb Opérations Collecte =
DISTINCTCOUNT(F_Collecte[ID_Collecte])`,
      secondary: ['Quantité Collectée (kg)', 'Montant Collecte (FCFA)', 'Nb Opérations Collecte'],
    },
    sqlQuery: `-- Modèle en Étoile : F_Collecte & D_Membres
SELECT 
    c.produit,
    c.type_produit,
    c.qualite_grade,
    COUNT(c.id_collecte) AS nb_pesées,
    SUM(c.quantite_kg) AS quantite_totale_kg,
    SUM(c.montant_fcfa) AS montant_total_fcfa,
    ROUND((SUM(c.montant_fcfa) / NULLIF(SUM(c.quantite_kg), 0))::numeric, 2) AS prix_achat_moyen_kg
FROM f_collecte c
GROUP BY c.produit, c.type_produit, c.qualite_grade
ORDER BY montant_total_fcfa DESC;`,
    insight: 'Le maïs sec représente 82% du tonnage collecté (107 tonnes) avec un prix d’achat garanti de 220 à 230 FCFA/kg, supérieur de 15 FCFA aux prix des commerçants ambulants locaux, renforçant la loyauté des adhérents.',
    actionPlan: [
      'Accélérer l’apurement des acomptes sur les bordereaux BRD-2026-0819 et BRD-2026-0828',
      'Déployer 2 balances électroniques étalonnées supplémentaires au hub de Sa’a',
      'Mettre en place un bonus qualité de +10 FCFA/kg pour le maïs à hygrométrie < 13.5%',
    ],
    chartType: 'bar',
    chartTitle: 'Montant de Collecte par Produit Agrégé (M FCFA)',
    chartData: [
      { name: 'Maïs Obala', montantM: 10.35, qteT: 45.0, prixKg: 230, fill: '#f59e0b' },
      { name: 'Maïs Bafia', montantM: 13.64, qteT: 62.0, prixKg: 220, fill: '#d97706' },
      { name: 'Soja Soa', montantM: 6.12, qteT: 18.0, prixKg: 340, fill: '#10b981' },
      { name: 'Bovins Sa’a', montantM: 5.32, qteT: 3.8, prixKg: 1400, fill: '#b45309' },
      { name: 'Poulets Mbalmayo', montantM: 2.75, qteT: 1.7, prixKg: 1600, fill: '#ec4899' },
    ],
    auditData: {
      headers: ['Bordereau', 'Coopérateur', 'Produit', 'Poids (kg)', 'Prix Unitaire', 'Montant (FCFA)', 'Statut Règlement'],
      rows: [
        ['BRD-2026-0812', 'El Hadj Ousmanou', 'Maïs Grain Séché A', '45 000 kg', '230 FCFA/kg', '10 350 000 FCFA', 'Payé 100%'],
        ['BRD-2026-0819', 'Atangana Jean-Paul', 'Soja Grains A', '18 000 kg', '340 FCFA/kg', '6 120 000 FCFA', 'Acompte versé'],
        ['BRD-2026-0824', 'Mme Mballa Chantal', 'Poulets de chair vifs', '1 720 kg', '1 600 FCFA/kg', '2 752 000 FCFA', 'Payé 100%'],
        ['BRD-2026-0828', 'Fouda Emmanuel', 'Maïs Grain Séché B', '62 000 kg', '220 FCFA/kg', '13 640 000 FCFA', 'Acompte versé'],
        ['BRD-2026-0901', 'Nkoumou Patrick', 'Bovins sur pied Goudali', '3 800 kg', '1 400 FCFA/kg', '5 320 000 FCFA', 'En attente'],
      ],
    },
  },

  // Q4 : STOCKS EN SILOS & PERTES
  {
    id: 'Q4',
    pillar: 'Logistique & Stocks',
    pillarColor: 'purple',
    title: 'Quel est le stock final disponible en silos/magasins et quel est notre taux de perte post-récolte ?',
    subtitle: 'Supervision des stocks physiques, valorisation CMP et maîtrise de la freinte',
    businessIssue: 'Éviter les ruptures sur les contrats industriels, prévenir le charançonnement du maïs et minimiser les pertes après récolte.',
    keyMetric: {
      label: 'Valeur Totale des Stocks',
      value: '393.8 M FCFA',
      sublabel: 'Stock physique : 1 465 t (Taux d’occupation 66.6%)',
      target: 'Taux perte : 1.2% (seuil < 2.5%)',
      status: 'optimal',
    },
    daxMeasures: {
      primary: `Taux Perte Stock =
DIVIDE(
    [Pertes Stock (kg)],
    SUM(F_Stocks[Stock_Initial_kg]) + SUM(F_Stocks[Entrees_kg])
)`,
      primaryFormula: `Stock Final (kg) =
SUM(F_Stocks[Stock_Final_kg])

Valeur Stock (FCFA) =
SUM(F_Stocks[Valeur_Stock_FCFA])

Pertes Stock (kg) =
SUM(F_Stocks[Pertes_kg])

Taux Perte Stock =
DIVIDE([Pertes Stock (kg)], SUM(F_Stocks[Stock_Initial_kg]) + SUM(F_Stocks[Entrees_kg]))`,
      secondary: ['Stock Final (kg)', 'Valeur Stock (FCFA)', 'Pertes Stock (kg)'],
    },
    sqlQuery: `-- Modèle en Étoile : F_Stocks & D_Magasins
SELECT 
    m.nom AS magasin_nom,
    m.commune,
    m.capacite_max_tonnes,
    SUM(s.stock_final_kg) / 1000.0 AS stock_actuel_tonnes,
    ROUND((SUM(s.stock_final_kg) / 1000.0 / NULLIF(m.capacite_max_tonnes, 0) * 100)::numeric, 1) AS tx_occupation_pct,
    SUM(s.valeur_stock_fcfa) AS valeur_totale_fcfa,
    SUM(s.pertes_kg) AS pertes_totales_kg
FROM f_stocks s
JOIN d_magasins m ON s.id_magasin = m.id_magasin
GROUP BY m.nom, m.commune, m.capacite_max_tonnes
ORDER BY valeur_totale_fcfa DESC;`,
    insight: 'Le Hub Régional de Yaoundé Nsam concentre 55% de la valeur stockée (218.4 M FCFA). Le taux de perte est stabilisé à 1.2%, très inférieur au seuil de vigilance fixé à 2.5%, grâce au traitement au phosphure d’aluminium.',
    actionPlan: [
      'Réapprovisionner les sacs d’engrais NPK 20-10-10 au magasin de Yaoundé (seuil critique)',
      'Déstocker 45 tonnes de provende porcine à Obala avant fin septembre',
      'Contrôler la température des cellules de stockage 2 fois par semaine',
    ],
    chartType: 'pie',
    chartTitle: 'Répartition de la Valeur des Stocks par Magasin (FCFA)',
    chartData: [
      { name: 'Hub Yaoundé Nsam', value: 218400000, tonnes: 840, occupation: '70%', color: '#8b5cf6' },
      { name: 'Silo Avancé Obala', value: 106600000, tonnes: 410, occupation: '68.3%', color: '#a855f7' },
      { name: 'Chambre Froide Mbalmayo', value: 68800000, tonnes: 215, occupation: '53.8%', color: '#c084fc' },
    ],
    auditData: {
      headers: ['Site de Stockage', 'Localisation', 'Capacité Max', 'Stock Actuel', 'Occupation %', 'Valeur Actif'],
      rows: [
        ['Hub Central Nsam', 'Yaoundé III', '1 200 t', '840 t', '70.0 %', '218 400 000 FCFA'],
        ['Silo Avancé Obala', 'Obala', '600 t', '410 t', '68.3 %', '106 600 000 FCFA'],
        ['Entrepôt & Froid Mbalmayo', 'Mbalmayo', '400 t', '215 t', '53.8 %', '68 800 000 FCFA'],
      ],
    },
  },

  // Q5 : PERFORMANCE COMMERCIALE & VALORISATION VENTES
  {
    id: 'Q5',
    pillar: 'Commercialisation & Ventes',
    pillarColor: 'rose',
    title: 'Quel chiffre d’affaires avons-nous réalisé sur les ventes et quel est notre prix moyen de vente ?',
    subtitle: 'Ventilation du CA par segment de clientèle, volume écoulé et spread d’intermédiation',
    businessIssue: 'Maximiser la valeur ajoutée captée par la coopérative via des contrats fermes B2B et éviter la volatilité des cours du marché informel.',
    keyMetric: {
      label: 'Chiffre d’Affaires Ventes',
      value: '83 550 000 FCFA',
      sublabel: 'Quantité Vendue : 221.5 tonnes',
      target: 'Prix Vente Moyen : 377.2 FCFA/kg',
      status: 'optimal',
    },
    daxMeasures: {
      primary: `Prix Vente Moyen (FCFA/kg) =
DIVIDE(
    [CA Ventes (FCFA)],
    [Quantité Vendue (kg)]
)`,
      primaryFormula: `CA Ventes (FCFA) =
SUM(F_Ventes[Montant_FCFA])

Quantité Vendue (kg) =
SUM(F_Ventes[Quantite_kg])

Prix Vente Moyen (FCFA/kg) =
DIVIDE([CA Ventes (FCFA)], [Quantité Vendue (kg)])

Nb Ventes =
DISTINCTCOUNT(F_Ventes[ID_Vente])`,
      secondary: ['CA Ventes (FCFA)', 'Quantité Vendue (kg)', 'Nb Ventes'],
    },
    sqlQuery: `-- Modèle en Étoile : F_Ventes & D_Clients
SELECT 
    v.type_client,
    COUNT(v.id_vente) AS nb_commandes,
    SUM(v.quantite_kg) AS volume_vendu_kg,
    SUM(v.montant_fcfa) AS ca_total_fcfa,
    ROUND((SUM(v.montant_fcfa) / NULLIF(SUM(v.quantite_kg), 0))::numeric, 2) AS prix_moyen_vente_kg
FROM f_ventes v
GROUP BY v.type_client
ORDER BY ca_total_fcfa DESC;`,
    insight: 'Le contrat industriel brasserie (150 t de maïs à 260 FCFA/kg = 39 M FCFA) et les réseaux supermarchés (farine emballée + poulets = 16.5 M FCFA) ont généré une marge commerciale brute de +84.7 FCFA/kg par rapport au prix d’achat aux producteurs.',
    actionPlan: [
      'Valider la commande CMD-YDE-2026-0125 de 40 t de soja pour transformation locale',
      'Livrer le reliquat traiteur Mont-Fébé (carcasses porcines et tilapias)',
      'Négocier le contrat cadre 2027 avec la minoterie de Douala',
    ],
    chartType: 'bar',
    chartTitle: 'Chiffre d’Affaires par Segment de Clientèle (M FCFA)',
    chartData: [
      { name: 'Industries Agro (Maïs)', caM: 39.0, volumeT: 150, prixKg: 260, fill: '#e11d48' },
      { name: 'Grossistes & Supermarchés', caM: 31.7, volumeT: 65, prixKg: 487, fill: '#f43f5e' },
      { name: 'Hôtels & Restauration', caM: 12.85, volumeT: 6.5, prixKg: 1976, fill: '#fb7185' },
    ],
    auditData: {
      headers: ['N° Commande', 'Client Partenaire', 'Type Segment', 'Volume Livré', 'Montant Total', 'Statut Facture'],
      rows: [
        ['CMD-YDE-2026-0104', 'Brasseries & Minoteries Cameroun', 'Industrie Agro', '150 tonnes', '39 000 000 FCFA', 'Livré & Réglé'],
        ['CMD-YDE-2026-0112', 'Supermarchés Mahima Yaoundé', 'Grossiste / Retail', '25 tonnes', '16 500 000 FCFA', 'Livré & Réglé'],
        ['CMD-DLA-2026-0118', 'Complexe Hôtelier Mont-Fébé', 'CHR Luxe', '6.5 tonnes', '12 850 000 FCFA', 'En préparation'],
        ['CMD-YDE-2026-0125', 'Alimentation Centrale Mfoundi', 'Grossiste', '40 tonnes', '15 200 000 FCFA', 'En attente'],
      ],
    },
  },

  // Q6 : RÉSULTAT FINANCIER & MARGE NETTE
  {
    id: 'Q6',
    pillar: 'Finances & Rentabilité',
    pillarColor: 'emerald',
    title: 'Quelle est la rentabilité nette de nos activités et le taux de couverture des dépenses par les recettes ?',
    subtitle: 'Équilibre bilantiel, résultat d’exploitation et capacité d’autofinancement',
    businessIssue: 'Assurer la solvabilité financière de la coopérative, dégager un excédent net pour les investissements et sécuriser les fonds de roulement.',
    keyMetric: {
      label: 'Résultat Financier Net',
      value: '+43 200 000 FCFA',
      sublabel: 'Taux de Couverture : 169.2%',
      target: 'Recettes : 105.6 M • Dépenses : 62.4 M',
      status: 'optimal',
    },
    daxMeasures: {
      primary: `Résultat Financier (FCFA) =
[Recettes (FCFA)] - [Dépenses (FCFA)]`,
      primaryFormula: `Recettes (FCFA) =
CALCULATE(
    SUM(F_Finances[Montant_FCFA]),
    F_Finances[Type_Mouvement] = "Recette"
)

Dépenses (FCFA) =
CALCULATE(
    SUM(F_Finances[Montant_FCFA]),
    F_Finances[Type_Mouvement] = "Dépense"
)

Résultat Financier (FCFA) =
[Recettes (FCFA)] - [Dépenses (FCFA)]

Taux Couverture =
DIVIDE([Recettes (FCFA)], [Dépenses (FCFA)])`,
      secondary: ['Recettes (FCFA)', 'Dépenses (FCFA)', 'Taux Couverture', 'Taux Marge Production'],
    },
    sqlQuery: `-- Modèle en Étoile : F_Finances (Comptabilité Analytique)
SELECT 
    SUM(CASE WHEN f.type_mouvement = 'Recette' THEN f.montant_fcfa ELSE 0 END) AS total_recettes_fcfa,
    SUM(CASE WHEN f.type_mouvement = 'Dépense' THEN f.montant_fcfa ELSE 0 END) AS total_depenses_fcfa,
    SUM(CASE WHEN f.type_mouvement = 'Recette' THEN f.montant_fcfa ELSE -f.montant_fcfa END) AS resultat_net_fcfa,
    ROUND((SUM(CASE WHEN f.type_mouvement = 'Recette' THEN f.montant_fcfa ELSE 0 END) / 
           NULLIF(SUM(CASE WHEN f.type_mouvement = 'Dépense' THEN f.montant_fcfa ELSE 0 END), 0) * 100)::numeric, 1) AS tx_couverture_pct
FROM f_finances f;`,
    insight: 'Le taux de couverture de 169.2% atteste d’une excellente santé financière. Les excédents dégagés (+43.2 M FCFA) permettent d’abonder la réserve statutaire et de provisionner 8.5% pour la ristourne annuelle aux coopérateurs.',
    actionPlan: [
      'Affecter 15 M FCFA au fonds de roulement d’achat de la petite campagne B',
      'Allouer 10 M FCFA aux travaux d’aménagement hydraulique sur Sa’a',
      'Clôturer les comptes analytiques semestriels pour le Conseil d’Administration',
    ],
    chartType: 'bar',
    chartTitle: 'Comparatif Recettes vs Dépenses par Campagne Clé (M FCFA)',
    chartData: [
      { name: 'Campagne Céréales 2026-A', recettes: 105.6, depenses: 62.4, marge: 43.2 },
      { name: 'Bande Avicole Chair N°4', recettes: 14.55, depenses: 9.5, marge: 5.05 },
      { name: 'Embouche Bovine Obala', recettes: 19.8, depenses: 8.6, marge: 11.2 },
      { name: 'Porciculture S2', recettes: 11.05, depenses: 4.9, marge: 6.15 },
    ],
    auditData: {
      headers: ['Pôle d’Activité', 'Recettes Constatées', 'Dépenses Engagées', 'Résultat Net', 'Taux de Marge'],
      rows: [
        ['Grande Saison Céréales 2026-A', '105 600 000 FCFA', '62 400 000 FCFA', '+43 200 000 FCFA', '40.9 %'],
        ['Aviculture Chair (Bande 4)', '14 550 000 FCFA', '9 500 000 FCFA', '+5 050 000 FCFA', '34.7 %'],
        ['Embouche Bovine Goudali', '19 800 000 FCFA', '8 600 000 FCFA', '+11 200 000 FCFA', '56.6 %'],
        ['Porciculture Large White S2', '11 050 000 FCFA', '4 900 000 FCFA', '+6 150 000 FCFA', '55.7 %'],
      ],
    },
  },

  // Q7 : ZOOTECHNIE, SURVIE & CROISSANCE CHEPTEL
  {
    id: 'Q7',
    pillar: 'Zootechnie & Cheptel',
    pillarColor: 'amber',
    title: 'Quel est l’effectif vivant de notre cheptel et notre taux de survie / mortalité en élevage ?',
    subtitle: 'Inventaire zootechnique, dynamique démographique et maîtrise du gaspillage alimentaire',
    businessIssue: 'Suivre l’évolution du cheptel biologique actif, maintenir le taux de mortalité sous le seuil d’alerte (3.5%) et rentabiliser la ration alimentaire.',
    keyMetric: {
      label: 'Cheptel Biologique Vivant',
      value: '982 têtes/sujets',
      sublabel: 'Taux de Survie : 94.4%',
      target: 'Taux Gaspillage Aliment : 3.0%',
      status: 'optimal',
    },
    daxMeasures: {
      primary: `Taux Survie =
1 - [Taux Mortalité]`,
      primaryFormula: `Effectif Actuel =
SUM(D_Lot_Elevage[Effectif_Actuel])

Taux Mortalité =
DIVIDE([Mortalités], [Effectif Initial] + [Naissances])

Taux Survie =
1 - [Taux Mortalité]

Taux Gaspillage Aliment =
DIVIDE(
    [Gaspillage Aliment (kg)],
    [Quantité Aliment Distribuée (kg)]
)`,
      secondary: ['Effectif Initial', 'Naissances', 'Mortalités', 'Effectif Actuel', 'Taux Mortalité', 'Taux Gaspillage Aliment'],
    },
    sqlQuery: `-- Modèle en Étoile : D_Lot_Elevage & F_Alimentation_Elevage
SELECT 
    l.espece_nom,
    l.race_nom,
    SUM(l.effectif_initial) AS effectif_initial,
    SUM(l.naissances) AS total_naissances,
    SUM(l.mortalites) AS total_mortalites,
    SUM(l.effectif_actuel) AS effectif_actuel,
    ROUND((SUM(l.mortalites)::numeric / NULLIF(SUM(l.effectif_initial + l.naissances), 0) * 100)::numeric, 2) AS tx_mortalite_pct,
    ROUND((100 - (SUM(l.mortalites)::numeric / NULLIF(SUM(l.effectif_initial + l.naissances), 0) * 100))::numeric, 2) AS tx_survie_pct
FROM d_lot_elevage l
GROUP BY l.espece_nom, l.race_nom
ORDER BY effectif_actuel DESC;`,
    insight: 'Le taux de survie global est de 94.4%. Sur les filières bovines et caprines, la mortalité est quasi nulle (< 2.8%). En aviculture chair, les 50 pertes sur 900 sujets (5.5%) correspondent aux standards industriels sur poussins d’un jour.',
    actionPlan: [
      'Installer des mangeoires anti-gaspillage sur le lot porcin Large White pour réduire les pertes de provende',
      'Surveiller le Gain Moyen Quotidien (GMQ) des porcs (+680 g/jour actuel)',
      'Préparer le vide sanitaire des poulaillers de Mbalmayo avant la bande N°5',
    ],
    chartType: 'bar',
    chartTitle: 'Effectif Actuel et Pertes par Filière Zootechnique (Têtes / Sujets)',
    chartData: [
      { name: 'Volailles Cobb 500', actuel: 850, pertes: 50, naissances: 0, color: '#f59e0b' },
      { name: 'Porcins Large White', actuel: 48, pertes: 4, naissances: 12, color: '#ec4899' },
      { name: 'Bovins Goudali', actuel: 35, pertes: 1, naissances: 4, color: '#b45309' },
      { name: 'Caprins Naine Guinée', actuel: 28, pertes: 1, naissances: 6, color: '#10b981' },
      { name: 'Ovins Djallonké', actuel: 21, pertes: 2, naissances: 4, color: '#06b6d4' },
    ],
    auditData: {
      headers: ['Lot Élevage', 'Espèce & Race', 'Site Parcelle', 'Effectif Initial', 'Naissances', 'Mortalités', 'Actuel'],
      rows: [
        ['LOT-BOV-01', 'Bovins Goudali', 'Obala P01', 32, 4, 1, 35],
        ['LOT-PORC-02', 'Porcins Large White', 'Obala P02', 40, 12, 4, 48],
        ['LOT-AVIC-03', 'Volailles Cobb 500', 'Mbalmayo P06', 900, 0, 50, 850],
        ['LOT-CAPR-04', 'Caprins Naine Guinée', 'Sa’a P13', 23, 6, 1, 28],
        ['LOT-OVIN-05', 'Ovins Djallonké', 'Bafia P18', 19, 4, 2, 21],
      ],
    },
  },

  // Q8 : SANTÉ ANIMALE & PROPHYLAXIE
  {
    id: 'Q8',
    pillar: 'Santé Animale & Prophylaxie',
    pillarColor: 'rose',
    title: 'Quels sont les coûts de santé animale engagés et quels élevages présentent des retards vaccinaux ?',
    subtitle: 'Surveillance des protocoles prophylactiques, calendrier de rappel et alertes épidémiques',
    businessIssue: 'Prévenir toute contamination collective (PPA, dermatose nodulaire, Newcastle) et assurer la conformité sanitaire des viandes commercialisées.',
    keyMetric: {
      label: 'Budget Santé Animale',
      value: '1 240 000 FCFA',
      sublabel: '14 Suivis • 12 Interventions',
      target: '1 Alerte rappel vaccinal active',
      status: 'warning',
    },
    daxMeasures: {
      primary: `Nb Interventions Sanitaires =
CALCULATE(
    [Nb Suivis Santé],
    F_Sante_Animale[Type_Intervention] <> BLANK()
)`,
      primaryFormula: `Nb Suivis Santé =
DISTINCTCOUNT(F_Sante_Animale[ID_Suivi_Sante])

Nb Interventions Sanitaires =
CALCULATE(
    [Nb Suivis Santé],
    F_Sante_Animale[Type_Intervention] <> BLANK()
)

Coût Santé (FCFA) =
SUM(F_Sante_Animale[Cout_FCFA])`,
      secondary: ['Nb Suivis Santé', 'Nb Interventions Sanitaires', 'Coût Santé (FCFA)', 'Femelles Concernées'],
    },
    sqlQuery: `-- Modèle en Étoile : F_Sante_Animale & D_Lot_Elevage
SELECT 
    s.type_intervention,
    COUNT(s.id_suivi_sante) AS nb_actes,
    SUM(s.cout_fcfa) AS cout_total_fcfa,
    ROUND(AVG(s.cout_fcfa)::numeric, 0) AS cout_moyen_acte_fcfa
FROM f_sante_animale s
GROUP BY s.type_intervention
ORDER BY cout_total_fcfa DESC;`,
    insight: 'Le lot de porcs Large White sur la parcelle T001-P02 (Obala) accuse un retard sur son rappel vaccinal Rouget/PPA prévu le 12/09/2026. L’intervention du Dr Etoundi est ordonnancée sous 48h.',
    actionPlan: [
      'Réaliser immédiatement le rappel vaccinal Rouget sur le lot LOT-PORC-02',
      'Maintenir le sas de désinfection renforcé à l’entrée du domaine Obala',
      'Programmer la campagne de déparasitage interne des petits ruminants à Sa’a',
    ],
    chartType: 'pie',
    chartTitle: 'Répartition des Coûts Vétérinaires par Type d’Intervention (FCFA)',
    chartData: [
      { name: 'Vaccinations & Prophylaxie', value: 520000, color: '#10b981' },
      { name: 'Déparasitages internes/externes', value: 380000, color: '#06b6d4' },
      { name: 'Soins curatifs & Antibiotiques', value: 240000, color: '#f59e0b' },
      { name: 'Visites de contrôle sanitaire', value: 100000, color: '#8b5cf6' },
    ],
    auditData: {
      headers: ['Lot / Élevage', 'Espèce', 'Terrain & Parcelle', 'Protocole Vaccinal', 'Dernier Traitement', 'Statut Alerte'],
      rows: [
        ['LOT-BOV-01', 'Bovins Goudali', 'Obala T001-P01', 'PPCB & Charbon bactéridien', '15/04/2026', 'À jour (Prochain : 15/10/2026)'],
        ['LOT-PORC-02', 'Porcins Large White', 'Obala T001-P02', 'Rouget & Parvovirose', '10/06/2026', 'RETARD (Échéance 12/09/2026)'],
        ['LOT-AVIC-03', 'Volailles Cobb 500', 'Mbalmayo T002-P06', 'Gumboro & Newcastle', '25/07/2026', 'À jour (Prochain : 25/09/2026)'],
        ['LOT-CAPR-04', 'Caprins Naine Guinée', 'Sa’a T003-P13', 'Peste Petits Ruminants (PPR)', '05/05/2026', 'À jour (Prochain : 05/11/2026)'],
        ['LOT-OVIN-05', 'Ovins Djallonké', 'Bafia T004-P18', 'PPR & Déparasitage', '12/05/2026', 'À jour (Prochain : 12/11/2026)'],
      ],
    },
  },
];

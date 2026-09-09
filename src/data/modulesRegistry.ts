import { ModulePermission, NavigationTab, UserRole, AppUser, CrudPermissions } from '../types';

export interface ModuleDefinition {
  key: NavigationTab;
  nom: string;
  category: 'direction' | 'vegetal' | 'animal' | 'logistique' | 'finance' | 'systeme';
  description: string;
  subModules: {
    key: string;
    nom: string;
    description: string;
  }[];
}

export const MODULES_REGISTRY: ModuleDefinition[] = [
  {
    key: 'accueil',
    nom: 'Tableau de bord Direction',
    category: 'direction',
    description: 'Vue globale, synthèse des performances, alertes stratégiques et KPI de campagne',
    subModules: [
      { key: 'vue_globale', nom: 'Vue Globale & Indicateurs Clés', description: 'Chiffre d’affaires, effectif cheptel, superficies exploitées' },
      { key: 'alertes_urgences', nom: 'Alertes & Risques Prioritaires', description: 'Alertes sanitaires, ruptures d’intrants et dépassements' },
      { key: 'repartition_activite', nom: 'Synthèse Pôles Végétal & Animal', description: 'Répartition des marges brutes et productivité' },
    ],
  },
  {
    key: 'campagnes',
    nom: 'Campagnes & Saisons',
    category: 'direction',
    description: 'Cycle des campagnes agricoles, calendrier spatio-temporel et clôture formelle',
    subModules: [
      { key: 'liste_campagnes', nom: 'Gestion & Statuts des Campagnes', description: 'Création, suivi actif et archives de campagnes' },
      { key: 'gantt_calendrier', nom: 'Calendrier & Enchevêtrement', description: 'Chronogramme des semis, récoltes et cycles pastoraux' },
      { key: 'cloture_bilan', nom: 'Bilan Formel & Clôture', description: 'Arrêté des comptes, validation DG et passation' },
    ],
  },
  {
    key: 'terrains_parcelles',
    nom: 'Terrains & Parcelles',
    category: 'vegetal',
    description: 'Cadastre, découpage des parcelles, polyculture cohabitante et règle anti-dépassement',
    subModules: [
      { key: 'parcelles_cohabitation', nom: 'Parcelles & Polyculture Cohabitante', description: 'Affectation des cultures cohabitantes et élevage pastoral' },
      { key: 'cadastre_terrains', nom: 'Cadastre des Terrains Agricoles', description: 'Délimitation GPS, superficies totales et statuts fonciers' },
      { key: 'bilan_anti_depassement', nom: 'Bilan Foncier & Règle Anti-Dépassement', description: 'Contrôle en temps réel des superficies résiduelles (>= 0 ha)' },
    ],
  },
  {
    key: 'agriculture',
    nom: 'Agriculture & Production Végétale',
    category: 'vegetal',
    description: 'Objectifs de production, rendements à l’hectare, besoins en intrants et marges',
    subModules: [
      { key: 'objectifs_campagne', nom: 'Objectifs & Prévisions de Rendement', description: 'Quotas de récolte par culture et zone' },
      { key: 'gestion_intrants', nom: 'Besoins en Semences & Fertilisants', description: 'Dosages recommandés et allocation par parcelle' },
      { key: 'rendements_marges', nom: 'Analyse des Rendements & Marges Brutes', description: 'Performances t/ha et rentabilité par hectare' },
    ],
  },
  {
    key: 'suivi_cultural',
    nom: 'Suivi Cultural & Travaux aux Champs',
    category: 'vegetal',
    description: 'Stades phénologiques, cahier d’interventions culturales et météo locale',
    subModules: [
      { key: 'stades_phenologiques', nom: 'Stades Phénologiques & Notation', description: 'Suivi levée, floraison, maturité et sénescence' },
      { key: 'cahier_interventions', nom: 'Cahier des Travaux & Traitements', description: 'Sarclage, buttage, fertilisation et traitements phytosanitaires' },
      { key: 'suivi_meteo', nom: 'Météorologie & Alertes Pluviométriques', description: 'Relevés de précipitations et prévisions de travail' },
    ],
  },
  {
    key: 'elevage',
    nom: 'Élevage & Cheptel Pastoral',
    category: 'animal',
    description: 'Gestion des lots d’animaux, races rustiques, fiches zootechniques et parcours',
    subModules: [
      { key: 'lots_cheptel', nom: 'Lots d’Animaux & Répartition', description: 'Effectifs par parcelle/bâtiment, race et sexe' },
      { key: 'races_performances', nom: 'Fiches Races & Paramètres Zootechniques', description: 'Goudali, Large White, Goliath, Djallonké' },
      { key: 'parcours_paturage', nom: 'Parcours Herbagers & Rotation Pâturage', description: 'Charge pastorale et temps de repos des prairies' },
    ],
  },
  {
    key: 'sante_animale',
    nom: 'Santé Animale & Vétérinaire',
    category: 'animal',
    description: 'Traitements curatifs, protocoles vaccinaux officiels et biosécurité',
    subModules: [
      { key: 'registre_traitements', nom: 'Registre des Soins & Ordonnances', description: 'Actes vétérinaires, posologies et délais d’attente' },
      { key: 'campagnes_vaccinales', nom: 'Protocoles Vaccinaux & Biosécurité', description: 'Newcastle, Gumboro, PPR, Péripneumonie' },
      { key: 'surveillance_mortalite', nom: 'Surveillance Épidémiologique & Mortalité', description: 'Seuils d’alerte et rapports de nécropsie' },
    ],
  },
  {
    key: 'alimentation',
    nom: 'Alimentation & Suivi GMQ',
    category: 'animal',
    description: 'Rations alimentaires, pesées périodiques et suivi de la croissance pondérale',
    subModules: [
      { key: 'rations_fourrages', nom: 'Formules Alimentaires & Rations', description: 'Calcul des rations équilibrées (UFL/PDI) par stade' },
      { key: 'pesages_gmq', nom: 'Pesages Périodiques & Courbes GMQ', description: 'Gain Moyen Quotidien et indice de consommation' },
      { key: 'stocks_aliments', nom: 'Consommations d’Aliments & Silos', description: 'Gestion des tourteaux, provendes et compléments minéraux' },
    ],
  },
  {
    key: 'reproduction',
    nom: 'Reproduction & Généalogie',
    category: 'animal',
    description: 'Saillies, inséminations artificielles, mises-bas et gestion des lignées',
    subModules: [
      { key: 'saillies_inseminations', nom: 'Planning des Saillies & IA', description: 'Enregistrement des accouplements et monte naturelle' },
      { key: 'gestations_mises_bas', nom: 'Diagnostics de Gestation & Mises-Bas', description: 'Palpation, échographies et suivi des naissances' },
      { key: 'sevrage_genetique', nom: 'Allaitement, Sevrage & Généalogie', description: 'Poids au sevrage et préservation des lignées' },
    ],
  },
  {
    key: 'collecte',
    nom: 'Collecte & Logistique Rurale',
    category: 'logistique',
    description: 'Tournées de ramassage, pesée publique sur pont-bascule et bordereaux',
    subModules: [
      { key: 'tournees_collecte', nom: 'Tournées de Collecte en Brousse', description: 'Planification des camions et points de ramassage' },
      { key: 'pesee_publique', nom: 'Pesée Publique & Bordereaux', description: 'Émission des tickets de pesée certifiés' },
      { key: 'reception_quai', nom: 'Réception Quai & Contrôle Humidité', description: 'Agrément qualitatif (taux d’humidité < 14%)' },
    ],
  },
  {
    key: 'stocks',
    nom: 'Stocks, Silos & Magasins',
    category: 'logistique',
    description: 'Gestion des silos centraux, magasins de stockage et inventaires physiques',
    subModules: [
      { key: 'silos_magasins', nom: 'Silos Centraux & Magasins Régionaux', description: 'Capacités de stockage (Yaoundé, Obala, Mbalmayo)' },
      { key: 'mouvements_stock', nom: 'Mouvements & Traçabilité des Lots', description: 'Entrées, transferts inter-dépôts et sorties' },
      { key: 'inventaires_pertes', nom: 'Inventaires Physiques & Pertes', description: 'Rapprochements physiques et déclaration des pertes' },
    ],
  },
  {
    key: 'commercialisation',
    nom: 'Commercialisation & Ventes',
    category: 'finance',
    description: 'Contrats clients, expéditions, bordereaux de livraison et facturation',
    subModules: [
      { key: 'contrats_clients', nom: 'Contrats & Commandes Fermes', description: 'Accords-cadres avec industriels, minoteries et grossistes' },
      { key: 'expeditions_livraisons', nom: 'Bons de Livraison & Expéditions', description: 'Organisation des départs fret et expéditions' },
      { key: 'facturation_produits', nom: 'Facturation & Règlements Clients', description: 'Émission de factures commerciales et suivi encaissements' },
    ],
  },
  {
    key: 'finances',
    nom: 'Finances & Rémunération OHADA',
    category: 'finance',
    description: 'Paiements des producteurs (règle RG-010), trésorerie, caisse et bilans',
    subModules: [
      { key: 'remuneration_membres', nom: 'Rémunération des Membres (RG-010)', description: 'Validation des décomptes et acomptes coopérateurs' },
      { key: 'tresorerie_banque', nom: 'Trésorerie, Banques & Caisse Centrale', description: 'Soldes disponibles, rapprochements et flux nets' },
      { key: 'journal_depenses', nom: 'Journal des Charges & Bilan Comptable', description: 'Enregistrement des dépenses opérationnelles et investissements' },
    ],
  },
  {
    key: 'membres',
    nom: 'Membres & Exploitations',
    category: 'finance',
    description: 'Registre des adhérents, parts sociales, cotisations et parcelles affiliées',
    subModules: [
      { key: 'registre_membres', nom: 'Registre Officiel des Adhérents', description: 'Fiches signalétiques des coopérateurs et statuts' },
      { key: 'parts_sociales', nom: 'Parts Sociales & Droits d’Adhésion', description: 'Souscriptions au capital et dividendes coopératifs' },
      { key: 'fiches_exploitations', nom: 'Fiches Exploitations & Parcelles Affiliées', description: 'Superficies déclarées et historique des livraisons' },
    ],
  },
  {
    key: 'kpi_analyses',
    nom: 'Analyses BI & Décisions Stratégiques',
    category: 'direction',
    description: 'Moteur de calcul décisionnel DAX/SQL et réponses aux 8 questions clés',
    subModules: [
      { key: 'tableau_bord_bi', nom: 'Tableaux de Bord Analytiques', description: 'Visualisations graphiques croisées et tendances pluriannuelles' },
      { key: 'questions_cles', nom: 'Moteur des 8 Questions Stratégiques', description: 'Rentabilité par spéculation, ratios zootechniques' },
      { key: 'export_rapports', nom: 'Générateur de Rapports & Synthèses', description: 'Extraction PDF/Excel certifiée pour assemblée générale' },
    ],
  },
  {
    key: 'parametres',
    nom: 'Paramètres & Configuration Système',
    category: 'systeme',
    description: 'Gestion des utilisateurs, droits RBAC / CRUD granulaires, identité coopérative et sauvegarde',
    subModules: [
      { key: 'identite_cooperative', nom: 'Fiche d’Identité & Gouvernance OHADA', description: 'Statuts coopératifs, agréments MINADER et Conseil' },
      { key: 'comptes_utilisateurs', nom: 'Utilisateurs & Matrice Granulaire RBAC / CRUD', description: 'Droits fins par module, sous-module et verbes CRUD' },
      { key: 'referentiels_metier', nom: 'Nomenclatures Espèces, Races & Protocoles', description: 'Catalogue des cultures homologuées et protocoles sanitaires' },
      { key: 'seuils_biosecurite', nom: 'Seuils d’Alerte & Biosécurité', description: 'Paramétrage des alertes mortalité, stocks min et météo' },
      { key: 'sauvegarde_donnees', nom: 'Sauvegarde, Import/Export & Maintenance', description: 'Export JSON, réinitialisation et journal d’audit' },
    ],
  },
  {
    key: 'workflow',
    nom: 'Guide d’Utilisation & Workflow',
    category: 'direction',
    description: 'Cycle en 7 étapes, parcours métier par profil et règles de gestion RG-001 à RG-010',
    subModules: [
      { key: 'cycle_sept_etapes', nom: 'Cycle Opérationnel en 7 Étapes', description: 'De la préparation foncière à la clôture de campagne' },
      { key: 'parcours_roles', nom: 'Parcours Métier Spécifiques', description: 'Guides d’utilisation par fonction (DG, Agro, Véto, Trésorier)' },
      { key: 'regles_gestion', nom: 'Règles de Gestion (RG-001 à RG-010)', description: 'Documentation des règles anti-dépassement et conformité' },
    ],
  },
];

/**
 * Builds a blank module permissions map where all permissions are set to false.
 */
export const buildBlankModulePermissions = (): Record<string, ModulePermission> => {
  const result: Record<string, ModulePermission> = {};
  MODULES_REGISTRY.forEach((mod) => {
    const subModules: Record<string, any> = {};
    mod.subModules.forEach((sm) => {
      subModules[sm.key] = {
        key: sm.key,
        nom: sm.nom,
        description: sm.description,
        hasAccess: false,
        crud: { create: false, read: false, update: false, delete: false },
      };
    });

    result[mod.key] = {
      key: mod.key,
      nom: mod.nom,
      category: mod.category,
      description: mod.description,
      hasAccess: false,
      crud: { create: false, read: false, update: false, delete: false },
      subModules,
    };
  });
  return result;
};

/**
 * Builds a complete access module permissions map (all modules + all sub-modules + all CRUD = true).
 */
export const buildFullAccessModulePermissions = (): Record<string, ModulePermission> => {
  const result: Record<string, ModulePermission> = {};
  MODULES_REGISTRY.forEach((mod) => {
    const subModules: Record<string, any> = {};
    mod.subModules.forEach((sm) => {
      subModules[sm.key] = {
        key: sm.key,
        nom: sm.nom,
        description: sm.description,
        hasAccess: true,
        crud: { create: true, read: true, update: true, delete: true },
      };
    });

    result[mod.key] = {
      key: mod.key,
      nom: mod.nom,
      category: mod.category,
      description: mod.description,
      hasAccess: true,
      crud: { create: true, read: true, update: true, delete: true },
      subModules,
    };
  });
  return result;
};

/**
 * Generates realistic, tailored permissions according to role presets.
 */
export const getDefaultPermissionsForRole = (role: UserRole): Record<string, ModulePermission> => {
  const perms = buildBlankModulePermissions();

  const grant = (
    moduleKey: NavigationTab,
    crud: { c?: boolean; r?: boolean; u?: boolean; d?: boolean },
    subModuleKeys?: string[]
  ) => {
    if (!perms[moduleKey]) return;
    const mod = perms[moduleKey];
    mod.hasAccess = true;
    mod.crud = {
      create: !!crud.c,
      read: crud.r ?? true,
      update: !!crud.u,
      delete: !!crud.d,
    };

    const targetSubKeys = subModuleKeys || Object.keys(mod.subModules);
    targetSubKeys.forEach((subKey) => {
      if (mod.subModules[subKey]) {
        mod.subModules[subKey].hasAccess = true;
        mod.subModules[subKey].crud = {
          create: !!crud.c,
          read: crud.r ?? true,
          update: !!crud.u,
          delete: !!crud.d,
        };
      }
    });
  };

  switch (role) {
    case 'super_admin':
    case 'direction':
      return buildFullAccessModulePermissions();

    case 'responsable_agricole':
      // Direction dashboards & guide
      grant('accueil', { r: true });
      grant('workflow', { r: true });
      grant('campagnes', { r: true, u: true });
      // Agronomy & Terrains: FULL CRUD
      grant('terrains_parcelles', { c: true, r: true, u: true, d: true });
      grant('agriculture', { c: true, r: true, u: true, d: true });
      grant('suivi_cultural', { c: true, r: true, u: true, d: true });
      // Supply chain: Read & Create on collecte (bordereaux de pesée végétale)
      grant('collecte', { c: true, r: true, u: true, d: false });
      grant('stocks', { r: true });
      // BI & Members
      grant('kpi_analyses', { r: true });
      grant('membres', { r: true });
      break;

    case 'responsable_elevage':
      grant('accueil', { r: true });
      grant('workflow', { r: true });
      grant('campagnes', { r: true });
      // Full CRUD on Livestock modules
      grant('elevage', { c: true, r: true, u: true, d: true });
      grant('sante_animale', { c: true, r: true, u: true, d: true });
      grant('alimentation', { c: true, r: true, u: true, d: true });
      grant('reproduction', { c: true, r: true, u: true, d: true });
      // Terrains: can allocate livestock and cohabitate, but not delete cadastral property
      grant('terrains_parcelles', { c: true, r: true, u: true, d: false }, ['parcelles_cohabitation', 'bilan_anti_depassement']);
      grant('kpi_analyses', { r: true });
      grant('membres', { r: true });
      break;

    case 'responsable_stock':
      grant('accueil', { r: true });
      grant('workflow', { r: true });
      grant('collecte', { c: true, r: true, u: true, d: false });
      grant('stocks', { c: true, r: true, u: true, d: true });
      grant('commercialisation', { r: true, u: true }, ['expeditions_livraisons']);
      break;

    case 'comptable':
      grant('accueil', { r: true });
      grant('workflow', { r: true });
      grant('commercialisation', { c: true, r: true, u: true, d: false });
      grant('finances', { c: true, r: true, u: true, d: true });
      grant('membres', { c: true, r: true, u: true, d: false });
      grant('kpi_analyses', { r: true });
      grant('campagnes', { r: true });
      break;

    case 'agent_terrain':
      grant('accueil', { r: true });
      grant('workflow', { r: true });
      // Field agents can view and add field records, but cannot delete or reconfigure domains
      grant('terrains_parcelles', { c: true, r: true, u: true, d: false }, ['parcelles_cohabitation']);
      grant('suivi_cultural', { c: true, r: true, u: true, d: false });
      grant('collecte', { c: true, r: true, u: false, d: false }, ['pesee_publique', 'reception_quai']);
      grant('sante_animale', { c: true, r: true, u: false, d: false }, ['registre_traitements']);
      break;

    case 'cooperateur':
      grant('accueil', { r: true }, ['vue_globale']);
      grant('workflow', { r: true }, ['cycle_sept_etapes', 'parcours_roles']);
      // A member can view their parcels and member file
      grant('terrains_parcelles', { r: true }, ['parcelles_cohabitation']);
      grant('membres', { r: true }, ['registre_membres']);
      grant('finances', { r: true }, ['remuneration_membres']);
      break;

    case 'commercial':
      grant('accueil', { r: true });
      grant('workflow', { r: true });
      grant('commercialisation', { c: true, r: true, u: true, d: true });
      grant('stocks', { r: true });
      grant('membres', { r: true });
      break;

    default:
      grant('accueil', { r: true });
      grant('workflow', { r: true });
      break;
  }

  return perms;
};

/**
 * Deep clones module permissions
 */
export const cloneModulePermissions = (
  source: Record<string, ModulePermission>
): Record<string, ModulePermission> => {
  return JSON.parse(JSON.stringify(source));
};

/**
 * Checks if a user has access to a specific module.
 */
export const checkUserModuleAccess = (user: AppUser | undefined, moduleKey: NavigationTab): boolean => {
  if (!user) return false;
  if (user.role === 'super_admin' || user.role === 'direction') return true;

  if (user.permissions?.modules && user.permissions.modules[moduleKey]) {
    const mod = user.permissions.modules[moduleKey];
    return !!mod.hasAccess && !!mod.crud?.read;
  }

  // Legacy fallback
  if (user.permissions?.modulesAutorises) {
    return user.permissions.modulesAutorises.includes('all') || user.permissions.modulesAutorises.includes(moduleKey);
  }

  return false;
};

/**
 * Checks if a user has access to a specific sub-module within a module.
 */
export const checkUserSubModuleAccess = (
  user: AppUser | undefined,
  moduleKey: NavigationTab,
  subModuleKey: string
): boolean => {
  if (!user) return false;
  if (user.role === 'super_admin' || user.role === 'direction') return true;

  if (user.permissions?.modules && user.permissions.modules[moduleKey]) {
    const mod = user.permissions.modules[moduleKey];
    if (!mod.hasAccess) return false;

    // Check sub-module
    if (mod.subModules && mod.subModules[subModuleKey]) {
      const sm = mod.subModules[subModuleKey];
      return !!sm.hasAccess && !!sm.crud?.read;
    }

    // If sub-module is not specifically mapped, inherit module read access
    return !!mod.crud?.read;
  }

  return checkUserModuleAccess(user, moduleKey);
};

/**
 * Checks if a user has specific CRUD permission on a module or sub-module.
 */
export const checkUserCrud = (
  user: AppUser | undefined,
  moduleKey: NavigationTab,
  action: keyof CrudPermissions,
  subModuleKey?: string
): boolean => {
  if (!user) return false;
  if (user.role === 'super_admin' || user.role === 'direction') return true;

  if (user.permissions?.modules && user.permissions.modules[moduleKey]) {
    const mod = user.permissions.modules[moduleKey];
    if (!mod.hasAccess) return false;

    // If sub-module is given and exists, check sub-module first
    if (subModuleKey && mod.subModules && mod.subModules[subModuleKey]) {
      const sm = mod.subModules[subModuleKey];
      if (!sm.hasAccess) return false;
      return !!sm.crud?.[action];
    }

    // Otherwise check module level
    return !!mod.crud?.[action];
  }

  // Legacy fallback
  switch (action) {
    case 'create':
      return !!user.permissions?.canCreate;
    case 'update':
      return !!user.permissions?.canEdit;
    case 'delete':
      return !!user.permissions?.canDelete;
    case 'read':
      return checkUserModuleAccess(user, moduleKey);
    default:
      return false;
  }
};

/**
 * Computes statistics on assigned permissions (for UI indicators).
 */
export const calculatePermissionStats = (modules: Record<string, ModulePermission> | undefined) => {
  if (!modules) {
    return {
      totalModules: MODULES_REGISTRY.length,
      activeModules: 0,
      totalSubModules: 0,
      activeSubModules: 0,
      totalCrudGranted: 0,
    };
  }

  let activeModules = 0;
  let totalSubModules = 0;
  let activeSubModules = 0;
  let totalCrudGranted = 0;

  Object.values(modules).forEach((mod) => {
    if (mod.hasAccess) {
      activeModules++;
      if (mod.crud) {
        if (mod.crud.create) totalCrudGranted++;
        if (mod.crud.read) totalCrudGranted++;
        if (mod.crud.update) totalCrudGranted++;
        if (mod.crud.delete) totalCrudGranted++;
      }
    }

    if (mod.subModules) {
      Object.values(mod.subModules).forEach((sm) => {
        totalSubModules++;
        if (sm.hasAccess) {
          activeSubModules++;
          if (sm.crud) {
            if (sm.crud.create) totalCrudGranted++;
            if (sm.crud.read) totalCrudGranted++;
            if (sm.crud.update) totalCrudGranted++;
            if (sm.crud.delete) totalCrudGranted++;
          }
        }
      });
    }
  });

  return {
    totalModules: MODULES_REGISTRY.length,
    activeModules,
    totalSubModules,
    activeSubModules,
    totalCrudGranted,
  };
};

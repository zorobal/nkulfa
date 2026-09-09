export type NavigationTab = 
  | 'accueil'
  | 'campagnes'
  | 'terrains_parcelles'
  | 'agriculture'
  | 'suivi_cultural'
  | 'elevage'
  | 'sante_animale'
  | 'alimentation'
  | 'reproduction'
  | 'collecte'
  | 'stocks'
  | 'commercialisation'
  | 'finances'
  | 'membres'
  | 'kpi_analyses'
  | 'parametres'
  | 'workflow';

export type UserRole = 
  | 'super_admin'
  | 'direction'
  | 'responsable_agricole'
  | 'responsable_elevage'
  | 'agent_terrain'
  | 'responsable_stock'
  | 'commercial'
  | 'comptable'
  | 'cooperateur';

export interface CrudPermissions {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface SubModulePermission {
  key: string;
  nom: string;
  description?: string;
  hasAccess: boolean;
  crud: CrudPermissions;
}

export interface ModulePermission {
  key: NavigationTab;
  nom: string;
  category?: 'direction' | 'vegetal' | 'animal' | 'logistique' | 'finance' | 'systeme';
  description?: string;
  hasAccess: boolean;
  crud: CrudPermissions;
  subModules: Record<string, SubModulePermission>;
}

export interface UserPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canValidateFinances: boolean;
  canExportData: boolean;
  modulesAutorises: string[];
  /** Fine-grained hierarchical permissions per module and sub-module with CRUD */
  modules?: Record<string, ModulePermission>;
}

export interface AppUser {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  fonction: string;
  telephone: string;
  statut: 'Actif' | 'Suspendu' | 'Invité';
  dernierAcces: string;
  permissions: UserPermissions;
}

export interface CooperativeConfig {
  nom: string;
  sigle: string;
  formeJuridique: string;
  numeroAgrement: string;
  registreOHADA: string;
  anneeCreation: number;
  siegeSocial: string;
  boitePostale: string;
  telephone: string;
  email: string;
  devise: string;
  tauxRistourneMembresPct: number;
  seuilAlerteMortalitePct: number;
  seuilAlerteStockMinKg: number;
  campagneActive: string;
  responsableGeneral: string;
  veterinaireChef: string;
  agronomeChef: string;
}

export interface Membre {
  id: string;
  code: string;
  nom: string;
  prenom: string;
  sexe: 'M' | 'F';
  telephone: string;
  village: string;
  commune: string;
  region: string;
  dateAdhesion: string;
  statut: 'Actif' | 'Nouveau' | 'Inactif';
  activitePrincipale: string;
  activiteSecondaire?: string;
  superficieTotaleHa: number;
  effectifCheptelTotal: number;
  partsSocialesFCFA: number;
  cotisationsAJour: boolean;
}

export interface CultureCohabitante {
  id: string;
  parcelleId: string;
  especeNom: string;
  variete: string;
  superficieHa: number;
  typeAssociation: 'Culture Principale' | 'Culture Associée / Intercalaire' | 'Plante Couvrante / Fixatrice' | 'Bordure Agroforestière';
  dateSemis: string;
  dateRecoltePrevue?: string;
  rendementEstimeTonnesHa: number;
  statut: 'Semis' | 'Croissance' | 'Floraison' | 'Récolte imminente' | 'Récolté';
  observations?: string;
}

export interface Terrain {
  id: string;
  code: string;
  nom: string;
  proprietaireId: string;
  proprietaireNom?: string;
  commune: string;
  superficieHa: number;
  coordonnees: { lat: number; lng: number };
  statutFoncier: string;
  titreFoncier?: string;
  dateAcquisition?: string;
  statutJuridique?: string;
  parcellesIds?: string[];
}

export interface Parcelle {
  id: string;
  code: string;
  terrainId: string;
  nom?: string;
  superficieHa: number;
  typeActivite: 'Agriculture' | 'Élevage' | 'Mixte';
  typeSol: string;
  irrigation: boolean;
  coordonnees: { lat: number; lng: number };
  statut: 'En exploitation' | 'Jachère' | 'Préparation';
  zone?: string;
  responsable?: string;
  culturesCohabitantes?: CultureCohabitante[];
  superficieElevageHa?: number;
  elevageLotCode?: string;
  elevageEspeceNom?: string;
}

export interface Espece {
  id: string;
  nom: string;
  categorie: 'Gros bétail' | 'Petits ruminants' | 'Porcins' | 'Aviculture' | 'Aquaculture';
  dureeMoyenneMois: number;
  ageMaturiteMois: number;
  poidsMoyenKg: number;
  uniteComptage: string;
}

export interface Race {
  id: string;
  especeId: string;
  especeNom: string;
  nom: string;
  origine: string;
  aptitude: string;
  rusticite: 'Excellente' | 'Bonne' | 'Moyenne';
}

export interface ElevageParcelle {
  id: string;
  lotCode: string;
  terrainId: string;
  terrainNom: string;
  parcelleId: string;
  parcelleCode: string;
  proprietaireNom: string;
  especeId: string;
  especeNom: string;
  raceNom: string;
  dateDebut: string;
  effectifInitial: number;
  effectifActuel: number;
  effectifMales: number;
  effectifFemelles: number;
  jeunes: number;
  adultes: number;
  naissances: number;
  mortalites: number;
  valeurEstimeeFCFA: number;
  coutAcquisitionFCFA: number;
  etatSanitaire: 'Très bon' | 'Bon' | 'Vigilance' | 'Alerte';
  vaccinationAJour: boolean;
  prochaineVaccination: string;
}

export interface EvenementElevage {
  id: string;
  date: string;
  elevageParcelleId: string;
  lotCode: string;
  especeNom: string;
  typeEvenement: 'Vaccination' | 'Traitement' | 'Pesée' | 'Alimentation' | 'Naissance' | 'Mortalité' | 'Vente' | 'Achat';
  description: string;
  quantiteValeur?: number;
  unite?: string;
  coutFCFA: number;
  intervenant: string;
  observations: string;
}

export interface SanteAnimale {
  id: string;
  date: string;
  lotCode: string;
  especeNom: string;
  maladieOuSymptome: string;
  diagnostic: string;
  traitementAdministre: string;
  medicament: string;
  veterinaire: string;
  coutFCFA: number;
  statutGuerison: 'Guéri' | 'En cours' | 'Rechute' | 'Perte';
}

export interface ReproductionSuivi {
  id: string;
  lotCode: string;
  especeNom: string;
  femelleRef: string;
  maleReproducteurRef: string;
  dateSaillie: string;
  dateMiseBasPrevue: string;
  dateMiseBasReelle?: string;
  petitsNés: number;
  survivants: number;
  mortaliteJeunes: number;
  statut: 'En gestation' | 'Mise bas réussie' | 'Avortement';
}

export interface AlimentationElevage {
  id: string;
  lotCode: string;
  parcelleCode: string;
  especeNom: string;
  typeAliment: string;
  quantiteDistribueeKg: number;
  coutFCFA: number;
  frequence: string;
  gainMoyenQuotidienG: number;
}

export interface Culture {
  id: string;
  code: string;
  nom: string;
  variete: string;
  cycleJours: number;
  rendementCibleTonnesHa: number;
  coutMoyenHaFCFA: number;
  prixVenteIndicatifKgFCFA: number;
}

export type TypeCampagne = 'Végétale' | 'Animale' | 'Agro-pastorale Mixte';
export type UsageEspaceCampagne = 'Exclusif Culture' | 'Exclusif Élevage' | 'Rotation Pâturage Résidus' | 'Coexistence Spatiale';

export interface CampagneAgricole {
  id: string;
  code: string;
  nom?: string;
  typeCampagne?: TypeCampagne; // Végétale, Animale, Agro-pastorale Mixte
  filiere?: string; // ex: 'Maïs & Soja', 'Aviculture Chair', 'Porciculture', 'Embouche Bovine', 'Polyculture-Élevage'
  saison: string;
  annee: number;
  dateDebut: string;
  dateFin: string;
  statut: 'En cours' | 'Clôturée' | 'Planifiée';
  objectifSuperficieHa: number;
  objectifProductionTonnes: number;
  productionReelleTonnes: number;
  // Spécifique volet animalier
  objectifEffectifAnimaux?: number;
  effectifReelAnimaux?: number;
  // Bilan financier
  budgetPrevisionnelFCFA?: number;
  depensesReellesFCFA?: number;
  recettesReellesFCFA?: number;
  margeNetteFCFA?: number;
  // Affectation spatiale & parcelles
  parcellesCodes?: string[];
  usageEspace?: UsageEspaceCampagne;
  // Procédure de clôture
  dateCloture?: string;
  motifCloture?: string;
  observationsBilan?: string;
  validePar?: string;
}

export interface SuiviParcelleCulture {
  id: string;
  parcelleCode: string;
  terrainNom: string;
  cooperateurNom: string;
  campagneCode: string;
  cultureNom: string;
  variete: string;
  superficieHa: number;
  dateSemis: string;
  dateRecoltePrevue: string;
  rendementPrevuTonnesHa: number;
  rendementReelTonnesHa?: number;
  productionTotalTonnes?: number;
  coutTotalFCFA: number;
  margeEstimeeFCFA: number;
  statut: 'Croissance' | 'Floraison' | 'Récolte imminente' | 'Récolté';
}

export interface Collecte {
  id: string;
  codeBordereau: string;
  date: string;
  membreId: string;
  membreNom: string;
  produit: string;
  typeProduit: 'Agricole' | 'Élevage';
  quantiteKg: number;
  qualiteGrade: 'Grade A' | 'Grade B' | 'Standard';
  prixUnitaireFCFA: number;
  montantTotalFCFA: number;
  statutPaiement: 'Payé' | 'Acompte versé' | 'En attente';
  montantDejaPayeFCFA: number;
  resteAPayerFCFA: number;
  pointCollecte: string;
  lotTraçabilite: string;
}

export interface MagasinStock {
  id: string;
  nom: string;
  commune: string;
  responsable: string;
  capaciteMaxTonnes: number;
  stockActuelTonnes: number;
  tauxOccupationPct: number;
  valeurStockFCFA: number;
  produits: {
    produit: string;
    lot: string;
    quantiteKg: number;
    valeurFCFA: number;
    statutAlerte: 'Normal' | 'Seuil critique' | 'Rupture';
  }[];
}

export interface VenteCommande {
  id: string;
  codeCommande: string;
  date: string;
  clientNom: string;
  typeClient: 'Grossiste' | 'Industrie agro' | 'Hôtel / Resto' | 'Particulier' | 'Institution';
  produits: string;
  quantiteTonnes: number;
  montantTotalFCFA: number;
  statutLivraison: 'Livré' | 'En préparation' | 'En attente validation';
  statutReglement: 'Réglé' | 'Acompte' | 'En attente';
}

export interface RisqueAgroPastoral {
  id: string;
  categorie: 'Climatique' | 'Sanitaire animal' | 'Phytosanitaire' | 'Financier' | 'Logistique';
  intitule: string;
  zone: string;
  probabilite: 'Faible' | 'Moyenne' | 'Élevée';
  impact: 'Faible' | 'Modéré' | 'Critique';
  planAction: string;
  statut: 'Sous surveillance' | 'Alerte active' | 'Atténué';
}

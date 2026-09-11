import {
  MEMBRES_DATA,
  COLLECTES_DATA,
  CAMPAGNES_DATA,
  PARCELLES_DATA,
  ELEVAGE_PARCELLES_DATA,
  TERRAINS_DATA,
  SANTE_ANIMALE_DATA
} from '../src/data/coopData';

const DEFAULT_USERS = [
  {
    id: 'USR-001',
    login: 'atangana',
    password: 'coop2026',
    nom: 'ATANGANA',
    prenom: 'Jean-Marc',
    email: 'direction@coops-ca-nkul.cm',
    role: 'direction',
    fonction: 'Directeur Général & Administrateur',
    telephone: '+237 677 82 45 19',
    statut: 'Actif',
    dernierAcces: 'Aujourd’hui à 08:42',
    dateAdhesion: '2021-01-10',
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canValidateFinances: true,
      canExportData: true,
      modulesAutorises: ['all'],
    },
  },
  {
    id: 'USR-002',
    login: 'mballa',
    password: 'coop2026',
    nom: 'MBALLA',
    prenom: 'Suzanne',
    email: 'agronomie@coops-ca-nkul.cm',
    role: 'responsable_agricole',
    fonction: 'Ingénieur Agronome - Chef Pôle Végétal',
    telephone: '+237 699 44 12 55',
    statut: 'Actif',
    dernierAcces: 'Hier à 16:15',
    dateAdhesion: '2021-03-01',
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canValidateFinances: false,
      canExportData: true,
      modulesAutorises: ['terrains_parcelles', 'agriculture', 'suivi_cultural', 'collecte', 'kpi_analyses'],
    },
  },
  {
    id: 'USR-003',
    login: 'etoundi',
    password: 'coop2026',
    nom: 'ETOUNDI',
    prenom: 'Paulin',
    email: 'veterinaire@coops-ca-nkul.cm',
    role: 'responsable_elevage',
    fonction: 'Docteur Vétérinaire - Chef Pôle Élevage',
    telephone: '+237 675 30 18 22',
    statut: 'Actif',
    dernierAcces: 'Aujourd’hui à 07:30',
    dateAdhesion: '2021-03-15',
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canValidateFinances: false,
      canExportData: true,
      modulesAutorises: ['terrains_parcelles', 'elevage', 'sante_animale', 'collecte'],
    },
  },
  {
    id: 'USR-004',
    login: 'bessala',
    password: 'coop2026',
    nom: 'BESSALA',
    prenom: 'Arsène',
    email: 'collecte@coops-ca-nkul.cm',
    role: 'agent_collecte',
    fonction: 'Superviseur des Postes d’Achat & Pesée',
    telephone: '+237 691 05 67 89',
    statut: 'Actif',
    dernierAcces: '08/09/2026 à 11:20',
    dateAdhesion: '2022-02-01',
    permissions: {
      canCreate: true,
      canEdit: false,
      canDelete: false,
      canValidateFinances: false,
      canExportData: false,
      modulesAutorises: ['collecte', 'stocks'],
    },
  },
  {
    id: 'USR-005',
    login: 'nga',
    password: 'coop2026',
    nom: 'NGA',
    prenom: 'Clarisse',
    email: 'comptabilite@coops-ca-nkul.cm',
    role: 'comptable',
    fonction: 'Chef Comptable & Trésorière Générale',
    telephone: '+237 674 99 81 03',
    statut: 'Actif',
    dernierAcces: '07/09/2026 à 17:50',
    dateAdhesion: '2021-02-15',
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canValidateFinances: true,
      canExportData: true,
      modulesAutorises: ['commercialisation', 'finances', 'membres', 'kpi_analyses'],
    },
  },
  {
    id: 'USR-006',
    login: 'ondoa',
    password: 'coop2026',
    nom: 'ONDOA',
    prenom: 'Samuel',
    email: 's.ondoa@cooperateurs.cm',
    role: 'cooperateur',
    fonction: 'Délégué des Producteurs - Zone Obala',
    telephone: '+237 690 12 34 56',
    statut: 'Actif',
    dernierAcces: '04/09/2026 à 14:05',
    dateAdhesion: '2022-05-10',
    permissions: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canValidateFinances: false,
      canExportData: false,
      modulesAutorises: ['accueil', 'terrains_parcelles', 'membres'],
    },
  },
];

const DEFAULT_CONFIG = {
  nom: 'COOPS-CA NKUL-FA',
  sigle: 'COOPS-CA NKUL',
  formeJuridique: "Société Coopérative avec Conseil d'Administration (OHADA)",
  numeroAgrement: 'AGR/MINADER/DRPC/2022/014',
  registreOHADA: 'RC/YAE/2021/B/1429',
  anneeCreation: 2021,
  siegeSocial: 'Obala, Région du Centre, Cameroun',
  boitePostale: 'B.P. 184 Obala',
  telephone: '+237 677 82 45 19 / +237 699 12 30 08',
  email: 'direction@coops-ca-nkul.cm',
  devise: 'FCFA',
  tauxRistourneMembresPct: 8.5,
  seuilAlerteMortalitePct: 3.5,
  seuilAlerteStockMinKg: 2000,
  campagneActive: 'Campagne Principale 2026-A',
  responsableGeneral: 'Dr. Jean-Marc ATANGANA',
  veterinaireChef: 'Dr. Vet. Paulin ETOUNDI',
  agronomeChef: 'Ing. Suzanne MBALLA',
};

function sanitizeForConvex(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeForConvex);
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const asciiKey = key
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_]/g, '_');
    clean[asciiKey] = sanitizeForConvex(value);
  }
  return clean;
}

async function main() {
  const url = 'https://giant-bison-526.eu-west-1.convex.cloud/api/mutation';
  console.log('Sanitizing and pushing full cooperative data to Convex cloud...');

  const rawPayload = {
    key: 'main',
    users: DEFAULT_USERS,
    membres: MEMBRES_DATA,
    config: DEFAULT_CONFIG,
    interventions: SANTE_ANIMALE_DATA,
    elevages: ELEVAGE_PARCELLES_DATA,
    parcelles: PARCELLES_DATA,
    terrains: TERRAINS_DATA,
    collectes: COLLECTES_DATA,
    campagnes: CAMPAGNES_DATA,
    activeCampagneCode: 'CAMP-2026-A',
    updatedBy: 'Alain Patrick Nkoumou (Initial Seed)',
  };

  const cleanPayload = sanitizeForConvex(rawPayload);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: 'appData:saveState',
      args: cleanPayload,
    }),
  });

  const json = await res.json();
  console.log('Result from Convex:', JSON.stringify(json, null, 2));
}

main().catch(console.error);

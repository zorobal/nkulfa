import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppUser,
  CooperativeConfig,
  ElevageParcelle,
  SanteAnimale,
  Membre,
  Collecte,
  Parcelle,
  Terrain,
  CampagneAgricole,
  CultureCohabitante,
  NavigationTab,
  CrudPermissions,
} from '../types';
import {
  ELEVAGE_PARCELLES_DATA,
  SANTE_ANIMALE_DATA,
  MEMBRES_DATA,
  COLLECTES_DATA,
  PARCELLES_DATA,
  TERRAINS_DATA,
  CAMPAGNES_DATA,
} from '../data/coopData';
import {
  getDefaultPermissionsForRole,
  checkUserModuleAccess,
  checkUserSubModuleAccess,
  checkUserCrud,
} from '../data/modulesRegistry';
import {
  convexService,
  ConvexSyncStatus,
  ConvexConnectionTest,
  CONVEX_CLOUD_URL,
  CONVEX_SITE_URL,
} from '../services/convexService';

const DEFAULT_USERS: AppUser[] = [
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
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canValidateFinances: true,
      canExportData: true,
      modulesAutorises: ['all'],
      modules: getDefaultPermissionsForRole('direction'),
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
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canValidateFinances: false,
      canExportData: true,
      modulesAutorises: ['terrains_parcelles', 'agriculture', 'suivi_cultural', 'collecte', 'kpi_analyses'],
      modules: getDefaultPermissionsForRole('responsable_agricole'),
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
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canValidateFinances: false,
      canExportData: true,
      modulesAutorises: ['elevage', 'sante_animale', 'alimentation', 'reproduction', 'kpi_analyses'],
      modules: getDefaultPermissionsForRole('responsable_elevage'),
    },
  },
  {
    id: 'USR-004',
    login: 'bikoula',
    password: 'coop2026',
    nom: 'BIKOULA',
    prenom: 'Dieudonné',
    email: 'stocks@coops-ca-nkul.cm',
    role: 'responsable_stock',
    fonction: 'Responsable Silos, Minoterie & Stocks',
    telephone: '+237 691 58 77 90',
    statut: 'Actif',
    dernierAcces: '06/09/2026 à 11:20',
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canValidateFinances: false,
      canExportData: true,
      modulesAutorises: ['collecte', 'stocks'],
      modules: getDefaultPermissionsForRole('responsable_stock'),
    },
  },
  {
    id: 'USR-005',
    login: 'ngah',
    password: 'coop2026',
    nom: 'NGAH',
    prenom: 'Chantal',
    email: 'finances@coops-ca-nkul.cm',
    role: 'comptable',
    fonction: 'Trésorière Principale & Gestion Financière',
    telephone: '+237 671 90 23 44',
    statut: 'Actif',
    dernierAcces: 'Aujourd’hui à 09:12',
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canValidateFinances: true,
      canExportData: true,
      modulesAutorises: ['commercialisation', 'finances', 'membres', 'kpi_analyses'],
      modules: getDefaultPermissionsForRole('comptable'),
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
    permissions: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canValidateFinances: false,
      canExportData: false,
      modulesAutorises: ['accueil', 'terrains_parcelles', 'membres'],
      modules: getDefaultPermissionsForRole('cooperateur'),
    },
  },
];

const DEFAULT_CONFIG: CooperativeConfig = {
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

interface AppContextType {
  // State
  users: AppUser[];
  currentUser: AppUser;
  config: CooperativeConfig;
  interventions: SanteAnimale[];
  elevages: ElevageParcelle[];
  parcelles: Parcelle[];
  terrains: Terrain[];
  membres: Membre[];
  collectes: Collecte[];
  campagnes: CampagneAgricole[];
  activeCampagneCode: string;

  // Campagnes CRUD & Workflow
  setActiveCampagneCode: (code: string) => void;
  addCampagne: (item: Omit<CampagneAgricole, 'id'>) => void;
  updateCampagne: (id: string, updates: Partial<CampagneAgricole>) => void;
  cloturerCampagne: (
    id: string,
    bilanData: {
      dateCloture: string;
      motifCloture?: string;
      observationsBilan: string;
      productionReelleTonnes?: number;
      effectifReelAnimaux?: number;
      recettesReellesFCFA?: number;
      depensesReellesFCFA?: number;
      margeNetteFCFA?: number;
      validePar?: string;
    }
  ) => void;
  rouvrirCampagne: (id: string) => void;
  deleteCampagne: (id: string) => void;

  // Session & Authentication
  isAuthenticated: boolean;
  login: (login: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  lockSession: () => void;
  switchUserWithPassword: (userId: string, password: string) => { success: boolean; error?: string };

  // User Actions
  setCurrentUser: (user: AppUser) => void;
  switchUserById: (userId: string) => void;
  addUser: (user: Omit<AppUser, 'id' | 'dernierAcces'>) => void;
  updateUser: (id: string, updates: Partial<AppUser>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;

  // Config Actions
  updateConfig: (updates: Partial<CooperativeConfig>) => void;

  // Health / Interventions CRUD
  addIntervention: (item: Omit<SanteAnimale, 'id'>) => void;
  updateIntervention: (id: string, updates: Partial<SanteAnimale>) => void;
  deleteIntervention: (id: string) => void;

  // Elevages Lots CRUD
  addElevageLot: (item: Omit<ElevageParcelle, 'id'>) => void;
  updateElevageLot: (id: string, updates: Partial<ElevageParcelle>) => void;
  deleteElevageLot: (id: string) => void;

  // Parcelles CRUD & Cohabitation
  addParcelle: (item: Omit<Parcelle, 'id'>) => boolean;
  updateParcelle: (id: string, updates: Partial<Parcelle>) => boolean;
  deleteParcelle: (id: string) => void;
  addCultureCohabitante: (parcelleId: string, culture: Omit<CultureCohabitante, 'id' | 'parcelleId'>) => boolean;
  removeCultureCohabitante: (parcelleId: string, cultureId: string) => void;
  updateElevageOnParcelle: (parcelleId: string, data: { superficieElevageHa: number; elevageLotCode?: string; elevageEspeceNom?: string }) => boolean;

  // Terrains CRUD
  addTerrain: (item: Omit<Terrain, 'id'>) => void;
  updateTerrain: (id: string, updates: Partial<Terrain>) => boolean;
  deleteTerrain: (id: string) => void;

  // Membres CRUD
  addMembre: (item: Omit<Membre, 'id'>) => void;
  updateMembre: (id: string, updates: Partial<Membre>) => void;
  deleteMembre: (id: string) => void;

  // Collectes CRUD
  addCollecte: (item: Omit<Collecte, 'id'>) => void;

  // Data management
  resetToDefaultData: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonString: string) => boolean;

  // Permissions helpers
  canPerform: (action: 'create' | 'edit' | 'delete' | 'validate', moduleKey?: string) => boolean;
  can: (action: keyof CrudPermissions, moduleKey: NavigationTab, subModuleKey?: string) => boolean;
  canAccessModule: (moduleKey: NavigationTab) => boolean;
  canAccessSubModule: (moduleKey: NavigationTab, subModuleKey: string) => boolean;

  // Convex Cloud Database Integration
  convexStatus: ConvexSyncStatus;
  lastConvexSync: number | null;
  convexError: string | null;
  convexCloudUrl: string;
  convexSiteUrl: string;
  syncWithConvex: (forcePush?: boolean) => Promise<{ success: boolean; message: string }>;
  testConvexConnection: () => Promise<ConvexConnectionTest>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'coops_flow_store_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage or defaults
  const loadInitialState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Ensure users have fine-grained permissions populated, and have login & password
        const loadedUsers = (parsed.users || DEFAULT_USERS).map((u: any) => {
          const userObj = { ...u };
          if (!userObj.login) {
            userObj.login = (userObj.nom || 'user').toLowerCase().replace(/\s+/g, '');
          }
          if (!userObj.password) {
            userObj.password = 'coop2026';
          }
          if (!userObj.permissions?.modules) {
            userObj.permissions = {
              ...userObj.permissions,
              modules: getDefaultPermissionsForRole(userObj.role),
            };
          }
          return userObj as AppUser;
        });

        const loadedMembres = (parsed.membres || MEMBRES_DATA).map((m: Membre) => ({
          ...m,
          ville: m.ville || m.commune || 'Yaoundé',
          pays: m.pays || 'Cameroun',
          domaineActivite: m.domaineActivite || 'Agro-pastoral',
          specialite: m.specialite || m.activitePrincipale,
        }));

        return {
          users: loadedUsers,
          currentUserId: parsed.currentUserId || 'USR-001',
          config: parsed.config || DEFAULT_CONFIG,
          interventions: parsed.interventions || SANTE_ANIMALE_DATA,
          elevages: parsed.elevages || ELEVAGE_PARCELLES_DATA,
          parcelles: parsed.parcelles || PARCELLES_DATA,
          terrains: parsed.terrains || TERRAINS_DATA,
          membres: loadedMembres,
          collectes: parsed.collectes || COLLECTES_DATA,
          campagnes: parsed.campagnes || CAMPAGNES_DATA,
          activeCampagneCode: parsed.activeCampagneCode || 'CAMP-2026-A',
        };
      }
    } catch {
      // Fallback
    }
    return {
      users: DEFAULT_USERS,
      currentUserId: 'USR-001',
      config: DEFAULT_CONFIG,
      interventions: SANTE_ANIMALE_DATA,
      elevages: ELEVAGE_PARCELLES_DATA,
      parcelles: PARCELLES_DATA,
      terrains: TERRAINS_DATA,
      membres: MEMBRES_DATA,
      collectes: COLLECTES_DATA,
      campagnes: CAMPAGNES_DATA,
      activeCampagneCode: 'CAMP-2026-A',
    };
  };

  const initial = loadInitialState();

  const [users, setUsers] = useState<AppUser[]>(initial.users);
  const [currentUser, setCurrentUser] = useState<AppUser>(
    initial.users.find((u: AppUser) => u.id === initial.currentUserId) || initial.users[0]
  );
  const [config, setConfig] = useState<CooperativeConfig>(initial.config);
  const [interventions, setInterventions] = useState<SanteAnimale[]>(initial.interventions);
  const [elevages, setElevages] = useState<ElevageParcelle[]>(initial.elevages);
  const [parcelles, setParcelles] = useState<Parcelle[]>(initial.parcelles);
  const [terrains, setTerrains] = useState<Terrain[]>(initial.terrains);
  const [membres, setMembres] = useState<Membre[]>(initial.membres);
  const [collectes, setCollectes] = useState<Collecte[]>(initial.collectes);
  const [campagnes, setCampagnes] = useState<CampagneAgricole[]>(initial.campagnes);
  const [activeCampagneCode, setActiveCampagneCode] = useState<string>(initial.activeCampagneCode);

  // Convex Cloud State & Real-time synchronization
  const [convexStatus, setConvexStatus] = useState<ConvexSyncStatus>(convexService.getStatus());
  const [lastConvexSync, setLastConvexSync] = useState<number | null>(convexService.getLastSync());
  const [convexError, setConvexError] = useState<string | null>(convexService.getLastError());
  const [isInitialLoadDone, setIsInitialLoadDone] = useState<boolean>(false);

  // Subscribe to Convex status changes
  useEffect(() => {
    return convexService.subscribe((status, info) => {
      setConvexStatus(status);
      if (info?.lastSync) setLastConvexSync(info.lastSync);
      setConvexError(info?.error || null);
    });
  }, []);

  // INCOMING REQUEST PRIORITY: Hydrate state from Convex on application boot
  useEffect(() => {
    let isMounted = true;

    const hydrateFromConvex = async () => {
      try {
        const { data, result } = await convexService.fetchStateFromConvex();
        if (!isMounted) return;

        if (data) {
          // Convex has priority over local storage!
          if (Array.isArray(data.users) && data.users.length > 0) {
            setUsers(data.users);
          }
          if (Array.isArray(data.membres) && data.membres.length > 0) {
            setMembres(data.membres);
          }
          if (data.config && typeof data.config === 'object' && Object.keys(data.config).length > 0) {
            setConfig(data.config);
          }
          if (Array.isArray(data.interventions)) {
            setInterventions(data.interventions);
          }
          if (Array.isArray(data.elevages)) {
            setElevages(data.elevages);
          }
          if (Array.isArray(data.parcelles)) {
            setParcelles(data.parcelles);
          }
          if (Array.isArray(data.terrains)) {
            setTerrains(data.terrains);
          }
          if (Array.isArray(data.collectes)) {
            setCollectes(data.collectes);
          }
          if (Array.isArray(data.campagnes)) {
            setCampagnes(data.campagnes);
          }
          if (data.activeCampagneCode) {
            setActiveCampagneCode(data.activeCampagneCode);
          }
        } else if (result.source === 'convex') {
          // Connected to Convex, but table is empty: seed Convex with default cooperative dataset
          await convexService.saveStateToConvex(
            {
              users: initial.users,
              membres: initial.membres,
              config: initial.config,
              interventions: initial.interventions,
              elevages: initial.elevages,
              parcelles: initial.parcelles,
              terrains: initial.terrains,
              collectes: initial.collectes,
              campagnes: initial.campagnes,
              activeCampagneCode: initial.activeCampagneCode,
            },
            'initial_seed'
          );
        }
      } catch (err) {
        console.warn('Convex hydration notice:', err);
      } finally {
        if (isMounted) {
          setIsInitialLoadDone(true);
        }
      }
    };

    hydrateFromConvex();
    return () => {
      isMounted = false;
    };
  }, []);

  // OUTGOING REQUEST PRIORITY: Save changes to Convex first, then mirror to LocalStorage
  useEffect(() => {
    const dataToSave = {
      users,
      currentUserId: currentUser.id,
      config,
      interventions,
      elevages,
      parcelles,
      terrains,
      membres,
      collectes,
      campagnes,
      activeCampagneCode,
    };

    // 1. Mirror to LocalStorage as offline fallback cache
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // Ignore quota errors
    }

    // 2. Debounce push to Convex Cloud (Primary Database)
    if (!isInitialLoadDone) return;

    const timer = setTimeout(() => {
      convexService.saveStateToConvex(dataToSave, currentUser.prenom || 'user');
    }, 800);

    return () => clearTimeout(timer);
  }, [
    users,
    currentUser,
    config,
    interventions,
    elevages,
    parcelles,
    terrains,
    membres,
    collectes,
    campagnes,
    activeCampagneCode,
    isInitialLoadDone,
  ]);

  // Manual Trigger: Force synchronization with Convex
  const syncWithConvex = async (forcePush = false): Promise<{ success: boolean; message: string }> => {
    if (forcePush) {
      const dataToPush = {
        users,
        membres,
        config,
        interventions,
        elevages,
        parcelles,
        terrains,
        collectes,
        campagnes,
        activeCampagneCode,
      };
      const result = await convexService.saveStateToConvex(dataToPush, currentUser.prenom || 'admin');
      return { success: result.success, message: result.message };
    } else {
      const { data, result } = await convexService.fetchStateFromConvex();
      if (data) {
        if (Array.isArray(data.users) && data.users.length > 0) setUsers(data.users);
        if (Array.isArray(data.membres) && data.membres.length > 0) setMembres(data.membres);
        if (data.config && Object.keys(data.config).length > 0) setConfig(data.config);
        if (Array.isArray(data.collectes)) setCollectes(data.collectes);
        if (Array.isArray(data.campagnes)) setCampagnes(data.campagnes);
        if (Array.isArray(data.interventions)) setInterventions(data.interventions);
        if (Array.isArray(data.elevages)) setElevages(data.elevages);
        if (Array.isArray(data.parcelles)) setParcelles(data.parcelles);
        if (Array.isArray(data.terrains)) setTerrains(data.terrains);
        if (data.activeCampagneCode) setActiveCampagneCode(data.activeCampagneCode);
      }
      return { success: result.success, message: result.message };
    }
  };

  const testConvexConnection = async (): Promise<ConvexConnectionTest> => {
    return await convexService.testConnection();
  };

  // User Actions & Authentication Session State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('coops_session_active') !== 'false';
  });

  const login = (loginInput: string, passwordInput: string): { success: boolean; error?: string } => {
    const trimmedLogin = loginInput.trim().toLowerCase();
    const found = users.find((u) => u.login.toLowerCase() === trimmedLogin);
    if (!found) {
      return {
        success: false,
        error: "Identifiant inconnu. Veuillez vérifier votre nom d'utilisateur (login).",
      };
    }
    if (found.statut === 'Suspendu') {
      return {
        success: false,
        error: "Ce compte utilisateur a été suspendu par l’administrateur.",
      };
    }
    const expectedPassword = found.password || 'coop2026';
    if (passwordInput !== expectedPassword) {
      return { success: false, error: 'Mot de passe incorrect.' };
    }

    const now = new Date();
    const dateStr = `Aujourd’hui à ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    updateUser(found.id, { dernierAcces: dateStr });
    setCurrentUser({ ...found, dernierAcces: dateStr });
    setIsAuthenticated(true);
    sessionStorage.setItem('coops_session_active', 'true');
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.setItem('coops_session_active', 'false');
  };

  const lockSession = () => {
    setIsAuthenticated(false);
    sessionStorage.setItem('coops_session_active', 'false');
  };

  const switchUserWithPassword = (
    userId: string,
    passwordInput: string
  ): { success: boolean; error?: string } => {
    const target = users.find((u) => u.id === userId);
    if (!target) {
      return { success: false, error: 'Compte utilisateur introuvable.' };
    }
    if (target.statut === 'Suspendu') {
      return { success: false, error: 'Ce compte utilisateur est suspendu.' };
    }
    const expectedPassword = target.password || 'coop2026';
    if (passwordInput !== expectedPassword) {
      return {
        success: false,
        error: `Mot de passe incorrect pour le compte @${target.login}.`,
      };
    }

    const now = new Date();
    const dateStr = `Aujourd’hui à ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    updateUser(target.id, { dernierAcces: dateStr });
    setCurrentUser({ ...target, dernierAcces: dateStr });
    return { success: true };
  };

  const switchUserById = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) setCurrentUser(found);
  };

  const addUser = (userData: Omit<AppUser, 'id' | 'dernierAcces'>) => {
    const modulesPerms = userData.permissions?.modules || getDefaultPermissionsForRole(userData.role);
    const authorizedModules = Object.entries(modulesPerms)
      .filter(([_, m]) => m.hasAccess)
      .map(([k]) => k);

    const generatedLogin = userData.login
      ? userData.login.trim().toLowerCase().replace(/\s+/g, '')
      : (userData.nom || 'user').toLowerCase().replace(/\s+/g, '');

    const newUser: AppUser = {
      ...userData,
      id: `USR-${Date.now().toString().slice(-4)}`,
      login: generatedLogin,
      password: userData.password || 'coop2026',
      dernierAcces: 'Jamais connecté',
      permissions: {
        ...userData.permissions,
        modulesAutorises: authorizedModules.length > 0 ? authorizedModules : userData.permissions?.modulesAutorises || [],
        modules: modulesPerms,
      },
    };
    setUsers((prev) => [newUser, ...prev]);
  };

  const updateUser = (id: string, updates: Partial<AppUser>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const updated = { ...u, ...updates };
        // If modules were updated in permissions, synchronize modulesAutorises
        if (updates.permissions?.modules) {
          const authorizedModules = Object.entries(updates.permissions.modules)
            .filter(([_, m]) => m.hasAccess)
            .map(([k]) => k);
          updated.permissions = {
            ...updated.permissions,
            modulesAutorises: authorizedModules,
          };
        }
        return updated;
      })
    );
    if (currentUser.id === id) {
      setCurrentUser((prev) => {
        const updated = { ...prev, ...updates };
        if (updates.permissions?.modules) {
          const authorizedModules = Object.entries(updates.permissions.modules)
            .filter(([_, m]) => m.hasAccess)
            .map(([k]) => k);
          updated.permissions = {
            ...updated.permissions,
            modulesAutorises: authorizedModules,
          };
        }
        return updated;
      });
    }
  };

  const deleteUser = (id: string) => {
    if (id === currentUser.id) return; // Cannot delete self
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, statut: u.statut === 'Actif' ? 'Suspendu' : 'Actif' }
          : u
      )
    );
  };

  // Config Action
  const updateConfig = (updates: Partial<CooperativeConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  // Interventions CRUD
  const addIntervention = (item: Omit<SanteAnimale, 'id'>) => {
    const newId = `SAN-${(interventions.length + 1).toString().padStart(3, '0')}`;
    const created: SanteAnimale = { ...item, id: newId };
    setInterventions((prev) => [created, ...prev]);
  };

  const updateIntervention = (id: string, updates: Partial<SanteAnimale>) => {
    setInterventions((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteIntervention = (id: string) => {
    setInterventions((prev) => prev.filter((item) => item.id !== id));
  };

  // Elevages Lots CRUD
  const addElevageLot = (item: Omit<ElevageParcelle, 'id'>) => {
    const newId = `ELV-${(elevages.length + 1).toString().padStart(3, '0')}`;
    const created: ElevageParcelle = { ...item, id: newId };
    setElevages((prev) => [created, ...prev]);
  };

  const updateElevageLot = (id: string, updates: Partial<ElevageParcelle>) => {
    setElevages((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteElevageLot = (id: string) => {
    setElevages((prev) => prev.filter((item) => item.id !== id));
  };

  // Parcelles CRUD
  // Parcelles CRUD with strict anti-negative surface control on Terrains
  const addParcelle = (item: Omit<Parcelle, 'id'>): boolean => {
    const parentTerrain = terrains.find((t) => t.id === item.terrainId);
    if (!parentTerrain) return false;

    // Calculer la superficie déjà découpée sur ce terrain
    const currentlyAllocated = parcelles
      .filter((p) => p.terrainId === item.terrainId)
      .reduce((sum, p) => sum + (Number(p.superficieHa) || 0), 0);
    const availableHa = Math.max(0, parentTerrain.superficieHa - currentlyAllocated);

    // Contrôle strict : interdiction formelle de dépasser la superficie restante du terrain
    if (Number(item.superficieHa) > Number(availableHa.toFixed(2))) {
      return false; // Bloqué pour empêcher un reste négatif
    }

    const newId = `P${(parcelles.length + 1).toString().padStart(3, '0')}`;
    const created: Parcelle = {
      ...item,
      id: newId,
      culturesCohabitantes: item.culturesCohabitantes || [],
      superficieElevageHa: item.superficieElevageHa || 0,
    };
    setParcelles((prev) => [created, ...prev]);
    return true;
  };

  const updateParcelle = (id: string, updates: Partial<Parcelle>): boolean => {
    const existing = parcelles.find((p) => p.id === id);
    if (!existing) return false;

    const targetTerrainId = updates.terrainId || existing.terrainId;
    const parentTerrain = terrains.find((t) => t.id === targetTerrainId);
    if (!parentTerrain) return false;

    if (updates.superficieHa !== undefined) {
      const otherParcellesHa = parcelles
        .filter((p) => p.id !== id && p.terrainId === targetTerrainId)
        .reduce((sum, p) => sum + (Number(p.superficieHa) || 0), 0);
      const availableHa = Math.max(0, parentTerrain.superficieHa - otherParcellesHa);

      if (Number(updates.superficieHa) > Number(availableHa.toFixed(2))) {
        return false; // Bloqué : dépassement du terrain interdit
      }

      // Vérifier également que la nouvelle superficie de la parcelle ne devient pas inférieure à ce qui est déjà occupé par les cultures + élevage
      const currentlyOccupied =
        (existing.culturesCohabitantes || []).reduce((sum, c) => sum + (Number(c.superficieHa) || 0), 0) +
        (existing.superficieElevageHa || 0);

      if (Number(updates.superficieHa) < Number(currentlyOccupied.toFixed(2))) {
        return false; // Bloqué : la parcelle serait plus petite que ses occupations actuelles
      }
    }

    setParcelles((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    return true;
  };

  const deleteParcelle = (id: string) => {
    setParcelles((prev) => prev.filter((item) => item.id !== id));
  };

  // Cohabitation de cultures sur une même parcelle avec contrôle strict du reste disponible
  const addCultureCohabitante = (
    parcelleId: string,
    cultureData: Omit<CultureCohabitante, 'id' | 'parcelleId'>
  ): boolean => {
    const targetParcelle = parcelles.find((p) => p.id === parcelleId);
    if (!targetParcelle) return false;

    // Calcul de l'occupation actuelle sur la parcelle
    const currentCulturesHa = (targetParcelle.culturesCohabitantes || []).reduce(
      (sum, c) => sum + (Number(c.superficieHa) || 0),
      0
    );
    const elevageHa = targetParcelle.superficieElevageHa || 0;
    const totalOccupied = currentCulturesHa + elevageHa;
    const remainingFreeHa = Math.max(0, targetParcelle.superficieHa - totalOccupied);

    // Contrôle strict : interdiction absolue d'allouer plus que la superficie restante
    if (Number(cultureData.superficieHa) > Number(remainingFreeHa.toFixed(2))) {
      return false; // Bloqué : empêche un reste négatif sur la parcelle
    }

    const newCultureId = `COH-${Date.now().toString().slice(-4)}`;
    const newCulture: CultureCohabitante = {
      ...cultureData,
      id: newCultureId,
      parcelleId,
    };

    setParcelles((prev) =>
      prev.map((p) =>
        p.id === parcelleId
          ? {
              ...p,
              statut: 'En exploitation',
              culturesCohabitantes: [...(p.culturesCohabitantes || []), newCulture],
            }
          : p
      )
    );
    return true;
  };

  const removeCultureCohabitante = (parcelleId: string, cultureId: string) => {
    setParcelles((prev) =>
      prev.map((p) =>
        p.id === parcelleId
          ? {
              ...p,
              culturesCohabitantes: (p.culturesCohabitantes || []).filter((c) => c.id !== cultureId),
            }
          : p
      )
    );
  };

  const updateElevageOnParcelle = (
    parcelleId: string,
    data: { superficieElevageHa: number; elevageLotCode?: string; elevageEspeceNom?: string }
  ): boolean => {
    const targetParcelle = parcelles.find((p) => p.id === parcelleId);
    if (!targetParcelle) return false;

    const currentCulturesHa = (targetParcelle.culturesCohabitantes || []).reduce(
      (sum, c) => sum + (Number(c.superficieHa) || 0),
      0
    );
    const maxAvailableForElevage = Math.max(0, targetParcelle.superficieHa - currentCulturesHa);

    if (Number(data.superficieElevageHa) > Number(maxAvailableForElevage.toFixed(2))) {
      return false; // Bloqué pour empêcher un reste négatif
    }

    setParcelles((prev) =>
      prev.map((p) =>
        p.id === parcelleId
          ? {
              ...p,
              superficieElevageHa: Number(data.superficieElevageHa),
              elevageLotCode: data.elevageLotCode || p.elevageLotCode,
              elevageEspeceNom: data.elevageEspeceNom || p.elevageEspeceNom,
              typeActivite: p.typeActivite === 'Agriculture' && data.superficieElevageHa > 0 ? 'Mixte' : p.typeActivite,
            }
          : p
      )
    );
    return true;
  };

  // Terrains CRUD with integrity control
  const addTerrain = (item: Omit<Terrain, 'id'>) => {
    const newId = `T${(terrains.length + 1).toString().padStart(3, '0')}`;
    const created: Terrain = { ...item, id: newId };
    setTerrains((prev) => [created, ...prev]);
  };

  const updateTerrain = (id: string, updates: Partial<Terrain>): boolean => {
    const existing = terrains.find((t) => t.id === id);
    if (!existing) return false;

    if (updates.superficieHa !== undefined) {
      const parcellesHa = parcelles
        .filter((p) => p.terrainId === id)
        .reduce((sum, p) => sum + (Number(p.superficieHa) || 0), 0);

      // On ne peut pas réduire la surface du terrain en-dessous du total des parcelles découpées
      if (Number(updates.superficieHa) < Number(parcellesHa.toFixed(2))) {
        return false; // Bloqué pour empêcher un reste négatif
      }
    }

    setTerrains((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    return true;
  };

  const deleteTerrain = (id: string) => {
    // Supprimer également les parcelles orphelines
    setParcelles((prev) => prev.filter((p) => p.terrainId !== id));
    setTerrains((prev) => prev.filter((item) => item.id !== id));
  };

  // Membres CRUD
  const addMembre = (item: Omit<Membre, 'id'>) => {
    const newId = `MEM-${(membres.length + 1).toString().padStart(3, '0')}`;
    const created: Membre = { ...item, id: newId };
    setMembres((prev) => [created, ...prev]);
  };

  const updateMembre = (id: string, updates: Partial<Membre>) => {
    setMembres((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteMembre = (id: string) => {
    setMembres((prev) => prev.filter((item) => item.id !== id));
  };

  // Collectes CRUD
  const addCollecte = (item: Omit<Collecte, 'id'>) => {
    const newId = `COL-${(collectes.length + 1).toString().padStart(3, '0')}`;
    const created: Collecte = { ...item, id: newId };
    setCollectes((prev) => [created, ...prev]);
  };

  // Campagnes CRUD & Workflow
  const addCampagne = (item: Omit<CampagneAgricole, 'id'>) => {
    const newId = `CAMP-${Date.now().toString().slice(-4)}`;
    const created: CampagneAgricole = { ...item, id: newId };
    setCampagnes((prev) => [created, ...prev]);
    if (created.statut === 'En cours') {
      setActiveCampagneCode(created.code);
    }
  };

  const updateCampagne = (id: string, updates: Partial<CampagneAgricole>) => {
    setCampagnes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const cloturerCampagne = (
    id: string,
    bilanData: {
      dateCloture: string;
      motifCloture?: string;
      observationsBilan: string;
      productionReelleTonnes?: number;
      effectifReelAnimaux?: number;
      recettesReellesFCFA?: number;
      depensesReellesFCFA?: number;
      margeNetteFCFA?: number;
      validePar?: string;
    }
  ) => {
    setCampagnes((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              statut: 'Clôturée',
              ...bilanData,
            }
          : item
      )
    );
  };

  const rouvrirCampagne = (id: string) => {
    setCampagnes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, statut: 'En cours' } : item))
    );
  };

  const deleteCampagne = (id: string) => {
    setCampagnes((prev) => prev.filter((item) => item.id !== id));
  };

  // Reset to defaults
  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUsers(DEFAULT_USERS);
    setCurrentUser(DEFAULT_USERS[0]);
    setConfig(DEFAULT_CONFIG);
    setInterventions(SANTE_ANIMALE_DATA);
    setElevages(ELEVAGE_PARCELLES_DATA);
    setParcelles(PARCELLES_DATA);
    setTerrains(TERRAINS_DATA);
    setMembres(MEMBRES_DATA);
    setCollectes(COLLECTES_DATA);
    setCampagnes(CAMPAGNES_DATA);
    setActiveCampagneCode('CAMP-2026-A');
  };

  // Export JSON
  const exportDatabaseJSON = () => {
    const payload = {
      app: 'COOPS-FLOW',
      cooperative: config.nom,
      version: '2026.1',
      dateExport: new Date().toISOString(),
      data: {
        config,
        users,
        interventions,
        elevages,
        parcelles,
        terrains,
        membres,
        collectes,
        campagnes,
        activeCampagneCode,
      },
    };
    return JSON.stringify(payload, null, 2);
  };

  // Import JSON
  const importDatabaseJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.data) {
        if (parsed.data.users) setUsers(parsed.data.users);
        if (parsed.data.config) setConfig(parsed.data.config);
        if (parsed.data.interventions) setInterventions(parsed.data.interventions);
        if (parsed.data.elevages) setElevages(parsed.data.elevages);
        if (parsed.data.parcelles) setParcelles(parsed.data.parcelles);
        if (parsed.data.terrains) setTerrains(parsed.data.terrains);
        if (parsed.data.membres) setMembres(parsed.data.membres);
        if (parsed.data.collectes) setCollectes(parsed.data.collectes);
        if (parsed.data.campagnes) setCampagnes(parsed.data.campagnes);
        if (parsed.data.activeCampagneCode) setActiveCampagneCode(parsed.data.activeCampagneCode);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  };

  // Check permission helpers
  const canAccessModule = (moduleKey: NavigationTab): boolean => {
    return checkUserModuleAccess(currentUser, moduleKey);
  };

  const canAccessSubModule = (moduleKey: NavigationTab, subModuleKey: string): boolean => {
    return checkUserSubModuleAccess(currentUser, moduleKey, subModuleKey);
  };

  const can = (action: keyof CrudPermissions, moduleKey: NavigationTab, subModuleKey?: string): boolean => {
    return checkUserCrud(currentUser, moduleKey, action, subModuleKey);
  };

  const canPerform = (action: 'create' | 'edit' | 'delete' | 'validate', moduleKey?: string): boolean => {
    if (currentUser.role === 'super_admin' || currentUser.role === 'direction') return true;

    // Check module authorization
    if (moduleKey && currentUser.permissions.modulesAutorises) {
      const allowed = currentUser.permissions.modulesAutorises;
      if (!allowed.includes('all') && !allowed.includes(moduleKey)) {
        return false;
      }
    }

    switch (action) {
      case 'create':
        return !!currentUser.permissions.canCreate;
      case 'edit':
        return !!currentUser.permissions.canEdit;
      case 'delete':
        return !!currentUser.permissions.canDelete;
      case 'validate':
        return !!currentUser.permissions.canValidateFinances;
      default:
        return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        lockSession,
        switchUserWithPassword,
        users,
        currentUser,
        config,
        interventions,
        elevages,
        parcelles,
        terrains,
        membres,
        collectes,
        campagnes,
        activeCampagneCode,
        setActiveCampagneCode,
        addCampagne,
        updateCampagne,
        cloturerCampagne,
        rouvrirCampagne,
        deleteCampagne,
        setCurrentUser,
        switchUserById,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        updateConfig,
        addIntervention,
        updateIntervention,
        deleteIntervention,
        addElevageLot,
        updateElevageLot,
        deleteElevageLot,
        addParcelle,
        updateParcelle,
        deleteParcelle,
        addCultureCohabitante,
        removeCultureCohabitante,
        updateElevageOnParcelle,
        addTerrain,
        updateTerrain,
        deleteTerrain,
        addMembre,
        updateMembre,
        deleteMembre,
        addCollecte,
        resetToDefaultData,
        exportDatabaseJSON,
        importDatabaseJSON,
        canPerform,
        can,
        canAccessModule,
        canAccessSubModule,
        convexStatus,
        lastConvexSync,
        convexError,
        convexCloudUrl: CONVEX_CLOUD_URL,
        convexSiteUrl: CONVEX_SITE_URL,
        syncWithConvex,
        testConvexConnection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

import React, { useState, useMemo } from 'react';
import {
  AppUser,
  UserRole,
  ModulePermission,
  SubModulePermission,
  CrudPermissions,
  NavigationTab,
} from '../types';
import {
  MODULES_REGISTRY,
  ModuleDefinition,
  getDefaultPermissionsForRole,
  buildBlankModulePermissions,
  buildFullAccessModulePermissions,
  cloneModulePermissions,
  calculatePermissionStats,
} from '../data/modulesRegistry';
import {
  Users,
  ShieldCheck,
  KeyRound,
  Check,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  Lock,
  Unlock,
  Eye,
  Plus,
  Edit3,
  Trash2,
  CheckSquare,
  Square,
  Sparkles,
  Filter,
  Info,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface UserPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Omit<AppUser, 'id' | 'dernierAcces'>, existingId?: string) => void;
  existingUser?: AppUser | null;
}

export const UserPermissionsModal: React.FC<UserPermissionsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingUser,
}) => {
  // Identity Form
  const [nom, setNom] = useState(existingUser ? existingUser.nom : '');
  const [prenom, setPrenom] = useState(existingUser ? existingUser.prenom : '');
  const [email, setEmail] = useState(existingUser ? existingUser.email : '');
  const [telephone, setTelephone] = useState(existingUser ? existingUser.telephone : '+237 6');
  const [role, setRole] = useState<UserRole>(existingUser ? existingUser.role : 'agent_terrain');
  const [fonction, setFonction] = useState(
    existingUser ? existingUser.fonction : 'Agent de vulgarisation de terrain'
  );
  const [statut, setStatut] = useState<'Actif' | 'Suspendu' | 'Invité'>(
    existingUser ? existingUser.statut : 'Actif'
  );

  // Modules & Sub-Modules Permissions State
  const [modulesState, setModulesState] = useState<Record<string, ModulePermission>>(() => {
    if (existingUser?.permissions?.modules) {
      return cloneModulePermissions(existingUser.permissions.modules);
    }
    return getDefaultPermissionsForRole(existingUser ? existingUser.role : 'agent_terrain');
  });

  // UI state for accordion expansions
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    // Expand the first 3 modules by default
    return {
      accueil: true,
      terrains_parcelles: true,
      agriculture: true,
    };
  });

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Error validation
  const [validationError, setValidationError] = useState<string | null>(null);

  // Apply role preset template
  const handleApplyRolePreset = (newRole: UserRole) => {
    setRole(newRole);
    const template = getDefaultPermissionsForRole(newRole);
    setModulesState(template);

    // Default title suggestions
    switch (newRole) {
      case 'direction':
        setFonction('Directeur Général / Administrateur');
        break;
      case 'responsable_agricole':
        setFonction('Ingénieur Agronome - Chef Pôle Végétal');
        break;
      case 'responsable_elevage':
        setFonction('Docteur Vétérinaire - Chef Pôle Élevage');
        break;
      case 'responsable_stock':
        setFonction('Responsable Silos & Magasins Centraux');
        break;
      case 'comptable':
        setFonction('Trésorier / Comptable Général');
        break;
      case 'agent_terrain':
        setFonction('Agent de vulgarisation de terrain');
        break;
      case 'cooperateur':
        setFonction('Coopérateur Adhérent');
        break;
      case 'commercial':
        setFonction('Délégué Commercial & Ventes');
        break;
      case 'super_admin':
        setFonction('Super Administrateur Système');
        break;
    }
  };

  // Toggle Module visibility
  const handleToggleModuleAccess = (moduleKey: NavigationTab) => {
    setModulesState((prev) => {
      const next = cloneModulePermissions(prev);
      const mod = next[moduleKey];
      if (!mod) return prev;

      const newAccess = !mod.hasAccess;
      mod.hasAccess = newAccess;

      // If turning on access, enable read by default
      if (newAccess && !mod.crud.read) {
        mod.crud.read = true;
      }

      // Sync sub-modules
      Object.keys(mod.subModules).forEach((subKey) => {
        mod.subModules[subKey].hasAccess = newAccess;
        if (newAccess && !mod.subModules[subKey].crud.read) {
          mod.subModules[subKey].crud.read = true;
        }
      });

      return next;
    });
  };

  // Set Module CRUD
  const handleSetModuleCrud = (
    moduleKey: NavigationTab,
    verb: keyof CrudPermissions,
    val: boolean
  ) => {
    setModulesState((prev) => {
      const next = cloneModulePermissions(prev);
      const mod = next[moduleKey];
      if (!mod) return prev;

      mod.crud[verb] = val;

      // If user toggles C, U, or D, ensure module hasAccess and Read are enabled
      if (val) {
        mod.hasAccess = true;
        mod.crud.read = true;
      }

      // Propagate down to all active sub-modules
      Object.keys(mod.subModules).forEach((subKey) => {
        if (mod.subModules[subKey].hasAccess) {
          mod.subModules[subKey].crud[verb] = val;
          if (val) mod.subModules[subKey].crud.read = true;
        }
      });

      return next;
    });
  };

  // Toggle Sub-Module visibility
  const handleToggleSubModuleAccess = (moduleKey: NavigationTab, subModuleKey: string) => {
    setModulesState((prev) => {
      const next = cloneModulePermissions(prev);
      const mod = next[moduleKey];
      if (!mod || !mod.subModules[subModuleKey]) return prev;

      const currentSub = mod.subModules[subModuleKey];
      const newAccess = !currentSub.hasAccess;
      currentSub.hasAccess = newAccess;

      if (newAccess) {
        // If enabling a sub-module, ensure the parent module is active
        mod.hasAccess = true;
        mod.crud.read = true;
        currentSub.crud.read = true;
      }

      return next;
    });
  };

  // Set Sub-Module CRUD
  const handleSetSubModuleCrud = (
    moduleKey: NavigationTab,
    subModuleKey: string,
    verb: keyof CrudPermissions,
    val: boolean
  ) => {
    setModulesState((prev) => {
      const next = cloneModulePermissions(prev);
      const mod = next[moduleKey];
      if (!mod || !mod.subModules[subModuleKey]) return prev;

      const currentSub = mod.subModules[subModuleKey];
      currentSub.crud[verb] = val;

      if (val) {
        // If enabling C, U or D, ensure sub-module and parent module are active
        currentSub.hasAccess = true;
        currentSub.crud.read = true;
        mod.hasAccess = true;
        mod.crud.read = true;
        mod.crud[verb] = true;
      }

      return next;
    });
  };

  // Quick helper: Set all submodules of a module
  const handleSetAllSubModulesOfModule = (moduleKey: NavigationTab, enable: boolean) => {
    setModulesState((prev) => {
      const next = cloneModulePermissions(prev);
      const mod = next[moduleKey];
      if (!mod) return prev;

      mod.hasAccess = enable;
      if (enable) mod.crud.read = true;

      Object.keys(mod.subModules).forEach((subKey) => {
        mod.subModules[subKey].hasAccess = enable;
        if (enable) mod.subModules[subKey].crud.read = true;
      });

      return next;
    });
  };

  // Quick helper: Set CRUD pattern for a module
  const handleApplyPresetToModule = (
    moduleKey: NavigationTab,
    pattern: 'full' | 'read_only' | 'create_read'
  ) => {
    setModulesState((prev) => {
      const next = cloneModulePermissions(prev);
      const mod = next[moduleKey];
      if (!mod) return prev;

      mod.hasAccess = true;
      const crudValues: CrudPermissions = {
        create: pattern === 'full' || pattern === 'create_read',
        read: true,
        update: pattern === 'full',
        delete: pattern === 'full',
      };

      mod.crud = { ...crudValues };

      Object.keys(mod.subModules).forEach((subKey) => {
        mod.subModules[subKey].hasAccess = true;
        mod.subModules[subKey].crud = { ...crudValues };
      });

      return next;
    });
  };

  // Global actions
  const handleGlobalGrantAll = () => {
    setModulesState(buildFullAccessModulePermissions());
  };

  const handleGlobalReadOnly = () => {
    setModulesState((prev) => {
      const next = cloneModulePermissions(prev);
      Object.values(next).forEach((mod) => {
        mod.hasAccess = true;
        mod.crud = { create: false, read: true, update: false, delete: false };
        Object.values(mod.subModules).forEach((sm) => {
          sm.hasAccess = true;
          sm.crud = { create: false, read: true, update: false, delete: false };
        });
      });
      return next;
    });
  };

  const handleGlobalRevokeAll = () => {
    setModulesState(buildBlankModulePermissions());
  };

  // Toggle accordion expand
  const toggleAccordion = (moduleKey: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleKey]: !prev[moduleKey],
    }));
  };

  // Filter modules
  const filteredModules = useMemo(() => {
    return MODULES_REGISTRY.filter((mod) => {
      const matchesSearch =
        mod.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.subModules.some((sm) => sm.nom.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        categoryFilter === 'all' ||
        (categoryFilter === 'direction' && (mod.category === 'direction' || mod.key === 'accueil')) ||
        (categoryFilter === 'vegetal' && mod.category === 'vegetal') ||
        (categoryFilter === 'animal' && mod.category === 'animal') ||
        (categoryFilter === 'logistique' && mod.category === 'logistique') ||
        (categoryFilter === 'finance' && mod.category === 'finance') ||
        (categoryFilter === 'systeme' && mod.category === 'systeme');

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, categoryFilter]);

  // Permission stats
  const stats = useMemo(() => {
    return calculatePermissionStats(modulesState);
  }, [modulesState]);

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!nom.trim() || !email.trim()) {
      setValidationError('Le nom et l’adresse email professionnelle sont obligatoires.');
      return;
    }

    if (stats.activeModules === 0) {
      setValidationError('Veuillez accorder au moins un module à cet utilisateur.');
      return;
    }

    // Determine derived legacy flags
    const moduleList = Object.values(modulesState) as ModulePermission[];
    const canCreateAny = moduleList.some(
      (m) =>
        (m.hasAccess && m.crud.create) ||
        (Object.values(m.subModules) as SubModulePermission[]).some((sm) => sm.hasAccess && sm.crud.create)
    );
    const canEditAny = moduleList.some(
      (m) =>
        (m.hasAccess && m.crud.update) ||
        (Object.values(m.subModules) as SubModulePermission[]).some((sm) => sm.hasAccess && sm.crud.update)
    );
    const canDeleteAny = moduleList.some(
      (m) =>
        (m.hasAccess && m.crud.delete) ||
        (Object.values(m.subModules) as SubModulePermission[]).some((sm) => sm.hasAccess && sm.crud.delete)
    );
    const canValidateFinances =
      !!(modulesState['finances']?.hasAccess && modulesState['finances']?.crud.update);

    const authorizedModules = Object.entries(modulesState)
      .filter(([_, m]) => (m as ModulePermission).hasAccess)
      .map(([k]) => k);

    const userData: Omit<AppUser, 'id' | 'dernierAcces'> = {
      nom: nom.trim().toUpperCase(),
      prenom: prenom.trim(),
      email: email.trim(),
      role,
      fonction: fonction.trim() || 'Collaborateur',
      telephone: telephone.trim(),
      statut,
      permissions: {
        canCreate: canCreateAny,
        canEdit: canEditAny,
        canDelete: canDeleteAny,
        canValidateFinances: !!canValidateFinances,
        canExportData: true,
        modulesAutorises: authorizedModules,
        modules: modulesState,
      },
    };

    onSave(userData, existingUser?.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                {existingUser ? 'Modifier l’Utilisateur & ses Droits' : 'Créer un Nouvel Utilisateur'}
              </h2>
              <p className="text-[11px] text-slate-500">
                Attribution fine de la visibilité sur les modules, sous-modules et matrice CRUD (Création, Lecture, Modification, Suppression).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs">
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <Info className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Section 1: Informations d'Identité */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              1. Identité & Affectation Métier
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nom de famille *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: EBOGO"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none font-medium text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Prénom *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Patrice"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none font-medium text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email professionnel *</label>
                <input
                  type="email"
                  required
                  placeholder="p.ebogo@coops-ca-nkul.cm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Téléphone de contact</label>
                <input
                  type="text"
                  placeholder="+237 6..."
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none font-medium text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Rôle Système (Preset)</label>
                <select
                  value={role}
                  onChange={(e) => handleApplyRolePreset(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none font-semibold text-slate-800 bg-white"
                >
                  <option value="direction">Direction Générale (Tout accès)</option>
                  <option value="responsable_agricole">Responsable Pôle Végétal (Agro)</option>
                  <option value="responsable_elevage">Responsable Pôle Élevage (Véto)</option>
                  <option value="responsable_stock">Responsable Stocks & Logistique</option>
                  <option value="comptable">Trésorier / Comptable</option>
                  <option value="agent_terrain">Agent de Terrain (Saisie)</option>
                  <option value="cooperateur">Coopérateur Adhérent</option>
                  <option value="commercial">Commercial / Ventes</option>
                  <option value="super_admin">Super Administrateur</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Fonction / Titre affiché</label>
                <input
                  type="text"
                  placeholder="ex: Chef de Zone Obala"
                  value={fonction}
                  onChange={(e) => setFonction(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <span className="text-slate-700 font-bold">Statut du compte :</span>
              {(['Actif', 'Suspendu', 'Invité'] as const).map((st) => (
                <label key={st} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="statut"
                    checked={statut === st}
                    onChange={() => setStatut(st)}
                    className="text-emerald-700 focus:ring-emerald-600"
                  />
                  <span className="font-medium text-slate-800">{st}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 2: Matrice de visibilité & CRUD */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                  2. Habilitations Granulaires (Modules, Sous-Modules & CRUD)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Cochez l'accès au module puis affinez sous-module par sous-module avec les 4 droits fondamentaux.
                </p>
              </div>

              {/* Global shortcut buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleGlobalGrantAll}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold text-[11px] transition-colors"
                >
                  Tout autoriser (Full CRUD)
                </button>
                <button
                  type="button"
                  onClick={handleGlobalReadOnly}
                  className="px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 font-bold text-[11px] transition-colors"
                >
                  Lecture seule générale
                </button>
                <button
                  type="button"
                  onClick={handleGlobalRevokeAll}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-[11px] transition-colors"
                >
                  Tout réinitialiser
                </button>
              </div>
            </div>

            {/* Filter and search bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher un module ou sous-module..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-emerald-600 outline-none text-xs"
                />
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
                {[
                  { id: 'all', label: 'Tous' },
                  { id: 'vegetal', label: 'Pôle Végétal' },
                  { id: 'animal', label: 'Pôle Élevage' },
                  { id: 'logistique', label: 'Logistique & Stocks' },
                  { id: 'finance', label: 'Finances & Ventes' },
                  { id: 'direction', label: 'Direction & BI' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-colors ${
                      categoryFilter === cat.id
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modules List Accordion */}
            <div className="space-y-3">
              {filteredModules.map((modDef) => {
                const modState = modulesState[modDef.key] || {
                  key: modDef.key,
                  nom: modDef.nom,
                  hasAccess: false,
                  crud: { create: false, read: false, update: false, delete: false },
                  subModules: {},
                };

                const isExpanded = !!expandedModules[modDef.key];
                const activeSubCount = (
                  Object.values(modState.subModules || {}) as SubModulePermission[]
                ).filter((sm) => sm.hasAccess).length;
                const totalSubCount = modDef.subModules.length;

                return (
                  <div
                    key={modDef.key}
                    className={`rounded-xl border transition-all ${
                      modState.hasAccess
                        ? 'border-emerald-200 bg-emerald-50/10'
                        : 'border-slate-200 bg-slate-50/40 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {/* Module Header Row */}
                    <div className="p-3 flex flex-wrap items-center justify-between gap-3 bg-white rounded-t-xl">
                      <div className="flex items-center gap-2.5 min-w-[220px] flex-1">
                        <button
                          type="button"
                          onClick={() => toggleAccordion(modDef.key)}
                          className="p-1 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
                          title="Déplier / Replier les sous-modules"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-emerald-700" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </button>

                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={modState.hasAccess}
                            onChange={() => handleToggleModuleAccess(modDef.key)}
                            className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 accent-emerald-700 cursor-pointer"
                          />
                          <div>
                            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              {modDef.nom}
                              {modState.hasAccess ? (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-extrabold">
                                  Actif
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[9px] font-medium">
                                  Masqué
                                </span>
                              )}
                            </span>
                            <p className="text-[10px] text-slate-500 font-normal truncate max-w-sm">
                              {modDef.description}
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Submodules count badge */}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        {activeSubCount} / {totalSubCount} sous-modules
                      </span>

                      {/* Module Level CRUD Controls */}
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 mr-1 uppercase">
                          CRUD Module:
                        </span>
                        {(
                          [
                            { verb: 'create', label: 'C', title: 'Créer' },
                            { verb: 'read', label: 'R', title: 'Lire / Consulter' },
                            { verb: 'update', label: 'U', title: 'Modifier' },
                            { verb: 'delete', label: 'D', title: 'Supprimer' },
                          ] as const
                        ).map((v) => {
                          const isChecked = !!modState.crud[v.verb];
                          return (
                            <label
                              key={v.verb}
                              title={v.title}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold cursor-pointer border select-none transition-colors ${
                                isChecked
                                  ? v.verb === 'create'
                                    ? 'bg-emerald-600 text-white border-emerald-700'
                                    : v.verb === 'read'
                                    ? 'bg-sky-600 text-white border-sky-700'
                                    : v.verb === 'update'
                                    ? 'bg-amber-600 text-white border-amber-700'
                                    : 'bg-rose-600 text-white border-rose-700'
                                  : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) =>
                                  handleSetModuleCrud(modDef.key, v.verb, e.target.checked)
                                }
                                className="sr-only"
                              />
                              {v.label}
                            </label>
                          );
                        })}
                      </div>

                      {/* Quick presets for this module */}
                      <div className="flex items-center gap-1 text-[10px]">
                        <button
                          type="button"
                          onClick={() => handleApplyPresetToModule(modDef.key, 'full')}
                          className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 transition-colors"
                        >
                          Full CRUD
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPresetToModule(modDef.key, 'read_only')}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                        >
                          R seul
                        </button>
                      </div>
                    </div>

                    {/* Sub-Modules Accordion Body */}
                    {isExpanded && (
                      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2 rounded-b-xl">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between pb-1">
                          <span>Sous-Modules de {modDef.nom} :</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleSetAllSubModulesOfModule(modDef.key, true)}
                              className="text-emerald-700 hover:underline text-[10px] font-semibold"
                            >
                              Tous autoriser
                            </button>
                            <span className="text-slate-300">•</span>
                            <button
                              type="button"
                              onClick={() => handleSetAllSubModulesOfModule(modDef.key, false)}
                              className="text-slate-500 hover:underline text-[10px] font-semibold"
                            >
                              Aucun
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          {modDef.subModules.map((subDef) => {
                            const smState = modState.subModules?.[subDef.key] || {
                              key: subDef.key,
                              nom: subDef.nom,
                              description: subDef.description,
                              hasAccess: false,
                              crud: { create: false, read: false, update: false, delete: false },
                            };

                            return (
                              <div
                                key={subDef.key}
                                className={`p-2.5 rounded-lg border transition-all flex flex-wrap items-center justify-between gap-2.5 ${
                                  smState.hasAccess
                                    ? 'bg-white border-emerald-200 shadow-2xs'
                                    : 'bg-slate-100/60 border-slate-200/80 text-slate-400'
                                }`}
                              >
                                <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-[240px]">
                                  <input
                                    type="checkbox"
                                    checked={smState.hasAccess}
                                    onChange={() =>
                                      handleToggleSubModuleAccess(modDef.key, subDef.key)
                                    }
                                    className="w-3.5 h-3.5 rounded text-emerald-700 focus:ring-emerald-600 accent-emerald-700"
                                  />
                                  <div>
                                    <div
                                      className={`font-semibold text-xs ${
                                        smState.hasAccess ? 'text-slate-900' : 'text-slate-500'
                                      }`}
                                    >
                                      {subDef.nom}
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                      {subDef.description}
                                    </div>
                                  </div>
                                </label>

                                {/* Independent Sub-Module CRUD Checkboxes */}
                                <div className="flex items-center gap-1 shrink-0">
                                  {(
                                    [
                                      { verb: 'create', label: 'C', title: 'Créer dans ce sous-module' },
                                      { verb: 'read', label: 'R', title: 'Lire ce sous-module' },
                                      { verb: 'update', label: 'U', title: 'Modifier dans ce sous-module' },
                                      { verb: 'delete', label: 'D', title: 'Supprimer dans ce sous-module' },
                                    ] as const
                                  ).map((v) => {
                                    const isSubChecked = !!smState.crud[v.verb];
                                    return (
                                      <label
                                        key={v.verb}
                                        title={v.title}
                                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold cursor-pointer border select-none transition-colors ${
                                          isSubChecked
                                            ? v.verb === 'create'
                                              ? 'bg-emerald-600 text-white border-emerald-700'
                                              : v.verb === 'read'
                                              ? 'bg-sky-600 text-white border-sky-700'
                                              : v.verb === 'update'
                                              ? 'bg-amber-600 text-white border-amber-700'
                                              : 'bg-rose-600 text-white border-rose-700'
                                            : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-100'
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isSubChecked}
                                          onChange={(e) =>
                                            handleSetSubModuleCrud(
                                              modDef.key,
                                              subDef.key,
                                              v.verb,
                                              e.target.checked
                                            )
                                          }
                                          className="sr-only"
                                        />
                                        {v.label}
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom stats overview */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 text-emerald-900 font-medium">
              <span>
                Modules actifs : <strong>{stats.activeModules}</strong> / {stats.totalModules}
              </span>
              <span>
                Sous-modules actifs : <strong>{stats.activeSubModules}</strong> / {stats.totalSubModules}
              </span>
              <span>
                Droits CRUD alloués : <strong>{stats.totalCrudGranted}</strong>
              </span>
            </div>

            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Matrice RBAC / CRUD validée
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs transition-all"
            >
              <Check className="w-4 h-4" />
              <span>
                {existingUser ? 'Enregistrer les modifications' : 'Créer le compte utilisateur'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

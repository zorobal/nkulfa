import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, AppUser } from '../../types';
import { calculatePermissionStats } from '../../data/modulesRegistry';
import { UserPermissionsModal } from '../UserPermissionsModal';
import {
  Settings,
  Building2,
  Users,
  ShieldCheck,
  Database,
  Sliders,
  Plus,
  Save,
  Trash2,
  UserCheck,
  UserX,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  FileText,
  Wheat,
  Beef,
  HeartPulse,
  Warehouse,
  Info,
  Edit3,
  Layers,
  Lock,
  Unlock,
} from 'lucide-react';

export const ParametresModule: React.FC = () => {
  const {
    config,
    updateConfig,
    users,
    currentUser,
    switchUserById,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    resetToDefaultData,
    exportDatabaseJSON,
    importDatabaseJSON,
    interventions,
    elevages,
    parcelles,
    membres,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'cooperative' | 'utilisateurs' | 'referentiels' | 'seuils' | 'donnees'
  >('cooperative');

  // Form states for Cooperative
  const [coopForm, setCoopForm] = useState(config);
  const [isSavedCoop, setIsSavedCoop] = useState(false);

  // User Permissions Modal State (Add & Edit)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<AppUser | null>(null);

  // Reset confirmation modal
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveCoop = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(coopForm);
    setIsSavedCoop(true);
    setTimeout(() => setIsSavedCoop(false), 3000);
  };

  const handleOpenCreateUser = () => {
    setUserToEdit(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (u: AppUser) => {
    setUserToEdit(u);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (
    userData: Omit<AppUser, 'id' | 'dernierAcces'>,
    existingId?: string
  ) => {
    if (existingId) {
      updateUser(existingId, userData);
    } else {
      addUser(userData);
    }
    setIsUserModalOpen(false);
    setUserToEdit(null);
  };

  const handleExportJSON = () => {
    const dataStr = exportDatabaseJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `coops-flow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const success = importDatabaseJSON(text);
        if (success) {
          setImportStatus('Sauvegarde importée avec succès ! Les données ont été actualisées.');
        } else {
          setImportStatus('Erreur : le fichier importé n’a pas un format valide.');
        }
      } catch {
        setImportStatus('Erreur de lecture du fichier.');
      }
      setTimeout(() => setImportStatus(null), 5000);
    };
    reader.readAsText(file);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
      case 'direction':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'responsable_agricole':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'responsable_elevage':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'responsable_stock':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'comptable':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'cooperateur':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      default:
        return 'bg-teal-100 text-teal-800 border-teal-300';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'direction':
      case 'super_admin':
        return 'Direction Générale (Admin)';
      case 'responsable_agricole':
        return 'Pôle Végétal / Agronome';
      case 'responsable_elevage':
        return 'Pôle Élevage / Vétérinaire';
      case 'responsable_stock':
        return 'Stocks & Logistique';
      case 'comptable':
        return 'Trésorier / Finances';
      case 'agent_terrain':
        return 'Agent de Terrain';
      case 'cooperateur':
        return 'Coopérateur / Délégué';
      default:
        return role;
    }
  };

  return (
    <div className="space-y-4 p-3 sm:p-5 max-w-7xl mx-auto">
      {/* Module Title Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Paramètres & Configuration Système
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                v2026.1
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Gouvernance de la coopérative, droits d’accès utilisateurs (RBAC), référentiels & gestion des données.
            </p>
          </div>
        </div>

        {/* Current Active User Switcher Pill */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs">
          <span className="text-slate-500 font-medium">Session active :</span>
          <select
            value={currentUser.id}
            onChange={(e) => switchUserById(e.target.value)}
            className="bg-white font-bold text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.prenom} {u.nom} ({getRoleLabel(u.role)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex flex-wrap gap-1 shadow-2xs">
        <button
          onClick={() => setActiveTab('cooperative')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'cooperative'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>1. Coopérative & Identité</span>
        </button>

        <button
          onClick={() => setActiveTab('utilisateurs')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'utilisateurs'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>2. Utilisateurs & Droits (RBAC)</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
            {users.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('referentiels')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'referentiels'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. Référentiels Métier</span>
        </button>

        <button
          onClick={() => setActiveTab('seuils')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'seuils'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>4. Seuils d'Alerte & Biosécurité</span>
        </button>

        <button
          onClick={() => setActiveTab('donnees')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'donnees'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>5. Sauvegarde & Données</span>
        </button>
      </div>

      {/* TAB 1: COOPERATIVE & IDENTITE */}
      {activeTab === 'cooperative' && (
        <form onSubmit={handleSaveCoop} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                Fiche d'Identité de la Coopérative
              </h3>
              <p className="text-xs text-slate-500">
                Informations officielles conformes à l'Acte Uniforme OHADA relatif au droit des sociétés coopératives.
              </p>
            </div>
            {isSavedCoop && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 animate-pulse">
                <CheckCircle2 className="w-4 h-4" /> Modifié avec succès
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Raison Sociale</label>
              <input
                type="text"
                value={coopForm.nom}
                onChange={(e) => setCoopForm({ ...coopForm, nom: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 font-medium outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Sigle Institutionnel</label>
              <input
                type="text"
                value={coopForm.sigle}
                onChange={(e) => setCoopForm({ ...coopForm, sigle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 font-medium outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Forme Juridique</label>
              <input
                type="text"
                value={coopForm.formeJuridique}
                onChange={(e) => setCoopForm({ ...coopForm, formeJuridique: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 font-medium outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">N° Agrément MINADER</label>
              <input
                type="text"
                value={coopForm.numeroAgrement}
                onChange={(e) => setCoopForm({ ...coopForm, numeroAgrement: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 font-medium outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Immatriculation Registre OHADA</label>
              <input
                type="text"
                value={coopForm.registreOHADA}
                onChange={(e) => setCoopForm({ ...coopForm, registreOHADA: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 font-medium outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Année de Création</label>
              <input
                type="number"
                value={coopForm.anneeCreation}
                onChange={(e) => setCoopForm({ ...coopForm, anneeCreation: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 font-medium outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Siège Social</label>
              <input
                type="text"
                value={coopForm.siegeSocial}
                onChange={(e) => setCoopForm({ ...coopForm, siegeSocial: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 font-medium outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Boîte Postale</label>
              <input
                type="text"
                value={coopForm.boitePostale}
                onChange={(e) => setCoopForm({ ...coopForm, boitePostale: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 font-medium outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Devise Comptable</label>
              <input
                type="text"
                value={coopForm.devise}
                onChange={(e) => setCoopForm({ ...coopForm, devise: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 font-medium outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Téléphone de Contact</label>
              <input
                type="text"
                value={coopForm.telephone}
                onChange={(e) => setCoopForm({ ...coopForm, telephone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 font-medium outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Email Officiel</label>
              <input
                type="email"
                value={coopForm.email}
                onChange={(e) => setCoopForm({ ...coopForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 font-medium outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Campagne Active en Cours</label>
              <input
                type="text"
                value={coopForm.campagneActive}
                onChange={(e) => setCoopForm({ ...coopForm, campagneActive: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 font-medium outline-none"
              />
            </div>
          </div>

          {/* Governance Responsibles */}
          <div className="pt-3 border-t border-slate-200">
            <h4 className="font-bold text-slate-800 text-xs mb-3">Gouvernance & Chefs de Pôle</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Directeur Général / PCA</label>
                <input
                  type="text"
                  value={coopForm.responsableGeneral}
                  onChange={(e) => setCoopForm({ ...coopForm, responsableGeneral: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 font-medium outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Médecin Vétérinaire en Chef</label>
                <input
                  type="text"
                  value={coopForm.veterinaireChef}
                  onChange={(e) => setCoopForm({ ...coopForm, veterinaireChef: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 font-medium outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Ingénieur Agronome en Chef</label>
                <input
                  type="text"
                  value={coopForm.agronomeChef}
                  onChange={(e) => setCoopForm({ ...coopForm, agronomeChef: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 font-medium outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les modifications</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: UTILISATEURS & DROITS (RBAC) */}
      {activeTab === 'utilisateurs' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Gestion des Comptes Utilisateurs & Permissions (RBAC & CRUD)
                </h3>
                <p className="text-xs text-slate-500">
                  Attribution fine de la visibilité sur les 17 modules, leurs sous-modules et les 4 droits CRUD (Créer, Lire, Modifier, Supprimer).
                </p>
              </div>
              <button
                onClick={handleOpenCreateUser}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvel Utilisateur</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">Utilisateur</th>
                    <th className="py-2.5 px-3">Fonction & Pôle</th>
                    <th className="py-2.5 px-3">Rôle Système</th>
                    <th className="py-2.5 px-3">Visibilité Modules</th>
                    <th className="py-2.5 px-3">Matrice CRUD</th>
                    <th className="py-2.5 px-3">Statut</th>
                    <th className="py-2.5 px-3">Dernière Connexion</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => {
                    const isSelf = currentUser.id === u.id;
                    const stats = u.permissions?.modules
                      ? calculatePermissionStats(u.permissions.modules)
                      : null;
                    const activeModulesCount = stats
                      ? stats.activeModules
                      : u.permissions?.modulesAutorises?.includes('all')
                      ? 17
                      : u.permissions?.modulesAutorises?.length || 0;
                    const activeSubCount = stats ? stats.activeSubModules : 0;

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {u.prenom} {u.nom}
                            {isSelf && (
                              <span className="px-1.5 py-0.2 rounded-md bg-emerald-600 text-white text-[9px] font-extrabold">
                                Vous
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{u.email}</div>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">{u.fonction}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getRoleBadge(
                              u.role
                            )}`}
                          >
                            {getRoleLabel(u.role)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-flex items-center gap-1 font-bold text-slate-800 text-[11px]">
                              <Layers className="w-3 h-3 text-emerald-700" />
                              {activeModulesCount}/17 modules
                            </span>
                            {activeSubCount > 0 && (
                              <span className="text-[10px] text-slate-500 font-medium">
                                {activeSubCount} sous-modules actifs
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1 text-[10px] font-bold">
                            <span
                              title="Création"
                              className={`px-1.5 py-0.5 rounded border ${
                                u.permissions.canCreate
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-extrabold'
                                  : 'bg-slate-100 text-slate-400 border-slate-200'
                              }`}
                            >
                              C
                            </span>
                            <span
                              title="Lecture"
                              className="px-1.5 py-0.5 rounded border bg-sky-50 text-sky-700 border-sky-300 font-extrabold"
                            >
                              R
                            </span>
                            <span
                              title="Modification"
                              className={`px-1.5 py-0.5 rounded border ${
                                u.permissions.canEdit
                                  ? 'bg-amber-50 text-amber-700 border-amber-300 font-extrabold'
                                  : 'bg-slate-100 text-slate-400 border-slate-200'
                              }`}
                            >
                              U
                            </span>
                            <span
                              title="Suppression"
                              className={`px-1.5 py-0.5 rounded border ${
                                u.permissions.canDelete
                                  ? 'bg-rose-50 text-rose-700 border-rose-300 font-extrabold'
                                  : 'bg-slate-100 text-slate-400 border-slate-200'
                              }`}
                            >
                              D
                            </span>
                            {u.permissions.canValidateFinances && (
                              <span
                                title="Validation financière"
                                className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[9px] font-bold ml-0.5"
                              >
                                Val.Fin
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.statut === 'Actif'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {u.statut}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                          {u.dernierAcces}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditUser(u)}
                              className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition-colors flex items-center gap-1 border border-emerald-200"
                              title="Gérer les droits et accès modules / CRUD"
                            >
                              <KeyRound className="w-3 h-3 text-emerald-700" />
                              <span>Droits</span>
                            </button>
                            <button
                              onClick={() => switchUserById(u.id)}
                              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                              title="Basculer vers cette session"
                            >
                              Basculer
                            </button>
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title={u.statut === 'Actif' ? 'Suspendre' : 'Activer'}
                            >
                              {u.statut === 'Actif' ? (
                                <UserX className="w-3.5 h-3.5 text-amber-600" />
                              ) : (
                                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              )}
                            </button>
                            {!isSelf && (
                              <button
                                onClick={() => deleteUser(u.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Supprimer l'utilisateur"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Matrix of permissions visual guide */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs text-xs space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-emerald-700" />
              Matrice Standard des Droits & Habilitations Métier
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-slate-600">
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <span className="font-bold text-emerald-900 block mb-1">Direction & Admin</span>
                Accès illimité : création/modification de parcelles, validation des rémunérations financières, administration générale, purge et export.
              </div>
              <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100">
                <span className="font-bold text-sky-900 block mb-1">Responsables de Pôle (Vétérinaire / Agronome)</span>
                Gestion intégrale de leur secteur (saisie d’actes vétérinaires, enregistrement de lots, protocoles, suivis parcellaires).
              </div>
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                <span className="font-bold text-amber-900 block mb-1">Coopérateurs & Agents</span>
                Consultation de leurs parcelles, déclaration de récoltes et suivi des bordereaux de pesée en pesée publique.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REFERENTIELS METIER & NOMENCLATURES */}
      {activeTab === 'referentiels' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Cultures homologuées */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Wheat className="w-4 h-4 text-amber-600" />
                Cultures Végétales Homologuées (Pôle Végétal)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                8 espèces
              </span>
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { nom: 'Maïs Grain (CMS 8704)', cycle: '110 jours', cible: '4.5 t/ha', prix: '240 FCFA/kg' },
                { nom: 'Manioc Tubercules (TMS 92/0326)', cycle: '12 mois', cible: '18.0 t/ha', prix: '90 FCFA/kg' },
                { nom: 'Igname Blanche (Kponan)', cycle: '9 mois', cible: '12.0 t/ha', prix: '350 FCFA/kg' },
                { nom: 'Arachide (28-206)', cycle: '90 jours', cible: '1.8 t/ha', prix: '550 FCFA/kg' },
                { nom: 'Haricot Rouge (GLP-2)', cycle: '75 jours', cible: '1.4 t/ha', prix: '600 FCFA/kg' },
                { nom: 'Soja Jaune (TGX)', cycle: '100 jours', cible: '2.2 t/ha', prix: '380 FCFA/kg' },
              ].map((c) => (
                <div key={c.nom} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <div className="font-bold text-slate-800">{c.nom}</div>
                    <div className="text-[10px] text-slate-500">Cycle végétatif : {c.cycle} • Cible : {c.cible}</div>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                    {c.prix}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Espèces Animales */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Beef className="w-4 h-4 text-sky-600" />
                Espèces du Cheptel Pastoral (Pôle Élevage)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                6 espèces
              </span>
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { espece: 'Bovins', race: 'Goudali & Zébu Blanc', pds: '380 kg', unite: 'Têtes' },
                { espece: 'Porcins', race: 'Large White & Landrace', pds: '95 kg', unite: 'Têtes' },
                { espece: 'Volailles', race: 'Poulet Cobb 500 & Goliath', pds: '2.3 kg', unite: 'Sujets' },
                { espece: 'Caprins', race: 'Chèvre Naine de Guinée', pds: '32 kg', unite: 'Têtes' },
                { espece: 'Ovins', race: 'Mouton Djallonké', pds: '38 kg', unite: 'Têtes' },
                { espece: 'Pisciculture', race: 'Tilapia du Nil & Silure', pds: '0.6 kg', unite: 'Alevins' },
              ].map((e) => (
                <div key={e.espece} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <div className="font-bold text-slate-800">{e.espece} • <span className="text-slate-600 font-normal">{e.race}</span></div>
                    <div className="text-[10px] text-slate-500">Poids moyen cible : {e.pds}</div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-200">
                    {e.unite}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Protocoles Sanitaires */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                Protocoles Vaccinaux & Sanitaires Homologués
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                48 protocoles
              </span>
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { code: 'PR-NCD', intitule: 'Maladie de Newcastle (Aviculture)', freq: 'Semestriel', obligatoire: true },
                { code: 'PR-PPR', intitule: 'Peste des Petits Ruminants (Caprins/Ovins)', freq: 'Annuel', obligatoire: true },
                { code: 'PR-GUM', intitule: 'Bursite Infectieuse / Gumboro', freq: 'À J10 & J21', obligatoire: true },
                { code: 'PR-PCCB', intitule: 'Péripneumonie Contagieuse Bovine', freq: 'Annuel', obligatoire: true },
                { code: 'PR-ROT', intitule: 'Rouget Porcin & Parvovirose', freq: 'Reproduction', obligatoire: false },
              ].map((p) => (
                <div key={p.code} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                      <span className="font-mono text-emerald-800">{p.code}</span>
                      <span>{p.intitule}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Rythme : {p.freq}</div>
                  </div>
                  {p.obligatoire && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      Obligatoire
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Magasins & Silos */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Warehouse className="w-4 h-4 text-indigo-600" />
                Magasins Régionaux & Infrastructures de Stockage
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                5 sites
              </span>
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { nom: 'Silos Centraux Obala', cap: '1 200 tonnes', resp: 'Dieudonné Bikoula', zone: 'Centre' },
                { nom: 'Magasin Régional Yaoundé Nsam', cap: '800 tonnes', resp: 'Henriette Ngo', zone: 'Centre' },
                { nom: 'Station d’Agrégation Mbalmayo', cap: '450 tonnes', resp: 'Alain Ndongo', zone: 'Centre/Sud' },
                { nom: 'Hangar de Transit Sa’a', cap: '300 tonnes', resp: 'Marc Ebah', zone: 'Centre' },
              ].map((m) => (
                <div key={m.nom} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <div className="font-bold text-slate-800">{m.nom}</div>
                    <div className="text-[10px] text-slate-500">Capacité : {m.cap} • Responsable : {m.resp}</div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                    {m.zone}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SEUILS D'ALERTE & BIOSECURITE */}
      {activeTab === 'seuils' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-700" />
              Paramétrage des Seuils Critiques & Déclencheurs d'Alerte
            </h3>
            <p className="text-xs text-slate-500">
              Ces seuils régissent les avertissements automatiques dans les tableaux de bord et les rapports sanitaires.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Taux de Mortalité Critique Cheptel (%)</span>
                <span className="font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                  {config.seuilAlerteMortalitePct} %
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Si la mortalité d'un élevage dépasse ce seuil sur 30 jours consécutifs, une notification d'alerte épidémique est immédiatement transmise au Docteur Vétérinaire.
              </p>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={config.seuilAlerteMortalitePct}
                onChange={(e) => updateConfig({ seuilAlerteMortalitePct: Number(e.target.value) })}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Seuil de Stock Minimum Silos (kg)</span>
                <span className="font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  {config.seuilAlerteStockMinKg.toLocaleString()} kg
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                En dessous de ce stock dans un magasin régional, le voyant passe à l'orange pour déclencher un réapprovisionnement depuis les exploitations membres.
              </p>
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={config.seuilAlerteStockMinKg}
                onChange={(e) => updateConfig({ seuilAlerteStockMinKg: Number(e.target.value) })}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Taux de Ristourne Annuelle aux Membres (%)</span>
                <span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {config.tauxRistourneMembresPct} %
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Part des excédents nets d’exploitation redistribuée aux coopérateurs proportionnellement au volume de leurs apports (Règle RG-010).
              </p>
              <input
                type="range"
                min="3"
                max="20"
                step="0.5"
                value={config.tauxRistourneMembresPct}
                onChange={(e) => updateConfig({ tauxRistourneMembresPct: Number(e.target.value) })}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Délai d'Attente Sanitaire Lait / Viande</span>
                <span className="font-black text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                  14 jours
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Période d'interdiction formelle de livraison ou d'abattage suite à une antibiothérapie (traçabilité sanitaire garantie MINEPIA).
              </p>
              <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Vérification automatique appliquée dans le carnet sanitaire.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DONNEES, SAUVEGARDE & AUDIT */}
      {activeTab === 'donnees' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5">
            <div className="pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-700" />
                Gestion de la Base de Données & Continuité Opérationnelle
              </h3>
              <p className="text-xs text-slate-500">
                Sauvegardez vos données locales, exportez pour analyse externe ou restaurez les paramètres d'usine.
              </p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-slate-500 block">Membres inscrits</span>
                <span className="text-xl font-black text-slate-900">{membres.length}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-slate-500 block">Parcelles foncières</span>
                <span className="text-xl font-black text-slate-900">{parcelles.length}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-slate-500 block">Lots d’animaux</span>
                <span className="text-xl font-black text-slate-900">{elevages.length}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-slate-500 block">Actes sanitaires</span>
                <span className="text-xl font-black text-slate-900">{interventions.length}</span>
              </div>
            </div>

            {importStatus && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  importStatus.includes('succès')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                <Info className="w-4 h-4 shrink-0" />
                {importStatus}
              </div>
            )}

            {/* Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Export Button */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5 mb-1">
                    <Download className="w-4 h-4 text-emerald-700" />
                    Exportation Complète (JSON)
                  </h4>
                  <p className="text-[11px] text-emerald-800/80 mb-3">
                    Téléchargez un instantané complet de toutes les parcelles, cheptels, membres et actes sanitaires.
                  </p>
                </div>
                <button
                  onClick={handleExportJSON}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 shadow-xs transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exporter la base (.json)</span>
                </button>
              </div>

              {/* Import Button */}
              <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sky-900 text-xs flex items-center gap-1.5 mb-1">
                    <Upload className="w-4 h-4 text-sky-700" />
                    Restauration de Sauvegarde
                  </h4>
                  <p className="text-[11px] text-sky-800/80 mb-3">
                    Importez un fichier de sauvegarde précédemment exporté pour restaurer vos enregistrements.
                  </p>
                </div>
                <label className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-sky-700 text-white font-bold text-xs hover:bg-sky-800 shadow-xs transition-all cursor-pointer text-center">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Importer un fichier (.json)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Reset to Factory Defaults */}
              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-rose-900 text-xs flex items-center gap-1.5 mb-1">
                    <RotateCcw className="w-4 h-4 text-rose-700" />
                    Réinitialisation d'Usine
                  </h4>
                  <p className="text-[11px] text-rose-800/80 mb-3">
                    Restaure l'intégralité des données de démonstration conformes aux maquettes initiales.
                  </p>
                </div>
                <button
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-700 text-white font-bold text-xs hover:bg-rose-800 shadow-xs transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurer les données initiales</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: HABILITATIONS & GESTION UTILISATEUR */}
      <UserPermissionsModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setUserToEdit(null);
        }}
        onSave={handleSaveUser}
        existingUser={userToEdit}
      />

      {/* CONFIRM RESET MODAL */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Confirmer la réinitialisation ?</h3>
                <p className="text-xs text-slate-500">Cette action écrasera les modifications locales.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Toutes les données seront réinitialisées aux valeurs initiales d'usine (12 élevages, 286 têtes de bétail, 24 actes sanitaires et 6 utilisateurs par défaut).
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-xs"
              >
                Oui, réinitialiser tout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

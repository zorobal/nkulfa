import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  Bell,
  ChevronDown,
  User,
  Menu,
  Check,
  ShieldCheck,
  Compass,
  Plus,
  MapPin,
  Layers,
  Wheat,
  Beef,
  HeartPulse,
  Truck,
  DollarSign,
  Users,
  CalendarRange,
} from 'lucide-react';
import { APP_IMAGES } from '../assets/images';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  showPanoramicBanner?: boolean;
  onToggleMenu?: () => void;
  onOpenWorkflow?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  icon,
  showPanoramicBanner = false,
  onToggleMenu,
  onOpenWorkflow,
  onNavigateToTab,
}) => {
  const {
    currentUser,
    users,
    switchUserById,
    campagnes,
    activeCampagneCode,
    setActiveCampagneCode,
  } = useApp();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isPeriodMenuOpen, setIsPeriodMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const periodMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (createMenuRef.current && !createMenuRef.current.contains(event.target as Node)) {
        setIsCreateMenuOpen(false);
      }
      if (periodMenuRef.current && !periodMenuRef.current.contains(event.target as Node)) {
        setIsPeriodMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleActionClick = (tabName: string) => {
    setIsCreateMenuOpen(false);
    if (onNavigateToTab) {
      onNavigateToTab(tabName);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs shrink-0">
      {/* Title & Icon & Mobile Hamburger */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {onToggleMenu && (
          <button
            onClick={onToggleMenu}
            className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-emerald-800 transition-colors"
            title="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {icon && (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 tracking-tight leading-tight truncate">
            {title}
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">{subtitle}</p>
        </div>
      </div>

      {/* Right Controls: Period, Notifications, User Profile & Panoramic Banner */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
        {/* Universal Quick Action "Créer / Ajouter" Menu */}
        <div className="relative" ref={createMenuRef}>
          <button
            onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Créer ou ajouter un élément dans l'application"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Créer / Ajouter</span>
            <ChevronDown className="w-3 h-3 text-emerald-200" />
          </button>

          {isCreateMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 space-y-1 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <div className="font-bold text-slate-900">Actions Rapides de Création</div>
                <div className="text-[10px] text-slate-500">Choisissez ce que vous souhaitez ajouter :</div>
              </div>

              <button
                onClick={() => handleActionClick('campagnes')}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <CalendarRange className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold block">Campagne Agro-Pastorale</span>
                  <span className="text-[10px] text-slate-400 block">Ouvrir, planifier dates, parcelles et clôture</span>
                </div>
              </button>

              <button
                onClick={() => handleActionClick('terrains_parcelles')}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold block">Nouveau Terrain / Foncier</span>
                  <span className="text-[10px] text-slate-400 block">Titre foncier, commune, superficie</span>
                </div>
              </button>

              <button
                onClick={() => handleActionClick('terrains_parcelles')}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-blue-50 text-slate-700 hover:text-blue-900 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold block">Nouvelle Parcelle</span>
                  <span className="text-[10px] text-slate-400 block">Découpage et affectation culture/élevage</span>
                </div>
              </button>

              <button
                onClick={() => handleActionClick('agriculture')}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-amber-50 text-slate-700 hover:text-amber-900 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Wheat className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold block">Parcelle en Culture / Campagne</span>
                  <span className="text-[10px] text-slate-400 block">Semis Maïs, Manioc, Soja, suivi rendements</span>
                </div>
              </button>

              <button
                onClick={() => handleActionClick('sante_animale')}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-rose-50 text-slate-700 hover:text-rose-900 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                  <HeartPulse className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold block">Soin & Intervention Vétérinaire</span>
                  <span className="text-[10px] text-slate-400 block">Vaccins, déparasitage, registre médical</span>
                </div>
              </button>

              <button
                onClick={() => handleActionClick('collecte')}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-teal-50 text-slate-700 hover:text-teal-900 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold block">Nouvelle Collecte / Récolte</span>
                  <span className="text-[10px] text-slate-400 block">Bordereau pesée, humidité, magasin</span>
                </div>
              </button>

              <button
                onClick={() => handleActionClick('commercialisation')}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-purple-50 text-slate-700 hover:text-purple-900 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold block">Vente / Bon de Commande</span>
                  <span className="text-[10px] text-slate-400 block">Contrat client, facturation, trésorerie</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Guide & Workflow Quick Access Button */}
        {onOpenWorkflow && (
          <button
            onClick={onOpenWorkflow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors shadow-2xs cursor-pointer"
            title="Consulter le Guide d'utilisation et le Workflow opérationnel"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Guide & Workflow</span>
          </button>
        )}

        {/* Period Selector & Dynamic Active Campaign Dropdown */}
        <div className="relative hidden sm:block" ref={periodMenuRef}>
          <button
            onClick={() => setIsPeriodMenuOpen(!isPeriodMenuOpen)}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-medium shadow-2xs transition-colors cursor-pointer"
            title="Changer la campagne active ou voir le calendrier"
          >
            <CalendarRange className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              Campagne :{' '}
              <strong className="text-slate-900 font-bold">
                {activeCampagneCode || 'CAMP-2026-A'}
              </strong>
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isPeriodMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 space-y-1 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Campagnes Agro-Pastorales</div>
                  <div className="text-[10px] text-slate-500">Sélectionnez la saison en cours de travail :</div>
                </div>
                <button
                  onClick={() => {
                    setIsPeriodMenuOpen(false);
                    if (onNavigateToTab) onNavigateToTab('campagnes');
                  }}
                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                >
                  Voir tout
                </button>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-1">
                {campagnes.map((c) => {
                  const isSelected = c.code === activeCampagneCode;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveCampagneCode(c.code);
                        setIsPeriodMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs">{c.code}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                            {c.typeCampagne}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                          {c.nom || c.saison}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            c.statut === 'En cours'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.statut === 'Planifiée'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {c.statut}
                        </span>
                        {isSelected && (
                          <div className="text-[9px] text-emerald-600 font-bold mt-0.5">Active</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsPeriodMenuOpen(false);
                    if (onNavigateToTab) onNavigateToTab('campagnes');
                  }}
                  className="w-full py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CalendarRange className="w-3.5 h-3.5" />
                  <span>Gérer l'enchevêtrement & clôture</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative cursor-pointer p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <Bell className="w-4 h-4 text-slate-600" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
            3
          </span>
        </div>

        {/* User Profile Switcher */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:bg-slate-50 py-1 px-1.5 rounded-xl transition-colors text-left"
            title="Changer d'utilisateur / voir profil"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white border border-emerald-800 flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser.prenom[0]}
              {currentUser.nom[0]}
            </div>
            <div className="hidden md:block text-left leading-tight">
              <span className="text-xs font-bold text-slate-900 block truncate max-w-[130px]">
                {currentUser.prenom} {currentUser.nom}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold block truncate max-w-[130px]">
                {currentUser.fonction}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {/* Switch User Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 space-y-1 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <div className="font-bold text-slate-900">Gestion des Accès & Rôles</div>
                <div className="text-[10px] text-slate-500">
                  Sélectionnez un profil pour tester les permissions :
                </div>
              </div>

              {users.map((u) => {
                const isSelected = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUserById(u.id);
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold truncate">
                        {u.prenom} {u.nom}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{u.fonction}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                  </button>
                );
              })}

              <div className="pt-2 border-t border-slate-100 px-2 text-[10px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sécurité RBAC COOPS-FLOW active</span>
              </div>
            </div>
          )}
        </div>

        {/* Panoramic Pastoral Image Banner */}
        {showPanoramicBanner && (
          <div className="hidden xl:block w-44 h-11 rounded-xl overflow-hidden border border-emerald-200/80 shadow-xs shrink-0">
            <img
              src={APP_IMAGES.heroBanner}
              alt="Pastoral farm banner"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </header>
  );
};

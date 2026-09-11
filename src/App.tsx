import React, { useState } from 'react';
import { NavigationTab } from './types';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FooterBar } from './components/FooterBar';
import { DirectionDashboard } from './components/pages/DirectionDashboard';
import { TerrainsParcellesPage } from './components/pages/TerrainsParcellesPage';
import { SanteAnimalePages } from './components/pages/SanteAnimalePages';
import { ParametresModule } from './components/pages/ParametresModule';
import { SuiviCulturalModule } from './components/pages/SuiviCulturalModule';
import { WorkflowGuideModule } from './components/pages/WorkflowGuideModule';
import { AgricultureModule } from './components/AgricultureModule';
import { LivestockModule } from './components/LivestockModule';
import { SupplyChainModule } from './components/SupplyChainModule';
import { CommercialFinanceModule } from './components/CommercialFinanceModule';
import { BiAnalyticsModule } from './components/BiAnalyticsModule';
import { CampagnesManagerPage } from './components/pages/CampagnesManagerPage';
import { LoginScreen } from './components/LoginScreen';
import {
  Home,
  MapPin,
  Wheat,
  TrendingUp,
  Beef,
  HeartPulse,
  Utensils,
  Baby,
  Truck,
  Warehouse,
  ShoppingBag,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  Compass,
  CalendarRange,
  Lock,
  ShieldAlert,
} from 'lucide-react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('accueil');
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { canAccessModule, currentUser, isAuthenticated, switchUserById } = useApp();

  // If user locked or closed their session, display the secure login screen
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Synchronize Tab and Page Index
  const handleSelectTab = (tab: NavigationTab) => {
    setCurrentTab(tab);
    setIsMobileMenuOpen(false);

    if (tab === 'accueil') setPageIndex(1);
    else if (tab === 'terrains_parcelles') setPageIndex(2);
    else if (tab === 'agriculture') setPageIndex(3);
    else if (tab === 'suivi_cultural') setPageIndex(4);
    else if (tab === 'sante_animale') setPageIndex(5);
    else if (tab === 'elevage' || tab === 'alimentation' || tab === 'reproduction') setPageIndex(6);
    else if (tab === 'collecte' || tab === 'stocks') setPageIndex(7);
    else if (tab === 'commercialisation' || tab === 'finances' || tab === 'membres') setPageIndex(8);
    else if (tab === 'kpi_analyses') setPageIndex(9);
    else if (tab === 'parametres') setPageIndex(12);
  };

  const handlePrevPage = () => {
    if (pageIndex > 1) {
      const newPage = pageIndex - 1;
      setPageIndex(newPage);
      if (newPage === 1) setCurrentTab('accueil');
      else if (newPage === 2) setCurrentTab('terrains_parcelles');
      else if (newPage >= 3 && newPage <= 12) setCurrentTab('sante_animale');
    }
  };

  const handleNextPage = () => {
    if (pageIndex < 12) {
      const newPage = pageIndex + 1;
      setPageIndex(newPage);
      if (newPage === 1) setCurrentTab('accueil');
      else if (newPage === 2) setCurrentTab('terrains_parcelles');
      else if (newPage >= 3 && newPage <= 12) setCurrentTab('sante_animale');
    }
  };

  // Determine current page header title & subtitle
  const getHeaderInfo = () => {
    switch (currentTab) {
      case 'accueil':
        return {
          title: 'Tableau de bord – Direction',
          subtitle: "Vue d'ensemble de la coopérative",
          icon: <Home className="w-5 h-5 text-emerald-700" />,
          showPanoramic: true,
          footerTitle: 'Tableau de bord - Direction',
        };
      case 'terrains_parcelles':
        return {
          title: 'Terrains & Parcelles',
          subtitle: 'Gestion et suivi du foncier agricole',
          icon: <MapPin className="w-5 h-5 text-emerald-700" />,
          showPanoramic: false,
          footerTitle: 'Terrains & Parcelles',
        };
      case 'sante_animale':
        return {
          title: 'Santé Animale – Tableau de bord',
          subtitle: 'Surveillance épidémiologique & protocoles vétérinaires',
          icon: <HeartPulse className="w-5 h-5 text-rose-600" />,
          showPanoramic: false,
          footerTitle: 'Santé Animale',
        };
      case 'agriculture':
        return {
          title: 'Agriculture & Production Végétale',
          subtitle: 'Campagnes agricoles, objectifs de récolte, rendements t/ha et marges brutes',
          icon: <Wheat className="w-5 h-5 text-amber-700" />,
          showPanoramic: false,
          footerTitle: 'Production Végétale',
        };
      case 'suivi_cultural':
        return {
          title: 'Suivi Cultural & Travaux aux Champs',
          subtitle: 'Stades phénologiques, calendrier cultural, cahier d’interventions et météo',
          icon: <TrendingUp className="w-5 h-5 text-emerald-700" />,
          showPanoramic: false,
          footerTitle: 'Suivi Cultural',
        };
      case 'elevage':
      case 'alimentation':
      case 'reproduction':
        return {
          title: 'Élevage & Cheptel (Terrain → Parcelle → Lot)',
          subtitle: 'Suivi zootechnique, alimentation, GMQ et reproduction',
          icon: <Beef className="w-5 h-5 text-blue-700" />,
          showPanoramic: false,
          footerTitle: 'Élevage & Cheptel',
        };
      case 'collecte':
      case 'stocks':
        return {
          title: 'Collecte, Silos & Chaîne Logistique',
          subtitle: 'Magasins régionaux (Yaoundé, Obala, Mbalmayo) et minoterie',
          icon: <Warehouse className="w-5 h-5 text-emerald-700" />,
          showPanoramic: false,
          footerTitle: 'Stocks & Approvisionnement',
        };
      case 'commercialisation':
      case 'finances':
      case 'membres':
        return {
          title: 'Commercialisation, Finances & Rémunération',
          subtitle: 'Ventes produits finis et comptes individuels des membres (RG-010)',
          icon: <DollarSign className="w-5 h-5 text-purple-700" />,
          showPanoramic: false,
          footerTitle: 'Finances & Membres',
        };
      case 'kpi_analyses':
        return {
          title: 'Analyses BI & Décisions Stratégiques',
          subtitle: 'Moteur de calcul DAX/SQL et réponses aux 8 questions clés',
          icon: <BarChart3 className="w-5 h-5 text-indigo-700" />,
          showPanoramic: false,
          footerTitle: 'Business Intelligence',
        };
      case 'parametres':
        return {
          title: 'Paramètres & Configuration Système',
          subtitle: 'Gestion des utilisateurs, droits d’accès (RBAC), coopérative et maintenance',
          icon: <Settings className="w-5 h-5 text-emerald-700" />,
          showPanoramic: false,
          footerTitle: 'Paramètres & Système',
        };
      case 'workflow':
        return {
          title: 'Guide d’Utilisation & Workflow Opérationnel',
          subtitle: 'Cycle en 7 étapes, parcours par rôle métier, actions concrètes & règles de gestion (RG-001 à RG-010)',
          icon: <Compass className="w-5 h-5 text-emerald-700" />,
          showPanoramic: false,
          footerTitle: 'Guide & Workflow',
        };
      case 'campagnes':
        return {
          title: 'Campagnes & Cycles Agro-Pastoraux',
          subtitle: 'Ouverture, suivi des enchevêtrements spatio-temporels et clôture formelle',
          icon: <CalendarRange className="w-5 h-5 text-emerald-700" />,
          showPanoramic: false,
          footerTitle: 'Campagnes & Saisons',
        };
      default:
        return {
          title: 'COOPS-CA NKUL',
          subtitle: "Coopérative Agricole et d'Élevage",
          icon: <Home className="w-5 h-5" />,
          showPanoramic: false,
          footerTitle: 'Tableau de bord',
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={handleSelectTab}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          icon={headerInfo.icon}
          showPanoramicBanner={headerInfo.showPanoramic}
          onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenWorkflow={() => handleSelectTab('workflow')}
          onNavigateToTab={handleSelectTab}
        />

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 scrollbar-thin scrollbar-thumb-slate-300">
          {!canAccessModule(currentTab) ? (
            <div className="p-6 max-w-xl mx-auto my-12 text-center">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
                    Accès Non Autorisé
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-2">
                    Module Verrouillé pour Votre Profil
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
                    Votre profil actuel (<strong>{currentUser.prenom} {currentUser.nom}</strong> — <em>{currentUser.fonction}</em>) n'a pas reçu les habilitations requises pour accéder au module <strong>{headerInfo.title}</strong>.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => handleSelectTab('accueil')}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors"
                  >
                    Retourner à l'Accueil
                  </button>
                  <button
                    onClick={() => switchUserById('USR-001')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                  >
                    Basculer vers Direction (Admin)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {currentTab === 'accueil' && (
                <DirectionDashboard
                  onOpenWorkflow={() => handleSelectTab('workflow')}
                  onNavigateToTab={handleSelectTab}
                />
              )}
              {currentTab === 'workflow' && (
                <div className="p-3 sm:p-5 max-w-7xl mx-auto">
                  <WorkflowGuideModule onNavigateToTab={handleSelectTab} />
                </div>
              )}
              {currentTab === 'campagnes' && (
                <div className="p-3 sm:p-5 max-w-7xl mx-auto">
                  <CampagnesManagerPage onNavigateToTab={handleSelectTab} />
                </div>
              )}
              {currentTab === 'terrains_parcelles' && <TerrainsParcellesPage />}
              {currentTab === 'sante_animale' && (
                <SanteAnimalePages initialSubPage={Math.max(1, pageIndex - 2)} />
              )}

              {currentTab === 'agriculture' && (
                <div className="p-3 sm:p-5 max-w-7xl mx-auto">
                  <AgricultureModule />
                </div>
              )}

              {currentTab === 'suivi_cultural' && (
                <div className="p-3 sm:p-5 max-w-7xl mx-auto">
                  <SuiviCulturalModule />
                </div>
              )}

              {(currentTab === 'elevage' || currentTab === 'alimentation' || currentTab === 'reproduction') && (
                <div className="p-3 sm:p-5 max-w-7xl mx-auto">
                  <LivestockModule
                    initialSubTab={
                      currentTab === 'alimentation'
                        ? 'alimentation'
                        : currentTab === 'reproduction'
                        ? 'reproduction'
                        : 'parcelles'
                    }
                  />
                </div>
              )}

              {(currentTab === 'collecte' || currentTab === 'stocks') && (
                <div className="p-3 sm:p-5 max-w-7xl mx-auto">
                  <SupplyChainModule
                    initialTab={currentTab === 'stocks' ? 'magasins' : 'collecte'}
                  />
                </div>
              )}

              {(currentTab === 'commercialisation' || currentTab === 'finances' || currentTab === 'membres') && (
                <div className="p-3 sm:p-5 max-w-7xl mx-auto">
                  <CommercialFinanceModule
                    initialTab={
                      currentTab === 'finances'
                        ? 'tresorerie'
                        : currentTab === 'membres'
                        ? 'cooperateurs'
                        : 'ventes'
                    }
                  />
                </div>
              )}

              {currentTab === 'kpi_analyses' && (
                <div className="p-3 sm:p-5 max-w-7xl mx-auto">
                  <BiAnalyticsModule />
                </div>
              )}

              {currentTab === 'parametres' && (
                <div className="p-3 sm:p-5 max-w-7xl mx-auto">
                  <ParametresModule />
                </div>
              )}
            </>
          )}
        </main>

        {/* Bottom Footer Bar with Page Controls */}
        <FooterBar
          currentTitle={headerInfo.footerTitle}
          currentPage={pageIndex}
          totalPages={12}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

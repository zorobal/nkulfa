import React, { useState } from 'react';
import { NavigationTab } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FooterBar } from './components/FooterBar';
import { DirectionDashboard } from './components/pages/DirectionDashboard';
import { TerrainsParcellesPage } from './components/pages/TerrainsParcellesPage';
import { SanteAnimalePages } from './components/pages/SanteAnimalePages';
import { AgricultureModule } from './components/AgricultureModule';
import { LivestockModule } from './components/LivestockModule';
import { SupplyChainModule } from './components/SupplyChainModule';
import { CommercialFinanceModule } from './components/CommercialFinanceModule';
import { BiAnalyticsModule } from './components/BiAnalyticsModule';
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
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('accueil');
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Synchronize Tab and Page Index
  const handleSelectTab = (tab: NavigationTab) => {
    setCurrentTab(tab);
    setIsMobileMenuOpen(false);

    if (tab === 'accueil') setPageIndex(1);
    else if (tab === 'terrains_parcelles') setPageIndex(2);
    else if (tab === 'sante_animale') setPageIndex(3);
    else if (tab === 'agriculture' || tab === 'suivi_cultural') setPageIndex(4);
    else if (tab === 'elevage' || tab === 'alimentation' || tab === 'reproduction') setPageIndex(5);
    else if (tab === 'collecte' || tab === 'stocks') setPageIndex(6);
    else if (tab === 'commercialisation' || tab === 'finances' || tab === 'membres') setPageIndex(7);
    else if (tab === 'kpi_analyses') setPageIndex(8);
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
      case 'suivi_cultural':
        return {
          title: 'Agriculture & Suivi Cultural',
          subtitle: 'Campagne 2026-A – Suivi parcellaire et rendements t/ha',
          icon: <Wheat className="w-5 h-5 text-amber-700" />,
          showPanoramic: false,
          footerTitle: 'Pôle Végétal',
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
        />

        {/* Quick Tabs Pill Bar for effortless switching */}
        <div className="bg-white border-b border-slate-200/80 px-3 sm:px-5 py-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase mr-1 whitespace-nowrap">
            Accès rapide :
          </span>
          <button
            onClick={() => handleSelectTab('accueil')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'accueil'
                ? 'bg-emerald-800 text-white shadow-2xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Direction</span>
          </button>
          <button
            onClick={() => handleSelectTab('terrains_parcelles')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'terrains_parcelles'
                ? 'bg-emerald-800 text-white shadow-2xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Terrains & Parcelles</span>
          </button>
          <button
            onClick={() => handleSelectTab('sante_animale')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'sante_animale'
                ? 'bg-emerald-800 text-white shadow-2xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            <span>Santé Animale</span>
          </button>
          <button
            onClick={() => handleSelectTab('agriculture')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'agriculture' || currentTab === 'suivi_cultural'
                ? 'bg-emerald-800 text-white shadow-2xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Wheat className="w-3.5 h-3.5 text-amber-500" />
            <span>Agriculture</span>
          </button>
          <button
            onClick={() => handleSelectTab('elevage')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'elevage' || currentTab === 'alimentation' || currentTab === 'reproduction'
                ? 'bg-emerald-800 text-white shadow-2xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Beef className="w-3.5 h-3.5 text-blue-500" />
            <span>Élevage & Cheptel</span>
          </button>
          <button
            onClick={() => handleSelectTab('collecte')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'collecte' || currentTab === 'stocks'
                ? 'bg-emerald-800 text-white shadow-2xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Warehouse className="w-3.5 h-3.5 text-indigo-500" />
            <span>Collecte & Stocks</span>
          </button>
          <button
            onClick={() => handleSelectTab('finances')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'commercialisation' || currentTab === 'finances' || currentTab === 'membres'
                ? 'bg-emerald-800 text-white shadow-2xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            <span>Finances & Ventes</span>
          </button>
          <button
            onClick={() => handleSelectTab('kpi_analyses')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'kpi_analyses'
                ? 'bg-emerald-800 text-white shadow-2xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-500" />
            <span>BI & Décisions</span>
          </button>
        </div>

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 scrollbar-thin scrollbar-thumb-slate-300">
          {currentTab === 'accueil' && <DirectionDashboard />}
          {currentTab === 'terrains_parcelles' && <TerrainsParcellesPage />}
          {currentTab === 'sante_animale' && (
            <SanteAnimalePages initialSubPage={Math.max(1, pageIndex - 2)} />
          )}

          {(currentTab === 'agriculture' || currentTab === 'suivi_cultural') && (
            <div className="p-3 sm:p-5 max-w-7xl mx-auto">
              <AgricultureModule />
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

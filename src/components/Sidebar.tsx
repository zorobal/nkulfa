import React from 'react';
import { NavigationTab } from '../types';
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
  Sprout,
  ShieldCheck,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isOpen = false,
  onClose,
}) => {
  const menuItems = [
    {
      id: 'accueil' as NavigationTab,
      label: 'Accueil',
      sublabel: 'Tableau de bord',
      icon: Home,
    },
    {
      id: 'terrains_parcelles' as NavigationTab,
      label: 'Terrains & Parcelles',
      icon: MapPin,
    },
    {
      id: 'agriculture' as NavigationTab,
      label: 'Agriculture / Production',
      icon: Wheat,
    },
    {
      id: 'suivi_cultural' as NavigationTab,
      label: 'Suivi cultural',
      icon: TrendingUp,
    },
    {
      id: 'elevage' as NavigationTab,
      label: 'Élevage',
      icon: Beef,
    },
    {
      id: 'sante_animale' as NavigationTab,
      label: 'Santé animale',
      icon: HeartPulse,
    },
    {
      id: 'alimentation' as NavigationTab,
      label: 'Alimentation & croissance',
      icon: Utensils,
    },
    {
      id: 'reproduction' as NavigationTab,
      label: 'Reproduction & cheptel',
      icon: Baby,
    },
    {
      id: 'collecte' as NavigationTab,
      label: 'Collecte',
      icon: Truck,
    },
    {
      id: 'stocks' as NavigationTab,
      label: 'Stocks',
      icon: Warehouse,
    },
    {
      id: 'commercialisation' as NavigationTab,
      label: 'Commercialisation / Ventes',
      icon: ShoppingBag,
    },
    {
      id: 'finances' as NavigationTab,
      label: 'Finances',
      icon: DollarSign,
    },
    {
      id: 'membres' as NavigationTab,
      label: 'Membres & Exploitations',
      icon: Users,
    },
    {
      id: 'kpi_analyses' as NavigationTab,
      label: 'Analyses & KPI',
      icon: BarChart3,
    },
  ];

  const handleSelect = (id: NavigationTab) => {
    setCurrentTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Aside Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#053e2d] text-emerald-100 flex flex-col shrink-0 border-r border-[#084b37] transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header from Screenshot 2 & 3 */}
        <div className="p-3.5 border-b border-[#0b543e] flex items-center justify-between">
          <div className="bg-white rounded-xl p-2.5 flex items-center gap-2.5 shadow-sm flex-1 mr-1">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <Sprout className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-black text-[#053e2d] tracking-tight truncate leading-tight">
                COOPS-CA NKUL
              </div>
              <div className="text-[9px] font-semibold text-emerald-700 tracking-wide truncate">
                Coopérative Agricole & Élevage
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-[#0b543e] transition-colors"
            title="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tab List */}
        <div className="flex-1 overflow-y-auto py-2 px-2.5 space-y-0.5 scrollbar-thin scrollbar-thumb-emerald-800">
          <div className="px-2 py-1 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
            Menu Principal
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-[#1b7e57] text-white shadow-xs font-bold'
                    : 'text-emerald-100/80 hover:bg-[#0a4f3a] hover:text-white'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-emerald-300 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate flex-1">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info box matching screenshots */}
        <div className="p-3 border-t border-[#0b543e] bg-[#032a1e]">
          <div className="flex items-center gap-2 text-[10px] text-emerald-300 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">COOPS-FLOW v2026.1 • Cameroun</span>
          </div>
          <p className="text-[9px] text-emerald-400/60 mt-1 italic leading-tight">
            « Une coopérative forte, une agriculture durable »
          </p>
        </div>
      </aside>
    </>
  );
};

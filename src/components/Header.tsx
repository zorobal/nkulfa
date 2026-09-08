import React from 'react';
import { Calendar, Bell, ChevronDown, User, Menu } from 'lucide-react';
import { APP_IMAGES } from '../assets/images';

interface HeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  showPanoramicBanner?: boolean;
  onToggleMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  icon,
  showPanoramicBanner = false,
  onToggleMenu,
}) => {
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
        {/* Period Selector */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-medium shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
          <span>Période : <strong>Janv. 2025 – Déc. 2025</strong></span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Notification Bell */}
        <div className="relative cursor-pointer p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <Bell className="w-4 h-4 text-slate-600" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
            3
          </span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center">
            <User className="w-4 h-4 text-slate-600" />
          </div>
          <div className="hidden md:block text-left leading-tight">
            <span className="text-xs font-bold text-slate-900 block">Directeur</span>
            <span className="text-[10px] text-slate-500 font-medium">Direction Générale</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
        </div>

        {/* Panoramic Pastoral Image Banner (Screenshot 2 Top Right) */}
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

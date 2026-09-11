import React, { useState } from 'react';
import {
  Cloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Zap,
  Globe,
  Database,
  ExternalLink,
  ShieldCheck,
  Activity,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConvexConnectionTest } from '../services/convexService';

interface ConvexSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConvexSyncModal: React.FC<ConvexSyncModalProps> = ({ isOpen, onClose }) => {
  const {
    convexStatus,
    lastConvexSync,
    convexError,
    convexCloudUrl,
    convexSiteUrl,
    syncWithConvex,
    testConvexConnection,
    membres,
    collectes,
    users,
    campagnes,
  } = useApp();

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConvexConnectionTest | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testConvexConnection();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        cloudOk: false,
        siteOk: false,
        overallSuccess: false,
        details: err.message || 'Erreur lors du test',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleForcePush = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await syncWithConvex(true);
      setSyncFeedback(res);
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePull = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await syncWithConvex(false);
      setSyncFeedback(res);
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastSync = (ts: number | null) => {
    if (!ts) return 'En cours de première synchronisation...';
    const date = new Date(ts);
    return `Aujourd’hui à ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Cloud className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                <span>Base de Données Convex Cloud</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  EU-West-1
                </span>
              </h3>
              <p className="text-xs text-emerald-200/80">
                Frontend Vercel • Backend Convex.dev • Priorité Base Cloud
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Priority Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>Convex est prioritaire sur le LocalStorage</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-600 text-white font-extrabold">
                  Priorité Active
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Toutes les requêtes entrantes (lecture au démarrage) et sortantes (sauvegarde des adhérents, collectes, campagnes) ciblent en priorité Convex. Le LocalStorage n’agit que comme miroir de secours et cache hors-ligne.
              </p>
            </div>
          </div>

          {/* Configuration Endpoints */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-700" />
                <span>Paramètres de Connexion Cloud</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Vercel ⇄ Convex</span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">
                  Cloud URL (API & WebSocket)
                </span>
                <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800">
                  <span className="truncate">{convexCloudUrl}</span>
                  <a
                    href={convexCloudUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 ml-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">
                  HTTP Actions URL (REST Endpoints)
                </span>
                <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800">
                  <span className="truncate">{convexSiteUrl}</span>
                  <a
                    href={convexSiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 ml-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sync Status & Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold block">État de synchronisation</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="relative flex h-2.5 w-2.5">
                  {convexStatus === 'connected' && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      convexStatus === 'connected'
                        ? 'bg-emerald-500'
                        : convexStatus === 'syncing'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  ></span>
                </span>
                <span className="font-bold text-slate-800 capitalize">
                  {convexStatus === 'connected'
                    ? 'Connecté & Actif'
                    : convexStatus === 'syncing'
                    ? 'Synchronisation...'
                    : convexStatus === 'connecting'
                    ? 'Connexion...'
                    : 'Cache local'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {formatLastSync(lastConvexSync)}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold block">Données Prêtes pour Convex</span>
              <div className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-2">
                <span>{membres.length} adhérents</span>
                <span className="text-slate-300">•</span>
                <span>{collectes.length} collectes</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {users.length} comptes • {campagnes.length} campagnes
              </span>
            </div>
          </div>

          {/* Diagnostic Test Panel */}
          {testResult && (
            <div
              className={`p-3 rounded-2xl border ${
                testResult.overallSuccess
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              } text-[11px] space-y-1.5 animate-in fade-in`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {testResult.overallSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>Diagnostic de Connexion Convex</span>
              </div>
              <div className="space-y-0.5 text-[10px] text-slate-600 font-mono">
                <div>• Cloud URL: {testResult.cloudStatusText}</div>
                <div>• HTTP Site: {testResult.siteStatusText}</div>
              </div>
              <div className="text-[10px] text-slate-500 font-sans">{testResult.details}</div>
            </div>
          )}

          {/* Feedback banner */}
          {syncFeedback && (
            <div
              className={`p-2.5 rounded-xl border text-[11px] font-semibold flex items-center gap-2 ${
                syncFeedback.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{syncFeedback.message}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <button
              onClick={handleTest}
              disabled={isTesting}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Activity className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Test en cours...' : 'Tester connexion'}</span>
            </button>

            <button
              onClick={handleForcePush}
              disabled={isSyncing}
              className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Cloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>Pousser vers Convex</span>
            </button>

            <button
              onClick={handlePull}
              disabled={isSyncing}
              className="px-3 py-2 rounded-xl border border-emerald-600 text-emerald-800 hover:bg-emerald-50 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Recharger Convex</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span>Frontend: Vercel • Backend: Convex Cloud</span>
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold cursor-pointer transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

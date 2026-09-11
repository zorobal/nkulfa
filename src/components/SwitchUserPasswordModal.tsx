import React, { useState, useEffect, useRef } from 'react';
import { AppUser } from '../types';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  UserCheck,
  KeyRound,
} from 'lucide-react';

interface SwitchUserPasswordModalProps {
  isOpen: boolean;
  targetUser: AppUser | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SwitchUserPasswordModal: React.FC<SwitchUserPasswordModalProps> = ({
  isOpen,
  targetUser,
  onClose,
  onSuccess,
}) => {
  const { switchUserWithPassword } = useApp();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setErrorMessage(null);
      setShowPassword(false);
      setIsSubmitting(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, targetUser]);

  if (!isOpen || !targetUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('Veuillez saisir le mot de passe de cet utilisateur.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = switchUserWithPassword(targetUser.id, password.trim());
    setIsSubmitting(false);

    if (result.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setErrorMessage(result.error || 'Mot de passe incorrect.');
      inputRef.current?.select();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Sécurité des Sessions</h3>
              <p className="text-[11px] text-slate-400">Authentification requise pour changer de profil</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Target User Card */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-11 h-11 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
              {targetUser.prenom[0]}
              {targetUser.nom[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-sm text-slate-900">
                  {targetUser.prenom} {targetUser.nom}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-semibold">
                  @{targetUser.login}
                </span>
              </div>
              <div className="text-xs text-slate-500 truncate">{targetUser.fonction}</div>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Pour des raisons de conformité et de traçabilité des opérations, veuillez saisir le mot de passe associé au compte <span className="font-semibold text-slate-800">@{targetUser.login}</span>.
          </p>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-snug">
                <span className="font-bold">Accès refusé :</span> {errorMessage}
              </div>
            </div>
          )}

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Mot de passe de session
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Saisissez le mot de passe..."
                className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                title={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
              <span>Mot de passe démo par défaut : <strong className="font-mono text-emerald-700">coop2026</strong></span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>Valider et Basculer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

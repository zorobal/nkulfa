import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Unlock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sprout,
  Users,
  Wheat,
  Beef,
  Building2,
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, users, config } = useApp();
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Demo accounts unlock protection (Password: virtuose002)
  const [isDemoUnlocked, setIsDemoUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem('demo_accounts_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [showDemoPasswordPrompt, setShowDemoPasswordPrompt] = useState(false);
  const [demoUnlockPassword, setDemoUnlockPassword] = useState('');
  const [demoUnlockError, setDemoUnlockError] = useState<string | null>(null);

  const handleUnlockDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoUnlockPassword.trim() === 'virtuose002') {
      setIsDemoUnlocked(true);
      setShowDemoPasswordPrompt(false);
      setDemoUnlockPassword('');
      setDemoUnlockError(null);
      try {
        sessionStorage.setItem('demo_accounts_unlocked', 'true');
      } catch {}
    } else {
      setDemoUnlockError('Mot de passe incorrect. Clé requise : virtuose002');
    }
  };

  const handleLockDemo = () => {
    setIsDemoUnlocked(false);
    setShowDemoPasswordPrompt(false);
    setDemoUnlockPassword('');
    setDemoUnlockError(null);
    try {
      sessionStorage.removeItem('demo_accounts_unlocked');
    } catch {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim()) {
      setErrorMessage("Veuillez renseigner votre identifiant / login.");
      return;
    }
    if (!passwordInput) {
      setErrorMessage("Veuillez renseigner votre mot de passe.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = login(loginInput.trim(), passwordInput);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || "Identifiant ou mot de passe incorrect.");
    }
  };

  const handleSelectQuickAccount = (accountLogin: string) => {
    setLoginInput(accountLogin);
    setPasswordInput('coop2026');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-[#022c22] flex flex-col justify-between text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-lg border border-emerald-400/30">
            <Sprout className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>{config.sigle || 'COOPS-CA NKUL'}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-700/50">
                OHADA Règle RG-012
              </span>
            </div>
            <div className="text-xs text-emerald-300/80 font-medium">
              {config.nom || 'Société Coopérative Agricole et Pastorale'}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-300/80 bg-emerald-900/40 border border-emerald-800/60 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Poste Sécurisé • Session Verrouillée</span>
        </div>
      </div>

      {/* Main Authentication Container */}
      <div className="max-w-4xl w-full mx-auto my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Branding & Security Rules */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Accès Contrôlé par Identifiant & Mot de Passe</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Connexion Sécurisée à l’Espace Coopératif
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Pour des raisons de confidentialité des comptes d'adhérents, des stocks de minoterie et des opérations financières, la session requiert votre <strong className="text-white">login personnel</strong> et votre <strong className="text-white">mot de passe</strong> (et non une adresse email).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
                <Wheat className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Traçabilité Opérations</div>
                  <div className="text-[11px] text-slate-400">Collectes, parcelles et lots d’élevage</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Verrouillage Poste</div>
                  <div className="text-[11px] text-slate-400">Fermeture immédiate en cas de départ</div>
                </div>
              </div>
            </div>

            {/* Quick Demo Accounts Helper - Protected by password 'virtuose002' */}
            {!isDemoUnlocked ? (
              <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-800/60 text-xs space-y-2.5 transition-all">
                <div className="flex items-center justify-between text-emerald-200 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Comptes de Démonstration (Cliquez pour remplir)</span>
                  </span>
                  <span className="text-[10px] font-semibold text-amber-300 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-amber-400" />
                    <span>Accès Protégé</span>
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Cette section de pré-remplissage rapide est sécurisée. Elle requiert un mot de passe d'activation pour être accessible.
                </p>

                {!showDemoPasswordPrompt ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowDemoPasswordPrompt(true);
                      setDemoUnlockError(null);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-900/70 hover:bg-emerald-800 border border-emerald-700/70 text-emerald-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Déverrouiller avec le mot de passe</span>
                  </button>
                ) : (
                  <form onSubmit={handleUnlockDemo} className="space-y-2 pt-1">
                    <div className="flex items-center gap-1.5">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                          <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <input
                          type="password"
                          value={demoUnlockPassword}
                          onChange={(e) => {
                            setDemoUnlockPassword(e.target.value);
                            if (demoUnlockError) setDemoUnlockError(null);
                          }}
                          placeholder="Mot de passe d'activation..."
                          autoFocus
                          className="w-full pl-8 pr-3 py-1.5 bg-slate-900/90 border border-emerald-600 rounded-xl text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shrink-0 shadow-xs"
                      >
                        Activer
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDemoPasswordPrompt(false);
                          setDemoUnlockError(null);
                          setDemoUnlockPassword('');
                        }}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer shrink-0"
                      >
                        Annuler
                      </button>
                    </div>

                    {demoUnlockError && (
                      <div className="p-2 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-[11px] font-semibold flex items-center gap-1.5 animate-in fade-in">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{demoUnlockError}</span>
                      </div>
                    )}
                  </form>
                )}
              </div>
            ) : (
              /* Unlocked Demo Accounts List */
              <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-600/70 text-xs space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-emerald-200 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Comptes de Démonstration (Cliquez pour remplir) :</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/90 px-2 py-0.5 rounded border border-emerald-700/50">
                      MDP : coop2026
                    </span>
                    <button
                      type="button"
                      onClick={handleLockDemo}
                      className="text-[10px] text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Verrouiller à nouveau cette section"
                    >
                      <Lock className="w-2.5 h-2.5 text-slate-400" />
                      <span>Verrouiller</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleSelectQuickAccount(u.login)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        loginInput.toLowerCase() === u.login.toLowerCase()
                          ? 'bg-emerald-800 text-white border-emerald-400 font-bold'
                          : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:bg-emerald-900/40 hover:text-white hover:border-emerald-700'
                      }`}
                    >
                      <div className="font-mono text-[11px] font-bold text-emerald-300 truncate">
                        @{u.login}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {u.prenom} {u.nom}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Login Card */}
          <div className="lg:col-span-6">
            <div className="bg-white text-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Ouvrir une Session</h2>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Saisissez votre nom d'utilisateur (login) et votre mot de passe pour accéder à vos modules autorisés.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <div className="leading-snug">
                    <strong className="font-bold">Erreur d'authentification :</strong> {errorMessage}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Login Username Input (NOT EMAIL) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Identifiant / Login <span className="text-emerald-700 font-normal">(nom d'utilisateur, pas d'email)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      placeholder="Ex: atangana, mballa, etoundi..."
                      autoComplete="username"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Entrez votre pseudo / login assigné par la direction.
                  </p>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Mot de passe de session
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Test : coop2026
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      title={showPassword ? 'Masquer' : 'Afficher'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>Ouvrir la Session</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Session sécurisée en mémoire locale</span>
                  <span className="text-emerald-700 font-semibold">COOPS-CA v2026.1</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-6xl w-full mx-auto text-center py-2 text-xs text-slate-400 border-t border-emerald-900/50 flex flex-wrap items-center justify-between gap-2">
        <div>
          {config.formeJuridique || "Société Coopérative avec Conseil d'Administration (OHADA)"} • {config.siegeSocial || 'Obala, Cameroun'}
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Gestion des rôles & permissions (RBAC) activée</span>
        </div>
      </div>
    </div>
  );
};

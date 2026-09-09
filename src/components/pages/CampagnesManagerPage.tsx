import React, { useState, useMemo } from 'react';
import {
  Calendar,
  CalendarRange,
  Clock,
  Layers,
  Repeat,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Wheat,
  Beef,
  DollarSign,
  MapPin,
  Filter,
  Search,
  Plus,
  FileText,
  ArrowRight,
  Lock,
  Unlock,
  Info,
  X,
  ChevronRight,
  Award,
  Sparkles,
  BarChart2,
  Compass,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  CampagneAgricole,
  TypeCampagne,
  UsageEspaceCampagne,
  NavigationTab,
} from '../../types';

interface CampagnesManagerPageProps {
  onNavigateToTab?: (tab: NavigationTab) => void;
}

export const CampagnesManagerPage: React.FC<CampagnesManagerPageProps> = ({
  onNavigateToTab,
}) => {
  const {
    campagnes,
    activeCampagneCode,
    setActiveCampagneCode,
    addCampagne,
    updateCampagne,
    cloturerCampagne,
    rouvrirCampagne,
    parcelles,
    currentUser,
    canPerform,
  } = useApp();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'timeline' | 'liste' | 'guide'>('timeline');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatut, setFilterStatut] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [closingCampagne, setClosingCampagne] = useState<CampagneAgricole | null>(null);
  const [detailCampagne, setDetailCampagne] = useState<CampagneAgricole | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Creation form state
  const [newForm, setNewForm] = useState({
    code: `CAMP-${new Date().getFullYear()}-${String.fromCharCode(65 + (campagnes.length % 26))}`,
    nom: '',
    typeCampagne: 'Végétale' as TypeCampagne,
    filiere: 'Maïs Grain & Céréales',
    saison: 'Petite Saison des Pluies',
    annee: 2026,
    dateDebut: '2026-09-15',
    dateFin: '2027-01-30',
    statut: 'En cours' as 'En cours' | 'Planifiée',
    objectifSuperficieHa: 500,
    objectifProductionTonnes: 1500,
    objectifEffectifAnimaux: 0,
    budgetPrevisionnelFCFA: 35000000,
    parcellesCodes: [] as string[],
    usageEspace: 'Rotation Pâturage Résidus' as UsageEspaceCampagne,
  });

  // Cloture form state
  const [clotureForm, setClotureForm] = useState({
    dateCloture: new Date().toISOString().split('T')[0],
    productionReelleTonnes: 0,
    effectifReelAnimaux: 0,
    depensesReellesFCFA: 0,
    recettesReellesFCFA: 0,
    motifCloture: 'Récoltes et ventes achevées, inventaire contradictoire validé',
    observationsBilan: 'Objectifs atteints dans le respect du cahier des charges agronomique et sanitaire.',
    validePar: `${currentUser.prenom} ${currentUser.nom} (${currentUser.fonction})`,
  });

  // Filtered campaigns
  const filteredCampagnes = useMemo(() => {
    return campagnes.filter((c) => {
      const matchSearch =
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.nom && c.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.filiere && c.filiere.toLowerCase().includes(searchTerm.toLowerCase())) ||
        c.saison.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType =
        filterType === 'all' ||
        (filterType === 'vegetale' && c.typeCampagne === 'Végétale') ||
        (filterType === 'animale' && c.typeCampagne === 'Animale') ||
        (filterType === 'mixte' && c.typeCampagne === 'Agro-pastorale Mixte');

      const matchStatut =
        filterStatut === 'all' || c.statut === filterStatut;

      return matchSearch && matchType && matchStatut;
    });
  }, [campagnes, searchTerm, filterType, filterStatut]);

  // Overall statistics
  const stats = useMemo(() => {
    const actives = campagnes.filter((c) => c.statut === 'En cours');
    const planifiees = campagnes.filter((c) => c.statut === 'Planifiée');
    const cloturees = campagnes.filter((c) => c.statut === 'Clôturée');

    const totalSuperficieMobilisee = actives.reduce(
      (acc, c) => acc + (c.objectifSuperficieHa || 0),
      0
    );
    const totalCheptelMobilise = actives.reduce(
      (acc, c) => acc + (c.effectifReelAnimaux || c.objectifEffectifAnimaux || 0),
      0
    );
    const totalRecettes = campagnes.reduce(
      (acc, c) => acc + (c.recettesReellesFCFA || 0),
      0
    );
    const totalMarge = campagnes.reduce(
      (acc, c) => acc + (c.margeNetteFCFA || 0),
      0
    );

    return {
      activesCount: actives.length,
      planifieesCount: planifiees.length,
      clotureesCount: cloturees.length,
      totalSuperficieMobilisee,
      totalCheptelMobilise,
      totalRecettes,
      totalMarge,
    };
  }, [campagnes]);

  // Open creation modal
  const handleOpenCreateModal = () => {
    const nextCode = `CAMP-${selectedYear}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    setNewForm({
      code: nextCode,
      nom: 'Campagne Céréalière & Résidus de Saison',
      typeCampagne: 'Végétale',
      filiere: 'Maïs Grain & Soja',
      saison: 'Grande Saison des Pluies',
      annee: selectedYear,
      dateDebut: `${selectedYear}-09-01`,
      dateFin: `${selectedYear + 1}-01-31`,
      statut: 'En cours',
      objectifSuperficieHa: 750,
      objectifProductionTonnes: 2100,
      objectifEffectifAnimaux: 0,
      budgetPrevisionnelFCFA: 45000000,
      parcellesCodes: ['PARC-T001-P03', 'PARC-T001-P04'],
      usageEspace: 'Rotation Pâturage Résidus',
    });
    setIsCreateModalOpen(true);
  };

  // Submit creation
  const handleCreateCampagne = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.code || !newForm.nom) {
      alert('Veuillez renseigner le code et le libellé de la campagne.');
      return;
    }

    addCampagne({
      code: newForm.code,
      nom: newForm.nom,
      typeCampagne: newForm.typeCampagne,
      filiere: newForm.filiere,
      saison: newForm.saison,
      annee: newForm.annee,
      dateDebut: newForm.dateDebut,
      dateFin: newForm.dateFin,
      statut: newForm.statut,
      objectifSuperficieHa: Number(newForm.objectifSuperficieHa) || 0,
      objectifProductionTonnes: Number(newForm.objectifProductionTonnes) || 0,
      productionReelleTonnes: 0,
      objectifEffectifAnimaux: Number(newForm.objectifEffectifAnimaux) || 0,
      effectifReelAnimaux: Number(newForm.objectifEffectifAnimaux) || 0,
      budgetPrevisionnelFCFA: Number(newForm.budgetPrevisionnelFCFA) || 0,
      depensesReellesFCFA: 0,
      recettesReellesFCFA: 0,
      margeNetteFCFA: 0,
      parcellesCodes: newForm.parcellesCodes,
      usageEspace: newForm.usageEspace,
    });

    setIsCreateModalOpen(false);
    showToast(`Campagne ${newForm.code} ouverte avec succès !`);
  };

  // Open cloture modal
  const handleOpenClotureModal = (c: CampagneAgricole) => {
    setClosingCampagne(c);
    setClotureForm({
      dateCloture: new Date().toISOString().split('T')[0],
      productionReelleTonnes: c.productionReelleTonnes || c.objectifProductionTonnes,
      effectifReelAnimaux: c.effectifReelAnimaux || c.objectifEffectifAnimaux || 0,
      depensesReellesFCFA: c.depensesReellesFCFA || c.budgetPrevisionnelFCFA || 0,
      recettesReellesFCFA: c.recettesReellesFCFA || (c.productionReelleTonnes || c.objectifProductionTonnes) * 230000,
      motifCloture: 'Récoltes et ventes achevées, inventaire contradictoire validé',
      observationsBilan: `Objectifs atteints : ${c.productionReelleTonnes || c.objectifProductionTonnes} t produites. Parcelles libérées pour la rotation suivante.`,
      validePar: `${currentUser.prenom} ${currentUser.nom} (${currentUser.fonction})`,
    });
  };

  // Submit Cloture
  const handleSubmitCloture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!closingCampagne) return;

    const dep = Number(clotureForm.depensesReellesFCFA) || 0;
    const rec = Number(clotureForm.recettesReellesFCFA) || 0;
    const marge = rec - dep;

    cloturerCampagne(closingCampagne.id, {
      dateCloture: clotureForm.dateCloture,
      motifCloture: clotureForm.motifCloture,
      observationsBilan: clotureForm.observationsBilan,
      productionReelleTonnes: Number(clotureForm.productionReelleTonnes) || 0,
      effectifReelAnimaux: Number(clotureForm.effectifReelAnimaux) || 0,
      depensesReellesFCFA: dep,
      recettesReellesFCFA: rec,
      margeNetteFCFA: marge,
      validePar: clotureForm.validePar,
    });

    setClosingCampagne(null);
    showToast(`La campagne ${closingCampagne.code} a été clôturée et archivée avec succès !`);
  };

  // Toggle parcelles in new form
  const toggleParcelleCode = (code: string) => {
    setNewForm((prev) => {
      const exists = prev.parcellesCodes.includes(code);
      return {
        ...prev,
        parcellesCodes: exists
          ? prev.parcellesCodes.filter((c) => c !== code)
          : [...prev.parcellesCodes, code],
      };
    });
  };

  // Timeline months array
  const months = [
    { num: '01', name: 'Jan' },
    { num: '02', name: 'Fév' },
    { num: '03', name: 'Mar' },
    { num: '04', name: 'Avr' },
    { num: '05', name: 'Mai' },
    { num: '06', name: 'Juin' },
    { num: '07', name: 'Juil' },
    { num: '08', name: 'Août' },
    { num: '09', name: 'Sept' },
    { num: '10', name: 'Oct' },
    { num: '11', name: 'Nov' },
    { num: '12', name: 'Déc' },
  ];

  // Helper to calculate timeline bar left and width percentages
  const getTimelineBarMetrics = (startDateStr: string, endDateStr: string, year: number) => {
    try {
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);
      const yearStart = new Date(`${year}-01-01`);
      const yearEnd = new Date(`${year}-12-31`);

      // Cap to the year boundary for display
      const effectiveStart = start < yearStart ? yearStart : start;
      const effectiveEnd = end > yearEnd ? yearEnd : end;

      const totalYearDays = 365;
      const startOffsetDays = Math.max(0, (effectiveStart.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
      const durationDays = Math.max(15, (effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24));

      const left = Math.min(100, Math.max(0, (startOffsetDays / totalYearDays) * 100));
      const width = Math.min(100 - left, Math.max(4, (durationDays / totalYearDays) * 100));

      return { left: `${left}%`, width: `${width}%` };
    } catch {
      return { left: '10%', width: '30%' };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-700 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-300 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 sm:p-7 rounded-2xl shadow-sm border border-emerald-800/60 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <CalendarRange className="w-80 h-80" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
              <Repeat className="w-3.5 h-3.5" />
              <span>Gouvernance & Cycles Agro-Pastoraux</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Gestion des Campagnes & Enchevêtrements Spatiaux
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Ouvrez, pilotez et clôturez formellement les campagnes végétales et animales. Synchronisez les cycles courts (volailles 45j, porcins) avec les grandes saisons agricoles pluvieuses et arbitrez la rotation des parcelles (céréales puis pâturage des résidus).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {canPerform('create') && (
              <button
                onClick={handleOpenCreateModal}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer text-xs sm:text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ Ouvrir une Nouvelle Campagne</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-800/50">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <div className="flex items-center justify-between text-emerald-300 text-xs font-medium mb-1">
              <span>Campagnes Actives</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {stats.activesCount}
            </div>
            <div className="text-[11px] text-slate-300">
              En cours d’exploitation
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <div className="flex items-center justify-between text-blue-300 text-xs font-medium mb-1">
              <span>Superficie Mobilisée</span>
              <Wheat className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {stats.totalSuperficieMobilisee.toLocaleString('fr-FR')} ha
            </div>
            <div className="text-[11px] text-slate-300">
              Parcelles végétales & mixtes
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <div className="flex items-center justify-between text-amber-300 text-xs font-medium mb-1">
              <span>Effectif Animaux</span>
              <Beef className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {stats.totalCheptelMobilise.toLocaleString('fr-FR')} têtes
            </div>
            <div className="text-[11px] text-slate-300">
              Volailles, porcs & bovins
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <div className="flex items-center justify-between text-emerald-300 text-xs font-medium mb-1">
              <span>Marge Cumulée</span>
              <DollarSign className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-300">
              {(stats.totalMarge / 1000000).toFixed(1)} M FCFA
            </div>
            <div className="text-[11px] text-slate-300">
              Bilan net consolidé
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer relative ${
              activeTab === 'timeline'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Chronogramme & Enchevêtrement Spatio-Temporel</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
              Gantt & Espace
            </span>
          </button>

          <button
            onClick={() => setActiveTab('liste')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer relative ${
              activeTab === 'liste'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Répertoire des Campagnes ({campagnes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer relative ${
              activeTab === 'guide'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Méthode & Clôture</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 pb-2">
          <span className="text-xs text-slate-500">Année de référence :</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 shadow-2xs"
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: CHRONOGRAMME & ENCHEVÊTREMENT SPATIO-TEMPOREL (GANTT & CADASTRE)
      ========================================================================= */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {/* Explanation Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900 leading-relaxed shadow-2xs">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block text-sm text-amber-950">
                Principe de Gestion des Enchevêtrements Agro-Pastoraux
              </span>
              <p>
                Dans notre coopérative, l'activité végétale suit le calendrier bimodal équatorial (Grande Saison des pluies de mars à août, Petite Saison de septembre à janvier). Simultanément, l'élevage tourne sur des cycles courts (bandes avicoles de 45 jours) ou moyens (engraissement porcin de 5 mois).
                L'application permet le <strong>chevauchement simultané</strong> de plusieurs campagnes et coordonne <strong>l'usage partagé des parcelles</strong> (ex: pâturage des résidus de maïs après récolte par les bovins, enrichissant la terre en fumure organique avant les semis de la petite saison).
              </p>
            </div>
          </div>

          {/* Chronogramme Gantt Visuel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>Chronogramme Annuel des Campagnes ({selectedYear})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Visualisation continue des cycles d'activité et des périodes de chevauchement actif
                </p>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
                  Végétale (Agricole)
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block" />
                  Animale (Élevage)
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-3 rounded-xs bg-purple-600 inline-block" />
                  Agro-pastorale Mixte
                </span>
              </div>
            </div>

            {/* Timeline Header (Months) */}
            <div className="relative pt-2">
              <div className="grid grid-cols-12 text-center text-xs font-bold text-slate-500 pb-2 border-b border-slate-200">
                {months.map((m) => (
                  <div key={m.num} className="truncate">
                    {m.name}
                  </div>
                ))}
              </div>

              {/* Today indicator (Approximation for September) */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-20 pointer-events-none flex flex-col items-center"
                style={{ left: '68%' }}
              >
                <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full -mt-2.5 shadow-xs whitespace-nowrap">
                  Aujourd'hui (Septembre)
                </span>
              </div>

              {/* Timeline Rows */}
              <div className="space-y-3 pt-3">
                {campagnes.map((c) => {
                  const metrics = getTimelineBarMetrics(c.dateDebut, c.dateFin, selectedYear);
                  const isVegetale = c.typeCampagne === 'Végétale';
                  const isAnimale = c.typeCampagne === 'Animale';
                  const isMixte = c.typeCampagne === 'Agro-pastorale Mixte';

                  const barBg = isVegetale
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : isAnimale
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-purple-600 text-white hover:bg-purple-700';

                  const badgeBorder =
                    c.statut === 'En cours'
                      ? 'ring-2 ring-emerald-400 ring-offset-1 font-bold'
                      : c.statut === 'Clôturée'
                      ? 'opacity-70 grayscale-30'
                      : 'border-dashed border border-white';

                  return (
                    <div key={c.id} className="relative group">
                      <div className="flex items-center justify-between text-xs mb-1 px-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{c.code}</span>
                          <span className="text-slate-500 truncate max-w-[200px] hidden sm:inline">
                            • {c.nom || c.saison}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] ${
                              c.statut === 'En cours'
                                ? 'bg-emerald-100 text-emerald-800 font-bold'
                                : c.statut === 'Planifiée'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {c.statut}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {c.dateDebut} au {c.dateFin}
                        </div>
                      </div>

                      {/* Bar Track */}
                      <div className="w-full bg-slate-100 h-8 rounded-xl relative overflow-hidden border border-slate-200">
                        {/* 12-column grid background markers */}
                        <div className="absolute inset-0 grid grid-cols-12 divide-x divide-slate-200/50 pointer-events-none">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} />
                          ))}
                        </div>

                        {/* Visual Bar */}
                        <div
                          className={`absolute top-1 bottom-1 rounded-lg px-2.5 flex items-center justify-between text-xs transition-all shadow-xs cursor-pointer ${barBg} ${badgeBorder}`}
                          style={{ left: metrics.left, width: metrics.width }}
                          onClick={() => setDetailCampagne(c)}
                          title={`${c.code}: ${c.nom || c.saison} (${c.dateDebut} au ${c.dateFin})`}
                        >
                          <span className="truncate font-semibold text-[11px]">
                            {c.filiere || c.saison}
                          </span>
                          <span className="text-[10px] opacity-90 hidden md:inline shrink-0 font-mono">
                            {c.typeCampagne === 'Animale'
                              ? `${c.effectifReelAnimaux || c.objectifEffectifAnimaux} têtes`
                              : `${c.productionReelleTonnes || c.objectifProductionTonnes} t`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                Cliquez sur une barre de campagne pour consulter sa fiche détaillée et ses parcelles associées.
              </span>
              <span className="text-emerald-700 font-bold">
                Période de transition actuelle : Fin Récoltes Saison A & Démarrage Bandes Avicoles N°4
              </span>
            </div>
          </div>

          {/* Matrice d'Enchevêtrement Spatial des Parcelles */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Matrice d'Affectation & Rotation Spatiale des Parcelles</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Comment les espaces agricoles accueillent les animaux en rotation (agro-pastoralisme intégré)
                </p>
              </div>
              <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
                Total Parcelles Coopérative : {parcelles.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-gradient-to-br from-emerald-50/40 via-white to-amber-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Wheat className="w-4 h-4 text-emerald-700" />
                    <span>PARC-T001-P03 (14.5 ha)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Synergie Active
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1 shrink-0" />
                    <div>
                      <strong className="text-slate-800">Mars - Juillet :</strong> Campagne Maïs Grain CMS 8704 (55.1 tonnes récoltées).
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-600 mt-1 shrink-0" />
                    <div>
                      <strong className="text-slate-800">Août - Novembre :</strong> 45 Zébus Goudali en pâturage sur les chaumes de maïs.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400 mt-1 shrink-0" />
                    <div>
                      <strong className="text-slate-800">Décembre - Février :</strong> Repos organique & enrichissement en déjections.
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Aucun conflit d'usage détecté • Fertilité +28%</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-gradient-to-br from-blue-50/40 via-white to-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Beef className="w-4 h-4 text-blue-700" />
                    <span>PARC-T002-P05 (15.0 ha)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    Pôle Élevage
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
                    <div>
                      <strong className="text-slate-800">Bâtiments Avicoles :</strong> Bandes N°3 (mai-juil) puis Bande N°4 (août-sept).
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mt-1 shrink-0" />
                    <div>
                      <strong className="text-slate-800">Porcherie Soa :</strong> Cycle continu d'engraissement porcin (Large White).
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                    <div>
                      <strong className="text-slate-800">Bande tampon :</strong> 5 ha de manioc pour valoriser le lisier.
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-blue-800 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Vide sanitaire de 21 jours respecté entre les bandes</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-gradient-to-br from-purple-50/40 via-white to-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Repeat className="w-4 h-4 text-purple-700" />
                    <span>PARC-T004-P18 (46.0 ha)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                    Rotation Céréales
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1 shrink-0" />
                    <div>
                      <strong className="text-slate-800">Grande Saison A :</strong> Maïs Grain (165.6 t récoltées pour minoterie).
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600 mt-1 shrink-0" />
                    <div>
                      <strong className="text-slate-800">Petite Saison B :</strong> Semis planifié de Soja et Niébé (enrichissement azote).
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400 mt-1 shrink-0" />
                    <div>
                      <strong className="text-slate-800">Aliment bétail :</strong> 30% des grains orientés vers l'usine d'aliment avicole.
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-purple-800 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Autonomie alimentaire coopérative sécurisée</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: LISTE & FICHES DES CAMPAGNES
      ========================================================================= */}
      {activeTab === 'liste' && (
        <div className="space-y-5">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher par code, nom, filière..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    filterType === 'all' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-600'
                  }`}
                >
                  Tous Domaines
                </button>
                <button
                  onClick={() => setFilterType('vegetale')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    filterType === 'vegetale' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Végétale
                </button>
                <button
                  onClick={() => setFilterType('animale')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    filterType === 'animale' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Animale
                </button>
                <button
                  onClick={() => setFilterType('mixte')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    filterType === 'mixte' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Mixte
                </button>
              </div>

              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 shadow-2xs"
              >
                <option value="all">Tous statuts</option>
                <option value="En cours">En cours (Active)</option>
                <option value="Planifiée">Planifiée</option>
                <option value="Clôturée">Clôturée</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCampagnes.map((c) => {
              const isVegetale = c.typeCampagne === 'Végétale';
              const isAnimale = c.typeCampagne === 'Animale';
              const isMixte = c.typeCampagne === 'Agro-pastorale Mixte';

              const badgeColor =
                c.statut === 'En cours'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : c.statut === 'Planifiée'
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-slate-100 text-slate-700 border-slate-300';

              const domainColor = isVegetale
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                : isAnimale
                ? 'text-blue-700 bg-blue-50 border-blue-200'
                : 'text-purple-700 bg-purple-50 border-purple-200';

              // Progress
              const targetVal = isAnimale ? (c.objectifEffectifAnimaux || 1) : (c.objectifProductionTonnes || 1);
              const realVal = isAnimale ? (c.effectifReelAnimaux || 0) : (c.productionReelleTonnes || 0);
              const pct = Math.min(100, Math.round((realVal / targetVal) * 100));

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Card Top */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${domainColor}`}>
                            {c.typeCampagne || 'Végétale'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${badgeColor}`}>
                            {c.statut}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-1">
                          {c.code} : {c.nom || c.saison}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Du {c.dateDebut} au {c.dateFin}</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">{c.saison}</span>
                        </p>
                      </div>

                      {/* Active badge */}
                      {activeCampagneCode === c.code && (
                        <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 shadow-2xs">
                          CAMPAGNE EN VIGUEUR
                        </span>
                      )}
                    </div>

                    {/* Indicators */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">
                          {isAnimale ? 'Effectif Cheptel' : 'Superficie Cible'}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {isAnimale
                            ? `${c.effectifReelAnimaux || c.objectifEffectifAnimaux} têtes`
                            : `${c.objectifSuperficieHa} ha`}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">
                          Production Réelle
                        </span>
                        <span className="font-bold text-emerald-700 text-sm">
                          {isAnimale
                            ? `${c.productionReelleTonnes || 0} t chair`
                            : `${c.productionReelleTonnes || 0} t récoltées`}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">
                          Marge Brute Net
                        </span>
                        <span className="font-bold text-blue-700 text-sm">
                          {c.margeNetteFCFA
                            ? `${(c.margeNetteFCFA / 1000000).toFixed(1)} M`
                            : 'En cours'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Taux de réalisation de l'objectif</span>
                        <span className="font-bold text-slate-800">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            pct >= 90
                              ? 'bg-emerald-600'
                              : pct >= 50
                              ? 'bg-blue-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Parcelles and Usage */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-500">Parcelles :</span>
                      {c.parcellesCodes && c.parcellesCodes.length > 0 ? (
                        c.parcellesCodes.map((p) => (
                          <span key={p} className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[10px]">
                            {p}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">Non affectées</span>
                      )}
                      {c.usageEspace && (
                        <span className="ml-auto text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded text-[10px] border border-purple-200">
                          {c.usageEspace}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setDetailCampagne(c)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Fiche Détaillée</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {c.statut === 'En cours' && (
                        <button
                          onClick={() => handleOpenClotureModal(c)}
                          className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Clôturer la Campagne</span>
                        </button>
                      )}

                      {c.statut === 'Clôturée' && (
                        <button
                          onClick={() => {
                            if (confirm(`Rouvrir la campagne ${c.code} en mode actif ?`)) {
                              rouvrirCampagne(c.id);
                              showToast(`Campagne ${c.code} réouverte !`);
                            }
                          }}
                          className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-xs font-semibold px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer"
                          title="Réouverture exceptionnelle (Super Admin)"
                        >
                          <Unlock className="w-3 h-3" />
                          <span>Rouvrir</span>
                        </button>
                      )}

                      {c.statut === 'Planifiée' && (
                        <button
                          onClick={() => {
                            updateCampagne(c.id, { statut: 'En cours' });
                            setActiveCampagneCode(c.code);
                            showToast(`Campagne ${c.code} officiellement lancée et activée !`);
                          }}
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>Ouvrir Maintenant</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: GUIDE & DOCTRINE D'OUVERTURE / CLÔTURE AGRO-PASTORALE
      ========================================================================= */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                L'Ouverture de Campagne
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Une campagne s'ouvre formellement avant le démarrage des travaux au sol ou l'achat des bandes d'animaux.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                <li>Fixation des <strong>objectifs quantitatifs</strong> (surfaces ha ou effectifs têtes).</li>
                <li>Réservation cadastrale des <strong>parcelles</strong>.</li>
                <li>Vote du <strong>budget prévisionnel d'intrants</strong> (semences certifiées, provendes, vaccins).</li>
                <li>Émission des engagements de collecte pour les membres.</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Gestion des Enchevêtrements
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Les cycles de vie végétal et animal s'enchevêtrent naturellement sur l'année.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                <li><strong>Multi-campagnes simultanées :</strong> jusqu'à 4 à 6 campagnes actives en parallèle.</li>
                <li><strong>Rotation temporelle des parcelles :</strong> Céréales en saison des pluies, puis pâturage des résidus en saison sèche.</li>
                <li><strong>Sécurisation sanitaire :</strong> respect des vides sanitaires (21 jours) et séparation des troupeaux.</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black text-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                La Clôture Formelle & Bilan
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                La clôture gèle les écritures opérationnelles et déclenche l'audit OHADA de fin de saison.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                <li><strong>Inventaire physique contradictoire :</strong> stocks en silos ou pesée des bêtes restantes.</li>
                <li><strong>Calcul de la marge brute nette :</strong> Chiffre d'affaires réel déduit des dépenses d'exploitation.</li>
                <li><strong>Libération des parcelles :</strong> remise en état et transmission à la campagne suivante.</li>
                <li><strong>Ristournes aux coopérateurs :</strong> calcul du dividende d'activité par producteur.</li>
              </ul>
            </div>
          </div>

          {/* Detailed OHADA FAQ */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Questions Fréquentes sur le Cycle de Campagne en Coopérative OHADA</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">
                  Q : Pourquoi ne pas avoir une seule campagne annuelle globale ?
                </span>
                <p className="text-slate-600 leading-relaxed">
                  R : Parce que sur le plan économique et zootechnique, un élevage de poulets de chair tourne en 45 jours (5 cycles/an) et le maïs en 120 jours (2 cycles/an). Une seule campagne noierait la rentabilité spécifique de chaque pôle et empêcherait de calculer les ristournes au juste mérite de chaque adhérent.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">
                  Q : Que se passe-t-il si un élevage entre sur une parcelle avant la récolte ?
                </span>
                <p className="text-slate-600 leading-relaxed">
                  R : Le système déclenche une alerte de conflit spatial. La parcelle reste verrouillée en statut « Récolte en cours » tant que l'agronome n'a pas validé le bordereau de récolte et donné le bon de passage aux troupeaux pour valoriser les chaumes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: OUVRIR / PLANIFIER UNE NOUVELLE CAMPAGNE
      ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 animate-fade-in">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Ouvrir une Nouvelle Campagne Agro-Pastorale</h3>
                  <p className="text-[11px] text-slate-400">Planification des dates, objectifs et affectation spatiale</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateCampagne} className="p-6 space-y-4 text-xs">
              {/* Type de Campagne */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Type de Campagne (Domaine d'activité)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setNewForm({
                        ...newForm,
                        typeCampagne: 'Végétale',
                        filiere: 'Maïs Grain & Soja',
                        usageEspace: 'Rotation Pâturage Résidus',
                      })
                    }
                    className={`py-2.5 px-3 rounded-xl border font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      newForm.typeCampagne === 'Végétale'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Wheat className="w-4 h-4 text-emerald-700" />
                    <span>Végétale (Agricole)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setNewForm({
                        ...newForm,
                        typeCampagne: 'Animale',
                        filiere: 'Aviculture Chair (45j)',
                        usageEspace: 'Exclusif Élevage',
                      })
                    }
                    className={`py-2.5 px-3 rounded-xl border font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      newForm.typeCampagne === 'Animale'
                        ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Beef className="w-4 h-4 text-blue-700" />
                    <span>Animale (Élevage)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setNewForm({
                        ...newForm,
                        typeCampagne: 'Agro-pastorale Mixte',
                        filiere: 'Céréales & Pâturage Résidus',
                        usageEspace: 'Rotation Pâturage Résidus',
                      })
                    }
                    className={`py-2.5 px-3 rounded-xl border font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      newForm.typeCampagne === 'Agro-pastorale Mixte'
                        ? 'bg-purple-50 border-purple-500 text-purple-800 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Repeat className="w-4 h-4 text-purple-700" />
                    <span>Mixte / Intégrée</span>
                  </button>
                </div>
              </div>

              {/* Identification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Code Campagne</label>
                  <input
                    type="text"
                    required
                    value={newForm.code}
                    onChange={(e) => setNewForm({ ...newForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Filière Spécifique</label>
                  <input
                    type="text"
                    required
                    value={newForm.filiere}
                    onChange={(e) => setNewForm({ ...newForm, filiere: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Libellé / Désignation de la Campagne</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Petite Saison Pluvieuse 2026 ou Bande Chair N°5"
                  value={newForm.nom}
                  onChange={(e) => setNewForm({ ...newForm, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
                />
              </div>

              {/* Dates & Période */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Saison</label>
                  <input
                    type="text"
                    required
                    value={newForm.saison}
                    onChange={(e) => setNewForm({ ...newForm, saison: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date Début Prévue</label>
                  <input
                    type="date"
                    required
                    value={newForm.dateDebut}
                    onChange={(e) => setNewForm({ ...newForm, dateDebut: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date Fin Théorique</label>
                  <input
                    type="date"
                    required
                    value={newForm.dateFin}
                    onChange={(e) => setNewForm({ ...newForm, dateFin: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Targets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {newForm.typeCampagne === 'Animale' ? 'Effectif Cheptel (têtes)' : 'Superficie Cible (ha)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newForm.typeCampagne === 'Animale' ? newForm.objectifEffectifAnimaux : newForm.objectifSuperficieHa}
                    onChange={(e) =>
                      newForm.typeCampagne === 'Animale'
                        ? setNewForm({ ...newForm, objectifEffectifAnimaux: Number(e.target.value) })
                        : setNewForm({ ...newForm, objectifSuperficieHa: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Production Cible (Tonnes)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    value={newForm.objectifProductionTonnes}
                    onChange={(e) => setNewForm({ ...newForm, objectifProductionTonnes: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Budget Prévu (FCFA)</label>
                  <input
                    type="number"
                    min="0"
                    step="50000"
                    value={newForm.budgetPrevisionnelFCFA}
                    onChange={(e) => setNewForm({ ...newForm, budgetPrevisionnelFCFA: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              {/* Spatial Allocation & Parcelles */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-700 font-bold block">
                    Affectation des Parcelles Mobiles / Bâtiments
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Sélectionnez les unités mobilisées
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {parcelles.map((p) => {
                    const isSelected = newForm.parcellesCodes.includes(p.code);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleParcelleCode(p.code)}
                        className={`px-2 py-1.5 rounded-lg border text-[11px] font-mono font-bold text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p.code} ({p.superficieHa} ha)
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Usage Space */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Modalité d'Usage Spatio-Temporel
                </label>
                <select
                  value={newForm.usageEspace}
                  onChange={(e) => setNewForm({ ...newForm, usageEspace: e.target.value as UsageEspaceCampagne })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
                >
                  <option value="Rotation Pâturage Résidus">
                    Rotation Successive : Culture puis Pâturage des résidus / fumure
                  </option>
                  <option value="Exclusif Culture">Exclusif Culture : Réservé 100% aux végétaux</option>
                  <option value="Exclusif Élevage">Exclusif Élevage : Bâtiments ou parcours fermé</option>
                  <option value="Coexistence Spatiale">Coexistence Spatiale : Silvopastoralisme / Agroforesterie</option>
                </select>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  Valider & Ouvrir la Campagne
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: BILAN & CLÔTURE FORMELLE DE CAMPAGNE
      ========================================================================= */}
      {closingCampagne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-8 animate-fade-in">
            {/* Header */}
            <div className="bg-rose-950 text-white px-6 py-4 flex items-center justify-between border-b border-rose-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Clôture Formelle & Bilan de Fin de Campagne</h3>
                  <p className="text-[11px] text-rose-200">{closingCampagne.code} • {closingCampagne.nom || closingCampagne.saison}</p>
                </div>
              </div>
              <button
                onClick={() => setClosingCampagne(null)}
                className="text-rose-300 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitCloture} className="p-6 space-y-4 text-xs">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                <strong>Attention :</strong> La clôture d'une campagne gèle les écritures d'exploitation, consigne le bilan financier officiel et libère les parcelles pour les rotations suivantes.
              </div>

              {/* Date Cloture */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date d'Arrêté / Clôture</label>
                  <input
                    type="date"
                    required
                    value={clotureForm.dateCloture}
                    onChange={(e) => setClotureForm({ ...clotureForm, dateCloture: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Validateur Officiel</label>
                  <input
                    type="text"
                    required
                    value={clotureForm.validePar}
                    onChange={(e) => setClotureForm({ ...clotureForm, validePar: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Real outputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Production Réelle Finale (Tonnes)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={clotureForm.productionReelleTonnes}
                    onChange={(e) => setClotureForm({ ...clotureForm, productionReelleTonnes: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Objectif initial : {closingCampagne.objectifProductionTonnes} t
                  </span>
                </div>

                {closingCampagne.typeCampagne === 'Animale' && (
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Effectif Final Livré / Vendu (Têtes)
                    </label>
                    <input
                      type="number"
                      value={clotureForm.effectifReelAnimaux}
                      onChange={(e) => setClotureForm({ ...clotureForm, effectifReelAnimaux: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Objectif initial : {closingCampagne.objectifEffectifAnimaux || 0} têtes
                    </span>
                  </div>
                )}
              </div>

              {/* Financial Balance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Dépenses Réelles Totales (FCFA)</label>
                  <input
                    type="number"
                    step="50000"
                    required
                    value={clotureForm.depensesReellesFCFA}
                    onChange={(e) => setClotureForm({ ...clotureForm, depensesReellesFCFA: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-rose-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Recettes Totales Réalisées (FCFA)</label>
                  <input
                    type="number"
                    step="50000"
                    required
                    value={clotureForm.recettesReellesFCFA}
                    onChange={(e) => setClotureForm({ ...clotureForm, recettesReellesFCFA: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>

              {/* Estimated Margin Preview */}
              <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between">
                <span className="text-slate-600 font-semibold">Marge Nette de Campagne Projetée :</span>
                <span className={`text-sm font-black ${
                  clotureForm.recettesReellesFCFA - clotureForm.depensesReellesFCFA >= 0
                    ? 'text-emerald-700'
                    : 'text-rose-700'
                }`}>
                  {((clotureForm.recettesReellesFCFA - clotureForm.depensesReellesFCFA) || 0).toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              {/* Motifs & Observations */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Motif Officiel de Clôture</label>
                <input
                  type="text"
                  required
                  value={clotureForm.motifCloture}
                  onChange={(e) => setClotureForm({ ...clotureForm, motifCloture: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Observations & Bilan Synthétique</label>
                <textarea
                  rows={2}
                  value={clotureForm.observationsBilan}
                  onChange={(e) => setClotureForm({ ...clotureForm, observationsBilan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setClosingCampagne(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  Confirmer la Clôture & Archiver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: FICHE DÉTAILLÉE DE CAMPAGNE
      ========================================================================= */}
      {detailCampagne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 animate-fade-in">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CalendarRange className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold">Fiche Officielle • {detailCampagne.code}</h3>
                  <p className="text-[11px] text-slate-400">{detailCampagne.nom || detailCampagne.saison}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailCampagne(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px] font-bold">DOMAINE</span>
                  <span className="font-bold text-slate-800 text-sm">{detailCampagne.typeCampagne || 'Végétale'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px] font-bold">STATUT</span>
                  <span className="font-bold text-emerald-700 text-sm">{detailCampagne.statut}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px] font-bold">PÉRIODE</span>
                  <span className="font-bold text-slate-800 text-[11px]">{detailCampagne.dateDebut} au {detailCampagne.dateFin}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px] font-bold">MARGE NETTE</span>
                  <span className="font-bold text-blue-700 text-sm">
                    {detailCampagne.margeNetteFCFA ? `${(detailCampagne.margeNetteFCFA / 1000000).toFixed(1)} M FCFA` : 'En cours'}
                  </span>
                </div>
              </div>

              {detailCampagne.observationsBilan && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
                  <span className="font-bold block mb-1">Rapport de Synthèse & Clôture :</span>
                  <p className="leading-relaxed">{detailCampagne.observationsBilan}</p>
                  {detailCampagne.validePar && (
                    <div className="mt-2 text-[11px] text-emerald-800 italic">
                      Signé et validé par : {detailCampagne.validePar} le {detailCampagne.dateCloture || 'N/A'}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <span className="font-bold text-slate-900 block">Affectation Cadastrale des Parcelles :</span>
                <div className="flex flex-wrap gap-2">
                  {detailCampagne.parcellesCodes && detailCampagne.parcellesCodes.length > 0 ? (
                    detailCampagne.parcellesCodes.map((p) => (
                      <span key={p} className="px-2.5 py-1 bg-slate-100 border border-slate-300 font-mono text-xs rounded-lg font-bold">
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">Aucune parcelle spécifiée</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    setActiveCampagneCode(detailCampagne.code);
                    showToast(`Campagne ${detailCampagne.code} définie comme active pour l'ensemble de l'application.`);
                    setDetailCampagne(null);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Définir comme Campagne Active
                </button>

                <button
                  onClick={() => setDetailCampagne(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

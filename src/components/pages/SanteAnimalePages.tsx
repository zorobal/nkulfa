import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HeartPulse,
  Beef,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  MapPin,
  TrendingUp,
  Activity,
  Award,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  AlertCircle,
  Stethoscope,
  Info,
  Clock,
  Check,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { APP_IMAGES } from '../../assets/images';

export const SanteAnimalePages: React.FC<{ initialSubPage?: number }> = ({ initialSubPage = 1 }) => {
  const { interventions, addIntervention, deleteIntervention, updateIntervention, canPerform, currentUser } =
    useApp();

  const [subPage, setSubPage] = useState<number>(initialSubPage);

  React.useEffect(() => {
    if (initialSubPage && initialSubPage >= 1 && initialSubPage <= 12) {
      setSubPage(initialSubPage);
    }
  }, [initialSubPage]);

  const subPageTitles: Record<number, string> = {
    1: "Vue d'ensemble",
    2: 'Élevages et effectifs',
    3: 'État sanitaire des animaux',
    4: 'Protocoles sanitaires',
    5: 'Analyse des tendances',
    6: 'Géolocalisation des élevages',
    7: 'Performances par élevage',
    8: 'Suivi des protocoles par période',
    9: 'Synthèse et recommandations',
    10: 'Impact et perspectives',
    11: 'Registre des interventions (CRUD)',
    12: 'Matrice des risques & biosécurité',
  };

  // CRUD Modal State for Interventions
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEspece, setFilterEspece] = useState('all');

  const [formIntervention, setFormIntervention] = useState({
    date: new Date().toISOString().slice(0, 10),
    lotCode: 'LOT-BOV-T001-P001',
    especeNom: 'Bovins',
    maladieOuSymptome: '',
    diagnostic: '',
    traitementAdministre: '',
    medicament: '',
    veterinaire: currentUser.nom ? `Dr. ${currentUser.nom}` : 'Dr. Vet. Paulin ETOUNDI',
    coutFCFA: 35000,
    statutGuerison: 'En cours' as 'Guéri' | 'En cours' | 'Rechute' | 'Perte',
  });

  const handleSaveIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formIntervention.diagnostic || !formIntervention.medicament) return;

    if (editingId) {
      updateIntervention(editingId, formIntervention);
      setEditingId(null);
    } else {
      addIntervention(formIntervention);
    }

    setIsAddModalOpen(false);
    setFormIntervention({
      date: new Date().toISOString().slice(0, 10),
      lotCode: 'LOT-BOV-T001-P001',
      especeNom: 'Bovins',
      maladieOuSymptome: '',
      diagnostic: '',
      traitementAdministre: '',
      medicament: '',
      veterinaire: `Dr. ${currentUser.nom || 'Vet. Paulin ETOUNDI'}`,
      coutFCFA: 35000,
      statutGuerison: 'En cours',
    });
  };

  const handleEditClick = (item: typeof interventions[0]) => {
    setEditingId(item.id);
    setFormIntervention({
      date: item.date,
      lotCode: item.lotCode,
      especeNom: item.especeNom,
      maladieOuSymptome: item.maladieOuSymptome,
      diagnostic: item.diagnostic,
      traitementAdministre: item.traitementAdministre,
      medicament: item.medicament,
      veterinaire: item.veterinaire,
      coutFCFA: item.coutFCFA,
      statutGuerison: item.statutGuerison,
    });
    setIsAddModalOpen(true);
  };

  // Data for Page 1: Vue d'ensemble
  const interventionsEvolutionData = [
    { month: 'Jan', val: 12 },
    { month: 'Fév', val: 14 },
    { month: 'Mar', val: 11 },
    { month: 'Avr', val: 16 },
    { month: 'Mai', val: 19 },
    { month: 'Juin', val: 15 },
    { month: 'Juil', val: 18 },
    { month: 'Août', val: 22 },
    { month: 'Sep', val: 24 },
    { month: 'Oct', val: 20 },
    { month: 'Nov', val: 23 },
    { month: 'Déc', val: 25 },
  ];

  const interventionsTypeData = [
    { name: 'Vaccination', value: 45, color: '#0ea5e9' },
    { name: 'Traitement', value: 25, color: '#16a34a' },
    { name: 'Contrôle', value: 15, color: '#f59e0b' },
    { name: 'Observation', value: 10, color: '#8b5cf6' },
    { name: 'Diagnostic', value: 5, color: '#ec4899' },
  ];

  // Data for Page 2: Élevages et effectifs
  const elevagesParType = [
    { type: 'Bovins', count: 12, color: '#0ea5e9' },
    { type: 'Ovins', count: 8, color: '#10b981' },
    { type: 'Caprins', count: 6, color: '#f59e0b' },
    { type: 'Porcins', count: 4, color: '#f97316' },
    { type: 'Volailles', count: 10, color: '#eab308' },
  ];

  const effectifsDonut = [
    { name: 'Bovins', value: 38, color: '#0ea5e9' },
    { name: 'Ovins', value: 21, color: '#10b981' },
    { name: 'Caprins', value: 16, color: '#f59e0b' },
    { name: 'Porcins', value: 13, color: '#f97316' },
    { name: 'Volailles', value: 12, color: '#94a3b8' },
  ];

  // Data for Page 3: Pathologies
  const pathologiesData = [
    { name: 'Respiratoires', value: 32, color: '#0ea5e9' },
    { name: 'Digestives', value: 24, color: '#f97316' },
    { name: 'Peau & Sabots', value: 18, color: '#10b981' },
    { name: 'Parasitaires', value: 14, color: '#8b5cf6' },
    { name: 'Autres', value: 12, color: '#94a3b8' },
  ];

  // Data for Page 4: Protocols
  const topProtocols = [
    { code: 'PR-NCD (Newcastle)', count: 15, color: '#0284c7' },
    { code: 'PR-PPR (PPR Ruminants)', count: 12, color: '#0ea5e9' },
    { code: 'PR-GUM (Gumboro)', count: 10, color: '#eab308' },
    { code: 'PR-PCCB (Péripneumonie)', count: 8, color: '#f97316' },
    { code: 'PR-ROT (Rouget Porcin)', count: 6, color: '#ec4899' },
    { code: 'PR-DEP (Déparasitage)', count: 5, color: '#8b5cf6' },
  ];

  // Data for Page 5: Tendances & Saisons
  const tendancesSaisonnieres = [
    { saison: 'Petite Sèche (Jan-Fév)', respiratoires: 28, parasitaires: 10, digestives: 14 },
    { saison: 'Petite Pluie (Mar-Juin)', respiratoires: 18, parasitaires: 26, digestives: 20 },
    { saison: 'Grande Sèche (Juil-Août)', respiratoires: 34, parasitaires: 12, digestives: 16 },
    { saison: 'Grande Pluie (Sep-Nov)', respiratoires: 22, parasitaires: 32, digestives: 28 },
  ];

  // Data for Page 7: Performances par élevage
  const perfElevages = [
    { code: 'LOT-BOV-01', mortalite: 1.4, gmq: 650, efficacite: 96 },
    { code: 'LOT-PORC-02', mortalite: 2.8, gmq: 520, efficacite: 91 },
    { code: 'LOT-AVIC-06', mortalite: 2.1, gmq: 48, efficacite: 94 },
    { code: 'LOT-OVIN-11', mortalite: 1.8, gmq: 180, efficacite: 95 },
    { code: 'LOT-CAPR-12', mortalite: 2.4, gmq: 140, efficacite: 92 },
  ];

  // Filtered interventions for Page 11
  const filteredInterventions = interventions.filter((item) => {
    const matchSearch =
      item.maladieOuSymptome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.diagnostic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.medicament.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.veterinaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lotCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEspece = filterEspece === 'all' || item.especeNom === filterEspece;
    return matchSearch && matchEspece;
  });

  return (
    <div className="space-y-4 p-3 lg:p-4 bg-slate-50 min-h-screen">
      {/* Sub-page Navigation Tabs Header (ALL 12 PAGES VISIBLE) */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 shrink-0">
            <HeartPulse className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-black text-slate-900 uppercase tracking-tight">
              Module Santé Animale :
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              — 12 rapports & registres analytiques
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">
              Page {subPage} / 12
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSubPage((prev) => Math.max(1, prev - 1))}
                disabled={subPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Page précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSubPage((prev) => Math.min(12, prev + 1))}
                disabled={subPage === 12}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Page suivante"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 12 Page Buttons Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
          {Array.from({ length: 12 }).map((_, i) => {
            const pageNum = i + 1;
            const isCurrent = subPage === pageNum;
            return (
              <button
                key={pageNum}
                onClick={() => setSubPage(pageNum)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-emerald-700 text-white shadow-xs font-extrabold scale-102'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span className="opacity-80">P{pageNum}</span>
                <span>{subPageTitles[pageNum]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-PAGE 1: VUE D'ENSEMBLE */}
      {/* ========================================================================= */}
      {subPage === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-emerald-600 p-4 rounded-2xl text-white shadow-2xs flex items-center gap-3">
              <Beef className="w-8 h-8 opacity-80" />
              <div>
                <span className="text-2xl font-black block">12</span>
                <span className="text-[11px] font-medium text-emerald-100">Élevages suivis</span>
              </div>
            </div>
            <div className="bg-sky-600 p-4 rounded-2xl text-white shadow-2xs flex items-center gap-3">
              <Activity className="w-8 h-8 opacity-80" />
              <div>
                <span className="text-2xl font-black block">286</span>
                <span className="text-[11px] font-medium text-sky-100">Animaux du cheptel</span>
              </div>
            </div>
            <div className="bg-emerald-700 p-4 rounded-2xl text-white shadow-2xs flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 opacity-80" />
              <div>
                <span className="text-2xl font-black block">48</span>
                <span className="text-[11px] font-medium text-emerald-100">Protocoles appliqués</span>
              </div>
            </div>
            <div className="bg-amber-600 p-4 rounded-2xl text-white shadow-2xs flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 opacity-80" />
              <div>
                <span className="text-2xl font-black block">{interventions.length}</span>
                <span className="text-[11px] font-medium text-amber-100">Interventions enregistrées</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Évolution mensuelle des interventions vétérinaires
                </h2>
                <span className="text-[11px] font-bold text-emerald-600">Total : {interventions.length} actes</span>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={interventionsEvolutionData}>
                    <defs>
                      <linearGradient id="colorInterv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="val" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#colorInterv)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">
                  Répartition par type d'acte
                </h2>
                <div className="space-y-2 text-xs">
                  {interventionsTypeData.map((d) => (
                    <div key={d.name} className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="flex items-center gap-2 font-medium text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                        {d.name}
                      </span>
                      <span className="font-bold text-slate-900">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={APP_IMAGES.elevageCheptel}
                  alt="Cheptel sain"
                  className="w-16 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div className="text-[11px] text-slate-500">
                  <span className="font-bold text-emerald-800 block">Indice de santé : 92%</span>
                  Suivi régulier assuré par l'équipe vétérinaire COOPS-CA.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PAGE 2: ÉLEVAGES ET EFFECTIFS */}
      {/* ========================================================================= */}
      {subPage === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">
                Répartition des élevages par espèce animale
              </h2>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={elevagesParType}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="type" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]}>
                      {elevagesParType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col items-center justify-center">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2 self-start">
                Effectifs du cheptel (286 têtes)
              </h2>
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={effectifsDonut} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                      {effectifsDonut.map((entry, index) => (
                        <Cell key={`cell-eff-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-900">286</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Animaux</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs w-full mt-2">
                {effectifsDonut.map((e) => (
                  <div key={e.name} className="flex justify-between items-center text-[11px]">
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }}></span>
                      {e.name}
                    </span>
                    <span className="font-bold text-slate-800">{e.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PAGE 3: ÉTAT SANITAIRE DES ANIMAUX */}
      {/* ========================================================================= */}
      {subPage === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col items-center justify-center">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 self-start">
                État général du cheptel
              </h2>
              <div className="w-36 h-36 rounded-full border-8 border-emerald-500 flex flex-col items-center justify-center bg-emerald-50/50 shadow-inner">
                <span className="text-3xl font-black text-emerald-700">92%</span>
                <span className="text-[10px] font-bold text-emerald-800 uppercase">Animaux Sains</span>
              </div>
              <p className="text-xs text-center text-slate-500 mt-4 leading-tight">
                263 animaux sains sur 286 suivis dans les 5 domaines pastoraux.
              </p>
            </div>

            <div className="lg:col-span-8 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">
                Répartition des pathologies diagnostiquées
              </h2>
              <div className="space-y-3">
                {pathologiesData.map((p) => (
                  <div key={p.name}>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-slate-800 font-bold">{p.name}</span>
                      <span className="font-black text-slate-900">{p.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${p.value}%`, backgroundColor: p.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PAGE 4: PROTOCOLES SANITAIRES */}
      {/* ========================================================================= */}
      {subPage === 4 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-6 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">
                Protocoles les plus utilisés (Top 6)
              </h2>
              <div className="space-y-2.5 text-xs">
                {topProtocols.map((p) => (
                  <div key={p.code}>
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-slate-800">{p.code}</span>
                      <span className="font-black text-slate-900">{p.count} applications</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${p.count * 6}%`, backgroundColor: p.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">
                  Types de protocoles (48 protocoles)
                </h2>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded-lg bg-sky-50 text-sky-900 font-bold">
                    <span>● Vaccination de masse</span>
                    <span>71% (34 protocoles)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-orange-50 text-orange-900 font-bold">
                    <span>● Antibiothérapie ciblée</span>
                    <span>15% (7 protocoles)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-amber-50 text-amber-900 font-bold">
                    <span>● Contrôle sérologique</span>
                    <span>7% (4 protocoles)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-emerald-50 text-emerald-900 font-bold">
                    <span>● Déparasitage systématique</span>
                    <span>7% (3 protocoles)</span>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-100">
                Homologation officielle : MINEPIA Délégation Régionale du Centre.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PAGE 5: ANALYSE DES TENDANCES & SAISONNALITÉ */}
      {/* ========================================================================= */}
      {subPage === 5 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                P5 - Analyse des Tendances Épidémiologiques & Impact Saisonnier
              </h2>
              <p className="text-[11px] text-slate-500">
                Corrélations entre précipitations, humidité relative et poussées de pathologies respiratoires et parasitaires.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              Cycle Annuel 2026
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tendancesSaisonnieres}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="saison" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="respiratoires" name="Respiratoires (%)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="parasitaires" name="Parasitaires (%)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="digestives" name="Digestives (%)" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-sky-900">
              <span className="font-bold block mb-1">Pic Respiratoire en Grande Saison Sèche</span>
              Poussières et amplitudes thermiques jour/nuit déclenchent un pic de toux chez les volailles et petits ruminants. Anticipation par nébulisation et vitamines.
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900">
              <span className="font-bold block mb-1">Pic Parasitaire en Grande Saison des Pluies</span>
              Prolifération des tiques et strongles gastro-intestinaux. Déparasitage obligatoire pré-saison pluvieuse à l'Albendazole.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PAGE 6: GÉOLOCALISATION DES ÉLEVAGES */}
      {/* ========================================================================= */}
      {subPage === 6 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                P6 - Géolocalisation & Cartographie des Foyers Sanitaires
              </h2>
              <p className="text-[11px] text-slate-500">
                Zones de surveillance vétérinaire et statut d’immunité collective par bassin pastoral.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              5 Bassins Opérationnels
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {[
              { zone: 'Bassin Obala Nord', elevages: 4, têtes: 110, statut: 'Zone Verte (Indemne)', dist: '12 km du siège' },
              { zone: 'Bassin Sa’a Ruminants', elevages: 3, têtes: 75, statut: 'Zone Verte (Indemne)', dist: '28 km du siège' },
              { zone: 'Station Mbalmayo Sud', elevages: 2, têtes: 45, statut: 'Zone Verte (Indemne)', dist: '55 km du siège' },
              { zone: 'Bafia Mbam Alluvial', elevages: 2, têtes: 36, statut: 'Zone Surveillance', dist: '72 km du siège' },
              { zone: 'Soa Périurbain', elevages: 1, têtes: 20, statut: 'Zone Verte (Indemne)', dist: '18 km du siège' },
            ].map((z) => (
              <div key={z.zone} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{z.zone}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {z.statut}
                  </span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  <div>• {z.elevages} élevages déclarés ({z.têtes} têtes)</div>
                  <div>• Distance intervention : {z.dist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PAGE 7: PERFORMANCES PAR ÉLEVAGE */}
      {/* ========================================================================= */}
      {subPage === 7 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-700" />
                P7 - Performances Zootechniques & Taux de Mortalité
              </h2>
              <p className="text-[11px] text-slate-500">
                Indicateurs de morbidité, mortalité comparée et efficacité des traitements par élevage.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              Moyenne Coop : 2.1% mortalité
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Lot d'Élevage</th>
                  <th className="py-2.5 px-3">Taux de Mortalité (%)</th>
                  <th className="py-2.5 px-3">Gain Moyen Quotidien</th>
                  <th className="py-2.5 px-3">Conformité Sanitaire</th>
                  <th className="py-2.5 px-3 text-right">Statut Qualité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {perfElevages.map((p) => (
                  <tr key={p.code} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{p.code}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{p.mortalite}%</td>
                    <td className="py-2.5 px-3 font-mono">{p.gmq} g/jour</td>
                    <td className="py-2.5 px-3">
                      <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full" style={{ width: `${p.efficacite}%` }}></div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Conforme A+
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PAGE 8: SUIVI DES PROTOCOLES PAR PÉRIODE */}
      {/* ========================================================================= */}
      {subPage === 8 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                P8 - Suivi des Protocoles par Période & Calendrier Vaccinal
              </h2>
              <p className="text-[11px] text-slate-500">
                Rappels programmés, conformité d'exécution et échéances du carnet vaccinal.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              94% Réalisé dans les délais
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-emerald-800 font-medium block">Janvier - Mars</span>
              <span className="text-xl font-black text-emerald-900 block mt-1">100%</span>
              <span className="text-[10px] text-emerald-700 font-bold">Vaccination Newcastle T1</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-emerald-800 font-medium block">Avril - Juin</span>
              <span className="text-xl font-black text-emerald-900 block mt-1">96%</span>
              <span className="text-[10px] text-emerald-700 font-bold">Campagne PPR Ovins/Caprins</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-emerald-800 font-medium block">Juillet - Septembre</span>
              <span className="text-xl font-black text-emerald-900 block mt-1">92%</span>
              <span className="text-[10px] text-emerald-700 font-bold">Déparasitage & Péripneumonie</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-amber-800 font-medium block">Octobre - Décembre</span>
              <span className="text-xl font-black text-amber-900 block mt-1">En cours</span>
              <span className="text-[10px] text-amber-700 font-bold">Rappels Gumboro & Rouget</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PAGE 9: SYNTHÈSE ET RECOMMANDATIONS */}
      {/* ========================================================================= */}
      {subPage === 9 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                P9 - Synthèse d'Audit Sanitaire & Recommandations du Dr. Vétérinaire
              </h2>
              <p className="text-[11px] text-slate-500">
                Prescriptions officielles pour la consolidation du statut sanitaire de la coopérative.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              Visa Dr. Paulin ETOUNDI
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <h3 className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Points Forts & Conquis Notables
              </h3>
              <ul className="space-y-1.5 text-emerald-800">
                <li>• Taux de santé global maintenu à 92% sur les 286 têtes de bétail.</li>
                <li>• Couverture vaccinale générale à 71% des effectifs totaux.</li>
                <li>• Zéro foyer d’épizootie majeure (Peste porcine africaine / Charbon).</li>
                <li>• Gain Moyen Quotidien (GMQ) supérieur de 8% aux moyennes régionales.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                Prescriptions Vétérinaires Prioritaires
              </h3>
              <ul className="space-y-1.5 text-amber-800">
                <li>1. Renouvellement des pédiluves au sulfate de cuivre tous les 14 jours.</li>
                <li>2. Vaccination systématique de tout animal entrant en quarantaine 21 jours.</li>
                <li>3. Respect scrupuleux des délais d'attente lait/viande après antibiothérapie.</li>
                <li>4. Archivage numérique des actes dans le carnet sanitaire COOPS-FLOW.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PAGE 10: IMPACT ET PERSPECTIVES */}
      {/* ========================================================================= */}
      {subPage === 10 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-700" />
                P10 - Impact Économique & Perspectives Pastorales
              </h2>
              <p className="text-[11px] text-slate-500">
                Bénéfices financiers induits par la politique préventive et vision 2027.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              Gain Net : +8,4 M FCFA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-slate-500 block mb-1">Baisse Mortalité</span>
              <span className="text-2xl font-black text-emerald-700">-45%</span>
              <span className="text-[10px] text-emerald-600 block mt-1 font-bold">vs historique traditionnel</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-slate-500 block mb-1">Économie Vétérinaire Curative</span>
              <span className="text-2xl font-black text-sky-700">3,2 M FCFA</span>
              <span className="text-[10px] text-sky-600 block mt-1 font-bold">Grâce aux vaccins préventifs</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-slate-500 block mb-1">Valorisation Carcasse / Lait</span>
              <span className="text-2xl font-black text-purple-700">+14%</span>
              <span className="text-[10px] text-purple-600 block mt-1 font-bold">Meilleure cotation marchande</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PAGE 11: REGISTRE DES INTERVENTIONS (CRUD COMPLET) */}
      {/* ========================================================================= */}
      {subPage === 11 && (
        <div className="space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-emerald-700" />
                  P11 - Registre Numérique des Actes Vétérinaires & Carnet Sanitaire (CRUD)
                </h2>
                <p className="text-xs text-slate-500">
                  Création, consultation, modification et suppression des actes de soins sur les lots d'animaux.
                </p>
              </div>

              {canPerform('create', 'sante_animale') && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setFormIntervention({
                      date: new Date().toISOString().slice(0, 10),
                      lotCode: 'LOT-BOV-T001-P001',
                      especeNom: 'Bovins',
                      maladieOuSymptome: '',
                      diagnostic: '',
                      traitementAdministre: '',
                      medicament: '',
                      veterinaire: `Dr. ${currentUser.nom || 'Paulin ETOUNDI'}`,
                      coutFCFA: 35000,
                      statutGuerison: 'En cours',
                    });
                    setIsAddModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-all shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvelle Intervention</span>
                </button>
              )}
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par symptôme, médicament, lot ou praticien..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={filterEspece}
                  onChange={(e) => setFilterEspece(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-700 outline-none"
                >
                  <option value="all">Toutes les espèces</option>
                  <option value="Bovins">Bovins</option>
                  <option value="Porcins">Porcins</option>
                  <option value="Volailles">Volailles</option>
                  <option value="Caprins">Caprins</option>
                  <option value="Ovins">Ovins</option>
                </select>
              </div>
            </div>

            {/* Interventions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">Date & Réf</th>
                    <th className="py-2.5 px-3">Lot / Espèce</th>
                    <th className="py-2.5 px-3">Diagnostic & Symptôme</th>
                    <th className="py-2.5 px-3">Traitement & Posologie</th>
                    <th className="py-2.5 px-3">Praticien Vétérinaire</th>
                    <th className="py-2.5 px-3">Coût (FCFA)</th>
                    <th className="py-2.5 px-3">Statut</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInterventions.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{item.date}</div>
                        <div className="text-[10px] font-mono text-slate-400">{item.id}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-800">{item.lotCode}</div>
                        <div className="text-[11px] text-slate-500">{item.especeNom}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{item.diagnostic}</div>
                        <div className="text-[11px] text-slate-500">{item.maladieOuSymptome}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-slate-800">{item.traitementAdministre}</div>
                        <div className="text-[10px] font-mono text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded w-fit mt-0.5">
                          {item.medicament}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">{item.veterinaire}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {item.coutFCFA.toLocaleString()} F
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.statutGuerison === 'Guéri'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.statutGuerison === 'En cours'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.statutGuerison}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {canPerform('edit', 'sante_animale') && (
                            <button
                              onClick={() => handleEditClick(item)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                              title="Modifier cette intervention"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {canPerform('delete', 'sante_animale') && (
                            <button
                              onClick={() => deleteIntervention(item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Supprimer cette fiche"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PAGE 12: MATRICE DES RISQUES & BIOSÉCURITÉ */}
      {/* ========================================================================= */}
      {subPage === 12 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-700" />
                P12 - Matrice des Risques Épizootiques Majeurs & Protocole de Biosécurité
              </h2>
              <p className="text-[11px] text-slate-500">
                Dispositif de veille sanitaire MINEPIA et plans de contingence d'urgence.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-xs">
              Plan d'Urgence Homologué
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="font-bold text-slate-900 block text-xs">Épizooties Surveillées Prioritairement</span>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">Peste Porcine Africaine (PPA)</div>
                    <div className="text-[10px] text-slate-500">Impact : Critique • Risque résiduel : Faible</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Indemne
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">Péripneumonie Contagieuse Bovine (PCCB)</div>
                    <div className="text-[10px] text-slate-500">Impact : Élevé • Risque résiduel : Modéré</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[10px]">
                    Vacciné 100%
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">Grippe Aviaire Hautement Pathogène (IAHP)</div>
                    <div className="text-[10px] text-slate-500">Impact : Majeur • Risque résiduel : Très faible</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Indemne
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="font-bold text-slate-900 block text-xs">Normes de Biosécurité Obligatoires</span>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Sas de désinfection :</strong> Tout véhicule de collecte ou visiteur passe par le rotoluve d'entrée.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Quarantaine 21 jours :</strong> Tout animal nouvellement acquis est isolé avant intégration au troupeau.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Temps d'attente Lait/Viande :</strong> Interdiction de commercialiser les productions d'animaux sous traitement (délai 14 j).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Numéro d'urgence MINEPIA :</strong> Signalement immédiat sous 24h en cas de mortalité anormale (&gt;3 sujets).
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AJOUT / ÉDITION D'INTERVENTION SANITAIRE (CRUD) */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-700" />
                {editingId ? 'Modifier l’Intervention Sanitaire' : 'Enregistrer un Nouvel Acte Vétérinaire'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveIntervention} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date de l’acte</label>
                  <input
                    type="date"
                    required
                    value={formIntervention.date}
                    onChange={(e) => setFormIntervention({ ...formIntervention, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Espèce animale</label>
                  <select
                    value={formIntervention.especeNom}
                    onChange={(e) => setFormIntervention({ ...formIntervention, especeNom: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none font-medium"
                  >
                    <option value="Bovins">Bovins</option>
                    <option value="Porcins">Porcins</option>
                    <option value="Volailles">Volailles</option>
                    <option value="Caprins">Caprins</option>
                    <option value="Ovins">Ovins</option>
                    <option value="Pisciculture">Pisciculture</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Code du lot</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: LOT-BOV-T001-P001"
                    value={formIntervention.lotCode}
                    onChange={(e) => setFormIntervention({ ...formIntervention, lotCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Docteur / Praticien</label>
                  <input
                    type="text"
                    required
                    value={formIntervention.veterinaire}
                    onChange={(e) => setFormIntervention({ ...formIntervention, veterinaire: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Symptômes observés</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Boiterie unguéale sur taureau"
                  value={formIntervention.maladieOuSymptome}
                  onChange={(e) =>
                    setFormIntervention({ ...formIntervention, maladieOuSymptome: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Diagnostic clinique</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Panaris interdigité consécutif aux boues"
                  value={formIntervention.diagnostic}
                  onChange={(e) => setFormIntervention({ ...formIntervention, diagnostic: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Traitement & Posologie</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Pédiluve + Injection L.A."
                    value={formIntervention.traitementAdministre}
                    onChange={(e) =>
                      setFormIntervention({ ...formIntervention, traitementAdministre: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Médicament utilisé</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Tenaline L.A."
                    value={formIntervention.medicament}
                    onChange={(e) => setFormIntervention({ ...formIntervention, medicament: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Coût (FCFA)</label>
                  <input
                    type="number"
                    required
                    value={formIntervention.coutFCFA}
                    onChange={(e) =>
                      setFormIntervention({ ...formIntervention, coutFCFA: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Statut de guérison</label>
                  <select
                    value={formIntervention.statutGuerison}
                    onChange={(e) =>
                      setFormIntervention({
                        ...formIntervention,
                        statutGuerison: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none font-bold"
                  >
                    <option value="En cours">En cours</option>
                    <option value="Guéri">Guéri</option>
                    <option value="Rechute">Rechute</option>
                    <option value="Perte">Perte</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-xs"
                >
                  {editingId ? 'Mettre à jour' : 'Enregistrer dans le registre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

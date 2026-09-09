import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Database,
  Code2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Search,
  Copy,
  Check,
  Layers,
  Table,
  Filter,
  TrendingUp,
  Eye,
  FileCode,
  Calendar,
  DollarSign,
  Wheat,
  Beef,
  Truck,
  Warehouse,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
} from 'recharts';
import { STRATEGIC_QUESTIONS_DATA, StrategicQuestion } from '../data/strategicQuestions';
import { DAX_MEASURES_CATALOG, DaxMeasureDefinition } from '../data/daxMeasures';

type ViewMode = 'global' | 'unitaire' | 'dax_catalog' | 'schema';

export const BiAnalyticsModule: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('global');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('Q1');
  const [daxSearchTerm, setDaxSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAllDax, setCopiedAllDax] = useState<boolean>(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'dax' | 'sql'>('dax');

  // Selected question object
  const currentQuestion = useMemo(() => {
    return (
      STRATEGIC_QUESTIONS_DATA.find((q) => q.id === selectedQuestionId) ||
      STRATEGIC_QUESTIONS_DATA[0]
    );
  }, [selectedQuestionId]);

  // Handler to jump directly from global view into unit explanation
  const handleJumpToQuestion = (qId: string) => {
    setSelectedQuestionId(qId);
    setViewMode('unitaire');
  };

  // Copy code helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  // Copy all DAX measures helper
  const handleCopyAllDax = () => {
    const fullScript = DAX_MEASURES_CATALOG.map(
      (m) => `-- ${m.category.toUpperCase()} : ${m.name}\n${m.daxFormula}`
    ).join('\n\n');
    navigator.clipboard.writeText(
      `-- =========================================\n-- COOPS CA NKUL FA — Mesures DAX Complètes\n-- =========================================\n\n${fullScript}`
    );
    setCopiedAllDax(true);
    setTimeout(() => setCopiedAllDax(false), 2500);
  };

  // Filtered DAX measures
  const filteredDaxMeasures = useMemo(() => {
    return DAX_MEASURES_CATALOG.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(daxSearchTerm.toLowerCase()) ||
        m.daxFormula.toLowerCase().includes(daxSearchTerm.toLowerCase()) ||
        m.sourceTable.toLowerCase().includes(daxSearchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(daxSearchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' || m.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [daxSearchTerm, selectedCategory]);

  const categories = useMemo(() => {
    return Array.from(new Set(DAX_MEASURES_CATALOG.map((m) => m.category)));
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full mb-1 border border-emerald-100">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Moteur d'Aide à la Décision & Modélisation BI</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Réponses aux 8 Questions Stratégiques Décisionnelles
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">
            Passage immédiat de la vue globale à l’explication unitaire : chaque question métier est couplée à sa formule DAX / SQL et sa restitution visuelle du module Analyses & Système.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-mono font-bold bg-stone-900 text-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            Power BI • Star Schema
          </span>
          <button
            onClick={handleCopyAllDax}
            className="text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            title="Copier toutes les mesures DAX pour Power BI / Tabular Editor"
          >
            {copiedAllDax ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-200" />
                <span>Script DAX Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-emerald-200" />
                <span>Copier les Mesures DAX</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setViewMode('global')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'global'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Vue Globale (Cockpit des 8 Questions)</span>
        </button>

        <button
          onClick={() => setViewMode('unitaire')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'unitaire'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Explication Unitaire ({currentQuestion.id})</span>
        </button>

        <button
          onClick={() => setViewMode('dax_catalog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'dax_catalog'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Dictionnaire des Mesures DAX ({DAX_MEASURES_CATALOG.length})</span>
        </button>

        <button
          onClick={() => setViewMode('schema')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'schema'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Schéma Relationnel en Étoile (Data Warehouse)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: VUE GLOBALE (COCKPIT DES 8 QUESTIONS DÉCISIONNELLES) */}
      {/* ======================================================== */}
      {viewMode === 'global' && (
        <div className="space-y-6">
          {/* Executive Header Note */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 via-amber-50/40 to-stone-50 rounded-2xl border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xs font-black uppercase text-emerald-900 tracking-wide">
                  Matrice Décisionnelle Stratégique • Vue Globale Directoire
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  Cliquez sur n'importe quelle question pour forer immédiatement dans son explication unitaire détaillée, sa formule DAX / SQL et sa restitution visuelle.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-stone-600 bg-white border border-stone-200 px-3 py-1 rounded-lg shrink-0">
              Exercice Actif : 2026-A / 2026-B
            </span>
          </div>

          {/* Grid of 8 Strategic Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {STRATEGIC_QUESTIONS_DATA.map((q) => {
              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="p-4 pb-3 border-b border-stone-100">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                        {q.id}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-stone-500 truncate max-w-[170px]">
                        {q.pillar}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-stone-900 leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2">
                      {q.title}
                    </h3>
                  </div>

                  {/* Card Body : Key Metric */}
                  <div className="p-4 py-3 bg-stone-50/60 space-y-2">
                    <div>
                      <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                        {q.keyMetric.label}
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-lg font-black text-stone-900">
                          {q.keyMetric.value}
                        </span>
                        {q.keyMetric.status === 'optimal' ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Optimal
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Vigilance
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-600 mt-0.5 truncate">
                        {q.keyMetric.sublabel}
                      </p>
                    </div>

                    {/* DAX Formula Snippet */}
                    <div className="bg-stone-900 rounded-lg p-2 font-mono text-[10px] text-emerald-300 truncate">
                      <code>{q.daxMeasures.primary.split('\n')[0]}</code>
                    </div>
                  </div>

                  {/* Card Footer : Immediate Jump Button */}
                  <div className="p-3 bg-white border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-stone-400">
                      {q.chartTitle.slice(0, 22)}...
                    </span>
                    <button
                      onClick={() => handleJumpToQuestion(q.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <span>Explication Unitaire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Summary Insights Bento Banner */}
          <div className="bg-stone-900 text-stone-200 rounded-2xl p-6 border border-stone-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Cockpit de Synthèse Analytique
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Performance Globale COOPS CA NKUL FA (Synthèse des 8 Questions)
                </h3>
              </div>
              <button
                onClick={() => setViewMode('dax_catalog')}
                className="text-xs font-bold text-stone-900 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-xl transition-colors shrink-0"
              >
                Explorer le Dictionnaire DAX
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-stone-800">
              <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/50">
                <span className="text-[11px] text-stone-400 block">Foncier Actif</span>
                <span className="text-lg font-black text-emerald-400">251.5 ha</span>
                <span className="text-[10px] text-stone-400 block mt-0.5">5 Domaines Cadastrés</span>
              </div>
              <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/50">
                <span className="text-[11px] text-stone-400 block">Production Totale</span>
                <span className="text-lg font-black text-sky-400">2 640 tonnes</span>
                <span className="text-[10px] text-stone-400 block mt-0.5">+30.7% vs N-1</span>
              </div>
              <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/50">
                <span className="text-[11px] text-stone-400 block">Résultat Financier</span>
                <span className="text-lg font-black text-emerald-400">+43.2 M FCFA</span>
                <span className="text-[10px] text-stone-400 block mt-0.5">Couverture : 169.2%</span>
              </div>
              <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/50">
                <span className="text-[11px] text-stone-400 block">Survie Cheptel</span>
                <span className="text-lg font-black text-amber-400">94.4 %</span>
                <span className="text-[10px] text-stone-400 block mt-0.5">982 têtes en exploitation</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: EXPLICATION UNITAIRE D'UNE QUESTION MÉTIER */}
      {/* ======================================================== */}
      {viewMode === 'unitaire' && (
        <div className="space-y-6">
          {/* Navigation bar between questions */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('global')}
                className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour au Cockpit Global</span>
              </button>
              <div className="h-5 w-px bg-stone-200 mx-1 hidden sm:block" />
              <span className="text-xs font-semibold text-stone-500 hidden sm:inline">
                Forage unitaire :
              </span>
            </div>

            {/* Questions Quick Pills */}
            <div className="flex flex-wrap items-center gap-1">
              {STRATEGIC_QUESTIONS_DATA.map((q) => {
                const isCurrent = q.id === currentQuestion.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQuestionId(q.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      isCurrent
                        ? 'bg-emerald-800 text-amber-300 shadow-xs scale-105'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deep Dive Container */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            {/* Question Top Header */}
            <div className="p-6 border-b border-stone-200 bg-stone-50/50">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md">
                      {currentQuestion.id}
                    </span>
                    <span className="text-xs font-bold uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                      {currentQuestion.pillar}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-stone-900 tracking-tight">
                    {currentQuestion.title}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    {currentQuestion.subtitle}
                  </p>
                </div>

                {/* Key Metric Badge */}
                <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs min-w-[220px] shrink-0">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    {currentQuestion.keyMetric.label}
                  </span>
                  <div className="text-2xl font-black text-emerald-800 mt-0.5">
                    {currentQuestion.keyMetric.value}
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {currentQuestion.keyMetric.sublabel}
                  </p>
                  {currentQuestion.keyMetric.target && (
                    <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-2">
                      {currentQuestion.keyMetric.target}
                    </span>
                  )}
                </div>
              </div>

              {/* Business Issue Box */}
              <div className="mt-4 p-3 bg-white rounded-xl border border-stone-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-stone-700">
                  <strong className="text-stone-900 font-bold">Enjeu Décisionnel Métier : </strong>
                  <span>{currentQuestion.businessIssue}</span>
                </div>
              </div>
            </div>

            {/* Split Screen: Left Visual Restitution, Right DAX / SQL Code */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (7 cols): Interactive Visual Chart */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-xs font-black uppercase text-stone-800 tracking-wider">
                      Restitution Visuelle Module Analyses & Système
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-500">
                    {currentQuestion.chartTitle}
                  </span>
                </div>

                {/* Chart Rendering */}
                <div className="bg-stone-50/50 p-4 rounded-xl border border-stone-200 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    {currentQuestion.chartType === 'pie' ? (
                      <PieChart>
                        <Pie
                          data={currentQuestion.chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          label={({ name, percent }) =>
                            `${name.split(' ')[0]} (${(percent * 100).toFixed(0)}%)`
                          }
                          labelLine={false}
                        >
                          {currentQuestion.chartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color || '#059669'}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1c1917',
                            color: '#fff',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                          formatter={(val: any) => [
                            `${Number(val).toLocaleString()} FCFA`,
                            'Montant',
                          ]}
                        />
                      </PieChart>
                    ) : currentQuestion.chartType === 'composed' ? (
                      <ComposedChart
                        data={currentQuestion.chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#78716c" />
                        <YAxis tick={{ fontSize: 11 }} stroke="#78716c" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1c1917',
                            color: '#fff',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Bar
                          dataKey="prevue"
                          name="Prévu (t)"
                          fill="#cbd5e1"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="recoltee"
                          name="Récolté (t)"
                          fill="#059669"
                          radius={[4, 4, 0, 0]}
                        />
                        <Line
                          type="monotone"
                          dataKey="rendement"
                          name="Rdt (t/ha)"
                          stroke="#d97706"
                          strokeWidth={2}
                        />
                      </ComposedChart>
                    ) : (
                      <BarChart
                        data={currentQuestion.chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#78716c" />
                        <YAxis tick={{ fontSize: 11 }} stroke="#78716c" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1c1917',
                            color: '#fff',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                        {currentQuestion.chartData[0]?.recettes !== undefined ? (
                          <>
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                            <Bar
                              dataKey="recettes"
                              name="Recettes (M FCFA)"
                              fill="#059669"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar
                              dataKey="depenses"
                              name="Dépenses (M FCFA)"
                              fill="#ef4444"
                              radius={[4, 4, 0, 0]}
                            />
                          </>
                        ) : currentQuestion.chartData[0]?.caM !== undefined ? (
                          <Bar
                            dataKey="caM"
                            name="CA (M FCFA)"
                            fill="#e11d48"
                            radius={[4, 4, 0, 0]}
                          />
                        ) : currentQuestion.chartData[0]?.montantM !== undefined ? (
                          <Bar
                            dataKey="montantM"
                            name="Montant Collecte (M FCFA)"
                            fill="#d97706"
                            radius={[4, 4, 0, 0]}
                          />
                        ) : currentQuestion.chartData[0]?.surfaceHa !== undefined ? (
                          <Bar
                            dataKey="surfaceHa"
                            name="Superficie (ha)"
                            fill="#059669"
                            radius={[4, 4, 0, 0]}
                          />
                        ) : (
                          <Bar
                            dataKey="actuel"
                            name="Effectif Actuel"
                            fill="#0284c7"
                            radius={[4, 4, 0, 0]}
                          />
                        )}
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* Insight Box */}
                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <strong className="text-emerald-950 font-black block">
                      Constat Analytique & Diagnostic :
                    </strong>
                    <p className="text-emerald-900 leading-relaxed">
                      {currentQuestion.insight}
                    </p>
                  </div>
                </div>

                {/* Action Plan */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-2">
                    Plan d'Action Décisionnel Préconisé :
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-700">
                    {currentQuestion.actionPlan.map((action, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column (5 cols): Coupled DAX Formula & SQL Star Schema */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-black uppercase text-stone-800">
                      Modélisation & Formules
                    </span>
                  </div>

                  {/* Code Language Switcher */}
                  <div className="flex items-center bg-stone-100 p-0.5 rounded-lg text-xs font-bold">
                    <button
                      onClick={() => setActiveCodeTab('dax')}
                      className={`px-3 py-1 rounded-md transition-all ${
                        activeCodeTab === 'dax'
                          ? 'bg-stone-900 text-amber-300 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      DAX Power BI
                    </button>
                    <button
                      onClick={() => setActiveCodeTab('sql')}
                      className={`px-3 py-1 rounded-md transition-all ${
                        activeCodeTab === 'sql'
                          ? 'bg-stone-900 text-amber-300 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      SQL Schéma Étoile
                    </button>
                  </div>
                </div>

                {/* Code Block Container */}
                <div className="relative bg-stone-900 rounded-xl p-4 border border-stone-800 text-stone-100 font-mono text-xs shadow-inner">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800 text-[10px] text-stone-400">
                    <span>
                      {activeCodeTab === 'dax'
                        ? 'Formule DAX Officielle COOPS CA'
                        : 'Requête Data Warehouse PostgreSQL / BigQuery'}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(
                          activeCodeTab === 'dax'
                            ? currentQuestion.daxMeasures.primaryFormula
                            : currentQuestion.sqlQuery,
                          `code-${currentQuestion.id}`
                        )
                      }
                      className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      {copiedId === `code-${currentQuestion.id}` ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copier le code</span>
                        </>
                      )}
                    </button>
                  </div>

                  {activeCodeTab === 'dax' ? (
                    <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed text-emerald-300">
                      {currentQuestion.daxMeasures.primaryFormula}
                    </pre>
                  ) : (
                    <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed text-sky-300">
                      {currentQuestion.sqlQuery}
                    </pre>
                  )}
                </div>

                {/* Related Secondary DAX Measures */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                    Mesures DAX Associées au Calcul :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentQuestion.daxMeasures.secondary.map((sm, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono font-medium bg-white text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded shadow-2xs"
                      >
                        [{sm}]
                      </span>
                    ))}
                  </div>
                </div>

                {/* Star Schema Relational Mapping Tip */}
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-950">
                  <strong className="font-bold block mb-0.5">
                    Tables sollicitées dans le Schéma en Étoile :
                  </strong>
                  <p className="text-[11px] text-amber-900 leading-snug">
                    Fait principal connecté aux dimensions par relations 1-à-Plusieurs (1:N) avec filtrage bidirectionnel sur le calendrier d'exploitation.
                  </p>
                </div>
              </div>
            </div>

            {/* Drill-down / Audit Table (Unit Data Underneath) */}
            <div className="p-6 border-t border-stone-200 bg-stone-50/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-stone-700" />
                  <h3 className="text-xs font-black uppercase text-stone-800 tracking-wider">
                    Données Unitaires Forables (Lignes de Faits Source)
                  </h3>
                </div>
                <span className="text-[11px] text-stone-500">
                  {currentQuestion.auditData.rows.length} enregistrements détaillés
                </span>
              </div>

              <div className="overflow-x-auto border border-stone-200 rounded-xl bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-600 font-bold uppercase tracking-wider">
                    <tr>
                      {currentQuestion.auditData.headers.map((h, i) => (
                        <th key={i} className="py-2.5 px-4">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {currentQuestion.auditData.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-stone-50 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`py-2.5 px-4 ${
                              cIdx === 0
                                ? 'font-bold text-stone-900'
                                : cIdx === row.length - 1
                                ? 'font-bold text-emerald-800'
                                : 'text-stone-700'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 3: DICTIONNAIRE DES MESURES DAX (STAR SCHEMA) */}
      {/* ======================================================== */}
      {viewMode === 'dax_catalog' && (
        <div className="space-y-6">
          {/* Top Bar for DAX Catalog */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full mb-1">
                <Code2 className="w-3.5 h-3.5" />
                <span>Référentiel Matriciel DAX & Modèle en Étoile</span>
              </div>
              <h2 className="text-xl font-black text-stone-900 tracking-tight">
                Catalogue Officiel des Mesures DAX COOPS CA NKUL FA
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Chaque mesure est formalisée pour Power BI Desktop, Tabular Editor et compatible avec les tables de faits du Star Schema.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAllDax}
                className="text-xs font-bold bg-stone-900 hover:bg-stone-800 text-amber-300 px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-xs"
              >
                {copiedAllDax ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Script DAX Intégral Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>Copier Tout le Script DAX</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="Rechercher une mesure DAX, une table (ex: F_Production), un mot-clé..."
                  value={daxSearchTerm}
                  onChange={(e) => setDaxSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Toutes ({DAX_MEASURES_CATALOG.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-emerald-900 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Measures Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDaxMeasures.map((measure) => {
              return (
                <div
                  key={measure.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-500 transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          {measure.category}
                        </span>
                        <h3 className="text-sm font-black text-stone-900 mt-1">
                          {measure.name}
                        </h3>
                      </div>

                      <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                        {measure.sourceTable}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 mb-3 leading-snug">
                      {measure.description}
                    </p>

                    {/* Calculated Live Value */}
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 mb-3 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-stone-500 uppercase">
                        Valeur Calculée
                      </span>
                      <span className="text-xs font-black text-emerald-800">
                        {measure.calculatedValue}
                      </span>
                    </div>

                    {/* DAX Code block */}
                    <div className="relative bg-stone-900 rounded-xl p-3 font-mono text-xs text-amber-300 overflow-x-auto">
                      <pre className="whitespace-pre-wrap leading-relaxed text-[11px]">
                        {measure.daxFormula}
                      </pre>
                      <button
                        onClick={() => handleCopy(measure.daxFormula, measure.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                        title="Copier la formule DAX"
                      >
                        {copiedId === measure.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Footer SQL preview */}
                  <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="truncate max-w-[220px] font-mono text-[10px]">
                      {measure.sqlEquivalent}
                    </span>
                    <span className="text-[10px] font-semibold text-stone-400">
                      {measure.returnType}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 4: SCHÉMA RELATIONNEL EN ÉTOILE (DATA WAREHOUSE) */}
      {/* ======================================================== */}
      {viewMode === 'schema' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full mb-1">
                <Database className="w-3.5 h-3.5" />
                <span>Architecture Modélisation BI</span>
              </div>
              <h2 className="text-xl font-black text-stone-900 tracking-tight">
                Modèle Relationnel en Étoile (Star Schema) • COOPS CA NKUL FA
              </h2>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Les tables de faits (<code className="font-mono text-emerald-800">F_*</code>) contiennent les métriques quantitatives (tonnages, montants FCFA, mortalités, effectifs), reliées aux tables de dimensions (<code className="font-mono text-emerald-800">D_*</code>) pour permettre le forage analytique multidimensionnel.
              </p>
            </div>

            {/* Visual Schema Representation */}
            <div className="mt-6 p-6 bg-stone-900 text-stone-200 rounded-2xl border border-stone-800 overflow-x-auto">
              <div className="min-w-[700px] space-y-6">
                {/* Dimensions Top Row */}
                <div className="flex justify-between items-center gap-4">
                  <div className="p-3 bg-stone-800 rounded-xl border border-stone-700 w-44">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block">
                      DIMENSION
                    </span>
                    <strong className="text-xs text-white block">D_Calendrier</strong>
                    <span className="text-[10px] text-stone-400">Date, Mois, Année, Saison</span>
                  </div>

                  <div className="p-3 bg-stone-800 rounded-xl border border-stone-700 w-44">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block">
                      DIMENSION
                    </span>
                    <strong className="text-xs text-white block">D_Membres</strong>
                    <span className="text-[10px] text-stone-400">ID_Membre, Nom, Commune, Statut</span>
                  </div>

                  <div className="p-3 bg-stone-800 rounded-xl border border-stone-700 w-44">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block">
                      DIMENSION
                    </span>
                    <strong className="text-xs text-white block">D_Terrains / Parcelles</strong>
                    <span className="text-[10px] text-stone-400">Superficie_ha, Sol, Statut_Foncier</span>
                  </div>
                </div>

                {/* Central Fact Tables */}
                <div className="p-5 bg-stone-800/80 rounded-2xl border-2 border-emerald-600/50 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                      TABLES DE FAITS (MESURES QUANTITATIVES & FLUX)
                    </span>
                    <span className="text-[11px] text-emerald-300 font-mono">
                      1:N Relationships
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-700">
                      <strong className="text-emerald-400 block">F_Production</strong>
                      <span className="text-[10px] text-stone-400">
                        Production_kg, Surface_ha, Cout_FCFA, Marge_FCFA
                      </span>
                    </div>

                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-700">
                      <strong className="text-emerald-400 block">F_Collecte & F_Ventes</strong>
                      <span className="text-[10px] text-stone-400">
                        Quantite_kg, Montant_FCFA, Prix_Moyen_kg
                      </span>
                    </div>

                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-700">
                      <strong className="text-emerald-400 block">F_Finances & F_Stocks</strong>
                      <span className="text-[10px] text-stone-400">
                        Type_Mouvement, Montant_FCFA, Pertes_kg
                      </span>
                    </div>

                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-700">
                      <strong className="text-emerald-400 block">D_Lot_Elevage</strong>
                      <span className="text-[10px] text-stone-400">
                        Effectif_Initial, Naissances, Mortalites, Actuel
                      </span>
                    </div>

                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-700">
                      <strong className="text-emerald-400 block">F_Alimentation_Elevage</strong>
                      <span className="text-[10px] text-stone-400">
                        Quantite_Distribuee_kg, Gaspillage_kg, Cout_FCFA
                      </span>
                    </div>

                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-700">
                      <strong className="text-emerald-400 block">F_Sante_Animale</strong>
                      <span className="text-[10px] text-stone-400">
                        Type_Intervention, Cout_FCFA, Retard_Vaccin
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dimensions Bottom Row */}
                <div className="flex justify-between items-center gap-4">
                  <div className="p-3 bg-stone-800 rounded-xl border border-stone-700 w-44">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block">
                      DIMENSION
                    </span>
                    <strong className="text-xs text-white block">D_Especes & Races</strong>
                    <span className="text-[10px] text-stone-400">Goudali, Large White, Cobb 500</span>
                  </div>

                  <div className="p-3 bg-stone-800 rounded-xl border border-stone-700 w-44">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block">
                      DIMENSION
                    </span>
                    <strong className="text-xs text-white block">D_Magasins & Silos</strong>
                    <span className="text-[10px] text-stone-400">Yaoundé, Obala, Mbalmayo</span>
                  </div>

                  <div className="p-3 bg-stone-800 rounded-xl border border-stone-700 w-44">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block">
                      DIMENSION
                    </span>
                    <strong className="text-xs text-white block">D_Cultures</strong>
                    <span className="text-[10px] text-stone-400">Maïs CMS, Soja TGX, Manioc IRAD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

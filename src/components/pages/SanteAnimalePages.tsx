import React, { useState } from 'react';
import {
  HeartPulse,
  Activity,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Award,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Beef,
  Sprout,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { APP_IMAGES } from '../../assets/images';

export const SanteAnimalePages: React.FC<{ initialSubPage?: number }> = ({ initialSubPage = 1 }) => {
  const [subPage, setSubPage] = useState<number>(initialSubPage);

  React.useEffect(() => {
    if (initialSubPage && initialSubPage >= 1 && initialSubPage <= 10) {
      setSubPage(initialSubPage);
    }
  }, [initialSubPage]);

  const subPageTitles: Record<number, string> = {
    1: "Vue d'ensemble",
    2: "Élevages et effectifs",
    3: "État sanitaire des animaux",
    4: "Protocoles sanitaires",
    5: "Analyse des tendances",
    6: "Géolocalisation des élevages",
    7: "Performances par élevage",
    8: "Suivi des protocoles par période",
    9: "Synthèse et recommandations",
    10: "Impact et perspectives",
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
    { name: 'Peau', value: 18, color: '#10b981' },
    { name: 'Parasitaires', value: 14, color: '#8b5cf6' },
    { name: 'Autres', value: 12, color: '#94a3b8' },
  ];

  // Data for Page 4: Protocols
  const topProtocols = [
    { code: 'PR-NCD (Newcastle)', count: 15, color: '#0284c7' },
    { code: 'PR-PPR (PPR)', count: 12, color: '#0ea5e9' },
    { code: 'PR-GUM (Gumboro)', count: 10, color: '#eab308' },
    { code: 'PR-PCCB (PCCB)', count: 8, color: '#f97316' },
    { code: 'PR-ROT (Rouget)', count: 6, color: '#ec4899' },
    { code: 'PR-DEP (Déparasitage)', count: 5, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-4 p-3 lg:p-4 bg-slate-50 min-h-screen">
      {/* Sub-page Navigation Tabs Header */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-1 shrink-0">
          <HeartPulse className="w-4 h-4 text-rose-600 mr-1" />
          <span className="text-xs font-black text-slate-900 uppercase tracking-tight">
            Santé Animale :
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {Array.from({ length: 10 }).map((_, i) => {
            const pageNum = i + 1;
            const isCurrent = subPage === pageNum;
            return (
              <button
                key={pageNum}
                onClick={() => setSubPage(pageNum)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                P{pageNum} - {subPageTitles[pageNum]}
              </button>
            );
          })}
        </div>
        <span className="text-[11px] font-mono text-slate-400 font-bold px-2 shrink-0">
          Page {subPage}/12
        </span>
      </div>

      {/* SUB-PAGE 1: VUE D'ENSEMBLE (Matching Screenshot 1 top-left) */}
      {subPage === 1 && (
        <div className="space-y-4">
          {/* 4 KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-emerald-600 p-4 rounded-2xl text-white shadow-2xs flex items-center gap-3">
              <Sprout className="w-8 h-8 opacity-80" />
              <div>
                <span className="text-2xl font-black block">12</span>
                <span className="text-[11px] font-medium text-emerald-100">Élevages suivis</span>
              </div>
            </div>
            <div className="bg-sky-600 p-4 rounded-2xl text-white shadow-2xs flex items-center gap-3">
              <Beef className="w-8 h-8 opacity-80" />
              <div>
                <span className="text-2xl font-black block">286</span>
                <span className="text-[11px] font-medium text-sky-100">Animaux suivis</span>
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
                <span className="text-2xl font-black block">24</span>
                <span className="text-[11px] font-medium text-amber-100">Interventions sanitaires</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Chart: Évolution des interventions sanitaires */}
            <div className="lg:col-span-8 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
                Évolution des interventions sanitaires
              </h2>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={interventionsEvolutionData}>
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" domain={[0, 30]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="val" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Photo Card */}
            <div className="lg:col-span-4 rounded-2xl overflow-hidden relative shadow-2xs border border-slate-200 flex flex-col justify-end min-h-[200px]">
              <img
                src={APP_IMAGES.cowsHerd}
                alt="Animaux en bonne santé"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent"></div>
              <div className="relative p-4 text-white z-10">
                <p className="font-serif italic font-bold text-sm text-emerald-100">
                  « Des animaux en bonne santé, une production durable »
                </p>
              </div>
            </div>
          </div>

          {/* Répartition des interventions */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
                Répartition des interventions par type
              </h2>
              <p className="text-xs text-slate-500">
                Prédominance de la prévention vaccinale et du suivi clinique régulier
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative w-36 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={interventionsTypeData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={2} dataKey="value">
                      {interventionsTypeData.map((e, idx) => (
                        <Cell key={idx} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 text-xs">
                {interventionsTypeData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                    <span className="text-slate-600">{d.name} :</span>
                    <span className="font-bold text-slate-900">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-PAGE 2: ÉLEVAGES ET EFFECTIFS (Screenshot 1 top-center) */}
      {subPage === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Nombre d'élevages par type */}
            <div className="lg:col-span-6 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
                Nombre d'élevages par type
              </h2>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={elevagesParType}>
                    <XAxis dataKey="type" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Répartition des effectifs (286 animaux) */}
            <div className="lg:col-span-6 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={effectifsDonut} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                      {effectifsDonut.map((e, idx) => (
                        <Cell key={idx} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-black text-slate-900">286</span>
                  <span className="text-[10px] text-slate-500 font-bold">animaux</span>
                </div>
              </div>

              <div className="space-y-2 text-xs flex-1 pl-4">
                {effectifsDonut.map((d) => (
                  <div key={d.name} className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                      <span className="text-slate-700 font-medium">{d.name}</span>
                    </span>
                    <span className="font-bold text-slate-900">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top 5 Effectifs par élevage */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">
              Effectifs par élevage (Top 5)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600">
                    <th className="py-2 px-3">Élevage</th>
                    <th className="py-2 px-3 text-right">Bovins</th>
                    <th className="py-2 px-3 text-right">Ovins</th>
                    <th className="py-2 px-3 text-right">Caprins</th>
                    <th className="py-2 px-3 text-right">Porcins</th>
                    <th className="py-2 px-3 text-right">Volailles</th>
                    <th className="py-2 px-3 text-right font-black text-emerald-800">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 font-medium">
                    <td className="py-2 px-3 font-bold text-slate-900">NKUL</td>
                    <td className="py-2 px-3 text-right">26</td>
                    <td className="py-2 px-3 text-right">18</td>
                    <td className="py-2 px-3 text-right">12</td>
                    <td className="py-2 px-3 text-right">8</td>
                    <td className="py-2 px-3 text-right">20</td>
                    <td className="py-2 px-3 text-right font-black text-emerald-800">86</td>
                  </tr>
                  <tr className="hover:bg-slate-50 font-medium">
                    <td className="py-2 px-3 font-bold text-slate-900">MBOUDA</td>
                    <td className="py-2 px-3 text-right">24</td>
                    <td className="py-2 px-3 text-right">14</td>
                    <td className="py-2 px-3 text-right">10</td>
                    <td className="py-2 px-3 text-right">6</td>
                    <td className="py-2 px-3 text-right">15</td>
                    <td className="py-2 px-3 text-right font-black text-emerald-800">69</td>
                  </tr>
                  <tr className="hover:bg-slate-50 font-medium">
                    <td className="py-2 px-3 font-bold text-slate-900">DIBOMBARI</td>
                    <td className="py-2 px-3 text-right">20</td>
                    <td className="py-2 px-3 text-right">12</td>
                    <td className="py-2 px-3 text-right">8</td>
                    <td className="py-2 px-3 text-right">5</td>
                    <td className="py-2 px-3 text-right">12</td>
                    <td className="py-2 px-3 text-right font-black text-emerald-800">57</td>
                  </tr>
                  <tr className="hover:bg-slate-50 font-medium">
                    <td className="py-2 px-3 font-bold text-slate-900">BALI</td>
                    <td className="py-2 px-3 text-right">16</td>
                    <td className="py-2 px-3 text-right">10</td>
                    <td className="py-2 px-3 text-right">6</td>
                    <td className="py-2 px-3 text-right">4</td>
                    <td className="py-2 px-3 text-right">10</td>
                    <td className="py-2 px-3 text-right font-black text-emerald-800">46</td>
                  </tr>
                  <tr className="hover:bg-slate-50 font-medium">
                    <td className="py-2 px-3 font-bold text-slate-900">YABASSI</td>
                    <td className="py-2 px-3 text-right">12</td>
                    <td className="py-2 px-3 text-right">8</td>
                    <td className="py-2 px-3 text-right">4</td>
                    <td className="py-2 px-3 text-right">3</td>
                    <td className="py-2 px-3 text-right">8</td>
                    <td className="py-2 px-3 text-right font-black text-emerald-800">35</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-PAGE 3: ÉTAT SANITAIRE DES ANIMAUX (Screenshot 1 top-right) */}
      {subPage === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* État de santé global Donut */}
            <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1 self-start">
                État de santé global
              </h2>
              <div className="relative w-44 h-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Sains', value: 92, color: '#16a34a' },
                        { name: 'Malades', value: 5, color: '#dc2626' },
                        { name: 'Sous traitement', value: 3, color: '#f59e0b' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      dataKey="value"
                    >
                      <Cell fill="#16a34a" />
                      <Cell fill="#dc2626" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-emerald-700">92%</span>
                  <span className="text-[9px] text-slate-500 font-bold">En bonne santé</span>
                </div>
              </div>
              <div className="space-y-1 w-full text-xs pt-2 border-t border-slate-100">
                <div className="flex justify-between"><span className="text-emerald-700 font-bold">● Sains</span><span>92%</span></div>
                <div className="flex justify-between"><span className="text-rose-600 font-bold">● Malades</span><span>5%</span></div>
                <div className="flex justify-between"><span className="text-amber-600 font-bold">● Sous traitement</span><span>3%</span></div>
              </div>
            </div>

            {/* Répartition des pathologies */}
            <div className="lg:col-span-8 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
                Répartition des pathologies
              </h2>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pathologiesData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-PAGE 4: PROTOCOLES SANITAIRES (Screenshot 1 mid-left) */}
      {subPage === 4 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Protocoles les plus utilisés */}
            <div className="lg:col-span-6 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">
                Protocoles les plus utilisés
              </h2>
              <div className="space-y-2.5 text-xs">
                {topProtocols.map((p) => (
                  <div key={p.code}>
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-slate-800">{p.code}</span>
                      <span className="font-black text-slate-900">{p.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${p.count * 6}%`, backgroundColor: p.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Répartition par type de protocole (48 protocoles) */}
            <div className="lg:col-span-6 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Vaccination', value: 71, color: '#0ea5e9' },
                        { name: 'Traitement', value: 15, color: '#f97316' },
                        { name: 'Contrôle', value: 7, color: '#eab308' },
                        { name: 'Déparasitage', value: 7, color: '#10b981' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      dataKey="value"
                    >
                      <Cell fill="#0ea5e9" />
                      <Cell fill="#f97316" />
                      <Cell fill="#eab308" />
                      <Cell fill="#10b981" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-slate-900">48</span>
                  <span className="text-[10px] text-slate-500 font-bold">protocoles</span>
                </div>
              </div>

              <div className="space-y-2 text-xs flex-1 pl-4">
                <div className="flex justify-between font-medium"><span className="text-sky-600 font-bold">● Vaccination</span><span className="font-bold">71%</span></div>
                <div className="flex justify-between font-medium"><span className="text-orange-600 font-bold">● Traitement</span><span className="font-bold">15%</span></div>
                <div className="flex justify-between font-medium"><span className="text-amber-600 font-bold">● Contrôle</span><span className="font-bold">7%</span></div>
                <div className="flex justify-between font-medium"><span className="text-emerald-600 font-bold">● Déparasitage</span><span className="font-bold">7%</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-PAGES 5 to 10 fallback / dynamic view */}
      {subPage >= 5 && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                {subPageTitles[subPage]} - Synthèse Analytique & Données Terrain
              </h2>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                Certifié COOPS-CA NKUL
              </span>
            </div>

            {/* KPIs & Summary Points */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Taux de santé global</span>
                <span className="text-xl font-black text-emerald-700">92%</span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">↑ +2.4% vs N-1</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Couverture vaccinale</span>
                <span className="text-xl font-black text-sky-700">71%</span>
                <span className="text-[10px] text-sky-600 font-bold block mt-1">Objectif 75%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Taux de mortalité</span>
                <span className="text-xl font-black text-slate-800">2,1%</span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">↓ -0.6% baisse</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Temps moyen traitement</span>
                <span className="text-xl font-black text-amber-700">3,2 jours</span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">↓ -1.4 jours</span>
              </div>
            </div>

            {/* Recommendations & Action Plan from Screenshot 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <h3 className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Points Forts & Conquis
                </h3>
                <ul className="space-y-1.5 text-emerald-800">
                  <li>• Taux de santé global élevé à 92% sur les 286 animaux suivis.</li>
                  <li>• Bonne couverture vaccinale générale (71%).</li>
                  <li>• Baisse significative des cas respiratoires (-12%).</li>
                  <li>• Amélioration notable de la productivité et du GMQ (+8%).</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  Recommandations Stratégiques
                </h3>
                <ul className="space-y-1.5 text-amber-800">
                  <li>1. Renforcer la vaccination préventive en saison sèche.</li>
                  <li>2. Améliorer la ventilation et la biosécurité des bâtiments d'élevage.</li>
                  <li>3. Cibler en priorité les zones Sud et Est à couverture encore moyenne.</li>
                  <li>4. Poursuivre le monitoring digitalisé dans COOPS-FLOW.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

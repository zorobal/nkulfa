import React from 'react';
import {
  Sprout,
  Beef,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUp,
  AlertCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { APP_IMAGES } from '../../assets/images';

export const DirectionDashboard: React.FC = () => {
  // Monthly Evolution data matching Screenshot 2
  const monthlyProductionData = [
    { month: 'Jan', vegetale: 95, animale: 65, ca: 11.2 },
    { month: 'Fév', vegetale: 102, animale: 70, ca: 11.0 },
    { month: 'Mar', vegetale: 110, animale: 75, ca: 12.5 },
    { month: 'Avr', vegetale: 118, animale: 80, ca: 12.8 },
    { month: 'Mai', vegetale: 130, animale: 85, ca: 14.5 },
    { month: 'Juin', vegetale: 142, animale: 90, ca: 14.2 },
    { month: 'Juil', vegetale: 155, animale: 95, ca: 16.0 },
    { month: 'Août', vegetale: 150, animale: 92, ca: 16.2 },
    { month: 'Sep', vegetale: 165, animale: 100, ca: 17.5 },
    { month: 'Oct', vegetale: 172, animale: 105, ca: 17.0 },
    { month: 'Nov', vegetale: 180, animale: 110, ca: 18.2 },
    { month: 'Déc', vegetale: 195, animale: 120, ca: 19.8 },
  ];

  // Activities distribution
  const activitesData = [
    { name: 'Agriculture', value: 42, color: '#16a34a' },
    { name: 'Élevage', value: 28, color: '#2563eb' },
    { name: 'Produits animaux', value: 12, color: '#0d9488' },
    { name: 'Ventes & Services', value: 10, color: '#9333ea' },
    { name: 'Autres', value: 8, color: '#94a3b8' },
  ];

  // Cheptel distribution
  const cheptelData = [
    { name: 'Bovins', value: 36, count: 103, color: '#16a34a' },
    { name: 'Ovins', value: 21, count: 60, color: '#2563eb' },
    { name: 'Caprins', value: 16, count: 46, color: '#eab308' },
    { name: 'Porcins', value: 13, count: 37, color: '#9333ea' },
    { name: 'Volailles', value: 14, count: 40, color: '#94a3b8' },
  ];

  // Top 5 crops
  const topCrops = [
    { name: 'Maïs', ha: 72, pct: 28, icon: '🌽' },
    { name: 'Manioc', ha: 54, pct: 22, icon: '🥔' },
    { name: 'Igname', ha: 38, pct: 15, icon: '🍠' },
    { name: 'Arachide', ha: 32, pct: 13, icon: '🥜' },
    { name: 'Haricot', ha: 28, pct: 11, icon: '🫘' },
  ];

  return (
    <div className="space-y-4 p-3 lg:p-4 bg-slate-50 min-h-screen">
      {/* 4 TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Superficie */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-13 h-13 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sprout className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block truncate">
              Superficie totale cultivée
            </span>
            <span className="text-2xl font-black text-slate-900 leading-tight">248 ha</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-0.5">
              <ArrowUp className="w-3 h-3" />
              <span>+12% vs. année précédente</span>
            </div>
          </div>
        </div>

        {/* Card 2: Bétail */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-13 h-13 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Beef className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block truncate">
              Têtes de bétail
            </span>
            <span className="text-2xl font-black text-slate-900 leading-tight">286</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-0.5">
              <ArrowUp className="w-3 h-3" />
              <span>+8% vs. année précédente</span>
            </div>
          </div>
        </div>

        {/* Card 3: Membres */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-13 h-13 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block truncate">
              Membres actifs
            </span>
            <span className="text-2xl font-black text-slate-900 leading-tight">132</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-0.5">
              <ArrowUp className="w-3 h-3" />
              <span>+5% vs. année précédente</span>
            </div>
          </div>
        </div>

        {/* Card 4: CA */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-13 h-13 rounded-full bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-sm">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block truncate">
              Chiffre d'affaires (CA)
            </span>
            <span className="text-xl font-black text-slate-900 leading-tight">48 750 000 FCFA</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-0.5">
              <ArrowUp className="w-3 h-3" />
              <span>+18% vs. année précédente</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 1: Production Chart, Activités Donut, Hero Image Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Évolution globale de la production (6 cols) */}
        <div className="lg:col-span-6 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Évolution globale de la production
              </h2>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>Végétale (t)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>Animale (t)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                <span>CA (FCFA)</span>
              </div>
            </div>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyProductionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} stroke="#94a3b8" domain={[0, 250]} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10 }}
                  stroke="#94a3b8"
                  domain={[0, 20]}
                  tickFormatter={(v) => `${v}M`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(val: any, name: any) => {
                    if (name === 'ca') return [`${val}M FCFA`, "Chiffre d'affaires"];
                    if (name === 'vegetale') return [`${val} tonnes`, 'Production Végétale'];
                    return [`${val} tonnes`, 'Production Animale'];
                  }}
                />
                <Bar yAxisId="left" dataKey="vegetale" fill="#16a34a" radius={[2, 2, 0, 0]} barSize={8} />
                <Bar yAxisId="left" dataKey="animale" fill="#2563eb" radius={[2, 2, 0, 0]} barSize={8} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ca"
                  stroke="#ea580c"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#ea580c' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition des activités (3 cols) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
            Répartition des activités
          </h2>

          <div className="relative h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activitesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {activitesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(v: any) => [`${v}%`, 'Part du CA']}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] font-bold text-slate-800 leading-tight">48 750 000</span>
              <span className="text-[8px] text-slate-500 font-semibold uppercase">FCFA CA total</span>
            </div>
          </div>

          <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-100 pt-2">
            {activitesData.map((act) => (
              <div key={act.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: act.color }}></span>
                  <span className="truncate">{act.name}</span>
                </div>
                <span className="font-bold text-slate-900 shrink-0">{act.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Card with photo (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-2xs relative border border-slate-200 flex flex-col justify-end min-h-[220px]">
          <img
            src={APP_IMAGES.cropsCard}
            alt="Agriculture durable"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-transparent"></div>
          <div className="relative p-4 text-white space-y-2 z-10">
            <span className="w-8 h-8 rounded-lg bg-emerald-600/80 backdrop-blur-xs flex items-center justify-center text-amber-300">
              <Sprout className="w-5 h-5" />
            </span>
            <p className="font-serif text-sm italic font-bold leading-snug text-emerald-100">
              « Une coopérative forte, une agriculture durable, un avenir meilleur. »
            </p>
          </div>
        </div>
      </div>

      {/* ROW 2: Top 5 Cultures, Cheptel Donut, Situation Exploitations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Top 5 des cultures (4 cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              Top 5 des cultures
            </h2>
            <button className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5">
              Voir tout <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {topCrops.map((crop) => (
              <div key={crop.name} className="flex items-center gap-2.5 text-xs">
                <span className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-base shrink-0">
                  {crop.icon}
                </span>
                <span className="w-16 font-bold text-slate-800 truncate">{crop.name}</span>
                <span className="w-12 text-slate-500 text-[11px] font-medium text-right">{crop.ha} ha</span>
                <span className="w-10 text-slate-900 font-bold text-[11px] text-right">{crop.pct}%</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${crop.pct * 3}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition du cheptel (4 cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Beef className="w-3.5 h-3.5 text-blue-700" />
              Répartition du cheptel
            </h2>
            <button className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-0.5">
              Voir tout <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="relative h-40 w-44 shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cheptelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {cheptelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(v: any) => [`${v}%`, 'Proportion']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-sm font-black text-slate-900">286</span>
                <span className="text-[9px] text-slate-500 font-semibold">têtes</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-600 flex-1">
              {cheptelData.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }}></span>
                    <span className="truncate">{c.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Situation des exploitations (4 cols - Cameroon Map) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              Situation des exploitations
            </h2>
            <button className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5">
              Voir la carte <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* SVG outline of Cameroon with the regional points */}
            <div className="w-36 h-36 relative shrink-0">
              <svg viewBox="0 0 160 200" className="w-full h-full drop-shadow-xs">
                {/* Simplified Cameroon contour polygon */}
                <path
                  d="M 90,10 L 110,40 L 95,70 L 125,90 L 140,120 L 110,170 L 60,185 L 35,160 L 50,130 L 30,110 L 55,90 L 70,60 Z"
                  fill="#86efac"
                  stroke="#15803d"
                  strokeWidth="1.5"
                />
                {/* Nord Region Marker */}
                <circle cx="95" cy="50" r="7" fill="#f97316" stroke="#fff" strokeWidth="1.5" />
                {/* Centre Region Marker */}
                <circle cx="85" cy="120" r="8" fill="#2563eb" stroke="#fff" strokeWidth="1.5" />
                {/* Ouest Region Marker */}
                <circle cx="50" cy="115" r="7" fill="#16a34a" stroke="#fff" strokeWidth="1.5" />
                {/* Sud Region Marker */}
                <circle cx="75" cy="160" r="6" fill="#a855f7" stroke="#fff" strokeWidth="1.5" />
                {/* Est Region Marker */}
                <circle cx="115" cy="140" r="6" fill="#eab308" stroke="#fff" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="space-y-1.5 text-[11px] flex-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span> Nord
                </span>
                <span className="font-bold text-slate-900">22%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span> Centre
                </span>
                <span className="font-bold text-slate-900">28%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Ouest
                </span>
                <span className="font-bold text-slate-900">22%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span> Sud
                </span>
                <span className="font-bold text-slate-900">16%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Est
                </span>
                <span className="font-bold text-slate-900">12%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-700"></span> Très dynamique</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Dynamique</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Moyenne</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-600"></span> Faible</span>
          </div>
        </div>
      </div>

      {/* ROW 3: Alertes, KPIs, Mission Quote */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Alertes & Notifications (4 cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              Alertes & Notifications
            </h2>
            <button className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5">
              Voir tout <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                !
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 leading-tight">3 parcelles en retard de désherbage</p>
                <span className="text-[10px] text-slate-400">Il y a 2 jours</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                !
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 leading-tight">Vaccination à planifier (Bovins)</p>
                <span className="text-[10px] text-slate-400">Il y a 3 jours</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
              <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                i
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 leading-tight">Stock d'aliments inférieur au seuil</p>
                <span className="text-[10px] text-slate-400">Il y a 4 jours</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                ✓
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 leading-tight">Objectif de production atteint (Manioc)</p>
                <span className="text-[10px] text-slate-400">Il y a 5 jours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Indicateurs clés de performance (5 cols) */}
        <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Indicateurs clés de performance (KPI)
            </h2>
            <button className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5">
              Voir détails <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* KPI 1: Rendement */}
            <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[10px] font-semibold">Rendement moyen (cultures)</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black text-slate-900">2,8 t/ha</span>
                <span className="text-[10px] font-bold text-emerald-700 flex items-center">↑ +14%</span>
              </div>
              <div className="mt-1.5 flex gap-1 h-3 items-end">
                <div className="w-1/4 h-2 bg-emerald-300 rounded-xs"></div>
                <div className="w-1/4 h-2.5 bg-emerald-400 rounded-xs"></div>
                <div className="w-1/4 h-2 bg-emerald-500 rounded-xs"></div>
                <div className="w-1/4 h-3 bg-emerald-600 rounded-xs"></div>
              </div>
            </div>

            {/* KPI 2: Productivité animale */}
            <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Beef className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[10px] font-semibold">Productivité animale</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black text-slate-900">1 250 L/an</span>
                <span className="text-[10px] font-bold text-emerald-700 flex items-center">↑ +9%</span>
              </div>
              <div className="mt-1.5 flex gap-1 h-3 items-end">
                <div className="w-1/4 h-1.5 bg-blue-300 rounded-xs"></div>
                <div className="w-1/4 h-2 bg-blue-400 rounded-xs"></div>
                <div className="w-1/4 h-2.5 bg-blue-500 rounded-xs"></div>
                <div className="w-1/4 h-3 bg-blue-600 rounded-xs"></div>
              </div>
            </div>

            {/* KPI 3: Taux d'adhésion */}
            <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[10px] font-semibold">Taux d'adhésion</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black text-slate-900">92%</span>
                <span className="text-[10px] font-bold text-emerald-700 flex items-center">↑ +3%</span>
              </div>
              <div className="mt-1.5 flex gap-1 h-3 items-end">
                <div className="w-1/4 h-2 bg-amber-300 rounded-xs"></div>
                <div className="w-1/4 h-2 bg-amber-400 rounded-xs"></div>
                <div className="w-1/4 h-2.5 bg-amber-500 rounded-xs"></div>
                <div className="w-1/4 h-3 bg-amber-600 rounded-xs"></div>
              </div>
            </div>

            {/* KPI 4: Marge nette */}
            <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-[10px] font-semibold">Marge nette</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black text-slate-900">18%</span>
                <span className="text-[10px] font-bold text-emerald-700 flex items-center">↑ +6%</span>
              </div>
              <div className="mt-1.5 flex gap-1 h-3 items-end">
                <div className="w-1/4 h-1.5 bg-purple-300 rounded-xs"></div>
                <div className="w-1/4 h-2 bg-purple-400 rounded-xs"></div>
                <div className="w-1/4 h-2.5 bg-purple-500 rounded-xs"></div>
                <div className="w-1/4 h-3 bg-purple-600 rounded-xs"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Card (3 cols) */}
        <div className="lg:col-span-3 bg-[#053d2c] p-4 rounded-2xl border border-emerald-800 text-white shadow-2xs flex flex-col justify-between">
          <div className="w-8 h-8 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-200 mb-2">
            <Sprout className="w-5 h-5" />
          </div>
          <p className="text-xs font-serif italic leading-relaxed text-emerald-100">
            « La réussite de notre coopérative repose sur la synergie entre nos agriculteurs, nos éleveurs et nos membres. »
          </p>
          <div className="pt-3 border-t border-emerald-800/80 mt-2 text-[10px] font-bold tracking-wider text-emerald-300 uppercase">
            COOPS-CA NKUL
          </div>
        </div>
      </div>
    </div>
  );
};

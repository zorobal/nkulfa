import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Home,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Sprout,
  Compass,
  AlertTriangle,
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

export const TerrainsParcellesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Surface evolution data
  const surfaceEvolutionData = [
    { month: 'Jan', superficie: 98, parcelles: 25 },
    { month: 'Fév', superficie: 105, parcelles: 26 },
    { month: 'Mar', superficie: 112, parcelles: 28 },
    { month: 'Avr', superficie: 124, parcelles: 30 },
    { month: 'Mai', superficie: 130, parcelles: 32 },
    { month: 'Juin', superficie: 138, parcelles: 34 },
    { month: 'Juil', superficie: 145, parcelles: 36 },
    { month: 'Août', superficie: 152, parcelles: 38 },
    { month: 'Sept', superficie: 168, parcelles: 40 },
    { month: 'Oct', superficie: 175, parcelles: 42 },
    { month: 'Nov', superficie: 188, parcelles: 45 },
    { month: 'Déc', superficie: 202, parcelles: 48 },
  ];

  // Cultures distribution
  const culturesData = [
    { name: 'Maïs', value: 28, color: '#16a34a' },
    { name: 'Manioc', value: 22, color: '#0ea5e9' },
    { name: 'Igname', value: 18, color: '#eab308' },
    { name: 'Arachide', value: 12, color: '#f97316' },
    { name: 'Haricot', value: 10, color: '#a855f7' },
    { name: 'Autres', value: 10, color: '#94a3b8' },
  ];

  // Parcels Table
  const allParcelles = [
    { id: 'P-001', expl: 'Expl. Mvogo', zone: 'Centre', culture: 'Maïs', sup: 12.5, etat: 'En production' },
    { id: 'P-002', expl: 'Expl. Nsang', zone: 'Ouest', culture: 'Manioc', sup: 8.7, etat: 'En production' },
    { id: 'P-003', expl: 'Expl. Tchoua', zone: 'Nord', culture: 'Ignames', sup: 15.2, etat: 'En production' },
    { id: 'P-004', expl: 'Expl. Bikok', zone: 'Est', culture: 'Arachide', sup: 6.3, etat: 'En préparation' },
    { id: 'P-005', expl: 'Expl. Koung', zone: 'Sud', culture: 'Haricot', sup: 10.8, etat: 'En production' },
    { id: 'P-006', expl: 'Expl. Nguimatsia', zone: 'Centre', culture: 'Maïs', sup: 7.4, etat: 'En production' },
    { id: 'P-007', expl: 'Expl. Mbarga', zone: 'Ouest', culture: 'Manioc', sup: 9.1, etat: 'En production' },
    { id: 'P-008', expl: 'Expl. Fokam', zone: 'Est', culture: 'Igname', sup: 14.7, etat: 'En production' },
  ];

  const filteredParcelles = allParcelles.filter((p) => {
    const matchSearch =
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.expl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.culture.toLowerCase().includes(searchTerm.toLowerCase());
    const matchZone = selectedZone ? p.zone.toLowerCase() === selectedZone.toLowerCase() : true;
    return matchSearch && matchZone;
  });

  return (
    <div className="space-y-4 p-3 lg:p-4 bg-slate-50 min-h-screen">
      {/* 4 TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Superficie totale des terrains */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-13 h-13 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sprout className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block truncate">
              Superficie totale des terrains
            </span>
            <span className="text-2xl font-black text-slate-900 leading-tight">1 248 ha</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-0.5">
              <ArrowUp className="w-3 h-3" />
              <span>+5% vs. année précédente</span>
            </div>
          </div>
        </div>

        {/* Card 2: Nombre de parcelles */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-13 h-13 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Layers className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block truncate">
              Nombre de parcelles
            </span>
            <span className="text-2xl font-black text-slate-900 leading-tight">186</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-0.5">
              <ArrowUp className="w-3 h-3" />
              <span>+8% vs. année précédente</span>
            </div>
          </div>
        </div>

        {/* Card 3: Exploitations concernées */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-13 h-13 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Home className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block truncate">
              Exploitations concernées
            </span>
            <span className="text-2xl font-black text-slate-900 leading-tight">42</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-0.5">
              <ArrowUp className="w-3 h-3" />
              <span>+6% vs. année précédente</span>
            </div>
          </div>
        </div>

        {/* Card 4: Parcelles en production */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-13 h-13 rounded-full bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-sm">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block truncate">
              Parcelles en production
            </span>
            <span className="text-2xl font-black text-slate-900 leading-tight">158</span>
            <div className="text-[11px] font-bold text-slate-600 mt-0.5">
              <span>85% du total</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 1: Map Zone Left, Charts Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Map / Satellite Zone Card (5 cols) */}
        <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              Répartition des parcelles par zone
            </h2>
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <span className="font-bold text-slate-700">N</span>
              <span>↑</span>
            </div>
          </div>

          {/* Interactive Territorial Map representation */}
          <div className="relative w-full h-56 bg-stone-900 rounded-xl overflow-hidden border border-stone-800 flex items-center justify-center">
            {/* Background aerial image / texture */}
            <img
              src={APP_IMAGES.heroBanner}
              alt="Vue satellite"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-40 filter saturate-150"
            />
            <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-2xs"></div>

            {/* SVG overlay polygons representing the 5 zones */}
            <svg viewBox="0 0 300 220" className="w-full h-full relative z-10">
              {/* Zone Nord */}
              <polygon
                points="120,20 180,25 210,75 140,80 110,50"
                fill={selectedZone === 'Nord' ? '#22c55e' : '#15803d'}
                fillOpacity="0.75"
                stroke="#fff"
                strokeWidth="1.5"
                className="cursor-pointer hover:fill-emerald-400 transition-all"
                onClick={() => setSelectedZone(selectedZone === 'Nord' ? null : 'Nord')}
              />
              <text x="145" y="45" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">
                Zone Nord
              </text>
              <text x="145" y="55" fill="#dcfce7" fontSize="7" textAnchor="middle">
                32 parcelles (17%)
              </text>

              {/* Zone Ouest */}
              <polygon
                points="40,80 105,75 110,140 30,135"
                fill={selectedZone === 'Ouest' ? '#38bdf8' : '#0284c7'}
                fillOpacity="0.75"
                stroke="#fff"
                strokeWidth="1.5"
                className="cursor-pointer hover:fill-sky-400 transition-all"
                onClick={() => setSelectedZone(selectedZone === 'Ouest' ? null : 'Ouest')}
              />
              <text x="70" y="105" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">
                Zone Ouest
              </text>
              <text x="70" y="115" fill="#e0f2fe" fontSize="7" textAnchor="middle">
                38 parcelles (20%)
              </text>

              {/* Zone Centre */}
              <polygon
                points="115,85 185,82 175,150 110,145"
                fill={selectedZone === 'Centre' ? '#fb923c' : '#ea580c'}
                fillOpacity="0.8"
                stroke="#fff"
                strokeWidth="2"
                className="cursor-pointer hover:fill-orange-400 transition-all"
                onClick={() => setSelectedZone(selectedZone === 'Centre' ? null : 'Centre')}
              />
              <text x="145" y="110" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">
                Zone Centre
              </text>
              <text x="145" y="122" fill="#ffedd5" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                54 parcelles (29%)
              </text>

              {/* Zone Est */}
              <polygon
                points="190,85 270,95 255,160 180,150"
                fill={selectedZone === 'Est' ? '#c084fc' : '#9333ea'}
                fillOpacity="0.75"
                stroke="#fff"
                strokeWidth="1.5"
                className="cursor-pointer hover:fill-purple-400 transition-all"
                onClick={() => setSelectedZone(selectedZone === 'Est' ? null : 'Est')}
              />
              <text x="225" y="115" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">
                Zone Est
              </text>
              <text x="225" y="125" fill="#f3e8ff" fontSize="7" textAnchor="middle">
                36 parcelles (19%)
              </text>

              {/* Zone Sud */}
              <polygon
                points="95,155 190,155 170,210 90,205"
                fill={selectedZone === 'Sud' ? '#fde047' : '#ca8a04'}
                fillOpacity="0.8"
                stroke="#fff"
                strokeWidth="1.5"
                className="cursor-pointer hover:fill-yellow-300 transition-all"
                onClick={() => setSelectedZone(selectedZone === 'Sud' ? null : 'Sud')}
              />
              <text x="140" y="180" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">
                Zone Sud
              </text>
              <text x="140" y="190" fill="#fef9c3" fontSize="7" textAnchor="middle">
                26 parcelles (14%)
              </text>
            </svg>
          </div>

          {/* Zones Summary & Stats */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 my-2 text-center text-xs">
            <div className="p-1 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-500 block">Superficie moyenne</span>
              <span className="font-black text-slate-900">6,7 ha</span>
            </div>
            <div className="p-1 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-500 block">Plus grande parcelle</span>
              <span className="font-black text-emerald-700">48,2 ha</span>
            </div>
            <div className="p-1 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-500 block">Plus petite parcelle</span>
              <span className="font-black text-slate-700">0,8 ha</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="text-emerald-700 font-bold flex items-center gap-1 cursor-pointer hover:underline">
              <MapPin className="w-3.5 h-3.5" /> Carte interactive
            </span>
            <span>Cliquez sur une zone pour voir le détail</span>
          </div>
        </div>

        {/* Surface Evolution (4 cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              Évolution de la superficie cultivée
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-emerald-600"></span> Superficie (ha)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Nb parcelles</span>
            </div>
          </div>

          <div className="h-52 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={surfaceEvolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <YAxis yAxisId="left" tick={{ fontSize: 9 }} stroke="#94a3b8" domain={[0, 250]} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9 }} stroke="#94a3b8" domain={[0, 50]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar yAxisId="left" dataKey="superficie" fill="#16a34a" radius={[2, 2, 0, 0]} barSize={9} />
                <Line yAxisId="right" type="monotone" dataKey="parcelles" stroke="#2563eb" strokeWidth={2} dot={{ r: 2.5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Photo banner in the card matching Screenshot 3 */}
          <div className="rounded-xl overflow-hidden relative border border-slate-200 h-20 mt-2">
            <img
              src={APP_IMAGES.cropsCard}
              alt="Des parcelles bien suivies"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-950/50 to-transparent flex items-center p-3">
              <p className="text-[11px] font-serif italic text-white font-bold leading-tight max-w-[200px]">
                « Des parcelles bien suivies pour une meilleure productivité. »
              </p>
            </div>
          </div>
        </div>

        {/* Répartition des cultures par parcelle (3 cols) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            Répartition des cultures par parcelle
          </h2>

          <div className="relative h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={culturesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {culturesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-sm font-black text-slate-900">158</span>
              <span className="text-[9px] text-slate-500 font-semibold">parcelles</span>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100 pt-2">
            {culturesData.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }}></span>
                  <span className="truncate">{c.name}</span>
                </div>
                <span className="font-bold text-slate-900 shrink-0">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 2: Parcelles Table Left, Types d'occupation & KPIs Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Détail des principales parcelles Table (8 cols) */}
        <div className="lg:col-span-8 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              Détail des principales parcelles
            </h2>

            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une parcelle..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold text-[11px] bg-slate-50/70">
                  <th className="py-2 px-3">N° Parcelle</th>
                  <th className="py-2 px-3">Exploitation</th>
                  <th className="py-2 px-3">Zone</th>
                  <th className="py-2 px-3">Culture</th>
                  <th className="py-2 px-3 text-right">Superficie (ha)</th>
                  <th className="py-2 px-3 text-center">État</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredParcelles.map((p) => (
                  <tr key={p.id} className="hover:bg-emerald-50/40 transition-colors font-medium">
                    <td className="py-2 px-3 font-mono font-bold text-emerald-800">{p.id}</td>
                    <td className="py-2 px-3 text-slate-900">{p.expl}</td>
                    <td className="py-2 px-3 text-slate-600">{p.zone}</td>
                    <td className="py-2 px-3 text-slate-900 font-semibold">{p.culture}</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">{p.sup}</td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.etat === 'En production'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.etat}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer & Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-500 mt-2">
            <span>Affichage : 1 - 8 sur 186 parcelles</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-slate-100 text-slate-600">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 h-6 rounded bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                1
              </span>
              <span className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center cursor-pointer">
                2
              </span>
              <span className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center cursor-pointer">
                3
              </span>
              <span className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center cursor-pointer">
                4
              </span>
              <span className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center cursor-pointer">
                5
              </span>
              <span className="px-1 text-slate-400">...</span>
              <span className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center cursor-pointer">
                24
              </span>
              <button className="p-1 rounded hover:bg-slate-100 text-slate-600">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Types d'occupation des sols & Indicateurs clés (4 cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Types d'occupation des sols */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              Types d'occupation des sols
            </h2>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 font-medium">Culture vivrière</span>
                  <span className="font-bold text-slate-900">42%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-700 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 font-medium">Culture de rente</span>
                  <span className="font-bold text-slate-900">24%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 font-medium">Pâturage</span>
                  <span className="font-bold text-slate-900">14%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full" style={{ width: '14%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 font-medium">Forêt / jachère</span>
                  <span className="font-bold text-slate-900">10%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 font-medium">Infrastructure</span>
                  <span className="font-bold text-slate-900">6%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full" style={{ width: '6%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 font-medium">Autres</span>
                  <span className="font-bold text-slate-900">4%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: '4%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Indicateurs clés */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              Indicateurs clés
            </h2>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Taux d'utilisation</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-base font-black text-slate-900">78%</span>
                  <span className="text-[10px] font-bold text-emerald-700 flex items-center">
                    <ArrowUp className="w-2.5 h-2.5" /> +6%
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Rendement moyen</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-base font-black text-slate-900">3,2 t/ha</span>
                  <span className="text-[10px] font-bold text-emerald-700 flex items-center">
                    <ArrowUp className="w-2.5 h-2.5" /> +12%
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Parcelles en jachère</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-base font-black text-slate-900">12%</span>
                  <span className="text-[10px] font-bold text-emerald-700 flex items-center">
                    <ArrowDown className="w-2.5 h-2.5" /> -4%
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Parcelles à risque</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-base font-black text-slate-900">8%</span>
                  <span className="text-[10px] font-bold text-rose-600 flex items-center">
                    <ArrowUp className="w-2.5 h-2.5" /> +2%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

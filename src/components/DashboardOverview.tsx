import React from 'react';
import {
  Users,
  Beef,
  Wheat,
  Truck,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  MEMBRES_DATA,
  ELEVAGE_PARCELLES_DATA,
  SUIVI_PARCELLES_CULTURES,
  COLLECTES_DATA,
  MAGASINS_STOCKS_DATA,
  VENTES_DATA,
  RISQUES_DATA,
} from '../data/coopData';

export const DashboardOverview: React.FC = () => {
  // Aggregate KPIs
  const totalMembres = 486; // 352 actifs, 87 nouveaux, 47 inactifs
  const membresActifs = 352;
  const superficieTotale = 222.0; // ha exploitées
  const totalCheptel = ELEVAGE_PARCELLES_DATA.reduce((acc, curr) => acc + curr.effectifActuel, 0);
  const valeurCheptel = ELEVAGE_PARCELLES_DATA.reduce((acc, curr) => acc + curr.valeurEstimeeFCFA, 0);
  const totalCollecteKg = COLLECTES_DATA.reduce((acc, curr) => acc + curr.quantiteKg, 0);
  const totalVentesFCFA = VENTES_DATA.reduce((acc, curr) => acc + curr.montantTotalFCFA, 0);
  const totalStockTonnes = MAGASINS_STOCKS_DATA.reduce((acc, curr) => acc + curr.stockActuelTonnes, 0);
  const valeurStocksFCFA = MAGASINS_STOCKS_DATA.reduce((acc, curr) => acc + curr.valeurStockFCFA, 0);

  // Production vs Objectives chart data
  const productionData = [
    { name: 'Maïs Grain', realise: 220.7, objectif: 250, unite: 't' },
    { name: 'Manioc', realise: 330.0, objectif: 300, unite: 't' },
    { name: 'Plantain', realise: 392.0, objectif: 420, unite: 't' },
    { name: 'Soja', realise: 21.0, objectif: 22, unite: 't' },
    { name: 'Aviculture', realise: 18.5, objectif: 20, unite: 't' },
    { name: 'Pisciculture', realise: 12.0, objectif: 15, unite: 't' },
  ];

  // Cheptel distribution
  const cheptelDistribution = [
    { name: 'Pisciculture (Alevins)', value: 5000, color: '#0284c7' },
    { name: 'Volailles (Poulets)', value: 850, color: '#f59e0b' },
    { name: 'Porcins', value: 48, color: '#ec4899' },
    { name: 'Caprins', value: 72, color: '#10b981' },
    { name: 'Ovins', value: 56, color: '#8b5cf6' },
    { name: 'Bovins (Goudali)', value: 35, color: '#b45309' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-sm border border-emerald-700/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-700/60 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-2">
              <Building className="w-3.5 h-3.5" />
              <span>COOPS-CA NKUL-FA • Siège Yaoundé, Cameroun</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
              Cockpit Stratégique Agro-Pastoral
            </h1>
            <p className="text-emerald-100/90 text-sm mt-1 max-w-2xl leading-relaxed">
              Pilotage unifié : <strong>486 Coopérateurs</strong>, <strong>5 Terrains majeurs</strong>,{' '}
              <strong>12 Parcelles</strong>, Cheptel multi-espèces et chaîne logistique de valorisation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-emerald-950/70 border border-emerald-700/80 rounded-xl px-4 py-3 text-center sm:text-left">
              <span className="text-[11px] font-medium text-emerald-300 block uppercase tracking-wider">
                Chiffre d’Affaires Réalisé
              </span>
              <span className="text-xl font-black text-amber-300">
                {(totalVentesFCFA / 1000000).toFixed(1)} M FCFA
              </span>
            </div>
            <div className="bg-emerald-950/70 border border-emerald-700/80 rounded-xl px-4 py-3 text-center sm:text-left">
              <span className="text-[11px] font-medium text-emerald-300 block uppercase tracking-wider">
                Valeur Stocks Magasins
              </span>
              <span className="text-xl font-black text-emerald-200">
                {(valeurStocksFCFA / 1000000).toFixed(1)} M FCFA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Membres */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Membres & Coopérateurs
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-stone-900">{totalMembres}</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +87 nouveaux
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span>Actifs : <strong>{membresActifs}</strong></span>
            <span>Inactifs : <strong>47</strong></span>
          </div>
        </div>

        {/* Card 2: Cheptel & Élevage */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Cheptel Actif
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Beef className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-stone-900">{totalCheptel.toLocaleString()}</span>
            <span className="text-xs text-stone-500 font-medium">animaux & alevins</span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span>Valeur estimée :</span>
            <span className="font-bold text-emerald-700">{(valeurCheptel / 1000000).toFixed(2)} M FCFA</span>
          </div>
        </div>

        {/* Card 3: Superficie & Végétal */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Superficies Agricoles
            </span>
            <div className="w-9 h-9 rounded-xl bg-lime-50 text-lime-800 flex items-center justify-center">
              <Wheat className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-stone-900">{superficieTotale} ha</span>
            <span className="text-xs text-emerald-700 font-semibold">12 parcelles suivies</span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span>Rendement moyen maïs :</span>
            <span className="font-bold text-stone-900">3,7 t/ha</span>
          </div>
        </div>

        {/* Card 4: Collecte & Magasins */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Collecte & Magasins
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-stone-900">{(totalCollecteKg / 1000).toFixed(1)} t</span>
            <span className="text-xs text-blue-600 font-semibold">Campagne active</span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span>Stocks magasins :</span>
            <span className="font-bold text-stone-900">{totalStockTonnes} t (3 silos)</span>
          </div>
        </div>
      </div>

      {/* Analytics & Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production vs Target Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Production Réalisée vs Objectif de Campagne (Tonnes)
              </h2>
              <p className="text-xs text-stone-500">
                Campagne 2026-A • Suivi des filières maïs, manioc, plantain, soja, aviculture & poisson
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full">
              Taux d'atteinte global : 94.3%
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#78716c" />
                <YAxis tick={{ fontSize: 12 }} stroke="#78716c" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1c1917', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value: any, name: any) => [`${value} t`, name === 'realise' ? 'Réalisé' : 'Objectif']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="realise" name="Production Réalisée (t)" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="objectif" name="Objectif Campagne (t)" fill="#d1d5db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cheptel Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">Répartition du Cheptel</h2>
            <p className="text-xs text-stone-500 mb-4">Par espèce animale et aquacole active</p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cheptelDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {cheptelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1c1917', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: any, name: any) => [`${val} unités`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-100">
            {cheptelDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="truncate text-stone-600 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Watch & Alert Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Registry Snapshot */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-stone-900">
                Cartographie des Risques & Vigilances Agro-Pastorales
              </h2>
            </div>
            <span className="text-xs text-stone-500 font-medium">Actualisé quotidiennement</span>
          </div>
          <div className="space-y-3">
            {RISQUES_DATA.slice(0, 3).map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        r.statut === 'Alerte active'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.statut}
                    </span>
                    <span className="text-xs font-semibold text-stone-500 uppercase">{r.categorie}</span>
                  </div>
                  <span className="text-xs text-stone-600 font-medium">{r.zone}</span>
                </div>
                <p className="text-sm font-bold text-stone-900 mt-1">{r.intitule}</p>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  <strong>Mesure corrective :</strong> {r.planAction}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Cooperative Activity Feed */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-stone-900">Dernières Opérations</h2>
            <Clock className="w-4 h-4 text-stone-400" />
          </div>
          <div className="space-y-3.5 text-xs">
            <div className="flex items-start gap-2.5 pb-3 border-b border-stone-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-stone-900">Collecte Maïs Grain • 45 t</p>
                <p className="text-stone-500">El Hadj Ousmanou • Centre Obala</p>
                <span className="text-[10px] text-emerald-700 font-bold">Payé : 10 350 000 FCFA</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pb-3 border-b border-stone-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-stone-900">Naissance Chevreaux • Lot Sa'a</p>
                <p className="text-stone-500">2 petits nés viables (Femelle CAP-F042)</p>
                <span className="text-[10px] text-stone-400">Ranch Sa'a • P011</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pb-3 border-b border-stone-100">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-stone-900">Expédition Farine Maïs • 25 t</p>
                <p className="text-stone-500">Minoteries et supermarchés Yaoundé</p>
                <span className="text-[10px] text-blue-700 font-bold">16 500 000 FCFA réglé</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-stone-900">Rappel Vaccinal Porcins</p>
                <p className="text-stone-500">Lot PARC-T001-P02 (48 porcs Large White)</p>
                <span className="text-[10px] text-amber-700 font-bold">Échéance dépassée</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

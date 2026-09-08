import React, { useState } from 'react';
import {
  BarChart3,
  HelpCircle,
  Database,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  PieChart as PieChartIcon,
  Code2,
  Sparkles,
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
} from 'recharts';
import {
  ELEVAGE_PARCELLES_DATA,
  TERRAINS_DATA,
  ALIMENTATION_DATA,
  REPRODUCTION_DATA,
} from '../data/coopData';

export const BiAnalyticsModule: React.FC = () => {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  // The 8 key decision questions identified in the strategic discussions
  const strategicQuestions = [
    {
      id: 'Q1',
      title: 'Quels animaux sont élevés sur chaque terrain et chaque parcelle ?',
      description: 'Cartographie relationnelle Terrain → Parcelle → Élevage → Lot',
      daxFormula: 'Cheptel_Par_Parcelle = SUM(F_Elevage_Parcelles[Effectif_Actuel])',
      insight: '5 terrains actifs hébergent 6 filières majeures sans promiscuité sanitaire.',
      chartType: 'breakdown',
    },
    {
      id: 'Q2',
      title: 'Combien de bovins avons-nous actuellement sur chaque terrain ?',
      description: 'Inventaire zootechnique des bovins (Goudali & métis)',
      daxFormula: 'Nb_Bovins = CALCULATE(SUM(F_Elevage_Parcelles[Effectif_Actuel]), D_Especes[Nom_Espece] = "Bovins")',
      insight: '35 bovins Goudali concentrés sur T001 (Obala Nord), engraissement stabilisé.',
      chartType: 'bovins',
    },
    {
      id: 'Q3',
      title: 'Quelle parcelle présente le plus fort taux de mortalité ?',
      description: 'Taux de mortalité = Mortalités / Effectif Initial',
      daxFormula: 'Taux_Mortalite = DIVIDE(SUM(F_Elevage_Parcelles[Mortalites]), SUM(F_Elevage_Parcelles[Effectif_Initial]), 0)',
      insight: 'La parcelle T001-P02 (Porcins) a connu 3 pertes (5.9%), sous contrôle.',
      chartType: 'mortalite',
    },
    {
      id: 'Q4',
      title: 'Quelle espèce coûte le plus cher en alimentation ?',
      description: 'Budget provende et coût journalier d’alimentation par filière',
      daxFormula: 'Cout_Alim_Espece = SUMX(F_Alimentation_Elevage, F_Alimentation_Elevage[Cout_FCFA])',
      insight: 'La provende porcs représente 36 000 FCFA/jour, soit 42% des dépenses alimentaires.',
      chartType: 'alimentation',
    },
    {
      id: 'Q5',
      title: 'Quel est le taux de croissance des porcs par lot ?',
      description: 'Gain Moyen Quotidien (GMQ en grammes/jour)',
      daxFormula: 'GMQ_Moyen = AVERAGE(F_Alimentation_Elevage[GMQ_g_jour])',
      insight: 'Lot PARC-T001-P02 : +680 g/jour, conforme aux standards de la race Large White.',
      chartType: 'croissance',
    },
    {
      id: 'Q6',
      title: 'Combien de naissances avons-nous eues ce mois-ci ?',
      description: 'Taux de mise bas, sevrage et productivité numérique',
      daxFormula: 'Total_Naissances = SUM(F_Reproduction[Petits_Nes])',
      insight: '2 naissances caprines viables enregistrées le 14/01/2026 à Sa’a.',
      chartType: 'naissances',
    },
    {
      id: 'Q7',
      title: 'Quelle est la valeur estimée du cheptel par terrain ?',
      description: 'Valorisation patrimoniale de l’actif biologique (Norme OHADA & IAS 41)',
      daxFormula: 'Valeur_Cheptel_Terrain = SUM(F_Elevage_Parcelles[Valeur_Estimee_FCFA])',
      insight: 'T001 Obala concentre 20.3 M FCFA d’actifs sur un total coopératif de 33.72 M FCFA.',
      chartType: 'valeur',
    },
    {
      id: 'Q8',
      title: 'Quels élevages ont des vaccinations en retard ?',
      description: 'Vigilance prophylactique & calendrier de rappel vaccinal',
      daxFormula: 'Retard_Vaccinal = COUNTROWS(FILTER(F_Elevage_Parcelles, F_Elevage_Parcelles[Vaccination_A_Jour] = FALSE))',
      insight: '1 lot en retard : Porcs Large White T001-P02 (Rappel Rouget/PPA requis immédiatement).',
      chartType: 'vaccination',
    },
  ];

  // Chart data for Valeur par Terrain
  const terrainValeurData = TERRAINS_DATA.map((t) => {
    const elvs = ELEVAGE_PARCELLES_DATA.filter((e) => e.terrainId === t.id);
    const val = elvs.reduce((sum, e) => sum + e.valeurEstimeeFCFA, 0);
    return {
      name: t.id,
      commune: t.commune,
      valeurM: +(val / 1000000).toFixed(2),
    };
  });

  // Chart data for Alimentation
  const alimData = [
    { name: 'Porcins', cout: 36000, color: '#ec4899' },
    { name: 'Bovins', cout: 28000, color: '#b45309' },
    { name: 'Volailles', cout: 25500, color: '#f59e0b' },
    { name: 'Pisciculture', cout: 18000, color: '#0284c7' },
    { name: 'Caprins/Ovins', cout: 8000, color: '#10b981' },
  ];

  const currentQ = strategicQuestions[selectedQuestionIndex];

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 uppercase bg-amber-50 px-2.5 py-1 rounded-full mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Moteur d'Aide à la Décision & Modélisation BI</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Réponses aux 8 Questions Stratégiques Décisionnelles
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Passage immédiat de la vue globale à l’explication unitaire : chaque question métier est couplée à sa formule DAX / SQL et sa restitution visuelle.
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-stone-900 text-white px-3 py-1.5 rounded-xl self-start md:self-auto">
          Power BI • Star Schema
        </span>
      </div>

      {/* 8 Questions Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {strategicQuestions.map((q, idx) => {
          const isSelected = selectedQuestionIndex === idx;
          return (
            <button
              key={q.id}
              onClick={() => setSelectedQuestionIndex(idx)}
              className={`p-3 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-emerald-900 text-white border-emerald-950 shadow-sm'
                  : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-emerald-800 text-amber-300' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {q.id}
                </span>
                {idx === 7 && (
                  <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Alerte
                  </span>
                )}
              </div>
              <p className="text-xs font-bold line-clamp-2 leading-snug">{q.title}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Question Deep Dive */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-200 gap-3">
          <div>
            <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
              Question Décisionnelle {currentQ.id}
            </span>
            <h2 className="text-lg font-black text-stone-900 mt-2">{currentQ.title}</h2>
            <p className="text-xs text-stone-500 mt-0.5">{currentQ.description}</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 max-w-md">
            <div className="flex items-center gap-1.5 text-stone-600 text-[11px] font-bold mb-1">
              <Code2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Mesure DAX correspondante :</span>
            </div>
            <code className="text-xs font-mono text-emerald-900 block break-all font-semibold">
              {currentQ.daxFormula}
            </code>
          </div>
        </div>

        {/* Insight Banner */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="text-emerald-950 font-bold block mb-0.5">Constat Analytique & Recommandation :</strong>
            <p className="text-emerald-900 leading-relaxed">{currentQ.insight}</p>
          </div>
        </div>

        {/* Visual Charts tailored to the selected question */}
        <div className="pt-2">
          {/* Case 1, 2, 7: Terrains breakdown */}
          {(currentQ.chartType === 'breakdown' || currentQ.chartType === 'bovins' || currentQ.chartType === 'valeur') && (
            <div>
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                Répartition de la Valeur Biologique Estimée par Terrain (M FCFA)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={terrainValeurData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#78716c" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#78716c" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1c1917', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val: any) => [`${val} M FCFA`, 'Valeur Cheptel']}
                    />
                    <Bar dataKey="valeurM" name="Valeur estimée (M FCFA)" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Case 4: Alimentation cost */}
          {currentQ.chartType === 'alimentation' && (
            <div>
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                Coût Quotidien d'Alimentation par Espèce (FCFA / jour)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alimData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#78716c" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#78716c" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1c1917', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val: any) => [`${val.toLocaleString()} FCFA/j`, 'Dépense alim']}
                    />
                    <Bar dataKey="cout" name="Coût journalier (FCFA)" fill="#d97706" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Case 3, 5, 6, 8: Detailed table breakdown */}
          {(currentQ.chartType === 'mortalite' || currentQ.chartType === 'croissance' || currentQ.chartType === 'naissances' || currentQ.chartType === 'vaccination') && (
            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">Terrain / Parcelle</th>
                    <th className="py-2.5 px-4">Espèce / Lot</th>
                    <th className="py-2.5 px-4 text-center">Effectif</th>
                    <th className="py-2.5 px-4 text-center">Naissances / Mortalités</th>
                    <th className="py-2.5 px-4">Statut Vaccinal</th>
                    <th className="py-2.5 px-4 text-right">Valeur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {ELEVAGE_PARCELLES_DATA.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50">
                      <td className="py-2.5 px-4 font-bold text-stone-900">
                        {item.terrainId} • {item.parcelleCode}
                      </td>
                      <td className="py-2.5 px-4">
                        <strong>{item.especeNom}</strong> ({item.raceNom})
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold">{item.effectifActuel}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="text-emerald-700 font-bold">+{item.naissances}</span> /{' '}
                        <span className="text-rose-700 font-bold">-{item.mortalites}</span>
                      </td>
                      <td className="py-2.5 px-4">
                        {item.vaccinationAJour ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> À jour ({item.prochaineVaccination})
                          </span>
                        ) : (
                          <span className="text-rose-700 font-bold flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded">
                            <AlertTriangle className="w-3.5 h-3.5" /> Retard ({item.prochaineVaccination})
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right font-black text-emerald-800">
                        {item.valeurEstimeeFCFA.toLocaleString()} FCFA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

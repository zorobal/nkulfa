import React, { useState } from 'react';
import {
  Wheat,
  Calendar,
  Layers,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Sprout,
  CheckCircle,
} from 'lucide-react';
import {
  CULTURES_REF,
  CAMPAGNES_DATA,
  SUIVI_PARCELLES_CULTURES,
  PARCELLES_DATA,
} from '../data/coopData';

export const AgricultureModule: React.FC = () => {
  const [selectedCampagne, setSelectedCampagne] = useState('CAMP-2026-A');
  const [selectedCultureFilter, setSelectedCultureFilter] = useState('all');

  const parcellesAgricoles = PARCELLES_DATA.filter(
    (p) => p.typeActivite === 'Agriculture' || p.typeActivite === 'Mixte'
  );

  const filteredSuivi = SUIVI_PARCELLES_CULTURES.filter((item) => {
    const matchCampagne = item.campagneCode === selectedCampagne;
    const matchCulture = selectedCultureFilter === 'all' || item.cultureNom === selectedCultureFilter;
    return matchCampagne && matchCulture;
  });

  const activeCampagne = CAMPAGNES_DATA.find((c) => c.code === selectedCampagne);

  const totalHa = filteredSuivi.reduce((sum, item) => sum + item.superficieHa, 0);
  const totalProductionTonnes = filteredSuivi.reduce(
    (sum, item) => sum + (item.productionTotalTonnes || 0),
    0
  );
  const totalMargeFCFA = filteredSuivi.reduce((sum, item) => sum + item.margeEstimeeFCFA, 0);

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full mb-1">
            <Wheat className="w-3.5 h-3.5" />
            <span>Pôle Végétal & Grandes Cultures</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Campagnes Agricoles & Rendements Parcellaires
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Suivi des parcelles en culture (Maïs CMS 8704, Manioc IRAD 8034, Plantain, Soja), calculs automatiques des rendements (t/ha) et de la marge brute à l’hectare.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500">Campagne active :</span>
          <select
            value={selectedCampagne}
            onChange={(e) => setSelectedCampagne(e.target.value)}
            className="bg-emerald-950 text-white font-bold text-xs rounded-xl px-3 py-2 focus:outline-none"
          >
            {CAMPAGNES_DATA.map((camp) => (
              <option key={camp.id} value={camp.code}>
                {camp.code} - {camp.saison} ({camp.statut})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Campaign Summary Cards */}
      {activeCampagne && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200">
            <span className="text-xs font-bold text-stone-500 block uppercase">Superficie Ciblée</span>
            <span className="text-xl font-black text-stone-900">{activeCampagne.objectifSuperficieHa} ha</span>
            <span className="text-xs text-stone-500 block mt-1">Superficie couverte par les membres</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-stone-200">
            <span className="text-xs font-bold text-stone-500 block uppercase">Objectif Récolte</span>
            <span className="text-xl font-black text-emerald-700">{activeCampagne.objectifProductionTonnes} t</span>
            <span className="text-xs text-stone-500 block mt-1">Projection consolidation silos</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-stone-200">
            <span className="text-xs font-bold text-stone-500 block uppercase">Production Enregistrée</span>
            <span className="text-xl font-black text-blue-700">{activeCampagne.productionReelleTonnes} t</span>
            <span className="text-xs text-emerald-600 font-semibold block mt-1">
              {((activeCampagne.productionReelleTonnes / activeCampagne.objectifProductionTonnes) * 100).toFixed(1)}% de l'objectif
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-stone-200">
            <span className="text-xs font-bold text-stone-500 block uppercase">Marge Brute Parcelles</span>
            <span className="text-xl font-black text-amber-700">{(totalMargeFCFA / 1000000).toFixed(1)} M FCFA</span>
            <span className="text-xs text-stone-500 block mt-1">Revenus déduits des charges</span>
          </div>
        </div>
      )}

      {/* Parcelles and Crops Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-stone-900">
              Suivi Opérationnel des Parcelles Agricoles (D_Parcelles & Suivi)
            </h2>
            <p className="text-xs text-stone-500">
              Calcul mathématique : Rendement = Production (t) / Superficie (ha) • Marge/ha = (Revenus – Coûts) / ha
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">Filtrer par culture :</span>
            <select
              value={selectedCultureFilter}
              onChange={(e) => setSelectedCultureFilter(e.target.value)}
              className="border border-stone-300 rounded-lg px-2.5 py-1 font-medium bg-white"
            >
              <option value="all">Toutes les cultures</option>
              {CULTURES_REF.map((c) => (
                <option key={c.id} value={c.nom}>
                  {c.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Parcelle & Domaine</th>
                <th className="py-3 px-4">Coopérateur</th>
                <th className="py-3 px-4">Culture & Variété</th>
                <th className="py-3 px-4 text-center">Superficie</th>
                <th className="py-3 px-4">Cycle Semis / Récolte</th>
                <th className="py-3 px-4 text-center">Rendement (t/ha)</th>
                <th className="py-3 px-4 text-center">Volume Total</th>
                <th className="py-3 px-4 text-right">Marge Estimée</th>
                <th className="py-3 px-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredSuivi.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-stone-900">
                    <span className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-[11px]">
                      {item.parcelleCode}
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">{item.terrainNom}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-stone-800">{item.cooperateurNom}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-stone-900">{item.cultureNom}</span>
                    <span className="text-[11px] text-stone-500 block">{item.variete}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-stone-900">{item.superficieHa} ha</td>
                  <td className="py-3.5 px-4 text-stone-600">
                    <span className="text-[11px] text-stone-500 block">Semis : {item.dateSemis}</span>
                    <span className="text-[11px] font-medium text-stone-800">
                      Récolte : {item.dateRecoltePrevue}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="font-bold text-emerald-800 text-sm">
                      {item.rendementReelTonnesHa ? `${item.rendementReelTonnesHa} t/ha` : `${item.rendementPrevuTonnesHa} t/ha (cible)`}
                    </div>
                    {item.rendementReelTonnesHa && (
                      <span className="text-[10px] text-emerald-600">
                        {item.rendementReelTonnesHa >= item.rendementPrevuTonnesHa ? '▲ Objectif dépassé' : '▼ En deçà'}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center font-black text-stone-900">
                    {item.productionTotalTonnes ? `${item.productionTotalTonnes} t` : 'En maturation'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-emerald-700">
                    {item.margeEstimeeFCFA.toLocaleString()} FCFA
                    <span className="text-[10px] text-stone-400 block font-normal">
                      {(item.margeEstimeeFCFA / item.superficieHa).toLocaleString(undefined, { maximumFractionDigits: 0 })} FCFA/ha
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.statut === 'Récolté'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.statut === 'Récolte imminente'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Catalog of Reference Crops (D_Cultures) */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5">
        <h2 className="text-base font-bold text-stone-900 mb-1">
          Catalogue des Cultures Certifiées (D_Cultures)
        </h2>
        <p className="text-xs text-stone-500 mb-4">
          Paramétrage des cycles végétatifs, rendements cibles et coûts moyens d'exploitation de référence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CULTURES_REF.map((c) => (
            <div key={c.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-stone-900 text-sm">{c.nom}</span>
                <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  {c.code}
                </span>
              </div>
              <p className="text-xs text-stone-600 mb-3">Variété recommandée : <strong>{c.variete}</strong></p>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-200">
                <div>
                  <span className="text-stone-400 block text-[10px]">Cycle végétatif</span>
                  <strong className="text-stone-800">{c.cycleJours} jours</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Rendement cible</span>
                  <strong className="text-emerald-800">{c.rendementCibleTonnesHa} t/ha</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Coût moyen / ha</span>
                  <strong className="text-stone-800">{c.coutMoyenHaFCFA.toLocaleString()} FCFA</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Prix indicatif marché</span>
                  <strong className="text-stone-800">{c.prixVenteIndicatifKgFCFA} FCFA/kg</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

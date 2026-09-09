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
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  CULTURES_REF,
  SUIVI_PARCELLES_CULTURES,
  PARCELLES_DATA,
} from '../data/coopData';
import { useApp } from '../context/AppContext';

export const AgricultureModule: React.FC = () => {
  const { campagnes, activeCampagneCode, setActiveCampagneCode, addCampagne } = useApp();
  const selectedCampagne = activeCampagneCode;
  const setSelectedCampagne = setActiveCampagneCode;
  const campagnesList = campagnes;
  const [selectedCultureFilter, setSelectedCultureFilter] = useState('all');
  const [suiviList, setSuiviList] = useState(SUIVI_PARCELLES_CULTURES);

  const [isAddCropModalOpen, setIsAddCropModalOpen] = useState(false);
  const [isAddCampagneModalOpen, setIsAddCampagneModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Crop Form state
  const [cropForm, setCropForm] = useState({
    parcelleCode: 'PARC-T001-P03',
    cultureNom: 'Maïs (CMS 8704)',
    superficieHa: 4.5,
    dateSemis: '2026-03-10',
    dateRecoltePrevue: '2026-07-25',
    productionTotalTonnes: 15.0,
    coutTotalFCFA: 650000,
    revenuTotalFCFA: 3000000,
    statut: 'En cours',
  });

  // New Campagne Form state
  const [campagneForm, setCampagneForm] = useState({
    code: 'CAMP-2026-B',
    annee: 2026,
    saison: 'Petite saison des pluies (B)',
    objectifSuperficieHa: 300,
    objectifProductionTonnes: 1200,
  });

  const handleAddCrop = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = Number(cropForm.superficieHa);
    const prod = Number(cropForm.productionTotalTonnes);
    const cout = Number(cropForm.coutTotalFCFA);
    const rev = Number(cropForm.revenuTotalFCFA);
    const marge = rev - cout;

    const newEntry = {
      id: `SPC-${Date.now().toString().slice(-4)}`,
      campagneCode: selectedCampagne,
      parcelleCode: cropForm.parcelleCode,
      cultureNom: cropForm.cultureNom,
      superficieHa: sup,
      dateSemis: cropForm.dateSemis,
      dateRecoltePrevue: cropForm.dateRecoltePrevue,
      productionTotalTonnes: prod,
      rendementTonnesHa: sup > 0 ? Number((prod / sup).toFixed(2)) : 0,
      coutTotalFCFA: cout,
      revenuTotalFCFA: rev,
      margeEstimeeFCFA: marge,
      margeHaFCFA: sup > 0 ? Math.round(marge / sup) : 0,
      statut: cropForm.statut,
    };

    setSuiviList([newEntry, ...suiviList]);
    setToastMessage(`Parcelle ${cropForm.parcelleCode} (${cropForm.cultureNom}) ajoutée avec succès à la campagne ${selectedCampagne} !`);
    setIsAddCropModalOpen(false);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleAddCampagne = (e: React.FormEvent) => {
    e.preventDefault();
    addCampagne({
      code: campagneForm.code,
      nom: `Campagne ${campagneForm.code}`,
      annee: Number(campagneForm.annee),
      saison: campagneForm.saison,
      statut: 'Planifiée' as const,
      typeCampagne: 'Végétale',
      filiere: 'Céréales & Légumineuses',
      dateDebut: `${campagneForm.annee}-09-01`,
      dateFin: `${campagneForm.annee + 1}-01-31`,
      objectifSuperficieHa: Number(campagneForm.objectifSuperficieHa),
      objectifProductionTonnes: Number(campagneForm.objectifProductionTonnes),
      productionReelleTonnes: 0,
      objectifEffectifAnimaux: 0,
      effectifReelAnimaux: 0,
      budgetPrevisionnelFCFA: 30000000,
      depensesReellesFCFA: 0,
      recettesReellesFCFA: 0,
      margeNetteFCFA: 0,
      parcellesCodes: ['PARC-T001-P03'],
      usageEspace: 'Rotation Pâturage Résidus',
    });
    setSelectedCampagne(campagneForm.code);
    setToastMessage(`Campagne "${campagneForm.code}" créée et sélectionnée avec succès !`);
    setIsAddCampagneModalOpen(false);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const parcellesAgricoles = PARCELLES_DATA.filter(
    (p) => p.typeActivite === 'Agriculture' || p.typeActivite === 'Mixte'
  );

  const filteredSuivi = suiviList.filter((item) => {
    const matchCampagne = item.campagneCode === selectedCampagne;
    const matchCulture = selectedCultureFilter === 'all' || item.cultureNom === selectedCultureFilter;
    return matchCampagne && matchCulture;
  });

  const activeCampagne = campagnesList.find((c) => c.code === selectedCampagne);

  const totalHa = filteredSuivi.reduce((sum, item) => sum + item.superficieHa, 0);
  const totalProductionTonnes = filteredSuivi.reduce(
    (sum, item) => sum + (item.productionTotalTonnes || 0),
    0
  );
  const totalMargeFCFA = filteredSuivi.reduce((sum, item) => sum + item.margeEstimeeFCFA, 0);

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-lg border border-emerald-700 flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500">Campagne active :</span>
            <select
              value={selectedCampagne}
              onChange={(e) => setSelectedCampagne(e.target.value)}
              className="bg-emerald-950 text-white font-bold text-xs rounded-xl px-3 py-2 focus:outline-none"
            >
              {campagnesList.map((camp) => (
                <option key={camp.id} value={camp.code}>
                  {camp.code} - {camp.saison} ({camp.statut})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsAddCropModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            title="Ajouter une parcelle en culture"
          >
            <Plus className="w-4 h-4" />
            <span>+ Ajouter Parcelle</span>
          </button>

          <button
            onClick={() => setIsAddCampagneModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            title="Créer une nouvelle campagne"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nouvelle Campagne</span>
          </button>
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

      {/* MODAL 1: AJOUTER PARCELLE EN CULTURE */}
      {isAddCropModalOpen && (
        <div className="fixed inset-0 bg-stone-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Affecter une Parcelle en Culture</h3>
                  <p className="text-[11px] text-stone-500">Campagne active : <span className="font-bold text-emerald-700">{selectedCampagne}</span></p>
                </div>
              </div>
              <button
                onClick={() => setIsAddCropModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCrop} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Parcelle cadastrale</label>
                  <select
                    value={cropForm.parcelleCode}
                    onChange={(e) => setCropForm({ ...cropForm, parcelleCode: e.target.value })}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {parcellesAgricoles.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.code} ({p.typeActivite} - {p.superficieHa} ha)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Culture choisie</label>
                  <select
                    value={cropForm.cultureNom}
                    onChange={(e) => setCropForm({ ...cropForm, cultureNom: e.target.value })}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {CULTURES_REF.map((c) => (
                      <option key={c.id} value={`${c.nom} (${c.variete})`}>
                        {c.nom} ({c.variete})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Superficie emblavée (ha)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={cropForm.superficieHa}
                    onChange={(e) => setCropForm({ ...cropForm, superficieHa: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Production estimée (t)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    required
                    value={cropForm.productionTotalTonnes}
                    onChange={(e) => setCropForm({ ...cropForm, productionTotalTonnes: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Date Semis / Plantation</label>
                  <input
                    type="date"
                    required
                    value={cropForm.dateSemis}
                    onChange={(e) => setCropForm({ ...cropForm, dateSemis: e.target.value })}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Date Récolte prévue</label>
                  <input
                    type="date"
                    required
                    value={cropForm.dateRecoltePrevue}
                    onChange={(e) => setCropForm({ ...cropForm, dateRecoltePrevue: e.target.value })}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Coût estimé (FCFA)</label>
                  <input
                    type="number"
                    step="10000"
                    required
                    value={cropForm.coutTotalFCFA}
                    onChange={(e) => setCropForm({ ...cropForm, coutTotalFCFA: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Revenu attendu (FCFA)</label>
                  <input
                    type="number"
                    step="50000"
                    required
                    value={cropForm.revenuTotalFCFA}
                    onChange={(e) => setCropForm({ ...cropForm, revenuTotalFCFA: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCropModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enregistrer en culture</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: NOUVELLE CAMPAGNE */}
      {isAddCampagneModalOpen && (
        <div className="fixed inset-0 bg-stone-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Ouvrir une Nouvelle Campagne Agricole</h3>
                  <p className="text-[11px] text-stone-500">Planification des cycles et des objectifs coopératifs</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddCampagneModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCampagne} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Code Campagne</label>
                  <input
                    type="text"
                    required
                    value={campagneForm.code}
                    onChange={(e) => setCampagneForm({ ...campagneForm, code: e.target.value })}
                    placeholder="CAMP-2026-B"
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Année</label>
                  <input
                    type="number"
                    min="2024"
                    max="2030"
                    required
                    value={campagneForm.annee}
                    onChange={(e) => setCampagneForm({ ...campagneForm, annee: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Saison / Intitulé</label>
                <select
                  value={campagneForm.saison}
                  onChange={(e) => setCampagneForm({ ...campagneForm, saison: e.target.value })}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Grande saison des pluies (A)">Grande saison des pluies (A)</option>
                  <option value="Petite saison des pluies (B)">Petite saison des pluies (B)</option>
                  <option value="Contre-saison irrigée (C)">Contre-saison irrigée (C)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Objectif Superficie (ha)</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={campagneForm.objectifSuperficieHa}
                    onChange={(e) => setCampagneForm({ ...campagneForm, objectifSuperficieHa: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Objectif Récolte (tonnes)</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={campagneForm.objectifProductionTonnes}
                    onChange={(e) => setCampagneForm({ ...campagneForm, objectifProductionTonnes: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCampagneModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ouvrir la Campagne</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

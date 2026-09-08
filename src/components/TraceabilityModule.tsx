import React, { useState } from 'react';
import {
  SearchCheck,
  QrCode,
  CheckCircle2,
  Calendar,
  MapPin,
  Truck,
  User,
  ShieldCheck,
  Wheat,
  Warehouse,
  FileText,
  Clock,
  Beef,
} from 'lucide-react';

export const TraceabilityModule: React.FC = () => {
  const [selectedLot, setSelectedLot] = useState('NKF-MAIS-2026-00025');

  const lotsAvailable = [
    {
      code: 'NKF-MAIS-2026-00025',
      label: 'Lot Maïs Grain Séché (45 t) • Obala',
      type: 'vegetal',
    },
    {
      code: 'NKF-BOV-2026-0012',
      label: 'Lot Bovins Goudali (35 têtes) • Ferme Obala',
      type: 'animal',
    },
    {
      code: 'NKF-PORC-2026-0048',
      label: 'Lot Porcs Charcutiers (48 têtes) • Obala',
      type: 'animal',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full mb-1">
            <SearchCheck className="w-3.5 h-3.5" />
            <span>Traçabilité Ascendante & Descendante de Bout en Bout</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Passeport Numérique du Lot Agro-Pastoral
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Audit complet du parcours produit : du coopérateur et sa parcelle jusqu'à l'assiette du consommateur et la facture du client institutionnel.
          </p>
        </div>

        {/* Lot Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500">Sélectionner un Lot :</span>
          <select
            value={selectedLot}
            onChange={(e) => setSelectedLot(e.target.value)}
            className="bg-stone-900 text-white font-bold text-xs rounded-xl px-3 py-2 focus:outline-none"
          >
            {lotsAvailable.map((l) => (
              <option key={l.code} value={l.code}>
                {l.code} - {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Lot Summary Card */}
      <div className="bg-gradient-to-r from-stone-900 to-emerald-950 text-white p-6 rounded-2xl border border-emerald-900 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white p-2 rounded-xl flex items-center justify-center shrink-0">
              <QrCode className="w-12 h-12 text-stone-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-xl text-amber-300">{selectedLot}</span>
                <span className="bg-emerald-800 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Certifié Conforme Norme COOP-2026
                </span>
              </div>
              <p className="text-stone-300 text-xs mt-1">
                Origine : Parcelle T001-P001 • Producteur : El Hadj Ousmanou (Membre M-00042)
              </p>
              <p className="text-stone-400 text-[11px] mt-0.5">
                Localisation GPS : 4.1678° N, 11.5332° E • Commune d'Obala, Région du Centre
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div className="bg-stone-800/80 px-4 py-2.5 rounded-xl border border-stone-700">
              <span className="text-[10px] text-stone-400 block uppercase">Quantité Certifiée</span>
              <span className="text-lg font-black text-emerald-300">45,000 kg (45 t)</span>
            </div>
            <div className="bg-stone-800/80 px-4 py-2.5 rounded-xl border border-stone-700">
              <span className="text-[10px] text-stone-400 block uppercase">Humidité au silo</span>
              <span className="text-lg font-black text-amber-300">12.8% (&lt; 14%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Traceability Stepper */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
        <h2 className="text-base font-bold text-stone-900">
          Chronologie d’Événements du Lot (Maillons de la Chaîne)
        </h2>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-600 space-y-8">
          {/* STEP 1: Parcelle & Semis */}
          <div className="relative">
            <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow">
              1
            </div>
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                  <Wheat className="w-3.5 h-3.5" /> Étape 1 : Préparation & Semis
                </span>
                <span className="text-xs text-stone-500">15 Mars 2026</span>
              </div>
              <p className="text-sm font-bold text-stone-900">
                Implantation de 12 hectares de Maïs variété CMS 8704
              </p>
              <p className="text-xs text-stone-600 mt-1">
                Semences certifiées IRAD. Traitement de semences au fongicide naturel. Parcelle T001-P001, sol sablo-argileux drainé.
              </p>
            </div>
          </div>

          {/* STEP 2: Suivi Cultural */}
          <div className="relative">
            <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow">
              2
            </div>
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Étape 2 : Suivi Phyto & Fertilisation
                </span>
                <span className="text-xs text-stone-500">10 Avril - 20 Mai 2026</span>
              </div>
              <p className="text-sm font-bold text-stone-900">
                Fertilisation raisonnée NPK 20-10-10 & Urée
              </p>
              <p className="text-xs text-stone-600 mt-1">
                Inspecté par l'agronome coopératif (Jean-Paul Ebodé). Aucun résidu toxique, conformité aux bonnes pratiques agricoles.
              </p>
            </div>
          </div>

          {/* STEP 3: Récolte & Collecte */}
          <div className="relative">
            <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow">
              3
            </div>
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-blue-800 uppercase flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" /> Étape 3 : Récolte & Pesée au Centre Obala
                </span>
                <span className="text-xs text-stone-500">22 Juillet 2026</span>
              </div>
              <p className="text-sm font-bold text-stone-900">
                Bordereau de collecte certifié n° BORD-COL-2026-001
              </p>
              <p className="text-xs text-stone-600 mt-1">
                Poids brut : 45 000 kg • Grade Qualité : Grade A Extra • Taux d'impuretés : 1.2% • Prix unitaire : 230 FCFA/kg (10 350 000 FCFA).
              </p>
            </div>
          </div>

          {/* STEP 4: Stockage Silo */}
          <div className="relative">
            <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow">
              4
            </div>
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-blue-800 uppercase flex items-center gap-1.5">
                  <Warehouse className="w-3.5 h-3.5" /> Étape 4 : Stockage Silo Obala
                </span>
                <span className="text-xs text-stone-500">23 Juillet 2026</span>
              </div>
              <p className="text-sm font-bold text-stone-900">
                Affectation à la cellule SILO-A2 (620 tonnes consolidées)
              </p>
              <p className="text-xs text-stone-600 mt-1">
                Ventilation thermo-contrôlée à 22°C. Traitement biologique préventif contre le charançon du maïs.
              </p>
            </div>
          </div>

          {/* STEP 5: Vente & Facture */}
          <div className="relative">
            <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow">
              5
            </div>
            <div className="bg-emerald-50/70 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Étape 5 : Vente & Expédition Client
                </span>
                <span className="text-xs text-stone-500">12 Août 2026</span>
              </div>
              <p className="text-sm font-bold text-emerald-950">
                Commande n° CMD-2026-001 livrée aux Minoteries & Brasseries de Yaoundé
              </p>
              <p className="text-xs text-emerald-900 mt-1">
                Volume expédié : 45 tonnes • Facture FAC-2026-001 : 13 050 000 FCFA (290 FCFA/kg). Règlement bancaire reçu à 100%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

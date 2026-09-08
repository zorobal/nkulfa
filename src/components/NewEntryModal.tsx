import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  Beef,
  Wheat,
  Truck,
  HeartPulse,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { TERRAINS_DATA, ESPECES_REF } from '../data/coopData';

interface NewEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const NewEntryModal: React.FC<NewEntryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [entryType, setEntryType] = useState<'sante' | 'naissance' | 'collecte' | 'alimentation'>('sante');
  const [terrain, setTerrain] = useState('T001');
  const [espece, setEspece] = useState('Bovins');
  const [lotCode, setLotCode] = useState('BOV-T001-P01');
  const [description, setDescription] = useState('');
  const [cout, setCout] = useState('15000');
  const [date, setDate] = useState('2026-09-08');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(`Nouvelle opération enregistrée avec succès pour le lot ${lotCode} (${espece}) !`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-stone-950/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Enregistrer une Opération</h3>
              <p className="text-xs text-stone-500">Saisie terrain conforme à la hiérarchie Terrain → Parcelle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 font-bold p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Operation type buttons */}
          <div>
            <label className="block text-stone-600 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
              Type d'opération
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setEntryType('sante')}
                className={`p-2 rounded-xl border text-center font-bold transition-all ${
                  entryType === 'sante'
                    ? 'bg-rose-50 border-rose-500 text-rose-800'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                💉 Traitement
              </button>
              <button
                type="button"
                onClick={() => setEntryType('naissance')}
                className={`p-2 rounded-xl border text-center font-bold transition-all ${
                  entryType === 'naissance'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                🐣 Naissance
              </button>
              <button
                type="button"
                onClick={() => setEntryType('alimentation')}
                className={`p-2 rounded-xl border text-center font-bold transition-all ${
                  entryType === 'alimentation'
                    ? 'bg-amber-50 border-amber-500 text-amber-800'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                🌾 Ration
              </button>
              <button
                type="button"
                onClick={() => setEntryType('collecte')}
                className={`p-2 rounded-xl border text-center font-bold transition-all ${
                  entryType === 'collecte'
                    ? 'bg-blue-50 border-blue-500 text-blue-800'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                ⚖️ Collecte
              </button>
            </div>
          </div>

          {/* Terrain and Species */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-600 font-semibold mb-1">Terrain d'affectation</label>
              <select
                value={terrain}
                onChange={(e) => setTerrain(e.target.value)}
                className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {TERRAINS_DATA.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} - {t.nom} ({t.commune})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-600 font-semibold mb-1">Espèce ou Culture</label>
              <select
                value={espece}
                onChange={(e) => setEspece(e.target.value)}
                className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {ESPECES_REF.map((esp) => (
                  <option key={esp.id} value={esp.nom}>
                    {esp.nom}
                  </option>
                ))}
                <option value="Maïs">Maïs Grain</option>
                <option value="Manioc">Manioc Tubercules</option>
              </select>
            </div>
          </div>

          {/* Lot and Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-600 font-semibold mb-1">Code du Lot / Animal</label>
              <input
                type="text"
                value={lotCode}
                onChange={(e) => setLotCode(e.target.value)}
                className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-stone-600 font-semibold mb-1">Date de l'événement</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <label className="block text-stone-600 font-semibold mb-1">
              Détails / Diagnostic / Observations
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Examen vétérinaire préventif, administration de vaccin ou pesée..."
              className="w-full border border-stone-300 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Cost */}
          <div>
            <label className="block text-stone-600 font-semibold mb-1">Coût associé (FCFA)</label>
            <input
              type="number"
              value={cout}
              onChange={(e) => setCout(e.target.value)}
              className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold shadow-sm transition-colors"
            >
              Valider l'enregistrement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

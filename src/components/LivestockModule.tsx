import React, { useState } from 'react';
import {
  Beef,
  Activity,
  HeartPulse,
  Utensils,
  Baby,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Filter,
  Plus,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ELEVAGE_PARCELLES_DATA,
  SANTE_ANIMALE_DATA,
  REPRODUCTION_DATA,
  ALIMENTATION_DATA,
  EVENEMENTS_ELEVAGE_DATA,
  ESPECES_REF,
  RACES_REF,
  TERRAINS_DATA,
} from '../data/coopData';
import { ElevageParcelle } from '../types';

interface LivestockModuleProps {
  initialSubTab?: 'parcelles' | 'sante' | 'alimentation' | 'reproduction' | 'evenements' | 'referentiels';
}

export const LivestockModule: React.FC<LivestockModuleProps> = ({ initialSubTab = 'parcelles' }) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'parcelles' | 'sante' | 'alimentation' | 'reproduction' | 'evenements' | 'referentiels'
  >(initialSubTab);

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const [selectedTerrainFilter, setSelectedTerrainFilter] = useState<string>('all');
  const [selectedEspeceFilter, setSelectedEspeceFilter] = useState<string>('all');
  const [selectedLotModal, setSelectedLotModal] = useState<ElevageParcelle | null>(null);

  // Filtered dataset
  const filteredElevages = ELEVAGE_PARCELLES_DATA.filter((elv) => {
    const matchTerrain = selectedTerrainFilter === 'all' || elv.terrainId === selectedTerrainFilter;
    const matchEspece = selectedEspeceFilter === 'all' || elv.especeNom === selectedEspeceFilter;
    return matchTerrain && matchEspece;
  });

  const totalEffectif = filteredElevages.reduce((sum, item) => sum + item.effectifActuel, 0);
  const totalValeur = filteredElevages.reduce((sum, item) => sum + item.valeurEstimeeFCFA, 0);
  const totalNaissances = filteredElevages.reduce((sum, item) => sum + item.naissances, 0);
  const totalMortalites = filteredElevages.reduce((sum, item) => sum + item.mortalites, 0);

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase bg-amber-50 px-2.5 py-1 rounded-full mb-1">
            <Beef className="w-3.5 h-3.5" />
            <span>Architecture : Terrain → Parcelle → Élevage → Lot</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Gestion Intégrée de l'Élevage & Cheptel
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Suivi individualisé et par lot du cheptel de COOPS-CA NKUL-FA : bovins Goudali, porcs Large White, volailles chair, ovins, caprins et pisciculture.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-semibold text-stone-500 uppercase block">Valeur Cheptel</span>
            <span className="text-lg font-black text-emerald-700">
              {(totalValeur / 1000000).toFixed(2)} M FCFA
            </span>
          </div>
          <div className="w-px h-8 bg-stone-200"></div>
          <div className="text-right">
            <span className="text-[11px] font-semibold text-stone-500 uppercase block">Effectif Actif</span>
            <span className="text-lg font-black text-stone-900">{totalEffectif.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveSubTab('parcelles')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'parcelles'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Beef className="w-3.5 h-3.5" />
          <span>F_Elevage_Parcelles ({filteredElevages.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sante')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'sante'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
          <span>F_Sante_Animale ({SANTE_ANIMALE_DATA.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('alimentation')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'alimentation'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Utensils className="w-3.5 h-3.5 text-amber-500" />
          <span>F_Alimentation_Elevage ({ALIMENTATION_DATA.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reproduction')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'reproduction'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Baby className="w-3.5 h-3.5 text-pink-500" />
          <span>F_Reproduction ({REPRODUCTION_DATA.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('evenements')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'evenements'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-blue-500" />
          <span>F_Suivi_Elevage ({EVENEMENTS_ELEVAGE_DATA.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('referentiels')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'referentiels'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          <span>Référentiels (D_Especes & D_Races)</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-stone-600 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtres hiérarchiques :</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-stone-500">Terrain :</span>
            <select
              value={selectedTerrainFilter}
              onChange={(e) => setSelectedTerrainFilter(e.target.value)}
              className="bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">Tous les Terrains</option>
              {TERRAINS_DATA.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id} - {t.nom} ({t.commune})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-stone-500">Espèce :</span>
            <select
              value={selectedEspeceFilter}
              onChange={(e) => setSelectedEspeceFilter(e.target.value)}
              className="bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">Toutes les espèces</option>
              {ESPECES_REF.map((esp) => (
                <option key={esp.id} value={esp.nom}>
                  {esp.nom} ({esp.categorie})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 text-stone-600">
          <span>Naissances : <strong className="text-emerald-700">{totalNaissances}</strong></span>
          <span>Mortalités : <strong className="text-rose-700">{totalMortalites}</strong></span>
        </div>
      </div>

      {/* TAB CONTENT 1: F_Elevage_Parcelles Table */}
      {activeSubTab === 'parcelles' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900">
              Table Factuelle : F_Elevage_Parcelles (Terrain → Parcelle → Élevage)
            </h2>
            <span className="text-xs text-stone-500">
              Cliquez sur un lot pour voir sa fiche d'audit complète
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Terrain / Parcelle</th>
                  <th className="py-3 px-4">Lot & Propriétaire</th>
                  <th className="py-3 px-4">Espèce / Race</th>
                  <th className="py-3 px-4 text-center">Initial</th>
                  <th className="py-3 px-4 text-center">Actuel</th>
                  <th className="py-3 px-4 text-center">M/F (J/A)</th>
                  <th className="py-3 px-4 text-center">Nais. / Mort.</th>
                  <th className="py-3 px-4 text-right">Valeur Estimée</th>
                  <th className="py-3 px-4">État Sanitaire</th>
                  <th className="py-3 px-4">Vaccination</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredElevages.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedLotModal(item)}
                    className="hover:bg-emerald-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-emerald-800">{item.terrainId}</span>
                        <ArrowRight className="w-3 h-3 text-stone-400" />
                        <span className="bg-stone-100 px-1.5 py-0.5 rounded text-[11px] font-mono">
                          {item.parcelleCode}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500 block mt-0.5">{item.terrainNom}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 font-mono text-[11px]">{item.lotCode}</span>
                      <span className="text-[11px] text-stone-500 block">{item.proprietaireNom}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900">{item.especeNom}</span>
                      <span className="text-[11px] text-stone-500 block">{item.raceNom}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-stone-500 font-medium">
                      {item.effectifInitial.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center font-black text-stone-900 text-sm">
                      {item.effectifActuel.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center text-stone-600">
                      <span>{item.effectifMales}♂ / {item.effectifFemelles}♀</span>
                      <span className="text-[10px] text-stone-400 block">({item.jeunes}J / {item.adultes}A)</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-emerald-700 font-bold">+{item.naissances}</span>
                      <span className="text-stone-300 mx-1">/</span>
                      <span className="text-rose-600 font-bold">-{item.mortalites}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-800">
                      {item.valeurEstimeeFCFA.toLocaleString()} FCFA
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          item.etatSanitaire === 'Très bon'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.etatSanitaire === 'Bon'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.etatSanitaire}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.vaccinationAJour ? (
                        <div className="flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>À jour ({item.prochaineVaccination})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-rose-700 font-bold text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.prochaineVaccination}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: F_Sante_Animale */}
      {activeSubTab === 'sante' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200">
            <h2 className="text-sm font-bold text-stone-900">
              Registre Sanitaire & Vétérinaire (F_Sante_Animale)
            </h2>
            <p className="text-xs text-stone-500">
              Traçabilité des consultations, diagnostics, protocoles médicamenteux et vétérinaires agréés.
            </p>
          </div>
          <div className="divide-y divide-stone-100">
            {SANTE_ANIMALE_DATA.map((item) => (
              <div key={item.id} className="p-4 hover:bg-stone-50 transition-colors flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                      {item.lotCode}
                    </span>
                    <span className="text-xs font-semibold text-emerald-800">{item.especeNom}</span>
                    <span className="text-xs text-stone-400">• {item.date}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.statutGuerison === 'Guéri'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.statutGuerison}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-900">{item.maladieOuSymptome}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    <strong>Diagnostic :</strong> {item.diagnostic}
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    <strong>Protocole :</strong> {item.traitementAdministre} ({item.medicament})
                  </p>
                </div>
                <div className="text-right sm:self-center shrink-0">
                  <span className="text-xs text-stone-500 block">Vétérinaire : {item.veterinaire}</span>
                  <span className="text-sm font-black text-stone-900">
                    {item.coutFCFA.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: F_Alimentation_Elevage */}
      {activeSubTab === 'alimentation' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200">
            <h2 className="text-sm font-bold text-stone-900">
              Gestion de l'Alimentation, Rations & GMQ (F_Alimentation_Elevage)
            </h2>
            <p className="text-xs text-stone-500">
              Contrôle des provendes, rations journalières, coûts et Gain Moyen Quotidien (GMQ).
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {ALIMENTATION_DATA.map((alim) => (
              <div
                key={alim.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    {alim.lotCode}
                  </span>
                  <span className="text-xs font-bold text-stone-900">{alim.especeNom}</span>
                </div>
                <p className="text-xs font-bold text-stone-900 mb-1">{alim.typeAliment}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 mt-2 pt-2 border-t border-stone-200">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Quantité distribuée</span>
                    <strong className="text-stone-900">{alim.quantiteDistribueeKg} kg/jour</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Coût journalier</span>
                    <strong className="text-emerald-800">{alim.coutFCFA.toLocaleString()} FCFA</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Fréquence</span>
                    <strong className="text-stone-700">{alim.frequence}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">GMQ (Gain moyen)</span>
                    <strong className="text-blue-700">+{alim.gainMoyenQuotidienG} g/jour</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: F_Reproduction */}
      {activeSubTab === 'reproduction' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200">
            <h2 className="text-sm font-bold text-stone-900">
              Suivi de la Reproduction & Naissances (F_Reproduction)
            </h2>
            <p className="text-xs text-stone-500">
              Généalogie, saillies contrôlées, gestations, mise-bas et taux de survie des nouveau-nés.
            </p>
          </div>
          <div className="divide-y divide-stone-100">
            {REPRODUCTION_DATA.map((rep) => (
              <div key={rep.id} className="p-4 hover:bg-stone-50 transition-colors flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {rep.lotCode}
                    </span>
                    <span className="text-xs font-semibold text-stone-600">{rep.especeNom}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rep.statut === 'Mise bas réussie'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {rep.statut}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700">
                    Femelle : <strong>{rep.femelleRef}</strong> • Mâle : <strong>{rep.maleReproducteurRef}</strong>
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Saillie le {rep.dateSaillie} • Mise-bas prévue : {rep.dateMiseBasPrevue}
                    {rep.dateMiseBasReelle && ` (Effectuée le ${rep.dateMiseBasReelle})`}
                  </p>
                </div>
                <div className="text-right sm:self-center shrink-0">
                  <span className="text-xs text-stone-500 block">Portée / Survivants</span>
                  <span className="text-sm font-black text-emerald-700">
                    {rep.petitsNés} nés ({rep.survivants} survivants)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: F_Evenements_Elevage */}
      {activeSubTab === 'evenements' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200">
            <h2 className="text-sm font-bold text-stone-900">
              Journal d'Événements & Opérations Élevage (F_Evenements_Elevage)
            </h2>
            <p className="text-xs text-stone-500">
              Historique chronologique des pesées, transferts, naissances, déparasitages et ventes.
            </p>
          </div>
          <div className="divide-y divide-stone-100">
            {EVENEMENTS_ELEVAGE_DATA.map((evt) => (
              <div key={evt.id} className="p-4 hover:bg-stone-50 transition-colors flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {evt.typeEvenement.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">{evt.typeEvenement}</span>
                      <span className="text-xs font-mono text-stone-500">({evt.lotCode})</span>
                      <span className="text-xs text-stone-400">• {evt.date}</span>
                    </div>
                    <p className="text-xs text-stone-700 font-medium mt-0.5">{evt.description}</p>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Intervenant : <strong>{evt.intervenant}</strong> • Obs : {evt.observations}
                    </p>
                  </div>
                </div>
                {evt.coutFCFA > 0 && (
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-stone-900">
                      {evt.coutFCFA.toLocaleString()} FCFA
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: Référentiels D_Especes & D_Races */}
      {activeSubTab === 'referentiels' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* D_Especes */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5">
            <h2 className="text-base font-bold text-stone-900 mb-2">Table D_Especes</h2>
            <p className="text-xs text-stone-500 mb-4">
              Nomenclature officielle des filières animales de COOPS-CA NKUL-FA.
            </p>
            <div className="space-y-3">
              {ESPECES_REF.map((esp) => (
                <div key={esp.id} className="p-3 rounded-xl border border-stone-200 bg-stone-50/70">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm">{esp.nom}</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {esp.categorie}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-stone-200 text-xs text-stone-600">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Durée cycle</span>
                      <strong>{esp.dureeMoyenneMois} mois</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Poids moyen</span>
                      <strong>{esp.poidsMoyenKg} kg</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Unité</span>
                      <strong>{esp.uniteComptage}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* D_Races */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5">
            <h2 className="text-base font-bold text-stone-900 mb-2">Table D_Races</h2>
            <p className="text-xs text-stone-500 mb-4">
              Sélection génétique et adaptation agro-écologique au Centre Cameroun.
            </p>
            <div className="space-y-3">
              {RACES_REF.map((rac) => (
                <div key={rac.id} className="p-3 rounded-xl border border-stone-200 bg-stone-50/70">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-stone-900 text-sm">{rac.nom}</span>
                      <span className="text-xs text-stone-500 ml-2">({rac.especeNom})</span>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Rusticité : {rac.rusticite}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    <strong>Origine :</strong> {rac.origine}
                  </p>
                  <p className="text-xs text-stone-600">
                    <strong>Aptitude :</strong> {rac.aptitude}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lot Detail Modal */}
      {selectedLotModal && (
        <div className="fixed inset-0 bg-stone-950/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  {selectedLotModal.lotCode}
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-1">
                  {selectedLotModal.especeNom} • {selectedLotModal.raceNom}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLotModal(null)}
                className="text-stone-400 hover:text-stone-700 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-stone-500 block">Terrain & Parcelle</span>
                <strong className="text-stone-900 text-sm">
                  {selectedLotModal.terrainId} ({selectedLotModal.terrainNom}) → {selectedLotModal.parcelleCode}
                </strong>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-stone-500 block">Propriétaire / Responsable</span>
                <strong className="text-stone-900 text-sm">{selectedLotModal.proprietaireNom}</strong>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-stone-500 block">Effectif Actuel</span>
                <strong className="text-stone-900 text-lg">
                  {selectedLotModal.effectifActuel.toLocaleString()} têtes
                </strong>
                <span className="text-[10px] text-stone-500 block">
                  (Init : {selectedLotModal.effectifInitial} | +{selectedLotModal.naissances} nais | -{selectedLotModal.mortalites} mort)
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-stone-500 block">Valeur Évaluée</span>
                <strong className="text-emerald-700 text-lg">
                  {selectedLotModal.valeurEstimeeFCFA.toLocaleString()} FCFA
                </strong>
                <span className="text-[10px] text-stone-500 block">
                  Coût initial : {selectedLotModal.coutAcquisitionFCFA.toLocaleString()} FCFA
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl text-xs space-y-1">
              <p>
                <strong>Date de mise en place :</strong> {selectedLotModal.dateDebut}
              </p>
              <p>
                <strong>Santé générale :</strong> {selectedLotModal.etatSanitaire}
              </p>
              <p>
                <strong>Prochaine vaccination / contrôle :</strong> {selectedLotModal.prochaineVaccination}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLotModal(null)}
                className="bg-stone-900 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-stone-800"
              >
                Fermer la fiche
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

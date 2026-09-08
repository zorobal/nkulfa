import React, { useState } from 'react';
import {
  Truck,
  Warehouse,
  Factory,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Search,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { COLLECTES_DATA, MAGASINS_STOCKS_DATA } from '../data/coopData';

interface SupplyChainModuleProps {
  initialTab?: 'collecte' | 'magasins' | 'transformation';
}

export const SupplyChainModule: React.FC<SupplyChainModuleProps> = ({ initialTab = 'collecte' }) => {
  const [activeTab, setActiveTab] = useState<'collecte' | 'magasins' | 'transformation'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCollectes = COLLECTES_DATA.filter((col) => {
    return (
      col.membreNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.codeBordereau.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.produit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.lotTraçabilite.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalKgCollecte = COLLECTES_DATA.reduce((sum, item) => sum + item.quantiteKg, 0);
  const totalValCollecte = COLLECTES_DATA.reduce((sum, item) => sum + item.montantTotalFCFA, 0);
  const totalDejaPaye = COLLECTES_DATA.reduce((sum, item) => sum + item.montantDejaPayeFCFA, 0);
  const totalResteAPayer = COLLECTES_DATA.reduce((sum, item) => sum + item.resteAPayerFCFA, 0);

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 uppercase bg-blue-50 px-2.5 py-1 rounded-full mb-1">
            <Truck className="w-3.5 h-3.5" />
            <span>Chaîne d'Approvisionnement, Stockage & Transformation</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Collecte, Magasins & Valorisation Agroalimentaire
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Agrégation des volumes auprès des 486 membres, stockage multi-magasins dans le Centre Cameroun et valorisation industrielle (minoterie maïs, découpe avicole, conservation).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-semibold text-stone-500 uppercase block">Volume Collecté</span>
            <span className="text-lg font-black text-blue-700">
              {(totalKgCollecte / 1000).toFixed(1)} Tonnes
            </span>
          </div>
          <div className="w-px h-8 bg-stone-200"></div>
          <div className="text-right">
            <span className="text-[11px] font-semibold text-stone-500 uppercase block">Valeur Collecte</span>
            <span className="text-lg font-black text-stone-900">
              {(totalValCollecte / 1000000).toFixed(2)} M FCFA
            </span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('collecte')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'collecte'
              ? 'bg-blue-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Bordereaux de Collecte ({COLLECTES_DATA.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('magasins')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'magasins'
              ? 'bg-blue-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Warehouse className="w-3.5 h-3.5" />
          <span>Magasins & Silos de Stock ({MAGASINS_STOCKS_DATA.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transformation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'transformation'
              ? 'bg-blue-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Factory className="w-3.5 h-3.5" />
          <span>Transformation : Maïs → Farine COOPS-FLOUR</span>
        </button>
      </div>

      {/* TAB 1: Collecte & Agrégation */}
      {activeTab === 'collecte' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par membre, bordereau, produit ou n° de lot..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-stone-600">
                Déjà versé aux membres : <strong className="text-emerald-700">{(totalDejaPaye / 1000000).toFixed(2)} M</strong>
              </span>
              <span className="text-stone-600">
                Reste dû : <strong className="text-amber-700">{(totalResteAPayer / 1000000).toFixed(2)} M</strong>
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Bordereau & Date</th>
                    <th className="py-3 px-4">Coopérateur</th>
                    <th className="py-3 px-4">Produit & Grade</th>
                    <th className="py-3 px-4 text-center">Quantité (kg)</th>
                    <th className="py-3 px-4 text-right">Prix Unitaire</th>
                    <th className="py-3 px-4 text-right">Montant Total</th>
                    <th className="py-3 px-4 text-right">Reste à Payer</th>
                    <th className="py-3 px-4">N° Lot Traçabilité</th>
                    <th className="py-3 px-4">Statut Paiement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredCollectes.map((col) => (
                    <tr key={col.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-stone-900">{col.codeBordereau}</span>
                        <span className="text-[11px] text-stone-500 block">{col.date}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-900">{col.membreNom}</span>
                        <span className="text-[11px] text-stone-500 block">{col.pointCollecte}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-900">{col.produit}</span>
                        <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded font-semibold text-stone-600 inline-block mt-0.5">
                          {col.qualiteGrade}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-black text-stone-900">
                        {col.quantiteKg.toLocaleString()} kg
                        <span className="text-[10px] text-stone-400 block font-normal">
                          {(col.quantiteKg / 1000).toFixed(2)} t
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-stone-700">
                        {col.prixUnitaireFCFA} FCFA
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-stone-900">
                        {col.montantTotalFCFA.toLocaleString()} FCFA
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-amber-700">
                        {col.resteAPayerFCFA === 0 ? (
                          <span className="text-emerald-700">0 FCFA</span>
                        ) : (
                          `${col.resteAPayerFCFA.toLocaleString()} FCFA`
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                          {col.lotTraçabilite}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            col.statutPaiement === 'Payé'
                              ? 'bg-emerald-100 text-emerald-800'
                              : col.statutPaiement === 'Acompte versé'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {col.statutPaiement}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Magasins & Silos */}
      {activeTab === 'magasins' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {MAGASINS_STOCKS_DATA.map((mag) => (
            <div key={mag.id} className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                    {mag.id}
                  </span>
                  <span className="text-xs font-semibold text-stone-500">{mag.commune}</span>
                </div>
                <h3 className="text-base font-bold text-stone-900">{mag.nom}</h3>
                <p className="text-xs text-stone-500 mt-0.5">Responsable : {mag.responsable}</p>

                {/* Capacity progress */}
                <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-stone-600">Taux d'occupation</span>
                    <span className="text-blue-700 font-bold">{mag.tauxOccupationPct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${mag.tauxOccupationPct}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2">
                    <span>Stock : <strong>{mag.stockActuelTonnes} t</strong></span>
                    <span>Capacité : <strong>{mag.capaciteMaxTonnes} t</strong></span>
                  </div>
                </div>

                {/* Products list in this warehouse */}
                <div className="mt-4 space-y-2">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Stocks répertoriés
                  </span>
                  {mag.produits.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-stone-100 bg-stone-50/50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-stone-900">{p.produit}</p>
                        <span className="text-[10px] font-mono text-stone-500">{p.lot}</span>
                      </div>
                      <div className="text-right">
                        <strong className="text-stone-900 block">{(p.quantiteKg / 1000).toFixed(1)} t</strong>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            p.statutAlerte === 'Normal'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.statutAlerte}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                <span className="text-stone-500">Valeur immobilisée :</span>
                <strong className="text-emerald-800 text-sm">
                  {(mag.valeurStockFCFA / 1000000).toFixed(1)} M FCFA
                </strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Transformation Agroalimentaire */}
      {activeTab === 'transformation' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chaîne de Valorisation & Prix de Revient</span>
              </div>
              <h2 className="text-lg font-black text-stone-900">
                Ligne de Minoterie : Maïs Grain → Farine Extra Enrichie (COOPS-FLOUR)
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Exemple concret de calcul de coût de revient, valorisation et marge coopérative.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-stone-100 px-3 py-1.5 rounded-xl text-stone-700">
              Lot Réf : TRF-FAR-2026-0009
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
              <span className="text-stone-500 block">1. Matière première</span>
              <strong className="text-stone-900 text-sm">Maïs Grain nettoyé (Grade A)</strong>
              <div className="mt-2 text-stone-600">
                <p>Quantité : <strong>10 000 kg (10 t)</strong></p>
                <p>Prix achat coopérateur : <strong>230 FCFA/kg</strong></p>
                <p>Coût d'achat total : <strong>2 300 000 FCFA</strong></p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
              <span className="text-stone-500 block">2. Opérations d'usinage</span>
              <strong className="text-stone-900 text-sm">Broyage, tamisage & enrichissement</strong>
              <div className="mt-2 text-stone-600">
                <p>Énergie & main d'œuvre : <strong>45 FCFA/kg</strong></p>
                <p>Emballage kraft imprimé : <strong>25 FCFA/sac</strong></p>
                <p>Coût transformation : <strong>520 000 FCFA</strong></p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
              <span className="text-stone-500 block">3. Rendement de transformation</span>
              <strong className="text-stone-900 text-sm">Taux d'extraction : 82%</strong>
              <div className="mt-2 text-stone-600">
                <p>Farine produite : <strong>8 200 kg (1 640 sacs 5kg)</strong></p>
                <p>Son de maïs (provende) : <strong>1 800 kg</strong></p>
                <p>Pertes matières : <strong>&lt; 0.5%</strong></p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50">
              <span className="text-emerald-800 font-bold block">4. Valorisation & Marge</span>
              <strong className="text-emerald-950 text-sm">Prix de revient : 344 FCFA/kg</strong>
              <div className="mt-2 text-emerald-900 font-semibold">
                <p>Prix vente grossiste : <strong>450 FCFA/kg</strong></p>
                <p>CA Vente prévisionnel : <strong>3 690 000 FCFA</strong></p>
                <p className="text-emerald-800 font-black text-sm mt-1">
                  Marge brute : +870 000 FCFA (+30.8%)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

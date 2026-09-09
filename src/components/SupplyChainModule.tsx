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
  Plus,
  X,
} from 'lucide-react';
import { MAGASINS_STOCKS_DATA } from '../data/coopData';
import { useApp } from '../context/AppContext';

interface SupplyChainModuleProps {
  initialTab?: 'collecte' | 'magasins' | 'transformation';
}

export const SupplyChainModule: React.FC<SupplyChainModuleProps> = ({ initialTab = 'collecte' }) => {
  const { collectes, addCollecte, membres } = useApp();
  const [activeTab, setActiveTab] = useState<'collecte' | 'magasins' | 'transformation'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & Toast States
  const [isAddCollecteModalOpen, setIsAddCollecteModalOpen] = useState(false);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Collecte form state
  const [collecteForm, setCollecteForm] = useState({
    membreId: membres[0]?.id || 'MEM-001',
    produit: 'Maïs Grain (CMS 8704)',
    quantiteKg: 1200,
    prixUnitaireFCFA: 230,
    humiditePct: 13.2,
    qualiteGrade: 'A' as 'A' | 'B' | 'C',
    statutPaiement: 'Acompte versé' as 'Payé' | 'Acompte versé' | 'En attente',
    montantDejaPayeFCFA: 150000,
  });

  // New Stock movement form state
  const [stockForm, setStockForm] = useState({
    magasinId: 'MAG-01',
    produit: 'Maïs Grain Séché',
    quantiteKg: 5000,
    typeMouvement: 'Entrée (Réception Récolte)' as 'Entrée (Réception Récolte)' | 'Sortie (Transformation)' | 'Transfert Inter-Silos',
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateCollecte = (e: React.FormEvent) => {
    e.preventDefault();
    const membreObj = membres.find((m) => m.id === collecteForm.membreId) || membres[0];
    const total = collecteForm.quantiteKg * collecteForm.prixUnitaireFCFA;
    const reste = Math.max(0, total - Number(collecteForm.montantDejaPayeFCFA));
    const randomSuffix = Math.floor(100 + Math.random() * 900);

    addCollecte({
      codeBordereau: `BORD-2026-${randomSuffix}`,
      dateCollecte: new Date().toISOString().split('T')[0],
      membreId: membreObj ? membreObj.id : 'MEM-001',
      membreNom: membreObj ? `${membreObj.nom} ${membreObj.prenom}` : 'Coopérateur',
      produit: collecteForm.produit,
      quantiteKg: Number(collecteForm.quantiteKg),
      prixUnitaireFCFA: Number(collecteForm.prixUnitaireFCFA),
      montantTotalFCFA: total,
      montantDejaPayeFCFA: Number(collecteForm.montantDejaPayeFCFA),
      resteAPayerFCFA: reste,
      humiditePct: Number(collecteForm.humiditePct),
      qualiteGrade: collecteForm.qualiteGrade,
      lotTraçabilite: `LOT-2026-${randomSuffix}`,
      statutPaiement: collecteForm.statutPaiement,
    });

    setIsAddCollecteModalOpen(false);
    triggerToast(`Bordereau BORD-2026-${randomSuffix} enregistré avec succès (${collecteForm.quantiteKg} kg) !`);
  };

  const handleCreateStockMovement = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddStockModalOpen(false);
    triggerToast(`Mouvement de stock enregistré : ${stockForm.typeMouvement} de ${stockForm.quantiteKg} kg dans ${stockForm.magasinId} !`);
  };

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const filteredCollectes = collectes.filter((col) => {
    return (
      col.membreNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.codeBordereau.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.produit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.lotTraçabilite.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalKgCollecte = collectes.reduce((sum, item) => sum + item.quantiteKg, 0);
  const totalValCollecte = collectes.reduce((sum, item) => sum + item.montantTotalFCFA, 0);
  const totalDejaPaye = collectes.reduce((sum, item) => sum + item.montantDejaPayeFCFA, 0);
  const totalResteAPayer = collectes.reduce((sum, item) => sum + item.resteAPayerFCFA, 0);

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
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('collecte')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'collecte'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Bordereaux de Collecte ({collectes.length})</span>
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

        {/* Global Tab Action Buttons */}
        <div className="flex items-center gap-2">
          {activeTab === 'collecte' && (
            <button
              onClick={() => setIsAddCollecteModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Ajouter un nouveau bordereau de collecte"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nouveau Bordereau de Collecte</span>
            </button>
          )}

          {activeTab === 'magasins' && (
            <button
              onClick={() => setIsAddStockModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Enregistrer une réception ou mouvement de stock"
            >
              <Plus className="w-4 h-4" />
              <span>+ Mouvement de Stock</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-900 font-bold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-emerald-100 rounded text-emerald-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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

      {/* MODAL: Nouveau Bordereau de Collecte */}
      {isAddCollecteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Nouveau Bordereau de Collecte</h3>
                  <p className="text-xs text-slate-500">Réception pesée, humidité et bordereau coopérateur</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddCollecteModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCollecte} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Membre Coopérateur</label>
                <select
                  value={collecteForm.membreId}
                  onChange={(e) => setCollecteForm({ ...collecteForm, membreId: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                >
                  {membres.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.code} - {m.nom} {m.prenom} ({m.commune})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Produit Collecté</label>
                  <select
                    value={collecteForm.produit}
                    onChange={(e) => setCollecteForm({ ...collecteForm, produit: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Maïs Grain (CMS 8704)">Maïs Grain (CMS 8704)</option>
                    <option value="Manioc Frais (TME 419)">Manioc Frais (TME 419)</option>
                    <option value="Soja Grain (TGX 1904)">Soja Grain (TGX 1904)</option>
                    <option value="Igname Blanc">Igname Blanc</option>
                    <option value="Arachide Décortiquée">Arachide Décortiquée</option>
                    <option value="Poulet Vif (Cobb 500)">Poulet Vif (Cobb 500)</option>
                    <option value="Porc Vif (Large White)">Porc Vif (Large White)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Qualité / Grade</label>
                  <select
                    value={collecteForm.qualiteGrade}
                    onChange={(e) =>
                      setCollecteForm({ ...collecteForm, qualiteGrade: e.target.value as 'A' | 'B' | 'C' })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="A">Grade A (Excellente pureté & calibrage)</option>
                    <option value="B">Grade B (Standard)</option>
                    <option value="C">Grade C (Déclassé / Provende)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Quantité (kg)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={collecteForm.quantiteKg}
                    onChange={(e) => setCollecteForm({ ...collecteForm, quantiteKg: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Prix Unitaire (FCFA)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={collecteForm.prixUnitaireFCFA}
                    onChange={(e) =>
                      setCollecteForm({ ...collecteForm, prixUnitaireFCFA: Number(e.target.value) })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Humidité (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={collecteForm.humiditePct}
                    onChange={(e) =>
                      setCollecteForm({ ...collecteForm, humiditePct: Number(e.target.value) })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-blue-900 font-medium">Montant Total Brut :</span>
                  <span className="text-sm font-black text-blue-950">
                    {(collecteForm.quantiteKg * collecteForm.prixUnitaireFCFA).toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Statut Paiement</label>
                  <select
                    value={collecteForm.statutPaiement}
                    onChange={(e) =>
                      setCollecteForm({
                        ...collecteForm,
                        statutPaiement: e.target.value as 'Payé' | 'Acompte versé' | 'En attente',
                      })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Acompte versé">Acompte versé</option>
                    <option value="Payé">Totalement payé</option>
                    <option value="En attente">En attente de règlement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Montant Déjà Versé (FCFA)</label>
                  <input
                    type="number"
                    value={collecteForm.montantDejaPayeFCFA}
                    onChange={(e) =>
                      setCollecteForm({ ...collecteForm, montantDejaPayeFCFA: Number(e.target.value) })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddCollecteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Valider & Enregistrer Bordereau
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Mouvement de Stock */}
      {isAddStockModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Warehouse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Nouveau Mouvement de Stock</h3>
                  <p className="text-xs text-slate-500">Mise à jour d'inventaire silo & magasin</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddStockModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStockMovement} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Magasin / Silo</label>
                <select
                  value={stockForm.magasinId}
                  onChange={(e) => setStockForm({ ...stockForm, magasinId: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                >
                  {MAGASINS_STOCKS_DATA.map((mag) => (
                    <option key={mag.id} value={mag.id}>
                      {mag.nom} ({mag.commune}) - Capacité {mag.capaciteMaxTonnes} t
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Type de Mouvement</label>
                <select
                  value={stockForm.typeMouvement}
                  onChange={(e) =>
                    setStockForm({
                      ...stockForm,
                      typeMouvement: e.target.value as any,
                    })
                  }
                  className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Entrée (Réception Récolte)">Entrée (Réception Récolte)</option>
                  <option value="Sortie (Transformation)">Sortie (Vers Unité de Transformation)</option>
                  <option value="Transfert Inter-Silos">Transfert Inter-Silos</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Produit</label>
                <input
                  type="text"
                  value={stockForm.produit}
                  onChange={(e) => setStockForm({ ...stockForm, produit: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Quantité (kg)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={stockForm.quantiteKg}
                  onChange={(e) => setStockForm({ ...stockForm, quantiteKg: Number(e.target.value) })}
                  className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddStockModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Enregistrer Mouvement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

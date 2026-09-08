import React, { useState } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
} from 'lucide-react';
import { VENTES_DATA, COLLECTES_DATA, MEMBRES_DATA } from '../data/coopData';

interface CommercialFinanceModuleProps {
  initialTab?: 'ventes' | 'cooperateurs' | 'tresorerie';
}

export const CommercialFinanceModule: React.FC<CommercialFinanceModuleProps> = ({ initialTab = 'ventes' }) => {
  const [activeTab, setActiveTab] = useState<'ventes' | 'cooperateurs' | 'tresorerie'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Compute cooperative balance
  const memberBalances = MEMBRES_DATA.map((membre) => {
    const memberCollectes = COLLECTES_DATA.filter((c) => c.membreId === membre.id);
    const totalLivreKg = memberCollectes.reduce((sum, c) => sum + c.quantiteKg, 0);
    const totalDuFCFA = memberCollectes.reduce((sum, c) => sum + c.montantTotalFCFA, 0);
    const totalPayeFCFA = memberCollectes.reduce((sum, c) => sum + c.montantDejaPayeFCFA, 0);
    const resteAPayerFCFA = memberCollectes.reduce((sum, c) => sum + c.resteAPayerFCFA, 0);

    return {
      ...membre,
      totalLivreKg,
      totalDuFCFA,
      totalPayeFCFA,
      resteAPayerFCFA,
    };
  });

  const totalVentes = VENTES_DATA.reduce((sum, v) => sum + v.montantTotalFCFA, 0);
  const totalEncaisse = VENTES_DATA.filter((v) => v.statutReglement === 'Réglé').reduce(
    (sum, v) => sum + v.montantTotalFCFA,
    0
  );
  const totalDuCoop = memberBalances.reduce((sum, m) => sum + m.totalDuFCFA, 0);
  const totalPayeCoop = memberBalances.reduce((sum, m) => sum + m.totalPayeFCFA, 0);
  const totalResteCoop = memberBalances.reduce((sum, m) => sum + m.resteAPayerFCFA, 0);

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Commercialisation & Comptabilité Coopérative</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Ventes, Facturation & Rémunération des Membres
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Séparation stricte : <strong>Finances Coopérative</strong> (recettes, investissements, marge) et{' '}
            <strong>Comptes Membres</strong> (volumes livrés, prix garanti, avances et soldes dus).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-semibold text-stone-500 uppercase block">CA Ventes</span>
            <span className="text-lg font-black text-stone-900">
              {(totalVentes / 1000000).toFixed(2)} M FCFA
            </span>
          </div>
          <div className="w-px h-8 bg-stone-200"></div>
          <div className="text-right">
            <span className="text-[11px] font-semibold text-stone-500 uppercase block">Dû Coopérateurs</span>
            <span className="text-lg font-black text-emerald-700">
              {(totalDuCoop / 1000000).toFixed(2)} M FCFA
            </span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('ventes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ventes'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Commandes & Ventes Clients ({VENTES_DATA.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cooperateurs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'cooperateurs'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Comptes Membres & Rémunération ({memberBalances.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tresorerie')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'tresorerie'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Trésorerie & Compte d'Exploitation</span>
        </button>
      </div>

      {/* TAB 1: Ventes & Clients */}
      {activeTab === 'ventes' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-stone-900">
                  Journal des Commandes & Ventes (Workflow Commercial)
                </h2>
                <p className="text-xs text-stone-500">
                  Clients institutionnels, agro-industries, chaînes hôtelières et supermarchés du Cameroun.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Encaissé : {(totalEncaisse / 1000000).toFixed(1)} M FCFA
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Commande & Date</th>
                    <th className="py-3 px-4">Client & Profil</th>
                    <th className="py-3 px-4">Produits Achetés</th>
                    <th className="py-3 px-4 text-center">Volume (t)</th>
                    <th className="py-3 px-4 text-right">Montant Total</th>
                    <th className="py-3 px-4">Statut Livraison</th>
                    <th className="py-3 px-4">Statut Règlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {VENTES_DATA.map((v) => (
                    <tr key={v.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        {v.codeCommande}
                        <span className="text-[11px] text-stone-500 font-sans block">{v.date}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-900">{v.clientNom}</span>
                        <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-600 block w-fit mt-0.5 font-medium">
                          {v.typeClient}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-700 max-w-xs truncate">{v.produits}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-stone-900">{v.quantiteTonnes} t</td>
                      <td className="py-3.5 px-4 text-right font-black text-stone-900">
                        {v.montantTotalFCFA.toLocaleString()} FCFA
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            v.statutLivraison === 'Livré'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {v.statutLivraison}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            v.statutReglement === 'Réglé'
                              ? 'bg-emerald-100 text-emerald-800'
                              : v.statutReglement === 'Acompte'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {v.statutReglement}
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

      {/* TAB 2: Comptes Coopérateurs */}
      {activeTab === 'cooperateurs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <span className="text-xs font-bold text-stone-500 block uppercase">
                Montant Global Dû aux Membres
              </span>
              <span className="text-xl font-black text-stone-900">
                {totalDuCoop.toLocaleString()} FCFA
              </span>
              <span className="text-xs text-stone-500 block mt-1">Calculé sur livraisons certifiées</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <span className="text-xs font-bold text-stone-500 block uppercase">
                Montants Déjà Versés
              </span>
              <span className="text-xl font-black text-emerald-700">
                {totalPayeCoop.toLocaleString()} FCFA
              </span>
              <span className="text-xs text-emerald-600 block mt-1">
                {((totalPayeCoop / totalDuCoop) * 100).toFixed(1)}% des droits réglés
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <span className="text-xs font-bold text-stone-500 block uppercase">Reste à Payer (Solde)</span>
              <span className="text-xl font-black text-amber-700">
                {totalResteCoop.toLocaleString()} FCFA
              </span>
              <span className="text-xs text-stone-500 block mt-1">Trésorerie engagée pour décaissement</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-200">
              <h2 className="text-sm font-bold text-stone-900">
                Balance Individuelle des Coopérateurs (Règle de Gestion RG-010)
              </h2>
              <p className="text-xs text-stone-500">
                Formule : Volume livré × Prix applicable = Montant dû au membre.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Code & Membre</th>
                    <th className="py-3 px-4">Localité / Commune</th>
                    <th className="py-3 px-4">Filières</th>
                    <th className="py-3 px-4 text-center">Volume Livré</th>
                    <th className="py-3 px-4 text-right">Montant Dû</th>
                    <th className="py-3 px-4 text-right">Déjà Réglé</th>
                    <th className="py-3 px-4 text-right">Reste à Payer</th>
                    <th className="py-3 px-4 text-center">Parts Sociales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {memberBalances.map((m) => (
                    <tr key={m.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] font-bold text-stone-600 block">{m.code}</span>
                        <strong className="text-stone-900 text-sm">{m.nom} {m.prenom}</strong>
                      </td>
                      <td className="py-3.5 px-4 text-stone-700">
                        {m.village} ({m.commune})
                      </td>
                      <td className="py-3.5 px-4 text-stone-700 font-medium">{m.activitePrincipale}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-stone-900">
                        {m.totalLivreKg > 0 ? `${(m.totalLivreKg / 1000).toFixed(1)} t` : '0 t'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-stone-900">
                        {m.totalDuFCFA.toLocaleString()} FCFA
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                        {m.totalPayeFCFA.toLocaleString()} FCFA
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-amber-700">
                        {m.resteAPayerFCFA === 0 ? (
                          <span className="text-emerald-700">0 FCFA</span>
                        ) : (
                          `${m.resteAPayerFCFA.toLocaleString()} FCFA`
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-medium text-stone-600">
                        {m.partsSocialesFCFA.toLocaleString()} FCFA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Trésorerie */}
      {activeTab === 'tresorerie' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Structure de Trésorerie & Compte d'Exploitation Prévisionnel
            </h2>
            <p className="text-xs text-stone-500">
              Synthèse consolidée des flux financiers en Francs CFA pour l'exercice 2026.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-stone-200 bg-emerald-50/50">
              <span className="text-xs font-bold text-emerald-800 uppercase block">Total Recettes d'Exploitation</span>
              <span className="text-2xl font-black text-emerald-950 mt-1 block">83 550 000 FCFA</span>
              <p className="text-xs text-emerald-800 mt-2">Ventes céréales, découpe, volailles et farine</p>
            </div>
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
              <span className="text-xs font-bold text-stone-600 uppercase block">Total Achats & Rémunération Membres</span>
              <span className="text-2xl font-black text-stone-900 mt-1 block">38 182 000 FCFA</span>
              <p className="text-xs text-stone-500 mt-2">Paiement garanti des productions apportées</p>
            </div>
            <div className="p-4 rounded-xl border border-stone-200 bg-blue-50/50">
              <span className="text-xs font-bold text-blue-800 uppercase block">Trésorerie Disponible (Banque & Caisse)</span>
              <span className="text-2xl font-black text-blue-950 mt-1 block">31 420 000 FCFA</span>
              <p className="text-xs text-blue-800 mt-2">Solvabilité immédiate pour campagnes futures</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

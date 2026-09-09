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
  Plus,
  X,
} from 'lucide-react';
import { VENTES_DATA, COLLECTES_DATA } from '../data/coopData';
import { useApp } from '../context/AppContext';
import { VenteCommande } from '../types';

interface CommercialFinanceModuleProps {
  initialTab?: 'ventes' | 'cooperateurs' | 'tresorerie';
}

export const CommercialFinanceModule: React.FC<CommercialFinanceModuleProps> = ({ initialTab = 'ventes' }) => {
  const { membres, addMembre } = useApp();
  const [activeTab, setActiveTab] = useState<'ventes' | 'cooperateurs' | 'tresorerie'>(initialTab);
  const [ventesList, setVentesList] = useState<VenteCommande[]>(VENTES_DATA);

  // Modals & Toast State
  const [isAddVenteModalOpen, setIsAddVenteModalOpen] = useState(false);
  const [isAddMembreModalOpen, setIsAddMembreModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Vente form state
  const [venteForm, setVenteForm] = useState({
    clientNom: 'SOKAPRO Yaoundé',
    typeClient: 'Agro-industrie & Minoterie',
    produits: 'Maïs Grain nettoyé Grade A (40 t)',
    quantiteTonnes: 40,
    montantTotalFCFA: 14000000,
    statutLivraison: 'En préparation' as 'Livré & Conforme' | 'En cours de livraison' | 'En préparation',
    statutReglement: 'Acompte 50%' as 'Réglé' | 'Acompte 50%' | 'En attente',
  });

  // New Membre form state
  const [membreForm, setMembreForm] = useState({
    nom: '',
    prenom: '',
    sexe: 'M' as 'M' | 'F',
    commune: 'Obala',
    specialite: 'Polyculture Maïs / Manioc',
    partsSocialesFCFA: 50000,
    cotisationAnnuelleFCFA: 15000,
    telephone: '+237 6',
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateVente = (e: React.FormEvent) => {
    e.preventDefault();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newVente: VenteCommande = {
      id: `VNT-${Date.now().toString().slice(-4)}`,
      codeCommande: `CMD-2026-${randomSuffix}`,
      date: new Date().toISOString().split('T')[0],
      clientNom: venteForm.clientNom,
      typeClient: venteForm.typeClient,
      produits: venteForm.produits,
      quantiteTonnes: Number(venteForm.quantiteTonnes),
      montantTotalFCFA: Number(venteForm.montantTotalFCFA),
      statutLivraison: venteForm.statutLivraison,
      statutReglement: venteForm.statutReglement,
    };
    setVentesList((prev) => [newVente, ...prev]);
    setIsAddVenteModalOpen(false);
    triggerToast(`Commande ${newVente.codeCommande} pour ${venteForm.clientNom} créée avec succès !`);
  };

  const handleCreateMembre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!membreForm.nom) return;
    const randomNum = Math.floor(100 + Math.random() * 900);
    addMembre({
      code: `MEM-${randomNum}`,
      nom: membreForm.nom.toUpperCase(),
      prenom: membreForm.prenom,
      sexe: membreForm.sexe,
      commune: membreForm.commune,
      specialite: membreForm.specialite,
      superficieExploiteeHa: 4.5,
      dateAdhesion: new Date().toISOString().split('T')[0],
      partsSocialesFCFA: Number(membreForm.partsSocialesFCFA),
      cotisationAnnuelleFCFA: Number(membreForm.cotisationAnnuelleFCFA),
      telephone: membreForm.telephone,
      statut: 'Actif',
    });
    setIsAddMembreModalOpen(false);
    triggerToast(`Membre coopérateur ${membreForm.nom} ${membreForm.prenom} adhéré avec succès !`);
  };

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Compute cooperative balance
  const memberBalances = membres.map((membre) => {
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

  const totalVentes = ventesList.reduce((sum, v) => sum + v.montantTotalFCFA, 0);
  const totalEncaisse = ventesList.filter((v) => v.statutReglement === 'Réglé').reduce(
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
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('ventes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ventes'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Commandes & Ventes Clients ({ventesList.length})</span>
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

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          {activeTab === 'ventes' && (
            <button
              onClick={() => setIsAddVenteModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Créer une nouvelle commande ou contrat de vente"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nouvelle Vente / Commande</span>
            </button>
          )}

          {activeTab === 'cooperateurs' && (
            <button
              onClick={() => setIsAddMembreModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Enregistrer l'adhésion d'un nouveau membre coopérateur"
            >
              <Plus className="w-4 h-4" />
              <span>+ Adhérer Nouveau Membre</span>
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
                  {ventesList.map((v) => (
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

      {/* MODAL: Nouvelle Vente / Commande */}
      {isAddVenteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Nouvelle Commande / Contrat de Vente</h3>
                  <p className="text-xs text-slate-500">Enregistrement client, volume et conditions de règlement</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddVenteModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVente} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nom du Client</label>
                  <input
                    type="text"
                    required
                    value={venteForm.clientNom}
                    onChange={(e) => setVenteForm({ ...venteForm, clientNom: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Profil Client</label>
                  <select
                    value={venteForm.typeClient}
                    onChange={(e) => setVenteForm({ ...venteForm, typeClient: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Agro-industrie & Minoterie">Agro-industrie & Minoterie</option>
                    <option value="Grossiste Marché Yaoundé">Grossiste Marché Yaoundé</option>
                    <option value="Chaîne Hôtelière & Restauration">Chaîne Hôtelière & Restauration</option>
                    <option value="Supermarché & Distribution">Supermarché & Distribution</option>
                    <option value="Institutionnel & Cantines">Institutionnel & Cantines</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Désignation Produits Vendus</label>
                <input
                  type="text"
                  required
                  value={venteForm.produits}
                  onChange={(e) => setVenteForm({ ...venteForm, produits: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Volume Total (Tonnes)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    min="0.1"
                    value={venteForm.quantiteTonnes}
                    onChange={(e) => setVenteForm({ ...venteForm, quantiteTonnes: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Montant Total Facturé (FCFA)</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={venteForm.montantTotalFCFA}
                    onChange={(e) => setVenteForm({ ...venteForm, montantTotalFCFA: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Statut Livraison</label>
                  <select
                    value={venteForm.statutLivraison}
                    onChange={(e) =>
                      setVenteForm({
                        ...venteForm,
                        statutLivraison: e.target.value as any,
                      })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="En préparation">En préparation en magasin</option>
                    <option value="En cours de livraison">En cours d'acheminement</option>
                    <option value="Livré & Conforme">Livré & Réceptionné conforme</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Statut Règlement</label>
                  <select
                    value={venteForm.statutReglement}
                    onChange={(e) =>
                      setVenteForm({
                        ...venteForm,
                        statutReglement: e.target.value as any,
                      })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Acompte 50%">Acompte 50% versé</option>
                    <option value="Réglé">Entièrement Réglé</option>
                    <option value="En attente">En attente (créance à 30j)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddVenteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Valider la Commande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Adhérer Nouveau Membre */}
      {isAddMembreModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Adhésion d'un Nouveau Membre Coopérateur</h3>
                  <p className="text-xs text-slate-500">Souscription des parts sociales et enregistrement OHADA</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddMembreModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMembre} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nom de famille</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: EYEBE"
                    value={membreForm.nom}
                    onChange={(e) => setMembreForm({ ...membreForm, nom: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Prénom(s)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Paul Martin"
                    value={membreForm.prenom}
                    onChange={(e) => setMembreForm({ ...membreForm, prenom: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Sexe</label>
                  <select
                    value={membreForm.sexe}
                    onChange={(e) => setMembreForm({ ...membreForm, sexe: e.target.value as 'M' | 'F' })}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Commune</label>
                  <select
                    value={membreForm.commune}
                    onChange={(e) => setMembreForm({ ...membreForm, commune: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Obala">Obala</option>
                    <option value="Mbalmayo">Mbalmayo</option>
                    <option value="Sa’a">Sa’a</option>
                    <option value="Bafia">Bafia</option>
                    <option value="Soa">Soa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Téléphone</label>
                  <input
                    type="text"
                    required
                    value={membreForm.telephone}
                    onChange={(e) => setMembreForm({ ...membreForm, telephone: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Activité Principale / Spécialité</label>
                <select
                  value={membreForm.specialite}
                  onChange={(e) => setMembreForm({ ...membreForm, specialite: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Polyculture Maïs / Manioc">Polyculture Maïs / Manioc</option>
                  <option value="Élevage Bovin & Embouche">Élevage Bovin & Embouche</option>
                  <option value="Aviculture Chair & Pondeuses">Aviculture Chair & Pondeuses</option>
                  <option value="Porciculture">Porciculture</option>
                  <option value="Maraîchage intensif">Maraîchage intensif</option>
                  <option value="Pisciculture & Aquaculture">Pisciculture & Aquaculture</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Souscription Parts Sociales (FCFA)</label>
                  <input
                    type="number"
                    min="10000"
                    step="5000"
                    value={membreForm.partsSocialesFCFA}
                    onChange={(e) => setMembreForm({ ...membreForm, partsSocialesFCFA: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Cotisation Annuelle (FCFA)</label>
                  <input
                    type="number"
                    min="5000"
                    step="1000"
                    value={membreForm.cotisationAnnuelleFCFA}
                    onChange={(e) =>
                      setMembreForm({ ...membreForm, cotisationAnnuelleFCFA: Number(e.target.value) })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddMembreModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Enregistrer l'Adhésion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

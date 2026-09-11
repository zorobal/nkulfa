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
  Globe,
  MapPin,
  Briefcase,
  Search,
  Filter,
  Eye,
  Info,
  Phone,
  Tag,
  Check,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { VENTES_DATA, COLLECTES_DATA } from '../data/coopData';
import { useApp } from '../context/AppContext';
import { VenteCommande, Membre } from '../types';

interface CommercialFinanceModuleProps {
  initialTab?: 'ventes' | 'cooperateurs' | 'tresorerie';
}

const SUGGESTIONS_COMMUNES = [
  'Obala',
  'Mbalmayo',
  'Sa’a',
  'Bafia',
  'Soa',
  'Monatélé',
  'Ngoumou',
  'Batchenga',
  'Okola',
  'Evodoula',
  'Bokito',
  'Makénéné',
  'Ntui',
  'Ayos',
  'Akonolinga',
  'Mfou',
  'Yaoundé 1er',
  'Yaoundé 2e',
  'Yaoundé 3e',
  'Yaoundé 4e',
  'Yaoundé 5e',
  'Yaoundé 6e',
  'Yaoundé 7e',
  'Douala 1er',
  'Douala 2e',
  'Douala 3e',
  'Douala 4e',
  'Douala 5e',
  'Ebolowa',
  'Sangmélima',
  'Kribi 1er',
  'Bafoussam 1er',
  'Bertoua 1er',
  'Ngaoundéré 1er',
  'Garoua 1er',
  'Maroua 1er',
];

const SUGGESTIONS_VILLES = [
  'Yaoundé',
  'Douala',
  'Obala',
  'Mbalmayo',
  'Bafia',
  'Sa’a',
  'Soa',
  'Monatélé',
  'Ebolowa',
  'Sangmélima',
  'Kribi',
  'Bafoussam',
  'Bertoua',
  'Ngaoundéré',
  'Garoua',
  'Maroua',
  'Bamenda',
  'Buea',
  'Limbe',
];

const SUGGESTIONS_PAYS = [
  'Cameroun',
  'Tchad',
  'Centrafrique (RCA)',
  'Gabon',
  'Congo',
  'Guinée Équatoriale',
  'Nigeria',
  'Côte d’Ivoire',
  'Sénégal',
  'France',
  'Belgique',
  'Canada',
];

const DOMAINES_ACTIVITE = [
  { id: 'agropastoral', label: '🌱 Agro-pastoral (Agriculture, Élevage & Pêche)', badge: 'Agro-pastoral' },
  { id: 'transformation', label: '🏭 Transformation & Agro-industrie (Meunerie, séchage, conditionnement)', badge: 'Transformation' },
  { id: 'transport', label: '🚚 Transport, Fret & Logistique Rurale', badge: 'Logistique & Fret' },
  { id: 'commerce', label: '🛒 Commerce, Négoce & Distribution d’intrants', badge: 'Commerce & Négoce' },
  { id: 'artisanat', label: '🔧 Artisanat, Mécanique & Outillage Agricole', badge: 'Artisanat & Mécanique' },
  { id: 'services', label: '💼 Prestations de Services, Conseil & Gestion', badge: 'Prestations & Conseil' },
  { id: 'foncier', label: '💰 Bailleur Foncier & Investisseur Associé', badge: 'Foncier & Finance' },
  { id: 'autre', label: '🌐 Autre secteur d’activité économique', badge: 'Autre secteur' },
];

const SUGGESTIONS_ACTIVITES = [
  // Agro-pastoral
  'Polyculture Maïs / Manioc / Vivriers',
  'Élevage Bovin & Embouche pastorale',
  'Aviculture Chair & Pondeuses',
  'Porciculture moderne',
  'Maraîchage intensif (Tomates, Piments, Oignons)',
  'Pisciculture & Aquaculture en bacs/étangs',
  'Apiculture moderne & Miel de forêt',
  'Cacaoculture & Caféiculture',
  'Banane Plantain & Arboriculture fruitière',
  'Héliciculture & Petit élevage',
  // Non agro-pastoral
  'Transport de récoltes & fret routier rural',
  'Usinage, meunerie de céréales & cossettes de manioc',
  'Commerce de gros, collecte & négoce bord-champ',
  'Distribution d’intrants agricoles, engrais & semences',
  'Mécanique d’engins, soudure & réparation de motopompes/tracteurs',
  'Prestation de labours mécanisés, hersage & moisson',
  'Mise à disposition de terres arables (Bailleur foncier)',
  'Conseil agronomique, vétérinaire ou comptabilité rurale',
  'Stockage, séchage & ensachage certifié',
  'Conditionnement & emballage alimentaire',
];

export const CommercialFinanceModule: React.FC<CommercialFinanceModuleProps> = ({ initialTab = 'ventes' }) => {
  const { membres, addMembre } = useApp();
  const [activeTab, setActiveTab] = useState<'ventes' | 'cooperateurs' | 'tresorerie'>(initialTab);
  const [ventesList, setVentesList] = useState<VenteCommande[]>(VENTES_DATA);

  // Modals & Toast State
  const [isAddVenteModalOpen, setIsAddVenteModalOpen] = useState(false);
  const [isAddMembreModalOpen, setIsAddMembreModalOpen] = useState(false);
  const [selectedMembreDetail, setSelectedMembreDetail] = useState<Membre | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters for cooperateurs tab
  const [membreSearch, setMembreSearch] = useState('');
  const [domaineFilter, setDomaineFilter] = useState('all');

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

  // New Membre form state - enriched with Ville, Pays, non-locked Commune, non-locked Activité/Spécialité
  const [membreForm, setMembreForm] = useState({
    nom: '',
    prenom: '',
    sexe: 'M' as 'M' | 'F',
    telephone: '+237 6',
    pays: 'Cameroun',
    ville: 'Yaoundé',
    commune: 'Obala',
    village: '',
    domaineActivite: 'Agro-pastoral (Agriculture, Élevage & Pêche)',
    activitePrincipale: 'Polyculture Maïs / Manioc / Vivriers',
    specialite: '',
    partsSocialesFCFA: 50000,
    cotisationAnnuelleFCFA: 15000,
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
    if (!membreForm.nom.trim()) return;

    const randomNum = Math.floor(100 + Math.random() * 900);
    const communeVal = membreForm.commune.trim() || 'Non renseignée';
    const villeVal = membreForm.ville.trim() || 'Non renseignée';
    const paysVal = membreForm.pays.trim() || 'Cameroun';
    const activiteVal = membreForm.activitePrincipale.trim() || membreForm.domaineActivite;

    addMembre({
      code: `NKF-M-${randomNum}`,
      nom: membreForm.nom.trim().toUpperCase(),
      prenom: membreForm.prenom.trim(),
      sexe: membreForm.sexe,
      telephone: membreForm.telephone.trim(),
      village: membreForm.village.trim() || undefined,
      commune: communeVal,
      ville: villeVal,
      pays: paysVal,
      region: paysVal.toLowerCase().includes('cameroun') ? 'Centre' : 'International / Diaspora',
      dateAdhesion: new Date().toISOString().split('T')[0],
      statut: 'Nouveau',
      domaineActivite: membreForm.domaineActivite,
      activitePrincipale: activiteVal,
      specialite: membreForm.specialite.trim() || activiteVal,
      superficieTotaleHa: 0,
      effectifCheptelTotal: 0,
      partsSocialesFCFA: Number(membreForm.partsSocialesFCFA) || 50000,
      cotisationAnnuelleFCFA: Number(membreForm.cotisationAnnuelleFCFA) || 15000,
      cotisationsAJour: true,
    });

    setIsAddMembreModalOpen(false);
    triggerToast(
      `Membre coopérateur ${membreForm.nom.toUpperCase()} ${membreForm.prenom} (${communeVal}, ${villeVal} - ${paysVal}) adhéré avec succès !`
    );

    // Reset form
    setMembreForm({
      nom: '',
      prenom: '',
      sexe: 'M',
      telephone: '+237 6',
      pays: 'Cameroun',
      ville: 'Yaoundé',
      commune: 'Obala',
      village: '',
      domaineActivite: 'Agro-pastoral (Agriculture, Élevage & Pêche)',
      activitePrincipale: '',
      specialite: '',
      partsSocialesFCFA: 50000,
      cotisationAnnuelleFCFA: 15000,
    });
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
      ville: membre.ville || membre.commune || 'Yaoundé',
      pays: membre.pays || 'Cameroun',
      domaineActivite: membre.domaineActivite || 'Agro-pastoral',
      specialite: membre.specialite || membre.activitePrincipale,
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
                {totalDuCoop > 0 ? ((totalPayeCoop / totalDuCoop) * 100).toFixed(1) : '0'}% des droits réglés
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
            {/* Header with Search and Sector Filter */}
            <div className="p-4 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-stone-900">
                    Registre & Balance Individuelle des Coopérateurs
                  </h2>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {membres.length} membres
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Ouvert à tous les secteurs : producteurs, éleveurs, transformateurs, transporteurs, commerçants & artisans.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Recherche (nom, ville, commune, pays, métier)..."
                    value={membreSearch}
                    onChange={(e) => setMembreSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-64"
                  />
                  {membreSearch && (
                    <button
                      onClick={() => setMembreSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                <select
                  value={domaineFilter}
                  onChange={(e) => setDomaineFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-xl border border-stone-300 bg-white text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                >
                  <option value="all">Tous les secteurs d’activité</option>
                  <option value="agropastoral">🌱 Agro-pastoral (Agriculture/Élevage)</option>
                  <option value="transformation">🏭 Transformation & Meunerie</option>
                  <option value="transport">🚚 Transport & Logistique</option>
                  <option value="commerce">🛒 Commerce & Négoce</option>
                  <option value="artisanat">🔧 Artisanat & Mécanique</option>
                  <option value="foncier">💰 Bailleur Foncier & Finance</option>
                </select>

                <button
                  onClick={() => setIsAddMembreModalOpen(true)}
                  className="bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nouvel Adhérent
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Code & Adhérent</th>
                    <th className="py-3 px-4">Territoire (Commune, Ville, Pays)</th>
                    <th className="py-3 px-4">Secteur & Activité / Spécialité</th>
                    <th className="py-3 px-4 text-center">Volume Livré</th>
                    <th className="py-3 px-4 text-right">Montant Dû</th>
                    <th className="py-3 px-4 text-right">Déjà Réglé</th>
                    <th className="py-3 px-4 text-right">Reste à Payer</th>
                    <th className="py-3 px-4 text-center">Parts Sociales</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {memberBalances
                    .filter((m) => {
                      const query = membreSearch.toLowerCase().trim();
                      const matchesQuery =
                        !query ||
                        `${m.nom} ${m.prenom} ${m.code} ${m.commune} ${m.ville} ${m.pays} ${m.activitePrincipale} ${m.specialite || ''}`
                          .toLowerCase()
                          .includes(query);
                      const matchesDomaine =
                        domaineFilter === 'all' ||
                        (m.domaineActivite && m.domaineActivite.toLowerCase().includes(domaineFilter.toLowerCase())) ||
                        (m.activitePrincipale && m.activitePrincipale.toLowerCase().includes(domaineFilter.toLowerCase()));
                      return matchesQuery && matchesDomaine;
                    })
                    .map((m) => {
                      // Badge color helper for domain
                      const domainLower = (m.domaineActivite || '').toLowerCase();
                      let badgeColor = 'bg-stone-100 text-stone-700 border-stone-200';
                      if (domainLower.includes('agro') || domainLower.includes('pastoral') || domainLower.includes('bovin')) {
                        badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                      } else if (domainLower.includes('transformation') || domainLower.includes('meunerie')) {
                        badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
                      } else if (domainLower.includes('transport') || domainLower.includes('logistique')) {
                        badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';
                      } else if (domainLower.includes('commerce') || domainLower.includes('négoce')) {
                        badgeColor = 'bg-indigo-50 text-indigo-800 border-indigo-200';
                      } else if (domainLower.includes('artisanat') || domainLower.includes('mécanique')) {
                        badgeColor = 'bg-orange-50 text-orange-800 border-orange-200';
                      } else if (domainLower.includes('foncier') || domainLower.includes('investiss')) {
                        badgeColor = 'bg-purple-50 text-purple-800 border-purple-200';
                      }

                      return (
                        <tr key={m.id} className="hover:bg-stone-50 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono text-[11px] font-bold text-emerald-700 block">{m.code}</span>
                            <strong className="text-stone-900 text-xs block">
                              {m.nom} {m.prenom}
                            </strong>
                            <span className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                              <Phone className="w-2.5 h-2.5" />
                              {m.telephone}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 font-semibold text-stone-900">
                              <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                              <span>{m.commune}, {m.ville}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                              <Globe className="w-2.5 h-2.5 text-stone-400 shrink-0" />
                              <span>{m.pays || 'Cameroun'}</span>
                              {m.village && <span className="text-stone-400">• {m.village}</span>}
                            </div>
                          </td>
                          <td className="py-3 px-4 max-w-xs">
                            <span
                              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border mb-1 ${badgeColor}`}
                            >
                              {m.domaineActivite || 'Agro-pastoral'}
                            </span>
                            <strong className="text-stone-900 block text-xs truncate">
                              {m.activitePrincipale}
                            </strong>
                            {m.specialite && m.specialite !== m.activitePrincipale && (
                              <span className="text-[11px] text-stone-500 block truncate">
                                {m.specialite}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-stone-900">
                            {m.totalLivreKg > 0 ? `${(m.totalLivreKg / 1000).toFixed(1)} t` : '0 t'}
                          </td>
                          <td className="py-3 px-4 text-right font-black text-stone-900">
                            {m.totalDuFCFA.toLocaleString()} FCFA
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-700">
                            {m.totalPayeFCFA.toLocaleString()} FCFA
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-amber-700">
                            {m.resteAPayerFCFA === 0 ? (
                              <span className="text-emerald-700 font-semibold">0 FCFA</span>
                            ) : (
                              `${m.resteAPayerFCFA.toLocaleString()} FCFA`
                            )}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-medium text-stone-600">
                            {m.partsSocialesFCFA.toLocaleString()} FCFA
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => setSelectedMembreDetail(m)}
                              title="Consulter la fiche adhérent complète"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-bold transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              Fiche
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Adhésion d'un Nouveau Membre Coopérateur
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ouvert à tous secteurs : agro-pastoral, logistique, transformation, commerce, outillage & artisanat
                  </p>
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
              {/* SECTION 1: Identité */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  1. Identité Personnelle
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Nom de famille <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: EYEBE"
                      value={membreForm.nom}
                      onChange={(e) => setMembreForm({ ...membreForm, nom: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Prénom(s) <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Paul Martin"
                      value={membreForm.prenom}
                      onChange={(e) => setMembreForm({ ...membreForm, prenom: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Sexe</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setMembreForm({ ...membreForm, sexe: 'M' })}
                        className={`flex-1 py-2 rounded-xl border font-bold text-center transition-colors ${
                          membreForm.sexe === 'M'
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        Masculin (M)
                      </button>
                      <button
                        type="button"
                        onClick={() => setMembreForm({ ...membreForm, sexe: 'F' })}
                        className={`flex-1 py-2 rounded-xl border font-bold text-center transition-colors ${
                          membreForm.sexe === 'F'
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        Féminin (F)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Numéro de Téléphone <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+237 6XX XX XX XX"
                      value={membreForm.telephone}
                      onChange={(e) => setMembreForm({ ...membreForm, telephone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Localisation Géographique (Pays, Ville, Commune non figée) */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    2. Localisation Géographique & Territoire
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    Champs entièrement libres & ouverts
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* PAYS */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Pays <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      list="pays-suggestions-list"
                      placeholder="Ex: Cameroun, Tchad, RCA, Gabon, France..."
                      value={membreForm.pays}
                      onChange={(e) => setMembreForm({ ...membreForm, pays: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                    />
                    <datalist id="pays-suggestions-list">
                      {SUGGESTIONS_PAYS.map((p) => (
                        <option key={p} value={p} />
                      ))}
                    </datalist>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {['Cameroun', 'Tchad', 'Centrafrique (RCA)', 'Gabon', 'Congo', 'France'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setMembreForm({ ...membreForm, pays: p })}
                          className={`text-[10px] px-2 py-0.5 rounded-md border font-medium transition-colors ${
                            membreForm.pays === p
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* VILLE */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Ville <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      list="villes-suggestions-list"
                      placeholder="Ex: Yaoundé, Douala, Obala, Mbalmayo, Bafia..."
                      value={membreForm.ville}
                      onChange={(e) => setMembreForm({ ...membreForm, ville: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                    />
                    <datalist id="villes-suggestions-list">
                      {SUGGESTIONS_VILLES.map((v) => (
                        <option key={v} value={v} />
                      ))}
                    </datalist>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {['Yaoundé', 'Douala', 'Obala', 'Mbalmayo', 'Bafia', 'Sa’a', 'Soa'].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setMembreForm({ ...membreForm, ville: v })}
                          className={`text-[10px] px-2 py-0.5 rounded-md border font-medium transition-colors ${
                            membreForm.ville === v
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* COMMUNE - NON FIGÉE */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-700 font-bold">
                        Commune <span className="text-rose-600">*</span>
                      </label>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                        Non figée (Saisie libre)
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      list="communes-suggestions-list"
                      placeholder="Tapez librement votre commune ou choisissez..."
                      value={membreForm.commune}
                      onChange={(e) => setMembreForm({ ...membreForm, commune: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-bold text-slate-800"
                    />
                    <datalist id="communes-suggestions-list">
                      {SUGGESTIONS_COMMUNES.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>

                    <p className="text-[10px] text-slate-500 mt-1">
                      💡 Vous pouvez saisir le nom de <strong>n'importe quelle commune</strong> ou cliquer une suggestion :
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {['Obala', 'Soa', 'Mbalmayo', 'Sa’a', 'Bafia', 'Monatélé', 'Ngoumou', 'Batchenga'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setMembreForm({ ...membreForm, commune: c })}
                          className={`text-[10px] px-2 py-0.5 rounded-md border font-medium transition-colors ${
                            membreForm.commune === c
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* VILLAGE / QUARTIER / ADRESSE */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Village / Quartier / Adresse locale
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Obala Centre, Chefferie Sa’a, Quartier Résidentiel..."
                      value={membreForm.village}
                      onChange={(e) => setMembreForm({ ...membreForm, village: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Facultatif : permet de situer précisément les parcelles ou le siège d'activité du membre.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Secteur, Activité Principale & Spécialité (NON FIGÉE) */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                    3. Secteur d'Activité, Métier & Spécialité
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                    Tous profils acceptés
                  </span>
                </div>

                <div className="bg-amber-50/70 border border-amber-200/80 p-2.5 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                  <strong>ℹ️ Statut Coopératif OHADA :</strong> Un adhérent n'est pas obligatoirement agriculteur ou éleveur.
                  La coopérative accueille des <strong>transporteurs</strong>, <strong>transformateurs (meunerie)</strong>,
                  <strong>commerçants / collecteurs</strong>, <strong>artisans mécaniciens</strong>, <strong>prestataires</strong> et <strong>bailleurs fonciers</strong>.
                  La spécialité est 100% personnalisable.
                </div>

                {/* DOMAINE D'ACTIVITÉ */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Secteur / Domaine d'Activité
                  </label>
                  <select
                    value={membreForm.domaineActivite}
                    onChange={(e) => setMembreForm({ ...membreForm, domaineActivite: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                  >
                    {DOMAINES_ACTIVITE.map((d) => (
                      <option key={d.id} value={d.label}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ACTIVITÉ PRINCIPALE (SAISIE LIBRE + SUGGESTIONS) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-bold">
                      Activité Principale / Métier <span className="text-rose-600">*</span>
                    </label>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      Saisie libre ou suggestion
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    list="activites-suggestions-list"
                    placeholder="Ex: Transport routier de vivres, Meunerie & Ensachage, Maraîchage, Porciculture..."
                    value={membreForm.activitePrincipale}
                    onChange={(e) => setMembreForm({ ...membreForm, activitePrincipale: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-bold text-slate-800"
                  />
                  <datalist id="activites-suggestions-list">
                    {SUGGESTIONS_ACTIVITES.map((act) => (
                      <option key={act} value={act} />
                    ))}
                  </datalist>
                  <p className="text-[10px] text-slate-500 mt-1">
                    💡 Tapez le métier exact du coopérateur. Suggestions rapides :
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {[
                      'Polyculture Maïs / Manioc',
                      'Élevage Bovin & Embouche',
                      'Aviculture Chair & Pondeuses',
                      'Transport & Fret de récoltes',
                      'Usinage & Meunerie',
                      'Commerce & Négoce bord-champ',
                      'Artisanat & Mécanique agricole',
                    ].map((act) => (
                      <button
                        key={act}
                        type="button"
                        onClick={() => setMembreForm({ ...membreForm, activitePrincipale: act })}
                        className={`text-[10px] px-2 py-0.5 rounded-md border font-medium transition-colors ${
                          membreForm.activitePrincipale === act
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SPÉCIALITÉ / DÉTAILS TECHNIQUES (SAISIE LIBRE) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-bold">
                      Spécialité & Précisions Techniques
                    </label>
                    <span className="text-[10px] text-slate-500">
                      Entièrement libre & personnalisable
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Ex: Flotte 3 camions bennes 10t, Farine panifiable certifiée, Semences IRAD 8034, Embouche zébus Goudali..."
                    value={membreForm.specialite}
                    onChange={(e) => setMembreForm({ ...membreForm, specialite: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Indiquez ici les détails d'intervention : capacités de charge, variétés, équipements ou race élevée.
                  </p>
                </div>
              </div>

              {/* SECTION 4: Souscription Financière OHADA */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  4. Souscription Financière & Droits Sociaux
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Parts Sociales Souscrites (FCFA)
                    </label>
                    <input
                      type="number"
                      min="10000"
                      step="5000"
                      value={membreForm.partsSocialesFCFA}
                      onChange={(e) =>
                        setMembreForm({ ...membreForm, partsSocialesFCFA: Number(e.target.value) })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Min. légal : 10 000 FCFA (Capital social coopératif)
                    </span>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Cotisation Annuelle de Fonctionnement (FCFA)
                    </label>
                    <input
                      type="number"
                      min="5000"
                      step="1000"
                      value={membreForm.cotisationAnnuelleFCFA}
                      onChange={(e) =>
                        setMembreForm({ ...membreForm, cotisationAnnuelleFCFA: Number(e.target.value) })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Frais de fonctionnement annuel coopératif
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddMembreModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Enregistrer l'Adhérent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Fiche Détaillée de l'Adhérent */}
      {selectedMembreDetail && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                  {selectedMembreDetail.code.split('-').pop()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedMembreDetail.nom} {selectedMembreDetail.prenom}
                    </h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {selectedMembreDetail.statut}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">
                    Matricule : {selectedMembreDetail.code} • Adhésion : {selectedMembreDetail.dateAdhesion}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMembreDetail(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-3 text-xs">
              {/* Localisation block */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Localisation & Territoire
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Pays :</span>
                    <strong className="text-sm">{selectedMembreDetail.pays || 'Cameroun'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Ville :</span>
                    <strong className="text-sm">{selectedMembreDetail.ville || 'Obala'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Commune :</span>
                    <strong className="text-sm text-emerald-800">{selectedMembreDetail.commune}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Village / Localité :</span>
                    <strong>{selectedMembreDetail.village || 'Non renseigné'}</strong>
                  </div>
                </div>
              </div>

              {/* Secteur & Métier block */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                  Secteur d'Activité & Spécialité
                </span>
                <div className="space-y-2 text-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Domaine :</span>
                    <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 text-xs">
                      {selectedMembreDetail.domaineActivite || 'Agro-pastoral'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Activité Principale :</span>
                    <strong className="text-sm text-slate-900">{selectedMembreDetail.activitePrincipale}</strong>
                  </div>
                  {selectedMembreDetail.specialite && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Spécialité & Précisions :</span>
                      <p className="text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                        {selectedMembreDetail.specialite}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact & Finances */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  Contact & Situation Financière
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Téléphone :</span>
                    <strong className="font-mono text-emerald-800">{selectedMembreDetail.telephone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Sexe :</span>
                    <strong>{selectedMembreDetail.sexe === 'M' ? 'Masculin' : 'Féminin'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Parts Sociales :</span>
                    <strong className="font-mono text-slate-900">
                      {selectedMembreDetail.partsSocialesFCFA.toLocaleString()} FCFA
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Cotisations :</span>
                    <span className="font-bold text-emerald-700">
                      À jour ({selectedMembreDetail.cotisationAnnuelleFCFA?.toLocaleString() || '15 000'} FCFA/an)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedMembreDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

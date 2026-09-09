import React, { useState } from 'react';
import { NavigationTab } from '../../types';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Wheat,
  TrendingUp,
  Beef,
  HeartPulse,
  Warehouse,
  ShoppingBag,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  HelpCircle,
  Clock,
  Sparkles,
  UserCheck,
  ChevronRight,
  Layers,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface WorkflowGuideProps {
  onNavigateToTab: (tab: NavigationTab) => void;
}

export const WorkflowGuideModule: React.FC<WorkflowGuideProps> = ({ onNavigateToTab }) => {
  const { currentUser, config } = useApp();
  const [activeView, setActiveView] = useState<'cycle' | 'roles' | 'actions' | 'regles'>('cycle');
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [selectedRole, setSelectedRole] = useState<string>('direction');

  // Cycle de Vie Coopérative en 7 étapes séquentielles
  const lifecycleSteps = [
    {
      step: 1,
      id: 'terrains_parcelles' as NavigationTab,
      title: '1. Foncier, Adhésions & Découpage Parcellaire',
      subtitle: 'La base du modèle de données (Terrain → Parcelle → Lot)',
      icon: MapPin,
      color: 'bg-emerald-600 text-white',
      badge: 'Foncier & SIG',
      description:
        "Toute activité commence par l'adhésion d'un membre coopérateur et l'enregistrement de ses parcelles géoréférencées (GPS, superficie, type de sol).",
      actions: [
        {
          action: 'Créer un nouveau membre',
          screen: 'Membres & Exploitations',
          tab: 'membres' as NavigationTab,
          btn: '+ Nouveau Membre',
          details: 'Renseignez civilité, CNI, téléphone, village et nombre de parts sociales (parts libérées).',
        },
        {
          action: 'Enregistrer un terrain et ses parcelles',
          screen: 'Terrains & Parcelles',
          tab: 'terrains_parcelles' as NavigationTab,
          btn: '+ Nouvelle Parcelle',
          details: 'Associez la parcelle à un membre, définissez les coordonnées GPS, la superficie (ha) et la fertilité du sol.',
        },
      ],
      tips: 'Règle RG-001 : Une parcelle doit obligatoirement être rattachée à un terrain et à un membre actif en règle de cotisation.',
    },
    {
      step: 2,
      id: 'agriculture' as NavigationTab,
      title: '2. Planification Agricole & Suivi Cultural',
      subtitle: 'Gestion des campagnes, prévisions et travaux aux champs',
      icon: Wheat,
      color: 'bg-amber-600 text-white',
      badge: 'Pôle Végétal',
      description:
        "Le responsable agricole configure la campagne active, attribue les variétés homologuées aux parcelles et suit au jour le jour les opérations culturales.",
      actions: [
        {
          action: 'Sélectionner la campagne et les variétés',
          screen: 'Agriculture / Production',
          tab: 'agriculture' as NavigationTab,
          btn: 'Sélecteur de Campagne',
          details: 'Consultez les objectifs de récolte (Maïs CMS 8704, Soja, Manioc IRAD) et les rendements cibles (t/ha).',
        },
        {
          action: 'Consigner les travaux aux champs',
          screen: 'Suivi Cultural',
          tab: 'suivi_cultural' as NavigationTab,
          btn: '+ Nouvelle Opération Culturale',
          details: 'Enregistrez le semis, les sarclages, les épandages NPK 20-10-10 et les traitements phytosanitaires avec le coût en FCFA.',
        },
        {
          action: 'Surveiller les stades phénologiques & la météo',
          screen: 'Suivi Cultural',
          tab: 'suivi_cultural' as NavigationTab,
          btn: 'Jauges Phénologiques',
          details: 'Contrôlez l’avancement de floraison/fructification et vérifiez les alertes bio-agresseurs (chenille légionnaire).',
        },
      ],
      tips: 'Le cahier d’intervention numérique permet la traçabilité complète pour la certification biologique et équitable.',
    },
    {
      step: 3,
      id: 'sante_animale' as NavigationTab,
      title: '3. Conduite d’Élevage & Suivi Sanitaire Vétérinaire',
      subtitle: 'Zootechnie, santé préventive et carnet sanitaire (12 pages)',
      icon: HeartPulse,
      color: 'bg-rose-600 text-white',
      badge: 'Pôle Animal',
      description:
        "L'équipe zootechnique gère les effectifs par lot (Bovins, Porcins, Petits Ruminants, Volailles), tandis que le Dr Vétérinaire assure la veille et les soins.",
      actions: [
        {
          action: 'Consulter la santé du cheptel',
          screen: 'Santé Animale (Pages 1 à 10)',
          tab: 'sante_animale' as NavigationTab,
          btn: 'Onglets P1 à P10',
          details: 'Visualisez l’état de santé général (92% sains), les tendances saisonnières, la carte des foyers et le GMQ.',
        },
        {
          action: 'Enregistrer un acte ou soin vétérinaire',
          screen: 'Santé Animale (Page 11 - Registre CRUD)',
          tab: 'sante_animale' as NavigationTab,
          btn: '+ Nouvelle Intervention',
          details: 'Saisissez le lot traité, la pathologie, les médicaments injectés (ex: Tenaline LA), la posologie et le coût.',
        },
        {
          action: 'Auditer le protocole de biosécurité',
          screen: 'Santé Animale (Page 12 - Biosécurité)',
          tab: 'sante_animale' as NavigationTab,
          btn: 'Onglet P12',
          details: 'Vérifiez la conformité des sas, pédiluves au sulfate de cuivre et la période de quarantaine 21 jours.',
        },
      ],
      tips: 'Tout animal sous antibiotique fait l’objet d’un délai d’attente strict (lait/viande) consigné dans le registre.',
    },
    {
      step: 4,
      id: 'stocks' as NavigationTab,
      title: '4. Collecte Bord Champ, Pesée & Gestion des Silos',
      subtitle: 'Réception, agréage qualité et stockage sécurisé',
      icon: Warehouse,
      color: 'bg-emerald-700 text-white',
      badge: 'Chaîne Logistique',
      description:
        "Lors des récoltes, les agents de collecte pèsent les grains au bord du champ, délivrent un bordereau de dépôt et transportent les stocks vers les magasins régionaux.",
      actions: [
        {
          action: 'Éditer un bordereau de collecte',
          screen: 'Collecte & Logistique',
          tab: 'collecte' as NavigationTab,
          btn: '+ Nouveau Bordereau',
          details: 'Enregistrez le volume collecté (kg), le taux d’humidité (<14%) et le prix bord champ garanti.',
        },
        {
          action: 'Surveiller les silos et magasins',
          screen: 'Stocks & Silos',
          tab: 'stocks' as NavigationTab,
          btn: 'Vue Magasins Régionaux',
          details: 'Suivez le taux de remplissage des silos à Yaoundé, Obala et Mbalmayo pour éviter les ruptures.',
        },
      ],
      tips: 'La coopérative assure un séchage immédiat pour garantir une conservation optimale de plus de 12 mois sans moisissure.',
    },
    {
      step: 5,
      id: 'commercialisation' as NavigationTab,
      title: '5. Vente, Commercialisation & Transformation',
      subtitle: 'Contrats grossistes, livraisons et valorisation des produits',
      icon: ShoppingBag,
      color: 'bg-purple-600 text-white',
      badge: 'Pôle Ventes',
      description:
        "COOPS-CA commercialise les récoltes brutes et transformées (farine de maïs, tourteaux de soja, bétail sur pied) auprès des minoteries et marchés de Yaoundé.",
      actions: [
        {
          action: 'Créer un contrat ou une vente',
          screen: 'Commercialisation / Ventes',
          tab: 'commercialisation' as NavigationTab,
          btn: '+ Nouvelle Vente',
          details: 'Sélectionnez le client (grossiste, aviculteur, brasserie), les volumes, le prix de cession unitaire et le délai de paiement.',
        },
        {
          action: 'Émettre la facture et bon de livraison',
          screen: 'Commercialisation / Ventes',
          tab: 'commercialisation' as NavigationTab,
          btn: 'Éditer Facture',
          details: 'Générez la pièce comptable numérotée avec référence OHADA pour le client.',
        },
      ],
      tips: 'Le regroupement de l’offre coopérative permet d’obtenir un prix de vente supérieur de 15% à 25% par rapport à une vente individuelle isolée.',
    },
    {
      step: 6,
      id: 'finances' as NavigationTab,
      title: '6. Rémunération des Membres & Arrêtés Financiers',
      subtitle: 'Application stricte de la règle de rémunération RG-010',
      icon: DollarSign,
      color: 'bg-blue-700 text-white',
      badge: 'Comptabilité & Ristournes',
      description:
        "La trésorerie calcule les décomptes individuels de chaque membre coopérateur (prix garanti d’apport + ristourne de fin de campagne déduction faite des avances).",
      actions: [
        {
          action: 'Consulter le compte individuel du membre',
          screen: 'Finances & Rémunération',
          tab: 'finances' as NavigationTab,
          btn: 'Comptes Membres (RG-010)',
          details: 'Visualisez les apports cumulés, les avances en intrants déduites et le solde net à reverser.',
        },
        {
          action: 'Valider les décaissements de trésorerie',
          screen: 'Finances & Trésorerie',
          tab: 'finances' as NavigationTab,
          btn: 'Journal de Caisse / Banque',
          details: 'Enregistrez les virements bancaires et paiements mobiles (MTN / Orange Money) aux producteurs.',
        },
      ],
      tips: 'Règle RG-010 : 80% du montant est payé au déchargement en magasin, le solde (20% + ristourne) est liquidé après l’Assemblée Générale annuelle.',
    },
    {
      step: 7,
      id: 'kpi_analyses' as NavigationTab,
      title: '7. Pilotage Stratégique BI & Paramètres Système',
      subtitle: 'Tableaux de bord d’aide à la décision et gouvernance',
      icon: BarChart3,
      color: 'bg-indigo-700 text-white',
      badge: 'Gouvernance & BI',
      description:
        "La Direction Générale et le Conseil d'Administration analysent les performances pluriannuelles et ajustent la gouvernance dans les Paramètres.",
      actions: [
        {
          action: 'Analyser les 8 Questions Stratégiques (BI)',
          screen: 'Analyses & KPI (BI)',
          tab: 'kpi_analyses' as NavigationTab,
          btn: 'Moteur DAX/SQL',
          details: 'Mesurez la marge par hectare, le taux de dépendance, l’efficacité des silos et le retour sur intrants.',
        },
        {
          action: 'Gérer les utilisateurs et droits (RBAC)',
          screen: 'Paramètres & Système',
          tab: 'parametres' as NavigationTab,
          btn: 'Onglet Utilisateurs & Droits',
          details: 'Créez de nouveaux profils (Agronome, Vétérinaire, Magasinier) et ajustez leurs permissions d’accès.',
        },
        {
          action: 'Sauvegarder les données en JSON',
          screen: 'Paramètres & Système',
          tab: 'parametres' as NavigationTab,
          btn: 'Exporter Base JSON',
          details: 'Téléchargez une archive complète de la base de données coopérative pour sauvegarde sécurisée.',
        },
      ],
      tips: 'Le module Paramètres permet également de personnaliser les seuils d’alerte (alerte silo à 15%, seuil mortalité >3%).',
    },
  ];

  // Parcours par Rôle Métier
  const rolesWorkflow = [
    {
      roleKey: 'direction',
      title: 'Directeur Général / Conseil d’Administration',
      badge: 'Supervision & Décisions',
      color: 'border-emerald-600 text-emerald-800 bg-emerald-50',
      description:
        "Vous avez une vue d'ensemble sur l'ensemble des activités. Votre rôle est de piloter la coopérative, valider les investissements et orienter la stratégie commerciale.",
      dailyTasks: [
        {
          order: 1,
          task: "Consulter le Tableau de Bord Direction dès l'ouverture",
          targetTab: 'accueil' as NavigationTab,
          detail: 'Vérifiez les indicateurs consolidés : volume de collecte, solde de trésorerie disponible et alertes urgentes.',
        },
        {
          order: 2,
          task: 'Analyser les 8 questions stratégiques dans le module BI',
          targetTab: 'kpi_analyses' as NavigationTab,
          detail: 'Surveillez le seuil de rentabilité par culture, la performance des bassins et le ratio d’endettement.',
        },
        {
          order: 3,
          task: 'Arbitrer les contrats de commercialisation',
          targetTab: 'commercialisation' as NavigationTab,
          detail: 'Validez les livraisons aux grands comptes industriels (Brasseries, Minoteries de Yaoundé).',
        },
        {
          order: 4,
          task: 'Superviser les droits d’accès et sauvegarder la base',
          targetTab: 'parametres' as NavigationTab,
          detail: 'Vérifiez l’annuaire du personnel et téléchargez l’export JSON de sauvegarde hebdomadaire.',
        },
      ],
    },
    {
      roleKey: 'agronome',
      title: 'Agronome / Responsable Pôle Végétal',
      badge: 'Parcelles & Récoltes',
      color: 'border-amber-600 text-amber-800 bg-amber-50',
      description:
        "Vous supervisez les surfaces cultivées, la fourniture des semences certifiées et l'accompagnement technique des producteurs membres.",
      dailyTasks: [
        {
          order: 1,
          task: 'Vérifier la météo et les alertes phytosanitaires',
          targetTab: 'suivi_cultural' as NavigationTab,
          detail: 'Consultez le cumul des pluies et la vigilance bio-agresseurs (chenille légionnaire, rouille du maïs).',
        },
        {
          order: 2,
          task: 'Saisir les interventions culturales aux champs',
          targetTab: 'suivi_cultural' as NavigationTab,
          detail: 'Enregistrez les dates de semis, d’épandage d’engrais NPK et de sarclage parcelle par parcelle.',
        },
        {
          order: 3,
          task: 'Suivre l’état d’avancement des parcelles',
          targetTab: 'terrains_parcelles' as NavigationTab,
          detail: 'Mettez à jour les fiches de parcelles, contrôlez les superficies et les exploitants rattachés.',
        },
        {
          order: 4,
          task: 'Comparer les rendements prévisionnels vs réels',
          targetTab: 'agriculture' as NavigationTab,
          detail: 'Analysez l’écart entre l’objectif de la campagne 2026-A et la pesée effective au champ.',
        },
      ],
    },
    {
      roleKey: 'veterinaire',
      title: 'Docteur Vétérinaire / Responsable Zootechnique',
      badge: 'Santé & Biosécurité',
      color: 'border-rose-600 text-rose-800 bg-rose-50',
      description:
        "Vous êtes garant de la santé du cheptel (286 têtes), du respect des calendriers vaccinaux et de la stricte application des normes de biosécurité.",
      dailyTasks: [
        {
          order: 1,
          task: 'Consulter l’état sanitaire général du cheptel (P1 à P3)',
          targetTab: 'sante_animale' as NavigationTab,
          detail: 'Vérifiez le taux d’animaux sains (cible >90%) et les diagnostics en cours.',
        },
        {
          order: 2,
          task: 'Enregistrer les actes et prescriptions (Page 11 - Registre CRUD)',
          targetTab: 'sante_animale' as NavigationTab,
          detail: 'Cliquez sur « + Nouvelle Intervention » pour saisir les vaccins, traitements antibiotiques et coûts.',
        },
        {
          order: 3,
          task: 'Auditer le plan de biosécurité & délais d’attente (Page 12)',
          targetTab: 'sante_animale' as NavigationTab,
          detail: 'Contrôlez les rotoluves, la quarantaine des nouveaux sujets et la conformité lait/viande.',
        },
        {
          order: 4,
          task: 'Surveiller les rations alimentaires et le GMQ',
          targetTab: 'elevage' as NavigationTab,
          detail: 'Ajustez les rations (fourrage vert, tourteau de soja, CMV) pour maintenir un GMQ optimal.',
        },
      ],
    },
    {
      roleKey: 'magasinier',
      title: 'Responsable Stocks, Silos & Collecte',
      badge: 'Logistique & Ensilage',
      color: 'border-blue-600 text-blue-800 bg-blue-50',
      description:
        "Vous contrôlez les flux physiques de matières premières : réceptions bord champ, pesées certifiées, ventilation des silos et expéditions.",
      dailyTasks: [
        {
          order: 1,
          task: 'Surveiller les niveaux de remplissage des magasins',
          targetTab: 'stocks' as NavigationTab,
          detail: 'Consultez les tonnages en stock dans les silos d’Obala, Yaoundé et Mbalmayo.',
        },
        {
          order: 2,
          task: 'Éditer les bordereaux de réception de récolte',
          targetTab: 'collecte' as NavigationTab,
          detail: 'Vérifiez l’agréage qualité (taux d’humidité <14%, taux d’impuretés) avant déchargement.',
        },
        {
          order: 3,
          task: 'Alerter en cas de stock critique',
          targetTab: 'parametres' as NavigationTab,
          detail: 'Configurez et surveillez les seuils d’alerte mini (ex: alerte stock sécurité à 20 tonnes).',
        },
      ],
    },
    {
      roleKey: 'tresoriere',
      title: 'Trésorière / Responsable Financière',
      badge: 'Paiements & RG-010',
      color: 'border-purple-600 text-purple-800 bg-purple-50',
      description:
        "Vous gérez les flux monétaires de la coopérative : paiements des récoltes aux membres, encaissement des factures clients et équilibre de la trésorerie.",
      dailyTasks: [
        {
          order: 1,
          task: 'Vérifier la position journalière de trésorerie',
          targetTab: 'finances' as NavigationTab,
          detail: 'Consultez les soldes disponibles en banque et caisse pour honorer les dépenses courantes.',
        },
        {
          order: 2,
          task: 'Calculer les règlements des membres (Règle RG-010)',
          targetTab: 'finances' as NavigationTab,
          detail: 'Générez les décomptes : montant des apports livrés moins les avances d’intrants déduites.',
        },
        {
          order: 3,
          task: 'Suivre le recouvrement des créances clients',
          targetTab: 'commercialisation' as NavigationTab,
          detail: 'Pointez les factures grossistes en attente et relancez les échéances échues.',
        },
      ],
    },
  ];

  // Règles de Gestion Fondamentales (RG-001 à RG-010)
  const reglesGestion = [
    {
      code: 'RG-001',
      titre: 'Hiérarchie Foncier Strict (Terrain → Parcelle → Lot)',
      description:
        'Chaque parcelle doit impérativement être géolocalisée et liée à un terrain identifié et à un membre coopérateur actif.',
      impact: 'Garantit l’absence de litige foncier et la traçabilité géographique du produit.',
    },
    {
      code: 'RG-002',
      titre: 'Agrément des Semences Certifiées',
      description:
        'Seules les variétés homologuées par l’IRAD et le MINADER (ex: Maïs CMS 8704, Manioc IRAD 8034) sont distribuées par la coopérative.',
      impact: 'Rendement garanti supérieur à 5,5 t/ha et résistance aux maladies endémiques.',
    },
    {
      code: 'RG-003',
      titre: 'Traçabilité Phyto & Respect des Doses Intrants',
      description:
        'Toute application d’engrais ou traitement antiparasitaire doit être consignée dans le cahier avec date, dose et nom de l’opérateur.',
      impact: 'Condition obligatoire pour la certification qualité et l’exportation.',
    },
    {
      code: 'RG-004',
      titre: 'Quarantaine & Biosécurité Épizootique',
      description:
        'Tout animal entrant doit subir 21 jours de quarantaine et recevoir les vaccins légaux (PPR, Newcastle, Rouget) avant intégration.',
      impact: 'Maintient le statut indemne et préserve le cheptel contre la Peste Porcine Africaine (PPA).',
    },
    {
      code: 'RG-005',
      titre: 'Délai d’Attente Sanitaire Lait / Viande',
      description:
        'Interdiction formelle de collecter ou vendre la production d’un animal sous traitement antibiotique avant l’expiration du délai de carence.',
      impact: 'Protection de la santé des consommateurs contre les résidus médicamenteux.',
    },
    {
      code: 'RG-006',
      titre: 'Agréage Qualité à la Réception (Humidité < 14%)',
      description:
        'Tout lot de maïs ou soja présentant un taux d’humidité supérieur à 14% est orienté vers l’unité de séchage avant ensilage.',
      impact: 'Évite les attaques d’aflatoxines et les pertes post-récolte.',
    },
    {
      code: 'RG-007',
      titre: 'Sécurité des Stocks & Règle FIFO (Premier Entré, Premier Sorti)',
      description:
        'Les premiers grains ensilés sont les premiers commercialisés, avec relevé hebdomadaire des sondes thermiques.',
      impact: 'Fraîcheur optimale et zéro pourrissement dans les silos régionaux.',
    },
    {
      code: 'RG-008',
      titre: 'Facturation & Transparence Commerciale',
      description:
        'Aucune marchandise ne quitte un magasin sans bon d’enlèvement signé et facture numérotée sous format OHADA.',
      impact: 'Comptabilité certifiable et zéro déperdition de matière.',
    },
    {
      code: 'RG-009',
      titre: 'Sécurité RBAC & Séparation des Tâches',
      description:
        'L’agent qui réceptionne la récolte ne peut pas valider lui-même le virement financier. Les modifications sensibles nécessitent un rôle autorisé.',
      impact: 'Auditabilité totale et conformité avec les règles de gouvernance COOP-GIE.',
    },
    {
      code: 'RG-010',
      titre: 'Rémunération Équitable du Producteur Membre',
      description:
        'Le membre perçoit un acompte garanti à la livraison (80%), déduction faite de ses avances en semences/engrais. Le solde et les ristournes sont versés en fin d’exercice.',
      impact: 'Fidélisation des coopérateurs et transparence financière absolue.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold backdrop-blur-xs">
            <Compass className="w-4 h-4 text-emerald-300" />
            <span>Guide d'Utilisation & Workflow Opérationnel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Comment fonctionne l'application COOPS-FLOW ?
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Retrouvez ici le cycle de gestion complet de la coopérative <strong>{config.nom}</strong>, 
            les actions pas-à-pas selon votre rôle métier et les 10 règles de gestion fondamentales (RG-001 à RG-010).
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-xl text-xs text-emerald-200">
              <UserCheck className="w-4 h-4 text-emerald-300" />
              <span>Connecté en tant que : <strong>{currentUser.prenom} {currentUser.nom}</strong> ({currentUser.fonction})</span>
            </div>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
          <Compass className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Navigation View Switcher (Tabs) */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveView('cycle')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeView === 'cycle'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Cycle Global de la Coopérative (7 étapes)</span>
        </button>

        <button
          onClick={() => setActiveView('roles')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeView === 'roles'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>2. Parcours par Rôle Métier</span>
        </button>

        <button
          onClick={() => setActiveView('actions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeView === 'actions'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. Actions Concrètes Pas-à-Pas (CRUD)</span>
        </button>

        <button
          onClick={() => setActiveView('regles')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeView === 'regles'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>4. Règles de Gestion (RG-001 à RG-010)</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* VUE 1 : CYCLE DE VIE DE LA COOPÉRATIVE (7 ÉTAPES) */}
      {/* ===================================================================== */}
      {activeView === 'cycle' && (
        <div className="space-y-5">
          {/* Horizontal Step Indicator Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {lifecycleSteps.map((s) => {
              const isSelected = selectedStep === s.step;
              const Icon = s.icon;
              return (
                <button
                  key={s.step}
                  onClick={() => setSelectedStep(s.step)}
                  className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-md scale-102'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        isSelected ? 'bg-white text-emerald-900' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {s.step}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`} />
                  </div>
                  <div className="text-[11px] font-black leading-tight line-clamp-2">
                    {s.title.replace(/^\d+\.\s*/, '')}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Detailed Card */}
          {(() => {
            const step = lifecycleSteps.find((s) => s.step === selectedStep) || lifecycleSteps[0];
            const Icon = step.icon;
            return (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center shadow-xs shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                          {step.badge}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">Étape {step.step} sur 7</span>
                      </div>
                      <h2 className="text-lg font-black text-slate-900 mt-0.5">{step.title}</h2>
                      <p className="text-xs text-slate-500">{step.subtitle}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateToTab(step.id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-center"
                  >
                    <span>Ouvrir ce module</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  {step.description}
                </p>

                {/* Actions requises dans cette étape */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Actions concrètes à réaliser à cette étape :</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {step.actions.map((act, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-all space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-xs text-slate-900">{act.action}</span>
                            <span className="px-2 py-0.5 rounded-lg bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                              {act.btn}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">{act.details}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 font-medium">Écran : {act.screen}</span>
                          <button
                            onClick={() => onNavigateToTab(act.tab)}
                            className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                          >
                            <span>Y aller</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conseil / Astuce Métier */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block mb-0.5">Bonne pratique coopérative :</strong>
                    {step.tips}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ===================================================================== */}
      {/* VUE 2 : PARCOURS PAR RÔLE MÉTIER */}
      {/* ===================================================================== */}
      {activeView === 'roles' && (
        <div className="space-y-5">
          {/* Role selector buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {rolesWorkflow.map((r) => {
              const isCurrent = selectedRole === r.roleKey;
              return (
                <button
                  key={r.roleKey}
                  onClick={() => setSelectedRole(r.roleKey)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isCurrent
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{r.title.split('/')[0].trim()}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Role Detail */}
          {(() => {
            const role = rolesWorkflow.find((r) => r.roleKey === selectedRole) || rolesWorkflow[0];
            return (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 mb-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Fiche Rôle : {role.badge}</span>
                    </div>
                    <h2 className="text-lg font-black text-slate-900">{role.title}</h2>
                  </div>

                  <span className="text-xs text-slate-500 font-medium">
                    Guide des tâches quotidiennes et hebdomadaires
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {role.description}
                </p>

                {/* Séquence des tâches pour ce rôle */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Séquence Opérationnelle Recommandée :
                  </h3>

                  <div className="space-y-2.5">
                    {role.dailyTasks.map((t) => (
                      <div
                        key={t.order}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-xl bg-emerald-700 text-white text-xs font-black flex items-center justify-center shrink-0">
                            {t.order}
                          </span>
                          <div>
                            <div className="font-bold text-xs text-slate-900">{t.task}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{t.detail}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => onNavigateToTab(t.targetTab)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-700 text-xs font-bold transition-all self-end sm:self-center shrink-0"
                        >
                          <span>Accéder à la vue</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ===================================================================== */}
      {/* VUE 3 : ACTIONS CONCRÈTES PAS-À-PAS (CRUD GUIDE) */}
      {/* ===================================================================== */}
      {activeView === 'actions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              Guide Pratique des Écrans & Boutons d'Action (CRUD)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Consultez les boutons exacts à utiliser pour créer, mettre à jour et gérer vos données opérationnelles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Action 1 : Santé Animale CRUD */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-600" />
                  Santé Animale : Créer un acte de soin
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800">
                  Page 11
                </span>
              </div>
              <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                <li>Ouvrez le module <strong>Santé Animale</strong> dans le menu latéral.</li>
                <li>Cliquez sur l'onglet <strong>P11 (Registre des interventions)</strong>.</li>
                <li>Cliquez sur le bouton vert <strong>« + Nouvelle Intervention »</strong>.</li>
                <li>Renseignez la date, l'espèce, le lot, le diagnostic et le médicament injecté.</li>
                <li>Cliquez sur <strong>« Enregistrer dans le registre »</strong> (sauvegarde locale automatique).</li>
              </ol>
              <button
                onClick={() => onNavigateToTab('sante_animale')}
                className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all text-center block"
              >
                Tester dans le module Santé Animale →
              </button>
            </div>

            {/* Action 2 : Suivi Cultural CRUD */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Suivi Cultural : Consigner un travail aux champs
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Agronomie
                </span>
              </div>
              <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                <li>Ouvrez le module <strong>Suivi cultural</strong> dans le menu latéral.</li>
                <li>Cliquez sur le bouton en haut à droite <strong>« + Nouvelle Opération Culturale »</strong>.</li>
                <li>Sélectionnez le type d'opération : <em>Semis, Sarclage, NPK, Phyto, Récolte</em>.</li>
                <li>Indiquez la parcelle, la culture, la dose d'intrant et le coût en FCFA.</li>
                <li>Enregistrez pour alimenter l'historique et la traçabilité.</li>
              </ol>
              <button
                onClick={() => onNavigateToTab('suivi_cultural')}
                className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all text-center block"
              >
                Tester dans le module Suivi Cultural →
              </button>
            </div>

            {/* Action 3 : Utilisateurs & Droits CRUD */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-emerald-700" />
                  Paramètres : Ajouter un utilisateur ou modifier ses accès
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                  Système & RBAC
                </span>
              </div>
              <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                <li>Ouvrez le module <strong>Paramètres & Système</strong> dans le menu latéral.</li>
                <li>Sélectionnez l'onglet <strong>« Utilisateurs & Droits (RBAC) »</strong>.</li>
                <li>Cliquez sur <strong>« + Nouvel Utilisateur »</strong> pour créer un profil ou sur le crayon pour éditer.</li>
                <li>Attribuez le rôle adéquat (*Direction, Agronome, Vétérinaire, Magasinier…*).</li>
                <li>Activez ou restreignez les permissions de suppression ou de validation financière.</li>
              </ol>
              <button
                onClick={() => onNavigateToTab('parametres')}
                className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all text-center block"
              >
                Tester dans le module Paramètres →
              </button>
            </div>

            {/* Action 4 : Sauvegarde & Export JSON */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-600" />
                  Maintenance : Exporter ou importer la base
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800">
                  Sécurité
                </span>
              </div>
              <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                <li>Ouvrez <strong>Paramètres & Système</strong> → Onglet <strong>« Maintenance & Base »</strong>.</li>
                <li>Cliquez sur <strong>« Exporter la base (JSON) »</strong> pour créer un fichier de sauvegarde local.</li>
                <li>Conservez ce fichier sur une clé USB ou stockage externe sécurisé.</li>
                <li>En cas de changement d'ordinateur, utilisez <strong>« Importer un fichier JSON »</strong> pour restaurer instantanément toutes vos données.</li>
              </ol>
              <button
                onClick={() => onNavigateToTab('parametres')}
                className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all text-center block"
              >
                Aller à la Maintenance →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VUE 4 : RÈGLES DE GESTION FONDAMENTALES (RG-001 À RG-010) */}
      {/* ===================================================================== */}
      {activeView === 'regles' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Les 10 Règles de Gestion Fondamentales (RG-001 à RG-010)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Principes coopératifs, statut juridique OHADA / COOP-GIE et conformité agro-pastorale.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold self-start sm:self-center">
              Statuts Certifiés COOPS-CA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reglesGestion.map((rg) => (
              <div
                key={rg.code}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-800 text-white font-mono font-black text-xs">
                    {rg.code}
                  </span>
                  <span className="font-bold text-xs text-slate-900">{rg.titre}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rg.description}</p>
                <div className="pt-2 border-t border-slate-200/80 text-[11px] text-emerald-800 font-medium">
                  <strong>Impact direct :</strong> {rg.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

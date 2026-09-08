import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  FileText,
  Building,
  Layers,
  Sparkles,
  Printer,
  ChevronRight,
} from 'lucide-react';

export const StrategicDossierModule: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState('chap-01');
  const [searchFilter, setSearchFilter] = useState('');

  const chapters = [
    {
      id: 'chap-01',
      num: '01',
      title: 'Introduction générale & Vision Stratégique',
      category: 'INSTITUTIONNEL',
      content: `COOPS-CA NKUL-FA (Coopérative avec Conseil d'Administration NKUL-FA) s'inscrit dans la dynamique de modernisation agro-pastorale au Cameroun. Face aux enjeux de souveraineté alimentaire, de volatilité des cours et d'exigences accrues en traçabilité, la coopérative déploie COOPS-FLOW : son système nerveux numérique unifié.
      
Le présent document formalise la démarche d'accompagnement analytique, la modélisation des données décisionnelles et la trajectoire de transformation numérique pour les campagnes 2026-2030.`,
    },
    {
      id: 'chap-02',
      num: '02',
      title: 'Présentation institutionnelle de COOPS-CA NKUL-FA',
      category: 'INSTITUTIONNEL',
      content: `Statut juridique : Coopérative avec Conseil d'Administration (Acte uniforme OHADA relatif au droit des sociétés coopératives).
Siège social : Yaoundé, Région du Centre, République du Cameroun.
Membres actuels : 486 coopérateurs répartis sur 5 départements clés (Lekié, Nyong-et-Kéllé, Nyong-et-So'o, Mbam-et-Inoubou, Mfoundi).
Filières couvertes :
1. Pôle végétal : Maïs grain, Manioc, Banane-plantain, Soja et maraîchage.
2. Pôle animal & halieutique : Bovins de boucherie, Porcins, Aviculture de chair et ponte, Petits ruminants (caprins et ovins), Pisciculture d'eau douce (Tilapia et silure).`,
    },
    {
      id: 'chap-03',
      num: '03',
      title: 'Modèle Hiérarchique : Terrain → Parcelle → Élevage → Lot',
      category: 'ARCHITECTURE BI',
      content: `Pour résoudre le défi de la promiscuité des activités agro-pastorales sur un même espace géographique, COOPS-FLOW institue une relation stricte à 4 niveaux :
      
1. TERRAIN (D_Terrains) : Propriété foncière globale ou domaine coopératif (ex: T001 Ferme Obala Nord, 45.5 ha).
2. PARCELLE (D_Parcelles) : Subdivision cadastrale physique et homogène (ex: T001-P001 pour le maïs, T001-P002 pour les bâtiments porcins).
3. ACTIVITÉ / ÉLEVAGE (F_Elevage_Parcelles ou F_Suivi_Parcelles_Cultures) : Affectation de la ressource.
4. LOT & ÉVÉNEMENTS (F_Evenements_Elevage, F_Sante_Animale, F_Alimentation) : Historique chronologique au grain le plus fin.`,
    },
    {
      id: 'chap-04',
      num: '04',
      title: 'Schéma en Étoile (Star Schema) du Pôle Animal',
      category: 'ARCHITECTURE BI',
      content: `La base de données décisionnelle repose sur 7 tables interconnectées :
- Tables de dimensions :
  * D_Especes (Identifiant, Nom, Catégorie, Durée cycle, Poids cible)
  * D_Races (Identifiant, Nom, Espèce, Rusticité, Aptitude)
  * D_Terrains & D_Parcelles (Coordonnées SIG, Sol, Superficie)
  * D_Membres (Profil, Parts sociales, Ancienneté)
  * D_Temps (Année, Mois, Campagne, Semaine)
- Tables de faits :
  * F_Elevage_Parcelles (Effectifs, Valeur biologique IAS 41, Mâles/Femelles)
  * F_Sante_Animale (Pathologies, Traitements, Coûts, Vétérinaire)
  * F_Alimentation_Elevage (Provendes, Rations, Coûts journaliers, GMQ)
  * F_Reproduction (Saillies, Gestations, Mises bas, Survie)
  * F_Evenements_Elevage (Pesées, Ventes, Pertes, Transferts)`,
    },
    {
      id: 'chap-05',
      num: '05',
      title: 'Règles de Gestion & Formules de Calcul Clés',
      category: 'MÉTIER & FORMULES',
      content: `RG-001 (Rendement Agricole) : Rendement (t/ha) = Quantité récoltée nette (tonnes) / Superficie emblavée (ha).
RG-002 (Gain Moyen Quotidien) : GMQ (g/jour) = (Poids final - Poids initial en grammes) / Nombre de jours d'élevage.
RG-003 (Taux de Mortalité Zootechnique) : Taux = (Mortalités constatées / Effectif initial du lot) × 100.
RG-010 (Rémunération Coopérateur) : Montant Dû = Volume livré (kg) × Prix garanti campagne (FCFA/kg).
RG-011 (Balance Membre) : Reste à payer = Montant Dû - (Avances intrants + Acomptes versés).
RG-015 (Marge Brute Parcellaire) : Marge/ha = (Chiffre d'affaires récolte - Somme des coûts intrants & main d'œuvre) / Superficie (ha).`,
    },
    {
      id: 'chap-06',
      num: '06',
      title: 'Référentiel des Risques & Plan de Contingence',
      category: 'SÉCURITÉ & RISQUES',
      content: `Matrice de criticité 2026 :
1. Peste Porcine Africaine (PPA) : Risque Élevé. Mesures : Barrière sanitaire étanche, désinfection des véhicules, interdiction d'aliments de récupération.
2. Stress hydrique / Retard des pluies : Risque Modéré. Mesures : Adoption de variétés précises (CMS 8704), étalement des semis, paillage.
3. Vol & Attaques de cheptel : Risque Faible à Modéré. Mesures : Enclos fortifiés, gardiennage communautaire, boucle d'oreille numérotée.
4. Fluctuations des cours du carburant & transport : Risque Modéré. Mesures : Mutualisation des collectes au niveau des 7 centres départementaux.`,
    },
    {
      id: 'chap-07',
      num: '07',
      title: 'Gouvernance, Rôles & Sécurité d’Accès (RBAC)',
      category: 'SÉCURITÉ & RISQUES',
      content: `Le système COOPS-FLOW garantit une stricte séparation des droits :
- Super Administrateur : Paramétrage global, audit et intégrité de la base.
- Direction Générale : Tableaux de bord stratégiques, consolidation financière et décisions d'investissement.
- Responsable Agricole : Validation des emblavements, suivi agronomique et déclarations de récoltes.
- Responsable Élevage & Vétérinaire : Suivi des lots d'animaux, prescriptions sanitaires et rations.
- Agent de Collecte Terrain : Émission des bordereaux sur smartphone / tablette hors-ligne.
- Responsable Magasins : Réception, gestion des silos et validation des expéditions.
- Comptabilité : Facturation clients, décaissement et balance des comptes coopérateurs.
- Membre Coopérateur : Consultation transparente de son compte personnel et de ses livraisons.`,
    },
  ];

  const filteredChapters = chapters.filter(
    (c) =>
      c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.content.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const currentChapterData = chapters.find((c) => c.id === activeChapter) || chapters[0];

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-stone-700 uppercase bg-stone-100 px-2.5 py-1 rounded-full mb-1">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>Document de Référence Officiel 2026</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Dossier Stratégique & Cahier des Charges Intégré
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            COOPS-CA NKUL-FA • Digitalisation, pilotage de la performance et optimisation des activités agro-pastorales (Yaoundé, Cameroun).
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors self-start md:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer / PDF</span>
        </button>
      </div>

      {/* Main Reader Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Index */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Rechercher dans le dossier..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
            {filteredChapters.map((chap) => {
              const isSelected = activeChapter === chap.id;
              return (
                <button
                  key={chap.id}
                  onClick={() => setActiveChapter(chap.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-emerald-900 text-white font-bold shadow-xs'
                      : 'hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        isSelected ? 'bg-emerald-800 text-amber-300' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {chap.num}
                    </span>
                    <span className="line-clamp-2 leading-tight">{chap.title}</span>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                      isSelected ? 'text-amber-300' : 'text-stone-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Content View */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-[10px] font-bold font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                {currentChapterData.category} • CHAPITRE {currentChapterData.num}
              </span>
              <span className="text-xs text-stone-400 font-semibold">COOPS-CA NKUL-FA</span>
            </div>

            <h2 className="text-xl font-black text-stone-900 leading-snug">
              {currentChapterData.title}
            </h2>

            <div className="prose prose-stone text-xs leading-relaxed text-stone-700 whitespace-pre-line bg-stone-50/60 p-5 rounded-2xl border border-stone-100">
              {currentChapterData.content}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Conformité OHADA, MINADER & MINEPIA (Cameroun)</span>
            </div>
            <span className="font-mono text-stone-400">Réf : DOC-STRAT-NKF-2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};

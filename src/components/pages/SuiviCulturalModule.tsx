import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Droplets,
  Sun,
  CloudRain,
  Sprout,
  ShieldAlert,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { SUIVI_PARCELLES_CULTURES, PARCELLES_DATA } from '../../data/coopData';
import { useApp } from '../../context/AppContext';

interface CulturalIntervention {
  id: string;
  date: string;
  parcelleCode: string;
  cooperateurNom: string;
  culture: string;
  typeTravail: 'Semis' | 'Sarclage' | 'Fertilisation NPK' | 'Traitement Phyto' | 'Irrigation' | 'Récolte';
  intrantDose: string;
  operateur: string;
  coutFCFA: number;
  statut: 'Terminé' | 'En cours' | 'Planifié';
  observation: string;
}

export const SuiviCulturalModule: React.FC = () => {
  const { canPerform, currentUser } = useApp();

  // Cultural Interventions state with initial realistic data
  const [interventions, setInterventions] = useState<CulturalIntervention[]>([
    {
      id: 'INT-CULT-001',
      date: '2026-03-18',
      parcelleCode: 'PARC-OBAL-001',
      cooperateurNom: 'M. Jean-Paul MVONDO',
      culture: 'Maïs Blanc (CMS 8704)',
      typeTravail: 'Fertilisation NPK',
      intrantDose: 'NPK 20-10-10 (200 kg/ha)',
      operateur: 'Équipe Agronomie Obala',
      coutFCFA: 65000,
      statut: 'Terminé',
      observation: 'Épandage au stade 6 feuilles, bonne infiltration post-pluie.',
    },
    {
      id: 'INT-CULT-002',
      date: '2026-03-20',
      parcelleCode: 'PARC-OBAL-002',
      cooperateurNom: 'M. Pierre EKANI',
      culture: 'Soja (TGx 1835-10E)',
      typeTravail: 'Sarclage',
      intrantDose: 'Manuel (bineuses manuelles)',
      operateur: 'GIE Jeunes Planteurs',
      coutFCFA: 35000,
      statut: 'Terminé',
      observation: 'Nettoyage des adventices sur 4 ha, levée uniforme.',
    },
    {
      id: 'INT-CULT-003',
      date: '2026-04-02',
      parcelleCode: 'PARC-SAA-001',
      cooperateurNom: 'Mme Jeanne ABENA',
      culture: 'Manioc (IRAD 8034)',
      typeTravail: 'Traitement Phyto',
      intrantDose: 'Biopesticide Neem + Savon noir (10 L/ha)',
      operateur: 'Dr. Agr. Paulin ETOUNDI',
      coutFCFA: 42000,
      statut: 'Planifié',
      observation: 'Traitement préventif contre les acariens verts et aleurodes.',
    },
    {
      id: 'INT-CULT-004',
      date: '2026-04-10',
      parcelleCode: 'PARC-MBAL-001',
      cooperateurNom: 'M. Luc BINDZI',
      culture: 'Plantain (Bâtard / Big Ebanga)',
      typeTravail: 'Fertilisation NPK',
      intrantDose: 'Fumure organique compostée (3 t/ha)',
      operateur: 'Équipe Ferme Mbalmayo',
      coutFCFA: 80000,
      statut: 'En cours',
      observation: 'Apport au pied des rejets en début de grande saison des pluies.',
    },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterCulture, setFilterCulture] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [formState, setFormState] = useState<Omit<CulturalIntervention, 'id'>>({
    date: new Date().toISOString().slice(0, 10),
    parcelleCode: 'PARC-OBAL-001',
    cooperateurNom: 'M. Jean-Paul MVONDO',
    culture: 'Maïs Blanc (CMS 8704)',
    typeTravail: 'Fertilisation NPK',
    intrantDose: 'NPK 20-10-10 (200 kg/ha)',
    operateur: currentUser.nom ? `${currentUser.prenom} ${currentUser.nom}` : 'Agronome de Zone',
    coutFCFA: 45000,
    statut: 'Planifié',
    observation: '',
  });

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setInterventions((prev) =>
        prev.map((item) => (item.id === editingId ? { ...formState, id: editingId } : item))
      );
      setEditingId(null);
    } else {
      const newIntervention: CulturalIntervention = {
        ...formState,
        id: `INT-CULT-${String(Date.now()).slice(-4)}`,
      };
      setInterventions((prev) => [newIntervention, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleEdit = (item: CulturalIntervention) => {
    setEditingId(item.id);
    setFormState({
      date: item.date,
      parcelleCode: item.parcelleCode,
      cooperateurNom: item.cooperateurNom,
      culture: item.culture,
      typeTravail: item.typeTravail,
      intrantDose: item.intrantDose,
      operateur: item.operateur,
      coutFCFA: item.coutFCFA,
      statut: item.statut,
      observation: item.observation,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Confirmez-vous la suppression de cette intervention culturale ?')) {
      setInterventions((prev) => prev.filter((i) => i.id !== id));
    }
  };

  // Filtered interventions
  const filteredInterventions = interventions.filter((item) => {
    const matchCulture = filterCulture === 'all' || item.culture.includes(filterCulture);
    const matchSearch =
      item.parcelleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cooperateurNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.typeTravail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.intrantDose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCulture && matchSearch;
  });

  // Phenological Stages Data
  const stadesPhenologiques = [
    {
      parcelle: 'PARC-OBAL-001',
      culture: 'Maïs CMS 8704 (5.5 ha)',
      producteur: 'M. Jean-Paul MVONDO',
      semis: '15/02/2026',
      recoltePrevue: '20/06/2026',
      stadeActuel: 'Floraison / Fécondation',
      progressionPct: 65,
      couleur: 'bg-amber-500',
      alerte: 'Besoins hydriques maximaux • Surveillance chenille légionnaire',
    },
    {
      parcelle: 'PARC-OBAL-002',
      culture: 'Soja TGx 1835 (4.0 ha)',
      producteur: 'M. Pierre EKANI',
      semis: '25/02/2026',
      recoltePrevue: '10/06/2026',
      stadeActuel: 'Formation des Gousses',
      progressionPct: 75,
      couleur: 'bg-emerald-600',
      alerte: 'Excellent remplissage • Pas de bio-agresseur détecté',
    },
    {
      parcelle: 'PARC-SAA-001',
      culture: 'Manioc IRAD 8034 (8.0 ha)',
      producteur: 'Mme Jeanne ABENA',
      semis: '10/10/2025',
      recoltePrevue: '15/10/2026',
      stadeActuel: 'Grossissement des Tubercules',
      progressionPct: 55,
      couleur: 'bg-blue-600',
      alerte: 'Teneur en matière sèche prometteuse (>32%)',
    },
    {
      parcelle: 'PARC-MBAL-001',
      culture: 'Plantain Bâtard (6.2 ha)',
      producteur: 'M. Luc BINDZI',
      semis: '12/04/2025',
      recoltePrevue: '10/05/2026',
      stadeActuel: 'Émission Régimes / Maturation',
      progressionPct: 90,
      couleur: 'bg-emerald-700',
      alerte: 'Haubanage des régimes lourds requis contre les vents',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            <span>Agronomie de Précision & Travaux aux Champs</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Suivi Cultural & Cahier d'Interventions aux Champs
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Suivi dynamique des stades phénologiques, chronogramme des opérations (semis, sarclage, fertilisation, traitements) et bulletin agrométéorologique.
          </p>
        </div>

        {canPerform('create', 'agriculture') && (
          <button
            onClick={() => {
              setEditingId(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Opération Culturale</span>
          </button>
        )}
      </div>

      {/* Agrométéo & Vigilance Sanitaire Végétale */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
            <CloudRain className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">Cumul Pluviométrique</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-slate-900">42 mm</span>
              <span className="text-xs text-emerald-600 font-bold">+8 mm vs N-1</span>
            </div>
            <span className="text-[11px] text-slate-400 block">Conditions hydriques optimales</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">Ensoleillement & Temp.</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-slate-900">28.5°C</span>
              <span className="text-xs text-slate-500 font-medium">HR : 78%</span>
            </div>
            <span className="text-[11px] text-slate-400 block">Indice thermique favorable au maïs</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">Vigilance Phyto</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-sm font-black text-rose-700">Chenille Légionnaire</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Modéré</span>
            </div>
            <span className="text-[11px] text-slate-400 block">Pièges à phéromones installés à Obala</span>
          </div>
        </div>
      </div>

      {/* Stades Phénologiques en Temps Réel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-700" />
              Suivi des Stades Phénologiques par Parcelle Agricole
            </h2>
            <p className="text-xs text-slate-500">
              État d’avancement des cultures en place, dates clés du calendrier cultural et vigilances agronomiques.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
            Campagne 2026-A en cours
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stadesPhenologiques.map((item) => (
            <div key={item.parcelle} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-900">
                      {item.parcelle}
                    </span>
                    <span className="font-bold text-slate-800 text-xs">{item.culture}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Exploitant : {item.producteur}</div>
                </div>
                <span className="text-xs font-black text-slate-900">{item.progressionPct}%</span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                  <span>Stade : <strong className="text-slate-900">{item.stadeActuel}</strong></span>
                  <span className="text-slate-400">Semis : {item.semis} → Récolte : {item.recoltePrevue}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full ${item.couleur} rounded-full transition-all`} style={{ width: `${item.progressionPct}%` }} />
                </div>
              </div>

              <div className="text-[11px] bg-white p-2 rounded-lg border border-slate-200/80 text-slate-600 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{item.alerte}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cahier d'Interventions Culturales (CRUD) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Cahier des Interventions & Travaux aux Champs (Registre Phyto & Intrants)
            </h2>
            <p className="text-xs text-slate-500">
              Historique vérifiable des intrants épandus, main d'œuvre mobilisée et conformité cahier des charges coopératif.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none w-44"
              />
            </div>

            {/* Filter */}
            <select
              value={filterCulture}
              onChange={(e) => setFilterCulture(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-medium text-slate-700 outline-none"
            >
              <option value="all">Toutes les cultures</option>
              <option value="Maïs">Maïs</option>
              <option value="Soja">Soja</option>
              <option value="Manioc">Manioc</option>
              <option value="Plantain">Plantain</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Date & Réf</th>
                <th className="py-3 px-4">Parcelle & Membre</th>
                <th className="py-3 px-4">Culture</th>
                <th className="py-3 px-4">Travail Réalisé</th>
                <th className="py-3 px-4">Dose / Intrant Utilisé</th>
                <th className="py-3 px-4">Opérateur / Agronome</th>
                <th className="py-3 px-4 text-right">Coût (FCFA)</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInterventions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{item.date}</span>
                    <span className="font-mono text-[10px] text-slate-400">{item.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{item.parcelleCode}</span>
                    <span className="text-[11px] text-slate-500">{item.cooperateurNom}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{item.culture}</td>
                  <td className="py-3 px-4 font-bold text-emerald-800">{item.typeTravail}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-800 font-mono text-[11px] px-1.5 py-0.5 rounded">
                      {item.intrantDose}
                    </span>
                    {item.observation && (
                      <span className="text-[10px] text-slate-500 block mt-0.5 truncate max-w-xs" title={item.observation}>
                        {item.observation}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-700">{item.operateur}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {item.coutFCFA.toLocaleString()} F
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.statut === 'Terminé'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.statut === 'En cours'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.statut}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {canPerform('edit', 'agriculture') && (
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {canPerform('delete', 'agriculture') && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajout / Modification d'Intervention */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-700" />
                {editingId ? "Modifier l'Intervention Culturale" : 'Enregistrer une Opération aux Champs'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date d'intervention</label>
                  <input
                    type="date"
                    required
                    value={formState.date}
                    onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Type de travail</label>
                  <select
                    value={formState.typeTravail}
                    onChange={(e) =>
                      setFormState({ ...formState, typeTravail: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none font-medium"
                  >
                    <option value="Semis">Semis</option>
                    <option value="Sarclage">Sarclage</option>
                    <option value="Fertilisation NPK">Fertilisation NPK</option>
                    <option value="Traitement Phyto">Traitement Phyto</option>
                    <option value="Irrigation">Irrigation</option>
                    <option value="Récolte">Récolte</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Code Parcelle</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: PARC-OBAL-001"
                    value={formState.parcelleCode}
                    onChange={(e) => setFormState({ ...formState, parcelleCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Culture & Variété</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Maïs CMS 8704"
                    value={formState.culture}
                    onChange={(e) => setFormState({ ...formState, culture: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Exploitant / Producteur</label>
                  <input
                    type="text"
                    required
                    value={formState.cooperateurNom}
                    onChange={(e) => setFormState({ ...formState, cooperateurNom: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Opérateur / Responsable</label>
                  <input
                    type="text"
                    required
                    value={formState.operateur}
                    onChange={(e) => setFormState({ ...formState, operateur: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Dose / Intrant Appliqué</label>
                <input
                  type="text"
                  required
                  placeholder="ex: NPK 20-10-10 (200 kg/ha)"
                  value={formState.intrantDose}
                  onChange={(e) => setFormState({ ...formState, intrantDose: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Coût Main d'œuvre / Intrant (FCFA)</label>
                  <input
                    type="number"
                    required
                    value={formState.coutFCFA}
                    onChange={(e) => setFormState({ ...formState, coutFCFA: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Statut</label>
                  <select
                    value={formState.statut}
                    onChange={(e) =>
                      setFormState({ ...formState, statut: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none font-bold"
                  >
                    <option value="Planifié">Planifié</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Observations phytosanitaires / agronomiques</label>
                <textarea
                  rows={2}
                  placeholder="Notes sur la levée, état d'humidité, adventices..."
                  value={formState.observation}
                  onChange={(e) => setFormState({ ...formState, observation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-xs"
                >
                  {editingId ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

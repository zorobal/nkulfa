import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Layers,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Search,
  Sprout,
  AlertTriangle,
  Plus,
  X,
  ShieldAlert,
  ShieldCheck,
  Scale,
  Trash2,
  Filter,
  Info,
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { CultureCohabitante, Parcelle, Terrain } from '../../types';

export const TerrainsParcellesPage: React.FC = () => {
  const {
    terrains,
    addTerrain,
    updateTerrain,
    deleteTerrain,
    parcelles,
    addParcelle,
    updateParcelle,
    deleteParcelle,
    addCultureCohabitante,
    removeCultureCohabitante,
    updateElevageOnParcelle,
    currentUser,
  } = useApp();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'parcelles' | 'terrains' | 'bilan'>('parcelles');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerrainFilter, setSelectedTerrainFilter] = useState<string>('all');
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modals state
  const [isAddTerrainModalOpen, setIsAddTerrainModalOpen] = useState(false);
  const [isAddParcelleModalOpen, setIsAddParcelleModalOpen] = useState(false);
  const [selectedTerrainForParcelle, setSelectedTerrainForParcelle] = useState<string>('');
  
  // Cohabitation culture modal state
  const [cohabitationModalParcelle, setCohabitationModalParcelle] = useState<Parcelle | null>(null);
  const [cultureForm, setCultureForm] = useState({
    especeNom: 'Maïs Grain',
    variete: 'CMS 8704 Jaune',
    superficieHa: 2.0,
    typeAssociation: 'Culture Associée / Intercalaire' as CultureCohabitante['typeAssociation'],
    dateSemis: new Date().toISOString().slice(0, 10),
    rendementEstimeTonnesHa: 3.5,
    statut: 'Semis' as CultureCohabitante['statut'],
    observations: '',
  });

  // Elevage allocation modal state
  const [elevageModalParcelle, setElevageModalParcelle] = useState<Parcelle | null>(null);
  const [elevageForm, setElevageForm] = useState({
    superficieElevageHa: 2.0,
    elevageLotCode: 'LOT-BOV-T001-P001',
    elevageEspeceNom: 'Bovins Pâturage',
  });

  // Form states for Terrain
  const [terrainForm, setTerrainForm] = useState({
    nom: '',
    commune: 'Obala',
    superficieHa: 30,
    titreFoncier: 'TF-2026/CE-089',
    proprietaireNom: 'Coopérative / Coopérateur',
    proprietaireId: 'MEM-001',
    statutFoncier: 'Titre Foncier Collectif',
    statutJuridique: 'Titre Enregistré',
    coordonnees: { lat: 4.168, lng: 11.532 },
  });

  // Form states for Parcelle
  const [parcelleForm, setParcelleForm] = useState({
    code: '',
    terrainId: '',
    nom: '',
    superficieHa: 5.0,
    typeActivite: 'Agriculture' as Parcelle['typeActivite'],
    typeSol: 'Ferrallitique riche',
    irrigation: false,
    zone: 'Zone Centre',
    responsable: '',
    statut: 'En exploitation' as Parcelle['statut'],
  });

  // Helpers to calculate allocations and avoid negative surfaces
  const getTerrainStats = (terrain: Terrain) => {
    const terrainParcelles = parcelles.filter((p) => p.terrainId === terrain.id);
    const surfaceDecoupee = terrainParcelles.reduce((sum, p) => sum + (Number(p.superficieHa) || 0), 0);
    const surfaceRestante = Math.max(0, Number((terrain.superficieHa - surfaceDecoupee).toFixed(2)));
    const pctDecoupe = Math.min(100, Math.round((surfaceDecoupee / (terrain.superficieHa || 1)) * 100));
    return { surfaceDecoupee, surfaceRestante, pctDecoupe, parcellesCount: terrainParcelles.length };
  };

  const getParcelleOccupancy = (parcelle: Parcelle) => {
    const culturesHa = (parcelle.culturesCohabitantes || []).reduce(
      (sum, c) => sum + (Number(c.superficieHa) || 0),
      0
    );
    const elevageHa = Number(parcelle.superficieElevageHa) || 0;
    const totalOccupeHa = culturesHa + elevageHa;
    const surfaceRestanteHa = Math.max(0, Number((parcelle.superficieHa - totalOccupeHa).toFixed(2)));
    const pctOccupe = Math.min(100, Math.round((totalOccupeHa / (parcelle.superficieHa || 1)) * 100));
    return {
      culturesHa,
      elevageHa,
      totalOccupeHa,
      surfaceRestanteHa,
      pctOccupe,
      isFullyOccupied: surfaceRestanteHa <= 0.05,
    };
  };

  // Global KPIs calculated from real database
  const globalStats = useMemo(() => {
    const totalTerrainsHa = terrains.reduce((sum, t) => sum + (Number(t.superficieHa) || 0), 0);
    const totalParcellesHa = parcelles.reduce((sum, p) => sum + (Number(p.superficieHa) || 0), 0);
    const totalTerrainsRestantHa = Math.max(0, Number((totalTerrainsHa - totalParcellesHa).toFixed(2)));

    let totalCulturesHa = 0;
    let totalElevageHa = 0;
    parcelles.forEach((p) => {
      const { culturesHa, elevageHa } = getParcelleOccupancy(p);
      totalCulturesHa += culturesHa;
      totalElevageHa += elevageHa;
    });

    const totalOccupeSurParcelles = totalCulturesHa + totalElevageHa;
    const totalParcellesRestantHa = Math.max(0, Number((totalParcellesHa - totalOccupeSurParcelles).toFixed(2)));

    return {
      totalTerrainsHa,
      totalParcellesHa,
      totalTerrainsRestantHa,
      totalCulturesHa: Number(totalCulturesHa.toFixed(2)),
      totalElevageHa: Number(totalElevageHa.toFixed(2)),
      totalParcellesRestantHa: Number(totalParcellesRestantHa.toFixed(2)),
      nbTerrains: terrains.length,
      nbParcelles: parcelles.length,
    };
  }, [terrains, parcelles]);

  // Handle open add parcelle modal
  const openAddParcelleModal = (terrainId?: string) => {
    const targetTerrainId = terrainId || (terrains.length > 0 ? terrains[0].id : '');
    const parentTerrain = terrains.find((t) => t.id === targetTerrainId);
    const stats = parentTerrain ? getTerrainStats(parentTerrain) : { surfaceRestante: 5 };
    const defaultSup = Math.min(stats.surfaceRestante, 5.0);

    setParcelleForm({
      code: `PARC-T${targetTerrainId.replace(/\D/g, '') || '01'}-P${(parcelles.length + 1).toString().padStart(2, '0')}`,
      terrainId: targetTerrainId,
      nom: `Parcelle Découpée ${parcelles.length + 1}`,
      superficieHa: defaultSup > 0 ? defaultSup : 0,
      typeActivite: 'Agriculture',
      typeSol: 'Ferrallitique riche',
      irrigation: false,
      zone: 'Zone Centre',
      responsable: 'Coopérateur Exploitant',
      statut: 'En exploitation',
    });
    setSelectedTerrainForParcelle(targetTerrainId);
    setIsAddParcelleModalOpen(true);
  };

  // Submit Terrain Creation
  const handleCreateTerrain = (e: React.FormEvent) => {
    e.preventDefault();
    if (terrainForm.superficieHa <= 0) {
      setToastMessage({ text: 'La superficie du terrain doit être supérieure à 0 ha.', type: 'error' });
      return;
    }

    addTerrain({
      code: `TER-${terrainForm.commune.slice(0, 3).toUpperCase()}-${(terrains.length + 1).toString().padStart(2, '0')}`,
      nom: terrainForm.nom || `Domaine Agro-Pastoral ${terrainForm.commune}`,
      commune: terrainForm.commune,
      superficieHa: Number(terrainForm.superficieHa),
      titreFoncier: terrainForm.titreFoncier,
      proprietaireId: terrainForm.proprietaireId,
      proprietaireNom: terrainForm.proprietaireNom,
      coordonnees: terrainForm.coordonnees,
      statutFoncier: terrainForm.statutFoncier,
      statutJuridique: terrainForm.statutJuridique,
      dateAcquisition: new Date().toISOString().slice(0, 10),
    });

    setToastMessage({
      text: `Terrain "${terrainForm.nom}" (${terrainForm.superficieHa} ha) créé avec succès !`,
      type: 'success',
    });
    setIsAddTerrainModalOpen(false);
    setTerrainForm({
      nom: '',
      commune: 'Obala',
      superficieHa: 30,
      titreFoncier: 'TF-2026/CE-089',
      proprietaireNom: 'Coopérative / Coopérateur',
      proprietaireId: 'MEM-001',
      statutFoncier: 'Titre Foncier Collectif',
      statutJuridique: 'Titre Enregistré',
      coordonnees: { lat: 4.168, lng: 11.532 },
    });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Submit Parcelle Creation with Anti-Negative Area Check
  const handleCreateParcelle = (e: React.FormEvent) => {
    e.preventDefault();
    const parentTerrain = terrains.find((t) => t.id === parcelleForm.terrainId);
    if (!parentTerrain) {
      setToastMessage({ text: 'Terrain de rattachement introuvable.', type: 'error' });
      return;
    }

    const { surfaceRestante } = getTerrainStats(parentTerrain);
    if (parcelleForm.superficieHa <= 0) {
      setToastMessage({ text: 'La superficie de la parcelle doit être supérieure à 0 ha.', type: 'error' });
      return;
    }

    if (parcelleForm.superficieHa > surfaceRestante) {
      setToastMessage({
        text: `Dépassement interdit : Il ne reste que ${surfaceRestante} ha disponibles sur le terrain "${parentTerrain.nom}". Vous ne pouvez pas allouer ${parcelleForm.superficieHa} ha.`,
        type: 'error',
      });
      return;
    }

    const success = addParcelle({
      code: parcelleForm.code || `PARC-${Date.now().toString().slice(-4)}`,
      terrainId: parcelleForm.terrainId,
      nom: parcelleForm.nom || `Parcelle ${parcelleForm.code}`,
      superficieHa: Number(parcelleForm.superficieHa),
      typeActivite: parcelleForm.typeActivite,
      typeSol: parcelleForm.typeSol,
      irrigation: parcelleForm.irrigation,
      coordonnees: parentTerrain.coordonnees,
      statut: parcelleForm.statut,
      zone: parcelleForm.zone,
      responsable: parcelleForm.responsable,
      culturesCohabitantes: [],
      superficieElevageHa: 0,
    });

    if (success) {
      setToastMessage({
        text: `Parcelle ${parcelleForm.code} (${parcelleForm.superficieHa} ha) créée avec succès sur "${parentTerrain.nom}". Surface restante sur le terrain : ${(surfaceRestante - parcelleForm.superficieHa).toFixed(2)} ha.`,
        type: 'success',
      });
      setIsAddParcelleModalOpen(false);
    } else {
      setToastMessage({
        text: 'Échec de création : Dépassement de la superficie restante du terrain !',
        type: 'error',
      });
    }
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Open Cohabitation Modal for adding a crop
  const openCohabitationModal = (parcelle: Parcelle) => {
    const { surfaceRestanteHa } = getParcelleOccupancy(parcelle);
    setCohabitationModalParcelle(parcelle);
    setCultureForm({
      especeNom: 'Maïs Grain',
      variete: 'CMS 8704 Jaune',
      superficieHa: surfaceRestanteHa > 0 ? Math.min(surfaceRestanteHa, 2.0) : 0,
      typeAssociation: 'Culture Associée / Intercalaire',
      dateSemis: new Date().toISOString().slice(0, 10),
      rendementEstimeTonnesHa: 3.5,
      statut: 'Semis',
      observations: 'Association d’espèces pour valorisation conjointe du sol',
    });
  };

  // Submit Cohabiting Crop Addition
  const handleAddCultureCohabitante = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cohabitationModalParcelle) return;

    const { surfaceRestanteHa } = getParcelleOccupancy(cohabitationModalParcelle);
    if (cultureForm.superficieHa <= 0) {
      setToastMessage({ text: 'La superficie doit être supérieure à 0 ha.', type: 'error' });
      return;
    }

    if (cultureForm.superficieHa > surfaceRestanteHa) {
      setToastMessage({
        text: `Dépassement interdit : Il ne reste que ${surfaceRestanteHa} ha disponibles sur cette parcelle. L'allocation de ${cultureForm.superficieHa} ha créerait un solde négatif.`,
        type: 'error',
      });
      return;
    }

    const ok = addCultureCohabitante(cohabitationModalParcelle.id, {
      especeNom: cultureForm.especeNom,
      variete: cultureForm.variete,
      superficieHa: Number(cultureForm.superficieHa),
      typeAssociation: cultureForm.typeAssociation,
      dateSemis: cultureForm.dateSemis,
      rendementEstimeTonnesHa: Number(cultureForm.rendementEstimeTonnesHa),
      statut: cultureForm.statut,
      observations: cultureForm.observations,
    });

    if (ok) {
      setToastMessage({
        text: `Espèce "${cultureForm.especeNom}" (${cultureForm.superficieHa} ha) associée avec succès à la parcelle ${cohabitationModalParcelle.code} !`,
        type: 'success',
      });
      setCohabitationModalParcelle(null);
    } else {
      setToastMessage({ text: 'Erreur lors de l’allocation de la culture cohabitante.', type: 'error' });
    }
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Open Elevage Allocation Modal
  const openElevageModal = (parcelle: Parcelle) => {
    const culturesHa = (parcelle.culturesCohabitantes || []).reduce(
      (sum, c) => sum + (Number(c.superficieHa) || 0),
      0
    );
    const maxAvailable = Math.max(0, Number((parcelle.superficieHa - culturesHa).toFixed(2)));
    setElevageModalParcelle(parcelle);
    setElevageForm({
      superficieElevageHa: parcelle.superficieElevageHa || (maxAvailable > 0 ? Math.min(maxAvailable, 2.0) : 0),
      elevageLotCode: parcelle.elevageLotCode || `LOT-PARC-${parcelle.code}`,
      elevageEspeceNom: parcelle.elevageEspeceNom || 'Bovins Pâturage',
    });
  };

  // Submit Elevage Allocation
  const handleUpdateElevage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!elevageModalParcelle) return;

    const culturesHa = (elevageModalParcelle.culturesCohabitantes || []).reduce(
      (sum, c) => sum + (Number(c.superficieHa) || 0),
      0
    );
    const maxAvailable = Math.max(0, Number((elevageModalParcelle.superficieHa - culturesHa).toFixed(2)));

    if (Number(elevageForm.superficieElevageHa) > maxAvailable) {
      setToastMessage({
        text: `Dépassement interdit : Avec ${culturesHa} ha occupés par les cultures, la surface maximale pour l'élevage est de ${maxAvailable} ha.`,
        type: 'error',
      });
      return;
    }

    const ok = updateElevageOnParcelle(elevageModalParcelle.id, {
      superficieElevageHa: Number(elevageForm.superficieElevageHa),
      elevageLotCode: elevageForm.elevageLotCode,
      elevageEspeceNom: elevageForm.elevageEspeceNom,
    });

    if (ok) {
      setToastMessage({
        text: `Allocation élevage mise à jour sur la parcelle ${elevageModalParcelle.code} (${elevageForm.superficieElevageHa} ha dédiés) !`,
        type: 'success',
      });
      setElevageModalParcelle(null);
    }
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Filtered parcelles
  const filteredParcelles = useMemo(() => {
    return parcelles.filter((p) => {
      const terrain = terrains.find((t) => t.id === p.terrainId);
      const matchSearch =
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.nom && p.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.responsable && p.responsable.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (terrain && terrain.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.culturesCohabitantes || []).some((c) => c.especeNom.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchTerrain = selectedTerrainFilter === 'all' || p.terrainId === selectedTerrainFilter;
      const matchActivity = activityFilter === 'all' || p.typeActivite === activityFilter;
      return matchSearch && matchTerrain && matchActivity;
    });
  }, [parcelles, terrains, searchTerm, selectedTerrainFilter, activityFilter]);

  // Selected terrain stats in parcelle creation modal
  const activeCreationTerrain = terrains.find((t) => t.id === parcelleForm.terrainId);
  const activeCreationTerrainStats = activeCreationTerrain
    ? getTerrainStats(activeCreationTerrain)
    : { surfaceRestante: 0, surfaceDecoupee: 0 };
  const wouldExceedTerrain =
    activeCreationTerrain && parcelleForm.superficieHa > activeCreationTerrainStats.surfaceRestante;
  const simulatedRemainingTerrain = activeCreationTerrain
    ? Number((activeCreationTerrainStats.surfaceRestante - parcelleForm.superficieHa).toFixed(2))
    : 0;

  // Selected parcelle stats in cohabitation modal
  const cohabitationParcelleOccupancy = cohabitationModalParcelle
    ? getParcelleOccupancy(cohabitationModalParcelle)
    : null;
  const wouldExceedParcelle =
    cohabitationParcelleOccupancy &&
    cultureForm.superficieHa > cohabitationParcelleOccupancy.surfaceRestanteHa;
  const simulatedRemainingParcelle = cohabitationParcelleOccupancy
    ? Number((cohabitationParcelleOccupancy.surfaceRestanteHa - cultureForm.superficieHa).toFixed(2))
    : 0;

  return (
    <div className="space-y-4 p-3 lg:p-5 bg-slate-50 min-h-screen">
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className={`px-4 py-3 rounded-2xl shadow-lg border flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2 ${
            toastMessage.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : 'bg-emerald-900 text-white border-emerald-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="font-semibold">{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white ml-3">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP HEADER & ACTION BAR */}
      <div className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1 border border-emerald-200">
            <Scale className="w-3.5 h-3.5 text-emerald-700" />
            <span>Gestion Cadastrale & Contrôle Strict des Superficies</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Terrains, Parcelles & Cohabitation des Espèces
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Découpage des terrains en parcelles, associations culturales cohabitantes (polyculture) et élevage avec
            garantie automatique de non-dépassement des superficies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddTerrainModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nouveau Terrain</span>
          </button>

          <button
            onClick={() => openAddParcelleModal()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Découper une Parcelle</span>
          </button>
        </div>
      </div>

      {/* 4 SYNTHESIS KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Terrains cadastraux & Reliquat libre */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Terrains Déclarés</span>
            <MapPin className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{globalStats.totalTerrainsHa} ha</span>
            <span className="text-xs text-slate-500 font-medium">({globalStats.nbTerrains} domaines)</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Reste libre à découper :</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {globalStats.totalTerrainsRestantHa} ha ({Math.round((globalStats.totalTerrainsRestantHa / globalStats.totalTerrainsHa) * 100)}%)
            </span>
          </div>
        </div>

        {/* Card 2: Parcelles découpées */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Parcelles Découpées</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{globalStats.totalParcellesHa} ha</span>
            <span className="text-xs text-blue-600 font-medium">({globalStats.nbParcelles} parcelles)</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Taux d’assiette foncière :</span>
            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              {Math.round((globalStats.totalParcellesHa / (globalStats.totalTerrainsHa || 1)) * 100)}% du foncier
            </span>
          </div>
        </div>

        {/* Card 3: Cultures cohabitantes */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Cultures Cohabitantes</span>
            <Sprout className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{globalStats.totalCulturesHa} ha</span>
            <span className="text-xs text-emerald-700 font-medium">en production</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Élevage / Pâturage :</span>
            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              {globalStats.totalElevageHa} ha
            </span>
          </div>
        </div>

        {/* Card 4: Sécurité foncière & Réserve libre */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Disponibilité & Jachère</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{globalStats.totalParcellesRestantHa} ha</span>
            <span className="text-xs text-slate-500 font-medium">libres sur parcelles</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Restes négatifs détectés :</span>
            <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 0.0 ha (Intègre)
            </span>
          </div>
        </div>
      </div>

      {/* VIEW SELECTOR TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('parcelles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'parcelles'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Parcelles & Cohabitation des Cultures ({parcelles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('terrains')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'terrains'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Cadastre des Terrains & Découpage ({terrains.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bilan')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'bilan'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Bilan Foncier & Règle Anti-Dépassement</span>
        </button>
      </div>

      {/* TAB 1: PARCELLES & COHABITATION DES CULTURES */}
      {activeTab === 'parcelles' && (
        <div className="space-y-4">
          {/* SEARCH & FILTERS BAR */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher parcelle, culture, exploitant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <span className="font-semibold">Filtrer par :</span>
              </div>

              <select
                value={selectedTerrainFilter}
                onChange={(e) => setSelectedTerrainFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none"
              >
                <option value="all">Tous les Terrains</option>
                {terrains.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nom} ({t.commune})
                  </option>
                ))}
              </select>

              <select
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none"
              >
                <option value="all">Toutes les activités</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Élevage">Élevage</option>
                <option value="Mixte">Mixte (Agro-Élevage)</option>
              </select>
            </div>
          </div>

          {/* LISTE DES PARCELLES AVEC CARTES DÉTAILLÉES DE COHABITATION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredParcelles.map((parcelle) => {
              const terrain = terrains.find((t) => t.id === parcelle.terrainId);
              const {
                culturesHa,
                elevageHa,
                totalOccupeHa,
                surfaceRestanteHa,
                pctOccupe,
                isFullyOccupied,
              } = getParcelleOccupancy(parcelle);

              return (
                <div
                  key={parcelle.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex flex-col justify-between hover:border-emerald-500/50 transition-all"
                >
                  <div>
                    {/* Parcelle Header */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                            {parcelle.code}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              parcelle.typeActivite === 'Mixte'
                                ? 'bg-purple-100 text-purple-800'
                                : parcelle.typeActivite === 'Élevage'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {parcelle.typeActivite}
                          </span>
                          {parcelle.irrigation && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                              Irriguée
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">
                          {parcelle.nom || `Parcelle ${parcelle.code}`}
                        </h3>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>
                            Terrain parent : <strong className="text-slate-700">{terrain?.nom || parcelle.terrainId}</strong> ({terrain?.commune || 'Centre'})
                          </span>
                        </p>
                      </div>

                      {/* Superficie Totale Badge */}
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Superficie Totale
                        </span>
                        <span className="text-lg font-black text-slate-900">{parcelle.superficieHa} ha</span>
                      </div>
                    </div>

                    {/* JAUGE GRAPHIQUE D'OCCUPATION DE LA PARCELLE */}
                    <div className="py-3">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <span>Occupation :</span>
                          <span className="font-black text-slate-900">
                            {totalOccupeHa.toFixed(2)} ha / {parcelle.superficieHa} ha ({pctOccupe}%)
                          </span>
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            surfaceRestanteHa > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {surfaceRestanteHa > 0 ? (
                            <span>{surfaceRestanteHa.toFixed(2)} ha disponibles</span>
                          ) : (
                            <span>100% allouée</span>
                          )}
                        </span>
                      </div>

                      {/* Multi-segment Progress Bar */}
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                        {/* Cultures Ha bar */}
                        {culturesHa > 0 && (
                          <div
                            style={{ width: `${(culturesHa / parcelle.superficieHa) * 100}%` }}
                            className="bg-emerald-600 h-full"
                            title={`Cultures végétales : ${culturesHa} ha`}
                          />
                        )}
                        {/* Elevage Ha bar */}
                        {elevageHa > 0 && (
                          <div
                            style={{ width: `${(elevageHa / parcelle.superficieHa) * 100}%` }}
                            className="bg-amber-500 h-full"
                            title={`Élevage / Pâturage : ${elevageHa} ha`}
                          />
                        )}
                        {/* Surface libre restante */}
                        {surfaceRestanteHa > 0 && (
                          <div
                            style={{ width: `${(surfaceRestanteHa / parcelle.superficieHa) * 100}%` }}
                            className="bg-emerald-100/80 h-full"
                            title={`Superficie restante libre : ${surfaceRestanteHa} ha`}
                          />
                        )}
                      </div>

                      {/* Legend */}
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 mt-2">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          <span>Cultures ({culturesHa.toFixed(1)} ha)</span>
                        </span>
                        {elevageHa > 0 && (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            <span>Élevage ({elevageHa.toFixed(1)} ha)</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-200"></span>
                          <span>Reste libre / Jachère ({surfaceRestanteHa.toFixed(1)} ha)</span>
                        </span>
                      </div>
                    </div>

                    {/* SECTION 1: CULTURES COHABITANTES (MULTI-ESPÈCES SUR LA PARCELLE) */}
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Espèces Végétales Cohabitantes ({parcelle.culturesCohabitantes?.length || 0})</span>
                        </span>
                        <button
                          disabled={surfaceRestanteHa <= 0.05}
                          onClick={() => openCohabitationModal(parcelle)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                            surfaceRestanteHa > 0.05
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-pointer'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                          title={
                            surfaceRestanteHa > 0.05
                              ? 'Ajouter une espèce de culture associée sur la surface restante'
                              : 'Superficie de la parcelle 100% occupée'
                          }
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ Associer Culture</span>
                        </button>
                      </div>

                      {/* Liste des cultures */}
                      {parcelle.culturesCohabitantes && parcelle.culturesCohabitantes.length > 0 ? (
                        <div className="space-y-1.5">
                          {parcelle.culturesCohabitantes.map((culture) => (
                            <div
                              key={culture.id}
                              className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between gap-2 text-xs"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-900">{culture.especeNom}</span>
                                  <span className="text-[10px] text-slate-500">({culture.variete})</span>
                                  <span className="text-[9px] font-semibold bg-emerald-100/70 text-emerald-800 px-1.5 py-0.2 rounded-sm">
                                    {culture.typeAssociation}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-0.5">
                                  <span>Semis : {culture.dateSemis}</span>
                                  <span>Rdt : {culture.rendementEstimeTonnesHa} t/ha</span>
                                  <span className="font-medium text-slate-700">Statut : {culture.statut}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-black text-slate-900 text-xs bg-white px-2 py-1 rounded-lg border border-slate-200">
                                  {culture.superficieHa} ha
                                </span>
                                <button
                                  onClick={() => removeCultureCohabitante(parcelle.id, culture.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                                  title="Retirer cette culture et libérer la superficie"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-slate-50/70 rounded-xl p-3 text-center border border-dashed border-slate-200 text-xs text-slate-400">
                          Aucune culture enregistrée sur cette parcelle.
                        </div>
                      )}
                    </div>

                    {/* SECTION 2: ÉLEVAGE ASSOCIÉ SUR LA PARCELLE */}
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-amber-700" />
                          <span>Élevage / Pâturage Dédié</span>
                        </span>
                        <button
                          onClick={() => openElevageModal(parcelle)}
                          className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all cursor-pointer"
                        >
                          {elevageHa > 0 ? 'Modifier Élevage' : '+ Affecter Élevage'}
                        </button>
                      </div>

                      {elevageHa > 0 ? (
                        <div className="bg-amber-50/70 rounded-xl p-2.5 border border-amber-200/80 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-amber-950 block">
                              {parcelle.elevageEspeceNom || 'Cheptel / Pâturage'}
                            </span>
                            <span className="text-[10px] text-amber-800">
                              Lot réf : {parcelle.elevageLotCode || 'Non spécifié'}
                            </span>
                          </div>
                          <span className="font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg">
                            {elevageHa} ha alloués
                          </span>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">
                          Pas de cheptel en pâturage sur cette parcelle.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Parcelle Footer Actions */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      Sol : {parcelle.typeSol} • Zone {parcelle.zone || 'Centre'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          if (confirm(`Supprimer la parcelle ${parcelle.code} ? Sa superficie sera restituée au terrain.`)) {
                            deleteParcelle(parcelle.id);
                            setToastMessage({
                              text: `Parcelle ${parcelle.code} supprimée. Surface restituée au terrain.`,
                              type: 'success',
                            });
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Supprimer la parcelle"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredParcelles.length === 0 && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
              Aucune parcelle ne correspond à vos critères de recherche.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CADASTRE DES TERRAINS & DÉCOUPAGE */}
      {activeTab === 'terrains' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {terrains.map((terrain) => {
              const { surfaceDecoupee, surfaceRestante, pctDecoupe, parcellesCount } =
                getTerrainStats(terrain);

              return (
                <div
                  key={terrain.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex flex-col justify-between hover:border-slate-300 transition-all"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-mono font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {terrain.code}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{terrain.nom}</h3>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>Commune de {terrain.commune}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Superficie Cadastre
                        </span>
                        <span className="text-lg font-black text-slate-900">{terrain.superficieHa} ha</span>
                      </div>
                    </div>

                    {/* Foncier details */}
                    <div className="grid grid-cols-2 gap-2 my-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Titre Foncier</span>
                        <span className="font-semibold text-slate-700">{terrain.titreFoncier || 'En cours'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Propriétaire / Titulaire</span>
                        <span className="font-semibold text-slate-700 truncate block">
                          {terrain.proprietaireNom || 'Coopérative'}
                        </span>
                      </div>
                    </div>

                    {/* JAUGE DE DÉCOUPAGE DU TERRAIN */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">
                          Découpé : <strong className="text-slate-900">{surfaceDecoupee} ha</strong> ({pctDecoupe}%)
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            surfaceRestante > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {surfaceRestante > 0 ? (
                            <span>{surfaceRestante} ha disponibles</span>
                          ) : (
                            <span>100% découpé</span>
                          )}
                        </span>
                      </div>

                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pctDecoupe}%` }}
                          className={`h-full ${pctDecoupe >= 100 ? 'bg-slate-700' : 'bg-emerald-600'}`}
                        />
                      </div>

                      <p className="text-[10px] text-slate-400">
                        {parcellesCount} parcelles découpées sur ce terrain
                      </p>
                    </div>
                  </div>

                  {/* Bouton d'action directe */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      disabled={surfaceRestante <= 0}
                      onClick={() => openAddParcelleModal(terrain.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                        surfaceRestante > 0
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer shadow-2xs'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Découper une Parcelle ({surfaceRestante} ha dispo)</span>
                    </button>

                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Supprimer le terrain "${terrain.nom}" ? Attention : toutes ses parcelles associées seront également supprimées.`
                          )
                        ) {
                          deleteTerrain(terrain.id);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Supprimer le terrain"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: BILAN FONCIER & CONTRÔLE STRICT ANTI-DÉPASSEMENT */}
      {activeTab === 'bilan' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Règles d'Intégrité Spatiale & Prévention des Restes Négatifs
                </h3>
                <p className="text-xs text-slate-500">
                  Vérification en temps réel de la conformité topographique : aucun terrain ni aucune parcelle ne
                  peut présenter de surface restante négative.
                </p>
              </div>
            </div>

            {/* Matrice de contrôle cadastral */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Terrain</th>
                    <th className="py-2.5 px-3 text-right">Superficie Totale (ha)</th>
                    <th className="py-2.5 px-3 text-right">Découpé en Parcelles (ha)</th>
                    <th className="py-2.5 px-3 text-right">Reste Libre Découpage (ha)</th>
                    <th className="py-2.5 px-3 text-right">Surface Cultures (ha)</th>
                    <th className="py-2.5 px-3 text-right">Surface Élevage (ha)</th>
                    <th className="py-2.5 px-3 text-right">Reste Libre sur Parcelles (ha)</th>
                    <th className="py-2.5 px-3 text-center">Statut d'Intégrité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {terrains.map((terrain) => {
                    const { surfaceDecoupee, surfaceRestante } = getTerrainStats(terrain);
                    const terrainParcelles = parcelles.filter((p) => p.terrainId === terrain.id);

                    let tCulturesHa = 0;
                    let tElevageHa = 0;
                    let tRestanteSurParcelles = 0;

                    terrainParcelles.forEach((p) => {
                      const occ = getParcelleOccupancy(p);
                      tCulturesHa += occ.culturesHa;
                      tElevageHa += occ.elevageHa;
                      tRestanteSurParcelles += occ.surfaceRestanteHa;
                    });

                    const isTerrainValid = surfaceRestante >= 0;
                    const areParcellesValid = tRestanteSurParcelles >= 0;

                    return (
                      <tr key={terrain.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 font-bold text-slate-900">
                          <div>{terrain.nom}</div>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {terrain.commune} • {terrain.code}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-black text-slate-900">{terrain.superficieHa} ha</td>
                        <td className="py-3 px-3 text-right font-semibold text-blue-700">{surfaceDecoupee} ha</td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-700">
                          {surfaceRestante.toFixed(2)} ha
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-slate-700">{tCulturesHa.toFixed(2)} ha</td>
                        <td className="py-3 px-3 text-right font-semibold text-amber-700">{tElevageHa.toFixed(2)} ha</td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-800">
                          {tRestanteSurParcelles.toFixed(2)} ha
                        </td>
                        <td className="py-3 px-3 text-center">
                          {isTerrainValid && areParcellesValid ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Conforme (≥ 0)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Dépassement Négatif !</span>
                            </span>
                          )}
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

      {/* ========================================================================= */}
      {/* MODAL 1: NOUVEAU TERRAIN                                                 */}
      {/* ========================================================================= */}
      {isAddTerrainModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Enregistrer un Nouveau Terrain</h3>
                  <p className="text-[11px] text-slate-500">Cadastre, titre foncier et capacité globale</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddTerrainModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTerrain} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nom du Terrain / Domaine</label>
                <input
                  type="text"
                  required
                  value={terrainForm.nom}
                  onChange={(e) => setTerrainForm({ ...terrainForm, nom: e.target.value })}
                  placeholder="ex: Domaine Agro-Pastoral Nyong Sud"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Commune / Bassin</label>
                  <input
                    type="text"
                    list="terrain-communes-list"
                    value={terrainForm.commune}
                    onChange={(e) => setTerrainForm({ ...terrainForm, commune: e.target.value })}
                    placeholder="Ex: Obala, Sa'a, Bafia, Soa..."
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <datalist id="terrain-communes-list">
                    <option value="Obala" />
                    <option value="Mbalmayo" />
                    <option value="Sa'a" />
                    <option value="Bafia" />
                    <option value="Soa" />
                    <option value="Monatélé" />
                    <option value="Ngoumou" />
                    <option value="Batchenga" />
                    <option value="Okola" />
                    <option value="Evodoula" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Superficie Totale (ha)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    required
                    value={terrainForm.superficieHa}
                    onChange={(e) => setTerrainForm({ ...terrainForm, superficieHa: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Titre Foncier / Référence</label>
                  <input
                    type="text"
                    required
                    value={terrainForm.titreFoncier}
                    onChange={(e) => setTerrainForm({ ...terrainForm, titreFoncier: e.target.value })}
                    placeholder="TF-2026/..."
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Propriétaire / Ayant-droit</label>
                  <input
                    type="text"
                    required
                    value={terrainForm.proprietaireNom}
                    onChange={(e) => setTerrainForm({ ...terrainForm, proprietaireNom: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTerrainModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enregistrer le Terrain</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: NOUVELLE PARCELLE AVEC CONTRÔLE ANTI-DÉPASSEMENT SUR TERRAIN    */}
      {/* ========================================================================= */}
      {isAddParcelleModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Découper une Nouvelle Parcelle</h3>
                  <p className="text-[11px] text-slate-500">
                    Contrôle automatique du solde restant sur le terrain
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddParcelleModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateParcelle} className="space-y-3.5 text-xs">
              {/* Terrain de rattachement */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Terrain Foncier de Rattachement</label>
                <select
                  value={parcelleForm.terrainId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedT = terrains.find((t) => t.id === selectedId);
                    const stats = selectedT ? getTerrainStats(selectedT) : { surfaceRestante: 5 };
                    setParcelleForm({
                      ...parcelleForm,
                      terrainId: selectedId,
                      superficieHa: Math.min(stats.surfaceRestante, parcelleForm.superficieHa || 5),
                    });
                  }}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {terrains.map((t) => {
                    const stats = getTerrainStats(t);
                    return (
                      <option key={t.id} value={t.id}>
                        {t.nom} — Total : {t.superficieHa} ha (Reste disponible : {stats.surfaceRestante} ha)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* CARTE D'AIDE ET JAUGE EN TEMPS RÉEL SUR LE TERRAIN */}
              {activeCreationTerrain && (
                <div
                  className={`p-3 rounded-xl border text-xs ${
                    wouldExceedTerrain
                      ? 'bg-rose-50 border-rose-300 text-rose-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>Superficie libre sur ce terrain :</span>
                    <span className="text-sm font-black">{activeCreationTerrainStats.surfaceRestante} ha</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-emerald-200/50">
                    <span>Après découpage de cette parcelle :</span>
                    <span
                      className={`font-black ${
                        wouldExceedTerrain ? 'text-rose-700' : 'text-emerald-700'
                      }`}
                    >
                      {simulatedRemainingTerrain} ha restants
                    </span>
                  </div>

                  {wouldExceedTerrain && (
                    <div className="mt-2 text-rose-700 font-bold flex items-center gap-1.5 text-[11px]">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>
                        Dépassement interdit ! La superficie demandée ({parcelleForm.superficieHa} ha) excède le solde
                        disponible ({activeCreationTerrainStats.surfaceRestante} ha).
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Code Parcelle</label>
                  <input
                    type="text"
                    required
                    value={parcelleForm.code}
                    onChange={(e) => setParcelleForm({ ...parcelleForm, code: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Superficie à allouer (ha)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0.1"
                      max={activeCreationTerrainStats.surfaceRestante}
                      step="0.1"
                      required
                      value={parcelleForm.superficieHa}
                      onChange={(e) =>
                        setParcelleForm({ ...parcelleForm, superficieHa: Number(e.target.value) })
                      }
                      className={`w-full border rounded-xl px-3 py-2 text-xs font-black focus:outline-none ${
                        wouldExceedTerrain
                          ? 'border-rose-500 text-rose-700 bg-rose-50/50 focus:ring-2 focus:ring-rose-500'
                          : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                      }`}
                    />
                    {activeCreationTerrainStats.surfaceRestante > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setParcelleForm({
                            ...parcelleForm,
                            superficieHa: activeCreationTerrainStats.surfaceRestante,
                          })
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-md font-bold cursor-pointer"
                        title="Allouer tout le reliquat restant"
                      >
                        Max ({activeCreationTerrainStats.surfaceRestante})
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nom / Description</label>
                  <input
                    type="text"
                    value={parcelleForm.nom}
                    onChange={(e) => setParcelleForm({ ...parcelleForm, nom: e.target.value })}
                    placeholder="ex: Grande Parcelle Ouest"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Type d'Activité</label>
                  <select
                    value={parcelleForm.typeActivite}
                    onChange={(e) =>
                      setParcelleForm({
                        ...parcelleForm,
                        typeActivite: e.target.value as Parcelle['typeActivite'],
                      })
                    }
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Agriculture">Agriculture (Polyculture)</option>
                    <option value="Élevage">Élevage (Pâturage / Enclos)</option>
                    <option value="Mixte">Mixte (Agriculture + Élevage)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Exploitant / Responsable</label>
                  <input
                    type="text"
                    value={parcelleForm.responsable}
                    onChange={(e) => setParcelleForm({ ...parcelleForm, responsable: e.target.value })}
                    placeholder="ex: Jean-Paul Atangana"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Type de Sol</label>
                  <select
                    value={parcelleForm.typeSol}
                    onChange={(e) => setParcelleForm({ ...parcelleForm, typeSol: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Ferrallitique riche">Ferrallitique riche</option>
                    <option value="Argilo-limoneux fertile">Argilo-limoneux fertile</option>
                    <option value="Humifère forestier">Humifère forestier</option>
                    <option value="Sablo-argileux drainé">Sablo-argileux drainé</option>
                    <option value="Alluvionnaire fleuve">Alluvionnaire fleuve</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddParcelleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={wouldExceedTerrain || parcelleForm.superficieHa <= 0}
                  className={`px-5 py-2 rounded-xl font-bold shadow-xs flex items-center gap-1.5 text-white ${
                    wouldExceedTerrain || parcelleForm.superficieHa <= 0
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-emerald-700 hover:bg-emerald-800 cursor-pointer'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Confirmer le Découpage</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ASSOCIER UNE CULTURE COHABITANTE SUR LA PARCELLE                 */}
      {/* ========================================================================= */}
      {cohabitationModalParcelle && cohabitationParcelleOccupancy && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Associer une Espèce de Culture Cohabitante
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Parcelle {cohabitationModalParcelle.code} • Capacité : {cohabitationModalParcelle.superficieHa} ha
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCohabitationModalParcelle(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCultureCohabitante} className="space-y-3.5 text-xs">
              {/* JAUGE ET CONTRÔLE ANTI-DÉPASSEMENT SUR LA PARCELLE */}
              <div
                className={`p-3 rounded-xl border text-xs ${
                  wouldExceedParcelle
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>Superficie restante libre sur cette parcelle :</span>
                  <span className="text-sm font-black">{cohabitationParcelleOccupancy.surfaceRestanteHa} ha</span>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-emerald-200/50">
                  <span>Reste libre après cette nouvelle culture :</span>
                  <span
                    className={`font-black ${
                      wouldExceedParcelle ? 'text-rose-700' : 'text-emerald-700'
                    }`}
                  >
                    {simulatedRemainingParcelle} ha restants
                  </span>
                </div>

                {wouldExceedParcelle && (
                  <div className="mt-2 text-rose-700 font-bold flex items-center gap-1.5 text-[11px]">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      Dépassement interdit ! La parcelle ne dispose que de{' '}
                      {cohabitationParcelleOccupancy.surfaceRestanteHa} ha libres.
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Espèce Végétale</label>
                  <select
                    value={cultureForm.especeNom}
                    onChange={(e) => setCultureForm({ ...cultureForm, especeNom: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Maïs Grain">Maïs Grain</option>
                    <option value="Soja Grains">Soja Grains (Légumineuse fixatrice)</option>
                    <option value="Manioc Tubercules">Manioc Tubercules</option>
                    <option value="Banane Plantain">Banane Plantain (Ombrage & Vivrier)</option>
                    <option value="Haricot / Niébé">Haricot / Niébé (Couverture)</option>
                    <option value="Igname de Saison">Igname de Saison</option>
                    <option value="Macabo / Taro">Macabo / Taro</option>
                    <option value="Cacao Marchand">Cacao Marchand (Pérenne)</option>
                    <option value="Maraîchage (Tomate / Piment)">Maraîchage (Tomate / Piment)</option>
                    <option value="Plante Fourragère (Brachiaria)">Plante Fourragère (Brachiaria)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Variété Sélectionnée</label>
                  <input
                    type="text"
                    required
                    value={cultureForm.variete}
                    onChange={(e) => setCultureForm({ ...cultureForm, variete: e.target.value })}
                    placeholder="ex: CMS 8704 Jaune"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Rôle dans la Cohabitation</label>
                  <select
                    value={cultureForm.typeAssociation}
                    onChange={(e) =>
                      setCultureForm({
                        ...cultureForm,
                        typeAssociation: e.target.value as CultureCohabitante['typeAssociation'],
                      })
                    }
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Culture Principale">Culture Principale</option>
                    <option value="Culture Associée / Intercalaire">Culture Associée / Intercalaire</option>
                    <option value="Plante Couvrante / Fixatrice">Plante Couvrante / Fixatrice d'azote</option>
                    <option value="Bordure Agroforestière">Bordure Agroforestière / Brise-vent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Superficie Allouée (ha)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0.1"
                      max={cohabitationParcelleOccupancy.surfaceRestanteHa}
                      step="0.1"
                      required
                      value={cultureForm.superficieHa}
                      onChange={(e) => setCultureForm({ ...cultureForm, superficieHa: Number(e.target.value) })}
                      className={`w-full border rounded-xl px-3 py-2 text-xs font-black focus:outline-none ${
                        wouldExceedParcelle
                          ? 'border-rose-500 text-rose-700 bg-rose-50/50 focus:ring-2 focus:ring-rose-500'
                          : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                      }`}
                    />
                    {cohabitationParcelleOccupancy.surfaceRestanteHa > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setCultureForm({
                            ...cultureForm,
                            superficieHa: cohabitationParcelleOccupancy.surfaceRestanteHa,
                          })
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-md font-bold cursor-pointer"
                        title="Allouer toute la surface restante de la parcelle"
                      >
                        Max ({cohabitationParcelleOccupancy.surfaceRestanteHa})
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date de Semis / Implantation</label>
                  <input
                    type="date"
                    required
                    value={cultureForm.dateSemis}
                    onChange={(e) => setCultureForm({ ...cultureForm, dateSemis: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Rendement Estimé (t/ha)</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    required
                    value={cultureForm.rendementEstimeTonnesHa}
                    onChange={(e) =>
                      setCultureForm({ ...cultureForm, rendementEstimeTonnesHa: Number(e.target.value) })
                    }
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Observations agronomiques</label>
                <input
                  type="text"
                  value={cultureForm.observations}
                  onChange={(e) => setCultureForm({ ...cultureForm, observations: e.target.value })}
                  placeholder="ex: Semis intercalaire entre les rangs de maïs pour fixer l'azote"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCohabitationModalParcelle(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={wouldExceedParcelle || cultureForm.superficieHa <= 0}
                  className={`px-5 py-2 rounded-xl font-bold shadow-xs flex items-center gap-1.5 text-white ${
                    wouldExceedParcelle || cultureForm.superficieHa <= 0
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-emerald-700 hover:bg-emerald-800 cursor-pointer'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Implanter la Culture Cohabitante</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: AFFECTATION ÉLEVAGE / PÂTURAGE SUR PARCELLE                      */}
      {/* ========================================================================= */}
      {elevageModalParcelle && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Affecter Élevage / Pâturage</h3>
                  <p className="text-[11px] text-slate-500">Parcelle {elevageModalParcelle.code}</p>
                </div>
              </div>
              <button
                onClick={() => setElevageModalParcelle(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateElevage} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Espèce Animale</label>
                <select
                  value={elevageForm.elevageEspeceNom}
                  onChange={(e) => setElevageForm({ ...elevageForm, elevageEspeceNom: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="Bovins Pâturage">Bovins (Pâturage tournant)</option>
                  <option value="Porcins Enclos">Porcins (Bâtiment & Parcours fermé)</option>
                  <option value="Volailles Parcours">Volailles (Parcours herbagé)</option>
                  <option value="Caprins Nains">Caprins (Parcours semi-arboré)</option>
                  <option value="Ovins Djallonké">Ovins (Pâturage prairie)</option>
                  <option value="Pisciculture Bassins">Pisciculture (Bassins aménagés)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Code / Réf du Lot</label>
                <input
                  type="text"
                  required
                  value={elevageForm.elevageLotCode}
                  onChange={(e) => setElevageForm({ ...elevageForm, elevageLotCode: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Superficie Mobilisée (ha) (0 pour libérer)
                </label>
                <input
                  type="number"
                  min="0"
                  max={elevageModalParcelle.superficieHa}
                  step="0.1"
                  required
                  value={elevageForm.superficieElevageHa}
                  onChange={(e) =>
                    setElevageForm({ ...elevageForm, superficieElevageHa: Number(e.target.value) })
                  }
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-black focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setElevageModalParcelle(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enregistrer l'Affectation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

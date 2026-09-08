import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Info,
  Beef,
  Wheat,
  Warehouse,
  AlertTriangle,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { TERRAINS_DATA, MAGASINS_STOCKS_DATA } from '../data/coopData';

export const SigMapModule: React.FC = () => {
  const [activeLayers, setActiveLayers] = useState({
    terrains: true,
    elevages: true,
    magasins: true,
    risques: true,
  });

  const [selectedPin, setSelectedPin] = useState<{
    id: string;
    type: 'terrain' | 'magasin' | 'risque';
    title: string;
    commune: string;
    description: string;
    stats?: string;
  } | null>(null);

  // Map pins coordinates mapped onto an SVG canvas representing Centre Region, Cameroon
  // Origin roughly: Bafia (North-West), Sa'a (North), Obala (North-Center), Soa (East), Yaoundé (Center), Mbalmayo (South)
  const mapLocations = [
    {
      id: 'T004',
      type: 'terrain' as const,
      name: 'Domaine Agro-Pastoral Bafia',
      commune: 'Bafia',
      x: 220,
      y: 110,
      color: '#059669',
      details: 'Superficie : 65.0 ha • Pisciculture (5 000 alevins) & Manioc (30 ha)',
      badge: 'Terrain & Bassins',
    },
    {
      id: 'T002',
      type: 'terrain' as const,
      name: 'Ranch d’Élevage Sa’a',
      commune: "Sa'a",
      x: 360,
      y: 140,
      color: '#b45309',
      details: 'Superficie : 30.0 ha • Caprins Naine (72) & Ovins Djallonké (56)',
      badge: 'Ranch Ovins/Caprins',
    },
    {
      id: 'T001',
      type: 'terrain' as const,
      name: 'Ferme Pilote Obala Nord',
      commune: 'Obala',
      x: 430,
      y: 210,
      color: '#059669',
      details: 'Superficie : 45.5 ha • Bovins Goudali (35), Porcs Large White (48) & Maïs',
      badge: 'Ferme Polyvalente',
    },
    {
      id: 'MAG-02',
      type: 'magasin' as const,
      name: 'Silo à Grains d’Obala',
      commune: 'Obala',
      x: 455,
      y: 225,
      color: '#2563eb',
      details: 'Capacité : 800 t • Stock actuel : 620 t • Silo métallique séché',
      badge: 'Silo Central',
    },
    {
      id: 'T005',
      type: 'terrain' as const,
      name: 'Périmètre Maraîcher Soa',
      commune: 'Soa',
      x: 520,
      y: 280,
      color: '#10b981',
      details: 'Superficie : 22.5 ha • Maraîchage tomate & pépinière coopérative',
      badge: 'Maraîchage',
    },
    {
      id: 'MAG-01',
      type: 'magasin' as const,
      name: 'Magasin Central Yaoundé Nsam',
      commune: 'Yaoundé',
      x: 440,
      y: 320,
      color: '#1e3a8a',
      details: 'Capacité : 1 200 t • Siège logistique, conditionnement et comptoir commercial',
      badge: 'Magasin Central & Siège',
    },
    {
      id: 'T003',
      type: 'terrain' as const,
      name: 'Plantation Bananiers Mbalmayo',
      commune: 'Mbalmayo',
      x: 450,
      y: 440,
      color: '#059669',
      details: 'Superficie : 59.0 ha • Plantain Bâtard (28 ha) & Aviculture Chair (850)',
      badge: 'Plantain & Volailles',
    },
    {
      id: 'MAG-03',
      type: 'magasin' as const,
      name: 'Entrepôt & Froid Mbalmayo',
      commune: 'Mbalmayo',
      x: 475,
      y: 455,
      color: '#2563eb',
      details: 'Capacité : 500 t • Chambre froide pour carcasses avicoles & tubercules',
      badge: 'Entrepôt Frigorifique',
    },
    {
      id: 'RSK-01',
      type: 'risque' as const,
      name: 'Couloir de Surveillance Peste Porcine (PPA)',
      commune: 'Axe Obala - Batchenga',
      x: 410,
      y: 175,
      color: '#e11d48',
      details: 'Contrôle vétérinaire renforcé sur le transport de porcs vifs.',
      badge: 'Vigilance Sanitaire',
    },
  ];

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Système d'Information Géographique (SIG Agricole)</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Cartographie Interactive du Territoire Coopératif
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Géolocalisation des 5 terroirs majeurs (Bafia, Sa'a, Obala, Soa, Mbalmayo), silos de stockage, couloirs de transhumance et zones de vigilance sanitaire dans la Région du Centre.
          </p>
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2 bg-stone-100 p-2 rounded-xl text-xs font-semibold">
          <button
            onClick={() => toggleLayer('terrains')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeLayers.terrains ? 'bg-emerald-700 text-white' : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            🌱 Terrains & Parcelles
          </button>
          <button
            onClick={() => toggleLayer('magasins')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeLayers.magasins ? 'bg-blue-700 text-white' : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            🏢 Silos & Magasins
          </button>
          <button
            onClick={() => toggleLayer('risques')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeLayers.risques ? 'bg-rose-700 text-white' : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            ⚠️ Risques & PPA
          </button>
        </div>
      </div>

      {/* Interactive Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Territorial Canvas */}
        <div className="lg:col-span-2 bg-stone-900 rounded-2xl p-6 border border-stone-800 shadow-inner flex flex-col justify-between relative overflow-hidden min-h-[480px]">
          {/* Map Grid and Compass */}
          <div className="flex items-center justify-between z-10 text-stone-400 text-xs">
            <div className="flex items-center gap-2 bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-stone-200">Région du Centre • Yaoundé & Périphérie</span>
            </div>
            <div className="text-[11px] font-mono text-stone-500">
              Échelle : 1:50 000 • SIG WGS84
            </div>
          </div>

          {/* Interactive SVG Diagram of Regional Network */}
          <div className="my-auto py-4 relative flex items-center justify-center">
            <svg viewBox="0 0 700 550" className="w-full h-auto max-h-[420px] drop-shadow-md">
              {/* Background geographic sketch of department boundaries */}
              <path
                d="M 150,80 Q 280,40 450,90 T 620,160 Q 640,320 580,480 T 380,520 Q 200,510 140,360 Z"
                fill="#1c1917"
                stroke="#292524"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Major Roads & Transport Corridors */}
              {/* N4: Yaoundé -> Obala -> Bafia */}
              <path
                d="M 440,320 L 430,210 L 220,110"
                fill="none"
                stroke="#44403c"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* N10/N1: Yaoundé -> Soa */}
              <path
                d="M 440,320 L 520,280"
                fill="none"
                stroke="#44403c"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Obala -> Sa'a */}
              <path
                d="M 430,210 L 360,140"
                fill="none"
                stroke="#44403c"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
              {/* N2: Yaoundé -> Mbalmayo */}
              <path
                d="M 440,320 L 450,440"
                fill="none"
                stroke="#44403c"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Sanaga River representation (North) */}
              <path
                d="M 100,100 Q 300,70 500,120 T 650,90"
                fill="none"
                stroke="#0369a1"
                strokeWidth="2.5"
                strokeOpacity="0.6"
              />
              <text x="560" y="85" fill="#0284c7" fontSize="10" fontWeight="bold">
                Fleuve Sanaga
              </text>

              {/* Nyong River representation (South) */}
              <path
                d="M 150,430 Q 300,450 450,440 T 650,470"
                fill="none"
                stroke="#0369a1"
                strokeWidth="2"
                strokeOpacity="0.6"
              />
              <text x="540" y="460" fill="#0284c7" fontSize="10" fontWeight="bold">
                Fleuve Nyong
              </text>

              {/* Highway labels */}
              <text x="310" y="195" fill="#78716c" fontSize="9" fontWeight="bold">
                Axe N4 (Bafia - Yaoundé)
              </text>
              <text x="460" y="385" fill="#78716c" fontSize="9" fontWeight="bold">
                Axe N2 (Yaoundé - Mbalmayo)
              </text>

              {/* Risk zone highlight */}
              {activeLayers.risques && (
                <circle
                  cx="410"
                  cy="175"
                  r="32"
                  fill="#e11d48"
                  fillOpacity="0.15"
                  stroke="#e11d48"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}

              {/* Render Map Location Pins */}
              {mapLocations.map((loc) => {
                if (loc.type === 'terrain' && !activeLayers.terrains) return null;
                if (loc.type === 'magasin' && !activeLayers.magasins) return null;
                if (loc.type === 'risque' && !activeLayers.risques) return null;

                const isSelected = selectedPin?.id === loc.id;

                return (
                  <g
                    key={loc.id}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() =>
                      setSelectedPin({
                        id: loc.id,
                        type: loc.type,
                        title: loc.name,
                        commune: loc.commune,
                        description: loc.details,
                        stats: loc.badge,
                      })
                    }
                  >
                    {/* Glow pulse if selected */}
                    {isSelected && (
                      <circle
                        cx={loc.x}
                        cy={loc.y}
                        r="18"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="2"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer circle */}
                    <circle
                      cx={loc.x}
                      cy={loc.y}
                      r={loc.type === 'magasin' ? 12 : 10}
                      fill={loc.color}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* Pin Label */}
                    <text
                      x={loc.x + 14}
                      y={loc.y + 4}
                      fill="#f5f5f4"
                      fontSize="11"
                      fontWeight="bold"
                      className="select-none pointer-events-none drop-shadow"
                    >
                      {loc.name.replace('Domaine Agro-Pastoral ', '').replace('Plantation Bananiers ', '')}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="z-10 flex items-center justify-between text-stone-400 text-xs pt-3 border-t border-stone-800">
            <span>Cliquez sur un marqueur pour afficher la fiche détaillée du site</span>
            <span className="text-amber-400 font-semibold">COOPS-CA NKUL-FA • Réseau SIG</span>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-emerald-800" />
              <h2 className="text-base font-bold text-stone-900">
                Fiche d’Information du Site
              </h2>
            </div>

            {selectedPin ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-bold font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    {selectedPin.id}
                  </span>
                  <h3 className="text-base font-black text-stone-900 mt-2">{selectedPin.title}</h3>
                  <p className="text-xs text-stone-600 font-semibold mt-0.5">
                    Commune / Localité : {selectedPin.commune}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-100 bg-emerald-50/40 text-xs space-y-2">
                  <p className="font-bold text-emerald-950">Statut Opérationnel :</p>
                  <p className="text-stone-700 leading-relaxed">{selectedPin.description}</p>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 text-xs">
                  <span className="text-stone-500 block text-[11px]">Typologie</span>
                  <strong className="text-stone-900">{selectedPin.stats}</strong>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-stone-400 space-y-3">
                <MapPin className="w-12 h-12 mx-auto text-stone-300" />
                <p className="text-xs">
                  Sélectionnez un point géographique sur la carte (Obala, Sa'a, Bafia, Soa, Yaoundé, Mbalmayo) pour ouvrir sa fiche analytique.
                </p>
              </div>
            )}
          </div>

          {/* Quick Territorial Metrics */}
          <div className="mt-6 pt-4 border-t border-stone-200 text-xs space-y-2">
            <div className="flex justify-between text-stone-600">
              <span>Rayon de desserte logistique :</span>
              <strong className="text-stone-900">120 km (Centre Cameroun)</strong>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Points d'agrégation actifs :</span>
              <strong className="text-emerald-700">7 centres de collecte</strong>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Temps moyen de transfert au silo :</span>
              <strong className="text-stone-900">&lt; 3 heures</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

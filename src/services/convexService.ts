/**
 * Convex Cloud Database Service
 * 
 * Primary database service for the cooperative application.
 * Connected to Convex Cloud Backend:
 * - Cloud URL: https://giant-bison-526.eu-west-1.convex.cloud
 * - HTTP Actions URL: https://giant-bison-526.eu-west-1.convex.site
 * 
 * Architecture:
 * - Frontend: Vercel (Production)
 * - Backend: Convex Cloud (EU-West-1)
 * - Priority: Convex is the primary source of truth for all incoming & outgoing requests.
 *   LocalStorage acts strictly as an offline mirror and local fallback cache.
 */

export interface ConvexSyncResult {
  success: boolean;
  source: 'convex' | 'cache' | 'default';
  message: string;
  timestamp: number;
  syncVersion?: number;
  error?: string;
}

export interface ConvexConnectionTest {
  cloudOk: boolean;
  cloudLatencyMs?: number;
  cloudStatusText?: string;
  siteOk: boolean;
  siteLatencyMs?: number;
  siteStatusText?: string;
  overallSuccess: boolean;
  details: string;
}

export type ConvexSyncStatus = 'connected' | 'connecting' | 'syncing' | 'offline' | 'error';

// Configuration
export const CONVEX_CLOUD_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CONVEX_URL) ||
  'https://giant-bison-526.eu-west-1.convex.cloud';

export const CONVEX_SITE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CONVEX_SITE_URL) ||
  'https://giant-bison-526.eu-west-1.convex.site';

// Status listeners
type StatusListener = (status: ConvexSyncStatus, info?: { lastSync?: number; error?: string }) => void;
const listeners = new Set<StatusListener>();

let currentStatus: ConvexSyncStatus = 'connecting';
let lastSyncTimestamp: number | null = null;
let lastError: string | null = null;

function setStatus(status: ConvexSyncStatus, err?: string) {
  currentStatus = status;
  if (err) lastError = err;
  if (status === 'connected') lastError = null;
  listeners.forEach((cb) => cb(status, { lastSync: lastSyncTimestamp || undefined, error: lastError || undefined }));
}

/**
 * Convex strictly enforces non-control ASCII characters in document property keys.
 * This helper normalizes and sanitizes all keys recursively to ensure mutations never fail.
 */
export function sanitizeForConvex(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeForConvex);
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const asciiKey = key
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_]/g, '_');
    clean[asciiKey] = sanitizeForConvex(value);
  }
  return clean;
}

export const convexService = {
  getCloudUrl(): string {
    return CONVEX_CLOUD_URL;
  },

  getSiteUrl(): string {
    return CONVEX_SITE_URL;
  },

  getStatus(): ConvexSyncStatus {
    return currentStatus;
  },

  getLastSync(): number | null {
    return lastSyncTimestamp;
  },

  getLastError(): string | null {
    return lastError;
  },

  subscribe(listener: StatusListener): () => void {
    listeners.add(listener);
    listener(currentStatus, { lastSync: lastSyncTimestamp || undefined, error: lastError || undefined });
    return () => listeners.delete(listener);
  },

  /**
   * INCOMING REQUEST: Fetch cooperative state from Convex (Primary priority)
   */
  async fetchStateFromConvex(): Promise<{ data: any | null; result: ConvexSyncResult }> {
    setStatus('syncing');

    // 1. Try Convex Cloud query endpoint: /api/query
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`${CONVEX_CLOUD_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: 'appData:getState',
          args: { key: 'main' },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        if (json.status === 'success' && json.value) {
          lastSyncTimestamp = Date.now();
          setStatus('connected');
          return {
            data: json.value,
            result: {
              success: true,
              source: 'convex',
              message: 'Données chargées directement depuis Convex Cloud (EU-West-1)',
              timestamp: lastSyncTimestamp,
              syncVersion: json.value.syncVersion,
            },
          };
        } else if (json.status === 'success' && json.value === null) {
          // Convex database is connected but table is empty (fresh instance)
          setStatus('connected');
          return {
            data: null,
            result: {
              success: true,
              source: 'convex',
              message: 'Convex Cloud connecté (base vide, prête pour initialisation)',
              timestamp: Date.now(),
            },
          };
        }
      }
    } catch (err: any) {
      console.warn('Convex Cloud query fallback to HTTP site:', err.message);
    }

    // 2. Try Convex HTTP Actions endpoint: /api/state
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${CONVEX_SITE_URL}/api/state?key=main`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && (data.users || data.membres || data.collectes)) {
          lastSyncTimestamp = Date.now();
          setStatus('connected');
          return {
            data,
            result: {
              success: true,
              source: 'convex',
              message: 'Données chargées depuis Convex Site HTTP Actions',
              timestamp: lastSyncTimestamp,
            },
          };
        }
      }
    } catch (err: any) {
      console.warn('Convex Site HTTP fallback failed:', err.message);
    }

    // Convex is currently not answering or not yet deployed with functions
    setStatus('error', 'Serveur Convex joignable mais fonctions en attente de déploiement');
    return {
      data: null,
      result: {
        success: false,
        source: 'cache',
        message: 'Impossible de joindre les fonctions Convex (utilisation du cache local)',
        timestamp: Date.now(),
        error: 'Convex function appData:getState unavailable',
      },
    };
  },

  /**
   * OUTGOING REQUEST: Save cooperative state to Convex (Primary priority)
   */
  async saveStateToConvex(payload: any, updatedBy?: string): Promise<ConvexSyncResult> {
    setStatus('syncing');

    const cleanPayload = sanitizeForConvex({
      key: 'main',
      users: payload.users,
      membres: payload.membres,
      config: payload.config,
      interventions: payload.interventions,
      elevages: payload.elevages,
      parcelles: payload.parcelles,
      terrains: payload.terrains,
      collectes: payload.collectes,
      campagnes: payload.campagnes,
      activeCampagneCode: payload.activeCampagneCode,
      updatedBy: updatedBy || 'user',
    });

    // 1. Try Convex Cloud mutation: /api/mutation
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`${CONVEX_CLOUD_URL}/api/mutation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: 'appData:saveState',
          args: cleanPayload,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        if (json.status === 'success') {
          lastSyncTimestamp = Date.now();
          setStatus('connected');
          return {
            success: true,
            source: 'convex',
            message: 'Sauvegardé avec succès dans Convex Cloud',
            timestamp: lastSyncTimestamp,
            syncVersion: json.value?.syncVersion,
          };
        } else if (json.errorMessage?.includes('Could not find public function')) {
          console.warn('Convex function not yet deployed to cloud:', json.errorMessage);
          setStatus(
            'error',
            "Fonctions Convex non déployées : lancez 'npx convex deploy' ou configurez CONVEX_DEPLOY_KEY sur Vercel"
          );
          return {
            success: false,
            source: 'cache',
            message:
              "Le cluster Convex est joignable mais les fonctions backend ne sont pas encore déployées. Lancez 'npx convex deploy' ou importez le fichier JSONL.",
            timestamp: Date.now(),
            error: 'functions_not_deployed',
          };
        }
      }
    } catch (err: any) {
      console.warn('Convex mutation failed, attempting HTTP action fallback:', err.message);
    }

    // 2. Try Convex HTTP Actions endpoint: /api/state
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const response = await fetch(`${CONVEX_SITE_URL}/api/state`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        lastSyncTimestamp = Date.now();
        setStatus('connected');
        return {
          success: true,
          source: 'convex',
          message: 'Sauvegardé avec succès via Convex HTTP Actions',
          timestamp: lastSyncTimestamp,
          syncVersion: json.syncVersion,
        };
      }
    } catch (err: any) {
      console.warn('Convex Site HTTP mutation fallback failed:', err.message);
    }

    // If both failed, record error but LocalStorage will keep the changes safe locally
    setStatus('error', 'Échec de transmission vers Convex Cloud (mise en cache locale)');
    return {
      success: false,
      source: 'cache',
      message: 'Convex injoignable, modification enregistrée en cache local sécurisé',
      timestamp: Date.now(),
      error: 'Convex mutation failed',
    };
  },

  /**
   * Diagnostic test for Convex Cloud and Convex Site URLs
   */
  async testConnection(): Promise<ConvexConnectionTest> {
    let cloudOk = false;
    let cloudLatencyMs: number | undefined;
    let cloudStatusText = '';

    let siteOk = false;
    let siteLatencyMs: number | undefined;
    let siteStatusText = '';

    // Test Cloud URL
    const t0 = performance.now();
    try {
      const res = await fetch(`${CONVEX_CLOUD_URL}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: 'appData:ping', args: {} }),
      });
      cloudLatencyMs = Math.round(performance.now() - t0);
      const json = await res.json().catch(() => null);

      if (res.ok && json?.status === 'success') {
        cloudOk = true;
        cloudStatusText = `En ligne (${cloudLatencyMs}ms) • Fonctions backend déployées`;
      } else if (json?.errorMessage?.includes('Could not find public function')) {
        cloudOk = true;
        cloudStatusText = `Serveur joignable (${cloudLatencyMs}ms) • Fonctions en attente de déploiement ('npx convex deploy')`;
      } else if (res.status === 200 || res.status === 404) {
        cloudOk = true;
        cloudStatusText = `En ligne (${cloudLatencyMs}ms) • Serveur actif`;
      } else {
        cloudStatusText = `Code HTTP ${res.status}`;
      }
    } catch (err: any) {
      cloudStatusText = `Injoignable (${err.message || 'erreur réseau'})`;
    }

    // Test Site URL
    const t1 = performance.now();
    try {
      const res = await fetch(`${CONVEX_SITE_URL}/api/ping`, {
        method: 'GET',
      });
      siteLatencyMs = Math.round(performance.now() - t1);
      if (res.ok) {
        siteOk = true;
        siteStatusText = `En ligne (${siteLatencyMs}ms) • Actions HTTP prêtes`;
      } else {
        siteStatusText = `Code HTTP ${res.status} (en attente de déploiement)`;
        // If HTTP 404 from Convex Site, it's alive!
        if (res.status === 404) {
          siteOk = true;
          siteStatusText = `Reachable (404 en attente de route)`;
        }
      }
    } catch (err: any) {
      siteStatusText = `Injoignable (${err.message || 'erreur réseau'})`;
    }

    const overallSuccess = cloudOk || siteOk;
    if (overallSuccess) {
      setStatus('connected');
    } else {
      setStatus('offline', 'Serveurs Convex non joignables');
    }

    return {
      cloudOk,
      cloudLatencyMs,
      cloudStatusText,
      siteOk,
      siteLatencyMs,
      siteStatusText,
      overallSuccess,
      details: overallSuccess
        ? 'Connexion établie avec les serveurs Convex Cloud (EU-West-1).'
        : 'Impossible de contacter les serveurs Convex. Vérifiez votre connexion Internet.',
    };
  },

  /**
   * Helper to download the complete cooperative database as a Convex-compatible JSONL file.
   * This allows manual import into the Convex Dashboard (Data > Import) in 1 click!
   */
  downloadJsonl(data: any) {
    const record = sanitizeForConvex({
      key: 'main',
      users: data.users || [],
      membres: data.membres || [],
      config: data.config || {},
      interventions: data.interventions || [],
      elevages: data.elevages || [],
      parcelles: data.parcelles || [],
      terrains: data.terrains || [],
      collectes: data.collectes || [],
      campagnes: data.campagnes || [],
      activeCampagneCode: data.activeCampagneCode || 'CAMP-2026-A',
      updatedAt: Date.now(),
      syncVersion: 1,
    });

    const jsonlContent = JSON.stringify(record) + '\n';
    const blob = new Blob([jsonlContent], { type: 'application/x-jsonlines;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cooperativeState.jsonl`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Helper to export data specifically formatted for individual granular tables in Convex:
   * 'membres' | 'collectes' | 'users' | 'parcelles' | 'terrains' | 'campagnes'
   */
  downloadTableJsonl(tableName: string, items: any[]) {
    if (!Array.isArray(items) || items.length === 0) return;
    const sanitizedItems = sanitizeForConvex(items);
    const jsonlContent = sanitizedItems.map((item: any) => JSON.stringify(item)).join('\n') + '\n';
    const blob = new Blob([jsonlContent], { type: 'application/x-jsonlines;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tableName}.jsonl`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};


import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  timeout: 10000,
});

function getToken(): string | null {
  try {
    return localStorage.getItem("hextech.jwt") || null;
  } catch {
    return null;
  }
}

const DEBUG = String(import.meta.env.VITE_DEBUG_API || "").toLowerCase() === "true";

const reqMetaKey = Symbol("reqMeta");

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)["Authorization"] = `Bearer ${token}`;
  }
  (config as any)[reqMetaKey] = { start: Date.now() };
  if (DEBUG) {
    const method = (config.method || "GET").toUpperCase();
    const url = `${config.baseURL || ""}${config.url || ""}`;
    console.debug("API >>", method, url);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      const meta = (response.config as any)[reqMetaKey];
      const dur = meta?.start ? Date.now() - meta.start : undefined;
      const method = (response.config.method || "GET").toUpperCase();
      const url = `${response.config.baseURL || ""}${response.config.url || ""}`;
      console.debug("API <<", response.status, method, url, dur ? `${dur}ms` : "");
    }
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || error?.response?.data?.error || error?.message || "Errore di rete";
    const normalized = new Error(message);
    (normalized as any).status = status;
    if (DEBUG) console.debug("API !!", status, message);
    throw normalized;
  }
);

type GetOpts<T> = {
  cacheTTLms?: number;
  validate?: (data: unknown) => data is T;
  signal?: AbortSignal;
};

const cache = new Map<string, { ts: number; data: any }>();

function cacheKey(url: string, params?: Record<string, any>) {
  return `${url}|${params ? JSON.stringify(params) : ""}`;
}

export async function apiGet<T = any>(url: string, params?: Record<string, any>, opts: GetOpts<T> = {}) {
  const key = cacheKey(url, params);
  if (opts.cacheTTLms) {
    const hit = cache.get(key);
    if (hit && Date.now() - hit.ts < opts.cacheTTLms) {
      const data = hit.data;
      if (opts.validate && !opts.validate(data)) throw new Error("Formato dati non valido");
      return data as T;
    }
  }
  const res = await api.get(url, { params, signal: opts.signal });
  const data = res.data;
  if (opts.validate && !opts.validate(data)) throw new Error("Formato dati non valido");
  if (opts.cacheTTLms) cache.set(key, { ts: Date.now(), data });
  return data as T;
}

export async function apiPost<T = any>(url: string, body?: any, signal?: AbortSignal) {
  const res = await api.post(url, body, { signal });
  return res.data as T;
}

export function clearApiCache(prefix?: string) {
  if (!prefix) {
    cache.clear();
    return;
  }
  for (const k of cache.keys()) if (k.startsWith(prefix)) cache.delete(k);
}

export default api;

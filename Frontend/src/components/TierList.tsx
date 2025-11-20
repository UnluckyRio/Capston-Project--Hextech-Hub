import { useEffect, useMemo, useState } from "react";
import api from "../api/client";

type ChampionRow = {
  id: number;
  name: string;
  role: string;
  pickrate: number;
  winrate: number;
  banrate: number;
  matches: number;
};

export default function TierList() {
  const [rows, setRows] = useState<ChampionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    const cacheKey = "tierlist_cache_v1";
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as ChampionRow[];
        setRows(parsed);
        setLoading(false);
        return;
      } catch {}
    }
    (async () => {
      try {
        const { data } = await api.get("/api/champions/stats");
        if (!cancelled) {
          setRows(data as ChampionRow[]);
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        }
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || "Errore di caricamento";
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r => r.name.toLowerCase().includes(q) || r.role.toLowerCase().includes(q));
  }, [rows, query]);

  return (
    <section className="home-section">
      <div className="home-intro">
        <h2 className="home-title">Tier List</h2>
        <p>Statistiche campioni dal database.</p>
      </div>

      <div className="home-search mb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtra per nome o ruolo"
          aria-label="Filtra campioni"
          className="form-control"
        />
      </div>

      {loading && <div className="loading-overlay"><div className="loading-surface"><span>Caricamento…</span></div></div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Ruolo</th>
                <th scope="col">Pick %</th>
                <th scope="col">Win %</th>
                <th scope="col">Ban %</th>
                <th scope="col">Matches</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.role}</td>
                  <td>{(r.pickrate ?? 0).toFixed(2)}</td>
                  <td>{(r.winrate ?? 0).toFixed(2)}</td>
                  <td>{(r.banrate ?? 0).toFixed(2)}</td>
                  <td>{r.matches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
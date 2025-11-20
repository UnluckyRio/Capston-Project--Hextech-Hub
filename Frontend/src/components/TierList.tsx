import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api, { apiGet } from "../api/client";

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

  const DD_CHAMPIONS_URL =
    "https://ddragon.leagueoflegends.com/cdn/15.22.1/data/en_US/champion.json";
  const DD_ICONS_BASE =
    "https://ddragon.leagueoflegends.com/cdn/15.22.1/img/champion";
  const [iconByName, setIconByName] = useState<Record<string, string>>({});
  const [idByName, setIdByName] = useState<Record<string, string>>({});

  type SortKey = "name" | "role" | "pickrate" | "winrate" | "banrate" | "matches";
  type SortDir = "asc" | "desc";
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const setSort = (key: SortKey, dir: SortDir) => {
    setSortKey(key);
    setSortDir(dir);
  };

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
      } catch {
        setError("Cache error");
      }
    }
    (async () => {
      try {
        const arr = await apiGet<any[]>("/api/champions/stats", undefined, {
          cacheTTLms: 300000,
          validate: (d: unknown): d is any[] => Array.isArray(d),
        });
        if (!cancelled) {
          const list: ChampionRow[] = arr.map((it: any, idx: number) => {
            const id: number = typeof it?.id === "number" ? it.id : idx + 1;
            const name: string = String(
              it?.name ?? it?.championName ?? it?.champion_name ?? `Champion ${idx + 1}`
            );
            const role: string = String(
              it?.role ?? it?.lane ?? it?.position ?? ""
            );
            const pickrate: number = Number(
              it?.pickrate ?? it?.pick_rate ?? it?.pickRate ?? 0
            );
            const winrate: number = Number(
              it?.winrate ?? it?.win_rate ?? it?.winRate ?? 0
            );
            const banrate: number = Number(
              it?.banrate ?? it?.ban_rate ?? it?.banRate ?? 0
            );
            const matches: number = Number(
              it?.matches ?? it?.games ?? it?.match_count ?? 0
            );
            return { id, name, role, pickrate, winrate, banrate, matches };
          });
          setRows(list);
          sessionStorage.setItem(cacheKey, JSON.stringify(list));
        }
      } catch (err: unknown) {
        const msg =
          (typeof err === "object" && err && (err as any)?.response?.data?.message) ||
          (typeof err === "object" && err && (err as any)?.message) ||
          "Loading error";
        if (!cancelled) setError(String(msg));

        try {
          const res = await fetch(DD_CHAMPIONS_URL);
          if (res.ok) {
            const json = await res.json();
            const data = json?.data && typeof json.data === "object" ? json.data : null;
            if (data) {
              const iconMap: Record<string, string> = {};
              const idMap: Record<string, string> = {};
              const list: ChampionRow[] = Object.values(data).map((c: any, idx: number) => {
                const tags: string[] = Array.isArray(c?.tags) ? c.tags : [];
                let role = "";
                if (tags.includes("Support")) role = "Support";
                else if (tags.includes("Marksman")) role = "Bot";
                else if (tags.includes("Assassin")) role = "Mid";
                else if (tags.includes("Mage")) role = "Mid";
                else if (tags.includes("Tank")) role = "Top";
                else if (tags.includes("Fighter")) role = "Top";
                const canonicalId: string = String(c?.id || "");
                const displayName: string = String(c?.name ?? canonicalId);
                const iconUrl = `${DD_ICONS_BASE}/${canonicalId}.png`;
                iconMap[displayName.toLowerCase()] = iconUrl;
                idMap[displayName.toLowerCase()] = canonicalId;
                return {
                  id: idx + 1,
                  name: displayName,
                  role,
                  pickrate: 0,
                  winrate: 0,
                  banrate: 0,
                  matches: 0,
                } as ChampionRow;
              });
              if (!cancelled) {
                setRows(list);
                sessionStorage.setItem(cacheKey, JSON.stringify(list));
                setIconByName(iconMap);
                setIdByName(idMap);
                setError(null);
              }
            }
          }
        } catch {}
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(DD_CHAMPIONS_URL);
        if (!res.ok) return;
        const json = await res.json();
        const data = json?.data && typeof json.data === "object" ? json.data : null;
        if (!data) return;
        const map: Record<string, string> = {};
        const ids: Record<string, string> = {};
        for (const c of Object.values(data) as any[]) {
          const id = String(c?.id || "");
          const name = String(c?.name || id);
          map[name.toLowerCase()] = `${DD_ICONS_BASE}/${id}.png`;
          ids[name.toLowerCase()] = id;
        }
        if (!cancelled) {
          setIconByName((prev) => ({ ...map, ...prev }));
          setIdByName((prev) => ({ ...ids, ...prev }));
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(q));
  }, [rows, query]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (!sortKey) return arr;
    arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      let cmp = 0;
      if (typeof av === "number" && typeof bv === "number") {
        cmp = av - bv;
      } else {
        cmp = String(av).localeCompare(String(bv));
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  return (
    <section className="home-section">
      <div className="home-intro">
        <h2 className="home-title">Tier List</h2>
        <p>Champion statistics from the database.</p>
      </div>

      <div className="home-search mb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name"
          aria-label="Filter champions by name"
          className="form-control"
        />
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-surface">
            <span>Loading…</span>
          </div>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">
                  Name
                  <span className="ms-1">
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0"
                      aria-label="Ordina Nome crescente"
                      onClick={() => setSort("name", "asc")}
                    >
                      <i
                        className={`bi bi-caret-up-fill ${
                          sortKey === "name" && sortDir === "asc" ? "text-primary" : ""
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0 ms-1"
                      aria-label="Ordina Nome decrescente"
                      onClick={() => setSort("name", "desc")}
                    >
                      <i
                        className={`bi bi-caret-down-fill ${
                          sortKey === "name" && sortDir === "desc" ? "text-primary" : ""
                        }`}
                      />
                    </button>
                  </span>
                </th>
                <th scope="col">
                  Role
                  <span className="ms-1">
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0"
                      aria-label="Ordina Ruolo crescente"
                      onClick={() => setSort("role", "asc")}
                    >
                      <i
                        className={`bi bi-caret-up-fill ${
                          sortKey === "role" && sortDir === "asc" ? "text-primary" : ""
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0 ms-1"
                      aria-label="Ordina Ruolo decrescente"
                      onClick={() => setSort("role", "desc")}
                    >
                      <i
                        className={`bi bi-caret-down-fill ${
                          sortKey === "role" && sortDir === "desc" ? "text-primary" : ""
                        }`}
                      />
                    </button>
                  </span>
                </th>
                <th scope="col">
                  Pick %
                  <span className="ms-1">
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0"
                      aria-label="Ordina Pick rate crescente"
                      onClick={() => setSort("pickrate", "asc")}
                    >
                      <i
                        className={`bi bi-caret-up-fill ${
                          sortKey === "pickrate" && sortDir === "asc" ? "text-primary" : ""
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0 ms-1"
                      aria-label="Ordina Pick rate decrescente"
                      onClick={() => setSort("pickrate", "desc")}
                    >
                      <i
                        className={`bi bi-caret-down-fill ${
                          sortKey === "pickrate" && sortDir === "desc" ? "text-primary" : ""
                        }`}
                      />
                    </button>
                  </span>
                </th>
                <th scope="col">
                  Win %
                  <span className="ms-1">
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0"
                      aria-label="Ordina Win rate crescente"
                      onClick={() => setSort("winrate", "asc")}
                    >
                      <i
                        className={`bi bi-caret-up-fill ${
                          sortKey === "winrate" && sortDir === "asc" ? "text-primary" : ""
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0 ms-1"
                      aria-label="Ordina Win rate decrescente"
                      onClick={() => setSort("winrate", "desc")}
                    >
                      <i
                        className={`bi bi-caret-down-fill ${
                          sortKey === "winrate" && sortDir === "desc" ? "text-primary" : ""
                        }`}
                      />
                    </button>
                  </span>
                </th>
                <th scope="col">
                  Ban %
                  <span className="ms-1">
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0"
                      aria-label="Ordina Ban rate crescente"
                      onClick={() => setSort("banrate", "asc")}
                    >
                      <i
                        className={`bi bi-caret-up-fill ${
                          sortKey === "banrate" && sortDir === "asc" ? "text-primary" : ""
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0 ms-1"
                      aria-label="Ordina Ban rate decrescente"
                      onClick={() => setSort("banrate", "desc")}
                    >
                      <i
                        className={`bi bi-caret-down-fill ${
                          sortKey === "banrate" && sortDir === "desc" ? "text-primary" : ""
                        }`}
                      />
                    </button>
                  </span>
                </th>
                <th scope="col">
                  Matches
                  <span className="ms-1">
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0"
                      aria-label="Ordina Matches crescente"
                      onClick={() => setSort("matches", "asc")}
                    >
                      <i
                        className={`bi bi-caret-up-fill ${
                          sortKey === "matches" && sortDir === "asc" ? "text-primary" : ""
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0 ms-1"
                      aria-label="Ordina Matches decrescente"
                      onClick={() => setSort("matches", "desc")}
                    >
                      <i
                        className={`bi bi-caret-down-fill ${
                          sortKey === "matches" && sortDir === "desc" ? "text-primary" : ""
                        }`}
                      />
                    </button>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.id}>
                  <td>
                    {(() => {
                      const key = r.name.toLowerCase();
                      const url = iconByName[key] || `${DD_ICONS_BASE}/${r.name.replace(/[^A-Za-z]/g, "")}.png`;
                      const slug = idByName[key] || r.name.replace(/[^A-Za-z]/g, "");
                      return (
                        <Link to={`/Champions/${slug}`} className="text-decoration-none">
                          <img
                            src={url}
                            alt={`${r.name} icon`}
                            width={28}
                            height={28}
                            loading="lazy"
                            decoding="async"
                            style={{ borderRadius: "50%", marginRight: 8, objectFit: "cover" }}
                            onError={(e) => {
                              e.currentTarget.style.visibility = "hidden";
                            }}
                          />
                          {r.name}
                        </Link>
                      );
                    })()}
                  </td>
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

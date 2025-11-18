import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import "../styles/Home.scss";
import { useEffect, useState } from "react";
import LoadingOverlay from "./LoadingOverlay";

const IMG_BASE = "https://ddragon.leagueoflegends.com/cdn/img/champion/loading";

const DATA_URL =
  "https://ddragon.leagueoflegends.com/cdn/15.22.1/data/en_US/champion.json";

type ChampionData = { id: string; name: string; title: string };

export default function Champions() {
  const [champions, setChampions] = useState<ChampionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const data =
          json && typeof json === "object"
            ? (json as Record<string, unknown>).data
            : null;
        if (!data || typeof data !== "object") {
          throw new Error(
            "Unexpected data format from Data Dragon: 'data' missing"
          );
        }

        const list: ChampionData[] = Object.values(data).map(
          (c: { id: string; name: string; title: string }) => ({
            id: c.id,
            name: c.name,
            title: c.title,
          })
        );
        setChampions(list);
        setLoading(false);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Data loading error");
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="home-section champions-list">
      <div className="home-intro">
        <h2 className="home-title">CHAMPIONS</h2>
        <p>Complete list of League of Legends champions.</p>
      </div>

      <LoadingOverlay
        loading={loading}
        error={error}
        label="Caricamento elenco campioni…"
        onRetry={() => window.location.reload()}
      />

      {!loading && !error && (
        <>
          <div className="home-search">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search champion..."
              aria-label="Search champion by name"
              className="form-control"
            />
          </div>

          <div className="home-cards champion-grid">
            {champions
              .filter((c) =>
                c.name.toLowerCase().includes(query.toLowerCase().trim())
              )
              .map((c) => (
                <div key={c.id} className="home-card-item">
                  <Link
                    to={`/Champions/${c.id}`}
                    className="text-decoration-none"
                  >
                    <Card className="home-card champion-card h-100">
                      <div className="card-img-wrapper">
                        <img
                          className="card-img-top intrinsic"
                          src={`${IMG_BASE}/${c.id}_0.jpg`}
                          alt={`${c.name} Artwork (loading)`}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            const svg =
                              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300"><rect width="100%" height="100%" fill="%23212529"/><text x="50%" y="50%" fill="%23ffc107" font-size="20" font-family="Arial, Helvetica, sans-serif" dominant-baseline="middle" text-anchor="middle">Artwork unavailable</text></svg>';
                            e.currentTarget.src = svg;
                            e.currentTarget.classList.add("img-error");
                          }}
                        />
                      </div>
                      <Card.Body>
                        <Card.Title>{c.name}</Card.Title>
                        <Card.Text>{c.title}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </div>
              ))}
          </div>
        </>
      )}

      {loading && (
        <div className="home-cards champion-grid" aria-busy="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="home-card-item" key={i}>
              <div className="home-card h-100 skeleton-card" aria-hidden="true">
                <div className="skeleton-img" />
                <div className="card-body">
                  <div className="skeleton-line" style={{ width: "60%" }} />
                  <div className="skeleton-line" style={{ width: "40%" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

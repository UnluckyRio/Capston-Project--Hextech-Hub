import { useMemo, useState } from "react";
import Card from "react-bootstrap/Card";
import "../styles/Home.scss";
import LoadingOverlay from "./LoadingOverlay";

// Versione DDragon per icone profilo
const DDRAGON_VER = "15.22.1";
const PROFILE_ICON_BASE = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/profileicon`;

// Tipi minimali per i dati del profilo
type Summoner = {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  summonerLevel: number;
};

// Tipi minimali per i dati di match v5
type MatchInfo = any; // Manteniamo il JSON grezzo per flessibilità

export default function Profile() {
  // Stato form
  const [region, setRegion] = useState<string>("euw1");
  const [query, setQuery] = useState<string>(""); // nome evocatore

  // Stato dati
  const [summoner, setSummoner] = useState<Summoner | null>(null);
  // Rimuoviamo matchIds per evitare variabili inutilizzate
  const [matches, setMatches] = useState<MatchInfo[]>([]);

  // Stato UI
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Endpoint base backend
  const API_BASE = useMemo(() => "http://localhost:8080/api/lol", []);

  // Esegue la ricerca profilo e cronologia partite
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = query.trim();
    if (!name) return;
    setLoading(true);
    setError(null);
    setSummoner(null);
    // noop
    setMatches([]);
    try {
      // 1) Profilo
      const summRes = await fetch(`${API_BASE}/summoner/by-name/${region}/${encodeURIComponent(name)}`);
      if (!summRes.ok) throw new Error(`Errore profilo (${summRes.status})`);
      const summ: Summoner = await summRes.json();
      setSummoner(summ);

      // 2) Ultimi match IDs (limite 10)
      const idsRes = await fetch(`${API_BASE}/matches/by-puuid/${region}/${encodeURIComponent(summ.puuid)}?count=10`);
      if (!idsRes.ok) throw new Error(`Errore match IDs (${idsRes.status})`);
      const ids: string[] = await idsRes.json();

      // 3) Dettagli partite in parallelo (max 10)
      const detailPromises = ids.map((id) => fetch(`${API_BASE}/match/${region}/${id}`).then((r) => {
        if (!r.ok) throw new Error(`Errore match ${id} (${r.status})`);
        return r.json();
      }));
      const details = await Promise.all(detailPromises);
      setMatches(details);
    } catch (err: any) {
      setError(err?.message ?? "Errore inatteso");
    } finally {
      setLoading(false);
    }
  };

  // Trova i dati del partecipante relativo al puuid
  const findParticipant = (m: any, puuid?: string) => {
    const p = puuid ?? summoner?.puuid;
    const parts: any[] = m?.info?.participants ?? [];
    return parts.find((pp) => pp?.puuid === p);
  };

  return (
    <section className="home-section">
      <div className="home-intro">
        <h2 className="home-title">Profilo Giocatore</h2>
        <p>Ricerca per nome evocatore e regione, visualizza ultime partite.</p>
      </div>

      <form className="container mb-3" onSubmit={handleSearch} aria-label="Cerca profilo">
        <div className="row g-2 align-items-end">
          <div className="col-12 col-sm-4">
            <label htmlFor="region" className="form-label text-light">Regione</label>
            <select id="region" className="form-select" value={region} onChange={(e) => setRegion(e.target.value)}>
              {/* Mappa base delle regioni supportate */}
              <option value="euw1">EUW1 (Europa Ovest)</option>
              <option value="eune1">EUNE1 (Europa Nord/Est)</option>
              <option value="na1">NA1 (Nord America)</option>
              <option value="kr">KR (Corea)</option>
              <option value="br1">BR1 (Brasile)</option>
              <option value="jp1">JP1 (Giappone)</option>
              <option value="tr1">TR1 (Turchia)</option>
              <option value="ru">RU (Russia)</option>
              <option value="la1">LA1 (LAN)</option>
              <option value="la2">LA2 (LAS)</option>
              <option value="oc1">OC1 (Oceania)</option>
            </select>
          </div>
          <div className="col-12 col-sm-6">
            <label htmlFor="query" className="form-label text-light">Nome evocatore</label>
            <input
              id="query"
              type="text"
              className="form-control"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Es. Faker"
              required
            />
          </div>
          <div className="col-12 col-sm-2">
            <button type="submit" className="btn btn-primary w-100">Cerca</button>
          </div>
        </div>
      </form>

      <LoadingOverlay
        loading={loading}
        error={error}
        label="Caricamento profilo e partite…"
        onRetry={() => {
          if (summoner) setQuery(summoner.name);
          const fake = { preventDefault: () => {} } as any;
          handleSearch(fake);
        }}
      />

      {!loading && !error && summoner && (
        <div className="home-cards">
          <div className="home-card-item">
            <Card className="home-card h-100">
              <Card.Header style={{ backgroundColor: "transparent" }}>Profilo</Card.Header>
              <Card.Body>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={`${PROFILE_ICON_BASE}/${summoner.profileIconId}.png`}
                    alt={`Icona profilo ${summoner.name}`}
                    width={64}
                    height={64}
                    loading="lazy"
                  />
                  <div>
                    <Card.Title className="mb-1">{summoner.name}</Card.Title>
                    <Card.Text className="mb-0">Livello: {summoner.summonerLevel}</Card.Text>
                    <small className="text-secondary">PUUID: {summoner.puuid}</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>

          <div className="home-card-item">
            <Card className="home-card h-100">
              <Card.Header style={{ backgroundColor: "transparent" }}>Ultime partite</Card.Header>
              <Card.Body>
                {matches.length === 0 && (
                  <div className="text-secondary">Nessuna partita recente trovata.</div>
                )}
                {matches.map((m, idx) => {
                  const me = findParticipant(m, summoner.puuid);
                  const queueId = m?.info?.queueId;
                  const gameMode = typeof queueId === "number" ? queueId : "";
                  const champion = me?.championName || "";
                  const k = me?.kills ?? 0;
                  const d = me?.deaths ?? 0;
                  const a = me?.assists ?? 0;
                  const win = me?.win ? "Vittoria" : "Sconfitta";
                  const kda = d > 0 ? ((k + a) / d).toFixed(2) : "Perfetto";
                  const start = m?.info?.gameStartTimestamp ? new Date(m.info.gameStartTimestamp) : null;
                  const durationSec = m?.info?.gameDuration ?? 0;
                  const durationMin = Math.round(durationSec / 60);
                  return (
                    <div key={m?.metadata?.matchId ?? idx} className="mb-3 p-2 rounded" style={{ background: "#0f0f1a" }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>{champion}</strong>
                        <span className={me?.win ? "text-success" : "text-danger"}>{win}</span>
                      </div>
                      <div className="d-flex flex-wrap gap-3 mt-1">
                        <span>K/D/A: {k}/{d}/{a} ({kda})</span>
                        <span>Modalità: {gameMode}</span>
                        {start && <span>Data: {start.toLocaleString()}</span>}
                        <span>Durata: {durationMin} min</span>
                      </div>
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}


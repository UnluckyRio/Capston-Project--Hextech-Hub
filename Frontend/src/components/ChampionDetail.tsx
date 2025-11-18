import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { useParams, NavLink } from "react-router-dom";
import "../styles/Home.scss";
import LoadingOverlay from "./LoadingOverlay";

const DETAIL_BASE =
  "https://ddragon.leagueoflegends.com/cdn/15.22.1/data/en_US/champion";

const SPELL_IMG_BASE =
  "https://ddragon.leagueoflegends.com/cdn/15.22.1/img/spell";
const PASSIVE_IMG_BASE =
  "https://ddragon.leagueoflegends.com/cdn/15.22.1/img/passive";
const ITEM_IMG_BASE =
  "https://ddragon.leagueoflegends.com/cdn/15.22.1/img/item";
const PERK_IMG_BASE = "https://ddragon.leagueoflegends.com/cdn/img/perk-images";

const CDN_IMG_BASE = "https://ddragon.leagueoflegends.com/cdn/img";

const CDRAGON_IMG_BASE =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1";

const DATA_BASE = "https://ddragon.leagueoflegends.com/cdn/15.22.1/data/en_US";
const ITEM_DATA_URL = `${DATA_BASE}/item.json`;
const RUNES_DATA_URL = `${DATA_BASE}/runesReforged.json`;
const SUMMONER_DATA_URL = `${DATA_BASE}/summoner.json`;

const CHAMPIONS_DATA_URL = `${DATA_BASE}/champion.json`;

const SPLASH_BASE =
  "https://ddragon.leagueoflegends.com/cdn/img/champion/splash";

type SpellImage = { full: string };
type Spell = {
  id: string;
  name: string;
  description: string;
  image: SpellImage;
};
type Passive = { name: string; description: string; image: SpellImage };
type ChampionDetailData = {
  id: string;
  name: string;
  title: string;
  passive: Passive;
  spells: Spell[];
  skins: { id: string; num: number; name: string; chromas: boolean }[];
  tags?: string[];
};

export default function ChampionDetail() {
  const { id } = useParams();
  const [champ, setChamp] = useState<ChampionDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkinNum, setSelectedSkinNum] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  const [itemsById, setItemsById] = useState<Record<string, any>>({});
  const [runesTrees, setRunesTrees] = useState<any[]>([]);
  const [summonersByKey, setSummonersByKey] = useState<Record<string, any>>({});

  const [buildsByChampionId, setBuildsByChampionId] = useState<
    Record<
      string,
      { core: number[]; starting: number[]; situational: number[] }
    >
  >({});

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const res = await fetch(`${DETAIL_BASE}/${id}.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const data =
          json && typeof json === "object" ? (json as any).data : null;
        if (!data || typeof data !== "object") {
          throw new Error("Unexpected data format: 'data' missing");
        }
        const raw = Object.values(data)[0] as any;
        const detail: ChampionDetailData = {
          id: raw.id,
          name: raw.name,
          title: raw.title,
          passive: raw.passive,
          spells: raw.spells,
          skins: raw.skins || [],
          tags: raw.tags || [],
        };
        setChamp(detail);
        const baseSkin = (raw.skins || []).find((s: any) => s.num === 0);
        setSelectedSkinNum(baseSkin ? baseSkin.num : 0);
        setLoading(false);
      } catch (err: any) {
        setError(err?.message ?? "Error loading details");
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    const loadExtra = async () => {
      try {
        const [itemRes, runesRes, summonerRes, championsRes] =
          await Promise.all([
            fetch(ITEM_DATA_URL),
            fetch(RUNES_DATA_URL),
            fetch(SUMMONER_DATA_URL),
            fetch(CHAMPIONS_DATA_URL),
          ]);
        if (itemRes.ok) {
          const itemJson = await itemRes.json();
          if (itemJson && itemJson.data && typeof itemJson.data === "object") {
            setItemsById(itemJson.data as Record<string, any>);
          }
        }
        if (runesRes.ok) {
          const runesJson = await runesRes.json();
          if (Array.isArray(runesJson)) {
            setRunesTrees(runesJson as any[]);
          }
        }
        if (summonerRes.ok) {
          const summonerJson = await summonerRes.json();
          if (
            summonerJson &&
            summonerJson.data &&
            typeof summonerJson.data === "object"
          ) {
            setSummonersByKey(summonerJson.data as Record<string, any>);
          }
        }

        if (championsRes.ok) {
          const championsJson = await championsRes.json();
          if (
            championsJson &&
            championsJson.data &&
            typeof championsJson.data === "object"
          ) {
            const data: Record<string, any> = championsJson.data;
            const ROLE_TEMPLATES: Record<
              string,
              { core: number[]; starting: number[]; situational: number[] }
            > = {
              Mage: {
                core: [6655, 3157, 3089, 3020],
                starting: [1056, 2003, 2055, 3020],
                situational: [3165, 3102, 3135],
              },

              Marksman: {
                core: [6672, 3031, 3094, 3006],
                starting: [1055, 2003, 1036, 3006],
                situational: [3026, 3072, 3036],
              },

              Fighter: {
                core: [6630, 3071, 3053, 3047],
                starting: [1054, 2003, 2031, 3047],
                situational: [3742, 3065, 3075],
              },

              Tank: {
                core: [6665, 3068, 3065, 3111],
                starting: [1054, 2003, 2031, 3111],
                situational: [3742, 3075, 3083],
              },

              Assassin: {
                core: [6691, 3142, 6692, 3158],
                starting: [1036, 2003, 1037, 3158],
                situational: [3156, 3026, 3036],
              },

              Support: {
                core: [6617, 4005, 2065, 3117],
                starting: [3850, 2003, 2055, 3117],
                situational: [3107, 3222, 3190],
              },
            };
            const pickRole = (tags: string[] = []): string => {
              const order = [
                "Marksman",
                "Mage",
                "Assassin",
                "Fighter",
                "Tank",
                "Support",
              ];
              const found = order.find((r) => tags.includes(r));
              return found || "Fighter";
            };
            const map: Record<
              string,
              { core: number[]; starting: number[]; situational: number[] }
            > = {};

            for (const entry of Object.values(data)) {
              const cid = (entry as any)?.id as string;
              const tags = ((entry as any)?.tags as string[]) || [];
              const role = pickRole(tags);
              const tpl = ROLE_TEMPLATES[role] || ROLE_TEMPLATES.Fighter;
              map[cid] = {
                core: [...tpl.core],
                starting: [...tpl.starting],
                situational: [...tpl.situational],
              };
            }
            setBuildsByChampionId(map);
          }
        }
      } catch (e) {
        console.warn("Failed to load DDragon extra data", e);
      }
    };
    loadExtra();
  }, []);

  const stripHtml = (s?: string): string => {
    if (!s) return "";
    return s
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const findRuneByName = (name: string) => {
    for (const tree of runesTrees) {
      const slots = tree?.slots || [];
      for (const slot of slots) {
        const runes = slot?.runes || [];
        const found = runes.find((r: any) => r?.name === name);
        if (found) return found;
      }
    }
    return null;
  };

  const findRuneWithSlot = (
    name: string
  ): { rune: any; slotIndex: number } | null => {
    for (const tree of runesTrees) {
      const slots = tree?.slots || [];
      for (let i = 0; i < slots.length; i++) {
        const runes = slots[i]?.runes || [];
        const found = runes.find((r: any) => r?.name === name);
        if (found) return { rune: found, slotIndex: i };
      }
    }
    return null;
  };

  const findPathIcon = (pathName: string): string | null => {
    const tree = runesTrees.find(
      (t: any) => t?.name === pathName || t?.key === pathName
    );
    const rel = tree?.icon;
    return rel ? `${CDN_IMG_BASE}/${rel}` : null;
  };

  const BUILD_OVERRIDES: Record<
    string,
    { core?: number[]; starting?: number[]; situational?: number[] }
  > = {
    Aatrox: {
      core: [6630, 3071, 3053, 3047],
      starting: [1054, 2003, 2031, 3047],
      situational: [3742, 3065, 3075],
    },
    Ahri: {
      core: [6655, 3157, 3089, 3020],
      starting: [1056, 2003, 2055, 3020],
      situational: [3165, 3102, 3135],
    },
  };

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 240);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentSkinIndex = champ
    ? champ.skins.findIndex((s) => s.num === selectedSkinNum)
    : -1;

  const skinLabel = (() => {
    if (!champ) return "";
    const s =
      currentSkinIndex >= 0 ? champ.skins[currentSkinIndex] : champ.skins[0];
    if (!s) return "";
    return s.name && s.name.toLowerCase() !== "default" ? s.name : "Base";
  })();

  const nextSkin = () => {
    if (!champ || champ.skins.length === 0) return;
    const len = champ.skins.length;
    const nextIdx = currentSkinIndex >= 0 ? (currentSkinIndex + 1) % len : 0;
    setSelectedSkinNum(champ.skins[nextIdx].num);
  };

  const prevSkin = () => {
    if (!champ || champ.skins.length === 0) return;
    const len = champ.skins.length;
    const prevIdx =
      currentSkinIndex >= 0 ? (currentSkinIndex - 1 + len) % len : 0;
    setSelectedSkinNum(champ.skins[prevIdx].num);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSkin();
      if (e.key === "ArrowRight") nextSkin();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [champ, currentSkinIndex]);

  return (
    <section className="home-section champion-detail">
      <div className="home-intro">
        <h2 className="home-title">Champion Detail</h2>
        <p>{id ? `Details for: ${id}` : "Select a champion from the list."}</p>

        <NavLink to="/Champions" className="home-link">
          ← Back to Champions
        </NavLink>
      </div>

      {!loading && !error && champ && (
        <nav className="breadcrumb" aria-label="breadcrumb">
          <NavLink to="/Champions" className="breadcrumb-link">
            Champions
          </NavLink>
          <span className="breadcrumb-sep" aria-hidden="true">
            ›
          </span>
          <span className="breadcrumb-current">{champ.name}</span>
        </nav>
      )}

      <LoadingOverlay
        loading={loading}
        error={error}
        label="Caricamento dettagli campione…"
        onRetry={() => window.location.reload()}
      />

      {!loading && !error && champ && (
        <>
          {champ.skins.length > 0 && (
            <div className="skins-carousel" aria-label="Carosello skin">
              <div className="champion-splash">
                <button
                  type="button"
                  className="carousel-arrow left"
                  onClick={prevSkin}
                  aria-label="Previous skin"
                >
                  <i className="bi bi-chevron-left" aria-hidden="true"></i>
                </button>
                <img
                  className="champion-splash-img"
                  src={`${SPLASH_BASE}/${champ.id}_${selectedSkinNum}.jpg`}
                  alt={`${champ.name} — Splash Skin #${selectedSkinNum}`}
                  loading="lazy"
                />
                <button
                  type="button"
                  className="carousel-arrow right"
                  onClick={nextSkin}
                  aria-label="Next skin"
                >
                  <i className="bi bi-chevron-right" aria-hidden="true"></i>
                </button>
                <div className="skin-badge" aria-live="polite">
                  {skinLabel}
                </div>
              </div>
            </div>
          )}

          <div className="home-cards fade-in">
            <div className="home-card-item">
              <Card className="home-card h-100">
                <Card.Header style={{ backgroundColor: "transparent" }}>
                  Abilities
                </Card.Header>
                <Card.Body>
                  <div className="ability-section">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={`${PASSIVE_IMG_BASE}/${champ.passive.image.full}`}
                        alt={`Passive: ${champ.passive.name}`}
                        width={64}
                        height={64}
                        loading="lazy"
                      />
                      <div>
                        <Card.Title>Passive — {champ.passive.name}</Card.Title>
                        <Card.Text>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: champ.passive.description,
                            }}
                          />
                        </Card.Text>
                      </div>
                    </div>
                  </div>

                  {champ.spells.map((sp, idx) => (
                    <div key={sp.id} className="ability-section">
                      <div className="d-flex align-items-start gap-3">
                        <img
                          src={`${SPELL_IMG_BASE}/${sp.image.full}`}
                          alt={`Spell ${sp.name}`}
                          width={64}
                          height={64}
                          loading="lazy"
                        />
                        <div>
                          <Card.Title>
                            {"QWER"[idx]} — {sp.name}
                          </Card.Title>
                          <Card.Text>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: sp.description,
                              }}
                            />
                          </Card.Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </div>

            <div className="home-card-item">
              <Card className="home-card h-100">
                <Card.Header style={{ backgroundColor: "transparent" }}>
                  Build
                </Card.Header>
                <Card.Body>
                  {(() => {
                    const tags = champ.tags || [];
                    const isMage = tags.includes("Mage");
                    const isMarksman = tags.includes("Marksman");

                    const autoBuild = buildsByChampionId[champ.id];
                    const items =
                      BUILD_OVERRIDES[champ.id]?.core ??
                      autoBuild?.core ??
                      (isMage
                        ? [6655, 3157, 3089, 3020]
                        : isMarksman
                        ? [6672, 3031, 3094, 3006]
                        : [6630, 3071, 3053, 3047]);

                    const startingItems =
                      BUILD_OVERRIDES[champ.id]?.starting ??
                      autoBuild?.starting ??
                      (isMage
                        ? [1056, 2003, 2055, 3020]
                        : isMarksman
                        ? [1055, 2003, 1036, 3006]
                        : [1054, 2003, 2031, 3047]);

                    const situational =
                      BUILD_OVERRIDES[champ.id]?.situational ??
                      autoBuild?.situational ??
                      (isMage
                        ? [3165, 3102, 3135]
                        : isMarksman
                        ? [3026, 3072, 3036]
                        : [3742, 3065, 3075]);
                    return (
                      <>
                        <div className="item-section">
                          <div className="item-section-title">Core Build</div>
                          <div
                            className="item-grid"
                            role="list"
                            aria-label="Core items"
                          >
                            {items.map((id) => {
                              const meta = itemsById?.[String(id)];
                              const itemName: string =
                                meta?.name ?? `Item ${id}`;

                              const itemBrief: string = (
                                meta?.plaintext?.trim() ||
                                stripHtml(meta?.description || "")
                              ).trim();
                              const totalCost: number | undefined =
                                meta?.gold?.total;
                              const title = `${itemName}${
                                itemBrief ? " • " + itemBrief : ""
                              }${
                                typeof totalCost === "number"
                                  ? ` • ${totalCost}g`
                                  : ""
                              }`;

                              const itemPlain: string =
                                itemBrief.length > 0
                                  ? itemBrief.length > 90
                                    ? `${itemBrief.slice(0, 90)}…`
                                    : itemBrief
                                  : "";
                              return (
                                <div
                                  className="item-cell"
                                  role="listitem"
                                  key={id}
                                >
                                  <img
                                    className="item-icon"
                                    src={`${ITEM_IMG_BASE}/${id}.png`}
                                    alt={itemName}
                                    width={48}
                                    height={48}
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => {
                                      e.currentTarget.src = `${ITEM_IMG_BASE}/1054.png`;
                                    }}
                                    title={title}
                                    aria-label={title}
                                  />
                                  <div className="item-texts">
                                    <small className="item-label">
                                      {itemName}
                                      {typeof totalCost === "number"
                                        ? ` · ${totalCost}g`
                                        : ""}
                                    </small>
                                    <small className="item-plaintext">
                                      {itemPlain}
                                    </small>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="item-section">
                          <div className="item-section-title">
                            Starting Items
                          </div>
                          <div
                            className="item-grid"
                            role="list"
                            aria-label="Starting items"
                          >
                            {startingItems.map((id) => {
                              const meta = itemsById?.[String(id)];
                              const itemName: string =
                                meta?.name ?? `Item ${id}`;
                              const itemBrief: string = (
                                meta?.plaintext?.trim() ||
                                stripHtml(meta?.description || "")
                              ).trim();
                              const totalCost: number | undefined =
                                meta?.gold?.total;
                              const title = `${itemName}${
                                itemBrief ? " • " + itemBrief : ""
                              }${
                                typeof totalCost === "number"
                                  ? ` • ${totalCost}g`
                                  : ""
                              }`;
                              const itemPlain: string =
                                itemBrief.length > 0
                                  ? itemBrief.length > 90
                                    ? `${itemBrief.slice(0, 90)}…`
                                    : itemBrief
                                  : "";
                              return (
                                <div
                                  className="item-cell"
                                  role="listitem"
                                  key={`start-${id}`}
                                >
                                  <img
                                    className="item-icon"
                                    src={`${ITEM_IMG_BASE}/${id}.png`}
                                    alt={itemName}
                                    width={48}
                                    height={48}
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => {
                                      e.currentTarget.src = `${ITEM_IMG_BASE}/1054.png`;
                                    }}
                                    title={title}
                                    aria-label={title}
                                  />
                                  <div className="item-texts">
                                    <small className="item-label">
                                      {typeof totalCost === "number"
                                        ? `${itemName} · ${totalCost}g`
                                        : itemName}
                                    </small>
                                    <small className="item-plaintext">
                                      {itemPlain}
                                    </small>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="item-section">
                          <div className="item-section-title">Situational</div>
                          <div
                            className="item-grid"
                            role="list"
                            aria-label="Situational items"
                          >
                            {situational.map((id) => {
                              const meta = itemsById?.[String(id)];
                              const itemName: string =
                                meta?.name ?? `Item ${id}`;
                              const itemBrief: string = (
                                meta?.plaintext?.trim() ||
                                stripHtml(meta?.description || "")
                              ).trim();
                              const totalCost: number | undefined =
                                meta?.gold?.total;
                              const title = `${itemName}${
                                itemBrief ? " • " + itemBrief : ""
                              }${
                                typeof totalCost === "number"
                                  ? ` • ${totalCost}g`
                                  : ""
                              }`;
                              const itemPlain: string =
                                itemBrief.length > 0
                                  ? itemBrief.length > 90
                                    ? `${itemBrief.slice(0, 90)}…`
                                    : itemBrief
                                  : "";
                              return (
                                <div
                                  className="item-cell"
                                  role="listitem"
                                  key={`situ-${id}`}
                                >
                                  <img
                                    className="item-icon"
                                    src={`${ITEM_IMG_BASE}/${id}.png`}
                                    alt={itemName}
                                    width={48}
                                    height={48}
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => {
                                      e.currentTarget.src = `${ITEM_IMG_BASE}/1054.png`;
                                    }}
                                    title={title}
                                    aria-label={title}
                                  />
                                  <div className="item-texts">
                                    <small className="item-label">
                                      {typeof totalCost === "number"
                                        ? `${itemName} · ${totalCost}g`
                                        : itemName}
                                    </small>
                                    <small className="item-plaintext">
                                      {itemPlain}
                                    </small>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </Card.Body>
              </Card>
            </div>

            <div className="home-card-item">
              <Card className="home-card h-100">
                <Card.Header style={{ backgroundColor: "transparent" }}>
                  Runes
                </Card.Header>
                <Card.Body>
                  {(() => {
                    const tags = champ.tags || [];
                    const isMage = tags.includes("Mage");
                    const isMarksman = tags.includes("Marksman");

                    const primaryPath = isMage
                      ? {
                          path: "Sorcery",
                          icon: `${PERK_IMG_BASE}/Styles/Sorcery/Sorcery.png`,
                          runes: [
                            {
                              name: "Arcane Comet",
                              icon: `${PERK_IMG_BASE}/Styles/Sorcery/ArcaneComet/ArcaneComet.png`,
                            },
                            {
                              name: "Manaflow Band",
                              icon: `${PERK_IMG_BASE}/Styles/Sorcery/ManaflowBand/ManaflowBand.png`,
                            },
                            {
                              name: "Transcendence",
                              icon: `${PERK_IMG_BASE}/Styles/Sorcery/Transcendence/Transcendence.png`,
                            },
                            {
                              name: "Scorch",
                              icon: `${PERK_IMG_BASE}/Styles/Sorcery/Scorch/Scorch.png`,
                            },
                          ],
                        }
                      : isMarksman
                      ? {
                          path: "Precision",
                          icon: `${PERK_IMG_BASE}/Styles/Precision/Precision.png`,
                          runes: [
                            {
                              name: "Press the Attack",
                              icon: `${PERK_IMG_BASE}/Styles/Precision/PressTheAttack/PressTheAttack.png`,
                            },
                            {
                              name: "Triumph",
                              icon: `${PERK_IMG_BASE}/Styles/Precision/Triumph/Triumph.png`,
                            },
                            {
                              name: "Legend: Alacrity",
                              icon: `${PERK_IMG_BASE}/Styles/Precision/LegendAlacrity/LegendAlacrity.png`,
                            },
                            {
                              name: "Coup de Grace",
                              icon: `${PERK_IMG_BASE}/Styles/Precision/CoupDeGrace/CoupDeGrace.png`,
                            },
                          ],
                        }
                      : {
                          path: "Precision",
                          icon: `${PERK_IMG_BASE}/Styles/Precision/Precision.png`,
                          runes: [
                            {
                              name: "Conqueror",
                              icon: `${PERK_IMG_BASE}/Styles/Precision/Conqueror/Conqueror.png`,
                            },
                            {
                              name: "Triumph",
                              icon: `${PERK_IMG_BASE}/Styles/Precision/Triumph/Triumph.png`,
                            },
                            {
                              name: "Legend: Tenacity",
                              icon: `${PERK_IMG_BASE}/Styles/Precision/LegendTenacity/LegendTenacity.png`,
                            },
                            {
                              name: "Last Stand",
                              icon: `${PERK_IMG_BASE}/Styles/Precision/LastStand/LastStand.png`,
                            },
                          ],
                        };

                    const secondaryPath = isMage
                      ? {
                          path: "Inspiration",
                          icon: `${PERK_IMG_BASE}/Styles/Inspiration/Inspiration.png`,
                          runes: [
                            {
                              name: "Magical Footwear",
                              icon: `${PERK_IMG_BASE}/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png`,
                            },
                            {
                              name: "Biscuit Delivery",
                              icon: `${PERK_IMG_BASE}/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png`,
                            },
                          ],
                        }
                      : isMarksman
                      ? {
                          path: "Domination",
                          icon: `${PERK_IMG_BASE}/Styles/Domination/Domination.png`,
                          runes: [
                            {
                              name: "Taste of Blood",
                              icon: `${PERK_IMG_BASE}/Styles/Domination/TasteOfBlood/TasteOfBlood.png`,
                            },
                            {
                              name: "Treasure Hunter",
                              icon: `${PERK_IMG_BASE}/Styles/Domination/TreasureHunter/TreasureHunter.png`,
                            },
                          ],
                        }
                      : {
                          path: "Resolve",
                          icon: `${PERK_IMG_BASE}/Styles/Resolve/Resolve.png`,
                          runes: [
                            {
                              name: "Second Wind",
                              icon: `${PERK_IMG_BASE}/Styles/Resolve/SecondWind/SecondWind.png`,
                            },
                            {
                              name: "Unflinching",
                              icon: `${PERK_IMG_BASE}/Styles/Resolve/Unflinching/Unflinching.png`,
                            },
                          ],
                        };

                    return (
                      <div
                        className="runes-grid"
                        aria-label="Recommended runes"
                      >
                        <div className="runes-path">
                          {(() => {
                            const rel = runesTrees.find(
                              (t: any) =>
                                t?.name === primaryPath.path ||
                                t?.key === primaryPath.path
                            )?.icon;
                            const iconUrl = rel
                              ? `${CDRAGON_IMG_BASE}/${rel}`
                              : primaryPath.icon;
                            return (
                              <img
                                className="rune-path-icon"
                                src={iconUrl}
                                alt={`${primaryPath.path} path`}
                                width={36}
                                height={36}
                                loading="lazy"
                                onError={(e) => {
                                  const dd =
                                    findPathIcon(primaryPath.path) ||
                                    primaryPath.icon;
                                  e.currentTarget.src = dd;
                                }}
                              />
                            );
                          })()}
                          <span className="runes-path-label">
                            {primaryPath.path}
                          </span>
                        </div>
                        <div
                          className="runes-set"
                          role="group"
                          aria-label="Primary runes"
                        >
                          {primaryPath.runes.map((r, idx) => {
                            const info = findRuneWithSlot(r.name);
                            const rr = info?.rune || findRuneByName(r.name);
                            const slotIndex = info?.slotIndex;
                            const slotLabel =
                              typeof slotIndex === "number"
                                ? slotIndex === 0
                                  ? "Keystone"
                                  : `Tier ${slotIndex + 1}`
                                : idx === 0
                                ? "Keystone"
                                : undefined;
                            const desc = rr
                              ? stripHtml(rr.shortDesc || rr.longDesc)
                              : "";
                            const brief = desc
                              ? desc.length > 90
                                ? `${desc.slice(0, 90)}…`
                                : desc
                              : "";
                            const title = rr
                              ? `${rr.name}${desc ? " • " + desc : ""}`
                              : r.name;

                            const iconUrl = rr?.icon
                              ? `${CDN_IMG_BASE}/${rr.icon}`
                              : r.icon;
                            return (
                              <div
                                className="rune-cell"
                                key={r.name}
                                role="listitem"
                              >
                                <img
                                  className={`rune-icon ${
                                    idx === 0 ? "rune-keystone" : ""
                                  }`}
                                  src={iconUrl}
                                  alt={r.name}
                                  width={36}
                                  height={36}
                                  loading="lazy"
                                  title={title}
                                  aria-label={title}
                                  data-rune-id={rr?.id}
                                  onError={(e) => {
                                    if (rr?.icon) {
                                      e.currentTarget.src = `${CDRAGON_IMG_BASE}/${rr.icon}`;
                                    } else {
                                      e.currentTarget.src = r.icon;
                                    }
                                  }}
                                />
                                <div className="rune-texts">
                                  <small className="rune-label">
                                    {rr?.name || r.name}
                                    {slotLabel && (
                                      <span className="rune-badge">
                                        {slotLabel}
                                      </span>
                                    )}
                                  </small>
                                  {brief && (
                                    <small className="rune-plaintext">
                                      {brief}
                                    </small>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="runes-path">
                          {(() => {
                            const rel = runesTrees.find(
                              (t: any) =>
                                t?.name === secondaryPath.path ||
                                t?.key === secondaryPath.path
                            )?.icon;
                            const iconUrl = rel
                              ? `${CDRAGON_IMG_BASE}/${rel}`
                              : secondaryPath.icon;
                            return (
                              <img
                                className="rune-path-icon"
                                src={iconUrl}
                                alt={`${secondaryPath.path} path`}
                                width={36}
                                height={36}
                                loading="lazy"
                                onError={(e) => {
                                  const dd =
                                    findPathIcon(secondaryPath.path) ||
                                    secondaryPath.icon;
                                  e.currentTarget.src = dd;
                                }}
                              />
                            );
                          })()}
                          <span className="runes-path-label">
                            {secondaryPath.path}
                          </span>
                        </div>
                        <div
                          className="runes-set"
                          role="group"
                          aria-label="Secondary runes"
                        >
                          {secondaryPath.runes.map((r) => {
                            const info = findRuneWithSlot(r.name);
                            const rr = info?.rune || findRuneByName(r.name);
                            const slotIndex = info?.slotIndex;
                            const slotLabel =
                              typeof slotIndex === "number"
                                ? slotIndex === 0
                                  ? "Keystone"
                                  : `Tier ${slotIndex + 1}`
                                : undefined;
                            const desc = rr
                              ? stripHtml(rr.shortDesc || rr.longDesc)
                              : "";
                            const brief = desc
                              ? desc.length > 90
                                ? `${desc.slice(0, 90)}…`
                                : desc
                              : "";
                            const title = rr
                              ? `${rr.name}${desc ? " • " + desc : ""}`
                              : r.name;
                            const iconUrl = rr?.icon
                              ? `${CDN_IMG_BASE}/${rr.icon}`
                              : r.icon;
                            return (
                              <div
                                className="rune-cell"
                                key={r.name}
                                role="listitem"
                              >
                                <img
                                  className="rune-icon"
                                  src={iconUrl}
                                  alt={r.name}
                                  width={36}
                                  height={36}
                                  loading="lazy"
                                  title={title}
                                  aria-label={title}
                                  data-rune-id={rr?.id}
                                  onError={(e) => {
                                    if (rr?.icon) {
                                      e.currentTarget.src = `${CDRAGON_IMG_BASE}/${rr.icon}`;
                                    } else {
                                      e.currentTarget.src = r.icon;
                                    }
                                  }}
                                />
                                <div className="rune-texts">
                                  <small className="rune-label">
                                    {rr?.name || r.name}
                                    {slotLabel && (
                                      <span className="rune-badge">
                                        {slotLabel}
                                      </span>
                                    )}
                                  </small>
                                  {brief && (
                                    <small className="rune-plaintext">
                                      {brief}
                                    </small>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </Card.Body>
              </Card>
            </div>

            <div className="home-card-item">
              <Card className="home-card h-100">
                <Card.Header style={{ backgroundColor: "transparent" }}>
                  Summoner Spells
                </Card.Header>
                <Card.Body>
                  {(() => {
                    const tags = champ.tags || [];
                    const isMage = tags.includes("Mage");
                    const isMarksman = tags.includes("Marksman");
                    const recommended = isMage
                      ? ["SummonerFlash", "SummonerTeleport"]
                      : isMarksman
                      ? ["SummonerFlash", "SummonerHeal"]
                      : ["SummonerFlash", "SummonerDot"];
                    return (
                      <div
                        className="summoner-grid"
                        role="group"
                        aria-label="Recommended summoner spells"
                      >
                        {recommended.map((key) => {
                          const meta = summonersByKey?.[key];
                          const name: string =
                            meta?.name ?? key.replace("Summoner", "");
                          const icon = meta?.image?.full
                            ? `${SPELL_IMG_BASE}/${meta.image.full}`
                            : `${SPELL_IMG_BASE}/${key}.png`;
                          const desc = meta?.description
                            ? stripHtml(meta.description)
                            : "";
                          const title = desc ? `${name} • ${desc}` : name;
                          return (
                            <div className="summoner-cell" key={key}>
                              <img
                                className="summoner-icon"
                                src={icon}
                                alt={name}
                                width={40}
                                height={40}
                                loading="lazy"
                                title={title}
                                aria-label={title}
                              />
                              <div className="summoner-texts">
                                <small className="summoner-label">{name}</small>
                                <small className="summoner-plaintext">
                                  {desc}
                                </small>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </Card.Body>
              </Card>
            </div>
          </div>
        </>
      )}

      {showScrollTop && (
        <button
          type="button"
          className="scroll-top-btn"
          onClick={handleScrollTop}
          aria-label="Torna su"
        >
          <i className="bi bi-arrow-up" aria-hidden="true"></i>
        </button>
      )}
    </section>
  );
}

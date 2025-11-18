// Dati di fallback lato client per la lista articoli
export type ArticleCategory = "News" | "Meta Content" | "Guides";

export const ARTICLES = [
  {
    id: "1",
    title: "Patch Notes",
    category: "News",
    excerpt: "Bilanciamenti e novità della patch",
    date: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Guida al Jungling",
    category: "Guides",
    excerpt: "Percorsi, obiettivi e tempi ottimali",
    date: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Meta Content di stagione",
    category: "Meta Content",
    excerpt: "Build e strategie dominanti",
    date: new Date().toISOString(),
  },
];
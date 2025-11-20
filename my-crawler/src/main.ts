// For more information, see https://crawlee.dev/
import { PlaywrightCrawler, ProxyConfiguration } from "crawlee";
import pkg from "pg";
const { Client } = pkg;
import "dotenv/config"; // ESM

const startUrls = ["https://u.gg/lol/tier-list"];

const crawler = new PlaywrightCrawler({
  // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
  requestHandler: async ({ page, request, log, enqueueLinks, pushData }) => {
    // Log di base della richiesta corrente
    console.log(`Elaboro: ${request.url}`);

    // Scroll infinito fino al termine
    await autoScroll(page);

    // Attendi che il DOM sia caricato
    await page.waitForLoadState("domcontentloaded");

    // Estrae tutti gli elementi con classe "champion-name"
    const champions = await page.$$eval(`[role="row"]`, (els) =>
      els.map((el) => ({
        id: els.indexOf(el),
        name: el.querySelector(".champion-name")?.textContent?.trim(),
        role: el.querySelector(".role img")?.getAttribute("alt"),
        pickrate: el.querySelector(".pickrate")?.textContent?.trim(),
        winrate: el.querySelector(".winrate")?.textContent?.trim(),
        banrate: el.querySelector(".banrate")?.textContent?.trim(),
        matches: el.querySelector(".matches")?.textContent?.trim(),
      }))
    );

    console.log("Champions trovati:", champions);

    const client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT as unknown as number,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      ssl: true,
    });

    await client.connect();

    for (const champion of champions.filter(
      (champion) => champion.name !== undefined
    )) {
      const result = await client.query(
        `
        INSERT INTO champions (id, name, role, pickrate, winrate, banrate, matches)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            role = EXCLUDED.role,
            pickrate = EXCLUDED.pickrate,
            winrate = EXCLUDED.winrate,
            banrate = EXCLUDED.banrate,
            matches = EXCLUDED.matches;
    `,
        [
          champion.id,
          champion.name,
          champion.role,
          champion.pickrate,
          champion.winrate,
          champion.banrate,
          champion.matches,
        ]
      );
    }

    client.end();
  },

  // Limita il crawl per evitare esplorazioni troppo ampie
  // Comment this option to scrape the full website.
  maxRequestsPerCrawl: 20,
});

await crawler.run(startUrls);

async function autoScroll(page: any) {
  let previousHeight = await page.evaluate(() => document.body.scrollHeight);

  while (true) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500); // aspetta che si carichino i nuovi contenuti

    const newHeight = await page.evaluate(() => document.body.scrollHeight);

    if (newHeight === previousHeight) {
      // nessun nuovo contenuto → fine
      break;
    }

    previousHeight = newHeight;
  }
}

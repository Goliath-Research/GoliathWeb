import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CATALOG_SOURCES, catalogRawUrl, type CatalogSource } from "../src/sources.ts";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const cacheDir = join(packageRoot, "cache");

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "goliath-web-semantic-fetch",
    },
    signal: AbortSignal.timeout(60_000),
  });
  if (!response.ok) {
    throw new Error(`GET ${url} failed: ${response.status}`);
  }
  const text = await response.text();
  if (text.trimStart().startsWith("<")) {
    throw new Error(`GET ${url} returned HTML`);
  }
  return text;
}

async function resolveCatalogText(source: CatalogSource): Promise<{ text: string; url: string }> {
  const primary = catalogRawUrl(source, source.path);
  try {
    return { text: await fetchText(primary), url: primary };
  } catch (error) {
    if (!source.fallbackPath) {
      throw error;
    }
    const fallback = catalogRawUrl(source, source.fallbackPath);
    return { text: await fetchText(fallback), url: fallback };
  }
}

async function main(): Promise<void> {
  mkdirSync(cacheDir, { recursive: true });
  const index: Record<string, { sha256: string; url: string }> = {};

  for (const source of CATALOG_SOURCES) {
    const { text, url } = await resolveCatalogText(source);
    JSON.parse(text);
    const sha256 = createHash("sha256").update(text).digest("hex");
    const outPath = join(cacheDir, `${source.id}.json`);
    writeFileSync(outPath, `${text.trim()}\n`, "utf8");
    index[source.id] = { sha256, url };
    console.log(`Wrote ${outPath} (${sha256.slice(0, 12)}…) from ${url}`);
  }

  writeFileSync(join(cacheDir, "index.json"), `${JSON.stringify(index, null, 2)}\n`, "utf8");
}

await main();

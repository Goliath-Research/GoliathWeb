import { assertHierarchy } from "./hierarchy.ts";
import { finalizeCatalog } from "./rename.ts";
import { productAssetUrl, PRODUCT_SOURCES } from "./sources.ts";
import type { Product, ProductSource } from "./types.ts";
import { assertSchema, normalizeProduct } from "./validate.ts";

const EXTRACTOR_SOURCE: ProductSource = {
  owner: "Goliath-Research",
  repo: "GoliathExtractor",
  ref: "main",
};

const EXTRACTOR_LEGACY_SOURCE: ProductSource = {
  owner: "Goliath-Research",
  repo: "MethylExtractor",
  ref: "main",
};

let cached: Promise<Product[]> | undefined;

function isNotFoundError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("failed: 404");
}

async function fetchText(url: string): Promise<string> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "goliath-web-build",
        },
        signal: AbortSignal.timeout(20_000),
      });
      if (!response.ok) {
        throw new Error(`GET ${url} failed: ${response.status}`);
      }
      const text = await response.text();
      if (text.trimStart().startsWith("<")) {
        throw new Error(`GET ${url} returned HTML`);
      }
      return text;
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      const terminal = message.includes("failed: 404") || message.includes("returned HTML");
      if (terminal || attempt === 1) break;
    }
  }
  const message = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(message);
}

async function fetchJson(url: string): Promise<unknown> {
  const text = await fetchText(url);
  try {
    return JSON.parse(text) as unknown;
  } catch (error) {
    throw new Error(`${url} did not return JSON`, { cause: error });
  }
}

async function loadSource(source: ProductSource): Promise<Product> {
  const label = `${source.owner}/${source.repo}@${source.ref}`;
  const [document, schema] = await Promise.all([
    fetchJson(productAssetUrl(source, "product.json")),
    fetchJson(productAssetUrl(source, "product.schema.json")),
  ]);
  assertSchema(schema, document, label);
  return normalizeProduct(document, source, label);
}

async function loadExtractorProduct(): Promise<Product> {
  try {
    return await loadSource(EXTRACTOR_SOURCE);
  } catch (error) {
    if (!isNotFoundError(error)) throw error;
    return loadSource(EXTRACTOR_LEGACY_SOURCE);
  }
}

async function fetchProducts(): Promise<Product[]> {
  const standardSources = PRODUCT_SOURCES.filter((source) => source.repo !== EXTRACTOR_SOURCE.repo);
  const products = await Promise.all([
    ...standardSources.map((source) => loadSource(source)),
    loadExtractorProduct(),
  ]);
  const finalized = finalizeCatalog(products);
  assertHierarchy(finalized);
  return finalized;
}

export function loadProducts(): Promise<Product[]> {
  cached ??= fetchProducts().catch((error: unknown) => {
    cached = undefined;
    throw error;
  });
  return cached;
}

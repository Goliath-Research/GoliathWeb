import type { Product } from "./types.ts";

/** Id in GoliathExtractor/.goliath/product.json (hyphenated). */
export const GOLIATH_EXTRACTOR_ID = "goliath-extractor";

/** Id GoliathOmics uses in dependsOn (Omics schema disallows hyphens in dependency refs). */
export const GOLIATH_EXTRACTOR_OMICS_REF = "goliathextractor";

/** Pre-rename catalog id; kept for redirects only. */
export const LEGACY_METHYL_EXTRACTOR_ID = "methylextractor";

const EXTRACTOR_ALIASES = new Set([
  GOLIATH_EXTRACTOR_OMICS_REF,
  LEGACY_METHYL_EXTRACTOR_ID,
]);

/** Map dependency/reference ids to the canonical extractor product id. */
export function canonicalProductId(id: string): string {
  return EXTRACTOR_ALIASES.has(id) ? GOLIATH_EXTRACTOR_ID : id;
}

export function normalizeCatalogReferences(products: readonly Product[]): Product[] {
  return products.map((product) => ({
    ...product,
    dependsOn: product.dependsOn.map(canonicalProductId),
    related: product.related.map(canonicalProductId),
  }));
}

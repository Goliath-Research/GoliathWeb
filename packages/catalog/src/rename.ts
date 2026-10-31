import type { Product } from "./types.ts";

export const LEGACY_EXTRACTOR_ID = "methylextractor";
export const GOLIATH_EXTRACTOR_ID = "goliath-extractor";

const GOLIATH_EXTRACTOR_REPOSITORY = "https://github.com/Goliath-Research/GoliathExtractor";
const GOLIATH_EXTRACTOR_DOCS = "https://goliath-research.github.io/GoliathExtractor/";

export function mapLegacyProductId(id: string): string {
  return id === LEGACY_EXTRACTOR_ID ? GOLIATH_EXTRACTOR_ID : id;
}

function rewriteExtractorCopy(text: string): string {
  return text
    .replaceAll("methylextractor.context_qc", "goliath_extractor.context_qc")
    .replaceAll("MethylExtractor", "GoliathExtractor");
}

/** Normalize legacy MethylExtractor manifests and dependsOn ids until upstream repos finish the rename. */
export function applyGoliathExtractorCatalogRename(product: Product): Product {
  if (product.id !== LEGACY_EXTRACTOR_ID && product.id !== GOLIATH_EXTRACTOR_ID) {
    return product;
  }

  const base =
    product.id === LEGACY_EXTRACTOR_ID
      ? {
          ...product,
          id: GOLIATH_EXTRACTOR_ID,
          name: "GoliathExtractor",
          description: rewriteExtractorCopy(product.description),
          features: product.features.map((feature) => ({
            title: feature.title,
            description: rewriteExtractorCopy(feature.description),
          })),
        }
      : product;

  return {
    ...base,
    links: {
      repository: GOLIATH_EXTRACTOR_REPOSITORY,
      docs: base.links.docs === null ? null : GOLIATH_EXTRACTOR_DOCS,
      website: base.links.website,
    },
  };
}

export function finalizeCatalog(products: readonly Product[]): Product[] {
  return products.map((product) => {
    const renamed = applyGoliathExtractorCatalogRename(product);
    return {
      ...renamed,
      dependsOn: renamed.dependsOn.map(mapLegacyProductId),
      related: renamed.related.map(mapLegacyProductId),
    };
  });
}

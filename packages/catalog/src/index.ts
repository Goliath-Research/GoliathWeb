export { assertHierarchy, consumersOf, HIERARCHY, requireProduct, sortByHierarchy } from "./hierarchy.ts";
export type { HierarchyRule } from "./hierarchy.ts";
export { loadProducts } from "./load.ts";
export {
  canonicalProductId,
  GOLIATH_EXTRACTOR_ID,
  GOLIATH_EXTRACTOR_OMICS_REF,
  LEGACY_METHYL_EXTRACTOR_ID,
  normalizeCatalogReferences,
} from "./aliases.ts";
export { productAssetUrl, PRODUCT_SOURCES } from "./sources.ts";
export type { ProductAsset } from "./sources.ts";
export type { Product, ProductFeature, ProductLinks, ProductSource } from "./types.ts";

export { assertHierarchy, consumersOf, HIERARCHY, requireProduct, sortByHierarchy } from "./hierarchy.ts";
export type { HierarchyRule } from "./hierarchy.ts";
export { loadProducts } from "./load.ts";
export {
  applyGoliathExtractorCatalogRename,
  finalizeCatalog,
  GOLIATH_EXTRACTOR_ID,
  LEGACY_EXTRACTOR_ID,
  mapLegacyProductId,
} from "./rename.ts";
export { productAssetUrl, PRODUCT_SOURCES } from "./sources.ts";
export type { ProductAsset } from "./sources.ts";
export type { Product, ProductFeature, ProductLinks, ProductSource } from "./types.ts";

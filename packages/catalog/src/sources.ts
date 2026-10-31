import type { ProductSource } from "./types.ts";

export type ProductAsset = "product.json" | "product.schema.json";

export const PRODUCT_SOURCES = [
  { owner: "Goliath-Research", repo: "GoliathApp", ref: "main" },
  { owner: "Goliath-Research", repo: "GoliathOmics", ref: "main" },
  { owner: "Goliath-Research", repo: "GoliathGroundStation", ref: "main" },
  { owner: "Goliath-Research", repo: "GoliathAlign", ref: "main" },
  { owner: "Goliath-Research", repo: "GoliathExtractor", ref: "main" },
] as const satisfies readonly ProductSource[];

export function productAssetUrl(source: ProductSource, asset: ProductAsset): string {
  switch (asset) {
    case "product.json":
    case "product.schema.json":
      return `https://raw.githubusercontent.com/${source.owner}/${source.repo}/${source.ref}/.goliath/${asset}`;
    default: {
      const unreachable: never = asset;
      throw new Error(`Unknown product asset ${String(unreachable)}`);
    }
  }
}

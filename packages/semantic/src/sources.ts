export type CatalogSourceId =
  | "goliathapp-actions"
  | "goliathapp-semantic"
  | "goliathomics-actions";

export type CatalogSource = {
  id: CatalogSourceId;
  owner: string;
  repo: string;
  /** Primary path on the repository default branch. */
  path: string;
  /** Used when `path` is not yet published (e.g. GoliathApp actions rename). */
  fallbackPath?: string;
};

export const CATALOG_SOURCES: readonly CatalogSource[] = [
  {
    id: "goliathapp-semantic",
    owner: "Goliath-Research",
    repo: "GoliathApp",
    path: "schemas/semantic/catalog.json",
  },
  {
    id: "goliathapp-actions",
    owner: "Goliath-Research",
    repo: "GoliathApp",
    path: "schemas/actions/catalog.json",
    fallbackPath: "schemas/actions/platform_catalog.json",
  },
  {
    id: "goliathomics-actions",
    owner: "Goliath-Research",
    repo: "GoliathOmics",
    path: "schemas/actions/catalog.json",
  },
] as const;

export function catalogRawUrl(source: CatalogSource, path: string): string {
  return `https://raw.githubusercontent.com/${source.owner}/${source.repo}/main/${path}`;
}

export function catalogSourceUrl(source: CatalogSource): string {
  return catalogRawUrl(source, source.path);
}

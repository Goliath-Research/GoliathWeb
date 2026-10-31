import type { Product } from "./types.ts";

export interface HierarchyRule {
  id: string;
  dependsOn: readonly string[];
  /** Ids that must not appear in dependsOn or related. */
  mustNotReference: readonly string[];
}

/**
 * Catalog direction is dependsOn only.
 * GoliathApp is the platform and does not name products that extend it.
 * GoliathOmics and GoliathGroundStation depend on the platform; Omics also uses the utilities.
 * GoliathAlign and GoliathExtractor do not depend on GoliathApp or GoliathOmics.
 */
export const HIERARCHY: readonly HierarchyRule[] = [
  {
    id: "goliathapp",
    dependsOn: [],
    mustNotReference: ["goliathomics", "goliathgroundstation", "goliathalign", "goliath-extractor"],
  },
  {
    id: "goliathomics",
    dependsOn: ["goliathapp", "goliathalign", "goliath-extractor"],
    mustNotReference: [],
  },
  {
    id: "goliathgroundstation",
    dependsOn: ["goliathapp"],
    mustNotReference: [],
  },
  {
    id: "goliathalign",
    dependsOn: [],
    mustNotReference: ["goliathapp", "goliathomics"],
  },
  {
    id: "goliath-extractor",
    dependsOn: [],
    mustNotReference: ["goliathapp", "goliathomics"],
  },
];

function sameMembers(actual: readonly string[], expected: readonly string[]): boolean {
  if (actual.length !== expected.length) return false;
  const seen = new Set(actual);
  return expected.every((id) => seen.has(id));
}

export function assertHierarchy(products: readonly Product[]): void {
  const byId = new Map(products.map((product) => [product.id, product]));
  if (byId.size !== products.length) {
    throw new Error("Product ids must be unique");
  }

  const ruleIds = HIERARCHY.map((rule) => rule.id);
  const productIds = products.map((product) => product.id);
  const sameCatalog =
    ruleIds.length === productIds.length && ruleIds.every((id) => byId.has(id));
  if (!sameCatalog) {
    throw new Error(
      `Catalog ids [${productIds.join(", ")}] do not match hierarchy rules [${ruleIds.join(", ")}]`,
    );
  }

  for (const rule of HIERARCHY) {
    const product = byId.get(rule.id);
    if (!product) {
      throw new Error(`Missing product ${rule.id}`);
    }
    if (!sameMembers(product.dependsOn, rule.dependsOn)) {
      throw new Error(
        `${product.id} dependsOn is [${product.dependsOn.join(", ")}], expected [${rule.dependsOn.join(", ")}]`,
      );
    }
    const referenced = [...product.dependsOn, ...product.related];
    const forbidden = referenced.filter((id) => rule.mustNotReference.includes(id));
    if (forbidden.length > 0) {
      throw new Error(`${product.id} must not reference ${forbidden.join(", ")}`);
    }
    for (const dependencyId of product.dependsOn) {
      if (!byId.has(dependencyId)) {
        throw new Error(`${product.id} dependsOn unknown product ${dependencyId}`);
      }
    }
    for (const relatedId of product.related) {
      if (!byId.has(relatedId)) {
        throw new Error(`${product.id} related unknown product ${relatedId}`);
      }
    }
  }
}

export function consumersOf(products: readonly Product[], id: string): Product[] {
  return products.filter((product) => product.dependsOn.includes(id));
}

export function sortByHierarchy(products: readonly Product[]): Product[] {
  const order = new Map(HIERARCHY.map((rule, index) => [rule.id, index]));
  return [...products].sort(
    (left, right) => (order.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (order.get(right.id) ?? Number.MAX_SAFE_INTEGER),
  );
}

export function requireProduct(products: readonly Product[], id: string): Product {
  const product = products.find((item) => item.id === id);
  if (!product) {
    throw new Error(`Catalog is missing ${id}`);
  }
  return product;
}

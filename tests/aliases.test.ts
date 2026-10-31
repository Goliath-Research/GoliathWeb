import assert from "node:assert/strict";
import test from "node:test";
import {
  assertHierarchy,
  canonicalProductId,
  GOLIATH_EXTRACTOR_ID,
  GOLIATH_EXTRACTOR_OMICS_REF,
  normalizeCatalogReferences,
  type Product,
} from "@goliath/catalog";

function product(id: string, dependsOn: string[], related: string[] = []): Product {
  return {
    schemaVersion: 1,
    id,
    name: id,
    tagline: "tagline",
    description: "description",
    category: "component",
    features: [{ title: "Feature", description: "Details" }],
    links: {
      repository: "https://github.com/Goliath-Research/example",
      docs: null,
      website: null,
    },
    related,
    dependsOn,
    license: "MIT",
    status: "active",
    source: { owner: "Goliath-Research", repo: "Example", ref: "main" },
  };
}

test("canonicalProductId maps Omics dependency ref to extractor manifest id", () => {
  assert.equal(canonicalProductId(GOLIATH_EXTRACTOR_OMICS_REF), GOLIATH_EXTRACTOR_ID);
  assert.equal(canonicalProductId(GOLIATH_EXTRACTOR_ID), GOLIATH_EXTRACTOR_ID);
  assert.equal(canonicalProductId("goliathalign"), "goliathalign");
});

test("normalizeCatalogReferences aligns GoliathOmics dependsOn with hierarchy", () => {
  const products = normalizeCatalogReferences([
    product("goliathapp", []),
    product("goliathomics", ["goliathapp", "goliathalign", GOLIATH_EXTRACTOR_OMICS_REF], [
      "goliathapp",
      "goliathalign",
      GOLIATH_EXTRACTOR_OMICS_REF,
    ]),
    product("goliathgroundstation", ["goliathapp"], ["goliathapp"]),
    product("goliathalign", []),
    product(GOLIATH_EXTRACTOR_ID, []),
  ]);

  const omics = products.find((item) => item.id === "goliathomics");
  assert.ok(omics);
  assert.deepEqual(omics.dependsOn, ["goliathapp", "goliathalign", GOLIATH_EXTRACTOR_ID]);

  assertHierarchy(products);
});

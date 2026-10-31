import assert from "node:assert/strict";
import test from "node:test";
import {
  assertHierarchy,
  finalizeCatalog,
  GOLIATH_EXTRACTOR_ID,
  LEGACY_EXTRACTOR_ID,
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

test("finalizeCatalog renames legacy extractor manifests and dependency ids", () => {
  const legacyExtractor: Product = {
    ...product(LEGACY_EXTRACTOR_ID, []),
    name: "MethylExtractor",
    description: "MethylExtractor reads BAM files.",
    features: [
      {
        title: "Sidecar",
        description: "Writes methylextractor.context_qc JSON.",
      },
    ],
    links: {
      repository: "https://github.com/Goliath-Research/MethylExtractor",
      docs: "https://goliath-research.github.io/MethylExtractor/",
      website: null,
    },
    source: { owner: "Goliath-Research", repo: "MethylExtractor", ref: "main" },
  };

  const products = finalizeCatalog([
    product("goliathapp", []),
    product("goliathomics", ["goliathapp", "goliathalign", LEGACY_EXTRACTOR_ID], [
      "goliathapp",
      "goliathalign",
      LEGACY_EXTRACTOR_ID,
    ]),
    product("goliathgroundstation", ["goliathapp"], ["goliathapp"]),
    product("goliathalign", []),
    legacyExtractor,
  ]);

  const renamed = products.find((item) => item.id === GOLIATH_EXTRACTOR_ID);
  assert.ok(renamed);
  assert.equal(renamed.name, "GoliathExtractor");
  assert.match(renamed.description, /GoliathExtractor reads BAM files/);
  assert.equal(renamed.features[0]?.description, "Writes goliath_extractor.context_qc JSON.");
  assert.equal(renamed.links.repository, "https://github.com/Goliath-Research/GoliathExtractor");
  assert.equal(renamed.links.docs, "https://goliath-research.github.io/GoliathExtractor/");

  const omics = products.find((item) => item.id === "goliathomics");
  assert.ok(omics);
  assert.deepEqual(omics.dependsOn, ["goliathapp", "goliathalign", GOLIATH_EXTRACTOR_ID]);

  assertHierarchy(products);
});

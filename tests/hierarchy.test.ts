import assert from "node:assert/strict";
import test from "node:test";
import { assertHierarchy, consumersOf, type Product } from "@goliath/catalog";

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

function catalog(): Product[] {
  return [
    product("goliathapp", []),
    product("goliathomics", ["goliathapp", "goliathalign", "goliath-extractor"], [
      "goliathapp",
      "goliathalign",
      "goliath-extractor",
    ]),
    product("goliathgroundstation", ["goliathapp"], ["goliathapp"]),
    product("goliathalign", []),
    product("goliath-extractor", []),
  ];
}

test("accepts the catalog hierarchy", () => {
  const products = catalog();
  assertHierarchy(products);
  assert.deepEqual(
    consumersOf(products, "goliathapp").map((item) => item.id),
    ["goliathomics", "goliathgroundstation"],
  );
  assert.deepEqual(
    consumersOf(products, "goliathalign").map((item) => item.id),
    ["goliathomics"],
  );
  assert.deepEqual(consumersOf(products, "goliathomics"), []);
});

test("rejects a platform that names a consumer", () => {
  const products = catalog();
  const platform = products[0];
  if (!platform) throw new Error("missing platform");
  platform.related = ["goliathomics"];
  assert.throws(() => assertHierarchy(products), /must not reference goliathomics/);
});

test("rejects a utility that depends on the platform", () => {
  const products = catalog();
  const align = products.find((item) => item.id === "goliathalign");
  if (!align) throw new Error("missing align");
  align.dependsOn = ["goliathapp"];
  assert.throws(() => assertHierarchy(products), /goliathalign dependsOn/);
});

import assert from "node:assert/strict";
import test from "node:test";
import { productAssetUrl, PRODUCT_SOURCES } from "@goliath/catalog";

test("product manifests are fetched from the five public main branches", () => {
  assert.deepEqual(
    PRODUCT_SOURCES.map((source) => productAssetUrl(source, "product.json")),
    [
      "https://raw.githubusercontent.com/Goliath-Research/GoliathApp/main/.goliath/product.json",
      "https://raw.githubusercontent.com/Goliath-Research/GoliathOmics/main/.goliath/product.json",
      "https://raw.githubusercontent.com/Goliath-Research/GoliathGroundStation/5d6d522bba5ff24de63e29e0b6f5e420abbb9615/.goliath/product.json",
      "https://raw.githubusercontent.com/Goliath-Research/GoliathAlign/main/.goliath/product.json",
      "https://raw.githubusercontent.com/Goliath-Research/GoliathExtractor/main/.goliath/product.json",
    ],
  );
  assert.equal(
    productAssetUrl(PRODUCT_SOURCES[0], "product.schema.json"),
    "https://raw.githubusercontent.com/Goliath-Research/GoliathApp/main/.goliath/product.schema.json",
  );
});

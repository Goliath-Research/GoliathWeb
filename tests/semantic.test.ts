import assert from "node:assert/strict";
import test from "node:test";
import {
  CATALOG_SOURCES,
  catalogSourceUrl,
  DEMO_ORGANIZATION_ROWS,
  getOrganizationEntity,
  listCoreSemanticRequests,
  listOmicsActions,
  loadSemanticCatalog,
  omicsVocabularySummary,
  organizationSummary,
  renderOrganizationTable,
} from "@goliath/semantic";

test("catalog sources point at GoliathApp and GoliathOmics main branches", () => {
  assert.deepEqual(
    CATALOG_SOURCES.map((source) => catalogSourceUrl(source)),
    [
      "https://raw.githubusercontent.com/Goliath-Research/GoliathApp/main/schemas/semantic/catalog.json",
      "https://raw.githubusercontent.com/Goliath-Research/GoliathApp/main/schemas/actions/catalog.json",
      "https://raw.githubusercontent.com/Goliath-Research/GoliathOmics/main/schemas/actions/catalog.json",
    ],
  );
});

test("cached semantic catalog exposes core.organization", () => {
  const entity = getOrganizationEntity();
  assert.equal(entity.display_name, "Organization");
  assert.equal(entity.namespace, "core");
  assert.ok(entity.attributes.some((attribute) => attribute.code === "name"));
});

test("organization render helper emits a static table", () => {
  const html = renderOrganizationTable(DEMO_ORGANIZATION_ROWS);
  assert.match(html, /<table class="semantic-table">/);
  assert.match(html, /Goliath Research Inc/);
});

test("core semantic requests are listed from cache", () => {
  const requests = listCoreSemanticRequests();
  assert.ok(requests.includes("core.list_organizations"));
  const summary = organizationSummary();
  assert.equal(summary.displayName, "Organization");
  assert.ok(summary.requestCount >= 1);
});

test("omics vocabulary filters omics namespace actions", () => {
  const summary = omicsVocabularySummary();
  assert.ok(summary.totalActionCount > summary.omicsActionCount);
  const omics = listOmicsActions();
  assert.ok(omics.every((action) => action.namespace === "omics"));
  assert.ok(omics.some((action) => action.capability === "context.resolve-project"));
});

test("semantic catalog loads without network", () => {
  const catalog = loadSemanticCatalog();
  assert.ok(Object.keys(catalog.entities).length >= 1);
});

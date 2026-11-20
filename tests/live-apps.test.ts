import assert from "node:assert/strict";
import test from "node:test";
import { liveAppFor, liveAppNavItems, liveApps } from "@goliath/catalog";

test("liveApps lists only verified hosts with unique https URLs", () => {
  assert.ok(liveApps.length >= 1, "at least one live app is required");
  const hosts = new Set<string>();
  const ids = new Set<string>();
  for (const app of liveApps) {
    assert.ok(app.id, "id");
    assert.ok(app.name, "name");
    assert.ok(app.navLabel, "navLabel");
    assert.ok(app.description, "description");
    assert.match(app.host, /^[a-z0-9-]+\.goliathresearch\.com$/);
    assert.equal(app.href, `https://${app.host}`);
    assert.equal(hosts.has(app.host), false, `duplicate host ${app.host}`);
    assert.equal(ids.has(app.id), false, `duplicate id ${app.id}`);
    hosts.add(app.host);
    ids.add(app.id);
  }
  // Hosts verified live before this list was written. Planned product hostnames
  // must not appear until they respond.
  assert.deepEqual(
    liveApps.map((app) => app.host),
    ["app.goliathresearch.com", "omics.goliathresearch.com"],
  );
  for (const reserved of ["crop.goliathresearch.com", "factory.goliathresearch.com", "realty.goliathresearch.com"]) {
    assert.equal(hosts.has(reserved), false, reserved);
  }
});

test("liveApp helpers resolve current apps for nav and product pages", () => {
  const app = liveAppFor("goliathapp");
  const omics = liveAppFor("goliathomics");
  assert.equal(app?.host, "app.goliathresearch.com");
  assert.equal(omics?.host, "omics.goliathresearch.com");
  assert.equal(liveAppFor("goliathcrop"), undefined);
  assert.deepEqual(liveAppNavItems(), [
    { href: "https://app.goliathresearch.com", label: "App" },
    { href: "https://omics.goliathresearch.com", label: "Omics" },
  ]);
});

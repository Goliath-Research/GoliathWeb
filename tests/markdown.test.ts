import assert from "node:assert/strict";
import test from "node:test";
import { markdownBlocks, safeUrl } from "../sites/www/src/lib/markdown.ts";

test("keeps https links and drops html and javascript urls", () => {
  const blocks = markdownBlocks(
    'See <script>alert(1)</script> and [click](javascript:alert(1)) and [docs](https://example.com/docs).',
  );
  const encoded = JSON.stringify(blocks);
  assert.equal(encoded.includes("<script"), false);
  assert.equal(encoded.includes("javascript:"), false);
  assert.equal(encoded.includes("https://example.com/docs"), true);
  assert.equal(encoded.includes("docs"), true);
});

test("safeUrl allows http(s) and mailto only", () => {
  assert.equal(safeUrl("https://example.com/a"), "https://example.com/a");
  assert.equal(safeUrl("mailto:contact@goliathresearch.com"), "mailto:contact@goliathresearch.com");
  assert.equal(safeUrl("javascript:alert(1)"), undefined);
  assert.equal(safeUrl("/relative"), undefined);
});

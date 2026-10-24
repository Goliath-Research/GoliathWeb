import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadSemanticCatalog } from "../src/load.ts";
import { GENERATED_MANIFEST } from "../generated/manifest.ts";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const generatedDir = join(packageRoot, "generated");

function readGenerated(fileName: string): string {
  return readFileSync(join(generatedDir, fileName), "utf8");
}

function main(): void {
  const before = {
    organization: readGenerated("organization-row.ts"),
    appCodes: readGenerated("goliathapp-action-codes.ts"),
    omicsCodes: readGenerated("omics-action-codes.ts"),
    manifest: readGenerated("manifest.ts"),
  };

  execFileSync("tsx", ["scripts/generate-types.ts"], { cwd: packageRoot, stdio: "inherit" });

  const after = {
    organization: readGenerated("organization-row.ts"),
    appCodes: readGenerated("goliathapp-action-codes.ts"),
    omicsCodes: readGenerated("omics-action-codes.ts"),
    manifest: readGenerated("manifest.ts"),
  };

  const mismatches: string[] = [];
  for (const key of Object.keys(before) as (keyof typeof before)[]) {
    if (before[key] !== after[key]) {
      mismatches.push(key);
    }
  }
  if (mismatches.length > 0) {
    throw new Error(
      `Generated semantic types are stale (${mismatches.join(", ")}). Run npm run generate:types --workspace @goliath/semantic`,
    );
  }

  const catalog = loadSemanticCatalog();
  const organization = catalog.entities["core.organization"];
  if (!organization) {
    throw new Error("core.organization missing from cached semantic catalog");
  }
  if (organization.content_hash !== GENERATED_MANIFEST.organizationContentHash) {
    throw new Error(
      "organization content_hash does not match GENERATED_MANIFEST — regenerate types after refreshing catalogs",
    );
  }

  console.log("Semantic generated types match cache and catalog hashes.");
}

main();

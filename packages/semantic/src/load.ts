import goliathappActionsJson from "../cache/goliathapp-actions.json" with { type: "json" };
import goliathappSemanticJson from "../cache/goliathapp-semantic.json" with { type: "json" };
import goliathomicsActionsJson from "../cache/goliathomics-actions.json" with { type: "json" };
import type { ActionsCatalog, SemanticCatalog } from "./catalog-types.ts";

export function loadSemanticCatalog(): SemanticCatalog {
  return goliathappSemanticJson as SemanticCatalog;
}

export function loadGoliathAppActionsCatalog(): ActionsCatalog {
  return goliathappActionsJson as ActionsCatalog;
}

export function loadGoliathOmicsActionsCatalog(): ActionsCatalog {
  return goliathomicsActionsJson as ActionsCatalog;
}

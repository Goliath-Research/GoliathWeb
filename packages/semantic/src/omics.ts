import type { ActionDefinition } from "./catalog-types.ts";
import { loadGoliathOmicsActionsCatalog } from "./load.ts";
import { escapeHtml } from "./render.ts";
import type { GoliathOmicsActionCode } from "../generated/omics-action-codes.ts";

export const OMICS_NAMESPACE = "omics";

export function listOmicsActions(): ActionDefinition[] {
  const catalog = loadGoliathOmicsActionsCatalog();
  return Object.entries(catalog.actions)
    .filter(([, action]) => action.namespace === OMICS_NAMESPACE)
    .map(([, action]) => action)
    .sort((left, right) => left.display_name.localeCompare(right.display_name));
}

export function getOmicsAction(code: GoliathOmicsActionCode): ActionDefinition {
  const catalog = loadGoliathOmicsActionsCatalog();
  const action = catalog.actions[code];
  if (!action) {
    throw new Error(`Unknown omics action ${code}`);
  }
  return action;
}

export function omicsVocabularySummary(): {
  omicsActionCount: number;
  engineActionCount: number;
  totalActionCount: number;
} {
  const catalog = loadGoliathOmicsActionsCatalog();
  let omicsActionCount = 0;
  let engineActionCount = 0;
  for (const action of Object.values(catalog.actions)) {
    if (action.namespace === OMICS_NAMESPACE) {
      omicsActionCount += 1;
    } else if (action.namespace === "engine") {
      engineActionCount += 1;
    }
  }
  return {
    omicsActionCount,
    engineActionCount,
    totalActionCount: Object.keys(catalog.actions).length,
  };
}

export function renderOmicsActionList(actions: readonly ActionDefinition[]): string {
  const items = actions
    .map((action) => {
      const permission = action.required_permission
        ? `<span class="semantic-meta">Permission: ${escapeHtml(action.required_permission)}</span>`
        : "";
      return `<li><strong>${escapeHtml(action.display_name)}</strong> <code>${escapeHtml(action.capability)}</code><p>${escapeHtml(action.description)}</p>${permission}</li>`;
    })
    .join("");
  return `<ul class="semantic-action-list">${items}</ul>`;
}

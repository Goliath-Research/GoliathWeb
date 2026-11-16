const LIVE_STATUSES = new Set(["active", "stable", "ready"]);
const EARLY_STATUSES = new Set(["alpha", "beta"]);
const PLANNED_STATUSES = new Set(["planned", "draft"]);

const CATEGORY_LABELS: Record<string, string> = {
  platform: "Platform",
  application: "Application",
  component: "Component",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  stable: "Stable",
  ready: "Ready",
  alpha: "In Development (Alpha)",
  beta: "In Development (Beta)",
  planned: "Planned",
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

export function statusLabel(status: string, productId?: string): string {
  if (productId === "goliathalign") {
    return "Ready · Continuous Development";
  }
  return STATUS_LABELS[status] ?? status;
}

export function statusClass(status: string, productId?: string): string {
  if (productId === "goliathalign" || LIVE_STATUSES.has(status)) return "status-live";
  if (EARLY_STATUSES.has(status)) return "status-early";
  if (PLANNED_STATUSES.has(status)) return "status-planned";
  return "status-unknown";
}

export function formatList(items: readonly string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0] ?? ""} and ${items[1] ?? ""}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1] ?? ""}`;
}

export function emptyDependencyNote(id: string): string {
  switch (id) {
    case "goliathapp":
      return "GoliathApp is the top of the hierarchy. It declares no upstream product and does not list the applications that extend it.";
    case "goliathomics":
    case "goliathgroundstation":
    case "goliathcrop":
    case "goliathfactory":
    case "goliathrealty":
      return "This application extends GoliathApp and declares that dependency in dependsOn.";
    case "goliathalign":
    case "goliath-extractor":
      return "This utility is standalone. It does not declare a dependency on GoliathApp or GoliathOmics.";
    default:
      return "This product declares no upstream catalog products.";
  }
}

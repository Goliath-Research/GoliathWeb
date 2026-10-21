const LIVE_STATUSES = new Set(["active", "stable", "ready"]);
const EARLY_STATUSES = new Set(["alpha", "beta"]);

const CATEGORY_LABELS: Record<string, string> = {
  platform: "Platform",
  application: "Application",
  component: "Component",
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

export function statusClass(status: string): string {
  if (LIVE_STATUSES.has(status)) return "status-live";
  if (EARLY_STATUSES.has(status)) return "status-early";
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
    case "goliathalign":
    case "methylextractor":
      return "This utility is standalone. It does not declare a dependency on GoliathApp or GoliathOmics.";
    default:
      return "This product declares no upstream catalog products.";
  }
}

const LIVE_STATUSES = new Set(["active", "stable", "ready"]);
const EARLY_STATUSES = new Set(["alpha", "beta", "experimental"]);
const PLANNED_STATUSES = new Set(["planned", "draft"]);

const CATEGORY_LABELS: Record<string, string> = {
  platform: "Core Platform",
  application: "Domain Application",
  component: "Standalone Tool",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  stable: "Ready",
  ready: "Ready",
  alpha: "In Development",
  beta: "In Development (Beta)",
  experimental: "In Development",
  planned: "Planned",
};

const PRODUCT_STATUS_LABEL_OVERRIDES: Record<string, string> = {
  goliathalign: "Ready · Continuous Development",
  "goliath-extractor": "Ready · Standalone Tool",
  goliathapp: "Active Development · Core Platform",
  goliathomics: "Active Development · Pilot Ready",
  goliathgroundstation: "In Development · Pilot Validation",
  goliathcrop: "Planned · Seeking Pilot Partners",
  goliathfactory: "Planned · Seeking Pilot Partners",
  goliathrealty: "Planned · Seeking Pilot Partners",
};

const PRODUCT_STATUS_CLASS_OVERRIDES: Record<string, string> = {
  goliathalign: "status-live",
  "goliath-extractor": "status-live",
  goliathapp: "status-early",
  goliathomics: "status-early",
  goliathgroundstation: "status-early",
  goliathcrop: "status-planned",
  goliathfactory: "status-planned",
  goliathrealty: "status-planned",
};

const PRODUCT_DOMAIN_LABELS: Record<string, string> = {
  goliathapp: "Shared Application Platform",
  goliathomics: "Genomics & Bioinformatics",
  goliathgroundstation: "Aerospace & Telemetry Ops",
  goliathcrop: "Agriculture & Field Trials",
  goliathfactory: "Manufacturing & Quality Ops",
  goliathrealty: "Real Estate Brokerage Ops",
  goliathalign: "GPU Sequence Alignment",
  "goliath-extractor": "DNA Methylation Extraction",
};

const PRODUCT_USER_SUMMARIES: Record<string, string> = {
  goliathapp:
    "Reusable software foundation providing role-based access control, semantic data schemas, workflow orchestration, user-defined actions, and distributed compute workers.",
  goliathomics:
    "Bioinformatics workflow application built on GoliathApp that orchestrates sequencing pipelines using GoliathAlign, GoliathExtractor, and domain process packs.",
  goliathgroundstation:
    "Launch operations and ground-station monitoring application on GoliathApp with telemetry gateway ingest, OPC fan-out, and operator identity.",
  goliathcrop:
    "Planned crop-management application on GoliathApp for commercial farms and research stations: fields, seasons, sensors, drone/satellite imagery, and trials.",
  goliathfactory:
    "Planned manufacturing-operations application on GoliathApp for precision shops and food processors: work orders, signed travelers, QC inspections, lot genealogy, and NCR/CAPA.",
  goliathrealty:
    "Planned real estate brokerage application on GoliathApp for brokers, agents, and clients: listings, transactions, compliance review, escrow ledger, and commissions.",
  goliathalign:
    "Ready-to-use GPU sequence aligner working for both linear and pangenome alignment on NVIDIA and AMD platforms, with continuous development for new features and hardware.",
  "goliath-extractor":
    "Ready-to-use high-performance methylation extraction tool (an optimized fork of MethylDackel) that runs standalone from the command line or inside GoliathOmics workflows.",
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

export function productDomainLabel(id: string, fallbackCategory?: string): string {
  return PRODUCT_DOMAIN_LABELS[id] ?? (fallbackCategory ? categoryLabel(fallbackCategory) : "Software");
}

export function productUserSummary(id: string, fallbackTagline: string): string {
  return PRODUCT_USER_SUMMARIES[id] ?? fallbackTagline;
}

export function statusLabel(status: string, productId?: string): string {
  if (productId && PRODUCT_STATUS_LABEL_OVERRIDES[productId]) {
    return PRODUCT_STATUS_LABEL_OVERRIDES[productId];
  }
  return STATUS_LABELS[status] ?? status;
}

export function statusClass(status: string, productId?: string): string {
  if (productId && PRODUCT_STATUS_CLASS_OVERRIDES[productId]) {
    return PRODUCT_STATUS_CLASS_OVERRIDES[productId];
  }
  if (LIVE_STATUSES.has(status)) return "status-live";
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
      return "GoliathApp is the core platform foundation. Domain applications build on top of it.";
    case "goliathomics":
    case "goliathgroundstation":
    case "goliathcrop":
    case "goliathfactory":
    case "goliathrealty":
      return "Built on the GoliathApp platform.";
    case "goliathalign":
    case "goliath-extractor":
      return "Standalone command-line utility. Runs independently on its own and can also be invoked by GoliathOmics workflows.";
    default:
      return "Standalone software component.";
  }
}

import type { OrganizationRow } from "../generated/organization-row.ts";
import type { SemanticEntity } from "./catalog-types.ts";
import { loadSemanticCatalog } from "./load.ts";
import {
  attributeLabel,
  formatCellValue,
  listColumnsForEntity,
  renderHtmlTable,
} from "./render.ts";

export const CORE_ORGANIZATION_ENTITY_KEY = "core.organization";

export function getOrganizationEntity(): SemanticEntity {
  const catalog = loadSemanticCatalog();
  const entity = catalog.entities[CORE_ORGANIZATION_ENTITY_KEY];
  if (!entity) {
    throw new Error(`Missing semantic entity ${CORE_ORGANIZATION_ENTITY_KEY}`);
  }
  return entity;
}

export function listCoreSemanticRequests(): string[] {
  const catalog = loadSemanticCatalog();
  return Object.keys(catalog.requests).filter((code) => code.startsWith("core."));
}

/** Static demo rows for marketing pages — not loaded from a database. */
export const DEMO_ORGANIZATION_ROWS: readonly OrganizationRow[] = [
  { organization_id: 1, name: "Goliath Research Inc", active: true },
  { organization_id: 2, name: "Example Lab", active: true },
  { organization_id: 3, name: "Inactive Tenant", active: false },
];

export function renderOrganizationTable(rows: readonly OrganizationRow[]): string {
  const entity = getOrganizationEntity();
  const columns = listColumnsForEntity(entity);
  const headers = columns.map((column) => attributeLabel(entity, column.code));
  const body = rows.map((row) =>
    columns.map((column) => formatCellValue(row[column.code as keyof OrganizationRow])),
  );
  return renderHtmlTable(headers, body);
}

export function organizationSummary(entity: SemanticEntity = getOrganizationEntity()): {
  displayName: string;
  description: string;
  schemaId: string;
  storageRelation: string;
  attributeCount: number;
  requestCount: number;
} {
  const catalog = loadSemanticCatalog();
  const requestCount = Object.values(catalog.requests).filter(
    (request) => request.entity_code === entity.code,
  ).length;
  return {
    displayName: entity.display_name,
    description: entity.description,
    schemaId: entity.schema_id,
    storageRelation: entity.storage_relation,
    attributeCount: entity.attributes.length,
    requestCount,
  };
}

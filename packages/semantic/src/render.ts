import type { SemanticAttribute, SemanticEntity } from "./catalog-types.ts";

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return escapeHtml(String(value));
}

export function attributeLabel(entity: SemanticEntity, code: string): string {
  const attribute = entity.attributes.find((item) => item.code === code);
  return attribute?.column_name ?? code;
}

export function listColumnsForEntity(
  entity: SemanticEntity,
  roles: readonly string[] = ["key", "list", "filter"],
): SemanticAttribute[] {
  const allowed = new Set(roles);
  return entity.attributes.filter((attribute) => allowed.has(attribute.role));
}

export function renderHtmlTable(
  headers: readonly string[],
  rows: readonly (readonly string[])[],
): string {
  const head = headers.map((header) => `<th scope="col">${escapeHtml(header)}</th>`).join("");
  const body = rows
    .map((row) => {
      const cells = row.map((cell) => `<td>${cell}</td>`).join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");
  return `<table class="semantic-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

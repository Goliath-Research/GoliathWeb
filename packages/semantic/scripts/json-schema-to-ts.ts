import type { JsonSchema } from "../src/catalog-types.ts";

function isNullable(schema: JsonSchema): boolean {
  return (
    schema.anyOf?.some((branch) => branch.type === "null") === true ||
    schema.type === "null"
  );
}

function primaryBranch(schema: JsonSchema): JsonSchema {
  if (!schema.anyOf?.length) {
    return schema;
  }
  const nonNull = schema.anyOf.find((branch) => branch.type !== "null");
  return nonNull ?? schema.anyOf[0];
}

function schemaToTs(schema: JsonSchema, indent = 0): string {
  const pad = "  ".repeat(indent);
  const inner = primaryBranch(schema);

  if (inner.enum?.length) {
    return inner.enum.map((value) => JSON.stringify(value)).join(" | ");
  }
  if (inner.const !== undefined) {
    return JSON.stringify(inner.const);
  }

  switch (inner.type) {
    case "string":
      return "string";
    case "integer":
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "array": {
      const itemType = inner.items ? schemaToTs(inner.items, indent) : "unknown";
      return `readonly ${itemType}[]`;
    }
    case "object": {
      const properties = inner.properties ?? {};
      const required = new Set(inner.required ?? []);
      const lines = Object.entries(properties).map(([name, propertySchema]) => {
        const optional = !required.has(name) || isNullable(propertySchema);
        const type = schemaToTs(propertySchema, indent + 1);
        const nullable = isNullable(propertySchema) ? " | null" : "";
        return `${pad}  ${name}${optional ? "?" : ""}: ${type}${nullable};`;
      });
      if (lines.length === 0) {
        return "Record<string, unknown>";
      }
      return `{\n${lines.join("\n")}\n${pad}}`;
    }
    default:
      return "unknown";
  }
}

export function interfaceFromRowSchema(
  interfaceName: string,
  schema: JsonSchema,
): string {
  const body = schemaToTs(schema, 1);
  return `export type ${interfaceName} = ${body};\n`;
}

export function unionFromLiterals(typeName: string, values: readonly string[]): string {
  if (values.length === 0) {
    return `export type ${typeName} = never;\n`;
  }
  const members = values.map((value) => JSON.stringify(value)).join(" | ");
  return `export type ${typeName} = ${members};\n`;
}

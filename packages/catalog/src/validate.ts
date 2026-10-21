import Ajv2020, { type AnySchemaObject, type ErrorObject, type ValidateFunction } from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import type { Product, ProductFeature, ProductLinks, ProductSource } from "./types.ts";

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(record: Record<string, unknown>, key: string, label: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} field ${key} must be a non-empty string`);
  }
  return value;
}

function stringArray(value: unknown, label: string, optional: boolean): string[] {
  if (value === undefined && optional) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.length === 0)) {
    throw new Error(`${label} must be an array of non-empty strings`);
  }
  return value;
}

function optionalString(value: unknown, label: string): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a string or null`);
  }
  return value;
}

function requireFeatures(value: unknown, label: string): ProductFeature[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${label} features must be a non-empty array`);
  }
  return value.map((feature, index) => {
    if (!isRecord(feature)) {
      throw new Error(`${label} features[${index}] must be an object`);
    }
    return {
      title: requireString(feature, "title", `${label} features[${index}]`),
      description: requireString(feature, "description", `${label} features[${index}]`),
    };
  });
}

function requireLinks(value: unknown, label: string): ProductLinks {
  if (!isRecord(value)) {
    throw new Error(`${label} links must be an object`);
  }
  return {
    repository: requireString(value, "repository", `${label} links`),
    docs: optionalString(value.docs, `${label} links.docs`),
    website: optionalString(value.website, `${label} links.website`),
  };
}

function formatErrors(errors: ErrorObject[] | null | undefined): string {
  if (!errors || errors.length === 0) return "(no details)";
  return errors.map((error) => `${error.instancePath || "/"} ${error.message ?? "invalid"}`).join("\n");
}

export function assertSchema(schema: unknown, data: unknown, label: string): void {
  if (!isRecord(schema)) {
    throw new Error(`${label} schema is not an object`);
  }
  const schemaId = schema.$id;
  if (typeof schemaId === "string") {
    ajv.removeSchema(schemaId);
  }
  let validate: ValidateFunction;
  try {
    validate = ajv.compile(schema as AnySchemaObject);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${label} schema could not be compiled: ${message}`, { cause: error });
  }
  if (!validate(data)) {
    throw new Error(`${label} failed schema validation:\n${formatErrors(validate.errors)}`);
  }
}

export function normalizeProduct(data: unknown, source: ProductSource, label: string): Product {
  if (!isRecord(data)) {
    throw new Error(`${label} product document is not an object`);
  }
  if (data.schemaVersion !== 1) {
    throw new Error(`${label} schemaVersion must be 1`);
  }
  return {
    schemaVersion: 1,
    id: requireString(data, "id", label),
    name: requireString(data, "name", label),
    tagline: requireString(data, "tagline", label),
    description: requireString(data, "description", label),
    category: requireString(data, "category", label),
    features: requireFeatures(data.features, label),
    links: requireLinks(data.links, label),
    related: stringArray(data.related, `${label} related`, false),
    dependsOn: stringArray(data.dependsOn, `${label} dependsOn`, true),
    license: requireString(data, "license", label),
    status: requireString(data, "status", label),
    source,
  };
}

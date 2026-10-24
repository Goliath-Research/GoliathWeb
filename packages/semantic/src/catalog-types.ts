export type JsonSchema = {
  type?: string;
  title?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  enum?: readonly string[];
  const?: string | number | boolean;
  anyOf?: readonly JsonSchema[];
  additionalProperties?: boolean | JsonSchema;
  format?: string;
  description?: string;
};

export type SemanticAttribute = {
  code: string;
  column_name: string;
  filterable_ops: readonly string[];
  json_type: string;
  role: string;
};

export type SemanticEntity = {
  attributes: readonly SemanticAttribute[];
  code: string;
  content_hash: string;
  description: string;
  display_name: string;
  namespace: string;
  row_schema: JsonSchema;
  row_type: string;
  schema_id: string;
  schema_version: string;
  storage_relation: string;
};

export type SemanticRequest = {
  base_namespace: string | null;
  content_hash: string;
  entity_code: string;
  filter_template: unknown;
  max_rows: number;
  namespace: string;
  params_schema: JsonSchema;
  request_code: string;
  required_permission: string | null;
  result_schema: JsonSchema;
  row_type: string;
  schema_id: string;
  target_kind: string;
  target_name: string;
  version: string;
};

export type SemanticCatalog = {
  entities: Record<string, SemanticEntity>;
  requests: Record<string, SemanticRequest>;
};

export type ActionSchemaBundle = {
  content_hash: string;
  schema_id: string;
  schema_json: JsonSchema;
  schema_version: string;
};

export type ActionDefinition = {
  base_namespace: string | null;
  capability: string;
  description: string;
  display_name: string;
  entity_code: string;
  exposure: string;
  level: string;
  namespace: string;
  required_permission: string | null;
  schema_version: string;
  schemas: {
    input: ActionSchemaBundle;
    output: ActionSchemaBundle;
  };
};

export type ActionsCatalog = {
  actions: Record<string, ActionDefinition>;
};

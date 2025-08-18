// Core types for the DataDog OpenAPI schema generator

export interface OpenAPISchema {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: Record<string, PathItem>;
  components?: {
    schemas?: Record<string, SchemaObject>;
    securitySchemes?: Record<string, SecurityScheme>;
  };
  security?: SecurityRequirement[];
}

export interface PathItem {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  delete?: Operation;
  patch?: Operation;
}

export interface Operation {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
  security?: SecurityRequirement[];
}

export interface Parameter {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  description?: string;
  required?: boolean;
  schema: SchemaObject;
  style?: string;
  explode?: boolean;
}

export interface RequestBody {
  description?: string;
  content: Record<string, MediaType>;
  required?: boolean;
}

export interface MediaType {
  schema: SchemaObject;
  example?: any;
  examples?: Record<string, any>;
}

export interface Response {
  description: string;
  content?: Record<string, MediaType>;
  headers?: Record<string, Header>;
}

export interface Header {
  description?: string;
  schema: SchemaObject;
}

export interface SecurityScheme {
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  name?: string;
  in?: 'query' | 'header' | 'cookie';
  scheme?: string;
}

export interface SecurityRequirement {
  [name: string]: string[];
}

export interface SchemaObject {
  type?: string;
  format?: string;
  description?: string;
  example?: any;
  examples?: any[];
  properties?: Record<string, SchemaObject>;
  items?: SchemaObject;
  required?: string[];
  additionalProperties?: boolean | SchemaObject;
  $ref?: string;
  enum?: any[];
  allOf?: SchemaObject[];
  oneOf?: SchemaObject[];
  anyOf?: SchemaObject[];
  not?: SchemaObject;
  nullable?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  deprecated?: boolean;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: boolean | number;
  exclusiveMaximum?: boolean | number;
  multipleOf?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  minProperties?: number;
  maxProperties?: number;
}

// Generator-specific types

export interface GeneratedBlock {
  name: string;
  fileName: string;
  content: string;
  category: string;
  httpMethod: string;
  path: string;
  operationId?: string;
}

export interface BlockGenerationConfig {
  resourceName: string;
  operation: Operation;
  path: string;
  method: string;
  pathParams: Parameter[];
  queryParams: Parameter[];
  headerParams: Parameter[];
  requestBodySchema?: SchemaObject;
  responseSchema?: SchemaObject;
  operationId?: string;
}

export interface GeneratorOptions {
  outputDir: string;
  schemaUrl?: string;
  schemaFile?: string;
  resourceFilter?: string[];
  methodFilter?: string[];
  tagFilter?: string[];
  operationFilter?: string[];
}

// DataDog-specific types

export interface DataDogApiConfig {
  apiKey: string;
  appKey?: string;
  baseUrl: string;
  site?: string; // us1, us3, us5, eu1, ap1, etc.
}

export interface DataDogOperation {
  resource: 'monitors' | 'events' | 'metrics' | 'logs' | 'dashboards' | 'users' | 'hosts' | 'tags';
  action: 'create' | 'get' | 'list' | 'update' | 'delete' | 'search' | 'validate';
  version: 'v1' | 'v2';
}

export const DATADOG_RESOURCES = {
  MONITORS: 'monitors',
  EVENTS: 'events',
  METRICS: 'metrics',
  LOGS: 'logs',
  DASHBOARDS: 'dashboards',
  USERS: 'users',
  HOSTS: 'hosts',
  TAGS: 'tags',
  DOWNTIMES: 'downtimes',
  SYNTHETICS: 'synthetics',
  SLO: 'slo',
  INCIDENTS: 'incidents',
  SECURITY_MONITORING: 'security_monitoring',
} as const;

export type DataDogResource = typeof DATADOG_RESOURCES[keyof typeof DATADOG_RESOURCES];
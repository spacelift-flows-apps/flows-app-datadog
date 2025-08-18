import { 
  OpenAPISchema, 
  Operation, 
  Parameter, 
  SchemaObject, 
  BlockGenerationConfig,
  DataDogResource,
  DATADOG_RESOURCES
} from './types.js';

export class DataDogSchemaParser {
  private schema: OpenAPISchema;
  private resolvedSchemas: Map<string, SchemaObject> = new Map();

  constructor(schema: OpenAPISchema) {
    this.schema = schema;
    this.resolveSchemaReferences();
  }

  /**
   * Resolve all $ref references in the schema
   */
  private resolveSchemaReferences(): void {
    if (this.schema.components?.schemas) {
      for (const [name, schemaObj] of Object.entries(this.schema.components.schemas)) {
        this.resolvedSchemas.set(`#/components/schemas/${name}`, schemaObj);
      }
    }
  }

  /**
   * Resolve a schema reference to the actual schema object
   */
  public resolveSchema(schema: SchemaObject): SchemaObject {
    if (schema.$ref) {
      const resolved = this.resolvedSchemas.get(schema.$ref);
      if (!resolved) {
        console.warn(`Cannot resolve schema reference: ${schema.$ref}`);
        return { type: 'object' }; // Fallback
      }
      return this.resolveSchema(resolved); // Handle nested refs
    }
    return schema;
  }

  /**
   * Extract operations for specific DataDog resources
   */
  public extractOperations(
    resourceFilter?: string[], 
    methodFilter?: string[],
    tagFilter?: string[],
    operationFilter?: string[],
    excludePatterns?: string[]
  ): BlockGenerationConfig[] {
    const configs: BlockGenerationConfig[] = [];

    for (const [path, pathItem] of Object.entries(this.schema.paths)) {
      // Skip if path matches any exclude patterns
      if (excludePatterns && this.matchesExcludePatterns(path, excludePatterns)) {
        continue;
      }

      // Skip if resource filter is specified and path doesn't match
      if (resourceFilter && !this.matchesResourceFilter(path, resourceFilter)) {
        continue;
      }

      const methods = ['get', 'post', 'put', 'delete', 'patch'] as const;
      
      for (const method of methods) {
        const operation = pathItem[method];
        if (!operation) continue;

        // Skip if method filter is specified and method doesn't match
        if (methodFilter && !methodFilter.includes(method.toUpperCase())) {
          continue;
        }

        // Skip if tag filter is specified and operation doesn't match
        if (tagFilter && !this.matchesTagFilter(operation, tagFilter)) {
          continue;
        }

        // Skip if operation filter is specified and operationId doesn't match
        if (operationFilter && !this.matchesOperationFilter(operation, operationFilter)) {
          continue;
        }

        const config = this.createBlockConfig(path, method, operation);
        if (config) {
          configs.push(config);
        }
      }
    }

    return configs;
  }

  /**
   * Check if a path matches any of the exclude patterns
   */
  private matchesExcludePatterns(path: string, excludePatterns: string[]): boolean {
    return excludePatterns.some(pattern => {
      const normalizedPattern = pattern.toLowerCase();
      const normalizedPath = path.toLowerCase();
      
      // Check if path contains the exclude pattern
      return normalizedPath.includes(normalizedPattern);
    });
  }

  /**
   * Check if a path matches any of the resource filters
   */
  private matchesResourceFilter(path: string, resourceFilter: string[]): boolean {
    return resourceFilter.some(filter => {
      const normalizedFilter = filter.toLowerCase();
      const normalizedPath = path.toLowerCase();
      
      // Check for exact resource match in path
      return normalizedPath.includes(`/${normalizedFilter}`) || 
             normalizedPath.includes(`/${normalizedFilter}/`) ||
             normalizedPath.endsWith(`/${normalizedFilter}`);
    });
  }

  /**
   * Check if operation tags match any of the tag filters
   */
  private matchesTagFilter(operation: Operation, tagFilter: string[]): boolean {
    if (!operation.tags || operation.tags.length === 0) {
      return false;
    }

    return tagFilter.some(filter => 
      operation.tags!.some(tag => 
        tag.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }

  /**
   * Check if operation ID matches any of the operation filters
   */
  private matchesOperationFilter(operation: Operation, operationFilter: string[]): boolean {
    if (!operation.operationId) {
      return false;
    }

    return operationFilter.some(filter => 
      operation.operationId!.toLowerCase().includes(filter.toLowerCase())
    );
  }

  /**
   * Create a block configuration from an operation
   */
  private createBlockConfig(
    path: string, 
    method: string, 
    operation: Operation
  ): BlockGenerationConfig | null {
    try {
      const resourceName = this.extractResourceName(path, operation);
      
      // Get parameters by type
      const pathParams = this.extractPathParameters(operation, path);
      const queryParams = this.extractQueryParameters(operation);
      const headerParams = this.extractHeaderParameters(operation);
      const requestBodySchema = this.extractRequestBodySchema(operation);
      const responseSchema = this.extractResponseSchema(operation);

      return {
        resourceName,
        operation,
        path,
        method: method.toUpperCase(),
        pathParams,
        queryParams,
        headerParams,
        requestBodySchema,
        responseSchema,
        operationId: operation.operationId
      };
    } catch (error) {
      console.warn(`Failed to create block config for ${method.toUpperCase()} ${path}:`, error);
      return null;
    }
  }

  /**
   * Extract resource name from path and operation
   */
  private extractResourceName(path: string, operation: Operation): string {
    // First try to extract from operationId if available
    if (operation.operationId) {
      // DataDog operationIds often follow patterns like "getMonitor", "listEvents", etc.
      const match = operation.operationId.match(/^(get|list|create|update|delete|search)(.+)$/i);
      if (match) {
        return this.capitalizeFirst(match[2]);
      }
    }

    // Extract from path segments
    const segments = path.split('/').filter(s => s && !s.startsWith('{'));
    
    // Remove common API path segments
    const filteredSegments = segments.filter(s => 
      !['api', 'v1', 'v2'].includes(s.toLowerCase())
    );

    if (filteredSegments.length > 0) {
      // Get the main resource name - usually the first segment after /api/vX/
      let resourceName = filteredSegments[0];
      
      // Handle special DataDog resource names
      switch (resourceName.toLowerCase()) {
        case 'monitor':
        case 'monitors':
          return 'Monitor';
        case 'event':
        case 'events':
          return 'Event';
        case 'metric':
        case 'metrics':
          return 'Metric';
        case 'log':
        case 'logs':
          return 'Log';
        case 'dashboard':
        case 'dashboards':
          return 'Dashboard';
        case 'user':
        case 'users':
          return 'User';
        case 'host':
        case 'hosts':
          return 'Host';
        case 'tag':
        case 'tags':
          return 'Tag';
        case 'downtime':
        case 'downtimes':
          return 'Downtime';
        case 'synthetic':
        case 'synthetics':
          return 'Synthetic';
        case 'slo':
        case 'slos':
          return 'SLO';
        case 'incident':
        case 'incidents':
          return 'Incident';
        default:
          return this.capitalizeFirst(this.singularize(resourceName));
      }
    }

    // Fallback to tags if path parsing fails
    if (operation.tags && operation.tags.length > 0) {
      return this.capitalizeFirst(operation.tags[0]);
    }

    return 'Resource';
  }

  /**
   * Extract path parameters from operation, with fallback to path analysis
   */
  private extractPathParameters(operation: Operation, path: string): Parameter[] {
    const pathParams: Parameter[] = [];
    
    // Get explicit path parameters from operation
    if (operation.parameters) {
      pathParams.push(...operation.parameters.filter(param => param.in === 'path'));
    }
    
    // Infer missing path parameters from path template
    const pathParamNames = new Set(pathParams.map(p => p.name));
    const paramMatches = path.match(/\{([^}]+)\}/g);
    
    if (paramMatches) {
      for (const match of paramMatches) {
        const paramName = match.slice(1, -1); // Remove { }
        if (!pathParamNames.has(paramName)) {
          pathParams.push({
            name: paramName,
            in: 'path',
            required: true,
            description: `Path parameter: ${paramName}`,
            schema: { type: 'string' }
          });
        }
      }
    }
    
    return pathParams;
  }

  /**
   * Extract query parameters from operation
   */
  private extractQueryParameters(operation: Operation): Parameter[] {
    if (!operation.parameters) return [];
    
    return operation.parameters.filter(param => param.in === 'query');
  }

  /**
   * Extract header parameters from operation
   */
  private extractHeaderParameters(operation: Operation): Parameter[] {
    if (!operation.parameters) return [];
    
    return operation.parameters
      .filter(param => param.in === 'header')
      .filter(param => 
        // Exclude auth headers as they're handled by the app config
        !['authorization', 'dd-api-key', 'dd-application-key'].includes(param.name.toLowerCase())
      );
  }

  /**
   * Extract request body schema from operation
   */
  private extractRequestBodySchema(operation: Operation): SchemaObject | undefined {
    if (!operation.requestBody || !operation.requestBody.content) {
      return undefined;
    }

    // Look for JSON content type first
    const jsonContent = operation.requestBody.content['application/json'];
    if (jsonContent) {
      return this.resolveSchema(jsonContent.schema);
    }

    // Fall back to first available content type
    const firstContent = Object.values(operation.requestBody.content)[0];
    if (firstContent) {
      return this.resolveSchema(firstContent.schema);
    }

    return undefined;
  }

  /**
   * Extract response schema from operation (looks for 200/201 responses)
   */
  private extractResponseSchema(operation: Operation): SchemaObject | undefined {
    // Try successful response codes
    const successCodes = ['200', '201', '202', '204'];
    
    for (const code of successCodes) {
      const response = operation.responses[code];
      if (response?.content) {
        const jsonContent = response.content['application/json'];
        if (jsonContent) {
          return this.resolveSchema(jsonContent.schema);
        }
      }
    }

    return undefined;
  }

  /**
   * Convert plural to singular (basic implementation)
   */
  private singularize(word: string): string {
    // Handle common DataDog resource plurals
    const pluralMappings: Record<string, string> = {
      'monitors': 'monitor',
      'events': 'event',
      'metrics': 'metric',
      'logs': 'log',
      'dashboards': 'dashboard',
      'users': 'user',
      'hosts': 'host',
      'tags': 'tag',
      'downtimes': 'downtime',
      'synthetics': 'synthetic',
      'slos': 'slo',
      'incidents': 'incident',
    };

    const lowerWord = word.toLowerCase();
    if (pluralMappings[lowerWord]) {
      return pluralMappings[lowerWord];
    }

    // Basic pluralization rules
    if (word.endsWith('ies') && word.length > 3) {
      return word.slice(0, -3) + 'y';
    }
    if (word.endsWith('es') && word.length > 2) {
      return word.slice(0, -2);
    }
    if (word.endsWith('s') && word.length > 1) {
      return word.slice(0, -1);
    }
    
    return word;
  }

  /**
   * Get schema definitions for reference
   */
  public getSchemaDefinitions(): Record<string, SchemaObject> {
    return this.schema.components?.schemas || {};
  }

  /**
   * Get all available tags from the schema
   */
  public getAvailableTags(): string[] {
    const tags = new Set<string>();
    
    for (const pathItem of Object.values(this.schema.paths)) {
      const methods = ['get', 'post', 'put', 'delete', 'patch'] as const;
      for (const method of methods) {
        const operation = pathItem[method];
        if (operation?.tags) {
          operation.tags.forEach(tag => tags.add(tag));
        }
      }
    }
    
    return Array.from(tags).sort();
  }

  /**
   * Get all available operation IDs from the schema
   */
  public getAvailableOperationIds(): string[] {
    const operationIds = new Set<string>();
    
    for (const pathItem of Object.values(this.schema.paths)) {
      const methods = ['get', 'post', 'put', 'delete', 'patch'] as const;
      for (const method of methods) {
        const operation = pathItem[method];
        if (operation?.operationId) {
          operationIds.add(operation.operationId);
        }
      }
    }
    
    return Array.from(operationIds).sort();
  }

  /**
   * Utility function to capitalize first letter
   */
  private capitalizeFirst(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
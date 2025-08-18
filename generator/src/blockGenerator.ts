import { BlockGenerationConfig, GeneratedBlock, SchemaObject } from './types.js';
import { DataDogTypeConverter } from './typeConverter.js';
import { dataDogBlockTemplate, dataDogMethodTemplates, dataDogOperationPatterns } from './blockTemplate.js';

export class DataDogBlockGenerator {
  private typeConverter: DataDogTypeConverter;

  constructor() {
    this.typeConverter = new DataDogTypeConverter();
  }

  /**
   * Generate a flow block from a block configuration
   */
  public generateBlock(config: BlockGenerationConfig): GeneratedBlock {
    const blockName = this.generateBlockName(config);
    const fileName = this.generateFileName(blockName);
    const content = this.generateBlockContent(config, blockName);
    const categoryName = this.extractCategoryFromResource(config.resourceName);

    return {
      name: blockName,
      fileName,
      content,
      category: categoryName,
      httpMethod: config.method,
      path: config.path,
      operationId: config.operationId
    };
  }

  /**
   * Generate block name from configuration
   */
  private generateBlockName(config: BlockGenerationConfig): string {
    // Use operationId if available and meaningful
    if (config.operationId) {
      const operationId = config.operationId;
      
      // Convert from camelCase/PascalCase to readable name
      const blockName = this.convertOperationIdToBlockName(operationId);
      if (blockName) {
        return blockName;
      }
    }

    // Fallback to path and method-based naming
    const resource = config.resourceName.toLowerCase();
    const method = config.method.toLowerCase();
    const isSpecificResource = config.path.includes('{') && (config.path.includes('_id}') || config.path.includes('Id}') || config.path.includes('Name}'));
    
    let action = this.determineActionFromMethod(method, isSpecificResource);
    let resourceName = this.capitalizeFirst(config.resourceName);
    
    // Handle special DataDog resource naming
    resourceName = this.normalizeResourceName(resourceName);
    
    return `${action}${resourceName}`;
  }

  /**
   * Convert operationId to block name
   */
  private convertOperationIdToBlockName(operationId: string): string {
    // Handle common DataDog operationId patterns
    const patterns = [
      // Pattern: getMonitor -> GetMonitor
      /^(get|list|create|update|delete|search|submit|query|validate|schedule|cancel)(.+)$/i,
      // Pattern: listEventsV2 -> ListEvents
      /^(get|list|create|update|delete|search|submit|query|validate|schedule|cancel)(.+?)(?:V\d+)?$/i
    ];

    for (const pattern of patterns) {
      const match = operationId.match(pattern);
      if (match) {
        const action = this.capitalizeFirst(match[1]);
        const resource = this.capitalizeFirst(match[2]);
        return `${action}${resource}`;
      }
    }

    // If no pattern matches, use the operationId as-is but capitalize it
    return this.capitalizeFirst(operationId);
  }

  /**
   * Determine action from HTTP method
   */
  private determineActionFromMethod(method: string, isSpecificResource: boolean): string {
    switch (method) {
      case 'get':
        return isSpecificResource ? 'Get' : 'List';
      case 'post':
        return 'Create';
      case 'put':
        return 'Update';
      case 'patch':
        return 'Update';
      case 'delete':
        return 'Delete';
      default:
        return this.capitalizeFirst(method);
    }
  }

  /**
   * Normalize DataDog resource names
   */
  private normalizeResourceName(resourceName: string): string {
    const normalized = resourceName.toLowerCase();
    
    // Handle plural/singular forms
    switch (normalized) {
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
        return this.capitalizeFirst(resourceName);
    }
  }

  /**
   * Extract category from resource name
   */
  private extractCategoryFromResource(resourceName: string): string {
    return this.normalizeResourceName(resourceName);
  }

  /**
   * Generate file name from block name
   */
  private generateFileName(blockName: string): string {
    return `${blockName}.ts`;
  }

  /**
   * Generate the complete block content
   */
  private generateBlockContent(config: BlockGenerationConfig, blockName: string): string {
    const displayName = this.generateDisplayName(config);
    const description = this.generateDescription(config);
    const category = this.extractCategoryFromResource(config.resourceName);
    
    // Generate input configuration
    const inputConfig = this.generateInputConfig(config);
    const extractInputs = this.generateInputExtraction(config);
    const buildUrl = this.generateUrlBuilding(config);
    
    // Get method-specific template data
    const methodTemplate = dataDogMethodTemplates[config.method as keyof typeof dataDogMethodTemplates] || dataDogMethodTemplates.GET;
    
    // Generate output configuration
    const outputName = this.generateOutputName(config);
    const outputDescription = this.generateOutputDescription(config);
    const outputType = this.generateOutputType(config);

    // Generate headers
    const appKeyHeader = methodTemplate.requiresAppKey ? '\n            "DD-APPLICATION-KEY": appKey,' : '';
    const customHeaders = this.generateCustomHeaders(config);

    let content = dataDogBlockTemplate
      .replace(/{{blockName}}/g, blockName)
      .replace(/{{displayName}}/g, displayName)
      .replace(/{{description}}/g, description)
      .replace(/{{category}}/g, category)
      .replace(/{{inputConfig}}/g, inputConfig)
      .replace(/{{extractInputs}}/g, extractInputs)
      .replace(/{{buildUrl}}/g, buildUrl)
      .replace(/{{httpMethod}}/g, config.method)
      .replace(/{{appKeyHeader}}/g, appKeyHeader)
      .replace(/{{customHeaders}}/g, customHeaders)
      .replace(/{{requestBody}}/g, methodTemplate.requestBody)
      .replace(/{{handleResponse}}/g, methodTemplate.handleResponse)
      .replace(/{{emitData}}/g, methodTemplate.emitData)
      .replace(/{{operationDescription}}/g, this.getOperationDescription(config))
      .replace(/{{outputName}}/g, outputName)
      .replace(/{{outputDescription}}/g, outputDescription)
      .replace(/{{outputType}}/g, outputType);

    return content;
  }

  /**
   * Generate display name for the block
   */
  private generateDisplayName(config: BlockGenerationConfig): string {
    // Use operation summary if available
    if (config.operation.summary) {
      return config.operation.summary;
    }

    // Use operation description if available
    if (config.operation.description) {
      return config.operation.description;
    }

    // Use operationId-based pattern if available
    if (config.operationId) {
      return this.operationIdToDisplayName(config.operationId);
    }

    // Fallback to method and resource-based naming
    const resource = this.normalizeResourceName(config.resourceName);
    const method = config.method.toLowerCase();
    const isSpecificResource = config.path.includes('{');
    
    let action = '';
    switch (method) {
      case 'get':
        action = isSpecificResource ? 'Get' : 'List';
        break;
      case 'post':
        action = 'Create';
        break;
      case 'put':
      case 'patch':
        action = 'Update';
        break;
      case 'delete':
        action = 'Delete';
        break;
      default:
        action = this.capitalizeFirst(method);
    }

    return `${action} ${resource}`;
  }

  /**
   * Convert operationId to display name
   */
  private operationIdToDisplayName(operationId: string): string {
    // Handle common patterns
    const match = operationId.match(/^(get|list|create|update|delete|search|submit|query|validate|schedule|cancel)(.+?)(?:V\d+)?$/i);
    if (match) {
      const action = this.capitalizeFirst(match[1]);
      const resource = this.humanizeText(match[2]);
      return `${action} ${resource}`;
    }

    // Fallback: humanize the operationId
    return this.humanizeText(operationId);
  }

  /**
   * Generate description for the block
   */
  private generateDescription(config: BlockGenerationConfig): string {
    if (config.operation.description) {
      return this.sanitizeDescription(config.operation.description);
    }

    if (config.operation.summary) {
      return this.sanitizeDescription(config.operation.summary);
    }

    // Generate description based on operation
    const resource = this.normalizeResourceName(config.resourceName);
    const action = this.determineActionFromMethod(config.method.toLowerCase(), config.path.includes('{'));
    
    return `${action} ${resource.toLowerCase()} using the DataDog API`;
  }

  /**
   * Generate input configuration for the block
   */
  private generateInputConfig(config: BlockGenerationConfig): string {
    const inputs: string[] = [];

    // Add path parameters
    for (const param of config.pathParams) {
      const inputConfig = this.typeConverter.schemaToInputConfig(param.schema, param.name);
      const lines = inputConfig.split('\n');
      lines[lines.length - 2] = lines[lines.length - 2].replace('required: false', `required: ${param.required || true}`);
      inputs.push(`        ${this.typeConverter.parameterToCamelCase(param.name)}: ${lines.join('\n        ')},`);
    }

    // Add query parameters
    for (const param of config.queryParams) {
      const inputConfig = this.typeConverter.schemaToInputConfig(param.schema, param.name);
      const lines = inputConfig.split('\n');
      lines[lines.length - 2] = lines[lines.length - 2].replace('required: false', `required: ${param.required || false}`);
      inputs.push(`        ${this.typeConverter.parameterToCamelCase(param.name)}: ${lines.join('\n        ')},`);
    }

    // Add header parameters (excluding auth headers)
    for (const param of config.headerParams) {
      const inputConfig = this.typeConverter.schemaToInputConfig(param.schema, param.name);
      const lines = inputConfig.split('\n');
      lines[lines.length - 2] = lines[lines.length - 2].replace('required: false', `required: ${param.required || false}`);
      inputs.push(`        ${this.typeConverter.parameterToCamelCase(param.name)}: ${lines.join('\n        ')},`);
    }

    // Add request body fields for POST/PUT/PATCH
    if (config.requestBodySchema && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
      inputs.push(...this.generateRequestBodyInputs(config.requestBodySchema));
    }

    return inputs.join('\n');
  }

  /**
   * Generate request body inputs from schema
   */
  private generateRequestBodyInputs(schema: SchemaObject): string[] {
    const inputs: string[] = [];

    if (schema.properties) {
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        const inputConfig = this.typeConverter.schemaToInputConfig(propSchema as any, propName);
        const isRequired = schema.required?.includes(propName) || false;
        const lines = inputConfig.split('\n');
        lines[lines.length - 2] = lines[lines.length - 2].replace('required: false', `required: ${isRequired}`);
        inputs.push(`        ${this.typeConverter.parameterToCamelCase(propName)}: ${lines.join('\n        ')},`);
      }
    }

    return inputs;
  }

  /**
   * Generate input extraction code
   */
  private generateInputExtraction(config: BlockGenerationConfig): string {
    const extractions: string[] = [];
    const allParams = [...config.pathParams, ...config.queryParams, ...config.headerParams];
    
    if (allParams.length > 0) {
      const paramNames = allParams.map(p => this.typeConverter.parameterToCamelCase(p.name));
      extractions.push(`        const { ${paramNames.join(', ')} } = input.event.inputConfig;`);
    }

    // Add request body extraction for POST/PUT/PATCH
    if (config.requestBodySchema && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
      if (config.requestBodySchema.properties) {
        const bodyFields = Object.keys(config.requestBodySchema.properties)
          .map(f => this.typeConverter.parameterToCamelCase(f));
        if (bodyFields.length > 0) {
          extractions.push(`        const { ${bodyFields.join(', ')} } = input.event.inputConfig;`);
        }
      }
    }

    return extractions.join('\n');
  }

  /**
   * Generate URL building code
   */
  private generateUrlBuilding(config: BlockGenerationConfig): string {
    let urlTemplate = config.path;
    
    // Replace path parameters
    for (const param of config.pathParams) {
      const varName = this.typeConverter.parameterToCamelCase(param.name);
      urlTemplate = urlTemplate.replace(`{${param.name}}`, `\${${varName}}`);
    }

    let urlCode = `        const url = \`\${baseUrl}${urlTemplate}\`;`;

    // Add query parameters if any
    if (config.queryParams.length > 0) {
      urlCode = `        const urlBase = \`\${baseUrl}${urlTemplate}\`;\n        const queryParams = new URLSearchParams();`;
      for (const param of config.queryParams) {
        const varName = this.typeConverter.parameterToCamelCase(param.name);
        urlCode += `\n        if (${varName} !== undefined) queryParams.append('${param.name}', String(${varName}));`;
      }
      urlCode += '\n        const queryString = queryParams.toString();';
      urlCode += '\n        const url = queryString ? `${urlBase}?${queryString}` : urlBase;';
    }

    // Add request payload for POST/PUT/PATCH operations
    if (['POST', 'PUT', 'PATCH'].includes(config.method)) {
      urlCode += '\n        const requestPayload: any = {};';

      if (config.requestBodySchema && config.requestBodySchema.properties) {
        for (const [propName] of Object.entries(config.requestBodySchema.properties)) {
          const isRequired = config.requestBodySchema.required?.includes(propName) || false;
          const varName = this.typeConverter.parameterToCamelCase(propName);
          
          if (isRequired) {
            urlCode += `\n        requestPayload.${propName} = ${varName};`;
          } else {
            urlCode += `\n        if (${varName} !== undefined) requestPayload.${propName} = ${varName};`;
          }
        }
      }
    }

    return urlCode;
  }

  /**
   * Generate custom headers
   */
  private generateCustomHeaders(config: BlockGenerationConfig): string {
    if (config.headerParams.length === 0) {
      return '';
    }

    let headers = '';
    for (const param of config.headerParams) {
      const varName = this.typeConverter.parameterToCamelCase(param.name);
      if (param.required) {
        headers += `\n            "${param.name}": ${varName},`;
      } else {
        headers += `\n            ...(${varName} && { "${param.name}": ${varName} }),`;
      }
    }

    return headers;
  }

  /**
   * Get operation description for error messages
   */
  private getOperationDescription(config: BlockGenerationConfig): string {
    // Use operation summary if available for more descriptive error messages
    if (config.operation.summary) {
      return config.operation.summary.toLowerCase();
    }

    const resource = this.humanizeText(config.resourceName).toLowerCase();
    const method = config.method.toLowerCase();
    
    switch (method) {
      case 'get':
        return config.path.includes('{') ? `get ${resource}` : `list ${resource}`;
      case 'post':
        return config.path.includes('search') ? `search ${resource}` : `create ${resource}`;
      case 'put':
      case 'patch':
        return `update ${resource}`;
      case 'delete':
        return `delete ${resource}`;
      default:
        return `${method} ${resource}`;
    }
  }

  /**
   * Generate output name
   */
  private generateOutputName(config: BlockGenerationConfig): string {
    const resource = this.normalizeResourceName(config.resourceName);
    
    switch (config.method) {
      case 'GET':
        return config.path.includes('{') ? `${resource} Details` : `${resource} List`;
      case 'POST':
        return `Created ${resource}`;
      case 'PUT':
      case 'PATCH':
        return `Updated ${resource}`;
      case 'DELETE':
        return `Delete Result`;
      default:
        return `${resource} Result`;
    }
  }

  /**
   * Generate output description
   */
  private generateOutputDescription(config: BlockGenerationConfig): string {
    const resource = config.resourceName.toLowerCase();
    
    switch (config.method) {
      case 'GET':
        return config.path.includes('{') 
          ? `The retrieved ${resource} object`
          : `List of ${resource} objects`;
      case 'POST':
        return `The created ${resource} object`;
      case 'PUT':
      case 'PATCH':
        return `The updated ${resource} object`;
      case 'DELETE':
        return `Result of the delete operation`;
      default:
        return `Result of the ${config.method} operation`;
    }
  }

  /**
   * Generate output type definition
   */
  private generateOutputType(config: BlockGenerationConfig): string {
    if (config.responseSchema) {
      return this.schemaToFlowOutputType(config.responseSchema);
    }

    // Default output type
    return `{
        type: "object",
        properties: {
          result: { type: "object" },
          operation: { type: "string" }
        },
        required: ["result"]
      }`;
  }

  /**
   * Convert schema to flow output type format
   */
  private schemaToFlowOutputType(schema: SchemaObject): string {
    if (schema.type === 'object' && schema.properties) {
      const properties: string[] = [];
      
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        const prop = propSchema as any;
        const propType = this.convertSchemaToFlowType(prop);
        properties.push(`          ${propName}: ${propType}`);
      }

      const required = schema.required ? `["${schema.required.join('", "')}"]` : '[]';

      return `{
        type: "object",
        properties: {
${properties.join(',\n')}
        },
        required: ${required}
      }`;
    }

    return `{
        type: "object",
        properties: {
          result: { type: "object" }
        },
        required: ["result"]
      }`;
  }

  /**
   * Convert individual schema property to flow type
   */
  private convertSchemaToFlowType(schema: SchemaObject): string {
    switch (schema.type) {
      case 'string':
        return '{ type: "string" }';
      case 'number':
      case 'integer':
        return '{ type: "number" }';
      case 'boolean':
        return '{ type: "boolean" }';
      case 'array':
        if (schema.items) {
          const itemType = this.convertSchemaToFlowType(schema.items);
          return `{ type: "array", items: ${itemType} }`;
        }
        return '{ type: "array", items: { type: "string" } }';
      case 'object':
        if (schema.additionalProperties) {
          const valueType = typeof schema.additionalProperties === 'boolean' 
            ? '{ type: "string" }'
            : this.convertSchemaToFlowType(schema.additionalProperties);
          return `{ type: "object", additionalProperties: ${valueType} }`;
        }
        return '{ type: "object" }';
      default:
        return '{ type: "string" }';
    }
  }

  /**
   * Utility functions
   */
  private capitalizeFirst(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private humanizeText(text: string): string {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/^\s+/, '')
      .trim();
  }

  private sanitizeDescription(description: string): string {
    return description
      .replace(/\\/g, '\\\\')  // Escape backslashes first
      .replace(/`/g, '\\`')    // Escape backticks for template literals
      .replace(/\$/g, '\\$')   // Escape dollar signs for template literals
      .replace(/\n/g, ' ')     // Replace newlines with spaces
      .trim();
  }
}
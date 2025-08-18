import { SchemaObject } from './types.js';

export class DataDogTypeConverter {
  /**
   * Convert OpenAPI schema to TypeScript type definition
   */
  public schemaToTypeScript(schema: SchemaObject, indent = 0): string {
    if (schema.$ref) {
      // For references, just return the reference name
      const refName = schema.$ref.split('/').pop() || 'unknown';
      return this.convertRefName(refName);
    }

    switch (schema.type) {
      case 'string':
        if (schema.enum) {
          return schema.enum.map(e => `"${e}"`).join(' | ');
        }
        return 'string';

      case 'number':
      case 'integer':
        return 'number';

      case 'boolean':
        return 'boolean';

      case 'array':
        if (schema.items) {
          const itemType = this.schemaToTypeScript(schema.items, indent);
          return `${itemType}[]`;
        }
        return 'any[]';

      case 'object':
        return this.objectToTypeScript(schema, indent);

      default:
        return 'any';
    }
  }

  /**
   * Convert object schema to TypeScript interface
   */
  private objectToTypeScript(schema: SchemaObject, indent = 0): string {
    const indentStr = '  '.repeat(indent);
    const nextIndentStr = '  '.repeat(indent + 1);

    if (!schema.properties) {
      if (schema.additionalProperties) {
        if (typeof schema.additionalProperties === 'boolean') {
          return 'Record<string, any>';
        }
        const valueType = this.schemaToTypeScript(schema.additionalProperties, indent);
        return `Record<string, ${valueType}>`;
      }
      return 'Record<string, any>';
    }

    const lines = ['{'];
    
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      const isRequired = schema.required?.includes(propName) || false;
      const optional = isRequired ? '' : '?';
      const propType = this.schemaToTypeScript(propSchema, indent + 1);
      const description = propSchema.description ? `\n${nextIndentStr}/** ${propSchema.description} */` : '';
      
      lines.push(`${description}${nextIndentStr}${propName}${optional}: ${propType};`);
    }

    if (schema.additionalProperties && typeof schema.additionalProperties !== 'boolean') {
      const valueType = this.schemaToTypeScript(schema.additionalProperties, indent + 1);
      lines.push(`${nextIndentStr}[key: string]: ${valueType};`);
    }

    lines.push(`${indentStr}}`);
    return lines.join('\n' + indentStr);
  }

  /**
   * Convert schema to flow input config format
   */
  public schemaToInputConfig(schema: SchemaObject, fieldName: string): string {
    const baseConfig = {
      name: this.humanizeName(fieldName),
      description: this.sanitizeDescription(schema.description || `${this.humanizeName(fieldName)} parameter`),
      required: false, // Will be set by caller based on required array
    };

    let typeConfig: any;

    switch (schema.type) {
      case 'string':
        if (schema.enum) {
          typeConfig = {
            type: 'string',
            enum: schema.enum
          };
        } else {
          typeConfig = { type: 'string' };
        }
        break;

      case 'number':
      case 'integer':
        typeConfig = { 
          type: 'number',
          ...(schema.minimum !== undefined && { minimum: schema.minimum }),
          ...(schema.maximum !== undefined && { maximum: schema.maximum })
        };
        break;

      case 'boolean':
        typeConfig = { type: 'boolean' };
        break;

      case 'array':
        typeConfig = {
          type: 'array',
          items: schema.items ? this.schemaToSimpleType(schema.items) : { type: 'string' },
          ...(schema.minItems !== undefined && { minItems: schema.minItems }),
          ...(schema.maxItems !== undefined && { maxItems: schema.maxItems })
        };
        break;

      case 'object':
        if (schema.additionalProperties) {
          typeConfig = {
            type: 'object',
            additionalProperties: typeof schema.additionalProperties === 'boolean' 
              ? { type: 'string' }
              : this.schemaToSimpleType(schema.additionalProperties)
          };
        } else if (schema.properties) {
          typeConfig = this.objectSchemaToInputType(schema);
        } else {
          typeConfig = {
            type: 'object',
            additionalProperties: { type: 'string' }
          };
        }
        break;

      default:
        typeConfig = { type: 'string' };
    }

    // Add example if available
    if (schema.example !== undefined) {
      typeConfig.example = schema.example;
    }

    return `{
  name: "${baseConfig.name}",
  description: \`${baseConfig.description}\`,
  type: ${JSON.stringify(typeConfig, null, 2).replace(/\n/g, '\n  ')},
  required: ${baseConfig.required},
}`;
  }

  /**
   * Convert object schema to input type format
   */
  private objectSchemaToInputType(schema: SchemaObject): any {
    if (!schema.properties) {
      return {
        type: 'object',
        additionalProperties: { type: 'string' }
      };
    }

    const properties: any = {};
    const required = schema.required || [];

    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      properties[propName] = this.schemaToSimpleType(propSchema);
    }

    return {
      type: 'object',
      properties,
      ...(required.length > 0 && { required })
    };
  }

  /**
   * Convert schema to simple type object (for nested schemas)
   */
  private schemaToSimpleType(schema: SchemaObject): any {
    switch (schema.type) {
      case 'string':
        if (schema.enum) {
          return { type: 'string', enum: schema.enum };
        }
        return { type: 'string' };
      case 'number':
      case 'integer':
        return { 
          type: 'number',
          ...(schema.minimum !== undefined && { minimum: schema.minimum }),
          ...(schema.maximum !== undefined && { maximum: schema.maximum })
        };
      case 'boolean':
        return { type: 'boolean' };
      case 'array':
        return {
          type: 'array',
          items: schema.items ? this.schemaToSimpleType(schema.items) : { type: 'string' },
          ...(schema.minItems !== undefined && { minItems: schema.minItems }),
          ...(schema.maxItems !== undefined && { maxItems: schema.maxItems })
        };
      case 'object':
        if (schema.additionalProperties) {
          return {
            type: 'object',
            additionalProperties: typeof schema.additionalProperties === 'boolean'
              ? { type: 'string' }
              : this.schemaToSimpleType(schema.additionalProperties)
          };
        }
        if (schema.properties) {
          const properties: any = {};
          for (const [propName, propSchema] of Object.entries(schema.properties)) {
            properties[propName] = this.schemaToSimpleType(propSchema);
          }
          return {
            type: 'object',
            properties,
            ...(schema.required && schema.required.length > 0 && { required: schema.required })
          };
        }
        return { type: 'object' };
      default:
        return { type: 'string' };
    }
  }

  /**
   * Convert reference name to TypeScript interface name
   */
  private convertRefName(refName: string): string {
    // Convert from DataDog style names to PascalCase
    return refName
      .split('.')
      .pop() || refName;
  }

  /**
   * Convert field name to human readable label
   */
  private humanizeName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/^\s+/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  }

  /**
   * Sanitize description for use in template strings
   */
  private sanitizeDescription(description: string): string {
    return description
      .replace(/\\/g, '\\\\')  // Escape backslashes first
      .replace(/`/g, '\\`')    // Escape backticks for template literals
      .replace(/\$/g, '\\$')   // Escape dollar signs for template literals
      .replace(/\n/g, ' ')     // Replace newlines with spaces
      .trim();
  }

  /**
   * Convert DataDog parameter names to camelCase for JavaScript variables
   */
  public parameterToCamelCase(paramName: string): string {
    // Handle bracket notation like filter[query] -> filterQuery
    // Handle hyphens like content-Encoding -> contentEncoding
    // Handle dots like version.first -> versionFirst
    // Handle @ symbols like @resource_id -> resourceId
    // Handle $ symbols and backticks like `$op` -> Op
    return paramName
      .replace(/\[([^\]]+)\]/g, (_, content) => this.capitalizeFirst(content))
      .replace(/`\$([a-zA-Z]+)`/g, (_, content) => this.capitalizeFirst(content))
      .replace(/@([a-zA-Z])/g, (_, letter) => letter.toUpperCase())
      .replace(/\.([a-zA-Z])/g, (_, letter) => letter.toUpperCase())
      .replace(/-([a-zA-Z])/g, (_, letter) => letter.toUpperCase())
      .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      .replace(/^[A-Z]/, letter => letter.toLowerCase());
  }

  /**
   * Capitalize first letter of a string
   */
  private capitalizeFirst(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Convert DataDog enum values to proper format
   */
  public formatEnumValue(value: any): string {
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    return String(value);
  }

  /**
   * Determine if a field should be treated as sensitive
   */
  public isSensitiveField(fieldName: string): boolean {
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /token/i,
      /key/i,
      /auth/i,
      /credential/i,
      /private/i
    ];

    return sensitivePatterns.some(pattern => pattern.test(fieldName));
  }

  /**
   * Get default value for a schema type
   */
  public getDefaultValue(schema: SchemaObject): any {
    if (schema.example !== undefined) {
      return schema.example;
    }

    switch (schema.type) {
      case 'string':
        return schema.enum ? schema.enum[0] : '';
      case 'number':
      case 'integer':
        return schema.minimum || 0;
      case 'boolean':
        return false;
      case 'array':
        return [];
      case 'object':
        return {};
      default:
        return null;
    }
  }
}
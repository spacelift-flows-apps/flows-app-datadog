#!/usr/bin/env node

import { promises as fs } from 'fs';
import { join } from 'path';
import { DataDogSchemaParser } from './schemaParser.js';
import { DataDogBlockGenerator } from './blockGenerator.js';
import { GeneratorOptions, OpenAPISchema, GeneratedBlock } from './types.js';
import yaml from 'js-yaml';

class DataDogFlowGenerator {
  private schemaParser!: DataDogSchemaParser;
  private blockGenerator: DataDogBlockGenerator;

  constructor() {
    this.blockGenerator = new DataDogBlockGenerator();
  }

  /**
   * Generate flow blocks from DataDog OpenAPI schema(s)
   */
  async generate(options: GeneratorOptions): Promise<GeneratedBlock[]> {
    console.log('🚀 Starting DataDog flow block generation...');

    const allBlocks: GeneratedBlock[] = [];
    const blockNames = new Set<string>();

    // Define schema configurations with version postfixes
    const schemaConfigs = [
      {
        url: 'https://raw.githubusercontent.com/DataDog/datadog-api-client-go/master/.generator/schemas/v1/openapi.yaml',
        version: 'V1',
        description: 'DataDog API V1'
      },
      {
        url: 'https://raw.githubusercontent.com/DataDog/datadog-api-client-go/master/.generator/schemas/v2/openapi.yaml',
        version: 'V2',
        description: 'DataDog API V2'
      }
    ];

    // Set default path filters for monitors and events if no filters are specified
    const optionsWithDefaults = this.applyDefaultFilters(options);

    // If custom schema provided, use only that one
    if (optionsWithDefaults.schemaUrl || optionsWithDefaults.schemaFile) {
      const schema = await this.loadSchema(optionsWithDefaults);
      const version = optionsWithDefaults.schemaUrl?.includes('/v1/') ? 'V1' : 
                     optionsWithDefaults.schemaUrl?.includes('/v2/') ? 'V2' : '';
      const blocks = await this.processSchema(schema, version, optionsWithDefaults, blockNames);
      allBlocks.push(...blocks);
    } else {
      // Process both V1 and V2 schemas
      for (const config of schemaConfigs) {
        console.log(`\n📥 Processing ${config.description} schema...`);
        try {
          const tempOptions = { ...optionsWithDefaults, schemaUrl: config.url };
          const schema = await this.loadSchema(tempOptions);
          const blocks = await this.processSchema(schema, config.version, tempOptions, blockNames);
          allBlocks.push(...blocks);
        } catch (error) {
          console.warn(`⚠️  Failed to process ${config.description}:`, error);
        }
      }
    }

    if (allBlocks.length === 0) {
      console.warn('⚠️  No blocks were generated');
      return [];
    }

    // Write blocks to files
    console.log('\n💾 Writing blocks to files...');
    await this.writeBlocks(allBlocks, options.outputDir);

    // Update block registry
    console.log('📝 Updating block registry...');
    await this.updateBlockRegistry(allBlocks, options.outputDir);

    console.log(`🎉 Successfully generated ${allBlocks.length} DataDog API blocks!`);
    return allBlocks;
  }

  /**
   * Process a single schema and generate blocks
   */
  private async processSchema(
    schema: OpenAPISchema, 
    version: string, 
    options: GeneratorOptions, 
    globalBlockNames: Set<string>
  ): Promise<GeneratedBlock[]> {
    this.schemaParser = new DataDogSchemaParser(schema);

    // Show available resources for filtering
    if (options.resourceFilter || options.tagFilter) {
      console.log('📋 Available tags:', this.schemaParser.getAvailableTags().slice(0, 10).join(', '), '...');
    }

    // Extract operations
    console.log(`📋 Extracting operations from ${version} schema...`);
    const configs = this.schemaParser.extractOperations(
      options.resourceFilter,
      options.methodFilter,
      options.tagFilter,
      options.operationFilter
    );

    console.log(`✅ Found ${configs.length} operations in ${version} schema`);

    if (configs.length === 0) {
      console.warn(`⚠️  No operations found matching the filters in ${version}. Available tags:`);
      console.log(this.schemaParser.getAvailableTags().join(', '));
      return [];
    }

    // Generate blocks
    console.log(`🔨 Generating ${version} blocks...`);
    const blocks: GeneratedBlock[] = [];
    
    for (const config of configs) {
      try {
        const block = this.blockGenerator.generateBlock(config);
        
        // Add version postfix to block name
        const versionedBlockName = version ? `${block.name}${version}` : block.name;
        
        // Handle duplicate names globally
        let finalBlockName = versionedBlockName;
        let counter = 1;
        while (globalBlockNames.has(finalBlockName)) {
          finalBlockName = `${versionedBlockName}${counter}`;
          counter++;
        }
        
        // Update the block with the final name
        if (finalBlockName !== block.name) {
          const originalExportName = block.name;
          block.name = finalBlockName;
          block.fileName = `${finalBlockName}.ts`;
          block.content = block.content.replace(
            `export const ${originalExportName}: AppBlock`, 
            `export const ${finalBlockName}: AppBlock`
          );
        }
        
        globalBlockNames.add(finalBlockName);
        blocks.push(block);
        console.log(`  ✓ Generated ${finalBlockName} (${block.httpMethod} ${block.path})`);
      } catch (error) {
        console.warn(`  ⚠️  Failed to generate ${version} block for ${config.method} ${config.path}:`, error);
      }
    }

    return blocks;
  }

  /**
   * Apply default filters for monitors and events if no filters are specified
   */
  private applyDefaultFilters(options: GeneratorOptions): GeneratorOptions {
    // If no filters are specified, default to monitors and events APIs only
    const hasFilters = options.resourceFilter || options.tagFilter || options.operationFilter || options.methodFilter;
    
    if (!hasFilters) {
      console.log('📋 No filters specified - defaulting to monitors and events APIs only');
      return {
        ...options,
        // Filter for paths that contain monitor or event endpoints
        resourceFilter: ['monitor', 'events']
      };
    }
    
    return options;
  }

  /**
   * Load OpenAPI schema from URL or file
   */
  private async loadSchema(options: GeneratorOptions): Promise<OpenAPISchema> {
    console.log('📥 Loading DataDog OpenAPI schema...');

    if (options.schemaUrl) {
      console.log(`  Fetching from: ${options.schemaUrl}`);
      const response = await fetch(options.schemaUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch schema: ${response.status} ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      const text = await response.text();
      
      if (contentType?.includes('yaml') || options.schemaUrl.endsWith('.yaml') || options.schemaUrl.endsWith('.yml')) {
        return yaml.load(text) as OpenAPISchema;
      } else {
        return JSON.parse(text);
      }
    } else if (options.schemaFile) {
      console.log(`  Reading from file: ${options.schemaFile}`);
      const content = await fs.readFile(options.schemaFile, 'utf-8');
      
      if (options.schemaFile.endsWith('.yaml') || options.schemaFile.endsWith('.yml')) {
        return yaml.load(content) as OpenAPISchema;
      } else {
        return JSON.parse(content);
      }
    } else {
      throw new Error('Either schemaUrl or schemaFile must be provided');
    }
  }

  /**
   * Write generated blocks to files
   */
  private async writeBlocks(blocks: GeneratedBlock[], outputDir: string): Promise<void> {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Write each block file
    for (const block of blocks) {
      const filePath = join(outputDir, block.fileName);
      await fs.writeFile(filePath, block.content, 'utf-8');
      console.log(`  ✓ Wrote ${block.fileName}`);
    }
  }

  /**
   * Update block registry index file
   */
  private async updateBlockRegistry(blocks: GeneratedBlock[], outputDir: string): Promise<void> {
    const indexPath = join(outputDir, 'index.ts');
    
    // Generate imports
    const imports = blocks
      .map(block => `import { ${block.name} } from './${block.fileName.replace('.ts', '')}.js';`)
      .join('\n');

    // Generate block dictionary
    const blockEntries = blocks
      .map(block => `  ${block.name}: ${block.name},`)
      .join('\n');

    // Generate exports
    const exports = blocks
      .map(block => block.name)
      .join(', ');

    const indexContent = `/**
 * Generated Block Registry for DataDog API
 * 
 * This file is auto-generated. Do not edit manually.
 * Generated on: ${new Date().toISOString()}
 * Total blocks: ${blocks.length}
 */

${imports}

/**
 * Dictionary of all available blocks
 */
export const blocks = {
${blockEntries}
} as const;

// Named exports for individual blocks
export { ${exports} };
`;

    await fs.writeFile(indexPath, indexContent, 'utf-8');
    console.log('  ✓ Updated index.ts');
  }

  /**
   * Generate summary report
   */
  async generateReport(blocks: GeneratedBlock[], outputDir: string): Promise<void> {
    const reportPath = join(outputDir, 'generation-report.md');
    
    // Group blocks by category
    const byCategory = blocks.reduce((acc, block) => {
      if (!acc[block.category]) {
        acc[block.category] = [];
      }
      acc[block.category].push(block);
      return acc;
    }, {} as Record<string, GeneratedBlock[]>);

    // Group by HTTP method
    const byMethod = blocks.reduce((acc, block) => {
      if (!acc[block.httpMethod]) {
        acc[block.httpMethod] = [];
      }
      acc[block.httpMethod].push(block);
      return acc;
    }, {} as Record<string, GeneratedBlock[]>);

    const report = `# DataDog API Block Generation Report

Generated on: ${new Date().toISOString()}
Total blocks: ${blocks.length}

## Summary by Category

${Object.entries(byCategory)
  .map(([category, categoryBlocks]) => 
    `### ${category} (${categoryBlocks.length} blocks)\n${categoryBlocks.map(b => `- ${b.name} (${b.httpMethod} ${b.path})`).join('\n')}`
  ).join('\n\n')}

## Summary by HTTP Method

${Object.entries(byMethod)
  .map(([method, methodBlocks]) => 
    `### ${method} (${methodBlocks.length} blocks)\n${methodBlocks.map(b => `- ${b.name}`).join('\n')}`
  ).join('\n\n')}

## All Generated Blocks

${blocks.map(block => `- **${block.name}** (\`${block.httpMethod} ${block.path}\`) - ${block.category}`).join('\n')}
`;

    await fs.writeFile(reportPath, report, 'utf-8');
    console.log('  ✓ Generated report: generation-report.md');
  }
}

/**
 * CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const options: GeneratorOptions = {
    outputDir: './blocks',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--output':
      case '-o':
        options.outputDir = args[++i];
        break;
      case '--schema-url':
        options.schemaUrl = args[++i];
        options.schemaFile = undefined;
        break;
      case '--schema-file':
        options.schemaFile = args[++i];
        options.schemaUrl = undefined;
        break;
      case '--resources':
      case '-r':
        options.resourceFilter = args[++i].split(',').map(s => s.trim());
        break;
      case '--methods':
      case '-m':
        options.methodFilter = args[++i].split(',').map(m => m.trim().toUpperCase());
        break;
      case '--tags':
      case '-t':
        options.tagFilter = args[++i].split(',').map(s => s.trim());
        break;
      case '--operations':
        options.operationFilter = args[++i].split(',').map(s => s.trim());
        break;
      case '--help':
      case '-h':
        console.log(`
DataDog API Flow Block Generator

Usage: node generator.js [options]

Options:
  -o, --output <dir>           Output directory (default: ./blocks)
  --schema-url <url>           DataDog OpenAPI schema URL
  --schema-file <file>         DataDog OpenAPI schema file path (JSON or YAML)
  -r, --resources <list>       Comma-separated resource filter (e.g., monitors,events)
  -m, --methods <list>         Comma-separated HTTP methods (e.g., GET,POST,PUT)
  -t, --tags <list>           Comma-separated tag filter (e.g., "Monitors","Events")
  --operations <list>          Comma-separated operationId filter
  -h, --help                   Show this help

Examples:
  # Generate blocks for monitors and events only
  node generator.js --resources monitors,events --schema-url https://raw.githubusercontent.com/DataDog/datadog-api-client-go/main/.generator/schemas/v2/openapi.yaml

  # Generate only GET and POST operations
  node generator.js --methods GET,POST --schema-file ./datadog-schema.yaml

  # Generate blocks for specific tags
  node generator.js --tags "Monitors","Events" --output ./generated-blocks

  # Use local schema file
  node generator.js --schema-file ./openapi.yaml --resources monitors --output ./blocks
`);
        process.exit(0);
      default:
        if (arg.startsWith('-')) {
          console.warn(`Unknown argument: ${arg}`);
        }
    }
  }

  // If no schema provided, both V1 and V2 will be processed automatically
  if (!options.schemaUrl && !options.schemaFile) {
    console.log('No specific schema provided - processing both V1 and V2 schemas');
  }

  try {
    const generator = new DataDogFlowGenerator();
    const blocks = await generator.generate(options);
    
    if (blocks.length > 0) {
      await generator.generateReport(blocks, options.outputDir);
    }
  } catch (error) {
    console.error('❌ Generation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { DataDogFlowGenerator };
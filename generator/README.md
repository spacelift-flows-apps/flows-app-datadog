# DataDog API Flow Block Generator

A TypeScript-based generator that creates Flow API blocks from DataDog's OpenAPI specification. This tool automatically generates type-safe, ready-to-use blocks for the Spacelift Flows platform.

## Features

- **Complete DataDog API Coverage**: Generate blocks for all DataDog APIs (monitors, events, metrics, logs, dashboards, etc.)
- **Type Safety**: Full TypeScript support with proper type definitions
- **Filtering Options**: Generate only the blocks you need using resource, method, tag, or operation filters
- **Schema Validation**: Built-in OpenAPI schema validation and resolution
- **Automatic Documentation**: Self-documenting blocks with proper descriptions and examples
- **Batch Generation**: Generate hundreds of blocks in seconds

## Installation

```bash
cd generator
npm install
npm run build
```

## Usage

### Basic Usage

```bash
# Generate all DataDog API blocks
npm run generate

# Generate blocks for specific resources
npm run generate:monitors
npm run generate:events

# Generate with custom output directory
node dist/generator.js --output ./my-blocks
```

### Advanced Filtering

```bash
# Generate only monitors and events blocks
node dist/generator.js --resources monitors,events

# Generate only GET and POST operations
node dist/generator.js --methods GET,POST

# Generate blocks for specific OpenAPI tags
node dist/generator.js --tags "Monitors","Events"

# Generate blocks for specific operations
node dist/generator.js --operations getMonitor,createMonitor

# Use local schema file
node dist/generator.js --schema-file ./datadog-openapi.yaml

# Combine filters
node dist/generator.js --resources monitors --methods GET,POST --output ./monitor-blocks
```

## CLI Options

| Option | Short | Description | Example |
|--------|-------|-------------|---------|
| `--output` | `-o` | Output directory | `--output ./blocks` |
| `--schema-url` | | DataDog OpenAPI schema URL | `--schema-url https://...` |
| `--schema-file` | | Local schema file path | `--schema-file ./schema.yaml` |
| `--resources` | `-r` | Resource filter (comma-separated) | `--resources monitors,events` |
| `--methods` | `-m` | HTTP methods filter | `--methods GET,POST` |
| `--tags` | `-t` | OpenAPI tags filter | `--tags "Monitors"` |
| `--operations` | | OperationId filter | `--operations getMonitor` |
| `--help` | `-h` | Show help | |

## Generated Block Structure

Each generated block follows this structure:

```typescript
import { AppBlock, events } from "@slflows/sdk/v1";

export const createMonitor: AppBlock = {
  name: "Create Monitor",
  description: "Create a new DataDog monitor",
  category: "Monitor",

  inputs: {
    default: {
      config: {
        // Auto-generated input configuration based on OpenAPI schema
        name: {
          name: "Monitor Name",
          description: "Name of the monitor",
          type: "string",
          required: true,
        },
        // ... more inputs
      },
      onEvent: async (input) => {
        // Auto-generated implementation
        const { name, type, query } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        // ... API call logic
      },
    },
  },

  outputs: {
    default: {
      name: "Created Monitor",
      description: "The created monitor object",
      default: true,
      type: {
        // Auto-generated output type based on response schema
      },
    },
  },
};
```

## DataDog Resources Supported

The generator supports all major DataDog API resources:

- **Monitors**: Create, read, update, delete, search monitors
- **Events**: Submit and query events
- **Metrics**: Submit metrics, query timeseries data
- **Logs**: Search and aggregate logs
- **Dashboards**: Manage dashboards and dashboard lists
- **Users**: User management operations
- **Hosts**: Host and infrastructure monitoring
- **Tags**: Tag management for resources
- **Downtimes**: Schedule and manage downtimes
- **Synthetics**: Synthetic monitoring tests
- **SLOs**: Service Level Objectives
- **Incidents**: Incident management
- **Security Monitoring**: Security rules and signals

## Example Workflows

### Generate Monitor Blocks Only

```bash
node dist/generator.js \
  --resources monitors \
  --output ./monitor-blocks \
  --schema-url https://raw.githubusercontent.com/DataDog/datadog-api-client-go/v2.44.0/.generator/schemas/v2/openapi.yaml
```

### Generate Read-Only Operations

```bash
node dist/generator.js \
  --methods GET \
  --output ./readonly-blocks
```

### Generate Specific Operations

```bash
node dist/generator.js \
  --operations getMonitor,listMonitors,createEvent,listEvents \
  --output ./essential-blocks
```

## Generated Files

The generator creates:

- **Individual block files**: `CreateMonitor.ts`, `GetMonitor.ts`, etc.
- **Index file**: `index.ts` with all exports
- **Generation report**: `generation-report.md` with summary

## Integration with Flows App

After generation, integrate the blocks into your DataDog flows app:

1. **Copy generated blocks**: Copy the generated `.ts` files to your app's `blocks/` directory
2. **Update index**: The generator creates an updated `index.ts` file
3. **Update main.ts**: Import and register the blocks in your app definition

```typescript
// In your main.ts
import { blocks } from "./blocks/index";

export const app = defineApp({
  name: "DataDog API",
  blocks: Object.values(blocks),
  // ... rest of your app config
});
```

## Configuration

The generator automatically configures blocks to use DataDog's authentication:

- **DD-API-KEY**: Required for all operations
- **DD-APPLICATION-KEY**: Required for most operations
- **Base URL**: Configurable (defaults to https://api.datadoghq.com)

## Error Handling

Generated blocks include comprehensive error handling:

- HTTP error response parsing
- Detailed error messages with response codes
- Proper error propagation to the Flows runtime

## Development

### Project Structure

```
generator/
├── src/
│   ├── types.ts              # TypeScript type definitions
│   ├── schemaParser.ts       # OpenAPI schema parsing
│   ├── blockGenerator.ts     # Block code generation
│   ├── blockTemplate.ts      # Block templates
│   ├── typeConverter.ts      # Type conversion utilities
│   └── generator.ts          # Main generator entry point
├── package.json
├── tsconfig.json
└── README.md
```

### Build and Development

```bash
# Install dependencies
npm install

# Build the generator
npm run build

# Watch mode for development
npm run dev

# Clean build artifacts
npm run clean
```

### Extending the Generator

To add support for new DataDog APIs or customize generation:

1. **Update types.ts**: Add new resource types or operation patterns
2. **Modify blockTemplate.ts**: Add new templates for special operations
3. **Extend blockGenerator.ts**: Add custom generation logic
4. **Update schemaParser.ts**: Add new filtering or parsing logic

## Troubleshooting

### Common Issues

1. **Schema fetch fails**: Check internet connection and schema URL
2. **No blocks generated**: Verify your filters match available operations
3. **Type errors**: Ensure TypeScript version compatibility

### Getting Help

```bash
# Show available operations in schema
node dist/generator.js --help

# Generate with verbose output
node dist/generator.js --resources monitors 2>&1 | tee generation.log
```

## License

MIT - See LICENSE file for details.
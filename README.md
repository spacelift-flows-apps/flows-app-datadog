# DataDog API Flows App

A Flows app that provides integration with DataDog's monitoring and events APIs, allowing you to manage monitors and events directly from your flows.

## Features

This app provides blocks for:

### Monitor Management

- **Create Monitor** - Create new monitors in DataDog
- **Get Monitor** - Retrieve monitor details by ID
- **Update Monitor** - Modify existing monitors
- **Delete Monitor** - Remove monitors
- **List Monitors** - Query and list monitors with filters
- **Mute Monitor** - Temporarily mute monitor notifications
- **Unmute Monitor** - Restore monitor notifications

### Event Management

- **Create Event** - Create custom events in DataDog
- **Get Event** - Retrieve event details by ID
- **List Events** - Query events with filters and pagination
- **Search Events** - Advanced event search with complex queries

## Quick Start

1. **Install the app** in your Flows workspace
2. **Configure credentials**:
   - DataDog API Key (required)
   - DataDog Application Key (required)
   - Base URL (defaults to https://api.datadoghq.com)
3. **Add blocks to your flows** and configure inputs

## Configuration

### Required Settings

- **API Key**: Your DataDog API key (found in DataDog Organization Settings)
- **Application Key**: Your DataDog Application key (required for most operations)

### Optional Settings

- **Base URL**: DataDog API endpoint (default: `https://api.datadoghq.com`)

## Block Categories

### Monitors

All monitor-related operations for creating, managing, and controlling DataDog monitors.

### Events

Event creation and querying capabilities for DataDog's events system.

## Architecture

### Clean Block Abstraction

This app uses a clean abstraction pattern with the `defineDatadogBlock` utility that eliminates code duplication:

```typescript
export const createMonitor = defineDatadogBlock({
  name: "Create Monitor",
  description: "Create a new DataDog monitor",
  category: "Monitors",
  method: "POST",
  endpoint: "/api/v1/monitor",
  inputConfig: {
    name: monitorName,
    type: monitorType,
    query: monitorQuery,
    // ... other inputs
  },
  outputJsonSchema: monitorSchema,
});
```

### Shared Input Configurations

Common input types are defined once and reused across blocks:

- **Monitor inputs**: `monitorId`, `monitorName`, `monitorType`, `monitorQuery`
- **Event inputs**: `eventTitle`, `alertType`, `sourceTypeName`
- **Common inputs**: `query`, `pageSize`, `fromDate`, `toDate`, `sort`

### Type Safety

All blocks include comprehensive TypeScript types and JSON schemas for:

- Input validation
- Output type safety
- Runtime error handling

## Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
npm install
npm run typecheck    # Type checking
npm run format       # Code formatting
npm run bundle       # Create deployment bundle
```

### Project Structure

```text
├── blocks/                     # Block implementations
│   ├── monitors/              # Monitor-related blocks
│   ├── events/                # Event-related blocks
│   ├── shared.ts              # Common input configurations
│   └── index.ts               # Block registry
├── utils/
│   └── defineDatadogBlock.ts  # Block abstraction utility
├── schemas/                   # JSON schemas for validation
│   ├── monitor.ts
│   └── event.ts
├── main.ts                    # App definition
└── package.json               # Dependencies and scripts
```

### Adding New Blocks

1. **Define the block** using the abstraction:

```typescript
// blocks/monitors/MyNewBlock.ts
import { defineDatadogBlock } from "../../utils/defineDatadogBlock";
import { monitorId } from "../shared";

export const myNewBlock = defineDatadogBlock({
  name: "My New Action",
  description: "Description of what it does",
  category: "Monitors",
  method: "GET",
  endpoint: "/api/v1/monitor/{monitor_id}/action",
  pathParams: ["monitor_id"],
  inputConfig: {
    monitor_id: monitorId,
    // ... other inputs
  },
});
```

2. **Register the block** in `blocks/index.ts`:

```typescript
import { myNewBlock } from "./monitors/MyNewBlock";

export const blocks = {
  // ... existing blocks
  myNew: myNewBlock,
} as const;
```

### Block Implementation Pattern

The `defineDatadogBlock` utility handles:

- HTTP request construction
- Authentication headers (DD-API-KEY, DD-APPLICATION-KEY)
- Path parameter substitution
- Query parameter building for GET requests
- Request body building for POST/PUT requests
- Error handling and response processing
- Type-safe input/output handling

## API Coverage

### Monitor API (V1)

- `POST /api/v1/monitor` - Create monitor
- `GET /api/v1/monitor/{id}` - Get monitor
- `PUT /api/v1/monitor/{id}` - Update monitor
- `DELETE /api/v1/monitor/{id}` - Delete monitor
- `GET /api/v1/monitor` - List monitors
- `POST /api/v1/monitor/{id}/mute` - Mute monitor
- `POST /api/v1/monitor/{id}/unmute` - Unmute monitor

### Events API (V2)

- `POST /api/v2/events` - Create event
- `GET /api/v2/events/{id}` - Get event
- `GET /api/v2/events` - List events
- `POST /api/v2/events/search` - Search events

## Security

- API keys are marked as sensitive and encrypted
- No sensitive data is logged
- All inputs are validated against JSON schemas
- Secure HTTP headers are used for API requests

## Support

For issues or feature requests, please check the DataDog API documentation:

- [DataDog API Reference](https://docs.datadoghq.com/api/)
- [Monitor API](https://docs.datadoghq.com/api/latest/monitors/)
- [Events API](https://docs.datadoghq.com/api/latest/events/)

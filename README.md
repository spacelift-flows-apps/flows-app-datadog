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

## Support

For issues or feature requests, please check the DataDog API documentation:

- [DataDog API Reference](https://docs.datadoghq.com/api/)
- [Monitor API](https://docs.datadoghq.com/api/latest/monitors/)
- [Events API](https://docs.datadoghq.com/api/latest/events/)

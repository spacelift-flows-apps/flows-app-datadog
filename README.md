# DataDog Flows App

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
- **Subscribe to Monitor** - Listen for real-time monitor alerts and status changes via webhooks

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
3. **App automatically creates a webhook** in DataDog for real-time monitor alerts
4. **Add blocks to your flows** and configure inputs

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

## Webhook Integration

This app automatically sets up webhook integration with DataDog for real-time monitoring:

### Automatic Webhook Setup

- **On Installation**: The app creates a unique webhook in your DataDog account
- **Secure Authentication**: Uses a randomly generated secret for webhook validation
- **Real-time Alerts**: Receives monitor status changes instantly via webhooks
- **Automatic Cleanup**: Webhook is removed when the app is uninstalled

### Subscribe to Monitor Block

The **Subscribe to Monitor** block allows you to listen for real-time monitor alerts.

To receive alerts, you must configure your DataDog monitors to send notifications to the webhook. In your monitor's notification settings, add the webhook name (created by this app) to the notification list.

## Support

For issues or feature requests, please check the DataDog API documentation:

- [DataDog API Reference](https://docs.datadoghq.com/api/)
- [Monitor API](https://docs.datadoghq.com/api/latest/monitors/)
- [Events API](https://docs.datadoghq.com/api/latest/events/)

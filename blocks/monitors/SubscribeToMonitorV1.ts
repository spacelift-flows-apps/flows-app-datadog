import { AppBlock, events } from "@slflows/sdk/v1";

export const subscribeToMonitorV1: AppBlock = {
  name: "Subscribe to Monitor",
  description: "Subscribe to DataDog monitor events and alerts",
  category: "Monitors",

  config: {
    monitor_id: {
      name: "Monitor ID",
      description:
        "Specific monitor ID to listen to (optional - if not provided, listens to all monitors)",
      type: "string",
      required: false,
    },
  },
  async onInternalMessage({ message }) {
    const monitorPayload = message.body;

    // Extract the actual webhook data from the message
    if (monitorPayload.type === "monitor_status_change") {
      await events.emit(monitorPayload.data);
    }
  },

  outputs: {
    default: {
      name: "Monitor Event",
      description: "DataDog monitor event data",
      default: true,
      type: {
        type: "object",
        properties: {
          monitor_id: {
            type: "string",
            description: "DataDog monitor ID",
          },
          monitor_name: {
            type: "string",
            description: "Name of the monitor",
          },
          status: {
            type: "string",
            description: "Current status (e.g., 'Triggered', 'Recovered')",
          },
          alert_status: {
            type: "string",
            description: "Detailed alert status description",
          },
          message: {
            type: "string",
            description: "Full notification message with details and links",
          },
          timestamp: {
            type: "string",
            description: "Timestamp in milliseconds since epoch",
          },
          url: {
            type: "string",
            description: "Event URL for this alert",
          },
          tags: {
            type: "string",
            description: "Comma-separated tags",
          },
          alert_query: {
            type: "string",
            description: "The monitor query that triggered this alert",
          },
          alert_scope: {
            type: "string",
            description: "Scope of the alert",
          },
          alert_metric: {
            type: "string",
            description: "Metric name being monitored",
          },
          priority: {
            type: "string",
            description: "Alert priority level",
          },
          event_type: {
            type: "string",
            description: "Type of monitor event (e.g., 'query_alert_monitor')",
          },
        },
        required: ["monitor_id", "monitor_name", "status", "timestamp"],
      },
    },
  },
};

import { defineDatadogInputConfig } from "../../utils/defineDatadogBlock";

export const monitorType = defineDatadogInputConfig({
  name: "Monitor Type",
  description: "The type of monitor",
  type: {
    type: "string",
    enum: [
      "metric alert",
      "service check",
      "event alert",
      "query alert",
      "composite",
      "log alert",
      "rum alert",
      "synthetics alert",
      "trace-analytics alert",
      "slo alert",
      "event-v2 alert",
      "audit alert",
      "ci-pipelines alert",
      "ci-tests alert",
    ],
  },
  required: true,
  apiRequestFieldKey: "type",
});

export const monitorQuery = defineDatadogInputConfig({
  name: "Monitor Query",
  description: "The monitor query expression",
  type: "string",
  required: true,
  apiRequestFieldKey: "query",
});

export const monitorName = defineDatadogInputConfig({
  name: "Monitor Name",
  description: "The name of the monitor",
  type: "string",
  required: true,
  apiRequestFieldKey: "name",
});

export const monitorMessage = defineDatadogInputConfig({
  name: "Message",
  description: "A message to include with notifications for this monitor",
  type: "string",
  required: false,
  apiRequestFieldKey: "message",
});

export const monitorTags = defineDatadogInputConfig({
  name: "Monitor Tags",
  description: "A list of tags to associate with the monitor",
  type: {
    type: "array",
    items: { type: "string" },
  },
  required: false,
  apiRequestFieldKey: "tags",
});

export const monitorPriority = defineDatadogInputConfig({
  name: "Priority",
  description: "Priority of the monitor (1-5)",
  type: "number",
  required: false,
  apiRequestFieldKey: "priority",
});

export const monitorOptions = defineDatadogInputConfig({
  name: "Monitor Options",
  description: "Advanced monitor configuration options",
  type: {
    type: "object",
    properties: {
      thresholds: {
        type: "object",
        properties: {
          critical: { type: "number" },
          warning: { type: "number" },
          ok: { type: "number" },
          critical_recovery: { type: "number" },
          warning_recovery: { type: "number" },
        },
      },
      notify_no_data: { type: "boolean" },
      no_data_timeframe: { type: "number" },
      timeout_h: { type: "number" },
      require_full_window: { type: "boolean" },
      new_host_delay: { type: "number" },
      notify_audit: { type: "boolean" },
      locked: { type: "boolean" },
      include_tags: { type: "boolean" },
      escalation_message: { type: "string" },
      renotify_interval: { type: "number" },
      evaluation_delay: { type: "number" },
    },
  },
  required: false,
  apiRequestFieldKey: "options",
});

export const withDowntimes = defineDatadogInputConfig({
  name: "Include Downtimes",
  description: "Include downtime information in the response",
  type: "boolean",
  required: false,
  apiRequestFieldKey: "with_downtimes",
});

export const groupStates = defineDatadogInputConfig({
  name: "Group States",
  description: "Filter by monitor group states",
  type: {
    type: "array",
    items: { type: "string" },
  },
  required: false,
  apiRequestFieldKey: "group_states",
  apiRequestTransform: (states: string[]) => states.join(","),
});

export const forceDelete = defineDatadogInputConfig({
  name: "Force Delete",
  description: "Force delete monitor (even if it has dependent SLO monitors)",
  type: "boolean",
  required: false,
  default: false,
  apiRequestFieldKey: "force",
});

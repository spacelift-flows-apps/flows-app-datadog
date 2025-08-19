import { defineDatadogInputConfig } from "../../utils/defineDatadogBlock";

export const eventTitle = defineDatadogInputConfig({
  name: "Event Title",
  description: "The event title",
  type: "string",
  required: true,
  apiRequestFieldKey: "title",
});

export const eventText = defineDatadogInputConfig({
  name: "Event Text",
  description: "The body of the event",
  type: "string",
  required: false,
  apiRequestFieldKey: "text",
});

export const alertType = defineDatadogInputConfig({
  name: "Alert Type",
  description: "The alert type for the event",
  type: {
    type: "string",
    enum: ["error", "warning", "info", "success"],
  },
  required: false,
  default: "info",
  apiRequestFieldKey: "alert_type",
});

export const eventPriority = defineDatadogInputConfig({
  name: "Priority",
  description: "The priority of the event",
  type: {
    type: "string",
    enum: ["normal", "low"],
  },
  required: false,
  default: "normal",
  apiRequestFieldKey: "priority",
});

export const sourceTypeName = defineDatadogInputConfig({
  name: "Source Type",
  description: "The type of event being posted",
  type: "string",
  required: false,
  apiRequestFieldKey: "source_type_name",
});

export const host = defineDatadogInputConfig({
  name: "Host",
  description: "Host name to associate with the event",
  type: "string",
  required: false,
  apiRequestFieldKey: "host",
});

export const deviceName = defineDatadogInputConfig({
  name: "Device Name",
  description: "A device name",
  type: "string",
  required: false,
  apiRequestFieldKey: "device_name",
});

export const aggregationKey = defineDatadogInputConfig({
  name: "Aggregation Key",
  description: "An aggregation key to group events",
  type: "string",
  required: false,
  apiRequestFieldKey: "aggregation_key",
});

export const relatedEventId = defineDatadogInputConfig({
  name: "Related Event ID",
  description: "ID of the parent event",
  type: "number",
  required: false,
  apiRequestFieldKey: "related_event_id",
});

export const dateHappened = defineDatadogInputConfig({
  name: "Date Happened",
  description: "POSIX timestamp when the event occurred",
  type: "number",
  required: false,
  apiRequestFieldKey: "date_happened",
});

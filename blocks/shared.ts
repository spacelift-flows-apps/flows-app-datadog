import { defineDatadogInputConfig } from "../utils/defineDatadogBlock";

// Common pagination and filtering inputs
export const pageSize = defineDatadogInputConfig({
  name: "Page Size",
  description: "Number of items per page (max 1000)",
  type: "number",
  required: false,
  apiRequestFieldKey: "page_size",
});

export const page = defineDatadogInputConfig({
  name: "Page",
  description: "Page number for pagination",
  type: "number",
  required: false,
});

export const tags = defineDatadogInputConfig({
  name: "Tags",
  description: "A list of tags to filter by",
  type: {
    type: "array",
    items: { type: "string" },
  },
  required: false,
  apiRequestTransform: (tags: string[]) => tags.join(","),
});

export const name = defineDatadogInputConfig({
  name: "Name",
  description: "Name filter",
  type: "string",
  required: false,
});

// Date range inputs
export const fromDate = defineDatadogInputConfig({
  name: "From Date",
  description: "Start date (RFC3339 format)",
  type: "string",
  required: false,
  apiRequestFieldKey: "filter[from]",
});

export const toDate = defineDatadogInputConfig({
  name: "To Date",
  description: "End date (RFC3339 format)",
  type: "string",
  required: false,
  apiRequestFieldKey: "filter[to]",
});

export const query = defineDatadogInputConfig({
  name: "Query",
  description: "Search query",
  type: "string",
  required: false,
  apiRequestFieldKey: "filter[query]",
});

export const sort = defineDatadogInputConfig({
  name: "Sort Order",
  description: "Sort order for results",
  type: {
    type: "string",
    enum: ["timestamp", "-timestamp"],
  },
  required: false,
  default: "-timestamp",
});

// Common ID inputs
export const id = defineDatadogInputConfig({
  name: "ID",
  description: "Resource ID",
  type: "string",
  required: true,
});

export const monitorId = defineDatadogInputConfig({
  name: "Monitor ID",
  description: "The ID of the monitor",
  type: "number",
  required: true,
  apiRequestFieldKey: "monitor_id",
});

export const eventId = defineDatadogInputConfig({
  name: "Event ID",
  description: "The ID of the event",
  type: "string",
  required: true,
  apiRequestFieldKey: "event_id",
});

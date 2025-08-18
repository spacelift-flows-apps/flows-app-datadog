export const monitorSchema = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    type: { type: "string" },
    query: { type: "string" },
    message: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    options: { type: "object" },
    created: { type: "string" },
    modified: { type: "string" },
    creator: { type: "object" },
    overall_state: { type: "string" },
  },
};

export const monitorListSchema = {
  type: "array",
  items: monitorSchema,
};

export const deletedMonitorSchema = {
  type: "object",
  properties: {
    deleted_monitor_id: { type: "number" },
  },
};

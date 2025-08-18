export const eventAttributesSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    text: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    alert_type: { type: "string" },
    priority: { type: "string" },
    date_happened: { type: "number" },
    source_type_name: { type: "string" },
    device_name: { type: "string" },
    host: { type: "string" },
    aggregation_key: { type: "string" },
    related_event_id: { type: "number" },
  },
};

export const eventSchema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        id: { type: "string" },
        type: { type: "string" },
        attributes: eventAttributesSchema,
      },
    },
  },
};

export const eventListSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: { type: "string" },
          attributes: eventAttributesSchema,
        },
      },
    },
    links: {
      type: "object",
      properties: {
        next: { type: "string" },
      },
    },
    meta: {
      type: "object",
      properties: {
        page: {
          type: "object",
          properties: {
            after: { type: "string" },
          },
        },
        elapsed: { type: "number" },
      },
    },
  },
};

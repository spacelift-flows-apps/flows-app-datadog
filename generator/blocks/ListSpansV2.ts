import { AppBlock, events } from "@slflows/sdk/v1";

export const ListSpansV2: AppBlock = {
  name: "Search spans",
  description: `List endpoint returns spans that match a span search query. [Results are paginated][1].  Use this endpoint to build complex spans filtering and search. This endpoint is rate limited to \`300\` requests per hour.  [1]: /logs/guide/collect-multiple-logs-with-pagination?tab=v2api`,
  category: "Spans",

  inputs: {
    default: {
      config: {
        data: {
          name: "Data",
          description: `Data parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { data } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const url = `${baseUrl}/api/v2/spans/events/search`;
        const requestPayload: any = {};
        if (data !== undefined) requestPayload.data = data;
        
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "DD-API-KEY": apiKey,
            "DD-APPLICATION-KEY": appKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to search spans: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        
        await events.emit({
          result,
          operation: "create"
        });
      },
    },
  },

  outputs: {
    default: {
      name: "Created Spans",
      description: `The created spans object`,
      default: true,
      type: {
        type: "object",
        properties: {
          data: { type: "array", items: { type: "string" } },
          links: { type: "string" },
          meta: { type: "string" }
        },
        required: []
      },
    },
  },
};
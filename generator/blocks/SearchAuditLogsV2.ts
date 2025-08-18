import { AppBlock, events } from "@slflows/sdk/v1";

export const SearchAuditLogsV2: AppBlock = {
  name: "Search Audit Logs events",
  description: `List endpoint returns Audit Logs events that match an Audit search query. [Results are paginated][1].  Use this endpoint to build complex Audit Logs events filtering and search.  [1]: https://docs.datadoghq.com/logs/guide/collect-multiple-logs-with-pagination`,
  category: "AuditLogs",

  inputs: {
    default: {
      config: {
        filter: {
          name: "Filter",
          description: `Filter parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        options: {
          name: "Options",
          description: `Options parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        page: {
          name: "Page",
          description: `Page parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        sort: {
          name: "Sort",
          description: `Sort parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { filter, options, page, sort } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const url = `${baseUrl}/api/v2/audit/events/search`;
        const requestPayload: any = {};
        if (filter !== undefined) requestPayload.filter = filter;
        if (options !== undefined) requestPayload.options = options;
        if (page !== undefined) requestPayload.page = page;
        if (sort !== undefined) requestPayload.sort = sort;
        
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
          throw new Error(`Failed to search audit logs events: ${response.status} ${response.statusText} - ${errorText}`);
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
      name: "Created AuditLogs",
      description: `The created auditlogs object`,
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
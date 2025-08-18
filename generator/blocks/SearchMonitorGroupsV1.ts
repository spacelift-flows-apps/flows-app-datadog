import { AppBlock, events } from "@slflows/sdk/v1";

export const SearchMonitorGroupsV1: AppBlock = {
  name: "Monitors group search",
  description: `Search and filter your monitor groups details.`,
  category: "MonitorGroups",

  inputs: {
    default: {
      config: {
        query: {
          name: "Query",
          description: `Query parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        page: {
          name: "Page",
          description: `Page parameter`,
          type: {
            "type": "number"
          },
          required: false,
        },
        perPage: {
          name: "Per Page",
          description: `Per Page parameter`,
          type: {
            "type": "number"
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
        const { query, page, perPage, sort } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const urlBase = `${baseUrl}/api/v1/monitor/groups/search`;
        const queryParams = new URLSearchParams();
        if (query !== undefined) queryParams.append('query', String(query));
        if (page !== undefined) queryParams.append('page', String(page));
        if (perPage !== undefined) queryParams.append('per_page', String(perPage));
        if (sort !== undefined) queryParams.append('sort', String(sort));
        const queryString = queryParams.toString();
        const url = queryString ? `${urlBase}?${queryString}` : urlBase;
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "DD-API-KEY": apiKey,
            "DD-APPLICATION-KEY": appKey,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to monitors group search: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        
        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "MonitorGroups List",
      description: `List of monitorgroups objects`,
      default: true,
      type: {
        type: "object",
        properties: {
          counts: { type: "string" },
          groups: { type: "array", items: { type: "string" } },
          metadata: { type: "string" }
        },
        required: []
      },
    },
  },
};
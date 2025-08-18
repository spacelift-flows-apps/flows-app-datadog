import { AppBlock, events } from "@slflows/sdk/v1";

export const ListRUMEventsV2: AppBlock = {
  name: "Get a list of RUM events",
  description: `List endpoint returns events that match a RUM search query. [Results are paginated][1].  Use this endpoint to see your latest RUM events.  [1]: https://docs.datadoghq.com/logs/guide/collect-multiple-logs-with-pagination`,
  category: "RUMEvents",

  inputs: {
    default: {
      config: {
        filterQuery: {
          name: "Filter[Query]",
          description: `Filter[Query] parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        filterFrom: {
          name: "Filter[From]",
          description: `Filter[From] parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        filterTo: {
          name: "Filter[To]",
          description: `Filter[To] parameter`,
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
        pageCursor: {
          name: "Page[Cursor]",
          description: `Page[Cursor] parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        pageLimit: {
          name: "Page[Limit]",
          description: `Page[Limit] parameter`,
          type: {
            "type": "number",
            "maximum": 1000
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { filterQuery, filterFrom, filterTo, sort, pageCursor, pageLimit } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const urlBase = `${baseUrl}/api/v2/rum/events`;
        const queryParams = new URLSearchParams();
        if (filterQuery !== undefined) queryParams.append('filter[query]', String(filterQuery));
        if (filterFrom !== undefined) queryParams.append('filter[from]', String(filterFrom));
        if (filterTo !== undefined) queryParams.append('filter[to]', String(filterTo));
        if (sort !== undefined) queryParams.append('sort', String(sort));
        if (pageCursor !== undefined) queryParams.append('page[cursor]', String(pageCursor));
        if (pageLimit !== undefined) queryParams.append('page[limit]', String(pageLimit));
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
          throw new Error(`Failed to get a list of rum events: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        
        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "RUMEvents List",
      description: `List of rumevents objects`,
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
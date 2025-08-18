import { AppBlock, events } from "@slflows/sdk/v1";

export const ListEventsV1: AppBlock = {
  name: "Get a list of events",
  description: `The event stream can be queried and filtered by time, priority, sources and tags.  **Notes**: - If the event you’re querying contains markdown formatting of any kind, you may see characters such as \`%\`,\`\\\`,\`n\` in your output.  - This endpoint returns a maximum of \`1000\` most recent results. To return additional results, identify the last timestamp of the last result and set that as the \`end\` query time to paginate the results. You can also use the page parameter to specify which set of \`1000\` results to return.`,
  category: "Event",

  inputs: {
    default: {
      config: {
        start: {
          name: "Start",
          description: `Start parameter`,
          type: {
            "type": "number"
          },
          required: true,
        },
        end: {
          name: "End",
          description: `End parameter`,
          type: {
            "type": "number"
          },
          required: true,
        },
        priority: {
          name: "Priority",
          description: `Priority parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        sources: {
          name: "Sources",
          description: `Sources parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        tags: {
          name: "Tags",
          description: `Tags parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        unaggregated: {
          name: "Unaggregated",
          description: `Unaggregated parameter`,
          type: {
            "type": "boolean"
          },
          required: false,
        },
        excludeAggregate: {
          name: "Exclude Aggregate",
          description: `Exclude Aggregate parameter`,
          type: {
            "type": "boolean"
          },
          required: false,
        },
        page: {
          name: "Page",
          description: `Page parameter`,
          type: {
            "type": "number",
            "maximum": 2147483647
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { start, end, priority, sources, tags, unaggregated, excludeAggregate, page } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const urlBase = `${baseUrl}/api/v1/events`;
        const queryParams = new URLSearchParams();
        if (start !== undefined) queryParams.append('start', String(start));
        if (end !== undefined) queryParams.append('end', String(end));
        if (priority !== undefined) queryParams.append('priority', String(priority));
        if (sources !== undefined) queryParams.append('sources', String(sources));
        if (tags !== undefined) queryParams.append('tags', String(tags));
        if (unaggregated !== undefined) queryParams.append('unaggregated', String(unaggregated));
        if (excludeAggregate !== undefined) queryParams.append('exclude_aggregate', String(excludeAggregate));
        if (page !== undefined) queryParams.append('page', String(page));
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
          throw new Error(`Failed to get a list of events: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        
        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "Event List",
      description: `List of events objects`,
      default: true,
      type: {
        type: "object",
        properties: {
          events: { type: "array", items: { type: "string" } },
          status: { type: "string" }
        },
        required: []
      },
    },
  },
};
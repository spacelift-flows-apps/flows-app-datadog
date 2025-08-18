import { AppBlock, events } from "@slflows/sdk/v1";

export const ListMonitorsV1: AppBlock = {
  name: "Get all monitors",
  description: `Get all monitors from your organization.`,
  category: "Monitor",

  inputs: {
    default: {
      config: {
        groupStates: {
          name: "Group States",
          description: `Group States parameter`,
          type: {
            "type": "string",
            "example": "alert"
          },
          required: false,
        },
        name: {
          name: "Name",
          description: `Name parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        tags: {
          name: "Tags",
          description: `Tags parameter`,
          type: {
            "type": "string",
            "example": "host:host0"
          },
          required: false,
        },
        monitorTags: {
          name: "Monitor Tags",
          description: `Monitor Tags parameter`,
          type: {
            "type": "string",
            "example": "service:my-app"
          },
          required: false,
        },
        withDowntimes: {
          name: "With Downtimes",
          description: `With Downtimes parameter`,
          type: {
            "type": "boolean"
          },
          required: false,
        },
        idOffset: {
          name: "Id Offset",
          description: `Id Offset parameter`,
          type: {
            "type": "number"
          },
          required: false,
        },
        page: {
          name: "Page",
          description: `Page parameter`,
          type: {
            "type": "number",
            "example": 0
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description: `Page Size parameter`,
          type: {
            "type": "number",
            "maximum": 1000,
            "example": 20
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { groupStates, name, tags, monitorTags, withDowntimes, idOffset, page, pageSize } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const urlBase = `${baseUrl}/api/v1/monitor`;
        const queryParams = new URLSearchParams();
        if (groupStates !== undefined) queryParams.append('group_states', String(groupStates));
        if (name !== undefined) queryParams.append('name', String(name));
        if (tags !== undefined) queryParams.append('tags', String(tags));
        if (monitorTags !== undefined) queryParams.append('monitor_tags', String(monitorTags));
        if (withDowntimes !== undefined) queryParams.append('with_downtimes', String(withDowntimes));
        if (idOffset !== undefined) queryParams.append('id_offset', String(idOffset));
        if (page !== undefined) queryParams.append('page', String(page));
        if (pageSize !== undefined) queryParams.append('page_size', String(pageSize));
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
          throw new Error(`Failed to get all monitors: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        
        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "Monitor List",
      description: `List of monitors objects`,
      default: true,
      type: {
        type: "object",
        properties: {
          result: { type: "object" }
        },
        required: ["result"]
      },
    },
  },
};
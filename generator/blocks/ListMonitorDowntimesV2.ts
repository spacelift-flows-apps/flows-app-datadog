import { AppBlock, events } from "@slflows/sdk/v1";

export const ListMonitorDowntimesV2: AppBlock = {
  name: "Get active downtimes for a monitor",
  description: `Get all active downtimes for the specified monitor.`,
  category: "MonitorDowntimes",

  inputs: {
    default: {
      config: {
        monitorId: {
          name: "Monitor Id",
          description: `Monitor Id parameter`,
          type: {
            "type": "number"
          },
          required: true,
        },
        pageLimit: {
          name: "Page[Limit]",
          description: `Page[Limit] parameter`,
          type: {
            "type": "number"
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { monitorId, pageLimit } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const urlBase = `${baseUrl}/api/v2/monitor/${monitorId}/downtime_matches`;
        const queryParams = new URLSearchParams();
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
          throw new Error(`Failed to get active downtimes for a monitor: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        
        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "MonitorDowntimes Details",
      description: `The retrieved monitordowntimes object`,
      default: true,
      type: {
        type: "object",
        properties: {
          data: { type: "array", items: { type: "string" } },
          meta: { type: "string" }
        },
        required: []
      },
    },
  },
};
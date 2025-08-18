import { AppBlock, events } from "@slflows/sdk/v1";

export const ListMonitorDowntimesV1: AppBlock = {
  name: "Get active downtimes for a monitor",
  description: `Get all active v1 downtimes for the specified monitor. **Note:** This endpoint has been deprecated. Please use v2 endpoints.`,
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
      },
      onEvent: async (input) => {
        const { monitorId } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const url = `${baseUrl}/api/v1/monitor/${monitorId}/downtimes`;
        
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
          result: { type: "object" }
        },
        required: ["result"]
      },
    },
  },
};
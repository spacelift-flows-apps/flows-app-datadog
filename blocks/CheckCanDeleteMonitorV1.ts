import { AppBlock, events } from "@slflows/sdk/v1";

export const CheckCanDeleteMonitorV1: AppBlock = {
  name: "Check if a monitor can be deleted",
  description: `Check if the given monitors can be deleted.`,
  category: "Monitor",

  inputs: {
    default: {
      config: {
        monitorIds: {
          name: "Monitor Ids",
          description: `Monitor Ids parameter`,
          type: {
            "type": "array",
            "items": {
              "type": "number"
            }
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { monitorIds } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const urlBase = `${baseUrl}/api/v1/monitor/can_delete`;
        const queryParams = new URLSearchParams();
        if (monitorIds !== undefined) queryParams.append('monitor_ids', String(monitorIds));
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
          throw new Error(`Failed to check if a monitor can be deleted: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        
        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "Monitor List",
      description: `List of monitor objects`,
      default: true,
      type: {
        type: "object",
        properties: {
          data: { type: "string" },
          errors: { type: "object", additionalProperties: { type: "array", items: { type: "string" } } }
        },
        required: ["data"]
      },
    },
  },
};
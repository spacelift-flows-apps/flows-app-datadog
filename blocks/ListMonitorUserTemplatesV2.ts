import { AppBlock, events } from "@slflows/sdk/v1";

export const ListMonitorUserTemplatesV2: AppBlock = {
  name: "Get all monitor user templates",
  description: `Retrieve all monitor user templates.`,
  category: "MonitorUserTemplates",

  inputs: {
    default: {
      config: {

      },
      onEvent: async (input) => {

        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const url = `${baseUrl}/api/v2/monitor/template`;
        
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
          throw new Error(`Failed to get all monitor user templates: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        
        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "MonitorUserTemplates List",
      description: `List of monitorusertemplates objects`,
      default: true,
      type: {
        type: "object",
        properties: {
          data: { type: "array", items: { type: "string" } }
        },
        required: []
      },
    },
  },
};
import { AppBlock, events } from "@slflows/sdk/v1";

export const ListMonitorConfigPoliciesV2: AppBlock = {
  name: "Get all monitor configuration policies",
  description: `Get all monitor configuration policies.`,
  category: "MonitorConfigPolicies",

  inputs: {
    default: {
      config: {

      },
      onEvent: async (input) => {

        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const url = `${baseUrl}/api/v2/monitor/policy`;
        
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
          throw new Error(`Failed to get all monitor configuration policies: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        
        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "MonitorConfigPolicies List",
      description: `List of monitorconfigpolicies objects`,
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
import { AppBlock, events } from "@slflows/sdk/v1";

export const CreateMonitorConfigPolicyV2: AppBlock = {
  name: "Create a monitor configuration policy",
  description: `Create a monitor configuration policy.`,
  category: "MonitorConfigPolicy",

  inputs: {
    default: {
      config: {
        data: {
          name: "Data",
          description: `Data parameter`,
          type: {
            "type": "string"
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { data } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const url = `${baseUrl}/api/v2/monitor/policy`;
        const requestPayload: any = {};
        requestPayload.data = data;
        
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
          throw new Error(`Failed to create a monitor configuration policy: ${response.status} ${response.statusText} - ${errorText}`);
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
      name: "Created MonitorConfigPolicy",
      description: `The created monitorconfigpolicy object`,
      default: true,
      type: {
        type: "object",
        properties: {
          data: { type: "string" }
        },
        required: []
      },
    },
  },
};
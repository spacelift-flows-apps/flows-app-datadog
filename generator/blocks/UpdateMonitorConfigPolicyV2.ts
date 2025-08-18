import { AppBlock, events } from "@slflows/sdk/v1";

export const UpdateMonitorConfigPolicyV2: AppBlock = {
  name: "Edit a monitor configuration policy",
  description: `Edit a monitor configuration policy.`,
  category: "MonitorConfigPolicy",

  inputs: {
    default: {
      config: {
        policyId: {
          name: "Policy Id",
          description: `Policy Id parameter`,
          type: {
            "type": "string",
            "example": "00000000-0000-1234-0000-000000000000"
          },
          required: true,
        },
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
        const { policyId } = input.event.inputConfig;
        const { data } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const url = `${baseUrl}/api/v2/monitor/policy/${policyId}`;
        const requestPayload: any = {};
        requestPayload.data = data;
        
        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            "DD-API-KEY": apiKey,
            "DD-APPLICATION-KEY": appKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to edit a monitor configuration policy: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        
        await events.emit({
          result,
          operation: "update"
        });
      },
    },
  },

  outputs: {
    default: {
      name: "Updated MonitorConfigPolicy",
      description: `The updated monitorconfigpolicy object`,
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
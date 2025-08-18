import { AppBlock, events } from "@slflows/sdk/v1";

export const DeleteMonitorConfigPolicyV2: AppBlock = {
  name: "Delete a monitor configuration policy",
  description: `Delete a monitor configuration policy.`,
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
      },
      onEvent: async (input) => {
        const { policyId } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const url = `${baseUrl}/api/v2/monitor/policy/${policyId}`;
        
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "DD-API-KEY": apiKey,
            "DD-APPLICATION-KEY": appKey,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete a monitor configuration policy: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = response.status === 204 ? { deleted: true } : await response.json();
        
        await events.emit({
          result,
          operation: "delete"
        });
      },
    },
  },

  outputs: {
    default: {
      name: "Delete Result",
      description: `Result of the delete operation`,
      default: true,
      type: {
        type: "object",
        properties: {
          result: { type: "object" },
          operation: { type: "string" }
        },
        required: ["result"]
      },
    },
  },
};
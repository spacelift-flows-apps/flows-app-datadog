import { AppBlock, events } from "@slflows/sdk/v1";

export const DeleteMonitorUserTemplateV2: AppBlock = {
  name: "Delete a monitor user template",
  description: `Delete an existing monitor user template by its ID.`,
  category: "MonitorUserTemplate",

  inputs: {
    default: {
      config: {
        templateId: {
          name: "Template Id",
          description: `Template Id parameter`,
          type: {
            "type": "string"
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { templateId } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const url = `${baseUrl}/api/v2/monitor/template/${templateId}`;
        
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
          throw new Error(`Failed to delete a monitor user template: ${response.status} ${response.statusText} - ${errorText}`);
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
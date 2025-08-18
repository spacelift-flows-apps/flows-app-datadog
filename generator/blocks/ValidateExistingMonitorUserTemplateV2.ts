import { AppBlock, events } from "@slflows/sdk/v1";

export const ValidateExistingMonitorUserTemplateV2: AppBlock = {
  name: "Validate an existing monitor user template",
  description: `Validate the structure and content of an existing monitor user template being updated to a new version.`,
  category: "Monitor",

  inputs: {
    default: {
      config: {
        templateId: {
          name: "Template Id",
          description: `Template Id parameter`,
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
        const { templateId } = input.event.inputConfig;
        const { data } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const url = `${baseUrl}/api/v2/monitor/template/${templateId}/validate`;
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
          throw new Error(`Failed to validate an existing monitor user template: ${response.status} ${response.statusText} - ${errorText}`);
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
      name: "Created Monitor",
      description: `The created monitor object`,
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
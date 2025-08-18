import { AppBlock, events } from "@slflows/sdk/v1";

export const UpdateMonitorUserTemplateV2: AppBlock = {
  name: "Update a monitor user template to a new version",
  description: `Creates a new version of an existing monitor user template.`,
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

        const url = `${baseUrl}/api/v2/monitor/template/${templateId}`;
        const requestPayload: any = {};
        requestPayload.data = data;
        
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "DD-API-KEY": apiKey,
            "DD-APPLICATION-KEY": appKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to update a monitor user template to a new version: ${response.status} ${response.statusText} - ${errorText}`);
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
      name: "Updated MonitorUserTemplate",
      description: `The updated monitorusertemplate object`,
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
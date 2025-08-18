import { AppBlock, events } from "@slflows/sdk/v1";

export const GetMonitorUserTemplateV2: AppBlock = {
  name: "Get a monitor user template",
  description: `Retrieve a monitor user template by its ID.`,
  category: "MonitorUserTemplate",

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
        withAllVersions: {
          name: "With All Versions",
          description: `With All Versions parameter`,
          type: {
            "type": "boolean"
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { templateId, withAllVersions } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const urlBase = `${baseUrl}/api/v2/monitor/template/${templateId}`;
        const queryParams = new URLSearchParams();
        if (withAllVersions !== undefined) queryParams.append('with_all_versions', String(withAllVersions));
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
          throw new Error(`Failed to get a monitor user template: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        
        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "MonitorUserTemplate Details",
      description: `The retrieved monitorusertemplate object`,
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
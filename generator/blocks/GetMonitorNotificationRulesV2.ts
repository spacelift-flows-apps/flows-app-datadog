import { AppBlock, events } from "@slflows/sdk/v1";

export const GetMonitorNotificationRulesV2: AppBlock = {
  name: "Get all monitor notification rules",
  description: `Returns a list of all monitor notification rules.`,
  category: "MonitorNotificationRules",

  inputs: {
    default: {
      config: {
        include: {
          name: "Include",
          description: `Include parameter`,
          type: {
            "type": "string",
            "example": "created_by"
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { include } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const urlBase = `${baseUrl}/api/v2/monitor/notification_rule`;
        const queryParams = new URLSearchParams();
        if (include !== undefined) queryParams.append('include', String(include));
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
          throw new Error(`Failed to get all monitor notification rules: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        
        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "MonitorNotificationRules List",
      description: `List of monitornotificationrules objects`,
      default: true,
      type: {
        type: "object",
        properties: {
          data: { type: "array", items: { type: "string" } },
          included: { type: "array", items: { type: "string" } }
        },
        required: []
      },
    },
  },
};
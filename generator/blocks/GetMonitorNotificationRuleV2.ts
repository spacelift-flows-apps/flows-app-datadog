import { AppBlock, events } from "@slflows/sdk/v1";

export const GetMonitorNotificationRuleV2: AppBlock = {
  name: "Get a monitor notification rule",
  description: `Returns a monitor notification rule by \`rule_id\`.`,
  category: "MonitorNotificationRule",

  inputs: {
    default: {
      config: {
        ruleId: {
          name: "Rule Id",
          description: `Rule Id parameter`,
          type: {
            "type": "string"
          },
          required: true,
        },
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
        const { ruleId, include } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const urlBase = `${baseUrl}/api/v2/monitor/notification_rule/${ruleId}`;
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
          throw new Error(`Failed to get a monitor notification rule: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        
        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "MonitorNotificationRule Details",
      description: `The retrieved monitornotificationrule object`,
      default: true,
      type: {
        type: "object",
        properties: {
          data: { type: "string" },
          included: { type: "array", items: { type: "string" } }
        },
        required: []
      },
    },
  },
};
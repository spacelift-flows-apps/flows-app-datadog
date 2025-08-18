import { AppBlock, events } from "@slflows/sdk/v1";

export const UpdateMonitorNotificationRuleV2: AppBlock = {
  name: "Update a monitor notification rule",
  description: `Updates a monitor notification rule by \`rule_id\`.`,
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
        const { ruleId } = input.event.inputConfig;
        const { data } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const url = `${baseUrl}/api/v2/monitor/notification_rule/${ruleId}`;
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
          throw new Error(`Failed to update a monitor notification rule: ${response.status} ${response.statusText} - ${errorText}`);
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
      name: "Updated MonitorNotificationRule",
      description: `The updated monitornotificationrule object`,
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
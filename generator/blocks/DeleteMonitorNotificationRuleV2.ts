import { AppBlock, events } from "@slflows/sdk/v1";

export const DeleteMonitorNotificationRuleV2: AppBlock = {
  name: "Delete a monitor notification rule",
  description: `Deletes a monitor notification rule by \`rule_id\`.`,
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
      },
      onEvent: async (input) => {
        const { ruleId } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const url = `${baseUrl}/api/v2/monitor/notification_rule/${ruleId}`;
        
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
          throw new Error(`Failed to delete a monitor notification rule: ${response.status} ${response.statusText} - ${errorText}`);
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
import { AppBlock, events } from "@slflows/sdk/v1";

export const DeleteMonitorV1: AppBlock = {
  name: "Delete a monitor",
  description: `Delete the specified monitor`,
  category: "Monitor",

  inputs: {
    default: {
      config: {
        monitorId: {
          name: "Monitor Id",
          description: `Monitor Id parameter`,
          type: {
            "type": "number",
            "example": 666486743
          },
          required: true,
        },
        force: {
          name: "Force",
          description: `Force parameter`,
          type: {
            "type": "string",
            "example": "false"
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { monitorId, force } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const urlBase = `${baseUrl}/api/v1/monitor/${monitorId}`;
        const queryParams = new URLSearchParams();
        if (force !== undefined) queryParams.append('force', String(force));
        const queryString = queryParams.toString();
        const url = queryString ? `${urlBase}?${queryString}` : urlBase;
        
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
          throw new Error(`Failed to delete a monitor: ${response.status} ${response.statusText} - ${errorText}`);
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
          deleted_monitor_id: { type: "number" }
        },
        required: []
      },
    },
  },
};
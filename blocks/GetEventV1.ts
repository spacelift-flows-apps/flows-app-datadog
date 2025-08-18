import { AppBlock, events } from "@slflows/sdk/v1";

export const GetEventV1: AppBlock = {
  name: "Get an event",
  description: `This endpoint allows you to query for event details.  **Note**: If the event you’re querying contains markdown formatting of any kind, you may see characters such as \`%\`,\`\\\`,\`n\` in your output.`,
  category: "Event",

  inputs: {
    default: {
      config: {
        eventId: {
          name: "Event Id",
          description: `Event Id parameter`,
          type: {
            "type": "number"
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { eventId } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const url = `${baseUrl}/api/v1/events/${eventId}`;
        
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
          throw new Error(`Failed to get an event: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        
        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "Event Details",
      description: `The retrieved event object`,
      default: true,
      type: {
        type: "object",
        properties: {
          event: { type: "string" },
          status: { type: "string" }
        },
        required: []
      },
    },
  },
};
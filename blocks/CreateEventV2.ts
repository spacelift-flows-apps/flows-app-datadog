import { AppBlock, events } from "@slflows/sdk/v1";

export const CreateEventV2: AppBlock = {
  name: "Post an event",
  description: `This endpoint allows you to publish events.  **Note:** To utilize this endpoint with our client libraries, please ensure you are using the latest version released on or after July 1, 2025. Earlier versions do not support this functionality.  ✅ **Only events with the \`change\` or \`alert\` category** are in General Availability. For change events, see [Change Tracking](https://docs.datadoghq.com/change_tracking) for more details.  ❌ For use cases involving other event categories, use the V1 endpoint or reach out to [support](https://www.datadoghq.com/support/).  ❌ Notifications are not yet supported for events sent to this endpoint. Use the V1 endpoint for notification functionality.`,
  category: "Event",

  inputs: {
    default: {
      config: {
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
        const { data } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const url = `${baseUrl}/api/v2/events`;
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
          throw new Error(`Failed to post an event: ${response.status} ${response.statusText} - ${errorText}`);
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
      name: "Created Event",
      description: `The created event object`,
      default: true,
      type: {
        type: "object",
        properties: {
          data: { type: "string" },
          links: { type: "string" }
        },
        required: []
      },
    },
  },
};
import { AppBlock, events } from "@slflows/sdk/v1";

export const CreateEventV1: AppBlock = {
  name: "Post an event",
  description: `This endpoint allows you to post events to the stream. Tag them, set priority and event aggregate them with other events.`,
  category: "Event",

  inputs: {
    default: {
      config: {
        aggregationKey: {
          name: "Aggregation Key",
          description: `An arbitrary string to use for aggregation. Limited to 100 characters. If you specify a key, all events using that key are grouped together in the Event Stream.`,
          type: {
            "type": "string"
          },
          required: false,
        },
        alertType: {
          name: "Alert Type",
          description: `Alert Type parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        dateHappened: {
          name: "Date Happened",
          description: `POSIX timestamp of the event. Must be sent as an integer (that is no quotes). Limited to events no older than 18 hours`,
          type: {
            "type": "number"
          },
          required: false,
        },
        deviceName: {
          name: "Device Name",
          description: `A device name.`,
          type: {
            "type": "string"
          },
          required: false,
        },
        host: {
          name: "Host",
          description: `Host name to associate with the event. Any tags associated with the host are also applied to this event.`,
          type: {
            "type": "string"
          },
          required: false,
        },
        priority: {
          name: "Priority",
          description: `Priority parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        relatedEventId: {
          name: "Related Event Id",
          description: `ID of the parent event. Must be sent as an integer (that is no quotes).`,
          type: {
            "type": "number"
          },
          required: false,
        },
        sourceTypeName: {
          name: "Source Type Name",
          description: `The type of event being posted. Option examples include nagios, hudson, jenkins, my_apps, chef, puppet, git, bitbucket, etc. A complete list of source attribute values [available here](https://docs.datadoghq.com/integrations/faq/list-of-api-source-attribute-value).`,
          type: {
            "type": "string"
          },
          required: false,
        },
        tags: {
          name: "Tags",
          description: `A list of tags to apply to the event.`,
          type: {
            "type": "array",
            "items": {
              "type": "string"
            },
            "example": [
              "environment:test"
            ]
          },
          required: false,
        },
        text: {
          name: "Text",
          description: `The body of the event. Limited to 4000 characters. The text supports markdown. To use markdown in the event text, start the text block with \`%%% \\n\` and end the text block with \`\\n %%%\`. Use \`msg_text\` with the Datadog Ruby library.`,
          type: {
            "type": "string",
            "example": "Oh boy!"
          },
          required: true,
        },
        title: {
          name: "Title",
          description: `The event title.`,
          type: {
            "type": "string",
            "example": "Did you hear the news today?"
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { aggregationKey, alertType, dateHappened, deviceName, host, priority, relatedEventId, sourceTypeName, tags, text, title } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const url = `${baseUrl}/api/v1/events`;
        const requestPayload: any = {};
        if (aggregationKey !== undefined) requestPayload.aggregation_key = aggregationKey;
        if (alertType !== undefined) requestPayload.alert_type = alertType;
        if (dateHappened !== undefined) requestPayload.date_happened = dateHappened;
        if (deviceName !== undefined) requestPayload.device_name = deviceName;
        if (host !== undefined) requestPayload.host = host;
        if (priority !== undefined) requestPayload.priority = priority;
        if (relatedEventId !== undefined) requestPayload.related_event_id = relatedEventId;
        if (sourceTypeName !== undefined) requestPayload.source_type_name = sourceTypeName;
        if (tags !== undefined) requestPayload.tags = tags;
        requestPayload.text = text;
        requestPayload.title = title;
        
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
          event: { type: "string" },
          status: { type: "string" }
        },
        required: []
      },
    },
  },
};
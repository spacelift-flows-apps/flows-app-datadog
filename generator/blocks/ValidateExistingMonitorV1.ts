import { AppBlock, events } from "@slflows/sdk/v1";

export const ValidateExistingMonitorV1: AppBlock = {
  name: "Validate an existing monitor",
  description: `Validate the monitor provided in the request.`,
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
        created: {
          name: "Created",
          description: `Timestamp of the monitor creation.`,
          type: {
            "type": "string"
          },
          required: false,
        },
        creator: {
          name: "Creator",
          description: `Creator parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        deleted: {
          name: "Deleted",
          description: `Whether or not the monitor is deleted. (Always \`null\`)`,
          type: {
            "type": "string"
          },
          required: false,
        },
        draftStatus: {
          name: "Draft Status",
          description: `Draft Status parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        id: {
          name: "Id",
          description: `ID of this monitor.`,
          type: {
            "type": "number"
          },
          required: false,
        },
        matchingDowntimes: {
          name: "Matching Downtimes",
          description: `A list of active v1 downtimes that match this monitor.`,
          type: {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          required: false,
        },
        message: {
          name: "Message",
          description: `A message to include with notifications for this monitor.`,
          type: {
            "type": "string"
          },
          required: false,
        },
        modified: {
          name: "Modified",
          description: `Last timestamp when the monitor was edited.`,
          type: {
            "type": "string"
          },
          required: false,
        },
        multi: {
          name: "Multi",
          description: `Whether or not the monitor is broken down on different groups.`,
          type: {
            "type": "boolean"
          },
          required: false,
        },
        name: {
          name: "Name",
          description: `The monitor name.`,
          type: {
            "type": "string",
            "example": "My monitor"
          },
          required: false,
        },
        options: {
          name: "Options",
          description: `Options parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        overallState: {
          name: "Overall State",
          description: `Overall State parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        priority: {
          name: "Priority",
          description: `Integer from 1 (high) to 5 (low) indicating alert severity.`,
          type: {
            "type": "number"
          },
          required: false,
        },
        query: {
          name: "Query",
          description: `The monitor query.`,
          type: {
            "type": "string",
            "example": "avg(last_5m):sum:system.net.bytes_rcvd{host:host0} > 100"
          },
          required: true,
        },
        restrictedRoles: {
          name: "Restricted Roles",
          description: `A list of unique role identifiers to define which roles are allowed to edit the monitor. The unique identifiers for all roles can be pulled from the [Roles API](https://docs.datadoghq.com/api/latest/roles/#list-roles) and are located in the \`data.id\` field. Editing a monitor includes any updates to the monitor configuration, monitor deletion, and muting of the monitor for any amount of time. You can use the [Restriction Policies API](https://docs.datadoghq.com/api/latest/restriction-policies/) to manage write authorization for individual monitors by teams and users, in addition to roles.`,
          type: {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          required: false,
        },
        state: {
          name: "State",
          description: `State parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        tags: {
          name: "Tags",
          description: `Tags associated to your monitor.`,
          type: {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          required: false,
        },
        type: {
          name: "Type",
          description: `Type parameter`,
          type: {
            "type": "string"
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { monitorId } = input.event.inputConfig;
        const { created, creator, deleted, draftStatus, id, matchingDowntimes, message, modified, multi, name, options, overallState, priority, query, restrictedRoles, state, tags, type } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const url = `${baseUrl}/api/v1/monitor/${monitorId}/validate`;
        const requestPayload: any = {};
        if (created !== undefined) requestPayload.created = created;
        if (creator !== undefined) requestPayload.creator = creator;
        if (deleted !== undefined) requestPayload.deleted = deleted;
        if (draftStatus !== undefined) requestPayload.draft_status = draftStatus;
        if (id !== undefined) requestPayload.id = id;
        if (matchingDowntimes !== undefined) requestPayload.matching_downtimes = matchingDowntimes;
        if (message !== undefined) requestPayload.message = message;
        if (modified !== undefined) requestPayload.modified = modified;
        if (multi !== undefined) requestPayload.multi = multi;
        if (name !== undefined) requestPayload.name = name;
        if (options !== undefined) requestPayload.options = options;
        if (overallState !== undefined) requestPayload.overall_state = overallState;
        if (priority !== undefined) requestPayload.priority = priority;
        requestPayload.query = query;
        if (restrictedRoles !== undefined) requestPayload.restricted_roles = restrictedRoles;
        if (state !== undefined) requestPayload.state = state;
        if (tags !== undefined) requestPayload.tags = tags;
        requestPayload.type = type;
        
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
          throw new Error(`Failed to validate an existing monitor: ${response.status} ${response.statusText} - ${errorText}`);
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
      name: "Created Monitor",
      description: `The created monitor object`,
      default: true,
      type: {
        type: "object",
        properties: {
          result: { type: "object" }
        },
        required: ["result"]
      },
    },
  },
};
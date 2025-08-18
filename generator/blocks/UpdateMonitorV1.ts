import { AppBlock, events } from "@slflows/sdk/v1";

export const UpdateMonitorV1: AppBlock = {
  name: "Edit a monitor",
  description: `Edit the specified monitor.`,
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
            "type": "string"
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
            "type": "string"
          },
          required: false,
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
          required: false,
        },
      },
      onEvent: async (input) => {
        const { monitorId } = input.event.inputConfig;
        const { created, creator, deleted, draftStatus, id, message, modified, multi, name, options, overallState, priority, query, restrictedRoles, state, tags, type } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const url = `${baseUrl}/api/v1/monitor/${monitorId}`;
        const requestPayload: any = {};
        if (created !== undefined) requestPayload.created = created;
        if (creator !== undefined) requestPayload.creator = creator;
        if (deleted !== undefined) requestPayload.deleted = deleted;
        if (draftStatus !== undefined) requestPayload.draft_status = draftStatus;
        if (id !== undefined) requestPayload.id = id;
        if (message !== undefined) requestPayload.message = message;
        if (modified !== undefined) requestPayload.modified = modified;
        if (multi !== undefined) requestPayload.multi = multi;
        if (name !== undefined) requestPayload.name = name;
        if (options !== undefined) requestPayload.options = options;
        if (overallState !== undefined) requestPayload.overall_state = overallState;
        if (priority !== undefined) requestPayload.priority = priority;
        if (query !== undefined) requestPayload.query = query;
        if (restrictedRoles !== undefined) requestPayload.restricted_roles = restrictedRoles;
        if (state !== undefined) requestPayload.state = state;
        if (tags !== undefined) requestPayload.tags = tags;
        if (type !== undefined) requestPayload.type = type;
        
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "DD-API-KEY": apiKey,
            "DD-APPLICATION-KEY": appKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to edit a monitor: ${response.status} ${response.statusText} - ${errorText}`);
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
      name: "Updated Monitor",
      description: `The updated monitor object`,
      default: true,
      type: {
        type: "object",
        properties: {
          created: { type: "string" },
          creator: { type: "string" },
          deleted: { type: "string" },
          draft_status: { type: "string" },
          id: { type: "number" },
          matching_downtimes: { type: "array", items: { type: "string" } },
          message: { type: "string" },
          modified: { type: "string" },
          multi: { type: "boolean" },
          name: { type: "string" },
          options: { type: "string" },
          overall_state: { type: "string" },
          priority: { type: "number" },
          query: { type: "string" },
          restricted_roles: { type: "array", items: { type: "string" } },
          state: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
          type: { type: "string" }
        },
        required: ["type", "query"]
      },
    },
  },
};
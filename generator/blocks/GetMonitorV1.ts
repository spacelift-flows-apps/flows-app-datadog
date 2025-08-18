import { AppBlock, events } from "@slflows/sdk/v1";

export const GetMonitorV1: AppBlock = {
  name: "Get a monitor's details",
  description: `Get details about the specified monitor from your organization.`,
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
        groupStates: {
          name: "Group States",
          description: `Group States parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        withDowntimes: {
          name: "With Downtimes",
          description: `With Downtimes parameter`,
          type: {
            "type": "boolean"
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { monitorId, groupStates, withDowntimes } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const urlBase = `${baseUrl}/api/v1/monitor/${monitorId}`;
        const queryParams = new URLSearchParams();
        if (groupStates !== undefined) queryParams.append('group_states', String(groupStates));
        if (withDowntimes !== undefined) queryParams.append('with_downtimes', String(withDowntimes));
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
          throw new Error(`Failed to get a monitor's details: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        
        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "Monitor Details",
      description: `The retrieved monitor object`,
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
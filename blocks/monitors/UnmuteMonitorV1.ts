import { defineDatadogBlock } from "../../utils/defineDatadogBlock";
import { monitorId } from "../shared";

export const unmuteMonitorV1 = defineDatadogBlock({
  name: "Unmute Monitor V1",
  description: "Unmute a DataDog monitor using the V1 API",
  category: "Monitors",
  method: "POST",
  endpoint: "/api/v1/monitor/{monitor_id}/unmute",
  pathParams: ["monitor_id"],
  outputJsonSchema: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
  inputConfig: {
    monitor_id: monitorId,
    scope: {
      name: "Scope",
      description: "The scope to unmute (optional)",
      type: "string",
      required: false,
      apiRequestFieldKey: "scope",
    },
    all_scopes: {
      name: "All Scopes",
      description: "Clear muting across all scopes",
      type: "boolean",
      required: false,
      apiRequestFieldKey: "all_scopes",
    },
  },
});
import { defineDatadogBlock } from "../../utils/defineDatadogBlock";
import { monitorId } from "../shared";

export const muteMonitorV1 = defineDatadogBlock({
  name: "Mute Monitor",
  description: "Mute a DataDog monitor using the V1 API",
  category: "Monitors",
  method: "POST",
  endpoint: "/api/v1/monitor/{monitor_id}/mute",
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
      description: "The scope to mute (optional)",
      type: "string",
      required: false,
      apiRequestFieldKey: "scope",
    },
    end: {
      name: "End Time",
      description: "POSIX timestamp to end the mute (optional)",
      type: "number",
      required: false,
      apiRequestFieldKey: "end",
    },
  },
});

import { defineDatadogBlock } from "../../utils/defineDatadogBlock";
import { monitorId } from "../shared";
import { withDowntimes, groupStates } from "./shared";
import { monitorSchema } from "../../schemas/monitor";

export const getMonitorV1 = defineDatadogBlock({
  name: "Get Monitor V1",
  description: "Get a specific DataDog monitor using the V1 API",
  category: "Monitors",
  method: "GET",
  endpoint: "/api/v1/monitor/{monitor_id}",
  pathParams: ["monitor_id"],
  outputJsonSchema: monitorSchema,
  inputConfig: {
    monitor_id: monitorId,
    with_downtimes: withDowntimes,
    group_states: groupStates,
  },
});

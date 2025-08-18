import { defineDatadogBlock } from "../../utils/defineDatadogBlock";
import { name, tags, pageSize } from "../shared";
import { withDowntimes, groupStates } from "./shared";
import { monitorListSchema } from "../../schemas/monitor";

export const listMonitorsV1 = defineDatadogBlock({
  name: "List Monitors V1",
  description: "Get all monitor details from DataDog using the V1 API",
  category: "Monitors",
  method: "GET",
  endpoint: "/api/v1/monitor",
  outputJsonSchema: monitorListSchema,
  inputConfig: {
    name,
    tags,
    monitor_tags: {
      ...tags,
      name: "Monitor Tags Filter",
      description: "Filter monitors by monitor tags",
      apiRequestFieldKey: "monitor_tags",
    },
    with_downtimes: withDowntimes,
    group_states: groupStates,
    page_size: pageSize,
  },
});

import { defineDatadogBlock } from "../../utils/defineDatadogBlock";
import { monitorId } from "../shared";
import {
  monitorType,
  monitorQuery,
  monitorName,
  monitorMessage,
  monitorTags,
  monitorOptions,
} from "./shared";
import { monitorSchema } from "../../schemas/monitor";

export const updateMonitorV1 = defineDatadogBlock({
  name: "Update Monitor V1",
  description: "Update an existing DataDog monitor using the V1 API",
  category: "Monitors",
  method: "PUT",
  endpoint: "/api/v1/monitor/{monitor_id}",
  pathParams: ["monitor_id"],
  outputJsonSchema: monitorSchema,
  inputConfig: {
    monitor_id: monitorId,
    type: { ...monitorType, required: false },
    query: { ...monitorQuery, required: false },
    name: { ...monitorName, required: false },
    message: monitorMessage,
    tags: monitorTags,
    options: monitorOptions,
  },
});

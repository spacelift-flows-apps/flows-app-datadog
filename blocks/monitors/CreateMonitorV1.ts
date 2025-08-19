import { defineDatadogBlock } from "../../utils/defineDatadogBlock";
import {
  monitorType,
  monitorQuery,
  monitorName,
  monitorMessage,
  monitorTags,
  monitorPriority,
  monitorOptions,
} from "./shared";
import { monitorSchema } from "../../schemas/monitor";

export const createMonitorV1 = defineDatadogBlock({
  name: "Create Monitor",
  description: "Create a new DataDog monitor using the V1 API",
  category: "Monitors",
  method: "POST",
  endpoint: "/api/v1/monitor",
  outputJsonSchema: monitorSchema,
  inputConfig: {
    type: monitorType,
    query: monitorQuery,
    name: monitorName,
    message: monitorMessage,
    tags: monitorTags,
    priority: monitorPriority,
    options: monitorOptions,
  },
});

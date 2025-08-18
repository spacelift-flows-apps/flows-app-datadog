import { defineDatadogBlock } from "../../utils/defineDatadogBlock";
import { monitorId } from "../shared";
import { forceDelete } from "./shared";
import { deletedMonitorSchema } from "../../schemas/monitor";

export const deleteMonitorV1 = defineDatadogBlock({
  name: "Delete Monitor V1",
  description: "Delete a DataDog monitor using the V1 API",
  category: "Monitors",
  method: "DELETE",
  endpoint: "/api/v1/monitor/{monitor_id}",
  pathParams: ["monitor_id"],
  outputJsonSchema: deletedMonitorSchema,
  inputConfig: {
    monitor_id: monitorId,
    force: forceDelete,
  },
});

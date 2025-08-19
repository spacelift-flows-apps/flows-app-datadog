import { defineDatadogBlock } from "../../utils/defineDatadogBlock";
import { eventId } from "../shared";
import { eventSchema } from "../../schemas/event";

export const getEventV2 = defineDatadogBlock({
  name: "Get Event",
  description: "Get a specific event from DataDog using the V2 API",
  category: "Events",
  method: "GET",
  endpoint: "/api/v2/events/{event_id}",
  pathParams: ["event_id"],
  outputJsonSchema: eventSchema,
  inputConfig: {
    event_id: eventId,
  },
});

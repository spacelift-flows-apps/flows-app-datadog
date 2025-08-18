import { defineDatadogBlock } from "../../utils/defineDatadogBlock";
import { query, fromDate, toDate, sort, pageSize } from "../shared";
import { eventListSchema } from "../../schemas/event";

export const listEventsV2 = defineDatadogBlock({
  name: "List Events V2",
  description: "List events from DataDog using the V2 API",
  category: "Events",
  method: "GET",
  endpoint: "/api/v2/events",
  outputJsonSchema: eventListSchema,
  inputConfig: {
    filter_query: query,
    filter_from: fromDate,
    filter_to: toDate,
    sort,
    page_limit: {
      ...pageSize,
      name: "Page Limit",
      description: "Maximum number of events in the response (max 1000)",
      apiRequestFieldKey: "page[limit]",
    },
  },
});

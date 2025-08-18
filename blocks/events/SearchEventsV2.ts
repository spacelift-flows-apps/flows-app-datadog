import { defineDatadogBlock } from "../../utils/defineDatadogBlock";
import { query, fromDate, toDate, sort, pageSize } from "../shared";
import { eventListSchema } from "../../schemas/event";

export const searchEventsV2 = defineDatadogBlock({
  name: "Search Events V2",
  description: "Search for events in DataDog using the V2 API",
  category: "Events",
  method: "POST",
  endpoint: "/api/v2/events/search",
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
  requestBodyTransform: (params) => {
    const body: any = {};

    if (params.filter_query || params.filter_from || params.filter_to) {
      body.filter = {};
      if (params.filter_query) body.filter.query = params.filter_query;
      if (params.filter_from) body.filter.from = params.filter_from;
      if (params.filter_to) body.filter.to = params.filter_to;
    }

    if (params.sort) {
      body.sort = params.sort;
    }

    if (params["page[limit]"]) {
      body.page = { limit: params["page[limit]"] };
    }

    return body;
  },
});

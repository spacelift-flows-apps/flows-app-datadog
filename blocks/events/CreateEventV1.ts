import { defineDatadogBlock } from "../../utils/defineDatadogBlock";
import {
  eventTitle,
  eventText,
  alertType,
  eventPriority,
  sourceTypeName,
  host,
  deviceName,
  aggregationKey,
  relatedEventId,
} from "./shared";
import { tags } from "../shared";
import { eventSchema } from "../../schemas/event";

export const createEventV1 = defineDatadogBlock({
  name: "Create Event",
  description: "Create a new event in DataDog using the V1 API",
  category: "Events",
  method: "POST",
  endpoint: "/api/v1/events",
  useAppKey: false,
  outputJsonSchema: eventSchema,
  inputConfig: {
    title: eventTitle,
    text: eventText,
    tags,
    alert_type: alertType,
    priority: eventPriority,
    source_type_name: sourceTypeName,
    host,
    device_name: deviceName,
    aggregation_key: aggregationKey,
    related_event_id: relatedEventId,
  },
  requestBodyTransform: (params) => ({
    ...params,
    date_happened: Math.floor(Date.now() / 1000),
  }),
});

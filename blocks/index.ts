// Import all blocks
import { createMonitorV1 } from "./monitors/CreateMonitorV1";
import { updateMonitorV1 } from "./monitors/UpdateMonitorV1";
import { deleteMonitorV1 } from "./monitors/DeleteMonitorV1";
import { getMonitorV1 } from "./monitors/GetMonitorV1";
import { listMonitorsV1 } from "./monitors/ListMonitorsV1";
import { muteMonitorV1 } from "./monitors/MuteMonitorV1";
import { unmuteMonitorV1 } from "./monitors/UnmuteMonitorV1";
import { subscribeToMonitorV1 } from "./monitors/SubscribeToMonitorV1";
import { createEventV1 } from "./events/CreateEventV1.ts";
import { getEventV2 } from "./events/GetEventV2";
import { listEventsV2 } from "./events/ListEventsV2";
import { searchEventsV2 } from "./events/SearchEventsV2";

// Re-export individual blocks
export {
  createMonitorV1,
  updateMonitorV1,
  deleteMonitorV1,
  getMonitorV1,
  listMonitorsV1,
  muteMonitorV1,
  unmuteMonitorV1,
  subscribeToMonitorV1,
};
export { createEventV1, getEventV2, listEventsV2, searchEventsV2 };

// Export all blocks as a dictionary
export const blocks = {
  // Monitor V1
  createMonitorV1,
  updateMonitorV1,
  deleteMonitorV1,
  getMonitorV1,
  listMonitorsV1,
  muteMonitorV1,
  unmuteMonitorV1,
  subscribeToMonitorV1,

  // Events V2
  createEventV2: createEventV1,
  getEventV2,
  listEventsV2,
  searchEventsV2,
} as const;

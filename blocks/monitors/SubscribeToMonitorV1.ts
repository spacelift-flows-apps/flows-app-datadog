import {AppBlock, events} from "@slflows/sdk/v1";

export const subscribeToMonitorV1: AppBlock = {
    name: "Subscribe to Monitor",
    description: "Subscribe to DataDog monitor events and alerts",
    category: "Monitors",

    config: {
        monitor_id: {
            name: "Monitor ID",
            description: "Specific monitor ID to listen to (optional - if not provided, listens to all monitors)",
            type: "string",
            required: false,
        },
    },
    async onInternalMessage({ message }) {
        const monitorPayload = message.body;

        await events.emit(monitorPayload);
    },

    outputs: {
        default: {
            name: "Monitor Event",
            description: "DataDog monitor event data",
            default: true,
            type: {
                type: "object",
                properties: {
                    id: {type: "string"},
                    event_type: {type: "string"},
                    title: {type: "string"},
                    text: {type: "string"},
                    date: {type: "number"},
                    priority: {type: "string"},
                    tags: {
                        type: "array",
                        items: {type: "string"},
                    },
                    alert_id: {type: "string"},
                    alert_title: {type: "string"},
                    alert_status: {type: "string"},
                    alert_transition: {type: "string"},
                    hostname: {type: "string"},
                    org_name: {type: "string"},
                    monitor_id: {type: "number"},
                },
            },
        },
    },
};
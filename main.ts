import {AppInput,http, defineApp,blocks,messaging} from "@slflows/sdk/v1";
import { blocks as allBlocks } from "./blocks/index";

export const app = defineApp({
  name: "DataDog API",
  installationInstructions:
    "DataDog API integration for Flows\n\nTo install:\n1. Add your DataDog API key\n2. Add your DataDog Application key\n3. Configure the base URL (defaults to https://api.datadoghq.com)\n4. Start using the blocks in your flows",

  blocks:allBlocks,

  config: {
    apiKey: {
      name: "API Key",
      description: "Your DataDog API key",
      type: "string",
      required: true,
      sensitive: true,
    },
    webhookSecret: {
      name: "Datadog Webhook Secret",
      description: "Secret key for validating Datadog webhook requests",
      type: "string",
      required: true,
    },
    appKey: {
      name: "Application Key",
      description:
        "Your DataDog Application key (required for some operations)",
      type: "string",
      required: true,
      sensitive: true,
    },
    baseUrl: {
      name: "Base URL",
      description: "DataDog API base URL",
      type: "string",
      required: false,
      default: "https://api.datadoghq.com",
    },
  },

  async onSync(input:AppInput) {
    const apiKey = input.app.config.apiKey as string;
    const appKey = input.app.config.appKey as string;
    const baseUrl = input.app.config.baseUrl as string;

    try {
      // Validate API credentials using DataDog's validate endpoint
      const response = await fetch(`${baseUrl}/api/v1/validate`, {
        method: "GET",
        headers: {
          "DD-API-KEY": apiKey,
          "DD-APPLICATION-KEY": appKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorMsg = `DataDog API validation failed: ${response.status} ${response.statusText} - ${errorText}`;
        console.error(errorMsg);
        return {
          newStatus: "failed" as const,
          customStatusDescription: "DataDog API validation failed",
        };
      }

      const result = await response.json();

      // Check if the validation response indicates valid credentials
      if (!result.valid) {
        const errorMsg = "DataDog API credentials are invalid";
        console.error(errorMsg);
        return {
          newStatus: "failed" as const,
          customStatusDescription: errorMsg,
        };
      }

      try {
        const webhookResponse = await fetch(`${baseUrl}/api/v1/integration/webhooks/configuration/webhooks`, {
          method: "POST",
          headers: {
            "DD-API-KEY": apiKey,
            "DD-APPLICATION-KEY": appKey,
          },
          body: JSON.stringify({
            name: `spacelift-flows-${crypto.randomUUID()}`,
            url: `${input.app.http.url}/webhook`,
            payload: `{
              "monitor_id": "$ALERT_ID",
              "monitor_name": "$ALERT_TITLE",
              "status": "$ALERT_TRANSITION",
              "alert_status": "$ALERT_STATUS",
              "message": "$TEXT_ONLY_MSG",
              "timestamp": "$DATE",
              "url": "$LINK",
              "tags": "$TAGS",
              "alert_query": "$ALERT_QUERY",
              "alert_scope": "$ALERT_SCOPE",
              "alert_metric": "$ALERT_METRIC",
              "priority": "$ALERT_PRIORITY",
              "event_type": "$EVENT_TYPE"
            }`
          }),
        });

        if (!webhookResponse.ok) {
          const webhookErrorText = await webhookResponse.text();
          const errorMsg = `Webhook creation failed: ${webhookResponse.status} ${webhookResponse.statusText} - ${webhookErrorText}`;
          console.error(errorMsg);
          return {
            newStatus: "failed" as const,
            customStatusDescription: "Webhook creation failed",
          };
        } else {
          const webhookResult = await webhookResponse.json();
          console.log(`Webhook created successfully with ID: ${webhookResult.id || 'unknown'}`);
        }
      } catch (webhookError) {
        const errorMsg = `Failed to create webhook: ${webhookError instanceof Error ? webhookError.message : String(webhookError)}`;
        console.error(errorMsg);
        return {
          newStatus: "failed" as const,
          customStatusDescription: "Failed to create webhook",
        };
      }

      return {
        newStatus: "ready" as const,
      };
    } catch (error) {
      const errorMsg = `Failed to validate DataDog API credentials: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMsg);
      return {
        newStatus: "failed" as const,
        customStatusDescription: "Failed to validate DataDog API credentials",
      };
    }
  },

  http: {
    onRequest: async (input: any) => {
      // Handle DataDog webhook events
      console.log("Received webhook from Datadog");

      // Validate the request
      // Check if the webhook secret is in the query parameters
      // const requestedSecret = input.request.query.secret;
      // if (
      //     input.app.config.webhookSecret &&
      //     (!requestedSecret || requestedSecret !== input.app.config.webhookSecret)
      // ) {
      //   console.log("Invalid webhook secret");
      //   await http.respond(input.request.requestId, {
      //     statusCode: 401,
      //     body: { error: "Unauthorized: Invalid webhook secret" },
      //   });
      //   return;
      // }

      // Optional: Also check if the path is correct (e.g., /webhook)
      if (input.request.path && !input.request.path.includes("/webhook")) {
        console.log("Unexpected webhook path:", input.request.path);
        // Still process it, but log for debugging
      }

      if (!input.request.body) {
        await http.respond(input.request.requestId, {
          statusCode: 400,
          body: { error: "Missing request body" },
        });
        return;
      }

      // Extract the alert information
      const payload = input.request.body;

      try {
        // Parse information from the webhook payload
        const alertData = extractMonitorInfo(
            payload,
            input.app.config.datadogSite,
        );
        console.log("Extracted alert data:", alertData);

        // Find entities that are subscribed to this monitor
        const entityList = await blocks.list({
          typeIds: ["subscribeToMonitorV1"],
        });

        const matchingEntityIds = entityList.blocks
            .filter((entity) => {
              const monitorId = alertData.monitorId as string;
              // const monitorName = alertData.monitorName as string;
              console.log(monitorId,entity.config.monitor_id)

              // Check if the entity is subscribed to this monitor by ID
              if (monitorId && entity.config.monitor_id) {
                if (Array.isArray(entity.config.monitor_id)) {
                  return entity.config.monitor_id.includes(monitorId);
                } else {
                  return entity.config.monitor_id === monitorId;
                }
              }

              return true;
            })
            .map((entity) => entity.id);

        // Send internal messages to matching entities
        if (matchingEntityIds.length > 0) {
          await messaging.sendToBlocks({
            blockIds: matchingEntityIds,
            body: {
              type: "monitor_status_change",
              data: alertData,
            },
          });
        }

        // Respond with success
        await http.respond(input.request.requestId, {
          statusCode: 200,
          body: { success: true, matched_blocks: matchingEntityIds.length },
        });
      } catch (error) {
        console.error("Error processing Datadog webhook:", error);
        await http.respond(input.request.requestId, {
          statusCode: 500,
          body: { error: "Internal server error" },
        });
      }
    },
  },
});


function extractMonitorInfo(
    payload: Record<string, unknown>,
    datadogSite: string = "us",
): Record<string, unknown> {
  const tags = Array.isArray(payload.tags)
      ? payload.tags
      : typeof payload.tags === "string"
          ? payload.tags.split(",").map((t: string) => t.trim())
          : [];

  // Parse timestamp - handle both string format and numeric timestamp
  let timestamp: string;
  if (payload.timestamp) {
    if (typeof payload.timestamp === "number") {
      timestamp = new Date(payload.timestamp).toISOString();
    } else if (typeof payload.timestamp === "string") {
      // Try parsing as number first, then as date string
      const parsedNum = parseInt(payload.timestamp);
      timestamp = !isNaN(parsedNum)
          ? new Date(parsedNum).toISOString()
          : new Date(payload.timestamp).toISOString();
    } else {
      timestamp = new Date().toISOString();
    }
  } else if (payload.date) {
    if (typeof payload.date === "number") {
      timestamp = new Date(payload.date).toISOString();
    } else if (typeof payload.date === "string") {
      // Try parsing as number first, then as date string
      const parsedNum = parseInt(payload.date);
      timestamp = !isNaN(parsedNum)
          ? new Date(parsedNum).toISOString()
          : new Date(payload.date).toISOString();
    } else {
      timestamp = new Date().toISOString();
    }
  } else {
    timestamp = new Date().toISOString();
  }

  // Extract monitor ID and URLs
  const monitorId = payload.monitor_id || payload.alert_id || payload.id || "";
  const monitorUrl = `https://app.datadoghq.${datadogSite}.com/monitors/${monitorId}`;
  const eventUrl = payload.url || payload.link || "";

  return {
    // Monitor identification
    monitorId: monitorId,
    monitorName:
        payload.monitor_name || payload.alert_title || payload.title || "",

    // Alert state (keep status for backward compatibility)
    status:
        payload.status || payload.alert_transition || payload.alert_type || "",
    transitionType:
        payload.status || payload.alert_transition || payload.alert_type || "",

    // Alert details
    alertCondition: payload.alert_status || payload.previous_status || "",
    message: payload.message || payload.text_only_msg || payload.body || "",

    // Query information
    query: payload.alert_query || "",
    metric: payload.alert_metric || "",
    scope: payload.alert_scope || "",

    // Metadata
    timestamp: timestamp,
    priority: payload.priority || payload.alert_priority || "",
    tags: tags,
    eventType: payload.event_type || "monitor_alert",

    // URLs
    url: eventUrl, // Keep for backward compatibility
    monitorUrl: monitorUrl,
    eventUrl: eventUrl,

    // Original payload for debugging
    rawPayload: payload,
  };
}
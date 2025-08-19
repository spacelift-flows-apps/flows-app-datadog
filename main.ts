import { defineApp } from "@slflows/sdk/v1";
import { blocks } from "./blocks/index";

export const app = defineApp({
  name: "DataDog API",
  installationInstructions:
    "DataDog API integration for Flows\n\nTo install:\n1. Add your DataDog API key\n2. Add your DataDog Application key\n3. Configure the base URL (defaults to https://api.datadoghq.com)\n4. Start using the blocks in your flows",

  blocks,

  config: {
    apiKey: {
      name: "API Key",
      description: "Your DataDog API key",
      type: "string",
      required: true,
      sensitive: true,
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

  async onSync(input) {
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
});

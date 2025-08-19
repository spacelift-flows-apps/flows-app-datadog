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
});

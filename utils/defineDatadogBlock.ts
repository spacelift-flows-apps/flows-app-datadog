import { AppBlock, events } from "@slflows/sdk/v1";

export interface DatadogInputConfig {
  name: string;
  description: string;
  type: any;
  required: boolean;
  default?: any;
  sensitive?: boolean;
  apiRequestFieldKey?: string;
  apiRequestTransform?: (value: any) => any;
}

export interface DatadogBlockParams {
  name: string;
  description: string;
  category: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  inputConfig?: Record<string, DatadogInputConfig>;
  outputJsonSchema?: any;
  pathParams?: string[];
  useAppKey?: boolean;
  requestBodyTransform?: (params: any) => any;
  responseTransform?: (response: any) => any;
}

export function defineDatadogInputConfig(
  config: DatadogInputConfig,
): DatadogInputConfig {
  return config;
}

export function defineDatadogBlock(params: DatadogBlockParams): AppBlock {
  const {
    name,
    description,
    category,
    method,
    endpoint,
    inputConfig = {},
    outputJsonSchema,
    pathParams = [],
    useAppKey = true,
    requestBodyTransform,
    responseTransform,
  } = params;

  // Convert inputConfig to AppBlock input config format
  const blockConfig: Record<string, any> = {};
  Object.entries(inputConfig).forEach(([key, config]) => {
    blockConfig[key] = {
      name: config.name,
      description: config.description,
      type: config.type,
      required: config.required,
      default: config.default,
      sensitive: config.sensitive,
    };
  });

  return {
    name,
    description,
    category,

    inputs: {
      default: {
        name: `Execute ${name}`,
        description: `Trigger ${description.toLowerCase()}`,
        config: blockConfig,
        onEvent: async (input) => {
          const apiKey = input.app.config.apiKey as string;
          const appKey = input.app.config.appKey as string;
          const baseUrl = input.app.config.baseUrl as string;

          // Build request URL
          let url = `${baseUrl}${endpoint}`;

          // Replace path parameters
          pathParams.forEach((param) => {
            const value = input.event.inputConfig[param];
            if (value !== undefined) {
              url = url.replace(`{${param}}`, value.toString());
            }
          });

          // Build query parameters for GET requests
          const searchParams = new URLSearchParams();
          if (method === "GET") {
            Object.entries(inputConfig).forEach(([key, config]) => {
              const value = input.event.inputConfig[key];
              if (
                value !== undefined &&
                value !== null &&
                !pathParams.includes(key)
              ) {
                const apiKey = config.apiRequestFieldKey || key;
                const transformedValue = config.apiRequestTransform
                  ? config.apiRequestTransform(value)
                  : value;

                if (Array.isArray(transformedValue)) {
                  searchParams.append(apiKey, transformedValue.join(","));
                } else {
                  searchParams.append(apiKey, transformedValue.toString());
                }
              }
            });

            if (searchParams.toString()) {
              url += `?${searchParams.toString()}`;
            }
          }

          // Build request body for POST/PUT requests
          let requestBody: any = null;
          if (method === "POST" || method === "PUT") {
            const bodyParams: any = {};
            Object.entries(inputConfig).forEach(([key, config]) => {
              const value = input.event.inputConfig[key];
              if (
                value !== undefined &&
                value !== null &&
                !pathParams.includes(key)
              ) {
                const apiKey = config.apiRequestFieldKey || key;
                const transformedValue = config.apiRequestTransform
                  ? config.apiRequestTransform(value)
                  : value;
                bodyParams[apiKey] = transformedValue;
              }
            });

            requestBody = requestBodyTransform
              ? requestBodyTransform(bodyParams)
              : bodyParams;
          }

          // Build headers
          const headers: Record<string, string> = {
            "DD-API-KEY": apiKey,
          };

          if (useAppKey) {
            headers["DD-APPLICATION-KEY"] = appKey;
          }

          if (requestBody) {
            headers["Content-Type"] = "application/json";
          }

          // Make the request
          const response = await fetch(url, {
            method,
            headers,
            body: requestBody ? JSON.stringify(requestBody) : undefined,
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `DataDog API ${method} ${endpoint} failed: ${response.status} ${response.statusText} - ${errorText}`,
            );
          }

          // Process response
          let result = await response.json();
          if (responseTransform) {
            result = responseTransform(result);
          }

          await events.emit(result);
        },
      },
    },

    outputs: {
      default: {
        name: "Result",
        description: `Result from ${description.toLowerCase()}`,
        default: true,
        type: outputJsonSchema || { type: "object" },
      },
    },
  };
}

// Template for generating DataDog API flow blocks from OpenAPI operations

export const dataDogBlockTemplate = `import { AppBlock, events } from "@slflows/sdk/v1";

export const {{blockName}}: AppBlock = {
  name: "{{displayName}}",
  description: \`{{description}}\`,
  category: "{{category}}",

  inputs: {
    default: {
      config: {
{{inputConfig}}
      },
      onEvent: async (input) => {
{{extractInputs}}
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

{{buildUrl}}
        
        const response = await fetch(url, {
          method: "{{httpMethod}}",
          headers: {
            "DD-API-KEY": apiKey,{{appKeyHeader}}
            "Content-Type": "application/json",{{customHeaders}}
          },{{requestBody}}
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(\`Failed to {{operationDescription}}: \${response.status} \${response.statusText} - \${errorText}\`);
        }

{{handleResponse}}
        
        await events.emit({{emitData}});
      },
    },
  },

  outputs: {
    default: {
      name: "{{outputName}}",
      description: \`{{outputDescription}}\`,
      default: true,
      type: {{outputType}},
    },
  },
};`;

export const dataDogMethodTemplates = {
  GET: {
    requestBody: '',
    handleResponse: '        const result = await response.json();',
    emitData: 'result',
    operationDescription: 'retrieve data',
    requiresAppKey: true
  },
  POST: {
    requestBody: '\n          body: JSON.stringify(requestPayload),',
    handleResponse: '        const result = await response.json();',
    emitData: '{\n          result,\n          operation: "create"\n        }',
    operationDescription: 'create resource',
    requiresAppKey: true
  },
  PUT: {
    requestBody: '\n          body: JSON.stringify(requestPayload),',
    handleResponse: '        const result = await response.json();',
    emitData: '{\n          result,\n          operation: "update"\n        }',
    operationDescription: 'update resource',
    requiresAppKey: true
  },
  DELETE: {
    requestBody: '',
    handleResponse: '        const result = response.status === 204 ? { deleted: true } : await response.json();',
    emitData: '{\n          result,\n          operation: "delete"\n        }',
    operationDescription: 'delete resource',
    requiresAppKey: true
  },
  PATCH: {
    requestBody: '\n          body: JSON.stringify(requestPayload),',
    handleResponse: '        const result = await response.json();',
    emitData: '{\n          result,\n          operation: "update"\n        }',
    operationDescription: 'update resource',
    requiresAppKey: true
  }
} as const;

// DataDog-specific resource operation patterns
export const dataDogOperationPatterns = {
  // Monitors
  monitors: {
    create: {
      displayName: 'Create Monitor',
      description: 'Create a new DataDog monitor',
      operationDescription: 'create monitor'
    },
    get: {
      displayName: 'Get Monitor',
      description: 'Retrieve a specific DataDog monitor',
      operationDescription: 'get monitor'
    },
    list: {
      displayName: 'List Monitors',
      description: 'Get all DataDog monitors',
      operationDescription: 'list monitors'
    },
    update: {
      displayName: 'Update Monitor',
      description: 'Update an existing DataDog monitor',
      operationDescription: 'update monitor'
    },
    delete: {
      displayName: 'Delete Monitor',
      description: 'Delete a DataDog monitor',
      operationDescription: 'delete monitor'
    },
    validate: {
      displayName: 'Validate Monitor',
      description: 'Validate a DataDog monitor',
      operationDescription: 'validate monitor'
    },
    search: {
      displayName: 'Search Monitors',
      description: 'Search DataDog monitors',
      operationDescription: 'search monitors'
    }
  },
  
  // Events
  events: {
    create: {
      displayName: 'Create Event',
      description: 'Submit a new DataDog event',
      operationDescription: 'create event'
    },
    get: {
      displayName: 'Get Event',
      description: 'Retrieve a specific DataDog event',
      operationDescription: 'get event'
    },
    list: {
      displayName: 'List Events',
      description: 'Query DataDog events',
      operationDescription: 'list events'
    }
  },

  // Metrics
  metrics: {
    submit: {
      displayName: 'Submit Metrics',
      description: 'Submit metrics to DataDog',
      operationDescription: 'submit metrics'
    },
    query: {
      displayName: 'Query Metrics',
      description: 'Query metrics from DataDog',
      operationDescription: 'query metrics'
    },
    list: {
      displayName: 'List Metrics',
      description: 'Get list of actively reporting metrics',
      operationDescription: 'list metrics'
    },
    search: {
      displayName: 'Search Metrics',
      description: 'Search for metrics',
      operationDescription: 'search metrics'
    }
  },

  // Logs
  logs: {
    list: {
      displayName: 'List Logs',
      description: 'Search for logs',
      operationDescription: 'search logs'
    },
    aggregate: {
      displayName: 'Aggregate Logs',
      description: 'Aggregate logs',
      operationDescription: 'aggregate logs'
    }
  },

  // Dashboards
  dashboards: {
    create: {
      displayName: 'Create Dashboard',
      description: 'Create a new dashboard',
      operationDescription: 'create dashboard'
    },
    get: {
      displayName: 'Get Dashboard',
      description: 'Retrieve a specific dashboard',
      operationDescription: 'get dashboard'
    },
    list: {
      displayName: 'List Dashboards',
      description: 'Get all dashboards',
      operationDescription: 'list dashboards'
    },
    update: {
      displayName: 'Update Dashboard',
      description: 'Update an existing dashboard',
      operationDescription: 'update dashboard'
    },
    delete: {
      displayName: 'Delete Dashboard',
      description: 'Delete a dashboard',
      operationDescription: 'delete dashboard'
    }
  },

  // Users
  users: {
    create: {
      displayName: 'Create User',
      description: 'Create a new user',
      operationDescription: 'create user'
    },
    get: {
      displayName: 'Get User',
      description: 'Retrieve a specific user',
      operationDescription: 'get user'
    },
    list: {
      displayName: 'List Users',
      description: 'Get all users',
      operationDescription: 'list users'
    },
    update: {
      displayName: 'Update User',
      description: 'Update an existing user',
      operationDescription: 'update user'
    },
    disable: {
      displayName: 'Disable User',
      description: 'Disable a user',
      operationDescription: 'disable user'
    }
  },

  // Hosts
  hosts: {
    list: {
      displayName: 'List Hosts',
      description: 'Get all hosts',
      operationDescription: 'list hosts'
    },
    totals: {
      displayName: 'Get Host Totals',
      description: 'Get total number of hosts',
      operationDescription: 'get host totals'
    }
  },

  // Tags
  tags: {
    list: {
      displayName: 'List Tags',
      description: 'Get all tags',
      operationDescription: 'list tags'
    },
    get: {
      displayName: 'Get Host Tags',
      description: 'Get tags for a specific host',
      operationDescription: 'get host tags'
    },
    update: {
      displayName: 'Update Host Tags',
      description: 'Update tags for a specific host',
      operationDescription: 'update host tags'
    },
    create: {
      displayName: 'Add Host Tags',
      description: 'Add tags to a specific host',
      operationDescription: 'add host tags'
    },
    delete: {
      displayName: 'Remove Host Tags',
      description: 'Remove tags from a specific host',
      operationDescription: 'remove host tags'
    }
  },

  // Downtimes
  downtimes: {
    create: {
      displayName: 'Schedule Downtime',
      description: 'Schedule a downtime',
      operationDescription: 'schedule downtime'
    },
    get: {
      displayName: 'Get Downtime',
      description: 'Retrieve a specific downtime',
      operationDescription: 'get downtime'
    },
    list: {
      displayName: 'List Downtimes',
      description: 'Get all downtimes',
      operationDescription: 'list downtimes'
    },
    update: {
      displayName: 'Update Downtime',
      description: 'Update an existing downtime',
      operationDescription: 'update downtime'
    },
    cancel: {
      displayName: 'Cancel Downtime',
      description: 'Cancel a downtime',
      operationDescription: 'cancel downtime'
    }
  }
} as const;
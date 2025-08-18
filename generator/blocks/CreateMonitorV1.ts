import { AppBlock, events } from "@slflows/sdk/v1";

export const CreateMonitorV1: AppBlock = {
  name: "Create a monitor",
  description: `Create a monitor using the specified options.  #### Monitor Types  The type of monitor chosen from:  - anomaly: \`query alert\` - APM: \`query alert\` or \`trace-analytics alert\` - composite: \`composite\` - custom: \`service check\` - forecast: \`query alert\` - host: \`service check\` - integration: \`query alert\` or \`service check\` - live process: \`process alert\` - logs: \`log alert\` - metric: \`query alert\` - network: \`service check\` - outlier: \`query alert\` - process: \`service check\` - rum: \`rum alert\` - SLO: \`slo alert\` - watchdog: \`event-v2 alert\` - event-v2: \`event-v2 alert\` - audit: \`audit alert\` - error-tracking: \`error-tracking alert\` - database-monitoring: \`database-monitoring alert\` - network-performance: \`network-performance alert\` - cloud cost: \`cost alert\`  **Notes**: - Synthetic monitors are created through the Synthetics API. See the [Synthetics API](https://docs.datadoghq.com/api/latest/synthetics/) documentation for more information. - Log monitors require an unscoped App Key.  #### Query Types  ##### Metric Alert Query  Example: \`time_aggr(time_window):space_aggr:metric{tags} [by {key}] operator #\`  - \`time_aggr\`: avg, sum, max, min, change, or pct_change - \`time_window\`: \`last_#m\` (with \`#\` between 1 and 10080 depending on the monitor type) or \`last_#h\`(with \`#\` between 1 and 168 depending on the monitor type) or \`last_1d\`, or \`last_1w\` - \`space_aggr\`: avg, sum, min, or max - \`tags\`: one or more tags (comma-separated), or * - \`key\`: a 'key' in key:value tag syntax; defines a separate alert for each tag in the group (multi-alert) - \`operator\`: <, <=, >, >=, ==, or != - \`#\`: an integer or decimal number used to set the threshold  If you are using the \`_change_\` or \`_pct_change_\` time aggregator, instead use \`change_aggr(time_aggr(time_window), timeshift):space_aggr:metric{tags} [by {key}] operator #\` with:  - \`change_aggr\` change, pct_change - \`time_aggr\` avg, sum, max, min [Learn more](https://docs.datadoghq.com/monitors/create/types/#define-the-conditions) - \`time_window\` last\\_#m (between 1 and 2880 depending on the monitor type), last\\_#h (between 1 and 48 depending on the monitor type), or last_#d (1 or 2) - \`timeshift\` #m_ago (5, 10, 15, or 30), #h_ago (1, 2, or 4), or 1d_ago  Use this to create an outlier monitor using the following query: \`avg(last_30m):outliers(avg:system.cpu.user{role:es-events-data} by {host}, 'dbscan', 7) > 0\`  ##### Service Check Query  Example: \`"check".over(tags).last(count).by(group).count_by_status()\`  - \`check\` name of the check, for example \`datadog.agent.up\` - \`tags\` one or more quoted tags (comma-separated), or "*". for example: \`.over("env:prod", "role:db")\`; \`over\` cannot be blank. - \`count\` must be at greater than or equal to your max threshold (defined in the \`options\`). It is limited to 100. For example, if you've specified to notify on 1 critical, 3 ok, and 2 warn statuses, \`count\` should be at least 3. - \`group\` must be specified for check monitors. Per-check grouping is already explicitly known for some service checks. For example, Postgres integration monitors are tagged by \`db\`, \`host\`, and \`port\`, and Network monitors by \`host\`, \`instance\`, and \`url\`. See [Service Checks](https://docs.datadoghq.com/api/latest/service-checks/) documentation for more information.  ##### Event Alert Query  **Note:** The Event Alert Query has been replaced by the Event V2 Alert Query. For more information, see the [Event Migration guide](https://docs.datadoghq.com/service_management/events/guides/migrating_to_new_events_features/).  ##### Event V2 Alert Query  Example: \`events(query).rollup(rollup_method[, measure]).last(time_window) operator #\`  - \`query\` The search query - following the [Log search syntax](https://docs.datadoghq.com/logs/search_syntax/). - \`rollup_method\` The stats roll-up method - supports \`count\`, \`avg\` and \`cardinality\`. - \`measure\` For \`avg\` and cardinality \`rollup_method\` - specify the measure or the facet name you want to use. - \`time_window\` #m (between 1 and 2880), #h (between 1 and 48). - \`operator\` \`<\`, \`<=\`, \`>\`, \`>=\`, \`==\`, or \`!=\`. - \`#\` an integer or decimal number used to set the threshold.  ##### Process Alert Query  Example: \`processes(search).over(tags).rollup('count').last(timeframe) operator #\`  - \`search\` free text search string for querying processes. Matching processes match results on the [Live Processes](https://docs.datadoghq.com/infrastructure/process/?tab=linuxwindows) page. - \`tags\` one or more tags (comma-separated) - \`timeframe\` the timeframe to roll up the counts. Examples: 10m, 4h. Supported timeframes: s, m, h and d - \`operator\` <, <=, >, >=, ==, or != - \`#\` an integer or decimal number used to set the threshold  ##### Logs Alert Query  Example: \`logs(query).index(index_name).rollup(rollup_method[, measure]).last(time_window) operator #\`  - \`query\` The search query - following the [Log search syntax](https://docs.datadoghq.com/logs/search_syntax/). - \`index_name\` For multi-index organizations, the log index in which the request is performed. - \`rollup_method\` The stats roll-up method - supports \`count\`, \`avg\` and \`cardinality\`. - \`measure\` For \`avg\` and cardinality \`rollup_method\` - specify the measure or the facet name you want to use. - \`time_window\` #m (between 1 and 2880), #h (between 1 and 48). - \`operator\` \`<\`, \`<=\`, \`>\`, \`>=\`, \`==\`, or \`!=\`. - \`#\` an integer or decimal number used to set the threshold.  ##### Composite Query  Example: \`12345 && 67890\`, where \`12345\` and \`67890\` are the IDs of non-composite monitors  * \`name\` [*required*, *default* = **dynamic, based on query**]: The name of the alert. * \`message\` [*required*, *default* = **dynamic, based on query**]: A message to include with notifications for this monitor. Email notifications can be sent to specific users by using the same '@username' notation as events. * \`tags\` [*optional*, *default* = **empty list**]: A list of tags to associate with your monitor. When getting all monitor details via the API, use the \`monitor_tags\` argument to filter results by these tags. It is only available via the API and isn't visible or editable in the Datadog UI.  ##### SLO Alert Query  Example: \`error_budget("slo_id").over("time_window") operator #\`  - \`slo_id\`: The alphanumeric SLO ID of the SLO you are configuring the alert for. - \`time_window\`: The time window of the SLO target you wish to alert on. Valid options: \`7d\`, \`30d\`, \`90d\`. - \`operator\`: \`>=\` or \`>\`  ##### Audit Alert Query  Example: \`audits(query).rollup(rollup_method[, measure]).last(time_window) operator #\`  - \`query\` The search query - following the [Log search syntax](https://docs.datadoghq.com/logs/search_syntax/). - \`rollup_method\` The stats roll-up method - supports \`count\`, \`avg\` and \`cardinality\`. - \`measure\` For \`avg\` and cardinality \`rollup_method\` - specify the measure or the facet name you want to use. - \`time_window\` #m (between 1 and 2880), #h (between 1 and 48). - \`operator\` \`<\`, \`<=\`, \`>\`, \`>=\`, \`==\`, or \`!=\`. - \`#\` an integer or decimal number used to set the threshold.  ##### CI Pipelines Alert Query  Example: \`ci-pipelines(query).rollup(rollup_method[, measure]).last(time_window) operator #\`  - \`query\` The search query - following the [Log search syntax](https://docs.datadoghq.com/logs/search_syntax/). - \`rollup_method\` The stats roll-up method - supports \`count\`, \`avg\`, and \`cardinality\`. - \`measure\` For \`avg\` and cardinality \`rollup_method\` - specify the measure or the facet name you want to use. - \`time_window\` #m (between 1 and 2880), #h (between 1 and 48). - \`operator\` \`<\`, \`<=\`, \`>\`, \`>=\`, \`==\`, or \`!=\`. - \`#\` an integer or decimal number used to set the threshold.  ##### CI Tests Alert Query  Example: \`ci-tests(query).rollup(rollup_method[, measure]).last(time_window) operator #\`  - \`query\` The search query - following the [Log search syntax](https://docs.datadoghq.com/logs/search_syntax/). - \`rollup_method\` The stats roll-up method - supports \`count\`, \`avg\`, and \`cardinality\`. - \`measure\` For \`avg\` and cardinality \`rollup_method\` - specify the measure or the facet name you want to use. - \`time_window\` #m (between 1 and 2880), #h (between 1 and 48). - \`operator\` \`<\`, \`<=\`, \`>\`, \`>=\`, \`==\`, or \`!=\`. - \`#\` an integer or decimal number used to set the threshold.  ##### Error Tracking Alert Query  "New issue" example: \`error-tracking(query).source(issue_source).new().rollup(rollup_method[, measure]).by(group_by).last(time_window) operator #\` "High impact issue" example: \`error-tracking(query).source(issue_source).impact().rollup(rollup_method[, measure]).by(group_by).last(time_window) operator #\`  - \`query\` The search query - following the [Log search syntax](https://docs.datadoghq.com/logs/search_syntax/). - \`issue_source\` The issue source - supports \`all\`, \`browser\`, \`mobile\` and \`backend\` and defaults to \`all\` if omitted. - \`rollup_method\` The stats roll-up method - supports \`count\`, \`avg\`, and \`cardinality\` and defaults to \`count\` if omitted. - \`measure\` For \`avg\` and cardinality \`rollup_method\` - specify the measure or the facet name you want to use. - \`group by\` Comma-separated list of attributes to group by - should contain at least \`issue.id\`. - \`time_window\` #m (between 1 and 2880), #h (between 1 and 48). - \`operator\` \`<\`, \`<=\`, \`>\`, \`>=\`, \`==\`, or \`!=\`. - \`#\` an integer or decimal number used to set the threshold.  **Database Monitoring Alert Query**  Example: \`database-monitoring(query).rollup(rollup_method[, measure]).last(time_window) operator #\`  - \`query\` The search query - following the [Log search syntax](https://docs.datadoghq.com/logs/search_syntax/). - \`rollup_method\` The stats roll-up method - supports \`count\`, \`avg\`, and \`cardinality\`. - \`measure\` For \`avg\` and cardinality \`rollup_method\` - specify the measure or the facet name you want to use. - \`time_window\` #m (between 1 and 2880), #h (between 1 and 48). - \`operator\` \`<\`, \`<=\`, \`>\`, \`>=\`, \`==\`, or \`!=\`. - \`#\` an integer or decimal number used to set the threshold.  **Network Performance Alert Query**  Example: \`network-performance(query).rollup(rollup_method[, measure]).last(time_window) operator #\`  - \`query\` The search query - following the [Log search syntax](https://docs.datadoghq.com/logs/search_syntax/). - \`rollup_method\` The stats roll-up method - supports \`count\`, \`avg\`, and \`cardinality\`. - \`measure\` For \`avg\` and cardinality \`rollup_method\` - specify the measure or the facet name you want to use. - \`time_window\` #m (between 1 and 2880), #h (between 1 and 48). - \`operator\` \`<\`, \`<=\`, \`>\`, \`>=\`, \`==\`, or \`!=\`. - \`#\` an integer or decimal number used to set the threshold.  **Cost Alert Query**  Example: \`formula(query).timeframe_type(time_window).function(parameter) operator #\`  - \`query\` The search query - following the [Log search syntax](https://docs.datadoghq.com/logs/search_syntax/). - \`timeframe_type\` The timeframe type to evaluate the cost         - for \`forecast\` supports \`current\`         - for \`change\`, \`anomaly\`, \`threshold\` supports \`last\` - \`time_window\` - supports daily roll-up e.g. \`7d\` - \`function\` - [optional, defaults to \`threshold\` monitor if omitted] supports \`change\`, \`anomaly\`, \`forecast\` - \`parameter\` Specify the parameter of the type     - for \`change\`:         - supports \`relative\`, \`absolute\`         - [optional] supports \`#\`, where \`#\` is an integer or decimal number used to set the threshold     - for \`anomaly\`:         - supports \`direction=both\`, \`direction=above\`, \`direction=below\`         - [optional] supports \`threshold=#\`, where \`#\` is an integer or decimal number used to set the threshold - \`operator\`     - for \`threshold\` supports \`<\`, \`<=\`, \`>\`, \`>=\`, \`==\`, or \`!=\`     - for \`change\` supports \`>\`, \`<\`     - for \`anomaly\` supports \`>=\`     - for \`forecast\` supports \`>\` - \`#\` an integer or decimal number used to set the threshold.`,
  category: "Monitor",

  inputs: {
    default: {
      config: {
        created: {
          name: "Created",
          description: `Timestamp of the monitor creation.`,
          type: {
            "type": "string"
          },
          required: false,
        },
        creator: {
          name: "Creator",
          description: `Creator parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        deleted: {
          name: "Deleted",
          description: `Whether or not the monitor is deleted. (Always \`null\`)`,
          type: {
            "type": "string"
          },
          required: false,
        },
        draftStatus: {
          name: "Draft Status",
          description: `Draft Status parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        id: {
          name: "Id",
          description: `ID of this monitor.`,
          type: {
            "type": "number"
          },
          required: false,
        },
        matchingDowntimes: {
          name: "Matching Downtimes",
          description: `A list of active v1 downtimes that match this monitor.`,
          type: {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          required: false,
        },
        message: {
          name: "Message",
          description: `A message to include with notifications for this monitor.`,
          type: {
            "type": "string"
          },
          required: false,
        },
        modified: {
          name: "Modified",
          description: `Last timestamp when the monitor was edited.`,
          type: {
            "type": "string"
          },
          required: false,
        },
        multi: {
          name: "Multi",
          description: `Whether or not the monitor is broken down on different groups.`,
          type: {
            "type": "boolean"
          },
          required: false,
        },
        name: {
          name: "Name",
          description: `The monitor name.`,
          type: {
            "type": "string",
            "example": "My monitor"
          },
          required: false,
        },
        options: {
          name: "Options",
          description: `Options parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        overallState: {
          name: "Overall State",
          description: `Overall State parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        priority: {
          name: "Priority",
          description: `Integer from 1 (high) to 5 (low) indicating alert severity.`,
          type: {
            "type": "number"
          },
          required: false,
        },
        query: {
          name: "Query",
          description: `The monitor query.`,
          type: {
            "type": "string",
            "example": "avg(last_5m):sum:system.net.bytes_rcvd{host:host0} > 100"
          },
          required: true,
        },
        restrictedRoles: {
          name: "Restricted Roles",
          description: `A list of unique role identifiers to define which roles are allowed to edit the monitor. The unique identifiers for all roles can be pulled from the [Roles API](https://docs.datadoghq.com/api/latest/roles/#list-roles) and are located in the \`data.id\` field. Editing a monitor includes any updates to the monitor configuration, monitor deletion, and muting of the monitor for any amount of time. You can use the [Restriction Policies API](https://docs.datadoghq.com/api/latest/restriction-policies/) to manage write authorization for individual monitors by teams and users, in addition to roles.`,
          type: {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          required: false,
        },
        state: {
          name: "State",
          description: `State parameter`,
          type: {
            "type": "string"
          },
          required: false,
        },
        tags: {
          name: "Tags",
          description: `Tags associated to your monitor.`,
          type: {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          required: false,
        },
        type: {
          name: "Type",
          description: `Type parameter`,
          type: {
            "type": "string"
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { created, creator, deleted, draftStatus, id, matchingDowntimes, message, modified, multi, name, options, overallState, priority, query, restrictedRoles, state, tags, type } = input.event.inputConfig;
        const apiKey = input.app.config.apiKey as string;
        const appKey = input.app.config.appKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        const url = `${baseUrl}/api/v1/monitor`;
        const requestPayload: any = {};
        if (created !== undefined) requestPayload.created = created;
        if (creator !== undefined) requestPayload.creator = creator;
        if (deleted !== undefined) requestPayload.deleted = deleted;
        if (draftStatus !== undefined) requestPayload.draft_status = draftStatus;
        if (id !== undefined) requestPayload.id = id;
        if (matchingDowntimes !== undefined) requestPayload.matching_downtimes = matchingDowntimes;
        if (message !== undefined) requestPayload.message = message;
        if (modified !== undefined) requestPayload.modified = modified;
        if (multi !== undefined) requestPayload.multi = multi;
        if (name !== undefined) requestPayload.name = name;
        if (options !== undefined) requestPayload.options = options;
        if (overallState !== undefined) requestPayload.overall_state = overallState;
        if (priority !== undefined) requestPayload.priority = priority;
        requestPayload.query = query;
        if (restrictedRoles !== undefined) requestPayload.restricted_roles = restrictedRoles;
        if (state !== undefined) requestPayload.state = state;
        if (tags !== undefined) requestPayload.tags = tags;
        requestPayload.type = type;
        
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "DD-API-KEY": apiKey,
            "DD-APPLICATION-KEY": appKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to create a monitor: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        
        await events.emit({
          result,
          operation: "create"
        });
      },
    },
  },

  outputs: {
    default: {
      name: "Created Monitor",
      description: `The created monitor object`,
      default: true,
      type: {
        type: "object",
        properties: {
          created: { type: "string" },
          creator: { type: "string" },
          deleted: { type: "string" },
          draft_status: { type: "string" },
          id: { type: "number" },
          matching_downtimes: { type: "array", items: { type: "string" } },
          message: { type: "string" },
          modified: { type: "string" },
          multi: { type: "boolean" },
          name: { type: "string" },
          options: { type: "string" },
          overall_state: { type: "string" },
          priority: { type: "number" },
          query: { type: "string" },
          restricted_roles: { type: "array", items: { type: "string" } },
          state: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
          type: { type: "string" }
        },
        required: ["type", "query"]
      },
    },
  },
};
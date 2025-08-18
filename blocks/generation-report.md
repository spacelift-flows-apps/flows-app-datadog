# DataDog API Block Generation Report

Generated on: 2025-08-18T13:20:13.918Z
Total blocks: 45

## Summary by Category

### Monitor (11 blocks)
- ListMonitorsV1 (GET /api/v1/monitor)
- CreateMonitorV1 (POST /api/v1/monitor)
- CheckCanDeleteMonitorV1 (GET /api/v1/monitor/can_delete)
- SearchMonitorsV1 (GET /api/v1/monitor/search)
- ValidateMonitorV1 (POST /api/v1/monitor/validate)
- GetMonitorV1 (GET /api/v1/monitor/{monitor_id})
- UpdateMonitorV1 (PUT /api/v1/monitor/{monitor_id})
- DeleteMonitorV1 (DELETE /api/v1/monitor/{monitor_id})
- ValidateExistingMonitorV1 (POST /api/v1/monitor/{monitor_id}/validate)
- ValidateMonitorUserTemplateV2 (POST /api/v2/monitor/template/validate)
- ValidateExistingMonitorUserTemplateV2 (POST /api/v2/monitor/template/{template_id}/validate)

### MonitorGroups (1 blocks)
- SearchMonitorGroupsV1 (GET /api/v1/monitor/groups/search)

### MonitorDowntimes (2 blocks)
- ListMonitorDowntimesV1 (GET /api/v1/monitor/{monitor_id}/downtimes)
- ListMonitorDowntimesV2 (GET /api/v2/monitor/{monitor_id}/downtime_matches)

### AuditLogs (2 blocks)
- ListAuditLogsV2 (GET /api/v2/audit/events)
- SearchAuditLogsV2 (POST /api/v2/audit/events/search)

### CIAppPipelineEvents (2 blocks)
- ListCIAppPipelineEventsV2 (GET /api/v2/ci/pipelines/events)
- SearchCIAppPipelineEventsV2 (POST /api/v2/ci/pipelines/events/search)

### CIAppTestEvents (2 blocks)
- ListCIAppTestEventsV2 (GET /api/v2/ci/tests/events)
- SearchCIAppTestEventsV2 (POST /api/v2/ci/tests/events/search)

### Event (4 blocks)
- ListEventsV2 (GET /api/v2/events)
- CreateEventV2 (POST /api/v2/events)
- SearchEventsV2 (POST /api/v2/events/search)
- GetEventV2 (GET /api/v2/events/{event_id})

### LogsGet (1 blocks)
- ListLogsGetV2 (GET /api/v2/logs/events)

### Log (1 blocks)
- ListLogsV2 (POST /api/v2/logs/events/search)

### MonitorNotificationRules (1 blocks)
- GetMonitorNotificationRulesV2 (GET /api/v2/monitor/notification_rule)

### MonitorNotificationRule (4 blocks)
- CreateMonitorNotificationRuleV2 (POST /api/v2/monitor/notification_rule)
- GetMonitorNotificationRuleV2 (GET /api/v2/monitor/notification_rule/{rule_id})
- DeleteMonitorNotificationRuleV2 (DELETE /api/v2/monitor/notification_rule/{rule_id})
- UpdateMonitorNotificationRuleV2 (PATCH /api/v2/monitor/notification_rule/{rule_id})

### MonitorConfigPolicies (1 blocks)
- ListMonitorConfigPoliciesV2 (GET /api/v2/monitor/policy)

### MonitorConfigPolicy (4 blocks)
- CreateMonitorConfigPolicyV2 (POST /api/v2/monitor/policy)
- GetMonitorConfigPolicyV2 (GET /api/v2/monitor/policy/{policy_id})
- DeleteMonitorConfigPolicyV2 (DELETE /api/v2/monitor/policy/{policy_id})
- UpdateMonitorConfigPolicyV2 (PATCH /api/v2/monitor/policy/{policy_id})

### MonitorUserTemplates (1 blocks)
- ListMonitorUserTemplatesV2 (GET /api/v2/monitor/template)

### MonitorUserTemplate (4 blocks)
- CreateMonitorUserTemplateV2 (POST /api/v2/monitor/template)
- GetMonitorUserTemplateV2 (GET /api/v2/monitor/template/{template_id})
- UpdateMonitorUserTemplateV2 (PUT /api/v2/monitor/template/{template_id})
- DeleteMonitorUserTemplateV2 (DELETE /api/v2/monitor/template/{template_id})

### RUMEvents (2 blocks)
- ListRUMEventsV2 (GET /api/v2/rum/events)
- SearchRUMEventsV2 (POST /api/v2/rum/events/search)

### SpansGet (1 blocks)
- ListSpansGetV2 (GET /api/v2/spans/events)

### Spans (1 blocks)
- ListSpansV2 (POST /api/v2/spans/events/search)

## Summary by HTTP Method

### GET (21 blocks)
- ListMonitorsV1
- CheckCanDeleteMonitorV1
- SearchMonitorGroupsV1
- SearchMonitorsV1
- GetMonitorV1
- ListMonitorDowntimesV1
- ListAuditLogsV2
- ListCIAppPipelineEventsV2
- ListCIAppTestEventsV2
- ListEventsV2
- GetEventV2
- ListLogsGetV2
- GetMonitorNotificationRulesV2
- GetMonitorNotificationRuleV2
- ListMonitorConfigPoliciesV2
- GetMonitorConfigPolicyV2
- ListMonitorUserTemplatesV2
- GetMonitorUserTemplateV2
- ListMonitorDowntimesV2
- ListRUMEventsV2
- ListSpansGetV2

### POST (16 blocks)
- CreateMonitorV1
- ValidateMonitorV1
- ValidateExistingMonitorV1
- SearchAuditLogsV2
- SearchCIAppPipelineEventsV2
- SearchCIAppTestEventsV2
- CreateEventV2
- SearchEventsV2
- ListLogsV2
- CreateMonitorNotificationRuleV2
- CreateMonitorConfigPolicyV2
- CreateMonitorUserTemplateV2
- ValidateMonitorUserTemplateV2
- ValidateExistingMonitorUserTemplateV2
- SearchRUMEventsV2
- ListSpansV2

### PUT (2 blocks)
- UpdateMonitorV1
- UpdateMonitorUserTemplateV2

### DELETE (4 blocks)
- DeleteMonitorV1
- DeleteMonitorNotificationRuleV2
- DeleteMonitorConfigPolicyV2
- DeleteMonitorUserTemplateV2

### PATCH (2 blocks)
- UpdateMonitorNotificationRuleV2
- UpdateMonitorConfigPolicyV2

## All Generated Blocks

- **ListMonitorsV1** (`GET /api/v1/monitor`) - Monitor
- **CreateMonitorV1** (`POST /api/v1/monitor`) - Monitor
- **CheckCanDeleteMonitorV1** (`GET /api/v1/monitor/can_delete`) - Monitor
- **SearchMonitorGroupsV1** (`GET /api/v1/monitor/groups/search`) - MonitorGroups
- **SearchMonitorsV1** (`GET /api/v1/monitor/search`) - Monitor
- **ValidateMonitorV1** (`POST /api/v1/monitor/validate`) - Monitor
- **GetMonitorV1** (`GET /api/v1/monitor/{monitor_id}`) - Monitor
- **UpdateMonitorV1** (`PUT /api/v1/monitor/{monitor_id}`) - Monitor
- **DeleteMonitorV1** (`DELETE /api/v1/monitor/{monitor_id}`) - Monitor
- **ListMonitorDowntimesV1** (`GET /api/v1/monitor/{monitor_id}/downtimes`) - MonitorDowntimes
- **ValidateExistingMonitorV1** (`POST /api/v1/monitor/{monitor_id}/validate`) - Monitor
- **ListAuditLogsV2** (`GET /api/v2/audit/events`) - AuditLogs
- **SearchAuditLogsV2** (`POST /api/v2/audit/events/search`) - AuditLogs
- **ListCIAppPipelineEventsV2** (`GET /api/v2/ci/pipelines/events`) - CIAppPipelineEvents
- **SearchCIAppPipelineEventsV2** (`POST /api/v2/ci/pipelines/events/search`) - CIAppPipelineEvents
- **ListCIAppTestEventsV2** (`GET /api/v2/ci/tests/events`) - CIAppTestEvents
- **SearchCIAppTestEventsV2** (`POST /api/v2/ci/tests/events/search`) - CIAppTestEvents
- **ListEventsV2** (`GET /api/v2/events`) - Event
- **CreateEventV2** (`POST /api/v2/events`) - Event
- **SearchEventsV2** (`POST /api/v2/events/search`) - Event
- **GetEventV2** (`GET /api/v2/events/{event_id}`) - Event
- **ListLogsGetV2** (`GET /api/v2/logs/events`) - LogsGet
- **ListLogsV2** (`POST /api/v2/logs/events/search`) - Log
- **GetMonitorNotificationRulesV2** (`GET /api/v2/monitor/notification_rule`) - MonitorNotificationRules
- **CreateMonitorNotificationRuleV2** (`POST /api/v2/monitor/notification_rule`) - MonitorNotificationRule
- **GetMonitorNotificationRuleV2** (`GET /api/v2/monitor/notification_rule/{rule_id}`) - MonitorNotificationRule
- **DeleteMonitorNotificationRuleV2** (`DELETE /api/v2/monitor/notification_rule/{rule_id}`) - MonitorNotificationRule
- **UpdateMonitorNotificationRuleV2** (`PATCH /api/v2/monitor/notification_rule/{rule_id}`) - MonitorNotificationRule
- **ListMonitorConfigPoliciesV2** (`GET /api/v2/monitor/policy`) - MonitorConfigPolicies
- **CreateMonitorConfigPolicyV2** (`POST /api/v2/monitor/policy`) - MonitorConfigPolicy
- **GetMonitorConfigPolicyV2** (`GET /api/v2/monitor/policy/{policy_id}`) - MonitorConfigPolicy
- **DeleteMonitorConfigPolicyV2** (`DELETE /api/v2/monitor/policy/{policy_id}`) - MonitorConfigPolicy
- **UpdateMonitorConfigPolicyV2** (`PATCH /api/v2/monitor/policy/{policy_id}`) - MonitorConfigPolicy
- **ListMonitorUserTemplatesV2** (`GET /api/v2/monitor/template`) - MonitorUserTemplates
- **CreateMonitorUserTemplateV2** (`POST /api/v2/monitor/template`) - MonitorUserTemplate
- **ValidateMonitorUserTemplateV2** (`POST /api/v2/monitor/template/validate`) - Monitor
- **GetMonitorUserTemplateV2** (`GET /api/v2/monitor/template/{template_id}`) - MonitorUserTemplate
- **UpdateMonitorUserTemplateV2** (`PUT /api/v2/monitor/template/{template_id}`) - MonitorUserTemplate
- **DeleteMonitorUserTemplateV2** (`DELETE /api/v2/monitor/template/{template_id}`) - MonitorUserTemplate
- **ValidateExistingMonitorUserTemplateV2** (`POST /api/v2/monitor/template/{template_id}/validate`) - Monitor
- **ListMonitorDowntimesV2** (`GET /api/v2/monitor/{monitor_id}/downtime_matches`) - MonitorDowntimes
- **ListRUMEventsV2** (`GET /api/v2/rum/events`) - RUMEvents
- **SearchRUMEventsV2** (`POST /api/v2/rum/events/search`) - RUMEvents
- **ListSpansGetV2** (`GET /api/v2/spans/events`) - SpansGet
- **ListSpansV2** (`POST /api/v2/spans/events/search`) - Spans

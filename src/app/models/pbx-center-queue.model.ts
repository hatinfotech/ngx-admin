export class PbxCallCenterQueueModel {

  call_center_queue_uuid?: string;
  domain_uuid?: string;
  dialplan_uuid?: string;
  queue_name: string;
  queue_extension: string;
  queue_greeting?: string;
  queue_strategy?: string;
  queue_moh_sound?: string;
  queue_record_template?: boolean;
  queue_time_base_score?: string;
  queue_max_wait_time?: number;
  queue_max_wait_time_with_no_agent?: number;
  queue_max_wait_time_with_no_agent_time_reached?: number;
  queue_tier_rules_apply?: boolean;
  queue_tier_rule_wait_second?: number;
  queue_tier_rule_no_agent_no_wait?: string;
  queue_timeout_action?: string;
  queue_discard_abandoned_after?: string;
  queue_abandoned_resume_allowed?: boolean;
  queue_tier_rule_wait_multiply_level?: string;
  queue_cid_prefix?: string;
  queue_announce_sound?: string;
  queue_announce_frequency?: string;
  queue_cc_exit_keys?: string;
  queue_description?: string;

  constructor() { }

}

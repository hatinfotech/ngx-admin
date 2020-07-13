export class PbxCallCenterAgentModel {

  call_center_agent_uuid?: string;
  domain_uuid?: string;
  user_uuid?: string;
  agent_name: string;
  agent_type?: string;
  agent_call_timeout?: number;
  agent_id?: string;
  agent_password?: string;
  agent_contact: string;
  agent_status?: string;
  agent_logout?: string;
  agent_max_no_answer?: number;
  agent_wrap_up_time?: number;
  agent_reject_delay_time?: number;
  agent_busy_delay_time?: number;
  agent_no_answer_delay_time?: number;

  constructor() { }

}

export class PbxUserModel {

  user_uuid?: string;
  domain_uuid?: string;
  domain_name?: string;
  username: string;
  password?: string;
  user_enabled?: boolean;
  add_date?: string;
  contact_uuid?: string;
  contact_organization?: string;
  contact_name_given: string;
  contact_name_family?: string;
  user_email?: string;
  user_status?: string;
  user_language?: string;
  user_time_zone?: string;
  groups?: string[];
  group_level?: number;
  api_key?: string;
  message_key?: string;

  constructor() { }

}

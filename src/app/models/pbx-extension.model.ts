import { PbxDeviceModel } from './pbx-device.model';

export class PbxExtensionModel {

  extension_uuid?: string;
  domain_uuid?: string;
  extension?: string;
  number_alias?: string;
  password?: string;
  accountcode?: string;
  effective_caller_id_name?: string;
  effective_caller_id_number?: string;
  outbound_caller_id_name?: string;
  outbound_caller_id_number?: string;
  emergency_caller_id_name?: string;
  emergency_caller_id_number?: string;
  directory_first_name?: string;
  directory_last_name?: string;
  directory_visible?: string;
  directory_exten_visible?: string;
  limit_max?: string;
  limit_destination?: string;
  missed_call_app?: string;
  missed_call_data?: string;
  user_context?: string;
  toll_allow?: string;
  call_timeout?: string;
  call_group?: string;
  call_screen_enabled?: string;
  user_record?: string;
  hold_music?: string;
  auth_acl?: string;
  cidr?: string;
  sip_force_contact?: string;
  nibble_account?: string;
  sip_force_expires?: string;
  mwi_account?: string;
  sip_bypass_media?: string;
  unique_id?: string;
  dial_string?: string;
  dial_user?: string;
  dial_domain?: string;
  do_not_disturb?: string;
  forward_all_destination?: string;
  forward_all_enabled?: string;
  forward_busy_destination?: string;
  forward_busy_enabled?: string;
  forward_no_answer_destination?: string;
  forward_no_answer_enabled?: string;
  forward_user_not_registered_destination?: string;
  forward_user_not_registered_enabled?: string;
  follow_me_uuid?: string;
  forward_caller_id_uuid?: string;
  follow_me_enabled?: string;
  follow_me_destinations?: string;
  enabled?: string;
  description?: string;
  absolute_codec_string?: string;
  force_ping?: string;
  devices: PbxDeviceModel[];

  constructor() { }

}

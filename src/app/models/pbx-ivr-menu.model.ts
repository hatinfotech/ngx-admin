import { PbxDomainModel } from './pbx-domain.model';
import { PbxDialplanDetailModel } from './pbx-dialplan-detail.model';
import { PbxIvrMenuOptionModel } from './pbx-ivr-menu-option.model';

export class PbxIvrMenuModel {

  ivr_menu_uuid?: string;
  domain_uuid?: string;
  dialplan_uuid?: string;
  ivr_menu_name: string;
  ivr_menu_extension: string;
  ivr_menu_language?: string;
  ivr_menu_greet_long?: string;
  ivr_menu_greet_short?: string;
  ivr_menu_invalid_sound?: string;
  ivr_menu_exit_sound?: string;
  ivr_menu_confirm_macro?: string;
  ivr_menu_confirm_key?: string;
  ivr_menu_tts_engine?: string;
  ivr_menu_tts_voice?: string;
  ivr_menu_confirm_attempts?: string;
  ivr_menu_timeout?: number;
  ivr_menu_exit_app?: string;
  ivr_menu_exit_data?: string;
  ivr_menu_inter_digit_timeout?: number;
  ivr_menu_max_failures?: string;
  ivr_menu_max_timeouts?: number;
  ivr_menu_digit_len?: number;
  ivr_menu_direct_dial?: boolean;
  ivr_menu_ringback?: string;
  ivr_menu_cid_prefix?: string;
  ivr_menu_context?: string;
  ivr_menu_enabled?: boolean;
  ivr_menu_description?: string;
  ivr_menu_options?: PbxIvrMenuOptionModel[];


  constructor() { }

}

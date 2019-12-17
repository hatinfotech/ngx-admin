import { PbxDialplanDetailModel } from './pbx-dialplan-detail.model';

export class PbxPstnNumberModel {

  domain_uuid?: string;
  destination_uuid?: string;
  dialplan_uuid?: string;
  fax_uuid?: string;
  destination_type?: string;
  destination_number: string;
  destination_prefix?: string;
  destination_number_regex?: string;
  destination_caller_id_name?: string;
  destination_caller_id_number?: string;
  destination_cid_name_prefix?: string;
  destination_context?: string;
  destination_record?: string;
  destination_accountcode?: string;
  destination_type_voice?: string;
  destination_type_fax?: string;
  destination_type_text?: string;
  destination_app?: string;
  destination_data?: string;
  destination_alternate_app?: string;
  destination_alternate_data?: string;
  destination_enabled?: string;
  destination_description?: string;
  dialplan_details: PbxDialplanDetailModel[];

  constructor() { }

}

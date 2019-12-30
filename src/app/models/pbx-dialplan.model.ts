import { PbxDialplanDetailModel } from './pbx-dialplan-detail.model';

export class PbxDialplanModel {

  domain_uuid?: string;
  dialplan_uuid?: string;
  dialplan_type?: string;
  dialplan_name?: string;
  dialplan_gateway?: string;
  dialplan_regex?: string;
  app_uuid?: string;
  hostname?: string;
  dialplan_context?: string;
  Platfdialplan_nameorm?: string;
  dialplan_number?: string;
  dialplan_destination?: string;
  dialplan_continue?: string;
  dialplan_xml?: string;
  dialplan_order?: number;
  dialplan_enabled?: boolean;
  dialplan_description?: string;
  dialplan_details?: PbxDialplanDetailModel[];


  constructor() { }

}

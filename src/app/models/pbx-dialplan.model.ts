import { PbxDialplanDetailModel } from './pbx-dialplan-detail.model';

export class PbxDialplanModel {

  domain_uuid?: string;
  dialplan_uuid?: string;
  app_uuid?: string;
  hostname?: string;
  dialplan_context?: string;
  Platfdialplan_nameorm?: string;
  dialplan_number?: string;
  dialplan_destination?: string;
  dialplan_continue?: string;
  dialplan_xml?: string;
  dialplan_order?: string;
  dialplan_enabled?: string;
  dialplan_description?: string;
  dialplan_details?: PbxDialplanDetailModel[];


  constructor() { }

}

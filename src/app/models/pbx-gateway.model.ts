import { PbxDomainModel } from './pbx-domain.model';
import { PbxDialplanDetailModel } from './pbx-dialplan-detail.model';

export class PbxGatewayModel {

  gateway_uuid?: string;
  domain_uuid?: string;
  gateway: string;
  username?: string;
  password?: string;
  distinct_to?: string;
  auth_username?: string;
  realm?: string;
  from_user?: string;
  from_domain?: string;
  proxy?: string;
  register_proxy?: string;
  outbound_proxy?: string;
  expire_seconds?: string;
  register?: string;
  register_transport?: string;
  retry_seconds?: string;
  extension?: string;
  ping?: string;
  caller_id_in_from?: string;
  supress_cng?: string;
  sip_cid_type?: string;
  codec_prefs?: string;
  channels?: string;
  extension_in_contact?: string;
  context?: string;
  profile?: string;
  hostname?: string;
  enabled?: string;
  description?: string;

  constructor() { }

}

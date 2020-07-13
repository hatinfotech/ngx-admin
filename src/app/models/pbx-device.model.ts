export class PbxDeviceModel {

  device_uuid?: string;
  domain_uuid?: string;
  device_profile_uuid?: string;
  device_mac_address: string;
  device_label?: string;
  device_vendor?: string;
  device_model?: string;
  device_firmware_version?: string;
  device_enabled?: string;
  device_enabled_date?: string;
  device_template?: string;
  device_user_uuid?: string;
  device_username?: string;
  device_password?: string;
  device_uuid_alternate?: string;
  device_description?: string;
  device_provisioned_date?: string;
  device_provisioned_method?: string;
  device_provisioned_ip?: string;
  extension_uuid?: string;
  device_lines: {
    domain_uuid?: string,
    device_line_uuid?: string,
    device_uuid?: string,
    line_number?: string,
    server_address?: string,
    server_address_primary?: string,
    server_address_secondary?: string,
    outbound_proxy_primary?: string,
    outbound_proxy_secondary?: string,
    display_name?: string,
    user_id?: string,
    auth_id?: string,
    password?: string,
    sip_port?: string,
    sip_transport?: string,
    register_expires?: string,
    shared_line?: string,
    enabled?: string,
  }[];
  device_settings?: {
    device_setting_uuid?: string,
    device_uuid?: string,
    domain_uuid?: string,
    device_setting_category?: string,
    device_setting_subcategory?: string,
    device_setting_name?: string,
    device_setting_value?: string,
    device_setting_enabled?: string,
    device_setting_description?: string,
    device_profile_uuid?: string,
  }[];

  constructor() { }

}

export class WhDatabaseModel {

  database_id?: string;
  sys_userid?: string;
  sys_groupid?: string;
  sys_perm_user?: string;
  sys_perm_group?: string;
  sys_perm_other?: string;
  server_id?: string;
  parent_domain_id?: string;
  type?: string;
  database_name?: string;
  database_name_prefix?: string;
  database_quota?: string;
  quota_exceeded?: string;
  last_quota_notification?: string;
  database_user_id?: string;
  database_ro_user_id?: string;
  database_charset?: string;
  remote_access?: string;
  remote_ips?: string;
  backup_interval?: string;
  backup_copies?: string;
  active?: string;

  constructor() { }

}

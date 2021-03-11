export class WhCronJobModel {
  id?: string;
  sys_userid?: string;
  sys_groupid?: string;
  sys_perm_user?: string;
  sys_perm_group?: string;
  sys_perm_other?: string;
  server_id?: string;
  parent_domain_id?: string;
  type?: string;
  command?: string;
  run_min?: string;
  run_hour?: string;
  run_mday?: string;
  run_month?: string;
  run_wday?: string;
  log?: string;
  active?: string;

  constructor() { }

}

export class WpSiteModel {
  Code?: string;
  Name?: string;
  Description?: string;
  Domain?: string;
  BaseUrl?: string;
  ApiUrl?: string;
  ApiUsername?: string;
  ApiPassword?: string;
  ApiToken?: string;
  State?: string;
  SyncTargets?: WpSiteSyncTaget[];
}


export class WpSiteSyncTaget {
  Id?: string;
  WpSite?: string;
  TargetSite?: string;
  Resources?: {id: string, text: string}[];
  Active?: boolean;
}

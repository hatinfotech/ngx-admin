export class ZaloOaOfficialAccountModel {
  [key: string]: any;
  Id?: string | number;
  Code?: string;
  Name?: string;
  Description?: string;
  AppId?: number | string;
  AppName?: string;
  AppSecret?: string;
  AppDomain?: string;
  Status?: boolean;
  AccessToken?: string;
  AccessTokenExpired?: string;
  CallbackUrl?: string;
  ApiUrl?: string;
  WebhookUser?: string;
  WebhookToken?: string;
}

export class ZaloOaTemplateModel {
  [key: string]: any;
  Id?: string;
  Code?: string;
  Name?: string;
  ZaloOaId?: string;
  TemplateId?: string;
  Description?: string;
}
export class ZaloOaTemplateParameterModel {
  [key: string]: any;
  Id?: string;
  Template?: string;
  Name?: string;
  DataType?: string;
}
import { WpSiteModel } from './wordpress.model';

export class CrawlServerModel {
  Id?: string;
  Code?: string;
  Type?: string;
  Name?: string;
  Description?: string;
  ApiUrl?: string;
  ApiUsername?: string;
  ApiPassword?: string;
  ApiToken?: string;
  ApiVersion?: string;
}

export class CrawlPlanModel {
  Id?: number;
  Code?: string;
  Description?: string;
  TargetUrl?: string;
  TargetTitlePath?: string;
  TargetDescriptionPath?: string;
  TargetCreatedPath?: string;
  TargetCategoriesPath?: string;
  TargetFeatureImagePath?: string;
  TargetAuthorPath?: string;
  TargetContentPath?: string;
  TargetImageSrc?: string;
  ExcludeContentElements?: string;
  Frequency?: number;
  State?: string;
  Status?: string;

  Stores?: CrawlPlanStoreModel[];
  Bots?: CrawlPlanBotModel[];
}

export class CrawlPlanStoreModel {
  Id?: number;
  Plan?: string;
  Site?: string | WpSiteModel;
  Active?: boolean;
}

export class CrawlPlanBotModel {
  Id?: string;
  Plan?: string;
  Bot?: CrawlServerModel | string;
  IsMain?: boolean;
  Active?: boolean;
  Status?: string;
}


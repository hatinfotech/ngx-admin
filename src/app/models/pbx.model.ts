import { PbxDomainModel } from './pbx-domain.model';

export class PbxModel {

  Code?: string;
  Name: string;
  Description?: string;
  ApiUrl: string;
  ApiVersion?: string;
  // ApiKey: string;
  Platform?: string;
  Core?: string;
  Owner?: string;
  State?: string;
  Domains?: PbxDomainModel[];

  constructor() { }

}

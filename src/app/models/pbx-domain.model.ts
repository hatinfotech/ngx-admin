export class PbxDomainModel {

  // NaM Core properites
  Id?: number;
  DomainUuid?: string;
  DomainId?: string;
  DomainName?: string;
  Description?: string;
  AdminKey?: string;
  Pbx?: string;

  // pbx properties
  domain_uuid?: string;
  domain_parent_uuid?: string;
  domain_name: string;
  domain_enabled?: string;
  domain_description?: string;

  constructor() { }

}

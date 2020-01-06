export class PbxDomainModel {

  // NaM Core properites
  Id?: string;
  DomainUuid?: string;
  DomainId?: string;
  DomainName?: string;
  Description?: string;
  AdminKey?: string;
  Pbx?: string;
  Owner?: string;

  // pbx properties
  domain_uuid?: string;
  domain_parent_uuid?: string;
  domain_name: string;
  domain_enabled?: string;
  domain_description?: string;

  constructor() { }

}

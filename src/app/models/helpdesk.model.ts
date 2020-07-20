export class HelpdeskTicketModel {

  Id?: string;
  Type?: string;
  Code?: string;
  Title?: string;
  Description?: string;
  Object?: string;
  ObjectName?: string;
  ObjectBranch?: string;
  ObjectPhone?: string;
  ObjectEmail?: string;
  ObjectAddress?: string;
  OrganizationName?: string;
  OrganizationPhone?: string;
  OrganizationEmail?: string;
  OrganizationAddress?: string;
  Coordinator?: string;
  CoordinatorName?: string;
  CoordinatorPhone?: string;
  CoordinatorEmail?: string;
  WorkingName?: string;
  SupportedPerson?: string;
  SupportedPersonName?: string;
  SupportedPersonPhone?: string;
  SupportedPersonEmail?: string;
  SupportedPersonAddress?: string;
  TimeDuration?: string;
  DateOfStart?: string;
  State?: string;
  DateOfCreate?: string;
  DateOfUpdate?: string;
  DateOfComplete?: string;
  Creator?: string;
  ChatRoom?: string;
  LocalChatRoom?: string;
  AcceptBy?: string;
  Contract?: string;
  Latitude?: string;
  Longitude?: string;
  RequestIp?: string;
  SuggestObject?: string;
  ObjectType?: string;
  Service?: string;
  ObjectBranchBk?: string;
  CallSessionId?: string;


  constructor() { }

}

export class HelpdeskUserModel {
  id?: string;
  text?: string;
  Code?: string;
  Name?: string;
  Extensions?: HelpdeskUserExtensionModel[];
}

export class HelpdeskUserExtensionModel {
  id?: string;
  text?: string;
  User?: string | HelpdeskUserModel;
  Id?: string;
  Type?: string;
  Extension?: string;
  Host?: string;
  Pbx?: string;
  Port?: string;
  Domain?: string;
  Password?: string;
  Transport?: string;
  DisplayName?: string;

  get DoaminUuid() {
    return this.Domain + '@' + this.Pbx;
  }
}

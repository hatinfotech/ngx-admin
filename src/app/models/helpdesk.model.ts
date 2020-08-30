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
  State?: string & HelpdeskTicketStateModel;
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
  CallLog?: string;

  CallingSessions?: HelpdeskTicketCallingSessionModel[];

  [key: string]: any,

  Infos?: { [key: string]: any } & HelpdeskTicketInfoModel[];

  constructor() { }

}

export class HelpdeskTicketInfoModel {
  Id?: string;
  Ticket?: string & HelpdeskTicketModel;
  Name?: string;
  Data?: string;
}

export class HelpdeskTicketStateModel {
  id?: string; text?: string;
  Id?: string;
  Code?: string;
  Name?: string;
  Icon?: string;
  CoordinatorLabel?: string;
  Color?: string;
}

export class HelpdeskTicketCallingSessionModel {
  Id?: string;
  Ticket?: string;
  CallSession?: string;
  State?: string;
  DateOfCalling?: string;
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
  DomainUuid?: string;
  Password?: string;
  Transport?: string;
  DisplayName?: string;

  get DoaminUuid() {
    return this.Domain + '@' + this.Pbx;
  }
}

export class HelpdeskRouteModel {
  Id?: string;
  Code?: string;
  Name?: string;
  Description?: string;

  Conditions?: HelpdeskRouteConditionModel[];
  Actions?: HelpdeskRouteActionModel[];
}

export class HelpdeskRouteConditionModel {
  Id?: string;
  Route?: string;
  No?: string;
  Type?: string;
  Cond?: string;
  Operator?: string;
  Data?: string;
  BreakOnFalse?: string;
}

export class HelpdeskRouteActionModel {
  Id?: string;
  Route?: string;
  No?: string;
  Type?: string;
  Action?: string;
  Parameters?: HelpdeskRouteActionParameterModel[];
}

export class HelpdeskParamModel {
  id?: string; text?: string;
  Id?: string;
  Name?: string;
  Description?: string;
  DefaultDataType?: string;
  DefaultOperator?: string;
  RemoteDataSource?: string;
  RemoteDataResource?: string;

  Options?: HelpdeskParamOptionModel[];
}

export class HelpdeskParamOptionModel {
  Id?: string;
  Param?: string;
  Data?: string;
  Label?: string;
}

export class HelpdeskRouteActionParameterModel {
  Id?: string;
  Parameter?: string;
  Data?: string;
}

export class HelpdeskActionModel {
  Id?: string;
  Name?: string;
  Description?: string;
  Param?: string;
  SetValue?: string;
  ActionFunction?: string;

  Params?: HelpdeskActionParamModel[];
}

export class HelpdeskActionParamModel {
  Id?: string;
  Action?: string;
  Name?: string;
  Type?: string;
  Description?: string;
  RemoteDataSource?: string;
  RemoteDataResource?: string;

  Options?: HelpdeskActionParamOptionModel[];
}

export class HelpdeskActionParamOptionModel {
  Id?: string;
  Data?: string;
  Label?: string;
}

export class HelpdeskProcedureModel {
  Id?: string | number;
  Code?: string;
  Name?: string;
  Description?: string;
  DateOfCreated?: string;
  Creator?: string;
  State?: string;

  Steps?: HelpdeskProcedureStepModel[];
}

export class HelpdeskProcedureStepModel {
  Id?: string  | number;
  Procedure?: string & HelpdeskProcedureModel;
  No?: string;
  Title?: string;
  Description?: string;
}

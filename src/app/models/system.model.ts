export class SystemParameterModel {
  Id?: string & number;
  Name?: string;
  Type?: string;
  Value?: string;
  IsApplied?: boolean | string | number;
  Module?: string;
  InputType?: string;
  ExtendData?: string;
}

export class LocaleConfigModel {
  User?: string;
  LocaleCode?: string;
  Timezone?: string;
}

export class CurrencyConfigModel {
  User?: string;
  LocaleCode?: string;
  Timezone?: string;
}

export class SystemRouteModel {
  Id?: string;
  Code?: string;
  Name?: string;
  Description?: string;

  Conditions?: SystemRouteConditionModel[];
  Actions?: SystemRouteActionModel[];
}

export class SystemRouteConditionModel {
  Id?: string;
  Route?: string;
  No?: string;
  Type?: string;
  Cond?: string;
  Operator?: string;
  Data?: string;
  BreakOnFalse?: string;
}

export class SystemRouteActionModel {
  Id?: string;
  Route?: string;
  No?: string;
  Type?: string;
  Action?: string;
  Parameters?: SystemRouteActionParameterModel[];
}

export class SystemParamModel {
  id?: string; text?: string;
  Id?: string;
  Name?: string;
  Description?: string;
  DefaultDataType?: string;
  DefaultOperator?: string;
  RemoteDataSource?: string;
  RemoteDataResource?: string;

  Options?: SystemParamOptionModel[];
}

export class SystemParamOptionModel {
  Id?: string;
  Param?: string;
  Data?: string;
  Label?: string;
}

export class SystemRouteActionParameterModel {
  Id?: string;
  Action?: string & SystemActionModel;
  Route?: string & SystemRouteModel;
  Parameter?: string;
  Data?: string;
}

export class SystemActionModel {
  Id?: string;
  Name?: string;
  Description?: string;
  Param?: string;
  SetValue?: string;
  ActionFunction?: string;

  Params?: SystemActionParamModel[];
}

export class SystemActionParamModel {
  Id?: string;
  Action?: string;
  Name?: string;
  Type?: string;
  Description?: string;
  RemoteDataSource?: string;
  RemoteDataResource?: string;

  Options?: SystemActionParamOptionModel[];
}

export class SystemActionParamOptionModel {
  Id?: string;
  Data?: string;
  Label?: string;
}


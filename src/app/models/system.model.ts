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

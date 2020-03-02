export class SmsModel {
  Id?: string;
  SenderDeviceId?: string;
  SenderName?: string;
  SenderPhone?: string;
  Content?: string;
  OwnerId?: string;
  CreationDate?: string;
  SendingDate?: string;
  State?: string;
  Gateway?: SmsGatewayModel;

  // References
  Recipients: SmsReceipientModel[];
}

export class SmsReceipientModel {
  Id?: string;
  Sms?: string;
  Name?: string;
  Phone?: string;
  Contact?: string;
}

export class SmsTemplateModel {
  Id?: string;
  Code?: string;
  Name?: string;
  Content?: string;
  Parameter?: string;
  Module?: string;
}

export class SmsGatewayModel {
  Id?: string;
  Code?: string;
  Name?: string;
  ApiUrl?: string;
  Username?: string;
  Password?: string;
}

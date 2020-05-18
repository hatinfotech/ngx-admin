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
  Recipients?: SmsReceipientModel[];
  Brandname?: { id?: string, text?: string };
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
  Brandnames?: { id?: string, text?: string }[];
}

export class SmsPhoneNumberListModel {
  Id ?: number;
  Code ?: string;
  Name ?: string;
  Description ?: string;
  Owner ?: string;
  Creator ?: string;
  Created ?: string;
  Updated ?: string;
}

export class SmsPhoneNumberListDetailModel {
  Id ?: number;
  PhoneNumberList ?: string;
  PhoneNumber ?: string;
  Name ?: string;
  NumOfSent ?: string;
}


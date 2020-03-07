export class EmailModel {
  Id?: string;
  UId?: string;
  MailboxFolder?: string;
  FromConnector?: string;
  FromConnectorGroup?: string;
  SenderMailAddress?: string;
  SenderName?: string;
  ReplyToName?: string;
  ReplyToMailAddress?: string;
  Subject?: string;
  Content?: string;
  TextPlainContent?: string;
  SendingDate?: string;
  CreationDate?: string;
  OwnerId?: string;
  HeadersRaw?: string;
  MessageId?: string;
  State?: string;
  Type?: string;

  // References
  Recipients?: EmailRecipientModel[];
  Attachments?: EmailAttachmentModel[];
  Gateway?: EmailGatewayModel;
}

export class EmailAttachmentModel {
  Id?: string;
  Email?: EmailModel;
  Attachment?: string;
}

export class EmailRecipientModel {
  Id?: string;
  Email?: string;
  Name?: string;
  EmailAddress?: string;
  Type?: string;
  Contact?: string;
}

export class EmailGatewayModel {
  Id?: string;
  Code?: string;
  Name?: string;
  Description?: string;
  Type?: string;
  ApiUrl?: string;
  ApiToken?: string;
  SmtpHost?: string;
  SmtpPort?: string;
  SmtpTransport?: string;
  SmtpUsername?: string;
  SmtpPassword?: string;
  SmtpToken?: string;
  DefaultSenderName?: string;
  DefaultSenderEmail?: string;
}

export class EmailTemplateModel {
  Id?: string;
  Code?: string;
  Name?: string;
  Subject?: string;
  Content?: string;
  Parameter?: string;
}

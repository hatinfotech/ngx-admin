export class PriceReport {

  Code: string;
  Object: string;
  ObjectName: string;
  ObjectAddress: string;
  ObjectPhone: string;
  ObjectEmail: string;
  Recipient: string;
  ObjectTaxCode: string;
  ObjectBankCode: string;
  ObjectBankName: string;
  Title: string;
  Note: string;

  details: PriceReportDetail[];

  constructor() { }

}

export class PriceReportDetail {
  Product?: string;
  Description: string;
  Quantity: number;
  Price: number;
  Unit: string;
  Tax?: string;
  Image?: string;
  Reason?: string;
}

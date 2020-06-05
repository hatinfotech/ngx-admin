export class SalesVoucherModel {
  Id?: string & number;
  Code?: string;
  No?: string;
  Type?: string;
  Object?: string;
  ObjectName?: string;
  ObjectAddress?: string;
  ObjectPhone?: string;
  SalesStaff?: string;
  DateOfSale?: string;
  PromotePrograme?: string;
  PriceReportVoucher?: string;
  DateOfDelivery?: string;
  InvoiceAddress?: string;
  InvoiceLocation?: string;
  DeliveryAddress?: string;
  DeliveryLocation?: string;
  IsExportVatInvoice?: string;
  Note?: string;
  Tax?: string;
  CodeTax?: string;
  Created?: string;
  State?: string;
  Money?: string;
  Account?: string;
  PaidMoney?: string;
  IsPaid?: string;
  Branch?: string;
  InventoryDeliveryVoucher?: string;
  Invoice?: string;
  Creator?: string;
}

export class SalesPriceReportModel {
  Id?: string & number;
  SequenceNumber?: string;
  Code?: string;
  StoreId?: string;
  CustomerId?: string;
  Object?: string;
  ObjectName?: string;
  ObjectAddress?: string;
  ObjectPhone?: string;
  Branch?: string;
  Recipient?: string;
  Note?: string;
  IsIncludeVat?: string;
  Reported?: string;
  Created?: string;
  CreatorId?: string;
  StaffCreatorId?: string;
  Creator?: string;
  Approved?: string;
  IsApprove?: string;
  FileName?: string;
  AttachImageId?: string;
  Tax?: string;
  State?: string;
  Approver?: string;
  ApproverUser?: string;
  DeliveryLatitude?: string;
  DeliveryLongitude?: string;
  DirectReceiverName?: string;
  DeliveryAddress?: string;
  PaymentStep?: string;
  Title?: string;
  ObjectEmail?: string;
  ObjectTaxCode?: string;
  ObjectBankCode?: string;
  ObjectBankName?: string;

  // References
  Details?: SalesPriceReportDetailModel[];

}


export class SalesPriceReportDetailModel {
  Id?: string & number;
  No?: number;
  Product?: string;
  Description: string;
  Quantity: number;
  Price: number;
  Unit: string;
  Tax?: string;
  Image?: string;
  Reason?: string;
}

import { TaxModel } from './tax.model';
import { UnitModel } from './unit.model';
import { ProductModel } from './product.model';

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

  Details: SalesVoucherDetailModel[];
}

export class SalesVoucherDetailModel {
  Id?: string & number;
  Voucher?: string;
  PriceTableDetail?: string;
  Product?: string & ProductModel;
  ProductName?: string;
  Quantity?: string & number;
  Price?: string & number;
  Tax?: string & TaxModel;
  CurrencyType?: string;
  Unit?: string & UnitModel;

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
  Product?: string & ProductModel;
  Description: string;
  Quantity: number;
  Price: number & string;
  Unit: string & UnitModel;
  Tax?: string & TaxModel;
  Image?: string;
  Reason?: string;
}

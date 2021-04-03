import { TaxModel } from './tax.model';
import { UnitModel } from './unit.model';
import { ProductModel } from './product.model';
import { ContactModel } from './contact.model';
import { UserModel } from './user.model';

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
  Type?: string;
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
  Type?: string;
  Product?: string & ProductModel;
  Description: string;
  Quantity: number;
  Price: number & string;
  Unit: string & UnitModel;
  Tax?: string & TaxModel;
  Image?: string;
  Reason?: string;
}


export class SalesPriceTableModel {
  Id?: string & number;
  Code?: string;
  Parent?: string & SalesPriceTableModel;
  Title?: string;
  Branch?: string;
  CustomerGroup?: string;
  AppliedStartDate?: string;
  AppliedClosingDate?: string;
  Creator?: string;
  DateOfCreate?: string;
  DateOfUpdate?: string;
  IsApprove?: string;
  DateOfApprove?: string;
  Object?: string & ContactModel;
  File?: string;
  Contract?: string;
  ObjectName?: string;
  ObjectPhone?: string;
  ObjectEmail?: string;
  ObjectAddress?: string;
  Tax?: string & TaxModel;
  Description?: string;
  PrintTemplate?: string;

  Details?: SalesPriceTableDetailModel[];
}

export class SalesPriceTableDetailModel {
  Id?: string;
  No?: string | number;
  PriceTable?: string;
  Product?: string | ProductModel;
  Name?: string;
  PriceDefinition?: string;
  Price?: string | number;
  DateOfUpdate?: string;
  Tax?: string & TaxModel;
  Note?: string;
  TempPrice?: string;
  Unit?: string | UnitModel | { id?: string, text?: string };
  Type?: string;
  Sku?: string;
  FeaturePictureThumbnail?: string;
  FeaturePictureMedium?: string;
  FeaturePictureLarge?: string;
}


export class SalesMasterPriceTableModel {
  Id?: string & number;
  Code?: string;
  Type?: string;
  Title?: string;
  Description?: string;
  Object?: String & ContactModel;
  ObjectName?: string;
  ObjectPhone?: string;
  ObjectAddress?: string;
  ObjectEmailAddress?: string;
  Approved?: string | boolean;
  DateOfApproved?: String & Date;
  DateOfCreated?: String & Date;
  Creator?: String & UserModel;
  Tax?: String & TaxModel;
  Discount?: string;

  Details?: (SalesMasterPriceTableDetailModel & ProductModel & { Price?: string | number })[];
}

export class SalesMasterPriceTableDetailModel {
  Id?: string | number;
  No?: string | number;
  MasterPriceTable?: String & SalesMasterPriceTableModel;
  Product?: String | ProductModel;
  Unit?: String | UnitModel;
  Description?: string;
  Tax?: String | TaxModel;
  Price?: string | number;
  Currency?: string;
  Discount?: string | number;
}

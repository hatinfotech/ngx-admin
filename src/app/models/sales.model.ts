import { BusinessModel } from './accounting.model';
import { TaxModel } from './tax.model';
import { UnitModel } from './unit.model';
import { ProductModel } from './product.model';
import { ContactModel } from './contact.model';
import { UserModel } from './user.model';
import { Model } from './model';
import { IdTextModel } from './common.model';
import { FileModel } from './file.model';

export class SalesVoucherModel extends Model {
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

  Details?: SalesVoucherDetailModel[];
}

export class SalesVoucherDetailModel extends Model {
  Id?: any;
  SystemUuid?: string;
  Voucher?: string;
  No?: number;
  Type?: string;
  Product?: string & ProductModel;
  Description?: string;
  Quantity?: string & number;
  Price?: string & number;
  Tax?: string & TaxModel;
  Image?: string;
  CurrencyType?: string;
  Unit?: string & UnitModel;
  Business?: IdTextModel[];
  ProductName?: string;
  PriceTableDetail?: string;
}
export class SalesReturnsVoucherModel extends Model {
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

  Details?: SalesReturnsVoucherDetailModel[];
}

export class SalesReturnsVoucherDetailModel extends Model {
  Id?: any;
  Voucher?: string;
  No?: number;
  Type?: string;
  Product?: string & ProductModel;
  Description?: string;
  Quantity?: string & number;
  Price?: string & number;
  Tax?: string & TaxModel;
  Image?: string;
  CurrencyType?: string;
  Unit?: string & UnitModel;
  Business?: IdTextModel[];
  ProductName?: string;
  PriceTableDetail?: string;
}

export class SalesPriceReportModel extends Model {
  Id?: string & number;
  SequenceNumber?: string;
  Code?: string;
  StoreId?: string;
  CustomerId?: string;
  Object?: string | ContactModel | any;
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

export class SalesPriceReportDetailModel extends Model {
  Id?: string & number;
  Voucher?: string;
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
  Business?: IdTextModel[];
}


export class SalesPriceTableModel extends Model {
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

export class SalesPriceTableDetailModel extends Model {
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


export class SalesMasterPriceTableModel extends Model {
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

export class SalesMasterPriceTableDetailModel extends Model {
  [key: string]: any;
  Id?: string | number;
  No?: string | number;
  MasterPriceTable?: String & SalesMasterPriceTableModel;
  Product?: String | ProductModel;
  Unit?: String | UnitModel;
  Description?: string;
  Tax?: String | TaxModel;
  Price?: number;
  ConversionRatio?: number;
  Currency?: string;
  Discount?: string | number;
}


export interface SalesProductModel {
  Id?: string;
  Product?: string;
  OriginalName?: string;
  OriginSku?: string;
  Customer?: string;
  CustomerName?: string;
  Name?: string;
  TaxName?: string;
  TaxValue?: string;
  Sku?: string;
  ReferenceVoucher?: string;
  LastUpdate?: string;
  FeaturePicture?: FileModel;
  Pictures?: FileModel[];
}

export interface MasterPriceTableUpdateNoteModel extends Model {
  Id?: string & number;
  Code?: string;
  Title?: string;
  Note?: string;
  Created?: string;
  Approved?: string;
  Approver?: string;
  State?: string;
  Creator?: string;

  Details?: MasterPriceTableUpdateNoteDetailModel[];
}

export interface MasterPriceTableUpdateNoteDetailModel extends Model {
  Id?: any;
  SystemUuid?: string;
  Voucher?: string;
  No?: number;
  Product?: string & ProductModel;
  ProductName?: string;
  Description?: string;
  Price?: string & number;
  Image?: string;
  Unit?: string & UnitModel;
}
export interface MasterPriceTableQueueModel extends Model {
  Id?: any;
  Product?: ProductModel;
  Unit?: UnitModel;
  RequestDate?: string;
  RequestBy?: string;
  Context?: string;
}
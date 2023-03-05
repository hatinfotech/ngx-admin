import { FileModel } from './file.model';
import { IdTextModel } from './common.model';
import { BusinessModel } from './accounting.model';
import { TaxModel } from './tax.model';
import { UnitModel } from './unit.model';
import { ProductModel } from './product.model';
import { Model } from './model';

export class CommercePosOrderModel extends Model {
  Id?: string & number;
  Code?: string;
  Returns?: string;
  DebitFunds?: number;
  BarCode?: string;
  No?: string;
  Type?: string;
  Object?: any;
  ObjectName?: string;
  ObjectAddress?: string;
  ObjectPhone?: string;
  SalesStaff?: string;
  DateOfSale?: string;
  DateOfReturn?: string;
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

  Details?: CommercePosOrderDetailModel[];
}

export class CommercePosOrderDetailModel extends Model {
  Id?: string & number;
  Voucher?: string;
  No?: number;
  Type?: string;
  Product?: string & ProductModel;
  Description?: string;
  Quantity?: string & number;
  Price?: string & number;
  Tax?: string & TaxModel;
  Image?: any;
  CurrencyType?: string;
  Unit?: string & UnitModel;
  Business?: IdTextModel[];
  ProductName?: string;
  PriceTableDetail?: string;
}
export class CommercePosReturnModel extends Model {
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

  Details?: CommercePosReturnDetailModel[];
}

export class CommercePosReturnDetailModel extends Model {
  Id?: string & number;
  Voucher?: string;
  No?: number;
  Type?: string;
  Product?: any;
  Sku?: any;
  Description?: string;
  Quantity?: number;
  Price?: number;
  Tax?: string & TaxModel;
  Image?: any;
  CurrencyType?: string;
  Unit?: any;
  Business?: string | BusinessModel[];
  ProductName?: string;
  PriceTableDetail?: string;
  AccessNumbers?: string[];
  Discount?: number;
}

export interface CommercePosCashVoucherModel {
  Id?: string;
  Cashbook?: string;
  Code?: string;
  Type?: string;
  Title?: string;
  TypeName?: string;
  Seq?: string;
  Description?: string;
  RelatedUser?: string;
  RelatedUserName?: string;
  DateOfImplement?: string;
  Created?: string;
  DateOfVoucher?: Date;
  Creator?: string;
  CreatorName?: string;
  Object?: string;
  ObjectName?: string;
  ObjectPhone?: string;
  ObjectEmail?: string;
  ObjectAddress?: string;
  ObjectTaxCode?: string;
  Amount?: number;
  Currency?: string;
  RelationVoucher?: string;
  Details?: CommercePosCashVoucherModelDetailModel[];
  State?: string;
  StateLabel?: string;
  Permission?: string;
  BankAccount?: string;
  Bank?: string;
  Returns?: string;
  RelativeVouchers?: { id?: string, text?: string, type?: string }[];
}

export interface CommercePosCashVoucherModelDetailModel {
  Id?: string;
  Voucher?: string;
  RelateCode?: string;
  Description?: string;
  Amount?: number;
  Currency?: string;
  AccountingBusiness?: string;
  DebitAccount?: string;
  CreditAccount?: string;
  RelativeVoucher?: string;
}

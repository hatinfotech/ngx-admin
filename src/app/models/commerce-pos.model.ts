import { BusinessModel } from './accounting.model';
import { TaxModel } from './tax.model';
import { UnitModel } from './unit.model';
import { ProductModel } from './product.model';
import { Model } from './model';

export class CommercePosOrderModel extends Model {
  Id?: string & number;
  Code?: string;
  BarCode?: string;
  No?: string;
  Type?: string;
  Object?: string;
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
  Image?: string;
  CurrencyType?: string;
  Unit?: string & UnitModel;
  Business?: string | BusinessModel[];
  ProductName?: string;
  PriceTableDetail?: string;
}
export class CommercePosReturnsModel extends Model {
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

  Details?: CommercePosDetailModel[];
}

export class CommercePosDetailModel extends Model {
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

import { IdTextModel } from './common.model';
import { FileModel } from './file.model';
import { TaxModel } from './tax.model';
import { ProductModel } from './product.model';
import { ContactModel } from './contact.model';
import { UnitModel } from './unit.model';
import { Model } from './model';

export class PurchasePriceTableModel {
  Id?: string & number;
  Code?: string;
  Supplier?: string & ContactModel;
  SupplierName?: string;
  SupplierPhone?: string;
  SupplierEmail?: string;
  SupplierAddress?: string;
  DateOfStart?: string;
  Created?: string;
  Creator?: string;
  Contract?: string;
  InputPriceFormula?: string;
  File?: string;
  Tax?: string;
  Branch?: string;
  AppliedStartDate?: string;
  AppliedClosingDate?: string;
  DateOfCreate?: string;
  IsApprove?: string;
  DateOfApprove?: string;
  Description?: string;

  Details?: PurchasePriceTableDetailModel[] & [];
}

export class PurchasePriceTableDetailModel {
  Id?: string & number;
  SystemUuid?: string;
  PriceTable?: string;
  Product?: string & ProductModel;
  PriceType?: string;
  Price?: string;
  SalesPrice?: string;
  Note?: string;
  Tax?: string & TaxModel;
  PriceDefinition?: string;
  Unit?: string;
  DateOfUpdate?: string;
  TempPrice?: string;
  No?: string;
  Type?: string;
  Sku?: string;
  Name?: string;
  Description?: string;
}

export class PurchaseVoucherModel {
  Id?: string | number;
  Code?: string;
  Object?: string | ContactModel;
  ObjectName?: string;
  ObjectAddress?: string;
  ObjectPhone?: string;
  ObjectEmail?: string;
  PurchaseStaff?: string;
  DateOfPurchase?: string;
  Invoice?: string;
  Tax?: string | TaxModel;
  DateOfCreate?: string;
  TotalMoney?: string;
  State?: string;
  Branch?: string;
  Warehouse?: string;
  InventoryReceivingVoucher?: string;
  OrderVoucher?: string;
  RelativeDeliveryVoucher?: string;
  Creator?: string;
  Title?: string;
  Note?: string;
  SubNote?: string;
  PriceTable?: string;
  PurchaseCost?: string;

  IsPayment?: boolean;
  InvoiceStatus?: string;
  InvoiceTemplate?: string;
  InvoiceSymbol?: string;
  InvoiceNumber?: string;
  InvoiceDate?: string;
  GoodsReceiptNote?: string;
  PaymentVoucher?: string;

  Details?: PurchaseVoucherDetailModel[];
}

export class PurchaseVoucherDetailModel {
  Id?: string | number;
  SystemUuid?: string;
  Type?: string;
  No?: number;
  Voucher?: PurchaseVoucherModel & string;
  Product?: ProductModel & string;
  ProductName?: string;
  Description?: string;
  Quantity?: number;
  Unit?: UnitModel & string;
  Tax?: TaxModel & string;
  Price?: number;
  ImageThumbnail?: string;
  Business?: IdTextModel[];
  RelateDetail?: string;
}

export class PurchaseOrderVoucherModel extends Model {
  Id?: string | number;
  Code?: string;
  Object?: string | ContactModel;
  ObjectName?: string;
  ObjectAddress?: string;
  ObjectPhone?: string;
  PurchaseStaff?: string;
  DateOfPurchase?: string;
  Invoice?: string;
  Tax?: string | TaxModel;
  DateOfCreate?: string;
  TotalMoney?: string;
  State?: string;
  Branch?: string;
  Warehouse?: string;
  InventoryReceivingVoucher?: string;
  OrderVoucher?: string;
  RelativeDeliveryVoucher?: string;
  Creator?: string;
  Title?: string;
  Note?: string;
  SubNote?: string;
  PriceTable?: string;
  PurchaseCost?: string;

  GoodsReceiptNote?: string;
  PaymentVoucher?: string;

  Details?: PurchaseOrderVoucherDetailModel[];
}

export class PurchaseOrderVoucherDetailModel {
  Id?: string | number;
  No?: number;
  Voucher?: string;
  Type?: string;
  Order?: PurchaseVoucherModel & string;
  Product?: ProductModel;
  SupplierSku?: string;
  ProductName?: string;
  ProductTaxName?: string;
  Description?: string;
  Quantity?: number;
  Unit?: UnitModel & string;
  // Tax?: TaxModel & string;
  Price?: number;
  Tax?: any;
  Image?: any;
  RelateDetail?: string;
  SystemUuid?: string;
  Business?: IdTextModel[];
}

export interface PurchaseProductModel {
  Id?: string;
  Product?: string;
  OriginalName?: string;
  OriginalSku?: string;
  Supplier?: string;
  SupplierName?: string;
  Name?: string;
  TaxName?: string;
  TaxValue?: string;
  Sku?: string;
  ReferenceVoucher?: string;
  LastUpdate?: string;
  FeaturePicture?: FileModel;
  Pictures?: FileModel[];
}
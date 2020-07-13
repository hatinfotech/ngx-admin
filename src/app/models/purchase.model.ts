import { TaxModel } from './tax.model';
import { ProductModel } from './product.model';
import { ContactModel } from './contact.model';

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

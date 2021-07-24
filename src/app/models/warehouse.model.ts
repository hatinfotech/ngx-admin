import { TaxModel } from './tax.model';
import { ContactModel } from './contact.model';
import { UserModel } from './user.model';
import { ProductModel } from './product.model';
import { UnitModel } from './unit.model';

export class WarehouseModel {
  Id?: string | number;
  Code?: string;
  Branch?: string;
  Name?: string;
  Description?: string;
  Director?: string;
  IsDefaultExport?: string;
  IsDefaultImport?: string;
  [key: string]: any;
}

export class WarehouseGoodsReceiptNoteModel {
  Id?: string | number;
  Code?: string;
  Title?: string;
  Description?: string;
  Note?: string;
  SubNote?: string;
  Object?: string & ContactModel;
  ObjectName?: string;
  ObjectPhone?: string;
  ObjectEmail?: string;
  ObjectAddress?: string;
  ObjectIdentifiedNumber?: string;
  Contact?: string & ContactModel;
  ContactName?: string;
  ContactPhone?: string;
  ContactEmail?: string;
  ContactAddress?: string;
  ContactIdentifiedNumber?: string;
  DateOfCreated?: string;
  DateOfReceipted?: string;
  Creator?: string & UserModel;
  Executor?: string & UserModel;
  RelateVoucher?: string;
  Warehouse?: string;
  Branch?: string;
  State?: string;

  Bookkeeping?: boolean;

  Details?: WarehouseGoodsReceiptNoteDetailModel[];
}

export class WarehouseGoodsReceiptNoteDetailModel {
  Id?: string | number;
  No?: number;
  Voucher?: string & WarehouseGoodsReceiptNoteModel;
  Type?: string;
  Product?: string & ProductModel;
  ProductName?: string;
  Description?: string;
  Unit?: string & UnitModel;
  Quantity?: string & number;
  PriceOfReceipted?: string;
  Location?: string;
  ImageThumbnail?: string;
  Business?: string;
  DebitAccount?: number;
  CreaditAccount?: number;
  Tax?: string & TaxModel;
}


export class WarehouseGoodsDeliveryNoteModel {
  Id?: string | number;
  Code?: string;
  Title?: string;
  Description?: string;
  Note?: string;
  SubNote?: string;
  Object?: string & ContactModel;
  ObjectName?: string;
  ObjectPhone?: string;
  ObjectEmail?: string;
  ObjectAddress?: string;
  ObjectIdentifiedNumber?: string;
  Contact?: string & ContactModel;
  ContactName?: string;
  ContactPhone?: string;
  ContactEmail?: string;
  ContactAddress?: string;
  ContactIdentifiedNumber?: string;
  DateOfCreated?: string;
  DateOfDelivered?: string;
  Creator?: string & UserModel;
  Executor?: string & UserModel;
  RelateVoucher?: string;
  Warehouse?: string;
  Branch?: string;
  State?: string;

  Bookkeeping?: boolean;

  Details?: WarehouseGoodsDeliveryNoteDetailModel[];
}

export class WarehouseGoodsDeliveryNoteDetailModel {
  Id?: string | number;
  No?: number;
  Voucher?: string & WarehouseGoodsReceiptNoteModel;
  Type?: string;
  Product?: string & ProductModel;
  ProductName?: string;
  Description?: string;
  Unit?: string & UnitModel;
  Quantity?: string & number;
  PriceOfDelivered?: number;
  Location?: string;
  ImageThumbnail?: string;
  Business?: string;
  DebitAccount?: number;
  CreaditAccount?: number;
  Tax?: string & TaxModel;
}

export class WarehouseGoodsContainerModel {
  id?: string; text?: string;

  Id?: string | number;
  Code?: string;
  Branch?: string;
  Warehouse?: string & WarehouseModel;
  Parent?: string & WarehouseGoodsContainerModel;
  Name?: string;
  Description?: string;
  Path?: string;
  X?: string;
  Y?: string;
  Z?: string;
}

export class WarehouseBookModel {
  id?: string; text?: string;
  Id?: string;
  Code?: string;
  PreviousBook?: string;
  Branch?: string;
  Warehouse?: string;
  DateOfStart?: string;
  DateOfEnd?: string;
  Creator?: string;
  Note?: string;
  State?: string;
  CurrentCycle?: string;
  Commited?: string;
}

export class WarehouseGoodsInContainerModel {
  Id?: string | number;
  Warehouse?: string & WarehouseModel;
  Goods?: string & GoodsModel;
  Unit?: string & UnitModel;
  Container?: string & WarehouseGoodsContainerModel;
}

export class GoodsModel extends ProductModel {
  Containers?: WarehouseGoodsInContainerModel[];
}

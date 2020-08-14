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
  Object?: string & ContactModel;
  ObjectName?: string;
  ObjectPhone?: string;
  ObjectEmail?: string;
  ObjectAddress?: string;
  DateOfCreated?: string;
  DateOfReceipted?: string;
  Creator?: string & UserModel;
  Executor?: string & UserModel;
  RelateVoucher?: string;
  Warehouse?: string;
  Branch?: string;

  Details?: WarehouseGoodsReceiptNoteDetailModel[];
}

export class WarehouseGoodsReceiptNoteDetailModel {
  Id?: string | number;
  Voucher?: string & WarehouseGoodsReceiptNoteModel;
  Product?: string & ProductModel;
  ProductName?: string;
  Unit?: string & UnitModel;
  Quantity?: string & number;
  PriceOfReceipted?: string;
  Location?: string;
  ImageThumbnail?: string;
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
}

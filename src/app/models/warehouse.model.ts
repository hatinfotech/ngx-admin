import { ImageModel } from './file.model';
import { TaxModel } from './tax.model';
import { ContactModel } from './contact.model';
import { UserModel } from './user.model';
import { ProductModel, ProductPictureModel } from './product.model';
import { UnitModel } from './unit.model';
import { BusinessModel } from './accounting.model';
import { Tracing } from 'trace_events';

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
  [key: string]: any;
  Id?: string | number;
  No?: number;
  Voucher?: string & WarehouseGoodsReceiptNoteModel;
  Type?: string;
  Product?: string & ProductModel;
  ProductName?: string;
  Description?: string;
  Unit?: string & UnitModel;
  Quantity?: number;
  PriceOfReceipted?: string;
  Location?: string;
  ImageThumbnail?: string;
  Business?: BusinessModel[] | string;
  DebitAccount?: number;
  CreaditAccount?: number;
  Tax?: string & TaxModel;
  AccessNumbers?: WarehouseGoodsReceiptNoteDetailAccessNumberModel[];
}
export class WarehouseGoodsReceiptNoteDetailAccessNumberModel {
  [key: string]: any;
  Id?: string | number;
  No?: number;
  Voucher?: string & WarehouseGoodsReceiptNoteModel;
  Type?: string;
  Product?: string & ProductModel;
  ProductName?: string;
  Description?: string;
  Unit?: string & UnitModel;
  AccessNumber?: string;
  Price?: string;
  DebitAccount?: number;
  CreaditAccount?: number;
}
export class WarehouseInventoryAdjustNoteModel {
  Id?: string | number;
  Type?: string;
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
  DateOfAdjusted?: string;
  Creator?: string & UserModel;
  Executor?: string & UserModel;
  RelateVoucher?: string;
  Warehouse?: string;
  Branch?: string;
  State?: string;
  Shelf?: string;

  Bookkeeping?: boolean;

  Details?: WarehouseInventoryAdjustNoteDetailModel[];
}

export class WarehouseInventoryAdjustNoteDetailModel {
  [key: string]: any;
  Id?: string | number;
  No?: number;
  Voucher?: string & WarehouseInventoryAdjustNoteModel;
  Type?: string;
  Product?: string & ProductModel;
  ProductName?: string;
  Description?: string;
  Unit?: string & UnitModel;
  Quantity?: number;
  PriceOfReceipted?: string;
  Location?: string;
  ImageThumbnail?: string;
  Business?: BusinessModel[] | string;
  DebitAccount?: number;
  CreaditAccount?: number;
  Tax?: string & TaxModel;
  AccessNumbers?: any;
  SystemUuid?: string;
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
  Quantity?: number;
  PriceOfDelivered?: number;
  Location?: string;
  Container?: any;
  ImageThumbnail?: string;
  Business?: BusinessModel[] | string;
  DebitAccount?: number;
  CreaditAccount?: number;
  Tax?: string & TaxModel;
  RelateDetail?: string;
}

export class WarehouseGoodsContainerModel {
  id?: string; text?: string;

  Id?: string | number;
  Type?: string;
  Code?: string;
  Branch?: string;
  Warehouse?: string & WarehouseModel;
  Parent?: string & WarehouseGoodsContainerModel;
  Name?: string;
  Description?: string;
  Path?: string;
  FindOrder?: string;
  X?: string;
  Y?: string;
  Z?: string;
  Shelf?: string;
  ShelfName?: string;
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
  GoodsName?: string & GoodsModel;
  SearchIndex?: string;
  GoodsSku?: string;
  Unit?: string & UnitModel;
  UnitLabel?: string;
  UnitSeq?: string;
  UnitNo?: string;
  Container?: string & WarehouseGoodsContainerModel;
  ContainerName?: string;
  ContainerDescription?: string;
  ContainerFindOrder?: string;
  ContainerPath?: string;
  ContainerAccAccount?: string;
  ContainerAccAccountName?: string;
  ContainerShelf?: string;
  ContainerShelfName?: string;
  WarehouseName?: string;
  Inventory?: string;
  LastUpdate?: string;
  CostOfGoodsSold?: ImageModel;
  GoodsThumbnail?: any;
}

export class GoodsModel extends ProductModel {
  Containers?: WarehouseGoodsInContainerModel[];
}

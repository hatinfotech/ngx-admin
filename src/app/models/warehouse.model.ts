import { ImageModel } from './file.model';
import { TaxModel } from './tax.model';
import { ContactModel } from './contact.model';
import { UserModel } from './user.model';
import { ProductModel, ProductPictureModel } from './product.model';
import { UnitModel } from './unit.model';
import { BusinessModel, CostClassificationModel } from './accounting.model';
import { Tracing } from 'trace_events';
import { IdTextModel } from './common.model';
import { Model } from './model';

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
  SystemUuid?: string;
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
  Business?: IdTextModel[];
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
  SystemUuid?: string;
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
  Business?: IdTextModel[];
  DebitAccount?: number;
  CreaditAccount?: number;
  Tax?: string & TaxModel;
  AccessNumbers?: any;
  // SystemUuid?: string;
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
  RelativeVouchers?: any[];

  Bookkeeping?: boolean;

  Details?: WarehouseGoodsDeliveryNoteDetailModel[];
}

export class WarehouseGoodsDeliveryNoteDetailModel {
  Id?: string | number;
  SystemUuid?: string;
  No?: number;
  Voucher?: string & WarehouseGoodsReceiptNoteModel;
  Type?: string;
  Product?: string & ProductModel;
  ProductName?: string;
  Description?: string;
  Unit?: any;
  Quantity?: number;
  PriceOfDelivered?: number;
  Location?: string;
  Container?: any;
  ImageThumbnail?: string;
  Business?: IdTextModel[];
  DebitAccount?: number;
  CreaditAccount?: number;
  Tax?: string & TaxModel;
  RelateDetail?: string;
  AccessNumbers?: any[];
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
  Goods?: string;
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


export interface ProductionOrderModel extends Model {
  Code?: string;
  Title?: string;
  Description?: string;
  DateOfCreated?: string;
  DateOfStart?: string;
  DateOfEnd?: string;
  Approved?: string;
  Creator?: string;
  CreatorName?: string;
  Manager?: string;
  ManagerName?: string;
  State?: string;

  FinishedGoods?: ProductionOrderFinishedGoodsModel[];
  CostClassifications?: ProductionOrderCostClassificationModel[];
}
export interface ProductionOrderFinishedGoodsModel extends Model {
  SystemUuid?: string;
  ProductionOrder?: Partial<ProductionOrderModel>;
  No?: number;
  FinishedGoods?: Partial<ProductModel>;
  FinishedGoodsName?: string;
  Unit?: Partial<UnitModel> | string;
  UnitLabel?: string;
  Quantity?: number;
  CostClassification?: Partial<CostClassificationModel> | string;
  CostClassificationLabel?: string;
  DistributeCostPercent?: number;
  DistributeCost?: number;

  Materials?: ProductionOrderMaterialModel[];
  DistributedCosts?: ProductionOrderDistributedCostModel[];
}
export interface ProductionOrderMaterialModel extends Model {
  SystemUuid?: string;
  ProductionOrder?: string;
  FinishedGoodsUuid?: string;
  FinishedGoods?: Partial<ProductModel>;
  FinishedGoodsName?: string;
  FinishedGoodsUnit?: Partial<UnitModel>;
  FinishedGoodsUnitName?: string;
  No?: number;
  Material?: any;
  MaterialName?: string;
  Unit?: Partial<UnitModel> | string;
  UnitLabel?: string;
  Budgeted?: number;
  Quantity?: number;
  Price?: number;
  CostClassification?: any;
  CostClassificationLabel?: string;
}
export interface ProductionOrderDistributedCostModel extends Model {
  SystemUuid?: string;
  ProductionOrder?: string;
  FinishedGoodsUuid?: string;
  FinishedGoods?: Partial<ProductModel>;
  FinishedGoodsName?: string;
  FinishedGoodsUnit?: Partial<UnitModel>;
  FinishedGoodsUnitName?: string;
  No?: number;
  Cost?: number;
  CostClassification?: any;
  CostClassificationLabel?: string;
}
export interface ProductionOrderCostClassificationModel extends Model {
  SystemUuid?: string;
  ProductionOrder?: string;
  No?: number;
  CostClassification?: any;
  CostClassificationLabel?: string;
  Balance?: number;
  DistributedPercent?: number;
  DistributedValue?: number;
  DistributedType?: string;
}

import { WarehouseGoodsContainerModel } from './warehouse.model';
import { IdTextModel } from './common.model';
import { FileModel } from './file.model';
import { UnitModel } from './unit.model';

export class ProductModel {
  [key: string]: any;
  id?: string;
  text?: string;

  Code?: string;
  Sku?: string;
  Name?: string;
  WarehouseUnit?: string & UnitModel;
  Description?: string;
  Technical?: string;
  FeaturePicture?: FileModel;

  Containers?: WarehouseGoodsContainerModel[];

  Units?: ProductUnitConversoinModel[];

  // References
  Categories?: ProductCategoryModel[];
  Groups?: ProductGroupModel[];
  Pictures?: ProductPictureModel[];
  UnitConversions?: (ProductUnitConversoinModel & { Name?: string, Symbol?: string })[];

  constructor() { }

}

export class ProductCategoryModel {
  [key: string]: any;
  id?: StaticRange; text?: string;
  Code?: string | number;
  Name?: string;
  Description?: string;
}

export class ProductInCategoryModel {
  Id?: string | number;
  Product?: string | ProductModel;
  Category?: string | ProductCategoryModel;
}

export class ProductUnitModel {
  id?: string;
  text?: string;
  Code?: string;
  Name?: string;
  Symbol?: string;
  FullName?: string;
  Sequence?: string;
}

export class ProductPictureModel {
  Id?: number;
  Product?: string;
  Image?: string | number;
  Description?: string;
}

export class ProductUnitConversoinModel {
  id?: string; text?: string;
  Id?: number & string;
  Product?: string & ProductModel;
  Unit?: string & UnitModel;
  ConversionRatio?: string & number;
  IsDefaultSales?: boolean;
  IsDefaultPrchase?: boolean;
  IsManageByAccessNumber?: boolean;
  Name?: string;
}
export class ProductGroupModel {
  [key: string]: any;
  id?: string;
  text?: string;

  Id?: string & number;
  Code?: string;
  Name?: string;
  Description?: string;
}
export interface ProductSearchIndexModel {
  Code?: string;
  Sku?: string;
  Type?: string;
  Name?: string;
  BaseUnit?: string;
  BaseUnitLabel?: string;
  Unit?: string;
  UnitSeq?: string;
  UnitNo?: string;
  ConversionRatio?: string;
  IsDefaultSales?: string;
  IsDefaultPurchase?: string;
  IsManageByAccessNumber?: string;
  IsAutoAdjustInventory?: string;
  IsExpirationGoods?: string;
  UnitLabel?: string;
  Price?: number;
  Container?: string;
  ContainerName?: string;
  ContainerShelf?: string;
  ContainerShelfName?: string;
  ContainerFindOrder?: string;
  ContainerAccAccount?: string;
  ContainerAccAccountName?: string;
  Warehouse?: string;
  WarehouseName?: string;
  SearchIndex?: string;
  SearchText?: string;
  Group?: string;
  GroupName?: string;
  Category?: string;
  CategoryName?: string;
  FeaturePicture?: FileModel;
  Pictures?: FileModel[];
  Technical?: string;
  Description?: string;
  Inventory?: string;
  LastUpdate?: string;
  IsNotBusiness?: string;
}
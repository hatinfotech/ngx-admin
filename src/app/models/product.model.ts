import { WarehouseGoodsContainerModel } from './warehouse.model';
import { IdTextModel } from './common.model';
import { FileModel } from './file.model';
import { UnitModel } from './unit.model';
import { Model } from './model';
import { PromotionModel } from './promotion.model';
import { CostClassificationModel } from './accounting.model';

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
  ProductParts?: Partial<ProductPartModel>[];

  // References
  Categories?: ProductCategoryModel[];
  Groups?: ProductGroupModel[];
  Pictures?: FileModel[];
  UnitConversions?: (ProductUnitConversoinModel & { Name?: string, Symbol?: string })[];
  Revisions?: ProductModel[];
  constructor() { }

}

export interface ProductPartModel extends Model {
  Product?: Partial<ProductModel> | string;
  ProductName?: string;
  No?: string;
  PartProduct?: Partial<ProductModel> | string;
  PartProductName?: string;
  PartUnit?: Partial<UnitModel> | string;
  PartUnitLabel?: string;
  Quantity?: number;
  CostClassification?: Partial<CostClassificationModel> | string;
  CostClassificationLabel?: string;
  SystemUuid?: string;
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

export class ProductUnitModel extends Model {
  id?: string;
  text?: string;
  Code?: string;
  Name?: string;
  Symbol?: string;
  FullName?: string;
  Sequence?: string;
  Containers?: WarehouseGoodsContainerModel[]
}

export class ProductPictureModel {
  Id?: number;
  Product?: string;
  Image?: string | number;
  Description?: string;
}

export class ProductUnitConversoinModel {
  [key: string]: any;
  id?: string; text?: string;
  Id?: number & string;
  Product?: string & ProductModel;
  Unit?: string & UnitModel;
  ConversionRatio?: any;
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
  // [key: string]: any;
  id?: string;
  text?: string;
  Code?: string;
  Sku?: string;
  Type?: string;
  Name?: string;
  BaseUnit?: any;
  BaseUnitLabel?: string;
  Unit?: any;
  UnitSeq?: string;
  UnitNo?: string;
  ConversionRatio?: number;
  IsDefaultSales?: string;
  IsDefaultPurchase?: string;
  IsManageByAccessNumber?: string;
  IsAutoAdjustInventory?: string;
  IsExpirationGoods?: string;
  UnitLabel?: string;
  Price?: number;
  Container?: any;
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
  Inventory?: number;
  LastUpdate?: string;
  IsNotBusiness?: string;
  Keyword?: string;
}

export class ProductBrandModel {
  [key: string]: any;
  id?: string; text?: string;
  Code?: string;
  Name?: string;
  Description?: string;
}

export class ProductPeropertyModel {
  [key: string]: any;
  id?: StaticRange; text?: string;
  Code?: string | number;
  Name?: string;
  Description?: string;
}

export interface ProductPropertyModel {
  id?: string;
  text?: string;
  Code?: string;
  Name?: string;
  Description?: string;
  Parent?: string;
  Values?: any[],
}
export interface ProductInPropertyModel {
  Property?: ProductPropertyModel;
  PropertyName?: string;
  Product?: string;
  ProductName?: string;
  PropertyValues?: any[];
}
export interface ProductObjectReferenceModel {
  Product?: string;
  FeaturePicture?: FileModel;
  Pictures?: FileModel[];
  ProductOriginName?: string;
  Object?: string;
  ObjectName?: string;
  Type?: string;
  ReferenceValue?: string;
  LastUpdate?: string;
  ReferenceCode?: string;
}
export interface ProductPropertyValueModel {
  id?: string;
  text?: string;
  Name?: string;
}

export class ProductKeywordModel {
  [key: string]: any;
  Tag?: string;
}
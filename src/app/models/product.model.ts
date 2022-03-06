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

  Units?: UnitModel[];

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
}

export class ProductPictureModel {
  Id?: number;
  Product?: string;
  Image?: string | number;
  Description?: string;
}

export class ProductUnitConversoinModel {
  Id?: number & string;
  Product?: string & ProductModel;
  Unit?: string & UnitModel;
  ConversionRatio?: string & number;
  IsDefaultSales?: boolean;
  IsDefaultPrchase?: boolean;
  IsManageByAccessNumber?: boolean;
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

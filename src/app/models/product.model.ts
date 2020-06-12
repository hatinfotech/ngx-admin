import { UnitModel } from './unit.model';

export class ProductModel {

  Code: string;
  Sku?: string;
  Name: string;
  WarehouseUnit?: string & UnitModel;
  Description?: string;
  Technical?: string;
  FeaturePicture?: string;

  // References
  Categories: ProductCategoryModel[];
  Groups: ProductGroupModel[];
  Pictures?: ProductPictureModel[];

  constructor() { }

}

export class ProductCategoryModel {
  Code?: string;
  Name?: string;
  Description?: string;
}

export class ProductUnitModel {
  Code?: string;
  Name?: string;
  Symbol?: string;
  FullName?: string;
}

export class ProductPictureModel {
  Id?: number;
  Product?: string;
  Image?: string;
  Description?: string;
}

export class ProductGroupModel {
  Id?: string & number;
  Code?: string;
  Name?: string;
  Description?: string;
}

export class ProductModel {

  Code: string;
  Name: string;
  WarehouseUnit?: string;
  Description?: string;
  Technical?: string;
  FeaturePicture?: string;

  // References
  Categories: ProductCategoryModel[];
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

export class ProductModel {

  Code: string;
  Name: string;
  WarehouseUnit?: string;
  Description?: string;
  Technical?: string;

  // References
  Categories: ProductCategoryModel[];

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

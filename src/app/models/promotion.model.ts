export class PromotionModel {
  Id?: number;
  Code?: string;
  Type?: string;
  Name?: string;
  Description?: string;
  Content?: string;
  MaxUse?: number;
  Creator?: string;
  NumOfUse?: number;
  State?: string;

  Conditions?: PromotionConditionModel[];
  Actions?: PromotionActionModel[];
  Customers?: PromotionCustomerModel[];
  CustomerGroups?: PromotionCustomerGroupModel[];
  Products?: PromotionProductModel[];
  ProductGroups?: PromotionProductGroupModel[];
}

export class PromotionConditionModel {
  Id?: number;
  No?: number;
  Promotion?: string;
  Type?: string;
  Cond?: string; // Condition
  Operator?: string;
  DoubleValue?: number;
  DateValue?: string;
  IntegerValue?: number;
  TextValue?: string;
  BreakOnFalse?: boolean;
}


export class PromotionActionModel {
  Id?: number;
  Promotion?: string;
  No?: number;
  Type?: string;
  Product?: string;
  Amount?: number;
  Discount?: number;

}

export class PromotionCustomerModel {
  Id?: number;
  Promotion?: string;
  Customer?: string;
}

export class PromotionCustomerGroupModel {
  Id?: number;
  Promotion?: string;
  CustomerGroup?: string;

}

export class PromotionProductModel {
  Id?: number;
  Promotion?: string;
  Product?: string;
}

export class PromotionProductGroupModel {
  Id?: number;
  Promotion?: string;
  ProductGroup?: string;
}

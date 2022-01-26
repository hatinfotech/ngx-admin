import { UnitModel } from './unit.model';
import { ProductModel } from './product.model';
import { Model } from './model';


export class DeploymentVoucherModel extends Model  {
  Id?: string & number;
  SequenceNumber?: string;
  Code?: string;
  Object?: string;
  ObjectName?: string;
  ObjectAddress?: string;
  ObjectPhone?: string;
  Branch?: string;
  Recipient?: string;
  Note?: string;
  Reported?: string;
  Created?: string;
  CreatorId?: string;
  Creator?: string;
  FileName?: string;
  State?: string;
  Title?: string;
  ObjectEmail?: string;
  ObjectTaxCode?: string;
  ObjectBankCode?: string;
  ObjectBankName?: string;

  // References
  Details?: DeploymentVoucherDetailModel[];

}

export class DeploymentVoucherDetailModel extends Model  {
  Id?: string & number;
  No?: number;
  Type?: string;
  Product?: string & ProductModel;
  Description: string;
  Quantity: number;
  Price: number & string;
  Unit: string & UnitModel;
  Image?: string;
  RelateDetail?: string;
}
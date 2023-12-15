import { FileModel } from './file.model';
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

  ObjectIdentifiedNumber?: string;
  Contact?: string;
  ContactName?: string;
  ContactPhone?: string;
  ContactEmail?: string;
  ContactAddress?: string;
  ContactIdentifiedNumber?: string;
  SubNote?: string;
  DeploymentDate?: any;
  Transportation?: string;
  TransportationName?: string;
  DeliveryAddress?: string;
  MapUrl?: string;
  Driver?: string;
  DriverName?: string;
  DriverPhone?: string;
  Implementer?: string;
  ImplementerName?: string;
  ImplementerPhone?: string;
  ImplementerEmail?: string;
  ShippingCost?: string;
  ShippingCostPaymentBy?: string;
  ShippingCostPaymentRatio?: string;
  DirectReceiverName?: string;
  DirectReceiverPhone?: string;
  Employee?: string;
  IsDebt?: boolean;
  Permission?: string;

  // References
  Details?: DeploymentVoucherDetailModel[];

}

export class DeploymentVoucherDetailModel extends Model  {
  Id?: string & number;
  SystemUuid?: string;
  No?: number;
  Type?: string;
  Product?: string & ProductModel;
  Description?: string;
  Quantity?: number;
  Price?: number & string;
  Unit?: string & UnitModel;
  Image?: any;
  RelateDetail?: string;
}
import { IdTextModel } from './common.model';
export interface WpSiteModel extends IdTextModel {
  Code?: string;
  Name?: string;
  Description?: string;
  Domain?: string;
  BaseUrl?: string;
  ApiUrl?: string;
  ApiUsername?: string;
  ApiPassword?: string;
  ApiToken?: string;
  State?: string;
  SyncTargets?: WpSiteSyncTaget[];
  SyncCategories?: { id: string, text: string, slug: string }[];
  SyncPages?: { id: string, text: string, slug: string }[];
  SyncTags?: { id: string, text: string }[];
}


export class WpSiteSyncTaget {
  Id?: string;
  WpSite?: string;
  TargetSite?: string;
  Resources?: { id: string, text: string }[];
  PostTags?: { id: string, text: string }[];
  Active?: boolean;
}

export interface WpOrderModel {
  [key: string]: any,
  Id?: string;
  RefId?: string;
  Code?: string;
  No?: string;
  Type?: string;
  Object?: string;
  ObjectName?: string;
  ObjectAddress?: string;
  ObjectPhone?: string;
  ObjectEmail?: string;
  Contact?: string;
  ContactName?: string;
  ContactPhone?: string;
  ContactEmail?: string;
  ContactAddress?: string;
  Saler?: string;
  SalerName?: string;
  Employee?: string;
  EmployeeName?: string;
  DateOfSale?: string;
  DateOfDelivery?: string;
  InvoiceAddress?: string;
  InvoiceLocation?: string;
  DeliveryAddress?: string;
  DeliveryLocation?: string;
  DirectReceiverName?: string;
  IsExportVatInvoice?: string;
  Title?: string;
  Note?: string;
  SubNote?: string;
  Created?: string;
  State?: string;
  Approved?: string;
  Approver?: string;
  Account?: string;
  Branch?: string;
  InventoryDeliveryVoucher?: string;
  Invoice?: string;
  Creator?: string;
  Permission?: string;
  PriceTable?: string;
  RelativeVouchers?: string;
  Site?: string;
  SiteName?: string;
  SiteDomain?: string;
  Amount?: string;
  Revision?: string;
  LastUpdate?: string;
  IsObjectRevenue?: string;
  PaymentMethod?: string;
  CashAmount?: string;
  CashTransferAmount?: string;
  ReceiptBankAccount?: string;
  RefOrderData?: string;
  Billing?: string;
  BillingFirstName?: string;
  BillingLastName?: string;
  BillingCompany?: string;
  BillingAddress1?: string;
  BillingAddress2?: string;
  BillingCity?: string;
  BillingState?: string;
  BillingPostCode?: string;
  BillingCountry?: string;
  BillingEmail?: string;
  BillingPhone?: string;
  Shipping?: string;
  ShippingFirstName?: string;
  ShippingLastName?: string;
  ShippingCompany?: string;
  ShippingAddress1?: string;
  ShippingAddress2?: string;
  ShippingCity?: string;
  ShippingState?: string;
  ShippingPostCode?: string;
  ShippingCountry?: string;
  ShippingPhone?: string;
  details?: WpOrderDetailModel[];
}

export interface WpOrderDetailModel {
  [key: string]: any,
  Id?: string;
  RefId?: string;
  Voucher?: string;
  Type?: string;
  No?: string;
  PriceTableDetail?: string;
  Image?: string;
  Product?: any;
  Sku?: string;
  ProductName?: string;
  Description?: string;
  Quantity?: number;
  Price?: number;
  Unit?: string;
  DebitAccount?: string;
  CreditAccount?: string;
  Business?: string;
  Amount?: string;
  AccessNumbers?: string;
  FindOrder?: string;
  Container?: string;
  SystemUuid?: string;
}

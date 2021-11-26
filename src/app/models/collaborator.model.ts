import { IdTextModel } from "./common.model";

export interface CollaboratorPublisherModel {
    [key: string]: any;
    Id?: string;
    Page?: string;
    Publisher?: string;
    Name?: string;
    Phone?: string;
    Email?: string;
    Address?: string;
    IdentifiedNumber?: string;
    Assigned?: string;
    State?: string;
    Level?: string;
    LevelLabel?: string;
}

export interface CollaboratorOrderModel {
    [key: string]: any;
    Id?: string;
    Page?: string;
    Publisher?: string;
    Code?: string;
    Object?: string;
    ObjectName?: string;
    ObjectAddress?: string;
    ObjectPhone?: string;
    ObjectEmail?: string;
    ObjectTaxCode?: string;
    ObjectBank?: string;
    ObjectBankName?: string;
    ObjectBankAccount?: string;
    ObjectIdentifiedNumber?: string;
    DateOfOrder?: string;
    DateOfDelivery?: string;
    DeliveryAddress?: string;
    DirectReceiverName?: string;
    IsExportVatInvoice?: string;
    Title?: string;
    Note?: string;
    SubNote?: string;
    State?: string;
    Permission?: string;
    PriceTable?: string;
    RelativeVouchers?: any[];
}

export interface CollaboratorOrderDetailModel {
    [key: string]: any;
    Id?: string;
    Voucher?: string;
    Type?: string;
    No?: number;
    Image?: string;
    Product?: string;
    Description?: string;
    Quantity?: number;
    Price?: number;
    Tax?: any;
    Currency?: string;
    Unit?: string;
}

export interface CollaboratorCommissionVoucherModel {
    [key: string]: any;
    Id?: string;
    Code?: string;
    Page?: string;
    Publisher?: string;
    PublisherName?: string;
    PublisherPhone?: string;
    PublisherEmail?: string;
    PublisherAddress?: string;
    PublisherIdentifiedNumber?: string;
    Bank?: string;
    BankName?: string;
    BankAccount?: string;
    Amount?: number;
    Created?: string;
    CommissionFrom?: string;
    CommissionTo?: string;
    Description?: string;
    State?: string;
}
export interface CollaboratorCommissionVoucherDetailModel {
    [key: string]: any;
    Id?: string;
    CommissionVoucher?: string;
    No?: string;
    Image?: string;
    Product?: string;
    ProductName?: string;
    Unit?: string;
    UnitLabel?: string;
    Kpi?: string;
    Okr?: string;
    CommissionAmount?: string;
    RelativeVouchers?: string;
    Level1AwardRatio?: string;
    Level1AwardAmount?: string;
    Level1Kpi?: string;
    Level2ExtAwardRatio?: string;
    Level2ExtAwardAmount?: string;
    Level3ExtAwardRatio?: string;
    Level3ExtAwardAmount?: string;
    SumOfQuantity?: string;
    ExtSumOfNetRevenue?: string;
    TotalAwardAmount?: string;
    Orders?: CollaboratorCommissionVoucherDetailOrderModel[];
}
export interface CollaboratorCommissionVoucherDetailOrderModel {
    [key: string]: any;
    Id?: string;
    CommissionVoucher?: string;
    DetailNo?: string;
    No?: string;
    Voucher?: string;
    VoucherDetailNo?: string;
    VoucherTitle?: string;
    Product?: string;
    Unit?: string;
    UnitLabel?: string;
    Description?: string;
    Tax?: string;
    TaxValue?: string;
    TaxLabel?: string;
    Quantity?: number;
    Price?: number;
}
export interface CollaboratorAwardVoucherModel {
    [key: string]: any;
    Id?: string;
    Code?: string;
    Page?: string;
    Publisher?: string;
    PublisherName?: string;
    PublisherPhone?: string;
    PublisherEmail?: string;
    PublisherAddress?: string;
    PublisherIdentifiedNumber?: string;
    Bank?: string;
    BankName?: string;
    BankAccount?: string;
    Amount?: number;
    Created?: string;
    CommissionFrom?: string;
    CommissionTo?: string;
    Description?: string;
    State?: string;
    Details?: CollaboratorAwardVoucherDetailModel[];
}
export interface CollaboratorAwardVoucherDetailModel {
    [key: string]: any;
    Id?: string;
    AwardVoucher?: string;
    No?: string;
    Image?: string;
    Product?: string;
    ProductName?: string;
    Unit?: string;
    UnitLabel?: string;
    Kpi?: string;
    Okr?: string;
    AwardAmount?: string;
    RelativeVouchers?: string;
    Level1AwardRatio?: string;
    Level1AwardAmount?: string;
    Level1Kpi?: string;
    Level2ExtAwardRatio?: string;
    Level2ExtAwardAmount?: string;
    Level3ExtAwardRatio?: string;
    Level3ExtAwardAmount?: string;
    SumOfQuantity?: string;
    ExtSumOfNetRevenue?: string;
    TotalAwardAmount?: string;
    // DirectOrders?: CollaboratorAwardVoucherDetailDirectOrderModel[];
    // RefOrders?: CollaboratorAwardVoucherDetailRefOrderModel[];
    CommissionVouchers?: CollaboratorAwardVoucherDetailCommissionModel[];
    ExtCommissionVouchers?: CollaboratorAwardVoucherDetailCommissionModel[];
}
export interface CollaboratorAwardVoucherDetailCommissionModel {
    [key: string]: any;
    Id?: string;
    AwardVoucher?: string;
    DetailNo?: string;
    No?: string;
    Voucher?: string;
    VoucherDetailNo?: string;
    VoucherTitle?: string;
    Product?: string;
    Unit?: string;
    UnitLabel?: string;
    Description?: string;
    Tax?: string;
    TaxValue?: string;
    TaxLabel?: string;
    Quantity?: string;
    Price?: string;
}
// export interface CollaboratorAwardVoucherDetailDirectOrderModel {
//     [key: string]: any;
//     Id?: string;
//     AwardVoucher?: string;
//     DetailNo?: string;
//     No?: string;
//     Voucher?: string;
//     VoucherDetailNo?: string;
//     VoucherTitle?: string;
//     Product?: string;
//     Unit?: string;
//     UnitLabel?: string;
//     Description?: string;
//     Tax?: string;
//     TaxValue?: string;
//     TaxLabel?: string;
//     Quantity?: string;
//     Price?: string;
// }
// export interface CollaboratorAwardVoucherDetailRefOrderModel {
//     [key: string]: any;
//     Id?: string;
//     AwardVoucher?: string;
//     DetailNo?: string;
//     No?: string;
//     Voucher?: string;
//     VoucherDetailNo?: string;
//     VoucherTitle?: string;
//     Product?: string;
//     Unit?: string;
//     UnitLabel?: string;
//     Description?: string;
//     Tax?: string;
//     TaxValue?: string;
//     TaxLabel?: string;
//     Quantity?: string;
//     Price?: string;
// }
export interface CollaboratorEducationArticleModel {
    // [key: string]: any;
    id?: string; text?: string;
    Id?: string;
    Code?: string;
    Title?: string;
    Summary?: string;
    ContentBlock1?: string;
    ContentBlock2?: string;
    ContentBlock3?: string;
    Creator?: string;
    DateOfCreated?: string;
    Product?: string & IdTextModel;
    ProductName?: string;
    Page?: string & IdTextModel;
    PageName?: string;
    State?: string;
    IsNewFeed?: boolean;
    IsSync?: boolean;
}


export interface CollaboratorExtendCommissionVoucherModel {
    [key: string]: any;
    Id?: string;
    Code?: string;
    Page?: string;
    Publisher?: string;
    PublisherName?: string;
    PublisherPhone?: string;
    PublisherEmail?: string;
    PublisherAddress?: string;
    PublisherIdentifiedNumber?: string;
    Bank?: string;
    BankName?: string;
    BankAccount?: string;
    Amount?: number;
    Created?: string;
    CommissionFrom?: string;
    CommissionTo?: string;
    Description?: string;
    State?: string;
    Details?: CollaboratorExtendCommissionVoucherDetailModel[];
}
export interface CollaboratorExtendCommissionVoucherDetailModel {
    [key: string]: any;
    Id?: string;
    ExtendCommissionVoucher?: string;
    No?: string;
    Image?: string;
    Product?: string;
    ProductName?: string;
    Unit?: string;
    UnitLabel?: string;
    Kpi?: string;
    Okr?: string;
    ExtendCommissionAmount?: string;
    RelativeVouchers?: string;
    Level1ExtendCommissionRatio?: string;
    Level1ExtendCommissionAmount?: string;
    Level1Kpi?: string;
    Level2ExtExtendCommissionRatio?: string;
    Level2ExtExtendCommissionAmount?: string;
    Level3ExtExtendCommissionRatio?: string;
    Level3ExtExtendCommissionAmount?: string;
    SumOfQuantity?: string;
    ExtSumOfNetRevenue?: string;
    TotalExtendCommissionAmount?: string;
    // DirectOrders?: CollaboratorExtendCommissionVoucherDetailDirectOrderModel[];
    // RefOrders?: CollaboratorExtendCommissionVoucherDetailRefOrderModel[];
    CommissionVouchers?: CollaboratorExtendCommissionVoucherDetailCommissionModel[];
    ExtCommissionVouchers?: CollaboratorExtendCommissionVoucherDetailCommissionModel[];
}
export interface CollaboratorExtendCommissionVoucherDetailCommissionModel {
    [key: string]: any;
    Id?: string;
    ExtendCommissionVoucher?: string;
    DetailNo?: string;
    No?: string;
    Voucher?: string;
    VoucherDetailNo?: string;
    VoucherTitle?: string;
    Product?: string;
    Unit?: string;
    UnitLabel?: string;
    Description?: string;
    Tax?: string;
    TaxValue?: string;
    TaxLabel?: string;
    Quantity?: string;
    Price?: string;
}
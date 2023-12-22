import { IdTextModel } from "./common.model";
import { Model } from "./model";
import { ProductModel } from "./product.model";

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
    FullDeliveryAddress?: string;
    DirectReceiverName?: string;
    IsExportVatInvoice?: string;
    Title?: string;
    Note?: string;
    SubNote?: string;
    State?: string;
    Permission?: string;
    PriceTable?: string;
    Thread?: string;
    RelativeVouchers?: any[];
    Details?: CollaboratorOrderDetailModel[];
    TransportPoints?: CollaboratorOrderTransportPointModel[];
}

export interface CollaboratorOrderDetailModel {
    [key: string]: any;
    Id?: string;
    Voucher?: string;
    Type?: string;
    No?: number;
    Image?: string;
    Product?: Partial<ProductModel>;
    Description?: string;
    Quantity?: number;
    Price?: number;
    Tax?: any;
    Currency?: string;
    Unit?: string;
}

export interface CollaboratorOrderTransportPointModel extends Model {
    Id?: string;
    SystemUuid?: string;
    Voucher?: string;
    No?: string;
    ShippingUnit?: string;
    ShippingUnitName?: string;
    ShippingUnitPhone?: string;
    ShippingUnitEmail?: string;
    ShippingUnitAddress?: string;
    ShippingUnitMapLink?: string;
    ShippingUnitId?: string;
    Note?: string;
    TransportCost?: number;
    Business?: string;
    DebitAccount?: string;
    CreditAccount?: string;
    CostClassification?: string;
  }

export interface CollaboratorCommissionIncurredModel {
    [key: string]: any;
    Id?: string;
    Page?: string;
    Publisher?: string;
    PublisherName?: string;
    PublisherPhone?: string;
    PublisherEmail?: string;
    PublisherAddress?: string;
    ReferralContact?: string;
    ReferralContactName?: string;
    ReferralContactPhone?: string;
    ReferralContactEmail?: string;
    ReferralContactAddress?: string;
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
    VoucherDate?: string;
    IsExportVatInvoice?: string;
    Title?: string;
    Note?: string;
    SubNote?: string;
    State?: string;
    Permission?: string;
    Thread?: string;
    RelativeVouchers?: any[];

    Details?: CollaboratorCommissionIncurredDetailModel[];
}

export interface CollaboratorCommissionIncurredDetailModel {
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

export interface CollaboratorBasicStrategyModel {
    Id?: string;
    Code?: string;
    Title?: string;
    Page?: string;
    PageName?: string;
    CommissionRatio?: string;
    State?: string;
    Cycle?: string;
    DateOfStart?: string;
    DateOfEnd?: string;
    IsAutoExtended?: string;
    PlatformFee?: string;
    IsDiscountByVoucher?: string;
    IsSelfOrder?: string;
    SelfOrderDiscount?: string;
    Level1Badge?: string;
    Level1Label?: string;
    Level1Description?: string;
    Level1CommissionRatio?: string;
    IsAppliedForLevel1Weekly?: string;
    Level2WeeklyLabel?: string;
    Level1WeeklyKpi?: string;
    Level1WeeklyOkr?: string;
    Level1WeeklyAwardRatio?: string;
    IsAppliedForLevel1Monthly?: string;
    Level1MonthlyLabel?: string;
    Level1MonthlyKpi?: string;
    Level1MonthlyOkr?: string;
    Level1MonthlyAwardRatio?: string;
    IsAppliedForLevel1Quarterly?: string;
    Level1QuarterlyLabel?: string;
    Level1QuarterlyKpi?: string;
    Level1QuarterlyOkr?: string;
    Level1QuarterlyAwardRatio?: string;
    IsAppliedForLevel1Yearly?: string;
    Level1YearlyLabel?: string;
    Level1YearlyKpi?: string;
    Level1YearlyOkr?: string;
    Level1YearlyAwardRatio?: string;
    Level2ExtBadge?: string;
    Level2ExtLabel?: string;
    Level2ExtRequiredKpi?: string;
    Level2ExtRequiredOkr?: string;
    Level2ExtAwardRatio?: string;
    Level2ExtDescription?: string;
    Level3ExtBadge?: string;
    Level3ExtLabel?: string;
    Level3ExtRequiredKpi?: string;
    Level3ExtRequiredOkr?: string;
    Level3ExtAwardRatio?: string;
    Level3ExtDescription?: string;
    ExtendTerm?: string;
    ExtendTermLabel?: string;
    ExtendTermPublishers?: string;
    ExtendTermRatio?: string;
    Description?: string;

    Products?: CollaboratorBasicStrategyProductModel[];
}

export interface CollaboratorBasicStrategyProductModel {
    Id?: string;
    Strategy?: string;
    Product?: string;
    ProductName?: string;
    Sku?: string;
    Unit?: string;
    CommissionRatio?: string;
    Cycle?: string;
    DateOfStart?: string;
    DateOfEnd?: string;
    IsAutoExtended?: string;
    PlatformFee?: string;
    IsDiscountByVoucher?: string;
    IsSelfOrder?: string;
    SelfOrderDiscount?: string;
    Level1Badge?: string;
    Level1Label?: string;
    Level1Description?: string;
    Level1CommissionRatio?: string;
    IsAppliedForLevel1Weekly?: string;
    Level2WeeklyLabel?: string;
    Level1WeeklyKpi?: string;
    Level1WeeklyOkr?: string;
    Level1WeeklyAwardRatio?: string;
    IsAppliedForLevel1Monthly?: string;
    Level1MonthlyLabel?: string;
    Level1MonthlyKpi?: string;
    Level1MonthlyOkr?: string;
    Level1MonthlyAwardRatio?: string;
    IsAppliedForLevel1Quarterly?: string;
    Level1QuarterlyLabel?: string;
    Level1QuarterlyKpi?: string;
    Level1QuarterlyOkr?: string;
    Level1QuarterlyAwardRatio?: string;
    IsAppliedForLevel1Yearly?: string;
    Level1YearlyLabel?: string;
    Level1YearlyKpi?: string;
    Level1YearlyOkr?: string;
    Level1YearlyAwardRatio?: string;
    Level2ExtBadge?: string;
    Level2ExtLabel?: string;
    Level2ExtRequiredKpi?: string;
    Level2ExtRequiredOkr?: string;
    Level2ExtAwardRatio?: string;
    Level2ExtDescription?: string;
    Level3ExtBadge?: string;
    Level3ExtLabel?: string;
    Level3ExtRequiredKpi?: string;
    Level3ExtRequiredOkr?: string;
    Level3ExtAwardRatio?: string;
    Level3ExtDescription?: string;
    ExtendTerm?: string;
    ExtendTermLabel?: string;
    ExtendTermPublishers?: string;
    ExtendTermRatio?: string;
    Description?: string;
}

export interface CollaboratorAdvanceStrategyPublisherModel {
    Id?: string;
    Strategy?: string;
    Publisher?: string;
    PublisherName?: string;
    CommissionRatio?: string;
    Cycle?: string;
    DateOfStart?: string;
    DateOfEnd?: string;
    IsAutoExtended?: string;
    PlatformFee?: string;
    IsDiscountByVoucher?: string;
    IsSelfOrder?: string;
    SelfOrderDiscount?: string;
    Level1Badge?: string;
    Level1Label?: string;
    Level1Description?: string;
    Level1CommissionRatio?: string;
    IsAppliedForLevel1Weekly?: string;
    Level2WeeklyLabel?: string;
    Level1WeeklyKpi?: string;
    Level1WeeklyOkr?: string;
    Level1WeeklyAwardRatio?: string;
    IsAppliedForLevel1Monthly?: string;
    Level1MonthlyLabel?: string;
    Level1MonthlyKpi?: string;
    Level1MonthlyOkr?: string;
    Level1MonthlyAwardRatio?: string;
    IsAppliedForLevel1Quarterly?: string;
    Level1QuarterlyLabel?: string;
    Level1QuarterlyKpi?: string;
    Level1QuarterlyOkr?: string;
    Level1QuarterlyAwardRatio?: string;
    IsAppliedForLevel1Yearly?: string;
    Level1YearlyLabel?: string;
    Level1YearlyKpi?: string;
    Level1YearlyOkr?: string;
    Level1YearlyAwardRatio?: string;
    Level2ExtBadge?: string;
    Level2ExtLabel?: string;
    Level2ExtRequiredKpi?: string;
    Level2ExtRequiredOkr?: string;
    Level2ExtAwardRatio?: string;
    Level2ExtDescription?: string;
    Level3ExtBadge?: string;
    Level3ExtLabel?: string;
    Level3ExtRequiredKpi?: string;
    Level3ExtRequiredOkr?: string;
    Level3ExtAwardRatio?: string;
    Level3ExtDescription?: string;
    ExtendTerm?: string;
    ExtendTermLabel?: string;
    ExtendTermPublishers?: string;
    ExtendTermRatio?: string;
    Description?: string;
    Products?: CollaboratorAdvanceStrategyProductModel[];
}

export interface CollaboratorAdvanceStrategyProductModel extends CollaboratorBasicStrategyProductModel { }
export interface CollaboratorAddonStrategyProductModel extends CollaboratorBasicStrategyProductModel { }
export interface CollaboratorRebuyStrategyProductModel extends CollaboratorBasicStrategyProductModel { 
    Publishers?: CollaboratorRebuyStrategyPublisherModel[];
}
export interface CollaboratorAddonStrategyPublisherModel extends CollaboratorAdvanceStrategyPublisherModel { }
export interface CollaboratorRebuyStrategyPublisherModel extends CollaboratorAdvanceStrategyPublisherModel { }
export interface CollaboratorAdvanceStrategyModel extends CollaboratorBasicStrategyModel {
    Publishers?: CollaboratorAdvanceStrategyPublisherModel[];
}
export interface CollaboratorAddonStrategyModel extends CollaboratorBasicStrategyModel {
    Products?: CollaboratorAddonStrategyProductModel[];
}
export interface CollaboratorRebuyStrategyModel extends CollaboratorBasicStrategyModel {
    Products?: CollaboratorRebuyStrategyProductModel[];
}















export interface CollaboratorBasicSaleCommissionConfigurationModel extends CollaboratorBasicStrategyModel {
    Products?: CollaboratorBasicSaleCommissionConfigurationProductModel[];
}

export interface CollaboratorBasicSaleCommissionConfigurationProductModel extends CollaboratorBasicStrategyProductModel {
    Configuration?: any;
}

export interface CollaboratorBasicSaleCommissionConfigurationSellerModel {
    Products?: CollaboratorBasicSaleCommissionConfigurationProductModel[];
}

export interface CollaboratorAdvancedSaleCommissionConfigurationProductModel extends CollaboratorBasicSaleCommissionConfigurationProductModel { }
export interface CollaboratorAdvancedSaleCommissionConfigurationSellerModel extends CollaboratorBasicSaleCommissionConfigurationSellerModel { }
export interface CollaboratorAddonSaleCommissionConfigurationProductModel extends CollaboratorBasicSaleCommissionConfigurationProductModel { }
export interface CollaboratorAddonSaleCommissionConfigurationSellerModel extends CollaboratorAdvancedSaleCommissionConfigurationSellerModel { }
export interface CollaboratorAdvancedSaleCommissionConfigurationModel extends CollaboratorBasicSaleCommissionConfigurationModel {
    Sellers?: CollaboratorAdvancedSaleCommissionConfigurationSellerModel[];
}
export interface CollaboratorAddonSaleCommissionConfigurationModel extends CollaboratorBasicSaleCommissionConfigurationModel {
    Products?: CollaboratorAddonSaleCommissionConfigurationProductModel[];
}

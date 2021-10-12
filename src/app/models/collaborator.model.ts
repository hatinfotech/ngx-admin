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
    Orders?: CollaboratorAwardVoucherDetailOrderModel[];
}
export interface CollaboratorAwardVoucherDetailOrderModel {
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
    DirectOrders?: CollaboratorAwardVoucherDetailDirectOrderModel[];
    RefOrders?: CollaboratorAwardVoucherDetailRefOrderModel[];
}
export interface CollaboratorAwardVoucherDetailDirectOrderModel {
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
export interface CollaboratorAwardVoucherDetailRefOrderModel {
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
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
export interface CollaboratorPage {
    [key: string]: any;
    id?: string, text?: string;
    Id?: string;
    Code?: string;
    Name?: string;
    Description?: string;
    Permission?: string;
    State?: string;
    Created?: string;
}

export interface CollaboratorPublisher {
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
}

export interface CollaboratorOrder {
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

export interface CollaboratorOrderDetail {
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
    Tax?: string;
    Currency?: string;
    Unit?: string;
}
export class AccountModel {
    [id: string]: any;
    Id?: string;
    Parent?: string;
    Code?: string;
    Name?: string;
    Description?: string;
    Currency?: string;
    Property?: string;
    Level?: string;
    Type?: string;
    Group?: string;
}

export class BusinessModel {
    [id: string]: any;
    Id?: string;
    Type?: string;
    Code?: string;
    Name?: string;
    Description?: string;
    DebitAccount?: string;
    CreditAccount?: string;
}
export interface CashVoucherModel {
    Id?: string;
    Cashbook?: string;
    Code?: string;
    Type?: string;
    TypeName?: string;
    Seq?: string;
    Description?: string;
    RelatedUser?: string;
    RelatedUserName?: string;
    DateOfImplement?: string;
    Created?: string;
    Creator?: string;
    CreatorName?: string;
    Object?: string;
    ObjectName?: string;
    ObjectPhone?: string;
    ObjectEmail?: string;
    ObjectAddress?: string;
    ObjectTaxCode?: string;
    Amount?: number;
    Currency?: string;
    RelationVoucher?: string;
    Details?: CashVoucherDetailModel[];
    State?: string;
    Permission?: string;
    BankAccount?: string;
    Bank?: string;
}

export interface CashVoucherDetailModel {
    Id?: string;
    Voucher?: string;
    RelateCode?: string;
    Description?: string;
    Amount?: number;
    Currency?: string;
    AccountingBusiness?: string;
    DebitAccount?: string;
    CreditAccount?: string;
}

export interface OtherBusinessVoucherModel {
    Id?: string;
    Code?: string;
    Type?: string;
    Seq?: string;
    Description?: string;
    Employee?: string;
    DateOfVoucher?: string;
    Created?: string;
    Creator?: string;
    CreatorName?: string;
    Object?: string;
    ObjectName?: string;
    ObjectPhone?: string;
    ObjectEmail?: string;
    ObjectAddress?: string;
    ObjectTaxCode?: string;
    ObjectIdentifiedNumber?: string;
    Amount?: number;
    Currency?: string;
    RelationVoucher?: string;
    Details?: OtherBusinessVoucherDetailModel[];
    State?: string;
    Permission?: string;
}

export interface OtherBusinessVoucherDetailModel {
    Id?: string;
    Voucher?: string;
    RelateCode?: string;
    Description?: string;
    Amount?: number;
    Currency?: string;
    AccountingBusiness?: string;
    DebitAccount?: string;
    CreditAccount?: string;
    DebitObject?: string;
    DebitObjectName?: string;
    CreditObject?: string;
    CreditObjectName?: string;
}

export interface AccBank {
    [key: string]: any;
    Id?: string;
    Code?: string;
    Name?: string;
    Logo?: string;
    ShortName?: string;
    Description?: string;
    EnglishName?: string;
    Address?: string;
}

export interface AccBankAccount {
    [key: string]: any;
    Id?: string;
    Code?: string;
    AccountNumber?: string;
    Name?: string;
    Branch?: string;
    Province?: string;
    BranchAddress?: string;
    Owner?: string;
    Description?: string;
}
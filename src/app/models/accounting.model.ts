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
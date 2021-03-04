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
    Amount?: string;
    Currency?: string;
    RelationVoucher?: string;
    Details?: CashVoucherDetailModel[];
}

export interface CashVoucherDetailModel {
    Id?: string;
    Voucher?: string;
    RelateCode?: string;
    Description?: string;
    Amount?: string;
    Currency?: string;
    AccountingBusiness?: string;
}
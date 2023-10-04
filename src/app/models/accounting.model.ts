import { ProductModel } from "./product.model";
import { UnitModel } from "./unit.model";

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
    NumOfChildren?: number;
    ReportByObject?: string;
    ReportByBankAccount?: string;
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
    StateLabel?: string;
    Permission?: string;
    BankAccount?: string;
    Bank?: string;
}

export interface CashVoucherDetailModel {
    Id?: string;
    SystemUuid?: string;
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
    Product?: ProductModel;
    Unit?: UnitModel;
    Quantity?: number;
    RelationVoucher?: string;
    Details?: OtherBusinessVoucherDetailModel[];
    State?: string;
    Permission?: string;

    RelativeVouchers?: any[];

    Thread?: string;
}

export interface OtherBusinessVoucherDetailModel {
    Id?: string;
    Voucher?: string;
    RelateCode?: string;
    Description?: string;
    Product?: Partial<ProductModel>;
    Unit?: Partial<UnitModel>;
    Quantity?: number ;
    Price?: number ;
    Amount?: number;
    Currency?: string;
    AccountingBusiness?: string;
    CostClassification?: string;
    DebitAccount?: string;
    CreditAccount?: string;
    DebitObject?: string;
    DebitObjectName?: string;
    CreditObject?: string;
    CreditObjectName?: string;

    RelateDetail?: string;
}

export interface AccBankModel {
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

export interface AccBankAccountModel {
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
export interface AccMasterBookModel {
    [key: string]: any;
    Id?: string;
    Code?: string;
    Branch?: string;
    Year?: string;
    Creator?: string;
    DateOfCreate?: string;
    State?: string;
    PreviousBook?: string;
    DateOfStart?: string;
    DateOfEnd?: string;
    DateOfBeginning?: string;
    Commited?: string;
}
export interface AccMasterBookEntryModel {
    [key: string]: any;
    Id?: string;
    MasterBook?: string;
    Type?: string;
    WriteType?: string;
    Branch?: string;
    Account?: string;
    ContraAccount?: string;
    Voucher?: string;
    VoucherType?: string;
    VoucherDate?: string;
    WriteNo?: string;
    Object?: string;
    Description?: string;
    VoucherDescription?: string;
    Product?: string;
    ProductUnit?: string;
    BankAccount?: string;
    Debit?: string;
    Credit?: string;
    Writer?: string;
    DateOfWriting?: string;
    State?: string;
    RelativeStaff?: string;
}
export interface CostClassificationModel {
    [key: string]: any;
    Id?: string;
    Code?: string;
    Parent?: Partial<CostClassificationModel> | string;
    Name?: string;
    Description?: string;
}
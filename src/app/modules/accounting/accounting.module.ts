import { AccAccountFormComponent } from "./acc-account/acc-account-form/acc-account-form.component";
import { AccAccountListComponent } from "./acc-account/acc-account-list/acc-account-list.component";
import { AccBusinessFormComponent } from "./acc-business/acc-business-form/acc-business-form.component";
import { AccBusinessListComponent } from "./acc-business/acc-business-list/acc-business-list.component";
import { AccountingRevenueStatisticsComponent } from "./accounting-dashboard/accounting-dashboard-statistics.component";
import { AccountingDashboardComponent } from "./accounting-dashboard/accounting-dashboard.component";
import { AccountingMostOfDebtComponent } from "./accounting-dashboard/accounting-most-of-debt/accounting-most-of-debt.component";
import { AccountingBankAccountFormComponent } from "./bank-account/accounting-bank-account-form/accounting-bank-account-form.component";
import { AccountingBankAccountListComponent } from "./bank-account/accounting-bank-account-list/accounting-bank-account-list.component";
import { AccountingBankFormComponent } from "./bank/accounting-bank-form/accounting-bank-form.component";
import { AccountingBankListComponent } from "./bank/accounting-bank-list/accounting-bank-list.component";
import { CashPaymentVoucherFormComponent } from "./cash/payment/cash-payment-voucher-form/cash-payment-voucher-form.component";
import { CashPaymentVoucherListComponent } from "./cash/payment/cash-payment-voucher-list/cash-payment-voucher-list.component";
import { CashPaymentVoucherPrintComponent } from "./cash/payment/cash-payment-voucher-print/cash-payment-voucher-print.component";
import { CashReceiptVoucherFormComponent } from "./cash/receipt/cash-receipt-voucher-form/cash-receipt-voucher-form.component";
import { CashReceiptVoucherListComponent } from "./cash/receipt/cash-receipt-voucher-list/cash-receipt-voucher-list.component";
import { CashReceiptVoucherPrintComponent } from "./cash/receipt/cash-receipt-voucher-print/cash-receipt-voucher-print.component";
import { AccCostClassificationFormComponent } from "./cost-classification/cost-classification-form/cost-classification-form.component";
import { AccCostClassificationListComponent } from "./cost-classification/cost-classification-list/cost-classification-list.component";
import { AccCostClassificationPrintComponent } from "./cost-classification/cost-classification-print/cost-classification-print.component";
import { AccMasterBookFormComponent } from "./master-book/acc-master-book-form/acc-master-book-form.component";
import { AccMasterBookHeadAmountComponent } from "./master-book/acc-master-book-head-amount/acc-master-book-head-amount.component";
import { AccMasterBookHeadBankAccountAmountComponent } from "./master-book/acc-master-book-head-bank-account-amount/acc-master-book-head-bank-account-amount.component";
import { AccMasterBookHeadObjectAmountComponent } from "./master-book/acc-master-book-head-object-amount/acc-master-book-head-object-amount.component";
import { AccMasterBookListComponent } from "./master-book/acc-master-book-list/acc-master-book-list.component";
import { AccountingOtherBusinessVoucherFormComponent } from './other-business-voucher/accounting-other-business-voucher-form/accounting-other-business-voucher-form.component';
import { AccountingOtherBusinessVoucherListComponent } from "./other-business-voucher/accounting-other-business-voucher-list/accounting-other-business-voucher-list.component";
import { AccountingOtherBusinessVoucherPrintComponent } from "./other-business-voucher/accounting-other-business-voucher-print/accounting-other-business-voucher-print.component";
import { AccountingCashFlowReportComponent } from "./reports/accounting-cash-flow-report/accounting-cash-flow-report.component";
import { AccountingContributedCapitalReportComponent } from "./reports/accounting-contributed-capital-report/accounting-contributed-capital-report.component";
import { AccountingDetailByObjectReportAgComponent } from "./reports/accounting-detail-by-object-report-ag/accounting-detail-by-object-report-ag.component";
import { AccountingDetailByObjectReportComponent } from "./reports/accounting-detail-by-object-report/accounting-detail-by-object-report.component";
import { AccountingLiabilitiesReportComponent } from "./reports/accounting-liabilities-report/accounting-liabilities-report.component";
import { AccountingProfitReportComponent } from "./reports/accounting-profit-report/accounting-profit-report.component";
import { AccountingReceivablesFromCustomersReportComponent } from "./reports/accounting-receivables-from-customers-report/accounting-receivables-from-customers-report.component";
import { AccountingReceivablesFromEmployeeReportComponent } from "./reports/accounting-receivables-from-employee-report/accounting-receivables-from-employee-report.component";
import { AccountingReceivablesReportComponent } from "./reports/accounting-receivables-report/accounting-receivables-report.component";
import { AccountingReportComponent } from "./reports/accounting-report.component";
import { AccountingContraAccountReportComponent } from "./reports/contra-account-report/accounting-contra-account-report.component";
import { AccountingAccountDetailsReportPrintComponent } from "./reports/print/accounting-account-details-report-print/accounting-account-details-report-print.component";
import { AccountingLiabilitiesDetailsReportPrintComponent } from "./reports/print/accounting-liabilities-details-report-print/accounting-liabilities-details-report-print.component";
import { AccountingLiabilitiesReportPrintComponent } from "./reports/print/accounting-liabilities-report-print/accounting-liabilities-report-print.component";
import { AccountingObjectCashFlowReportPrintComponent } from "./reports/print/accounting-object-cash-flow-report-print/accounting-object-cash-flow-report-print.component";
import { AccountingReceivablesFromCustomersDetailsReportPrintComponent } from "./reports/print/accounting-receivables-from-customers-details-report-print/accounting-receivables-from-customers-details-report-print.component";
import { AccountingReceivablesFromCustomersReportPrintComponent } from "./reports/print/accounting-receivables-from-customers-report-print/accounting-receivables-from-customers-report-print.component";
import { AccountingReceivablesFromCustomersVoucherssReportPrintComponent } from "./reports/print/accounting-receivables-from-customers-vouchers-report-print/accounting-receivables-from-customers-vouchers-report-print.component";
import { AccountingSummaryReportComponent } from "./reports/summary-report/accounting-summary-report.component";

export const accountingComponents = [
    CashReceiptVoucherListComponent,
    CashReceiptVoucherFormComponent,
    CashPaymentVoucherListComponent,
    CashPaymentVoucherFormComponent,
    CashReceiptVoucherFormComponent,
    CashReceiptVoucherListComponent,
    CashReceiptVoucherPrintComponent,
    CashPaymentVoucherPrintComponent,
    AccAccountListComponent,
    AccAccountFormComponent,
    AccBusinessListComponent,
    AccBusinessFormComponent,
    AccountingReportComponent,
    AccountingLiabilitiesReportComponent,
    AccountingReceivablesReportComponent,
    AccountingSummaryReportComponent,
    AccountingContraAccountReportComponent,
    AccountingReceivablesFromCustomersReportComponent,
    AccountingReceivablesFromEmployeeReportComponent,
    AccountingProfitReportComponent,
    AccountingDetailByObjectReportComponent,
    AccountingDetailByObjectReportAgComponent,
    AccountingOtherBusinessVoucherListComponent,
    AccountingOtherBusinessVoucherFormComponent,
    AccountingOtherBusinessVoucherPrintComponent,
    AccountingBankListComponent,
    AccountingBankFormComponent,
    AccountingBankAccountListComponent,
    AccountingBankAccountFormComponent,
    AccMasterBookListComponent,
    AccMasterBookFormComponent,
    AccMasterBookHeadAmountComponent,
    AccMasterBookHeadObjectAmountComponent,
    AccMasterBookHeadBankAccountAmountComponent,
    AccountingReceivablesFromCustomersReportPrintComponent,
    AccountingReceivablesFromCustomersDetailsReportPrintComponent,
    AccountingReceivablesFromCustomersVoucherssReportPrintComponent,
    AccountingObjectCashFlowReportPrintComponent,
    AccountingCashFlowReportComponent,
    AccountingLiabilitiesReportPrintComponent,
    AccountingLiabilitiesDetailsReportPrintComponent,
    AccountingDashboardComponent,
    AccountingRevenueStatisticsComponent,
    AccountingMostOfDebtComponent,
    AccountingAccountDetailsReportPrintComponent,
    AccountingContributedCapitalReportComponent,
    AccCostClassificationListComponent,
    AccCostClassificationFormComponent,
    AccCostClassificationPrintComponent,
];
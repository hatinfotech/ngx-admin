import { Routes } from "@angular/router";
import { AuthGuardService } from "../../services/auth-guard.service";
import { AccAccountFormComponent } from "./acc-account/acc-account-form/acc-account-form.component";
import { AccAccountListComponent } from "./acc-account/acc-account-list/acc-account-list.component";
import { AccBusinessFormComponent } from "./acc-business/acc-business-form/acc-business-form.component";
import { AccBusinessListComponent } from "./acc-business/acc-business-list/acc-business-list.component";
import { AccountingDashboardComponent } from "./accounting-dashboard/accounting-dashboard.component";
import { AccountingBankAccountFormComponent } from "./bank-account/accounting-bank-account-form/accounting-bank-account-form.component";
import { AccountingBankAccountListComponent } from "./bank-account/accounting-bank-account-list/accounting-bank-account-list.component";
import { AccountingBankFormComponent } from "./bank/accounting-bank-form/accounting-bank-form.component";
import { AccountingBankListComponent } from "./bank/accounting-bank-list/accounting-bank-list.component";
import { CashPaymentVoucherFormComponent } from "./cash/payment/cash-payment-voucher-form/cash-payment-voucher-form.component";
import { CashPaymentVoucherListComponent } from "./cash/payment/cash-payment-voucher-list/cash-payment-voucher-list.component";
import { CashReceiptVoucherFormComponent } from "./cash/receipt/cash-receipt-voucher-form/cash-receipt-voucher-form.component";
import { CashReceiptVoucherListComponent } from "./cash/receipt/cash-receipt-voucher-list/cash-receipt-voucher-list.component";
import { AccMasterBookListComponent } from "./master-book/acc-master-book-list/acc-master-book-list.component";
import { AccountingOtherBusinessVoucherListComponent } from "./other-business-voucher/accounting-other-business-voucher-list/accounting-other-business-voucher-list.component";
import { AccountingCashFlowReportComponent } from "./reports/accounting-cash-flow-report/accounting-cash-flow-report.component";
import { AccountingContributedCapitalReportComponent } from "./reports/accounting-contributed-capital-report/accounting-contributed-capital-report.component";
import { AccountingDetailByObjectReportComponent } from "./reports/accounting-detail-by-object-report/accounting-detail-by-object-report.component";
import { AccountingLiabilitiesReportComponent } from "./reports/accounting-liabilities-report/accounting-liabilities-report.component";
import { AccountingProfitReportComponent } from "./reports/accounting-profit-report/accounting-profit-report.component";
import { AccountingReceivablesFromCustomersReportComponent } from "./reports/accounting-receivables-from-customers-report/accounting-receivables-from-customers-report.component";
import { AccountingReceivablesFromEmployeeReportComponent } from "./reports/accounting-receivables-from-employee-report/accounting-receivables-from-employee-report.component";
import { AccountingReceivablesReportComponent } from "./reports/accounting-receivables-report/accounting-receivables-report.component";
import { AccountingReportComponent } from "./reports/accounting-report.component";
import { AccountingContraAccountReportComponent } from "./reports/contra-account-report/accounting-contra-account-report.component";
import { AccountingSummaryReportComponent } from "./reports/summary-report/accounting-summary-report.component";
import { AccCostClassificationListComponent } from "./cost-classification/cost-classification-list/cost-classification-list.component";

export const accoutingRoutes: Routes = [
    {
        path: 'accounting/cash-receipt-voucher/list',
        canActivate: [AuthGuardService],
        component: CashReceiptVoucherListComponent,
        data: {
            reuse: true,
        },
    },
    {
        path: 'accounting/dashboard',
        canActivate: [AuthGuardService],
        component: AccountingDashboardComponent,
        data: {
            reuse: true,
        },
    },
    {
        path: 'accounting/cash-receipt-voucher/form',
        canActivate: [AuthGuardService],
        component: CashReceiptVoucherFormComponent,
    },
    {
        path: 'accounting/cash-receipt-voucher/form/:id',
        canActivate: [AuthGuardService],
        component: CashReceiptVoucherFormComponent,
    },
    // Cash payment voucher
    {
        path: 'accounting/cash-payment-voucher/list',
        canActivate: [AuthGuardService],
        component: CashPaymentVoucherListComponent,
        data: {
            reuse: true,
        },
    },
    {
        path: 'accounting/cash-payment-voucher/form',
        canActivate: [AuthGuardService],
        component: CashPaymentVoucherFormComponent,
    },
    {
        path: 'cash-payment-voucher/form/:id',
        canActivate: [AuthGuardService],
        component: CashPaymentVoucherFormComponent,
    },
    // account
    {
        path: 'accounting/account/list',
        canActivate: [AuthGuardService],
        component: AccAccountListComponent,
        data: {
            reuse: true,
        },
    },
    {
        path: 'accounting/account/form',
        canActivate: [AuthGuardService],
        component: AccAccountFormComponent,
    },
    {
        path: 'accounting/account/form/:id',
        canActivate: [AuthGuardService],
        component: AccAccountFormComponent,
    },
    // accounting business
    {
        path: 'accounting/business/list',
        canActivate: [AuthGuardService],
        component: AccBusinessListComponent,
        data: {
            reuse: true,
        },
    },
    {
        path: 'accounting/business/form',
        canActivate: [AuthGuardService],
        component: AccBusinessFormComponent,
    },
    {
        path: 'accounting/report',
        canActivate: [AuthGuardService],
        component: AccountingReportComponent,
        children: [
            {
                path: '',
                redirectTo: 'summary',
                pathMatch: 'full',
            },
            {
                path: 'summary',
                component: AccountingSummaryReportComponent,
                data: {
                    reuse: true,
                },
            },
            {
                path: 'contra-account',
                component: AccountingContraAccountReportComponent,
                data: {
                    reuse: true,
                },
            },
            {
                path: 'cash-flow',
                component: AccountingCashFlowReportComponent,
                data: {
                    reuse: true,
                },
            },
            {
                path: 'liabilities',
                component: AccountingLiabilitiesReportComponent,
                data: {
                    reuse: true,
                },
            },
            {
                path: 'receivables',
                component: AccountingReceivablesReportComponent,
                data: {
                    reuse: true,
                },
            },
            {
                path: 'receivables-from-employee-report',
                component: AccountingReceivablesFromEmployeeReportComponent,
                data: {
                    reuse: true,
                },
            },
            {
                path: 'receivables-from-customers-report',
                component: AccountingReceivablesFromCustomersReportComponent,
                data: {
                    reuse: true,
                },
            },
            {
                path: 'profit-report',
                component: AccountingProfitReportComponent,
                data: {
                    reuse: true,
                },
            },
            {
                path: 'contributed-capital-report',
                component: AccountingContributedCapitalReportComponent,
                data: {
                    reuse: true,
                },
            },
        ],
    },
    {
        path: 'accounting/reports/detail-by-object-report',
        component: AccountingDetailByObjectReportComponent,
        data: {
            reuse: true,
        },
    },
    {
        path: 'accounting/other-business-voucher/list',
        component: AccountingOtherBusinessVoucherListComponent,
        data: {
            reuse: true,
        },
    },
    // accounting bank
    {
        path: 'accounting/bank/list',
        canActivate: [AuthGuardService],
        component: AccountingBankListComponent,
        data: {
            reuse: true,
        },
    },
    {
        path: 'accounting/bank/form',
        canActivate: [AuthGuardService],
        component: AccountingBankFormComponent,
    },
    // accounting bank account
    {
        path: 'accounting/bank-account/list',
        canActivate: [AuthGuardService],
        component: AccountingBankAccountListComponent,
        data: {
            reuse: true,
        },
    },
    {
        path: 'accounting/bank-account/form',
        canActivate: [AuthGuardService],
        component: AccountingBankAccountFormComponent,
    },
    {
        path: 'accounting/master-book/list',
        canActivate: [AuthGuardService],
        component: AccMasterBookListComponent,
        data: {
            reuse: true,
        },
    },
    // Cost classification
    {
        path: 'accounting/cost-classification/list',
        component: AccCostClassificationListComponent,
        data: {
            reuse: true,
        },
    },
];
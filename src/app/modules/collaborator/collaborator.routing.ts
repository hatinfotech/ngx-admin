import { Routes } from "@angular/router";
import { AuthGuardService } from "../../services/auth-guard.service";
import { CoreConnectionListComponent } from "../core-connection/core-connection-list/core-connection-list.component";
import { CollaboratorAddonStrategyListComponent } from "./addon-strategy/addon-strategy-list/collaborator-addon-strategy-list.component";
import { CollaboratorAdvanceStrategyListComponent } from "./advance-strategy/advance-strategy-list/collaborator-advance-strategy-list.component";
import { CollaboratorAwardListComponent } from "./award/collaborator-award-list/collaborator-award-list.component";
import { CollaboratorBasicStrategyListComponent } from "./basic-strategy/basic-strategy-list/collaborator-basic-strategy-list.component";
import { CollaboratorPageDashboardComponent } from "./collaborator-page-dashboard/collaborator-page-dashboard.component";
import { CollaboratorPageReportComponent } from "./collaborator-page-report/collaborator-page-report.component";
import { CollaboratorPageComponent } from "./collaborator-page/collaborator-page.component";
import { CollaboratorPublisherDashboardComponent } from "./collaborator-publisher-dashboard/collaborator-publisher-dashboard.component";
import { CollaboratorPublisherReportComponent } from "./collaborator-publisher-report/collaborator-publisher-report.component";
import { CollaboratorPublisherSummaryComponent } from "./collaborator-publisher-summary/collaborator-publisher-summary.component";
import { CollaboratorPublisherComponent } from "./collaborator-publisher/collaborator-publisher.component";
import { CollaboratorCommissionPaymentListComponent } from "./commission-payment/collaborator-commission-payment-list/collaborator-commission-payment-list.component";
import { CollaboratorCommissionListComponent } from "./commission/collaborator-commission-list/collaborator-commission-list.component";
import { CollaboratorEducationArticleListComponent } from "./education-article/education-article-list/collaborator-education-article-list.component";
import { CollaboratorOrderFormComponent } from "./order/collaborator-order-form/collaborator-order-form.component";
import { CollaboratorOrderListComponent } from "./order/collaborator-order-list/collaborator-order-list.component";
import { CollaboratorPageListComponent } from "./page/collaborator-page-list/collaborator-page-list.component";
import { CollaboratorSubscriptionPageListComponent } from "./page/collaborator-subscription-page-list/collaborator-subscription-page-list.component";
import { CollaboratorProductListComponent } from "./product/collaborator-product-list/collaborator-product-list.component";
import { CollaboratorSubscriptionProductComponent } from "./product/collaborator-subscription-product/collaborator-subscription-product.component";
import { CollaboratorPublisherListComponent } from "./publisher/collaborator-publisher-list/collaborator-publisher-list.component";
import { CollaboratorRebuyStrategyListComponent } from "./rebuy-strategy/rebuy-strategy-list/collaborator-rebuy-strategy-list.component";
import { CollaboratorDashboardComponent } from "./collaborator-dashboard/collaborator-dashboard.component";
import { CollaboratorCommissionIncurredListComponent } from "./commission-incurred/commission-incurred-list/commission-incurred-list.component";
import { CollaboratorStrategyCompileRuleListComponent } from "./strategy-compile-rules/strategy-compile-rule-list/strategy-compile-rule-list.component";
import { CollaboratorKpiIndicatorListComponent } from "./kpi/kpi-indicator/kpi-indicator-list/kpi-indicator-list.component";
import { CollaboratorKpiGroupListComponent } from "./kpi/kpi-group/kpi-group-list/kpi-group-list.component";
import { CollaboratorEmployeeGroupListComponent } from "./employee-group/employee-group-list/employee-group-list.component";
import { CollaboratorKpiStrategyListComponent } from "./kpi/kpi-strategy/kpi-strategy-list/kpi-strategy-list.component";
import { CollaboratorKpiAwardListComponent } from "./kpi/kpi-award/kpi-award-list/kpi-award-list.component";
import { CollaboratorKpiDistributedContractListComponent } from "./kpi/kpi-distributed-contract/kpi-distributed-contract-list/kpi-distributed-contract-list.component";
import { CollaboratorKpiDashboardComponent } from "./kpi/kpi-dashboard/kpi-dashboard.component";

export const collaboratorRoutes: Routes = [
    {
        path: 'collaborator/page/list',
        canActivate: [AuthGuardService],
        component: CollaboratorPageListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/publisher/list',
        canActivate: [AuthGuardService],
        component: CollaboratorPublisherListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/product/list',
        canActivate: [AuthGuardService],
        component: CollaboratorProductListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/page/dashboard',
        canActivate: [AuthGuardService],
        component: CollaboratorDashboardComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'core-connection/list',
        canActivate: [AuthGuardService],
        component: CoreConnectionListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/page',
        canActivate: [AuthGuardService],
        component: CollaboratorPageComponent,
        children: [
          // {
          //   path: '',
          //   redirectTo: 'summary',
          //   pathMatch: 'full',
          // },
          // {
          //   path: 'summary',
          //   component: CollaboratorPageDashboardComponent,
          //   data: {
          //     reuse: true,
          //   },
          // },
          {
            path: 'report',
            component: CollaboratorPageReportComponent,
            data: {
              reuse: true,
            },
          },
          {
            path: 'publisher/list',
            component: CollaboratorPublisherListComponent,
            data: {
              reuse: true,
            },
          },
          {
            path: 'page-list',
            component: CollaboratorPageListComponent,
            data: {
              reuse: true,
            },
          },
          {
            path: 'order/list',
            component: CollaboratorOrderListComponent,
            data: {
              reuse: true,
            },
          },
          {
            path: 'order/form',
            component: CollaboratorOrderFormComponent,
          },
          {
            path: 'order/form/:id',
            component: CollaboratorOrderFormComponent,
          },
          {
            path: 'product/list',
            component: CollaboratorProductListComponent,
            data: {
              reuse: true,
            },
          },
          {
            path: 'commission-payment/list',
            component: CollaboratorCommissionPaymentListComponent,
            data: {
              reuse: true,
            },
          },
          {
            path: 'commission/list',
            component: CollaboratorCommissionListComponent,
            data: {
              reuse: true,
            },
          },
          {
            path: 'award/list',
            component: CollaboratorAwardListComponent,
            data: {
              reuse: true,
            },
          },
        ]
      },
      {
        path: 'collaborator/education/article/list',
        canActivate: [AuthGuardService],
        component: CollaboratorEducationArticleListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/publisher/dashboard',
        canActivate: [AuthGuardService],
        component: CollaboratorPublisherDashboardComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/publisher',
        canActivate: [AuthGuardService],
        component: CollaboratorPublisherComponent,
        children: [
          {
            path: '',
            redirectTo: 'summary',
            pathMatch: 'full',
          },
          {
            path: 'summary',
            component: CollaboratorPublisherSummaryComponent,
            data: {
              reuse: true,
            },
          },
          {
            path: 'report',
            component: CollaboratorPublisherReportComponent,
            data: {
              reuse: true,
            },
          },
          {
            path: 'subscription-page/list',
            component: CollaboratorSubscriptionPageListComponent,
            data: {
              reuse: true,
            },
          },
          {
            path: 'order/list',
            component: CollaboratorOrderListComponent,
            data: {
              reuse: true,
            },
          },
          {
            path: 'product/list',
            component: CollaboratorSubscriptionProductComponent,
            data: {
              reuse: true,
            },
          },
          {
            path: 'commission-payment/list',
            component: CollaboratorCommissionPaymentListComponent,
            data: {
              reuse: true,
            },
          },
          {
            path: 'commission/list',
            component: CollaboratorCommissionListComponent,
            data: {
              reuse: true,
            },
          },
          {
            path: 'award/list',
            component: CollaboratorAwardListComponent,
            data: {
              reuse: true,
            },
          },
          {
            path: 'award/list',
            component: CollaboratorAwardListComponent,
            data: {
              reuse: true,
            },
          },
        ]
      },
      {
        path: 'collaborator/page-report',
        canActivate: [AuthGuardService],
        component: CollaboratorPageReportComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/publisher-summary',
        canActivate: [AuthGuardService],
        component: CollaboratorPublisherSummaryComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/publisher-report',
        canActivate: [AuthGuardService],
        component: CollaboratorPublisherReportComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/order/list',
        canActivate: [AuthGuardService],
        component: CollaboratorOrderListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/basic-strategy/list',
        canActivate: [AuthGuardService],
        component: CollaboratorBasicStrategyListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/advance-strategy/list',
        canActivate: [AuthGuardService],
        component: CollaboratorAdvanceStrategyListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/add-on-strategy/list',
        canActivate: [AuthGuardService],
        component: CollaboratorAddonStrategyListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/rebuy-strategy/list',
        canActivate: [AuthGuardService],
        component: CollaboratorRebuyStrategyListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/commission-incurred/list',
        canActivate: [AuthGuardService],
        component: CollaboratorCommissionIncurredListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/strategy-compile-rule/list',
        canActivate: [AuthGuardService],
        component: CollaboratorStrategyCompileRuleListComponent,
        data: {
          reuse: true,
        },
      },

      //KPI
      {
        path: 'collaborator/kpi/indicators',
        canActivate: [AuthGuardService],
        component: CollaboratorKpiIndicatorListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/kpi/group/list',
        canActivate: [AuthGuardService],
        component: CollaboratorKpiGroupListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/kpi/employee-group/list',
        canActivate: [AuthGuardService],
        component: CollaboratorEmployeeGroupListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/kpi/strategy/list',
        canActivate: [AuthGuardService],
        component: CollaboratorKpiStrategyListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/kpi/award/list',
        canActivate: [AuthGuardService],
        component: CollaboratorKpiAwardListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/kpi/distributed-contract/list',
        canActivate: [AuthGuardService],
        component: CollaboratorKpiDistributedContractListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'collaborator/kpi/dashboard',
        canActivate: [AuthGuardService],
        component: CollaboratorKpiDashboardComponent,
        data: {
          reuse: true,
        },
      },
];
import { Route } from "@angular/router";
import { AuthGuardService } from "../../services/auth-guard.service";
import { WarehouseBookFormComponent } from "./book/warehouse-book-form/warehouse-book-form.component";
import { WarehouseBookListComponent } from "./book/warehouse-book-list/warehouse-book-list.component";
import { WarehouseGoodsContainerFormComponent } from "./goods-container/warehouse-goods-container-form/warehouse-goods-container-form.component";
import { WarehouseGoodsContainerListComponent } from "./goods-container/warehouse-goods-container-list/warehouse-goods-container-list.component";
import { WarehouseGoodsDeliveryNoteFormComponent } from "./goods-delivery-note/warehouse-goods-delivery-note-form/warehouse-goods-delivery-note-form.component";
import { WarehouseGoodsDeliveryNoteListComponent } from "./goods-delivery-note/warehouse-goods-delivery-note-list/warehouse-goods-delivery-note-list.component";
import { WarehouseGoodsReceiptNoteFormComponent } from "./goods-receipt-note/warehouse-goods-receipt-note-form/warehouse-goods-receipt-note-form.component";
import { WarehouseGoodsReceiptNoteListComponent } from "./goods-receipt-note/warehouse-goods-receipt-note-list/warehouse-goods-receipt-note-list.component";
import { WarehouseGoodsFormComponent } from "./goods/warehouse-goods-form/warehouse-goods-form.component";
import { WarehouseGoodsListComponent } from "./goods/warehouse-goods-list/warehouse-goods-list.component";
import { WarehouseInventoryAdjustNoteListComponent } from "./inventory-adjust-note/inventory-adjust-note-list/inventory-adjust-note-list.component";
import { WarehouseSummaryReportComponent } from "./reports/summary-report/warehouse-summary-report.component";
import { WarehouseReportComponent } from "./reports/warehouse-report.component";
import { WarehouseDashboardComponent } from "./warehouse-dashboard/warehouse-dashboard.component";
import { WarehouseFormComponent } from "./warehouse/warehouse-form/warehouse-form.component";
import { WarehouseListComponent } from "./warehouse/warehouse-list/warehouse-list.component";
import { ProductionOrderListComponent } from "./production-order/production-order-list/production-order-list.component";

export const warehouseRoutes: Route[] = [
    {
        path: 'warehouse/goods-receipt-note/list',
        canActivate: [AuthGuardService],
        component: WarehouseGoodsReceiptNoteListComponent,
        data: {
            reuse: true,
        },
    },
    {
        path: 'warehouse/goods-receipt-note/form',
        canActivate: [AuthGuardService],
        component: WarehouseGoodsReceiptNoteFormComponent,
    },
    {
        path: 'warehouse/goods-receipt-note/form/:id',
        canActivate: [AuthGuardService],
        component: WarehouseGoodsReceiptNoteFormComponent,
    },
    // goods delivery note
    {
        path: 'warehouse/goods-delivery-note/list',
        canActivate: [AuthGuardService],
        component: WarehouseGoodsDeliveryNoteListComponent,
        data: {
            reuse: true,
        },
    },
    {
        path: 'warehouse/goods-delivery-note/form',
        canActivate: [AuthGuardService],
        component: WarehouseGoodsDeliveryNoteFormComponent,
    },
    {
        path: 'warehouse/goods-delivery-note/form/:id',
        canActivate: [AuthGuardService],
        component: WarehouseGoodsDeliveryNoteFormComponent,
    },
    // goods delivery note
    {
        path: 'warehouse/inventory-adjust-note/list',
        canActivate: [AuthGuardService],
        component: WarehouseInventoryAdjustNoteListComponent,
        data: {
            reuse: true,
        },
    },
    // goods container
    {
        path: 'warehouse/goods-container/list',
        canActivate: [AuthGuardService],
        component: WarehouseGoodsContainerListComponent,
        data: {
            reuse: true,
        },
    },
    {
        path: 'warehouse/goods-container/form',
        canActivate: [AuthGuardService],
        component: WarehouseGoodsContainerFormComponent,
    },
    {
        path: 'warehouse/goods-container/form/:id',
        canActivate: [AuthGuardService],
        component: WarehouseGoodsContainerFormComponent,
    },
    // warehouse
    {
        path: 'warehouse/warehouse/list',
        canActivate: [AuthGuardService],
        component: WarehouseListComponent,
        data: {
            reuse: true,
        },
    },
    {
        path: 'warehouse/warehouse/form',
        canActivate: [AuthGuardService],
        component: WarehouseFormComponent,
    },
    {
        path: 'warehouse/warehouse/form/:id',
        canActivate: [AuthGuardService],
        component: WarehouseFormComponent,
    },
    // warehouse book
    {
        path: 'warehouse/book/list',
        canActivate: [AuthGuardService],
        component: WarehouseBookListComponent,
        data: {
            reuse: true,
        },
    },
    {
        path: 'warehouse/book/form',
        canActivate: [AuthGuardService],
        component: WarehouseBookFormComponent,
    },
    {
        path: 'warehouse/book/form/:id',
        canActivate: [AuthGuardService],
        component: WarehouseBookFormComponent,
    },
    // warehouse goods
    {
        path: 'warehouse/goods/list',
        canActivate: [AuthGuardService],
        component: WarehouseGoodsListComponent,
        data: {
            reuse: true,
        },
    },
    {
        path: 'warehouse/goods/form',
        canActivate: [AuthGuardService],
        component: WarehouseGoodsFormComponent,
    },
    {
        path: 'warehouse/goods/form/:id',
        canActivate: [AuthGuardService],
        component: WarehouseGoodsFormComponent,
    },
    {
        path: 'warehouse/dashboard',
        canActivate: [AuthGuardService],
        component: WarehouseDashboardComponent,
        data: {
            reuse: true,
        },
    },
    {
        path: 'warehouse/report',
        canActivate: [AuthGuardService],
        component: WarehouseReportComponent,
        children: [
            {
                path: '',
                redirectTo: 'summary',
                pathMatch: 'full',
            },
            {
                path: 'summary',
                component: WarehouseSummaryReportComponent,
                data: {
                    reuse: true,
                },
            },
        ],
    },
    // production order
    {
        path: 'warehouse/production-order/list',
        canActivate: [AuthGuardService],
        component: ProductionOrderListComponent,
        data: {
            reuse: true,
        },
    },
];
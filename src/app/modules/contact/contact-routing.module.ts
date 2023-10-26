import { Routes } from "@angular/router";
import { AuthGuardService } from "../../services/auth-guard.service";
import { ContactAllListComponent } from "./contact-all-list/contact-all-list.component";
import { ContactCustomerListComponent } from "./contact-customer-list/contact-customer-list.component";
import { ContactEmployeeListComponent } from "./contact-employee-list/contact-employee-list.component";
import { ContactRemovedListComponent } from "./contact-removed-list/contact-removed-list.component";
import { ContactSupplierListComponent } from "./contact-supplier-list/contact-supplier-list.component";
import { ContactListComponent } from "./contact/contact-list/contact-list.component";
import { ContactGroupListComponent } from "./contact-group/contact-group-list/contact-group-list.component";

export const contactRoutes: Routes = [
    {
        path: 'contact',
        canActivate: [AuthGuardService],
        component: ContactListComponent,
        // data: {
        //   reuse: true,
        // },
        children: [
            {
                path: '',
                redirectTo: 'all',
                pathMatch: 'full',
            },
            {
                path: 'all',
                component: ContactAllListComponent,
                data: {
                    reuse: true,
                },
            },
            {
                path: 'customer',
                component: ContactCustomerListComponent,
                data: {
                    reuse: true,
                },
            },
            {
                path: 'supplier',
                component: ContactSupplierListComponent,
                data: {
                    reuse: true,
                },
            },
            {
                path: 'employee',
                component: ContactEmployeeListComponent,
                data: {
                    reuse: true,
                },
            },
            {
                path: 'removed',
                component: ContactRemovedListComponent,
                data: {
                    reuse: true,
                },
            },
        ],
    },
    {
        path: 'contact/group/list',
        component: ContactGroupListComponent,
        data: {
            reuse: true,
        },
    },
];

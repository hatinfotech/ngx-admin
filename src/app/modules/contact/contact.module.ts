import { ContactAllListComponent } from "./contact-all-list/contact-all-list.component";
import { ContactCustomerListComponent } from "./contact-customer-list/contact-customer-list.component";
import { ContactEmployeeListComponent } from "./contact-employee-list/contact-employee-list.component";
import { ContactGroupFormComponent } from "./contact-group/contact-group-form/contact-group-form.component";
import { ContactGroupListComponent } from "./contact-group/contact-group-list/contact-group-list.component";
import { ContactRemovedListComponent } from "./contact-removed-list/contact-removed-list.component";
import { ContactSupplierListComponent } from "./contact-supplier-list/contact-supplier-list.component";
import { ContactFormComponent } from "./contact/contact-form/contact-form.component";
import { ContactListComponent } from "./contact/contact-list/contact-list.component";
import { ImportContactsDialogComponent } from "./import-contacts-dialog/import-contacts-dialog.component";

export const contactComponents = [
    ContactFormComponent,
    ContactListComponent,
    ContactSupplierListComponent,
    ContactCustomerListComponent,
    ContactEmployeeListComponent,
    ContactRemovedListComponent,
    ContactAllListComponent,
    ImportContactsDialogComponent,
    ContactGroupListComponent,
    ContactGroupFormComponent
];
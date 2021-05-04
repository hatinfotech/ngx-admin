import { AgGridModule } from "@ag-grid-community/angular";
import { CommonModule, CurrencyPipe, DecimalPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbCheckboxModule, NbIconModule, NbButtonModule, NbInputModule, NbSelectModule, NbCardModule } from "@nebular/theme";
import { TranslateModule } from "@ngx-translate/core";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { CurrencyMaskModule } from "ng2-currency-mask";
import { Select2Module } from "../../vendor/ng2select2/lib/ng2-select2";
import { NgxUploaderModule } from "../../vendor/ngx-uploader/src/public_api";
import { CustomElementModule } from "./custom-element/custom-element.module";
import { ResourcePermissionEditComponent } from "./lib-system/components/resource-permission-edit/resource-permission-edit.component";

@NgModule({
  declarations: [
    ResourcePermissionEditComponent,
  ],
  imports: [
    CommonModule,
    Select2Module,
    NbCheckboxModule,
    NbIconModule,
    NbButtonModule,
    FormsModule,
    NbInputModule,
    AgGridModule,
    NbSelectModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TranslateModule,
    CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUploaderModule,
    NbCardModule,
    CustomElementModule,
  ],
  exports: [
    ResourcePermissionEditComponent,
  ],
  providers: [
    { provide: CurrencyPipe, useValue: {} },
    { provide: DecimalPipe, useValue: {} },
  ],
})
export class LibSystemModule { }

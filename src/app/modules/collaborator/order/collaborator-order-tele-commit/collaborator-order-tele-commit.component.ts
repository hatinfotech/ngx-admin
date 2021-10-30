import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { SalesMasterPriceTableDetailModel } from '../../../../models/sales.model';
import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { SalesPriceReportModel, SalesPriceReportDetailModel } from '../../../../models/sales.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PromotionActionModel } from '../../../../models/promotion.model';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { environment } from '../../../../../environments/environment';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { CustomIcon } from '../../../../lib/custom-element/form/form-group/form-group.component';
import { SalesPriceReportPrintComponent } from '../../../sales/price-report/sales-price-report-print/sales-price-report-print.component';
import { SalesPriceReportFormComponent } from '../../../sales/price-report/sales-price-report-form/sales-price-report-form.component';


@Component({
  selector: 'ngx-sales-price-report-form',
  templateUrl: './collaborator-order-tele-commit.component.html',
  styleUrls: ['./collaborator-order-tele-commit.component.scss'],
})
export class CollaboratorOrderTeleCommitFormComponent extends SalesPriceReportFormComponent implements OnInit {

  componentName: string = 'CollaboratorOrderTeleCommitFormComponent';
  

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<CollaboratorOrderTeleCommitFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService, ref);
    
    
  }
  
}

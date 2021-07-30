import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';

@Component({
  selector: 'ngx-warehouse-goods-form',
  templateUrl: './purchase-goods-form.component.html',
  styleUrls: ['./purchase-goods-form.component.scss'],
})
export class PurchaseGoodsFormComponent extends ProductFormComponent implements OnInit {

  componentName: string = 'PurchaseGoodsFormComponent';
  idKey = 'Code';
  apiPath = '/admin-product/products';
  baseFormUrl = '/admin-product/product/form';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref?: NbDialogRef<PurchaseGoodsFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService, ref);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}

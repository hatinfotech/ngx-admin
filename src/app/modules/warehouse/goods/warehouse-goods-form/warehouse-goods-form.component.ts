import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-warehouse-goods-form',
  templateUrl: './warehouse-goods-form.component.html',
  styleUrls: ['./warehouse-goods-form.component.scss'],
})
export class WarehouseGoodsFormComponent extends ProductFormComponent implements OnInit {

  componentName: string = 'WarehouseGoodsFormComponent';
  idKey = 'Code';
  apiPath = '/admin-product/products';
  baseFormUrl = '/admin-product/product/form';

  constructor(
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref?: NbDialogRef<WarehouseGoodsFormComponent>,
    public adminProductService?: AdminProductService,
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms, ref);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}

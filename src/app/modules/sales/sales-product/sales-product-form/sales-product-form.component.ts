import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductCategoryModel } from '../../../../models/product.model';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { SalesProductModel } from '../../../../models/sales.model';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-sale-product-form',
  templateUrl: './sales-product-form.component.html',
  styleUrls: ['./sales-product-form.component.scss'],
})
export class SaleProductFormComponent extends DataManagerFormComponent<SalesProductModel> implements OnInit {

  componentName: string = 'SaleProductFormComponent';
  idKey = ['Id'];
  baseFormUrl = '/sales/product/form';
  apiPath = '/sales/sales-products';

  select2OptionForParent = {
    placeholder: 'Chọn thuộc tính cha...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'ProductCategory',
      text: 'ProductCategoryName',
    },
    multiple: false,
    ajax: {
      // url: params => {
      //   return this.apiService.buildApiUrl('/admin-product/categories', { 'filter_Name': params['term'], select: 'Parent=>Parent,ProductCategory=>Code,ProductCategoryName=>Name' });
      // },      
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/admin-product/properties', { 'search': params['term'], includeIdText: true }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(item => {
            // item['id'] = item['ProductCategory'];
            // item['text'] = item['ProductCategoryName'];
            return item;
          }),
        };
      },
    },
  };

  constructor(
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<SaleProductFormComponent>,
    public adminProductService: AdminProductService,
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  select2ParamsOption = {
    placeholder: 'Brandname...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  select2OptionForValues: Select2Option = {
    placeholder: 'Chọn từ khóa...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    multiple: true,
    tags: true,
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: SalesProductModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeParent'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: ProductCategoryModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Product: [''],
      Customer: [''],
      Sku: ['', Validators.required],
      Name: [''],
      TaxName: [''],
      TaxValue: [''],
    });
    if (data) {
      data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: SalesProductModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/admin-product/category/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  async save(): Promise<SalesProductModel[]> {
    return super.save().then(rs => {
      this.adminProductService.updatePropertyList();
      return rs;
    });
  };
}

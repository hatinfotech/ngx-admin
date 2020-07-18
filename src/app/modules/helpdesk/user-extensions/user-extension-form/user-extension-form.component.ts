import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { HelpdeskUserModel } from '../../../../models/helpdesk.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { ProductCategoryFormComponent } from '../../../admin-product/category/product-category-form/product-category-form.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-user-extension-form',
  templateUrl: './user-extension-form.component.html',
  styleUrls: ['./user-extension-form.component.scss'],
})
export class UserExtensionFormComponent  extends DataManagerFormComponent<HelpdeskUserModel> implements OnInit {

  componentName: string = 'ProductCategoryFormComponent';
  idKey = 'Code';
  apiPath = '/admin-product/categories';
  baseFormUrl = '/admin-product/category/form';

  select2OptionForParent = {
    placeholder: 'Chọn danh mục...',
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
      url: params => {
        return this.apiService.buildApiUrl('/admin-product/categories', { 'filter_Name': params['term'], select: 'Parent=>Parent,ProductCategory=>Code,ProductCategoryName=>Name' });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['ProductCategory'];
            item['text'] = item['ProductCategoryName'];
            return item;
          }),
        };
      },
    },
  };

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<UserExtensionFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
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

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: HelpdeskUserModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeParent'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: HelpdeskUserModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code_old: [''],
      Code: [''],
      Parent: [''],
      Name: ['', Validators.required],
      FindOrder: [''],
    });
    if (data) {
      data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: HelpdeskUserModel): void {
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

}

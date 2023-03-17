import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminProductService } from '../../admin-product.service';
import { ProductCategoryModel, ProductKeywordModel } from '../../../../models/product.model';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';

@Component({
  selector: 'ngx-product-keyword-form',
  templateUrl: './product-keyword-form.component.html',
  styleUrls: ['./product-keyword-form.component.scss'],
})
export class ProductKeywordFormComponent extends DataManagerFormComponent<ProductKeywordModel> implements OnInit {

  componentName: string = 'ProductKeywordFormComponent';
  idKey = 'Id';
  apiPath = '/admin-product/keywords';
  baseFormUrl = '/admin-product/product-keyword/form';


  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<ProductKeywordFormComponent>,
    public adminProductService: AdminProductService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }


  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: ProductKeywordModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: ProductCategoryModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Keyword: ['', Validators.required],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: ProductKeywordModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/admin-product/product-keyword/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  async save(): Promise<ProductKeywordModel[]> {
    return super.save().then(rs => {
      this.adminProductService.updatePropertyList();
      return rs;
    });
  };
}

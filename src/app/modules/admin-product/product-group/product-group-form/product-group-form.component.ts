import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ProductGroupModel } from '../../../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminProductService } from '../../admin-product.service';

@Component({
  selector: 'ngx-product-group-form',
  templateUrl: './product-group-form.component.html',
  styleUrls: ['./product-group-form.component.scss'],
})
export class ProductGroupFormComponent extends DataManagerFormComponent<ProductGroupModel> implements OnInit {

  componentName: string = 'ProductGroupFormComponent';
  idKey = 'Code';
  apiPath = '/admin-product/groups';
  baseFormUrl = '/admin-product/group/form';


  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<ProductGroupFormComponent>,
    public adminProductService: AdminProductService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }


  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init(): Promise<boolean> {
    return super.init();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: ProductGroupModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeConditions'] = true;
    // params['includeProduct'] = true;
    // params['includeContact'] = true;
    // params['includeDetails'] = true;
    // params['useBaseTimezone'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: ProductGroupModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: ProductGroupModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }

      // return true;
    });

  }

  makeNewFormGroup(data?: ProductGroupModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code_old: [''],
      Code: [''],
      Name: ['', Validators.required],
      Description: [''],
    });
    if (data) {
      data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    } else {
      // this.addDetailFormGroup(newForm);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: ProductGroupModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/admin-product/group/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  async save(): Promise<ProductGroupModel[]> {
    return super.save().then(rs => {
      this.adminProductService.updateGroupList();
      return rs;
    });
  };
}

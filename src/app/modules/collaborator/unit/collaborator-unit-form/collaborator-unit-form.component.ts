import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ProductUnitModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'ngx-collaborator-unit-form',
  templateUrl: './collaborator-unit-form.component.html',
  styleUrls: ['./collaborator-unit-form.component.scss']
})
export class CollaboratorUnitFormComponent extends DataManagerFormComponent<ProductUnitModel> implements OnInit {

  componentName: string = 'CollaboratorUnitFormComponent';
  idKey = 'Code';
  apiPath = '/collaborator/product-units';
  baseFormUrl = '/collaborator/product-unit/form';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<CollaboratorUnitFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);
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
  executeGet(params: any, success: (resources: ProductUnitModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeParent'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: ProductUnitModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code_old: [''],
      Code: ['', Validators.required],
      Name: ['', Validators.required],
      FullName: [''],
      Symbol: ['', Validators.required],
    });
    if (data) {
      data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: ProductUnitModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/admin-product/units/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}

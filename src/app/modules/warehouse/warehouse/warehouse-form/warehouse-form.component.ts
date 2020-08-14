import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { WarehouseModel } from '../../../../models/warehouse.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-warehouse-form',
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.scss'],
})
export class WarehouseFormComponent extends DataManagerFormComponent<WarehouseModel> implements OnInit {

  componentName: string = 'WarehouseFormComponent';
  idKey = 'Code';
  baseFormUrl = '/warehouse/warehouse/form';
  apiPath = '/warehouse/warehouses';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<WarehouseFormComponent>,
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

  async init() {
    return super.init();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: WarehouseModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeParent'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: WarehouseModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code_old: [''],
      Code: [''],
      Name: ['', Validators.required],
      Description: [''],
      Branch: ['MAINBRANCH'],
    });
    if (data) {
      data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: WarehouseModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}

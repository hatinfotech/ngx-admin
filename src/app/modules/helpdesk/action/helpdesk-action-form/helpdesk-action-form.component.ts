import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HelpdeskActionModel } from '../../../../models/helpdesk.model';

@Component({
  selector: 'ngx-helpdesk-action-form',
  templateUrl: './helpdesk-action-form.component.html',
  styleUrls: ['./helpdesk-action-form.component.scss'],
})
export class HelpdeskActionFormComponent extends DataManagerFormComponent<HelpdeskActionModel> implements OnInit {

  componentName: string = 'HelpdeskActionFormComponent';
  idKey = 'Name';
  apiPath = '/helpdesk/actions';
  baseFormUrl = '/helpdesk/action/form';

  get formStructures() {
    return {
      'Main': {
        Name_old: [''],
        Name: ['', Validators.required],
        Description: ['', Validators.required],
        Params: this.formBuilder.array([]),
      },
      'Main.Params': {
        Id: [''],
        Name: ['', Validators.required],
        Description: [''],
        Type: ['', Validators.required],
        RemoteDataSource: [''],
        RemoteDataResource: [''],
        Options: this.formBuilder.array([]),
      },
      'Main.Params.Options': {
        Id: [''],
        Data: ['', Validators.required],
        Label: ['', Validators.required],
      },
    };
  }

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<HelpdeskActionFormComponent>,
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

  /** Execute api get */
  executeGet(params: any, success: (resources: HelpdeskActionModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeParams'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: HelpdeskActionModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: HelpdeskActionModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Options form load
      if (itemFormData.Params) {
        itemFormData.Params.forEach((param, paramIndex: number) => {
          const paramFormGroup = this.addChildFormGroup('Main.Params', newForm, index, param);

          if (param.Options) {
            param.Options.forEach(option => {
              this.addChildFormGroup('Main.Params.Options', paramFormGroup, paramIndex, option);
            });
          }
        });
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: HelpdeskActionModel): FormGroup {
    const newForm = this.formBuilder.group(this.formStructures['Main']);
    if (data) {
      if (data['Name']) data['Name_old'] = data['Name'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: HelpdeskActionModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/promotion/promotion/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}

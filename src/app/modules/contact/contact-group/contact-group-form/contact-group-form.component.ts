import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { RootServices } from '../../../../services/root.services';
import { ContactGroupModel } from '../../../../models/contact.model';

@Component({
  selector: 'ngx-contact-group-form',
  templateUrl: './contact-group-form.component.html',
  styleUrls: ['./contact-group-form.component.scss'],
})
export class ContactGroupFormComponent extends DataManagerFormComponent<ContactGroupModel> implements OnInit {

  componentName: string = 'ContactGroupFormComponent';
  idKey = 'Code';
  apiPath = '/contact/groups';
  baseFormUrl = '/contact/group/form';


  constructor(
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<ContactGroupFormComponent>,
    public adminProductService: AdminProductService,
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);
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
  executeGet(params: any, success: (resources: ContactGroupModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeConditions'] = true;
    // params['includeProduct'] = true;
    // params['includeContact'] = true;
    // params['includeDetails'] = true;
    // params['useBaseTimezone'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: ContactGroupModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: ContactGroupModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }

      // return true;
    });

  }

  makeNewFormGroup(data?: ContactGroupModel): FormGroup {
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
  onAddFormGroup(index: number, newForm: FormGroup, formData?: ContactGroupModel): void {
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

  async save(): Promise<ContactGroupModel[]> {
    return super.save().then(rs => {
      this.adminProductService.updateGroupList();
      return rs;
    });
  };
}

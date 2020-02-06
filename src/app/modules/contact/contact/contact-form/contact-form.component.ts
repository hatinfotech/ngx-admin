import { Component, OnInit, Input } from '@angular/core';
import { ContactModel } from '../../../../models/contact.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { MinierpService } from '../../../minierp/minierp-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';

@Component({
  selector: 'ngx-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent extends DataManagerFormComponent<ContactModel> implements OnInit {

  componentName: string = 'ContactFormComponent';
  idKey = 'Code';
  apiPath = '/contact/contacts';
  baseFormUrl = '/contact/contact/form';
  // @Input() title: string;
  // @Input() content: string;
  // @Input() actions: { label: string, icon?: string, status?: string, action?: () => void }[];

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    protected ref: NbDialogRef<ContactFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
    // if (this.inputId) {
    //   this.mode = 'dialog';
    // }
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: ContactModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: ContactModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Name: ['', Validators.required],
      Phone: ['', Validators.required],
      Email: ['', Validators.required],
      Address: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: ContactModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/contact/contact/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  onAfterCreateSubmit(newFormData: ContactModel[]) {
    super.onAfterCreateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }
  onAfterUpdateSubmit(newFormData: ContactModel[]) {
    super.onAfterUpdateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }

  dismiss() {
    this.ref.close();
  }
}

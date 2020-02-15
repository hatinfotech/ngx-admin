import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HelpdeskTicketModel } from '../../../../models/helpdesk-ticket.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';

@Component({
  selector: 'ngx-quick-ticket-form',
  templateUrl: './quick-ticket-form.component.html',
  styleUrls: ['./quick-ticket-form.component.scss'],
})
export class QuickTicketFormComponent extends DataManagerFormComponent<HelpdeskTicketModel> implements OnInit {

  componentName: string = 'QuickTicketFormComponent';
  idKey = 'Code';
  apiPath = '/contact/contacts';
  baseFormUrl = '/contact/contact/form';

  @Output() onClose = new EventEmitter<boolean>();

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  ngOnInit() {
    // this.restrict();
    super.ngOnInit();
    // if (this.inputId) {
    //   this.mode = 'dialog';
    // }
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: HelpdeskTicketModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: HelpdeskTicketModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Type: [''],
      Title: [''],
      Description: [''],
      ObjectName: [''],
      ObjectPhone: [''],
      ObjectEmail: [''],
      ObjectAddress: [''],
      WorkingName: [''],
      SupportedPerson: [''],
      SupportedPersonName: [''],
      SupportedPersonPhone: [''],
      SupportedPersonEmail: [''],
      State: [''],
      Service: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: HelpdeskTicketModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    // super.goback();
    // if (this.mode === 'page') {
    //   this.router.navigate(['/contact/contact/list']);
    // } else {
    //   this.ref.close();
    //   // this.dismiss();
    // }
    this.onClose.emit(true);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  onAfterCreateSubmit(newFormData: HelpdeskTicketModel[]) {
    super.onAfterCreateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }
  onAfterUpdateSubmit(newFormData: HelpdeskTicketModel[]) {
    super.onAfterUpdateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }

  // dismiss() {
  //   this.ref.close();
  // }
}

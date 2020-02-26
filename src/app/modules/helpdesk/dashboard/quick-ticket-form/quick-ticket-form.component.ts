import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { HelpdeskTicketModel } from '../../../../models/helpdesk-ticket.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { environment } from '../../../../../environments/environment';
import { ActionControl } from '../../../../interface/action-control.interface';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { ContactModel } from '../../../../models/contact.model';

@Component({
  selector: 'ngx-quick-ticket-form',
  templateUrl: './quick-ticket-form.component.html',
  styleUrls: ['./quick-ticket-form.component.scss'],
})
export class QuickTicketFormComponent extends DataManagerFormComponent<HelpdeskTicketModel> implements OnInit {

  env = environment;
  componentName: string = 'QuickTicketFormComponent';
  idKey = 'Code';
  apiPath = '/helpdesk/tickets';
  baseFormUrl = '/helpdesk/ticket/form';

  @Input('ticketCode') ticketCode: string;
  @Input('index') index: string;
  @Input('phoneNumber') phoneNumber: string;
  @Output() onClose = new EventEmitter<string>();
  @Output() onInit = new EventEmitter<QuickTicketFormComponent>();

  select2Option = {
    placeholder: 'Chọn liên hệ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 1,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return environment.api.baseUrl + '/contact/contacts?token='
          + localStorage.getItem('api_access_token') + '&filter_Name=' + params['term'];
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Name'];
            return item;
          }),
        };
      },
    },
  };

  actionControlList: ActionControl[] = [
    {
      type: 'button',
      name: 'save',
      status: 'success',
      label: 'Lưu',
      icon: 'save',
      title: 'Lưu yêu cầu',
      size: 'tiny',
      disabled: (option) => {
        return !option.form.valid;
        // return false;
      },
      click: () => {
        return true;
      },
    },
    {
      type: 'button',
      name: 'reset',
      status: 'warning',
      label: 'Tải lại',
      icon: 'refresh',
      title: 'Tải lại',
      size: 'tiny',
      disabled: () => {
        return false;
      },
      click: () => {
        // this.refresh();
        this.formLoad();
        return false;
      },
    },
    {
      type: 'button',
      name: 'close',
      status: 'danger',
      label: 'Đóng',
      icon: 'close-circle',
      title: 'Đóng',
      size: 'tiny',
      disabled: () => {
        return false;
      },
      click: (event, option: { formIndex: number }) => {
        this.goback();
        return false;
      },
    },
    // {
    //   type: 'button',
    //   name: 'undo',
    //   status: 'warning',
    //   label: 'Hoàn tác',
    //   icon: 'undo',
    //   title: 'Hoàn tác',
    //   size: 'tiny',
    //   disabled: () => {
    //     return false;
    //   },
    //   click: () => {
    //     this.onFormUndo();
    //     return false;
    //   },
    // },
  ];

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    public elRef: ElementRef,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
    this.silent = true;
    if (this.ticketCode) {
      this.id = [this.ticketCode];
    }
  }

  ngOnInit() {
    // this.restrict();
    super.ngOnInit();
    // if (this.inputId) {
    //   this.mode = 'dialog';
    // }
    this.onInit.emit(this);
  }

  async loadByCallSessionId(callSessionId?: string): Promise<HelpdeskTicketModel> {
    if (!this.ticketCode) {
      const ticket = (await this.apiService.getPromise<HelpdeskTicketModel[]>('/helpdesk/tickets', { getByCallSessionId: callSessionId ? callSessionId : this.index }))[0];
      if (ticket) {
        this.id = [ticket.Code];
        this.formLoad([ticket]);
      }
      return ticket;
    }
    return null;
  }

  async loadByPhoneNumber(phoneNumber?: string): Promise<boolean> {
    phoneNumber = phoneNumber ? phoneNumber : this.phoneNumber;
    if (phoneNumber) {
      if (phoneNumber.length > 8) {
        return new Promise<boolean>(resolve => {
          this.apiService.getPromise<ContactModel[]>('/contact/contacts', { searchByPhone: phoneNumber }).then(contacts => {
            const contact = contacts[0];
            if (contact) {
              contact['doNotAutoFill'] = true;
              this.array.controls[0].get('SupportedPerson').setValue(contact);
              this.array.controls[0].get('SupportedPersonName').setValue(contacts[0]['Name']);
              this.array.controls[0].get('SupportedPersonEmail').setValue(contacts[0]['Email']);
              this.array.controls[0].get('SupportedPersonAddress').setValue(contacts[0]['Address']);
            }
            this.array.controls[0].get('SupportedPersonPhone').setValue(phoneNumber);
            resolve(true);
          });
        });
      }
      this.array.controls[0].get('CallSessionId').setValue(this.index);
      this.array.controls[0].get('SupportedPersonPhone').setValue(phoneNumber);
      return true;
    }
    return false;

    // this.array.controls[0].get('ObjectPhone').setValue(phoneNumber);
  }

  onObjectChange(item, formIndex: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (item && !item['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (item['Code']) {
          this.array.controls[formIndex].get('SupportedPersonName').setValue(item['Name']);
          this.array.controls[formIndex].get('SupportedPersonPhone').setValue(item['Phone']);
          this.array.controls[formIndex].get('SupportedPersonEmail').setValue(item['Email']);
          this.array.controls[formIndex].get('SupportedPersonAddress').setValue(item['Address']);
        }
      }
    }

  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.ticketCode ? [this.ticketCode] : null);
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: HelpdeskTicketModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: HelpdeskTicketModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      // Type: [''],
      // Title: [''],
      Description: ['', Validators.required],
      // Object: [''],
      // ObjectName: [''],
      // ObjectPhone: [''],
      // ObjectEmail: [''],
      // ObjectAddress: [''],
      CallSessionId: [''],
      // WorkingName: [''],
      SupportedPerson: [''],
      SupportedPersonName: [''],
      SupportedPersonPhone: [''],
      SupportedPersonEmail: [''],
      SupportedPersonAddress: [''],
      // State: [''],
      // Service: [''],
    });
    if (data) {
      // let formData: any;
      // if (typeof data.SupportedPerson === 'string') {
      //   data['SupportedPerson'] = '1';
      //   formData = data;
      //   formData['SupportedPerson'] = { id: data.SupportedPerson, text: data.SupportedPersonName };
      // } else {
      //   formData = data;
      // }
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
    this.dialogService.open(ShowcaseDialogComponent, {
      context: {
        title: 'Phiếu yêu cầu hỗ trợ',
        content: 'Bạn có muốn đóng phiếu yêu cầu hỗ trợ, dữ liệu sẽ được tự dđộng lưu lại!',
        actions: [
          {
            label: 'Tiếp tục',
            icon: 'back',
            status: 'warning',
            action: () => { },
          },
          {
            label: 'Lưu và đóng',
            icon: 'save',
            status: 'success',
            action: () => {
              this.save();
              this.onClose.emit(this.index);
            },
          },
          {
            label: 'Đóng',
            icon: 'close',
            status: 'danger',
            action: () => {
              this.onClose.emit(this.index);
            },
          },
        ],
      },
    });

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

  set description(value: string) {
    this.array.controls[0].get('Description').setValue(value);
  }

  get description() {
    return this.array.controls[0].get('Description').value;
  }
}

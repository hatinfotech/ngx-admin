import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { EmailModel } from '../../../../models/email.model';
import { EmailSentFormComponent } from '../../email-sent/email-sent-form/email-sent-form.component';
import { ActionControl } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { AllCommunityModules, Module } from '@ag-grid-community/all-modules';

@Component({
  selector: 'ngx-email-advertisement-form',
  templateUrl: './email-advertisement-form.component.html',
  styleUrls: ['./email-advertisement-form.component.scss'],
})
export class EmailAdvertisementFormComponent extends DataManagerFormComponent<EmailModel> implements OnInit {

  componentName: string = 'EmailAdvertisementFormComponent';
  idKey = 'Id';
  apiPath = '/email-marketing/ads-emails';
  baseFormUrl = '/email-marketing/ads-email/form';

  // @Input('in') ticketCode: string;
  // @Input('index') index: string;
  // @Input('phoneNumber') phoneNumber: string;
  // @Output() onClose = new EventEmitter<string>();
  // @Output() onInit = new EventEmitter<EmailAdvertisementFormComponent>();

  select2TempateOption = {
    placeholder: 'Chọn mẫu Email...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/email-marketing/templates', { filter_Name: params['term'] ? params['term'] : '' });
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

  select2GatewayGroupOption = {
    placeholder: 'Chọn nhóm gateway...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: false,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/email-marketing/gateway-groups', { filter_Name: params['term'] ? params['term'] : '' });
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

  select2AddressListOption = {
    placeholder: 'Chọn danh sách địa chỉ email...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/email-marketing/address-lists', { filter_Name: params['term'] ? params['term'] : '' });
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
      title: 'Lưu',
      size: 'tiny',
      disabled: (option) => {
        return !option.form.valid;
        // return false;
      },
      click: () => {
        this.save();
        return false;
      },
    },
    {
      type: 'button',
      name: 'send',
      status: 'danger',
      label: 'Gửi Email',
      icon: 'paper-plane',
      title: 'Gửi Email',
      size: 'tiny',
      disabled: (option) => {
        return !option.form.valid;
        // return false;
      },
      click: () => {
        this.dialogService.open(ShowcaseDialogComponent, {
          context: {
            title: 'Xác nhận',
            content: 'Email sẽ được gửi cho tất cả địa chỉ trong danh sách, tần suất gửi 50 mail mỗi giờ',
            actions: [
              {
                label: 'Start',
                icon: 'delete',
                status: 'danger',
                action: () => {
                  this.saveAndSend();
                },
              },
              {
                label: 'Trở về',
                icon: 'back',
                status: 'success',
                action: () => { },
              },
            ],
          },
        });

        return false;
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
        this.refresh();

        return false;
      },
    },
    // {
    //   type: 'button',
    //   name: 'new',
    //   status: 'primary',
    //   label: 'Mới',
    //   icon: 'file-text',
    //   title: 'Tạo mới',
    //   size: 'tiny',
    //   disabled: () => {
    //     return false;
    //   },
    //   click: (event, option: { formIndex: number }) => {
    //     // this.goback();
    //     // this.id = null;
    //     this.reset();
    //     return false;
    //   },
    // },
    {
      type: 'button',
      name: 'Back',
      status: 'danger',
      label: 'Đóng',
      icon: 'close',
      title: 'Đóng',
      size: 'tiny',
      disabled: () => {
        return false;
      },
      click: (event, option: { formIndex: number }) => {
        // this.goback();
        // this.id = null;
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

  updateMode = 'live';
  isSendMail = false;

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    public elRef: ElementRef,
    protected ref: NbDialogRef<EmailAdvertisementFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
    this.silent = true;
    // if (this.ticketCode) {
    //   this.id = [this.ticketCode];
    // }

  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
    // if (this.inputId) {
    //   // this.mode = 'dialog';
    //   this.id = this.inputId;
    // }
    // this.onInit.emit(this);
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  // onObjectChange(item, formIndex: number) {
  //   // console.info(item);

  //   if (!this.isProcessing) {
  //     if (item && !item['doNotAutoFill']) {

  //       // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
  //       if (item['Code']) {
  //         this.array.controls[formIndex].get('Name').setValue(item['Name']);
  //         this.array.controls[formIndex].get('Phone').setValue(item['Phone']);
  //         this.array.controls[formIndex].get('Email').setValue(item['Email']);
  //         this.array.controls[formIndex].get('Address').setValue(item['Address']);
  //       }
  //     }
  //   }

  // }
  onTemplateChanged(event: any, formItem: FormControl) {
    // console.info(item);

    localStorage.setItem('last_email_template', JSON.stringify(event));

    if (!this.isProcessing) {
      // if (item && !item['doNotAutoFill']) {

      const template = formItem.get('Template');

      // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
      if (template.value['id']) {
        formItem.get('Content').setValue(template.value['Content']);
        formItem.get('Subject').setValue(template.value['Subject']);
      }
      // }
    }

  }

  // getRequestId(callback: (id?: string[]) => void) {
  //   callback(this.inputId ? this.inputId : null);
  // }

  /** Execute api get */
  executeGet(params: any, success: (resources: EmailModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeAddressList'] = true;
    params['includeGatewayGroup'] = true;
    params['includeEmailTemplate'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: EmailModel): FormGroup {
    // let lastSmsGateway = '';
    // let lastSmsBrandname = '';
    // let lastSmsTemplate = '';
    // try {
    //   lastSmsGateway = JSON.parse(localStorage.getItem('last_sms_gateway'));
    //   lastSmsBrandname = JSON.parse(localStorage.getItem('last_sms_brandname'));
    //   lastSmsTemplate = JSON.parse(localStorage.getItem('last_email_template'));
    // } catch (e) { console.error(e); }
    const newForm = this.formBuilder.group({
      Id: [''],
      // Contact: [''],
      // ContactGroups: [''],
      // Name: [''],
      // Phone: [''],
      Template: [''],
      // Email: [''],
      // Address: [''],
      Content: [''],
      // Gateway: ['', Validators.required],
      // Brandname: ['', Validators.required],
      Var1: [''],
      Var2: [''],
      Var3: [''],
      Var4: [''],
      Preview: [''],
      Subject: [''],
      SubjectPreview: [''],
      AddressList: ['', Validators.required],
      GatewayGroup: ['', Validators.required],
      SentAlgorithm: ['SMARTMARKETING', Validators.required],
    });
    if (data) {
      newForm.patchValue(data);
    } else {
      // newForm.get('Template').setValue(lastSmsTemplate);
      // if (lastSmsTemplate) {
      //   newForm.get('Content').setValue(lastSmsTemplate['Content']);
      //   newForm.get('Preview').setValue(this.generatePreview(newForm));
      // }
      // newForm.get('Gateway').setValue(lastSmsGateway);
      // newForm.get('Brandname').setValue(lastSmsBrandname);
    }

    const previewEditor = newForm.get('Preview');
    const subjectPreview = newForm.get('SubjectPreview');
    const template = newForm.get('Template');
    // const contact = newForm.get('Contact');
    // const name = newForm.get('Name');
    // const phone = newForm.get('Phone');
    // const email = newForm.get('Email');
    // const address = newForm.get('Address');
    const var1 = newForm.get('Var1');
    const var2 = newForm.get('Var2');
    const var3 = newForm.get('Var3');
    const var4 = newForm.get('Var4');
    // template.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(values => {
    //   previewEditor.patchValue(this.generatePreview(newForm));
    // });

    new Observable<string>(obs => {
      template.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => obs.next(value));
      // contact.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => obs.next(value));
      // name.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => obs.next(value));
      // phone.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => obs.next(value));
      // email.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => obs.next(value));
      // address.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => obs.next(value));
      var1.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => obs.next(value));
      var2.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => obs.next(value));
      var3.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => obs.next(value));
      var4.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => obs.next(value));
    }).pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.commonService.takeUntil('email-sengding', 300).then(r => {
        setTimeout(() => {
          previewEditor.patchValue(this.generatePreview(newForm));
          subjectPreview.patchValue(this.generateSubjectPreview(newForm));
        }, 300);
      });
    });

    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: EmailModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/email-marketing/ads-email/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }
  // goback(): false {
  //   // this.dialogService.open(ShowcaseDialogComponent, {
  //   //   context: {
  //   //     title: 'Phiếu yêu cầu hỗ trợ',
  //   //     content: 'Bạn có muốn đóng phiếu yêu cầu hỗ trợ, dữ liệu sẽ được tự dđộng lưu lại!',
  //   //     actions: [
  //   //       {
  //   //         label: 'Tiếp tục',
  //   //         icon: 'back',
  //   //         status: 'warning',
  //   //         action: () => { },
  //   //       },
  //   //       {
  //   //         label: 'Lưu và đóng',
  //   //         icon: 'save',
  //   //         status: 'success',
  //   //         action: () => {
  //   //           this.save();
  //   //           this.onClose.emit(this.index);
  //   //         },
  //   //       },
  //   //       {
  //   //         label: 'Đóng',
  //   //         icon: 'close',
  //   //         status: 'danger',
  //   //         action: () => {
  //   //           this.onClose.emit(this.index);
  //   //         },
  //   //       },
  //   //     ],
  //   //   },
  //   // });

  //   return false;
  // }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }



  // dismiss() {
  //   this.ref.close();
  // }

  checkDiabled(event: any, form: FormGroup) {
    const value: [] = form.get('Contacts').value;
    return value && value.length > 0;
  }

  generatePreview(formItem: FormGroup) {
    return formItem.get('Content').value
      // .replace('$ten', formItem.get('Name').value)
      // .replace('$so_dien_thoai', formItem.get('Phone').value)
      // .replace('$email', formItem.get('Email').value)
      // .replace('$dia_chi', formItem.get('Address').value)
      .replace('$tham_so_1', formItem.get('Var1').value)
      .replace('$than_so_2', formItem.get('Var2').value)
      .replace('$tham_so_3', formItem.get('Var3').value)
      .replace('$tham_so_4', formItem.get('Var4').value)
      ;
  }

  generateSubjectPreview(formItem: FormGroup) {
    return formItem.get('Subject').value
      // .replace('$ten', formItem.get('Name').value)
      // .replace('$so_dien_thoai', formItem.get('Phone').value)
      // .replace('$email', formItem.get('Email').value)
      // .replace('$dia_chi', formItem.get('Address').value)
      .replace('$tham_so_1', formItem.get('Var1').value)
      .replace('$than_so_2', formItem.get('Var2').value)
      .replace('$tham_so_3', formItem.get('Var3').value)
      .replace('$tham_so_4', formItem.get('Var4').value)
      ;
  }

  // onGatewayChanged(event: any, formItem: FormControl) {
  //   localStorage.setItem('last_sms_gateway', JSON.stringify(event));
  // }

  // onBrandnameChanged(event: any, formItem: FormControl) {
  //   localStorage.setItem('last_sms_brandname', JSON.stringify(event));
  // }

  saveAndSend() {
    this.isSendMail = true;
    this.save();
  }

  executePut(params: any, data: EmailModel[], success: (data: EmailModel[]) => void, error: (e: any) => void) {
    params['sendmail'] = this.isSendMail;
    super.executePut(params, data, success, error);
  }

  executePost(params: any, data: EmailModel[], success: (data: EmailModel[]) => void, error: (e: any) => void) {
    params['sendmail'] = this.isSendMail;
    super.executePost(params, data, success, error);
  }

  onAfterCreateSubmit(newFormData: EmailModel[]) {
    this.isSendMail = false;
    super.onAfterCreateSubmit(newFormData);
  }
  onAfterUpdateSubmit(newFormData: EmailModel[]) {
    this.isSendMail = false;
    super.onAfterUpdateSubmit(newFormData);
  }

  onSaveAndSendClick() {
    this.dialogService.open(ShowcaseDialogComponent, {
      context: {
        title: 'Xác nhận',
        content: 'Email sẽ được gửi cho tất cả địa chỉ trong danh sách, tần suất gửi 50 mail mỗi giờ',
        actions: [
          {
            label: 'Start',
            icon: 'delete',
            status: 'danger',
            action: () => {
              this.saveAndSend();
            },
          },
          {
            label: 'Trở về',
            icon: 'back',
            status: 'success',
            action: () => { },
          },
        ],
      },
    });
    return false;
  }

}

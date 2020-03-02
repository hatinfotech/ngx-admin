import { Component, OnInit, EventEmitter, Input, Output, ElementRef } from '@angular/core';
import { SmsModel } from '../../../../models/sms.model';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ActionControl } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { ApiService } from '../../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, Validators, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-sms-sent-form',
  templateUrl: './sms-sent-form.component.html',
  styleUrls: ['./sms-sent-form.component.scss'],
})
export class SmsSentFormComponent extends DataManagerFormComponent<SmsModel> implements OnInit {

  componentName: string = 'SmsSentFormComponent';
  idKey = 'Id';
  apiPath = '/sms/sms';
  baseFormUrl = '/sms/sms-sent/form';

  // @Input('in') ticketCode: string;
  @Input('index') index: string;
  @Input('phoneNumber') phoneNumber: string;
  @Output() onClose = new EventEmitter<string>();
  @Output() onInit = new EventEmitter<SmsSentFormComponent>();

  select2ContactOption = {
    placeholder: 'Chọn liên hệ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/contact/contacts', { filter_Name: params['term'] ? params['term'] : '', byGroups: 'PERSONAL' });
        // return environment.api.baseUrl + '/contact/contacts?token='
        //   + localStorage.getItem('api_access_token') + '&filter_Name=' + params['term'];
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
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

  select2ContactGroupOption = {
    placeholder: 'Chọn nhóm liên hệ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/contact/groups', { filter_Name: params['term'] ? params['term'] : '' });
        // return environment.api.baseUrl + '/contact/contacts?token='
        //   + localStorage.getItem('api_access_token') + '&filter_Name=' + params['term'];
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

  select2TempateOption = {
    placeholder: 'Chọn mẫu SMS...',
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
        return this.apiService.buildApiUrl('/sms/templates', { filter_Name: params['term'] ? params['term'] : '' });
        // return environment.api.baseUrl + '/contact/contacts?token='
        //   + localStorage.getItem('api_access_token') + '&filter_Name=' + params['term'];
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
      label: 'Gửi SMS',
      icon: 'paper-plane',
      title: 'Gửi SMS',
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
        this.refresh();

        return false;
      },
    },
    {
      type: 'button',
      name: 'new',
      status: 'primary',
      label: 'Mới',
      icon: 'file-text',
      title: 'Tạo mới',
      size: 'tiny',
      disabled: () => {
        return false;
      },
      click: (event, option: { formIndex: number }) => {
        // this.goback();
        // this.id = null;
        this.reset();
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
    // if (this.ticketCode) {
    //   this.id = [this.ticketCode];
    // }

  }

  ngOnInit() {
    // this.restrict();
    super.ngOnInit();
    if (this.inputId) {
      // this.mode = 'dialog';
      this.id = this.inputId;
    }
    this.onInit.emit(this);
  }

  onObjectChange(item, formIndex: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (item && !item['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (item['Code']) {
          this.array.controls[formIndex].get('Name').setValue(item['Name']);
          this.array.controls[formIndex].get('Phone').setValue(item['Phone']);
          this.array.controls[formIndex].get('Email').setValue(item['Email']);
          this.array.controls[formIndex].get('Address').setValue(item['Address']);
        }
      }
    }

  }
  onTemplateChanged(event: any, formItem: FormControl) {
    // console.info(item);

    if (!this.isProcessing) {
      // if (item && !item['doNotAutoFill']) {

      const template = formItem.get('Template');

      // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
      if (template.value['id']) {
        formItem.get('Content').setValue(template.value['Content']);
      }
      // }
    }

  }

  // getRequestId(callback: (id?: string[]) => void) {
  //   callback(this.inputId ? this.inputId : null);
  // }

  /** Execute api get */
  executeGet(params: any, success: (resources: SmsModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: SmsModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Contact: [''],
      // ContactGroups: [''],
      Name: [''],
      Phone: [''],
      Template: [''],
      Email: [''],
      Address: [''],
      Content: [''],
      Var1: [''],
      Var2: [''],
      Var3: [''],
      Var4: [''],
      Preview: [''],
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

    const contact = newForm.get('Contact');
    const contactGroups = newForm.get('ContactGroups');
    // contact.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
    //   if (value) {
    //     // contactGroups.setValue([]);
    //     // contactGroups.disable();
    //   } else {
    //     // contactGroups.enable();
    //   }
    //   // this.loadList();
    // });
    // contactGroups.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
    //   // if (value && value.length > 0) {
    //   this.loadList();
    //   // }
    // });

    // newForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {

    // });
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: SmsModel): void {
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

  onAfterCreateSubmit(newFormData: SmsModel[]) {
    super.onAfterCreateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }
  onAfterUpdateSubmit(newFormData: SmsModel[]) {
    super.onAfterUpdateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }

  // dismiss() {
  //   this.ref.close();
  // }

  checkDiabled(event: any, form: FormGroup) {
    const value: [] = form.get('Contacts').value;
    return value && value.length > 0;
  }

  generatePreview(formItem: FormControl) {
    return formItem.get('Content').value
      .replace('$ten', formItem.get('Name').value)
      .replace('$so_dien_thoai', formItem.get('Phone').value)
      .replace('$email', formItem.get('Email').value)
      .replace('$dia_chi', formItem.get('Address').value)
      .replace('$tham_so_1', formItem.get('Var1').value)
      .replace('$than_so_2', formItem.get('Var2').value)
      .replace('$tham_so_3', formItem.get('Var3').value)
      .replace('$tham_so_4', formItem.get('Var4').value)
      ;
  }

}

import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { HelpdeskTicketModel } from '../../../../models/helpdesk.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { environment } from '../../../../../environments/environment';
import { ActionControl } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { ContactModel } from '../../../../models/contact.model';
import { MobileAppService } from '../../../mobile-app/mobile-app.service';
import { Component as F7Component } from 'framework7';
import { HeldpeskServiceService } from '../../heldpesk-service.service';

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
  loading = false;

  @Input('ticketCode') ticketCode: string;
  @Input('uuidIndex') uuidIndex?: string;
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
      // url: params => {
      //   return environment.api.baseUrl + '/contact/contacts?token='
      //     + localStorage.getItem('api_access_token') + '&filter_Name=' + params['term'];
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/contact/contacts', { search: params['term'] ? params['term'] : '' }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
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

  helpdeskProcedureSelect2 = {
    placeholder: 'Chọn qui trình...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      // url: params => {
      //   return environment.api.baseUrl + '/helpdesk/procedures?token='
      //     + localStorage.getItem('api_access_token') + '&filter_Name=' + (params['term'] || '');
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/helpdesk/procedures', { filter_Name: params['term'] ? params['term'] : '' }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
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

  actionButtonList: ActionControl[] = [
    {
      type: 'button',
      name: 'recall',
      status: 'danger',
      label: 'Gọi lại',
      icon: 'phone-call',
      title: 'Gọi lại cho khách hàng',
      size: 'medium',
      disabled: (option) => {
        return !this.array.controls[0].get('ObjectPhone')['placeholder'];
        // return false;
      },
      click: () => {
        return this.recall();
      },
    },
    {
      type: 'button',
      name: 'chat',
      status: 'info',
      label: 'Chat',
      iconPack: 'ion',
      icon: 'chatbubbles',
      title: 'Mở phòng chat làm việc nhóm',
      size: 'medium',
      disabled: (option) => {
        return false;
        // return false;
      },
      click: () => {
        return this.openChatRoom();
      },
    },
    {
      type: 'button',
      name: 'save',
      status: 'success',
      label: 'Lưu',
      icon: 'save',
      title: 'Lưu yêu cầu',
      size: 'medium',
      disabled: (option) => {
        return option && option.form && !option.form.valid;
        // return false;
      },
      click: () => {
        return this.save().then(results => {
          this.refresh();
          return results;
        });
      },
    },
    {
      type: 'button',
      name: 'saveAndClose',
      status: 'primary',
      label: this.commonService.translateText('Common.saveAndClose'),
      icon: 'save',
      title: 'Lưu yêu cầu',
      size: 'medium',
      disabled: (option) => {
        return option && option.form && !option.form.valid;
        // return false;
      },
      click: () => {
        return this.saveAndClose();
      },
    },
    {
      type: 'button',
      name: 'reset',
      status: 'warning',
      // label: 'Tải lại',
      icon: 'refresh',
      title: 'Tải lại',
      size: 'medium',
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
      // label: 'Đóng',
      icon: 'close',
      title: 'Đóng',
      size: 'medium',
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

  chatRoom: string;
  f7ChatRoom: F7Component & { sendMessage?: (message: any) => void };

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public elRef: ElementRef,
    public mobileAppService: MobileAppService,
    public ref?: NbDialogRef<QuickTicketFormComponent>,
    public helpdeskService?: HeldpeskServiceService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService, ref);
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
    this.array?.controls[0]?.get('CallSessionId').setValue(this.index);
    this.onInit.emit(this);

    if (this.inputMode === 'dialog' && this.uuidIndex) {
      this.loadByCallSessionId(this.uuidIndex);
    }
  }

  async loadByCallSessionId(callSessionId?: string): Promise<HelpdeskTicketModel> {
    if (!this.ticketCode && callSessionId) {
      this.loading = true;
      while (true) {
        const stop = await new Promise(resolve => {
          this.executeGet({ getByCallSessionId: callSessionId ? callSessionId : this.index }, resources => {
            // const ticket = resources[0]; 
            if (resources && resources.length > 0) {
              this.id = resources.map(m => m.Code);
              this.formLoad(resources);
              this.loading = false;
              resolve(true);
            } else {
              resolve(false);
            }
          });
        });
        if (stop) break;
        await new Promise(resolve => setTimeout(() => resolve(true), 1000));
        // const ticket = (await this.apiService.getPromise<HelpdeskTicketModel[]>('/helpdesk/tickets', { getByCallSessionId: callSessionId ? callSessionId : this.index }))[0];
      }
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
              this.array.controls[0].get('Object').setValue({ id: contact.Code, text: contact.Name, Code: contact.Code });
              this.array.controls[0].get('ObjectName').setValue(contact['Name']);
              this.array.controls[0].get('ObjectEmail').setValue(contact['Email']);
              this.array.controls[0].get('ObjectAddress').setValue(contact['Address']);
            }
            this.array.controls[0].get('ObjectPhone').setValue(phoneNumber);
            resolve(true);
          });
        });
      }
      this.array.controls[0].get('CallSessionId').setValue(this.index);
      this.array.controls[0].get('ObjectPhone').setValue(phoneNumber);
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
          const formItem = this.array.controls[formIndex];
          formItem.get('ObjectName').setValue(item['Name']);
          if (item['Phone'] && item['Phone']['restricted']) formItem.get('ObjectPhone')['placeholder'] = item['Phone']['placeholder']; else formItem.get('ObjectPhone').setValue(item['Phone']);
          if (item['Email'] && item['Email']['restricted']) formItem.get('ObjectEmail')['placeholder'] = item['Email']['placeholder']; else formItem.get('ObjectEmail').setValue(item['Email']);
          if (item['Address'] && item['Address']['restricted']) formItem.get('ObjectAddress')['placeholder'] = item['Address']['placeholder']; else formItem.get('ObjectAddress').setValue(item['Address']);
        }
      }
    }

  }

  onProcedureChange(item, formGroup: FormGroup) {
    // console.info(item);

    if (!this.isProcessing) {
      if (item && !item['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (item['Code']) {
          formGroup.get('ProcedureDescription').setValue(item['Description']);
          // const formItem = this.array.controls[formIndex];
          // formItem.get('ObjectName').setValue(item['Name']);
          // if (item['Phone'] && item['Phone']['restricted']) formItem.get('ObjectPhone')['placeholder'] = item['Phone']['placeholder']; else formItem.get('ObjectPhone').setValue(item['Phone']);
          // if (item['Email'] && item['Email']['restricted']) formItem.get('ObjectEmail')['placeholder'] = item['Email']['placeholder']; else formItem.get('ObjectEmail').setValue(item['Email']);
          // if (item['Address'] && item['Address']['restricted']) formItem.get('ObjectAddress')['placeholder'] = item['Address']['placeholder']; else formItem.get('ObjectAddress').setValue(item['Address']);
        }
      }
    }

  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.ticketCode ? [this.ticketCode] : null);
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: HelpdeskTicketModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeObject'] = true;
    params['includeProcedure'] = true;
    params['includeInfosAsKeyValue'] = 'Description';
    super.executeGet(params, success, error);
  }

  /** Execute api post */
  executePost(params: any, data: HelpdeskTicketModel[], success: (data: HelpdeskTicketModel[]) => void, error: (e: any) => void) {
    params['autoCreateChatRoom'] = true;
    params['includeProcedure'] = true;
    super.executePost(params, data, (rs) => {
      this.chatRoom = rs[0].ChatRoom;
      if (success) success(rs);
    }, error);
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
      Object: [''],
      ObjectName: [''],
      ObjectPhone: [''],
      ObjectEmail: [''],
      ObjectAddress: [''],
      Procedure: [''],
      ProcedureDescription: [''],
      Infos: [''],
      // State: [''],
      // Service: [''],
    });
    if (data) {
      // let formData: any;
      // if (typeof data.Object === 'string') {
      //   data['Object'] = '1';
      //   formData = data;
      //   formData['Object'] = { id: data.Object, text: data.ObjectName };
      // } else {
      //   formData = data;
      // }
      // newForm.get('ObjectPhone')['placeholder'] = data['ObjectPhone'];
      // newForm.get('ObjectAddress')['placeholder'] = data['ObjectAddress'];
      // data['ObjectPhone'] = null;
      // data['ObjectAddress'] = null;
      // if (data.Infos?.Description && Array.isArray(data.Infos?.Description)) {
      //   (data.Infos?.Description as any).pop();
      // }
      // newForm.patchValue(data);
      this.patchFormGroupValue(newForm, data);
      // newForm['Infos'] = data.Infos;
    }
    return newForm;
  }

  patchFormGroupValue = (formGroup: FormGroup, data: HelpdeskTicketModel) => {
    formGroup.get('ObjectPhone')['placeholder'] = data['ObjectPhone'];
    formGroup.get('ObjectAddress')['placeholder'] = data['ObjectAddress'];
    data['ObjectPhone'] = null;
    data['ObjectAddress'] = null;
    if (data.Infos?.Description && Array.isArray(data.Infos?.Description)) {
      (data.Infos?.Description as any).pop();
    }
    formGroup.patchValue(data);
    return true;
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
            // icon: 'back',
            status: 'warning',
            action: () => { },
          },
          {
            label: 'Lưu và đóng',
            icon: 'save',
            status: 'success',
            action: () => {
              this.save();
              if (this.inputMode === 'inline') {
                this.onClose.emit(this.index);
              } else {
                this.close();
              }
            },
          },
          {
            label: 'Đóng',
            icon: 'close',
            status: 'danger',
            action: () => {
              if (this.inputMode === 'inline') {
                this.onClose.emit(this.index);
              } else {
                this.close();
              }
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

  getRawFormData() {
    const data = super.getRawFormData();

    if (!this.id || this.id.length === 0 && data.array[0].CallSessionId) {
      data.array[0].CallingSessions = [
        {
          CallSession: data.array[0].CallSessionId,
          State: 'INCOMING',
        },
      ];
    }

    return data;
  }

  recall() {
    const phoneNumber = this.array.controls[0].get('ObjectPhone')['placeholder'];
    // const name = this.array.controls[0].get('ObjectName').value;
    const ticketCode = this.array.controls[0].get('Code').value;
    if (phoneNumber) {
      // this.mobileAppService.phoneCall(phoneNumber, name ? name : phoneNumber);
      this.commonService.showDialog(this.commonService.translateText('Click2Call'), this.commonService.translateText('Gọi lại khách hàng, hệ thống sẽ kết nối tới số SIP của bạn trước vì vậy hãy online số SIP của bạn trước khi thưc hiên click2call !'), [
        {
          label: this.commonService.translateText('Common.cancel'),
          status: 'danger',
          action: () => {
          },
        },
        {
          icon: 'phone-call',
          status: 'success',
          label: this.commonService.translateText('Gọi'),
          action: () => {
            this.toastrService.show('Đang kết nối tới số SIP của bạn...');
            this.apiService.putPromise('/helpdesk/tickets/' + ticketCode, { click2call: true }, []).then(rs => {
              this.toastrService.show('Đang kết nối tới khách hàng...');
              console.log(rs);
            });
          },
        },
      ]);
    }
  }

  openChatRoom() {
    if (this.id[0]) {
      this.apiService.getPromise<HelpdeskTicketModel[]>('/helpdesk/tickets', { id: [this.id[0]], select: 'ChatRoom=>ChatRoom' }).then(tickets => {
        if (tickets && tickets.length > 0) {
          // this.mobileAppService.request('open-chat-room', tickets[0]['ChatRoom']);
          this.mobileAppService.openChatRoom({ ChatRoom: tickets[0]['ChatRoom'], silient: true });
        }
      });

    }
  }

  saveAndClose() {
    this.save().then(rs => {
      // this.onClose.emit(this.index);
      if (this.inputMode === 'inline') {
        this.onClose.emit(this.index);
      } else {
        this.close();
      }
      this.helpdeskService.onUpdateTickets$.next(rs);
    });
    return false;
  }

  isShowOldDescription(description: any) {
    return Array.isArray(description);
  }

  convertToHtml(text: string) {
    return text.replace(/\n/g, '<br>');
  }

}

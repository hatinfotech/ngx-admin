import { Component, OnInit } from '@angular/core';
import { SmsTemplateModel } from '../../../../models/sms.model';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { SmsTemplateFormComponent } from '../sms-template-form/sms-template-form.component';

@Component({
  selector: 'ngx-sms-template-list',
  templateUrl: './sms-template-list.component.html',
  styleUrls: ['./sms-template-list.component.scss'],
})
export class SmsTemplateListComponent extends DataManagerListComponent<SmsTemplateModel> implements OnInit {

  componentName: string = 'SmsTemplateListComponent';
  formPath = '/sms/template/form';
  apiPath = '/sms/templates';
  idKey = 'Code';

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
  ) {
    super(apiService, router, commonService, dialogService, toastService);
  }

  editing = {};
  rows = [];

  settings = this.configSetting({
    mode: 'external',
    selectMode: 'multi',
    actions: {
      position: 'right',
    },
    // add: {
    //   addButtonContent: '<i class="nb-edit"></i> <i class="nb-trash"></i> <i class="nb-plus"></i>',
    //   createButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // edit: {
    //   editButtonContent: '<i class="nb-edit"></i>',
    //   saveButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    //   confirmDelete: true,
    // },
    // pager: {
    //   display: true,
    //   perPage: 99999,
    // },
    columns: {
      Code: {
        title: 'Mã',
        type: 'string',
        width: '10%',
      },
      Name: {
        title: 'Tên',
        type: 'string',
        width: '30%',
      },
      Content: {
        title: 'Nội dung',
        type: 'string',
        width: '600%',
      },
    },
  });

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: SmsTemplateModel[]) => void, onDialogClose?: () => void) {
    this.dialogService.open(SmsTemplateFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: SmsTemplateModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
          this.refresh();
        },
      },
    });
  }

  /** Go to form */
  gotoForm(id?: string): false {
    // this.router.navigate(id ? [this.formPath, id] : [this.formPath], { queryParams: { list: this.componentName } });
    this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
    return false;
  }

}

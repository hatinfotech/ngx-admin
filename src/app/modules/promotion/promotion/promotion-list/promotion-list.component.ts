import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { PromotionModel } from '../../../../models/promotion.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { PromotionFormComponent } from '../promotion-form/promotion-form.component';

@Component({
  selector: 'ngx-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.scss'],
})
export class PromotionListComponent extends DataManagerListComponent<PromotionModel> implements OnInit {

  componentName: string = 'PromotionListComponent';
  formPath = '/promotion/promotion/form';
  apiPath = '/promotion/promotions';
  idKey = 'Code';

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
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
    add: this.configAddButton(),
    edit: this.configEditButton(),
    delete: this.configDeleteButton(),
    pager: this.configPaging(),
    columns: {
      Code: {
        title: 'Code',
        type: 'string',
        width: '10%',
      },
      Type: {
        title: 'Type',
        type: 'string',
        width: '10%',
      },
      Name: {
        title: 'Tên',
        type: 'string',
        width: '30%',
      },
      Description: {
        title: 'Mô tả',
        type: 'string',
        width: '30%',
      },
      MaxUse: {
        title: 'Max Use',
        type: 'string',
        width: '10%',
      },
      State: {
        title: 'Trạng thái',
        type: 'string',
        width: '10%',
      },
      //   Copy: {
      //     title: 'Copy',
      //     type: 'custom',
      //     width: '10%',
      //     renderComponent: SmartTableButtonComponent,
      //     onComponentInitFunction: (instance: SmartTableButtonComponent) => {
      //       instance.iconPack = 'eva';
      //       instance.icon = 'copy';
      //       instance.label = 'Copy nội dung sang site khác';
      //       instance.display = true;
      //       instance.status = 'success';
      //       instance.valueChange.subscribe(value => {
      //         // if (value) {
      //         //   instance.disabled = false;
      //         // } else {
      //         //   instance.disabled = true;
      //         // }
      //       });
      //       instance.click.subscribe(async (row: PromotionModel) => {

      //         this.dialogService.open(SyncFormComponent, {
      //           context: {
      //             inputMode: 'dialog',
      //             inputId: [row.Code],
      //             onDialogSave: (newData: PromotionModel[]) => {
      //               // if (onDialogSave) onDialogSave(row);
      //             },
      //             onDialogClose: () => {
      //               // if (onDialogClose) onDialogClose();
      //               this.refresh();
      //             },
      //           },
      //         });

      //       });
      //     },
      //   },
    },
  });

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: PromotionModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: PromotionModel[]) => void, onDialogClose?: () => void) {
    this.dialogService.open(PromotionFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: PromotionModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
          this.refresh();
        },
      },
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
  }

  /** Go to form */
  gotoForm(id?: string): false {
    this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
    return false;
  }

}

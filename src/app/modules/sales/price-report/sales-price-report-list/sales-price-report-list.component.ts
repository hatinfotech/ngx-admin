import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { SalesPriceReportModel } from '../../../../models/sales.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { PromotionFormComponent } from '../../../promotion/promotion/promotion-form/promotion-form.component';
import { SalesPriceReportFormComponent } from '../sales-price-report-form/sales-price-report-form.component';

@Component({
  selector: 'ngx-sales-price-report-list',
  templateUrl: './sales-price-report-list.component.html',
  styleUrls: ['./sales-price-report-list.component.scss'],
})
export class SalesPriceReportListComponent extends DataManagerListComponent<SalesPriceReportModel> implements OnInit {

  componentName: string = 'SalesPriceReportListComponent';
  formPath = '/sales/price-report/form';
  apiPath = '/sales/price-reports';
  idKey = 'Code';

  constructor(
    protected apiService: ApiService,
    public router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    protected _http: HttpClient,
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
      ObjectName: {
        title: 'Khách hàng',
        type: 'string',
        width: '20%',
      },
      Note: {
        title: 'Mô tả',
        type: 'string',
        width: '30%',
      },
      Title: {
        title: 'Tiêu đề',
        type: 'string',
        width: '20%',
      },
      Created: {
        title: 'Ngày tạo',
        type: 'string',
        width: '10%',
      },
      IsApprove: {
        title: 'Duyệt',
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
      //       instance.click.subscribe(async (row: SalesPriceReportModel) => {

      //         this.dialogService.open(SyncFormComponent, {
      //           context: {
      //             inputMode: 'dialog',
      //             inputId: [row.Code],
      //             onDialogSave: (newData: SalesPriceReportModel[]) => {
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

  getList(callback: (list: SalesPriceReportModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: SalesPriceReportModel[]) => void, onDialogClose?: () => void) {
    this.dialogService.open(SalesPriceReportFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: SalesPriceReportModel[]) => {
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

import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { SalesMasterPriceTableModel, SalesMasterPriceTableDetailModel } from '../../../../models/sales.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SmartTableDateTimeComponent, SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { PriceTableFormComponent } from '../../price-table/price-table-form/price-table-form.component';
import { MasterPriceTableFormComponent } from '../master-price-table-form/master-price-table-form.component';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { MasterPriceTablePrintComponent } from '../master-price-table-print/master-price-table-print.component';
import { UnitModel } from '../../../../models/unit.model';
import { ProductModel } from '../../../../models/product.model';

@Component({
  selector: 'ngx-master-price-table-list',
  templateUrl: './master-price-table-list.component.html',
  styleUrls: ['./master-price-table-list.component.scss'],
})
export class MasterPriceTableListComponent extends DataManagerListComponent<SalesMasterPriceTableModel> implements OnInit {

  componentName: string = 'MasterPriceTableListComponent';
  formPath = '/sales/master-price-table/form';
  apiPath = '/sales/master-price-tables';
  idKey = 'Code';
  formDialog = MasterPriceTableFormComponent;

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

  /** Api get funciton */
  executeGet(params: any, success: (resources: SalesMasterPriceTableModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: SalesMasterPriceTableModel[] | HttpErrorResponse) => void) {
    params['useBaseTimezone'] = true;
    params['includeParent'] = true;
    super.executeGet(params, success, error, complete);
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
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.code'), 'head-title'),
        type: 'string',
        width: '10%',
      },
      Title: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.title'), 'head-title'),
        type: 'string',
        width: '25%',
      },
      Description: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.description'), 'head-title'),
        type: 'string',
        width: '25%',
      },
      DateOfCreated: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.dateOfcreated'), 'head-title'),
        type: 'custom',
        width: '10%',
        renderComponent: SmartTableDateTimeComponent,
        onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
          // instance.format$.next('medium');
        },
      },
      DateOfApproved: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.dateOfapproved'), 'head-title'),
        type: 'custom',
        width: '10%',
        renderComponent: SmartTableDateTimeComponent,
        onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
          // instance.format$.next('medium');
        },
      },
      // Parent: {
      //   title: this.commonService.textTransform(this.commonService.translate.instant('Common.parent'), 'head-title'),
      //   type: 'string',
      //   width: '15%',
      // },
      Approved: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.approve'), 'head-title'),
        type: 'boolean',
        width: '5%',
      },
      PreviewCommand: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.preview'), 'head-title'),
        type: 'custom',
        width: '5%',
        renderComponent: SmartTableButtonComponent,
        onComponentInitFunction: (instance: SmartTableButtonComponent) => {
          instance.iconPack = 'eva';
          instance.icon = 'external-link';
          instance.label = this.commonService.textTransform(this.commonService.translate.instant('Common.preview'), 'head-title');
          instance.display = true;
          instance.status = 'primary';
          instance.valueChange.subscribe(value => {
            // if (value) {
            //   instance.disabled = false;
            // } else {
            //   instance.disabled = true;
            // }
          });
          instance.click.subscribe(async (row: SalesMasterPriceTableModel) => {
            this.preview(row);
          });
        },
      },
    },
  });

  ngOnInit() {
    this.restrict();
    super.ngOnInit();

    // this.apiService.getObservable<ProductModel[]>('/admin-product/products', {})
    //   .pipe(map(product => {
    //     return {
    //       product: product,
    //     };
    //   }));
  }

  getList(callback: (list: SalesMasterPriceTableModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: SalesMasterPriceTableModel[]) => void, onDialogClose?: () => void) {
  //   this.dialogService.open(MasterPriceTableFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: SalesMasterPriceTableModel[]) => {
  //         if (onDialogSave) onDialogSave(newData);
  //       },
  //       onDialogClose: () => {
  //         if (onDialogClose) onDialogClose();
  //         this.refresh();
  //       },
  //     },
  //     closeOnEsc: false,
  //     closeOnBackdropClick: false,
  //   });
  // }

  // /** Go to form */
  // gotoForm(id?: string): false {
  //   this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
  //   return false;
  // }

  async preview(data: SalesMasterPriceTableModel) {

    data.Details = (await this.apiService.getPromise<(SalesMasterPriceTableDetailModel & ProductModel & { Price?: string | number })[]>(
      '/sales/master-price-table-details',
      {
        excludeNoPrice: true,
        masterPriceTable: data.Code,
        includeUnit: true,
        includeFeaturePicture: true,
        sort_Id: 'desc',
      }));

    this.dialogService.open(MasterPriceTablePrintComponent, {
      context: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.preview'), 'head-title'),
        data: data,
        onSaveAndClose: (priceReportCode: string) => {
          this.refresh();
        },
        onSaveAndPrint: (priceReportCode: string) => {
          this.refresh();
        },
      },
    });

  }

}

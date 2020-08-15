import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { WarehouseGoodsReceiptNoteModel, WarehouseBookModel, WarehouseModel } from '../../../../models/warehouse.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SmartTableDateTimeComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { WarehouseSimpleGoodsReceiptNoteFormComponent } from '../warehouse-simple-goods-receipt-note-form/warehouse-simple-goods-receipt-note-form.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { of as observableOf } from 'rxjs';

@Component({
  selector: 'ngx-warehouse-goods-receipt-note-list',
  templateUrl: './warehouse-goods-receipt-note-list.component.html',
  styleUrls: ['./warehouse-goods-receipt-note-list.component.scss'],
})
export class WarehouseGoodsReceiptNoteListComponent extends ServerDataManagerListComponent<WarehouseGoodsReceiptNoteModel> implements OnInit {

  componentName: string = 'WarehouseGoodsReceiptNoteListComponent';
  formPath = '/warehouse/goods-receipt-note/form';
  apiPath = '/warehouse/goods-receipt-notes';
  idKey = 'Code';

  formDialog = WarehouseSimpleGoodsReceiptNoteFormComponent;

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
  executeGet(params: any, success: (resources: WarehouseGoodsReceiptNoteModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: WarehouseGoodsReceiptNoteModel[] | HttpErrorResponse) => void) {
    params['useBaseTimezone'] = true;
    super.executeGet(params, success, error, complete);
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareData
    source.prepareData = (data: WarehouseGoodsReceiptNoteModel[]) => {
      // data.map((product: WarehouseGoodsReceiptNoteModel) => {

      //   return product;
      // });
      return data;
    };

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeBookkeeping'] = true;
      params['sort_Id'] = 'desc';
      return params;
    };

    return source;
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
      ObjectName: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.supplier'), 'head-title'),
        type: 'string',
        width: '20%',
      },
      Note: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.description'), 'head-title'),
        type: 'string',
        width: '20%',
      },
      Warehouse: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.warehouse'), 'head-title'),
        type: 'string',
        width: '15%',
      },
      DateOfPurchase: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Purchase.dateOfPurchase'), 'head-title'),
        type: 'custom',
        width: '15%',
        renderComponent: SmartTableDateTimeComponent,
        onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
          // instance.format$.next('medium');
        },
      },
      Bookkeeping: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.bookkeeping'), 'head-title'),
        type: 'boolean',
        width: '5%',
        editable: true,
        onChange: (value, rowData: WarehouseGoodsReceiptNoteModel, instance) => {
          this.apiService.putPromise<WarehouseModel[]>('/warehouse/warehouses', {id: [this.commonService.getObjectId(rowData.Warehouse)], bookkeeping: value, voucher: rowData.Code}, [{
            Code: this.commonService.getObjectId(rowData.Warehouse),
          }]).then(rs => {
            // console.log(rs);
            // this.refresh();
            this.commonService.toastService.show(value ? this.commonService.translateText('Warehouse.Book.voucherWasWroteInToWahouseBook') : this.commonService.translateText('Warehouse.Book.voucherWasUnwroteInToWahouseBook'), this.commonService.translateText('Common.warehouse'),{
              status: value ? 'success' : 'warning',
            });
          }).catch(e => {
            this.commonService.toastService.show(this.commonService.translateText('Warehouse.Book.voucherWasWroteInToWahouseBook'), this.commonService.translateText('Common.warehouse'),{
              status: 'danger',
            });
          });
        },
      },
    },
  });

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: WarehouseGoodsReceiptNoteModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

}

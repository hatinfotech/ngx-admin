import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { WarehouseGoodsReceiptNoteModel } from '../../../../models/warehouse.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SmartTableDateTimeComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { WarehouseSimpleGoodsReceiptNoteFormComponent } from '../warehouse-simple-goods-receipt-note-form/warehouse-simple-goods-receipt-note-form.component';

@Component({
  selector: 'ngx-warehouse-goods-receipt-note-list',
  templateUrl: './warehouse-goods-receipt-note-list.component.html',
  styleUrls: ['./warehouse-goods-receipt-note-list.component.scss'],
})
export class WarehouseGoodsReceiptNoteListComponent  extends DataManagerListComponent<WarehouseGoodsReceiptNoteModel> implements OnInit {

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
        width: '30%',
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
      IsApprove: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.isApprove'), 'head-title'),
        type: 'string',
        width: '15%',
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

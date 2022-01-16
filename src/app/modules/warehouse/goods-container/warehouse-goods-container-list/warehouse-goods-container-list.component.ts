import { UnitModel } from './../../../../models/unit.model';
import { ShowcaseDialogComponent } from './../../../dialog/showcase-dialog/showcase-dialog.component';
import { WarehouseGoodsContainerPrintComponent } from './../warehouse-goods-container-print/warehouse-goods-container-print.component';
import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { WarehouseGoodsContainerModel } from '../../../../models/warehouse.model';
import { WarehouseGoodsContainerFormComponent } from '../warehouse-goods-container-form/warehouse-goods-container-form.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';

@Component({
  selector: 'ngx-warehouse-goods-container-list',
  templateUrl: './warehouse-goods-container-list.component.html',
  styleUrls: ['./warehouse-goods-container-list.component.scss'],
})
export class WarehouseGoodsContainerListComponent extends ServerDataManagerListComponent<WarehouseGoodsContainerModel> implements OnInit {

  componentName: string = 'WarehouseGoodsContainerListComponent';
  formPath = '/warehouse/goods-container/form';
  apiPath = '/warehouse/goods-containers';
  idKey = 'Code';
  formDialog = WarehouseGoodsContainerFormComponent;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<WarehouseGoodsContainerListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService);
  }

  editing = {};
  rows = [];

  containerTypes = {
    'AREA': 'Khu',
    'SHELF': 'Kệ',
    'CUPBOARD': 'Tủ',
    'FLOOR': 'Tầng',
    'DRAWERS': 'Ngăn',
    'UNKNOW': 'Chưa biết',
  };

  async init() {
    return super.init().then(rs => {
      const previewBtn = this.actionButtonList.find(f => f.name == 'preview');
      previewBtn.label = 'Print QR Code';
      previewBtn.disabled = () => false;
      previewBtn.click = () => {
        this.commonService.openDialog(ShowcaseDialogComponent, {
          context: {
            title: 'Print QR Code',
            content: 'Chọn loại chỗ chứa cần in QR Code:',
            actions: [
              {
                status: 'basic',
                label: 'Trở về',
                action: () => { },
              },
              {
                status: 'success',
                label: 'In ngăn',
                action: () => {
                  this.commonService.openDialog(WarehouseGoodsContainerPrintComponent, {
                    context: {
                      id: [],
                      printForType: 'DRAWERS',
                    }
                  });
                },
              },
              {
                status: 'primary',
                label: 'In tầng',
                action: () => {
                  this.commonService.openDialog(WarehouseGoodsContainerPrintComponent, {
                    context: {
                      id: [],
                      printForType: 'FLOOR',
                    }
                  });
                },
              },
              {
                status: 'info',
                label: 'In kệ',
                action: () => {
                  this.commonService.openDialog(WarehouseGoodsContainerPrintComponent, {
                    context: {
                      id: [],
                      printForType: 'SHELF',
                    }
                  });
                },
              },
            ]
          }
        })
      };
      return rs;
    });
  }

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      mode: 'external',
      selectMode: 'multi',
      actions: {
        position: 'right',
      },
      // add: this.configAddButton(),
      // edit: this.configEditButton(),
      // delete: this.configDeleteButton(),
      // pager: this.configPaging(),
      columns: {
        Path: {
          title: this.commonService.translateText('Common.path'),
          type: 'string',
          width: '30%',
        },
        // Name: {
        //   title: this.commonService.translateText('Common.name'),
        //   type: 'string',
        //   width: '15%',
        // },
        Warehouse: {
          title: this.commonService.translateText('Common.warehouse'),
          type: 'string',
          width: '20%',
          valuePrepareFunction: (cell, row) => {
            return this.commonService.getObjectText(cell);
          }
        },
        FindOrder: {
          title: this.commonService.translateText('Số nhận thức'),
          type: 'string',
          width: '20%',
        },
        GoodsName: {
          title: this.commonService.translateText('Common.goods'),
          type: 'html',
          width: '10%',
          valuePrepareFunction: (cell: any, row) => {
            return row['Goods'] && row['Goods'].map(goods => this.commonService.getObjectText(goods) + ' (' + goods.Unit + ')').join('<br>') || '';
          },
        },
        Code: {
          title: this.commonService.translateText('Common.code'),
          type: 'string',
          width: '10%',
        },
        Type: {
          title: this.commonService.translateText('Common.type'),
          type: 'string',
          width: '10%',
          valuePrepareFunction: (cell: string, rơ: any) => {
            return this.containerTypes[cell];
          },
        },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: WarehouseGoodsContainerModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: WarehouseGoodsContainerModel[] | HttpErrorResponse) => void) {
    // params['includeParent'] = true;
    // params['includePath'] = true;
    // params['includeWarehouse'] = true;
    // params['includeWarehouse'] = true;
    super.executeGet(params, success, error, complete);
  }

  getList(callback: (list: WarehouseGoodsContainerModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeParent'] = true;
      params['includePath'] = true;
      params['includeWarehouse'] = true;
      params['includeWarehouse'] = true;
      params['includeGoods'] = true;
      params['includeIdText'] = true;
      // params['eq_Type'] = 'PAYMENT';
      return params;
    };

    return source;
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<WarehouseGoodsContainerModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true });
  }

  // /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: WarehouseGoodsContainerModel[]) => void, onDialogClose?: () => void) {
  //   this.commonService.openDialog(ProductCategoryFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: WarehouseGoodsContainerModel[]) => {
  //         if (onDialogSave) onDialogSave(newData);
  //       },
  //       onDialogClose: () => {
  //         if (onDialogClose) onDialogClose();
  //         this.refresh();
  //       },
  //     },
  //   });
  // }

  // /** Go to form */
  // gotoForm(id?: string): false {
  //   this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
  //   return false;
  // }

}


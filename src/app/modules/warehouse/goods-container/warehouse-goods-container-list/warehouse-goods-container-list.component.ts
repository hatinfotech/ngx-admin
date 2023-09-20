import { ActionControl } from './../../../../lib/custom-element/action-control-list/action-control.interface';
import { UnitModel } from './../../../../models/unit.model';
import { ShowcaseDialogComponent } from './../../../dialog/showcase-dialog/showcase-dialog.component';
import { WarehouseGoodsContainerPrintComponent } from './../warehouse-goods-container-print/warehouse-goods-container-print.component';
import { Component, Input, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { WarehouseGoodsContainerModel } from '../../../../models/warehouse.model';
import { WarehouseGoodsContainerFormComponent } from '../warehouse-goods-container-form/warehouse-goods-container-form.component';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { takeUntil } from 'rxjs/operators';

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

  @Input() inputFilter: any;

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<WarehouseGoodsContainerListComponent>,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService);
  }

  editing = {};
  rows = [];

  containerTypes = {
    'AREA': 'Khu',
    'SHELF': 'Kệ',
    'CUPBOARD': 'Tủ',
    'FLOOR': 'Tầng',
    'DRAWERS': 'Ngăn',
    'BASKET': 'Rổ',
    'UNKNOW': 'Chưa biết',
  };
  containerTypeList = [
    { id: 'AREA', text: 'Khu' },
    { id: 'SHELF', text: 'Kệ' },
    { id: 'CUPBOARD', text: 'Tủ' },
    { id: 'FLOOR', text: 'Tầng' },
    { id: 'DRAWERS', text: 'Ngăn' },
    { id: 'BASKET', text: 'Rổ' },
    { id: 'UNKNOW', text: 'Chưa biết' },
  ];


  async init() {
    return super.init().then(rs => {
      const previewBtn = this.actionButtonList.find(f => f.name == 'preview');
      previewBtn.label = 'Print QR Code';
      previewBtn.disabled = () => false;
      // previewBtn.click = () => {
      //   this.cms.openDialog(ShowcaseDialogComponent, {
      //     context: {
      //       title: 'Print QR Code',
      //       content: 'Chọn loại chỗ chứa cần in QR Code:',
      //       actions: [
      //         {
      //           status: 'basic',
      //           label: 'Trở về',
      //           action: () => { },
      //         },
      //         {
      //           status: 'success',
      //           label: 'In ngăn',
      //           action: () => {
      //             this.cms.openDialog(WarehouseGoodsContainerPrintComponent, {
      //               context: {
      //                 id: [],
      //                 printForType: 'DRAWERS',
      //               }
      //             });
      //           },
      //         },
      //         {
      //           status: 'primary',
      //           label: 'In tầng',
      //           action: () => {
      //             this.cms.openDialog(WarehouseGoodsContainerPrintComponent, {
      //               context: {
      //                 id: [],
      //                 printForType: 'FLOOR',
      //               }
      //             });
      //           },
      //         },
      //         {
      //           status: 'info',
      //           label: 'In kệ',
      //           action: () => {
      //             this.cms.openDialog(WarehouseGoodsContainerPrintComponent, {
      //               context: {
      //                 id: [],
      //                 printForType: 'SHELF',
      //               }
      //             });
      //           },
      //         },
      //       ]
      //     }
      //   })
      // };
      previewBtn.icon = 'grid-outline';
      previewBtn.click = () => {
        this.cms.openDialog(WarehouseGoodsContainerPrintComponent, {
          context: {
            id: this.selectedItems.map(item => this.makeId(item)),
            printForType: 'DRAWERS',
          }
        });
      };
      const copyBtn: ActionControl = {
        ...previewBtn,
        label: 'Copy',
        title: 'Copy',
        status: 'danger',
        icon: 'copy-outline',
        click: () => {
          this.cms.openDialog(WarehouseGoodsContainerFormComponent, {
            context: {
              showLoadinng: true,
              inputMode: 'dialog',
              inputId: this.selectedItems.map(item => this.makeId(item)),
              isDuplicate: true,
              onDialogSave: (newData: WarehouseGoodsContainerModel[]) => {
                // if (onDialogSave) onDialogSave(row);
                // this.onClose && this.onClose(newData[0]);
                // this.onSaveAndClose && this.onSaveAndClose(newData[0]);
              },
              onDialogClose: () => {
                // if (onDialogClose) onDialogClose();
                this.refresh();
              },
            },
          });
        }
      };

      this.actionButtonList.unshift(copyBtn);
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
        Shelf: {
          title: this.cms.translateText('Kệ'),
          type: 'string',
          width: '5%',
          valuePrepareFunction: (cell, row) => {
            return row.ShelfName;
          }
        },
        Path: {
          title: this.cms.translateText('Common.path'),
          type: 'string',
          width: '30%',
        },
        Name: {
          title: this.cms.translateText('Common.name'),
          type: 'string',
          width: '20%',
        },
        // Name: {
        //   title: this.cms.translateText('Common.name'),
        //   type: 'string',
        //   width: '15%',
        // },
        Warehouse: {
          title: this.cms.translateText('Common.warehouse'),
          type: 'string',
          width: '10%',
          valuePrepareFunction: (cell, row) => {
            return this.cms.getObjectText(cell);
          }
        },
        FindOrder: {
          title: this.cms.translateText('Số nhận thức'),
          type: 'string',
          width: '5%',
        },
        // Address: {
        //   title: this.cms.translateText('Địa chỉ'),
        //   type: 'string',
        //   width: '5%',
        // },
        GoodsName: {
          title: this.cms.translateText('Common.goods'),
          type: 'html',
          width: '10%',
          valuePrepareFunction: (cell: any, row) => {
            return row['Goods'] && row['Goods'].map(goods => this.cms.getObjectText(goods) + ' (' + goods.Unit + ')').join('<br>') || '';
          },
        },
        AccAccountName: {
          title: this.cms.translateText('Warehouse.account'),
          type: 'string',
          width: '10%',
          valuePrepareFunction: (cell: string, rơ: any) => {
            return this.containerTypes[cell];
          },
        },
        Code: {
          title: this.cms.translateText('Common.code'),
          type: 'string',
          width: '5%',
        },
        Type: {
          title: this.cms.translateText('Common.type'),
          type: 'string',
          width: '10%',
          valuePrepareFunction: (cell: string, rơ: any) => {
            return this.containerTypes[cell];
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              select2Option: {
                placeholder: this.cms.translateText('Loại vị trí', { action: this.cms.translateText('Common.choose'), definition: '' }),
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                minimumInputLength: 0,
                keyMap: {
                  id: 'id',
                  text: 'text',
                },
                multiple: true,
                logic: 'OR',
                ajax: {
                  url: (params: any) => {
                    return 'data:text/plan,[]';
                  },
                  delay: 0,
                  processResults: (data: any, params: any) => {
                    return {
                      results: this.containerTypeList.filter(cate => !params.term || this.cms.smartFilter(cate.text, params.term)),
                    };
                  },
                },
              },
            },
          },
        },
        Action: {
          title: this.cms.translateText('Common.action'),
          type: 'custom',
          width: '5%',
          // class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'grid-outline';
            instance.display = true;
            instance.status = 'success';
            instance.disabled = this.ref && Object.keys(this.ref).length > 0;
            // instance.style = 'text-align: right';
            // instance.class = 'align-right';
            instance.status = 'primary';
            instance.title = this.cms.translateText('In Tem QR');
            instance.label = this.cms.translateText('In Tem QR');
            instance.valueChange.subscribe(value => {
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: WarehouseGoodsContainerModel) => {
              const editedItems = rowData;
              this.cms.openDialog(WarehouseGoodsContainerPrintComponent, {
                context: {
                  id: [this.makeId(editedItems)],
                  printForType: 'DRAWERS',
                }
              });
            });
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
      params['sort_Id'] = 'desc';

      if (this.inputFilter) {
        params = { ...params, ...this.inputFilter };
      }
      return params;
    };

    return source;
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<WarehouseGoodsContainerModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true });
  }

  // /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: WarehouseGoodsContainerModel[]) => void, onDialogClose?: () => void) {
  //   this.cms.openDialog(ProductCategoryFormComponent, {
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


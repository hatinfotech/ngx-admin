import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { SalesPriceTableModel } from '../../../../models/sales.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SmartTableDateTimeComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { PriceTableFormComponent } from '../price-table-form/price-table-form.component';

@Component({
  selector: 'ngx-price-table-list',
  templateUrl: './price-table-list.component.html',
  styleUrls: ['./price-table-list.component.scss'],
})
export class PriceTableListComponent extends DataManagerListComponent<SalesPriceTableModel> implements OnInit {
  
  componentName: string = 'PriceTableListComponent';
  formPath = '/sales/price-table/form';
  apiPath = '/sales/price-tables';
  idKey = 'Code';
  formDialog = PriceTableFormComponent;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
  ) {
    super(apiService, router, cms, dialogService, toastService);
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: SalesPriceTableModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: SalesPriceTableModel[] | HttpErrorResponse) => void) {
    params['useBaseTimezone'] = true;
    params['includeParent'] = true;
    super.executeGet(params, success, error, complete);
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      // mode: 'external',
      // selectMode: 'multi',
      // actions: {
      //   position: 'right',
      // },
      // add: this.configAddButton(),
      // edit: this.configEditButton(),
      // delete: this.configDeleteButton(),
      // pager: this.configPaging(),
      columns: {
        Code: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.code'), 'head-title'),
          type: 'string',
          width: '10%',
        },
        Description: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.description'), 'head-title'),
          type: 'string',
          width: '20%',
        },
        Title: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.title'), 'head-title'),
          type: 'string',
          width: '20%',
        },
        DateOfCreate: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.dateOfcreated'), 'head-title'),
          type: 'custom',
          width: '10%',
          renderComponent: SmartTableDateTimeComponent,
          onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
            // instance.format$.next('medium');
          },
        },
        ObjectName: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.customer'), 'head-title'),
          type: 'string',
          width: '20%',
        },
        Parent: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.parent'), 'head-title'),
          type: 'string',
          width: '15%',
        },
        IsApprove: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.isApprove'), 'head-title'),
          type: 'string',
          width: '5%',
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
        //       instance.click.subscribe(async (row: SalesPriceTableModel) => {

        //         this.cms.openDialog(SyncFormComponent, {
        //           context: {
        //             inputMode: 'dialog',
        //             inputId: [row.Code],
        //             onDialogSave: (newData: SalesPriceTableModel[]) => {
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
  }

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

  getList(callback: (list: SalesPriceTableModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: SalesPriceTableModel[]) => void, onDialogClose?: () => void) {
  //   this.cms.openDialog(PriceTableFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: SalesPriceTableModel[]) => {
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

}

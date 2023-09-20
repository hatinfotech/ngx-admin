import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { PurchasePriceTableModel } from '../../../../models/purchase.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SmartTableDateTimeComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { PurchasePriceTableImportComponent } from '../purchase-price-table-import/purchase-price-table-import.component';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';

@Component({
  selector: 'ngx-purchase-price-table-list',
  templateUrl: './purchase-price-table-list.component.html',
  styleUrls: ['./purchase-price-table-list.component.scss'],
})
export class PurchasePriceTableListComponent extends DataManagerListComponent<PurchasePriceTableModel> implements OnInit {

  componentName: string = 'PurchasePriceTableListComponent';
  formPath = '/purchase/price-table/form';
  apiPath = '/purchase/price-tables';
  idKey = 'Code';
  formDialog = PurchasePriceTableImportComponent;

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService);

    /** Append print button to head card */
    this.actionButtonList.unshift({
      name: 'print',
      status: 'danger',
      label: this.cms.textTransform(this.cms.translate.instant('Common.import'), 'head-title'),
      icon: 'code-download',
      title: this.cms.textTransform(this.cms.translate.instant('Common.import'), 'head-title'),
      size: 'medium',
      disabled: () => false,
      hidden: () => false,
      click: (event: any, option: ActionControlListOption) => {
        this.openImportForm();
      },
    });
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: PurchasePriceTableModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: PurchasePriceTableModel[] | HttpErrorResponse) => void) {
    params['useBaseTimezone'] = true;
    super.executeGet(params, success, error, complete);
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
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
          title: this.cms.textTransform(this.cms.translate.instant('Common.code'), 'head-title'),
          type: 'string',
          width: '10%',
        },
        Description: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.description'), 'head-title'),
          type: 'string',
          width: '30%',
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
        SupplierName: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.supplier'), 'head-title'),
          type: 'string',
          width: '20%',
        },
        IsApprove: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.isApprove'), 'head-title'),
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
        //       instance.click.subscribe(async (row: PurchasePriceTableModel) => {

        //         this.cms.openDialog(SyncFormComponent, {
        //           context: {
        //             inputMode: 'dialog',
        //             inputId: [row.Code],
        //             onDialogSave: (newData: PurchasePriceTableModel[]) => {
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

  getList(callback: (list: PurchasePriceTableModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: PurchasePriceTableModel[]) => void, onDialogClose?: () => void) {
  //   this.cms.openDialog(PurchasePriceTableImportComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: PurchasePriceTableModel[]) => {
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

  openImportForm() {
    this.cms.openDialog(PurchasePriceTableImportComponent, {
      context: {
        showLoadinng: true,
        inputMode: 'dialog',
        inputId: [],
        onDialogSave: (newData: PurchasePriceTableModel[]) => {
          // if (onDialogSave) onDialogSave(newData);
          this.refresh();
        },
        onDialogClose: () => {
          // if (onDialogClose) onDialogClose();
          // this.refresh();
        },
      },
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ProductCategoryModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductPropertyFormComponent } from '../product-property-form/product-property-form.component';

@Component({
  selector: 'ngx-product-property-list',
  templateUrl: './product-property-list.component.html',
  styleUrls: ['./product-property-list.component.scss'],
})
export class ProductPropertyListComponent extends DataManagerListComponent<ProductCategoryModel> implements OnInit {

  componentName: string = 'ProductPropertyListComponent';
  formPath = '/admin-product/property/form';
  apiPath = '/admin-product/properties';
  idKey = 'Code';
  formDialog = ProductPropertyFormComponent;

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

  editing = {};
  rows = [];

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
        Code: {
          title: 'Code',
          type: 'string',
          width: '10%',
        },
        ParentName: {
          title: 'Thuộc tính cha',
          type: 'string',
          width: '30%',
        },
        Name: {
          title: 'Tên',
          type: 'string',
          width: '20%',
        },
        Description: {
          title: 'Mô tả',
          type: 'string',
          width: '40%',
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
        //       instance.click.subscribe(async (row: ProductCategoryModel) => {

        //         this.cms.openDialog(SyncFormComponent, {
        //           context: {
        //             inputMode: 'dialog',
        //             inputId: [row.Code],
        //             onDialogSave: (newData: ProductCategoryModel[]) => {
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
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: ProductCategoryModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: ProductCategoryModel[] | HttpErrorResponse) => void) {
    params['includeParent'] = true;
    super.executeGet(params, success, error, complete);
  }

  getList(callback: (list: ProductCategoryModel[]) => void) {
    super.getList((rs) => {
      // rs.forEach(item => {
      //   item.Content = item.Content.substring(0, 256) + '...';
      // });
      if (callback) callback(rs);
    });
  }

  // /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: ProductCategoryModel[]) => void, onDialogClose?: () => void) {
  //   this.cms.openDialog(ProductPropertyFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: ProductCategoryModel[]) => {
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


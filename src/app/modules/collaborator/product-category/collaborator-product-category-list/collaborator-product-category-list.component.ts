import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ProductCategoryModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { CollaboratorProductCategoryFormComponent } from '../collaborator-product-category-form/collaborator-product-category-form.component';

@Component({
  selector: 'ngx-collaborator-product-category-list',
  templateUrl: './collaborator-product-category-list.component.html',
  styleUrls: ['./collaborator-product-category-list.component.scss']
})
export class CollaboratorProductCategoryListComponent extends DataManagerListComponent<ProductCategoryModel> implements OnInit {

  componentName: string = 'CollaboratorProductCategoryListComponent';
  formPath = '/admin-product/category/form';
  apiPath = '/admin-product/categories';
  idKey = 'Code';
  formDialog = CollaboratorProductCategoryFormComponent;

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
        Name: {
          title: 'Tên',
          type: 'string',
          width: '40%',
        },
        ParentName: {
          title: 'Danh mục cha',
          type: 'string',
          width: '30%',
        },
        FindOrder: {
          title: 'Thứ tự tìm kiếm',
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
        //       instance.click.subscribe(async (row: ProductCategoryModel) => {

        //         this.commonService.openDialog(SyncFormComponent, {
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
  //   this.commonService.openDialog(ProductCategoryFormComponent, {
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


import { Component, OnInit } from '@angular/core';
import { HelpdeskUserModel } from '../../../../models/helpdesk.model';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { ProductCategoryFormComponent } from '../../../admin-product/category/product-category-form/product-category-form.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductCategoryModel } from '../../../../models/product.model';
import { UserExtensionFormComponent } from '../user-extension-form/user-extension-form.component';

@Component({
  selector: 'ngx-user-extension-list',
  templateUrl: './user-extension-list.component.html',
  styleUrls: ['./user-extension-list.component.scss'],
})
export class UserExtensionListComponent extends DataManagerListComponent<HelpdeskUserModel> implements OnInit {

  componentName: string = 'ProductCategoryListComponent';
  formPath = '/admin-product/category/form';
  apiPath = '/admin-product/categories';
  idKey = 'Code';
  formDialog = UserExtensionFormComponent;

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

      //         this.dialogService.open(SyncFormComponent, {
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

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: HelpdeskUserModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: HelpdeskUserModel[] | HttpErrorResponse) => void) {
    params['includeParent'] = true;
    super.executeGet(params, success, error, complete);
  }

  getList(callback: (list: HelpdeskUserModel[]) => void) {
    super.getList((rs) => {
      // rs.forEach(item => {
      //   item.Content = item.Content.substring(0, 256) + '...';
      // });
      if (callback) callback(rs);
    });
  }

}


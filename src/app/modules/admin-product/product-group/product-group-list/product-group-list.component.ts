import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductGroupFormComponent } from '../product-group-form/product-group-form.component';
import { ProductGroupModel } from '../../../../models/product.model';

@Component({
  selector: 'ngx-product-group-list',
  templateUrl: './product-group-list.component.html',
  styleUrls: ['./product-group-list.component.scss'],
})
export class ProductGroupListComponent extends DataManagerListComponent<ProductGroupModel> implements OnInit {

  componentName: string = 'ProductGroupListComponent';
  formPath = '/admin-product/group/form';
  apiPath = '/admin-product/groups';
  idKey = 'Code';

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
  executeGet(params: any, success: (resources: ProductGroupModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: ProductGroupModel[] | HttpErrorResponse) => void) {
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
        width: '20%',
      },
      Name: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.name'), 'head-title'),
        type: 'string',
        width: '30%',
      },
      Description: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.description'), 'head-title'),
        type: 'string',
        width: '50%',
      },
    },
  });

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: ProductGroupModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: ProductGroupModel[]) => void, onDialogClose?: () => void) {
    this.dialogService.open(ProductGroupFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: ProductGroupModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
          this.refresh();
        },
      },
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
  }

  /** Go to form */
  gotoForm(id?: string): false {
    this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
    return false;
  }

}

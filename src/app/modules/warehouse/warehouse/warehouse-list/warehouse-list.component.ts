import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { WarehouseModel } from '../../../../models/warehouse.model';
import { WarehouseFormComponent } from '../warehouse-form/warehouse-form.component';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.scss'],
})
export class WarehouseListComponent extends DataManagerListComponent<WarehouseModel> implements OnInit {

  componentName: string = 'WarehouseListComponent';
  formPath = '/warehouse/warehouse/form';
  apiPath = '/warehouse/warehouses';
  idKey = 'Code';
  formDialog = WarehouseFormComponent;

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
          title: this.cms.translateText('Common.name'),
          type: 'string',
          width: '10%',
        },
        Name: {
          title: this.cms.translateText('Common.name'),
          type: 'string',
          width: '40%',
        },
        Description: {
          title: this.cms.translateText('Common.description'),
          type: 'string',
          width: '25%',
        },
        // Branch: {
        //   title: this.cms.translateText('Common.branch'),
        //   type: 'string',
        //   width: '20%',
        // },
        FindOrder: {
          title: this.cms.translateText('Số nhận thức'),
          type: 'string',
          width: '5%',
        },
        AccAccountName: {
          title: this.cms.translateText('Warehouse.account'),
          type: 'string',
          width: '20%',
        },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: WarehouseModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: WarehouseModel[] | HttpErrorResponse) => void) {
    params['includeBranch'] = true;
    super.executeGet(params, success, error, complete);
  }

  getList(callback: (list: WarehouseModel[]) => void) {
    super.getList((rs) => {
      // rs.forEach(item => {
      //   item.Content = item.Content.substring(0, 256) + '...';
      // });
      if (callback) callback(rs.map(item => {
        item.Branch = this.cms.getObjectText(item.Branch);
        return item;
      }));
    });
  }

  // /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: WarehouseModel[]) => void, onDialogClose?: () => void) {
  //   this.cms.openDialog(ProductCategoryFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: WarehouseModel[]) => {
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


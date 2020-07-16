import { Component, OnInit } from '@angular/core';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';
import { PbxCustomerModel } from '../../../../models/pbx-customer.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { IvoipService } from '../../ivoip-service';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { MiniErpDeploymentModel } from '../../../../models/minierp-deployment.model';
import { MiniErpModel } from '../../../../models/minierp.model';
import { CustomerFormComponent } from '../customer-form/customer-form.component';

@Component({
  selector: 'ngx-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent extends IvoipBaseListComponent<PbxCustomerModel> implements OnInit {

  componentName: string = 'CustomerListComponent';
  formPath = '/ivoip/customers/form';
  apiPath = '/ivoip/customers';
  idKey = 'Code';
  formDialog = CustomerFormComponent;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public ivoipService: IvoipService,
    public toastrService: NbToastrService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ivoipService);
  }

  editing = {};
  rows = [];

  settings = this.configSetting({
    mode: 'external',
    selectMode: 'multi',
    actions: {
      position: 'right',
    },
    // add: {
    //   addButtonContent: '<i class="nb-edit"></i> <i class="nb-trash"></i> <i class="nb-plus"></i>',
    //   createButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // edit: {
    //   editButtonContent: '<i class="nb-edit"></i>',
    //   saveButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    //   confirmDelete: true,
    // },
    // pager: {
    //   display: true,
    //   perPage: 100,
    // },
    columns: {
      No: {
        title: 'Stt',
        type: 'string',
        width: '5%',
      },
      Code: {
        title: 'Mã',
        type: 'string',
        width: '10%',
      },
      Name: {
        title: 'Tên',
        type: 'string',
        width: '20%',
      },
      Phone: {
        title: 'Số điện thoại',
        type: 'string',
        width: '10%',
      },
      Email: {
        title: 'Số Public',
        type: 'string',
        width: '10%',
      },
      Pbx: {
        title: 'Tổng đài',
        type: 'string',
        width: '20%',
      },
      Domain: {
        title: 'Domain',
        type: 'string',
        width: '20%',
      },
      Info: {
        title: 'Info',
        type: 'custom',
        width: '10%',
        renderComponent: SmartTableButtonComponent,
        onComponentInitFunction: (instance: SmartTableButtonComponent) => {
          instance.iconPack = 'eva';
          instance.icon = 'unlock';
          instance.label = 'Thông tin triển khai';
          instance.display = true;
          instance.status = 'info';
          instance.valueChange.subscribe(value => {
            // if (value) {
            //   instance.disabled = false;
            // } else {
            //   instance.disabled = true;
            // }
          });
          instance.click.subscribe(async (row: PbxCustomerModel) => {

            const miniErpDeploment = await new Promise<MiniErpDeploymentModel>((resolve, reject) => {
              this.apiService.get<MiniErpDeploymentModel[]>('/mini-erp/deployments', { silent: true, customer: row.Code, includeAdminInfo: true, select: 'AdminPassword,Domain' }, miniErpDeployments => {
                if (miniErpDeployments.length > 0) {
                  resolve(miniErpDeployments[0]);
                }
              }, e => {
                this.toastrService.show('Thông báo lỗi', e && e.error && e.error.logs ? e.error.logs.join('\n') : e, { status: 'warning', hasIcon: true, position: NbGlobalPhysicalPosition.TOP_RIGHT, duration: 10000 });
                resolve(null);
              });
            });

            const miniErp = await new Promise<MiniErpModel>((resolve, reject) => {
              this.apiService.get<MiniErpModel[]>('/mini-erp/minierps', { silent: true, customer: row.Code, includeRootInfo: true, select: 'ApiPassword' }, miniErps => {
                if (miniErps.length > 0) {
                  resolve(miniErps[0]);
                }
              }, e => {
                this.toastrService.show('Thông báo lỗi', e && e.error && e.error.logs ? e.error.logs.join('\n') : e, { status: 'warning', hasIcon: true, position: NbGlobalPhysicalPosition.TOP_RIGHT, duration: 10000 });
                resolve(null);
              });
            });

            let dialogContent = '';
            if (miniErpDeploment) {
              dialogContent += `Mật khẩu Admin: ${miniErpDeploment.AdminPassword}<br>`;
            }
            if (miniErp) {
              dialogContent += `Mật khẩu Root: ${miniErp.ApiPassword}<br>`;
            }

            this.dialogService.open(ShowcaseDialogComponent, {
              context: {
                title: 'Thông tin triển khai',
                content: dialogContent,
                actions: [
                  {
                    status: 'primary',
                    label: 'Đóng',
                    action: () => { },
                  },
                  {
                    status: 'success',
                    label: 'Truy cập',
                    action: () => {
                      window.open(`https://${miniErpDeploment.Domain}`);
                     },
                  },
                ],
              },
            });

          });
        },
      },
    },
  });

  ngOnnit() {
    this.restrict();
    super.ngOnInit();
  }

}

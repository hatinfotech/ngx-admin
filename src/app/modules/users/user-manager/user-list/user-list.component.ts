import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { UserModel } from '../../../../models/user.model';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { UserFormComponent } from '../user-form/user-form.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { HttpClient } from '@angular/common/http';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';

@Component({
  selector: 'ngx-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent extends ServerDataManagerListComponent<UserModel> implements OnInit {

  componentName: string = 'UserListComponent';
  formPath = '/user/user/form';
  apiPath = '/user/users';
  idKey = 'Code';
  formDialog = UserFormComponent;

  reuseDialog = true;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<UserListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    return super.init();
  }

  editing = {};
  rows = [];

  settings = this.configSetting({
    columns: {
      No: {
        title: 'Stt',
        type: 'number',
        width: '5%',
        class: 'no',
        filter: false,
      },
      Code: {
        title: 'Mã',
        type: 'string',
        width: '10%',
      },
      Name: {
        title: 'Name',
        type: 'string',
        width: '45%',
        filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      },
      Username: {
        title: 'Username',
        type: 'string',
        width: '30%',
      },
      AllowLoginSignature: {
        title: 'Login',
        type: 'custom',
        width: '10%',
        renderComponent: SmartTableButtonComponent,
        onComponentInitFunction: (instance: SmartTableButtonComponent) => {
          instance.iconPack = 'eva';
          instance.icon = 'lock';
          instance.label = 'Thông tin triển khai';
          instance.display = true;
          instance.status = 'danger';
          instance.valueChange.subscribe(value => {
            instance.icon = value ? 'unlock' : 'lock';
            instance.status = value ? 'success' : 'danger';
          });
          instance.click.subscribe(async (userInfo: UserModel) => {

            if (!userInfo.AllowLoginSignature) {
              this.commonService.openDialog(ShowcaseDialogComponent, {
                context: {
                  title: 'Mở khóa đăng nhập',
                  content: 'Bạn có muốn MỞ KHÓA ĐĂNG NHẬP cho người dùng này? người dùng sẽ phải đăng nhập trong vòng 15 phút kẻ từ túc khóa đăng nhập đươc mở !',
                  actions: [
                    {
                      status: 'primary',
                      label: 'Trở về',
                      action: () => { },
                    },
                    {
                      status: 'success',
                      label: 'Mở đăng nhập',
                      action: () => {
                        this.apiService.putPromise<UserModel[]>('/user/users/' + userInfo.Code, { setAllowLogin: true }, [{ Code: userInfo.Code }]).then(rs => {
                          console.log(rs);
                          this.refresh();
                        }).catch(err => {
                          console.error(err);
                        });
                      },
                    },
                  ],
                },
              });
            } else {
              this.commonService.openDialog(ShowcaseDialogComponent, {
                context: {
                  title: 'Khóa đăng nhập',
                  content: 'Bạn có muốn KHÓA ĐĂNG NHẬP người dùng này? sau khi khóa người dùng không thể đăng nhập thêm lần nào nữa !',
                  actions: [
                    {
                      status: 'primary',
                      label: 'Trở về',
                      action: () => { },
                    },
                    {
                      status: 'danger',
                      label: 'Khóa đăng nhập',
                      action: () => {
                        this.apiService.putPromise<UserModel[]>('/user/users/' + userInfo.Code, { setAllowLogin: false }, [{ Code: userInfo.Code }]).then(rs => {
                          console.log(rs);
                          this.refresh();
                        }).catch(err => {
                          console.error(err);
                        });
                      },
                    },
                  ],
                },
              });
            }

          });
        },
      },
    },
  });

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareData
    // source.prepareData = (data: UserGroupModel[]) => {
    //   // const paging = source.getPaging();
    //   // data.map((product: any, index: number) => {
    //   //   product['No'] = (paging.page - 1) * paging.perPage + index + 1;
    //   //   return product;
    //   // });
    //   return data;
    // };

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeParent'] = true;
      return params;
    };

    return source;
  }

  /** Api get funciton */
  // executeGet(params: any, success: (resources: UserGroupModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: UserGroupModel[] | HttpErrorResponse) => void) {
  //   params['includeCategories'] = true;
  //   super.executeGet(params, success, error, complete);
  // }

  getList(callback: (list: UserModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

}

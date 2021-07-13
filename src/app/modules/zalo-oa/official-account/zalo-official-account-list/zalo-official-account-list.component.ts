import { Component, OnInit } from '@angular/core';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { ZaloOaOfficialAccountModel } from '../../../../models/zalo-oa.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { ZaloOaFollowerListComponent } from '../../follower/zalo-oa-follower-list/zalo-oa-follower-list.component';
import { ZaloOfficialAccountFormComponent } from '../zalo-official-account-form/zalo-official-account-form.component';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { takeUntil } from 'rxjs/operators';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';

@Component({
  selector: 'ngx-zalo-official-account-list',
  templateUrl: './zalo-official-account-list.component.html',
  styleUrls: ['./zalo-official-account-list.component.scss'],
})
export class ZaloOfficialAccountListComponent extends ServerDataManagerListComponent<ZaloOaOfficialAccountModel> implements OnInit {

  componentName: string = 'ZaloOfficialAccountListComponent';
  formPath = '/zalo-oa/official-account/form';
  apiPath = '/zalo-oa/official-accounts';
  idKey = 'Code';
  formDialog = ZaloOfficialAccountFormComponent;

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
    public ref: NbDialogRef<ZaloOaFollowerListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
    this.actionButtonList.unshift({
      name: 'zalooa',
      status: 'primary',
      label: 'Zalo OA',
      icon: 'external-link',
      title: 'Mở trang quản lý zalo oa',
      size: 'medium',
      click: () => {
        window.open('https://oa.zalo.me/manage/oa', '__blank');
      },
    });
    this.actionButtonList.unshift({
      name: 'zalodev',
      status: 'primary',
      label: 'Zalo Develop',
      icon: 'external-link',
      title: 'Mở trang dành cho nhà phát triển',
      size: 'medium',
      click: () => {
        window.open('https://developers.zalo.me/apps', '__blank');
      },
    });
  }

  async init() {
    // await this.loadCache();
    return super.init();
  }

  editing = {};
  rows = [];

  settings = this.configSetting({
    columns: {
      Code: {
        title: this.commonService.translateText('Common.code'),
        type: 'string',
        width: '10%',
      },
      Name: {
        title: this.commonService.translateText('Common.name'),
        type: 'string',
        width: '20%',
        // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      },
      Description: {
        title: this.commonService.translateText('Common.description'),
        type: 'string',
        width: '20%',
      },
      AppId: {
        title: this.commonService.translateText('Common.appId'),
        type: 'string',
        width: '15%',
      },
      WebhookUserTokenExpired: {
        title: this.commonService.translateText('Common.expired'),
        type: 'datetime',
        width: '20%',
      },
      Type: {
        title: this.commonService.translateText('Common.type'),
        type: 'string',
        width: '10%',
        // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      },
      IsEnabled: {
        title: this.commonService.translateText('Common.enable'),
        type: 'boolean',
        width: '5%',
      },
      IsDefault: {
        title: this.commonService.translateText('Common.default'),
        type: 'boolean',
        width: '5%',
      },
      RefreshToken: {
        title: this.commonService.translateText('Common.refreshToken'),
        type: 'custom',
        width: '10%',
        renderComponent: SmartTableButtonComponent,
        onComponentInitFunction: (instance: SmartTableButtonComponent) => {
          instance.iconPack = 'eva';
          instance.icon = 'refresh';
          instance.display = true;
          instance.status = 'success';
          instance.title = this.commonService.translateText('Common.refreshToken');
          instance.click.pipe(takeUntil(this.destroy$)).subscribe(async (officialAccount: ZaloOaOfficialAccountModel) => {
            // const token = await this.apiService.getPromise<ZaloOaOfficialAccountModel[]>('/zalo-oa/official-accounts', { 'generateWebhookToken': true, id: [officialAccount.Code] }).then(token => token[0]?.WebhookToken);
            // if (!token) {
            //   this.toastService.show('Cảnh báo', 'Không lấy đượng token !', { status: 'warning' });
            //   return;
            // }
            const token = this.apiService.token?.access_token;
            this.commonService.openDialog(ShowcaseDialogComponent, {
              context: {
                title: this.commonService.translateText('ZaloOa.OfficialAccount.title', { action: this.commonService.translateText('Common.confirm'), definition: '' }),
                content: this.commonService.translateText('ZaloOa.OfficialAccount.confirmRefreshTokenMessage') + `<br><img style="width: 100%" src="assets/images/zalo-refresh-token.png">`,
                actions: [
                  {
                    label: this.commonService.translateText('Common.refreshToken'),
                    status: 'success',
                    action: () => {
                      window.open(`https://oauth.zaloapp.com/v3/oa/permission?app_id=${officialAccount.AppId}&redirect_uri=${encodeURIComponent(officialAccount.CallbackUrl + '/' + officialAccount?.AppId + '?token=' + token)}`, '_blank');
                    },
                  },
                  {
                    label: this.commonService.translateText('Common.close'),
                    status: 'danger',
                  },
                ],
              },
            });
          });
        },
      },
      WebhookToken: {
        title: this.commonService.translateText('ZaloOa.Webhook.token'),
        type: 'custom',
        width: '10%',
        renderComponent: SmartTableButtonComponent,
        onComponentInitFunction: (instance: SmartTableButtonComponent) => {
          instance.iconPack = 'eva';
          instance.icon = 'unlock';
          instance.display = true;
          instance.status = 'danger';
          instance.title = this.commonService.translateText('ZaloOa.Webhook.token');
          instance.click.pipe(takeUntil(this.destroy$)).subscribe((officialAccount: ZaloOaOfficialAccountModel) => {
            this.apiService.getPromise<ZaloOaOfficialAccountModel[]>('/zalo-oa/official-accounts', { 'generateWebhookToken': true, id: [officialAccount.Code] }).then(token => {
              this.commonService.openDialog(ShowcaseDialogComponent, {
                context: {
                  title: this.commonService.translateText('ZaloOa.Webhook.token'),
                  content: token[0].WebhookToken,
                  actions: [
                    {
                      label: this.commonService.translateText('Common.close'),
                      status: 'danger',
                    },
                  ],
                },
              });
            });
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

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeParent'] = true;
      return params;
    };

    return source;
  }

}

import { Component, OnInit } from '@angular/core';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { ContactModel } from '../../../../models/contact.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { ZaloOaFollowerFormComponent } from '../zalo-oa-follower-form/zalo-oa-follower-form.component';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { takeUntil } from 'rxjs/operators';
import { MobileAppService } from '../../../mobile-app/mobile-app.service';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-zalo-oa-follower-list',
  templateUrl: './zalo-oa-follower-list.component.html',
  styleUrls: ['./zalo-oa-follower-list.component.scss'],
})
export class ZaloOaFollowerListComponent extends ServerDataManagerListComponent<ContactModel> implements OnInit {

  componentName: string = 'ZaloOaFollowerListComponent';
  formPath = '/zalo-oa/follower/form';
  apiPath = '/zalo-oa/followers';
  idKey = 'Code';
  formDialog = ZaloOaFollowerFormComponent;

  reuseDialog = true;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<ZaloOaFollowerListComponent>,
    public mobileAppService: MobileAppService,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, ref);

  }

  async init() {
    // await this.loadCache();
    return super.init().then(rs => {
      this.actionButtonList.unshift({
        name: 'sync',
        status: 'primary',
        label: this.cms.textTransform(this.cms.translate.instant('Common.sync'), 'head-title'),
        icon: 'sync',
        title: this.cms.textTransform(this.cms.translate.instant('Common.sync'), 'head-title'),
        size: 'medium',
        disabled: (option) => false,
        hidden: () => false,
        click: (event, option) => {
          this.apiService.putPromise('/zalo-oa/followers', { sync: true }, []).then(rs => {
            console.log(rs);
            option.disabled = false;
          });
        },
      });
      return rs;
    });
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
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
          width: '75%',
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        Chat: {
          title: this.cms.translateText('Common.refreshToken'),
          type: 'custom',
          width: '10%',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'message-circle';
            instance.display = true;
            instance.status = 'primary';
            instance.title = this.cms.translateText('Common.refreshToken');
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((contact: ContactModel) => {
              if (contact.Details && contact.Details.ZALO_CHAT_ROOM) {
                this.mobileAppService.openChatRoom({ ChatRoom: contact.Details.ZALO_CHAT_ROOM }).then(f7MessageComponent => {
                  console.log(f7MessageComponent);
                });
              } else {
                this.apiService.putPromise<ContactModel[]>('/zalo-oa/followers', { 'createZaloChatRoom': true }, [{
                  Code: contact.Code,
                  Name: contact.Name,
                  User: contact.User,
                  Details: contact.Details,
                }]).then(updatedFollowers => {
                  if (updatedFollowers[0].Details.ZALO_CHAT_ROOM) {
                    this.mobileAppService.openChatRoom({ ChatRoom: updatedFollowers[0].Details.ZALO_CHAT_ROOM }).then(f7MessageComponent => {
                      console.log(f7MessageComponent);
                    });
                  }
                });
              }
            });
          },
        },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeDetailsAsKeyValue'] = 'ZALO_CHAT_ROOM,ZALO_USER_ID,ZALO_USER_TAG,ZALO_OFFICIAL_ACCOUNT,ZALO_OFFICIAL_ACCOUNT_ID';

      return params;
    };

    return source;
  }

}

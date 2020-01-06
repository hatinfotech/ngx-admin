import { Component, OnInit } from '@angular/core';
import { WebHostingBaseListComponent } from '../../web-hosting-base-list.component';
import { WhFtpModel } from '../../../../models/wh-ftp.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { WebHostingService } from '../../web-hosting-service';
import { WhWebsiteModel } from '../../../../models/wh-website.model';

@Component({
  selector: 'ngx-ftp-list',
  templateUrl: './ftp-list.component.html',
  styleUrls: ['./ftp-list.component.scss'],
})
export class FtpListComponent extends WebHostingBaseListComponent<WhFtpModel> implements OnInit {

  componentName: string = 'FtpListComponent';
  formPath = '/web-hosting/ftps/form';
  apiPath = '/web-hosting/ftps';
  idKey = 'ftp_user_id';

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
      No: {
        title: 'Stt',
        type: 'string',
        width: '50%',
      },
      username: {
        title: 'Ftp Username',
        type: 'string',
        width: '30%',
      },
      domain: {
        title: 'Domain',
        type: 'string',
        width: '35%',
      },
      hosting: {
        title: 'Hosting',
        type: 'string',
        width: '30%',
      },
    },
  });

  websiteMap: { [key: string]: WhWebsiteModel } = {};

  constructor(
    protected apiService: ApiService,
    public router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    public webHostingService: WebHostingService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, webHostingService);
    this.apiService.get<WhWebsiteModel[]>('/web-hosting/websites', {}, websites => {
      this.websiteMap = {};
      websites.forEach(website => {
        this.websiteMap[website.domain_id] = website;
      });

    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: WhFtpModel[]) => void) {
    this.apiService.get<WhFtpModel[]>(this.apiPath, { limit: 999999999, offset: 0 }, results => {

      callback(results.map(item => {
        item['hosting'] = this.webHostingService.hostingMap[item['hosting']].Host;
        if (this.websiteMap[item.parent_domain_id]) {
          item.parent_domain_id = this.websiteMap[item.parent_domain_id].domain;
        }
        return item;
      }));

    });
  }

}

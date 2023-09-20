import { Component, OnInit } from '@angular/core';
import { WebHostingBaseListComponent } from '../../web-hosting-base-list.component';
import { WhFtpModel } from '../../../../models/wh-ftp.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { WebHostingService } from '../../web-hosting-service';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

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

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
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
          width: '5%',
        },
        username: {
          title: 'Ftp Username',
          type: 'string',
          width: '30%',
        },
        parent_domain_id: {
          title: 'Website',
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
  }

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public webHostingService: WebHostingService,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, webHostingService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async getList(callback: (list: WhFtpModel[]) => void) {
    const websiteMap = await this.webHostingService.getWebsiteMap();
    super.getList(list => {
      callback(list.map(item => {
        item['hosting'] = this.webHostingService.hostingMap[item['hosting']].Host;
        if (websiteMap[item.parent_domain_id]) {
          item.parent_domain_id = websiteMap[item.parent_domain_id].domain;
        }
        return item;
      }));
    });
    // this.apiService.get<WhFtpModel[]>(this.apiPath, { limit: 999999999, offset: 0 }, results => {

    //   callback(results.map(item => {
    //     item['hosting'] = this.webHostingService.hostingMap[item['hosting']].Host;
    //     if (this.websiteMap[item.parent_domain_id]) {
    //       item.parent_domain_id = this.websiteMap[item.parent_domain_id].domain;
    //     }
    //     return item;
    //   }));

    // });
  }

}

import { Component, OnInit } from '@angular/core';
import { WebHostingBaseListComponent } from '../../web-hosting-base-list.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { WhWebsiteModel } from '../../../../models/wh-website.model';
import { WebHostingService } from '../../web-hosting-service';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-website-list',
  templateUrl: './website-list.component.html',
  styleUrls: ['./website-list.component.scss'],
})
export class WebsiteListComponent extends WebHostingBaseListComponent<WhWebsiteModel> implements OnInit {

  componentName: string = 'WebsiteListComponent';
  formPath = '/web-hosting/websites/form';
  apiPath = '/web-hosting/websites';
  idKey = 'domain_id';

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
        domain_id: {
          title: 'Domain ID',
          type: 'string',
          width: '10%',
        },
        domain: {
          title: 'Domain name',
          type: 'string',
          width: '40%',
        },
        hosting: {
          title: 'Hosting',
          type: 'string',
          width: '30%',
        },
        ip_address: {
          title: 'IP Address',
          type: 'string',
          width: '20%',
        },
      },
    });
  }

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public webHostingService: WebHostingService,
  ) {
    super(apiService, router, cms, dialogService, toastService, webHostingService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Get data from api and push to list */
  // loadList(callback?: (list: WhWebsiteModel[]) => void) {
  //   super.loadList((list: WhWebsiteModel[]) => {

  //     if (callback) {
  //       callback(list.map(item => {
  //         item['hosting'] = this.webHostingService.hostingMap[item['hosting']].Host;
  //         return item;
  //       }));
  //     }

  //   });
  // }

  getList(callback: (list: WhWebsiteModel[]) => void) {
    super.getList(list => {
      callback(list.map(item => {
        item['hosting'] = this.webHostingService.hostingMap[item['hosting']].Host;
        return item;
      }));
    });
    // this.apiService.get<WhWebsiteModel[]>(this.apiPath, { limit: 999999999, offset: 0 }, results => {

    //   callback(results.map(item => {
    //     item['hosting'] = this.webHostingService.hostingMap[item['hosting']].Host;
    //     return item;
    //   }));

    // });
  }

}

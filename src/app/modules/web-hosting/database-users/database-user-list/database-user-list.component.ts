import { Component, OnInit } from '@angular/core';
import { WebHostingBaseListComponent } from '../../web-hosting-base-list.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { WebHostingService } from '../../web-hosting-service';
import { WhDatabaseUserModel } from '../../../../models/wh-database-user.model';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-database-user-list',
  templateUrl: './database-user-list.component.html',
  styleUrls: ['./database-user-list.component.scss'],
})
export class DatabaseUserListComponent extends WebHostingBaseListComponent<WhDatabaseUserModel> implements OnInit {

  componentName: string = 'DatabaseUserListComponent';
  formPath = '/web-hosting/database-users/form';
  apiPath = '/web-hosting/database-users';
  idKey = 'database_user_id';

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
          width: '10%',
        },
        database_user: {
          title: 'Domain name',
          type: 'string',
          width: '60%',
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
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public webHostingService: WebHostingService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, webHostingService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Get data from api and push to list */
  // loadList(callback?: (list: WhDatabaseUserModel[]) => void) {
  //   super.loadList((list: WhDatabaseUserModel[]) => {

  //     if (callback) {
  //       callback(list.map(item => {
  //         item['hosting'] = this.webHostingService.hostingMap[item['hosting']].Host;
  //         return item;
  //       }));
  //     }

  //   });
  // }

  getList(callback: (list: WhDatabaseUserModel[]) => void) {
    super.getList(list => {
      callback(list.map(item => {
        item['hosting'] = this.webHostingService.hostingMap[item['hosting']].Host;
        return item;
      }));
    });
    // this.apiService.get<WhDatabaseUserModel[]>(this.apiPath, { limit: 999999999, offset: 0 }, results => {

    //   callback(results.map(item => {
    //     item['hosting'] = this.webHostingService.hostingMap[item['hosting']].Host;
    //     return item;
    //   }));

    // });
  }

}

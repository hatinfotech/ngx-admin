import { Component, OnInit } from '@angular/core';
import { WebHostingBaseListComponent } from '../../web-hosting-base-list.component';
import { WhDatabaseModel } from '../../../../models/wh-database.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { WebHostingService } from '../../web-hosting-service';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-database-list',
  templateUrl: './database-list.component.html',
  styleUrls: ['./database-list.component.scss'],
})
export class DatabaseListComponent extends WebHostingBaseListComponent<WhDatabaseModel> implements OnInit {

  componentName: string = 'DatabaseListComponent';
  formPath = '/web-hosting/databases/form';
  apiPath = '/web-hosting/databases';
  idKey = 'database_id';

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
        database_name: {
          title: 'Database name',
          type: 'string',
          width: '60%',
        },
        database_user_id: {
          title: 'User',
          type: 'string',
          width: '30%',
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
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public webHostingService: WebHostingService,
  ) {
    super(apiService, router, cms, dialogService, toastService, webHostingService);

  }

  ngOnInit() {
    this.restrict();
    // this.apiService.get<WhDatabaseUserModel[]>('/web-hosting/database-users', {}, dbUsers => {
    //   dbUsers.forEach(dbUser => {
    //     this.databaseUserMap[dbUser.database_user_id] = dbUser;
    //   });
    super.ngOnInit();
    // });

  }

  async getList(callback: (list: WhDatabaseModel[]) => void) {
    const dbUserList = await this.webHostingService.getDatabaseUserMap();
    super.getList(list => {
      callback(list.map(item => {
        item['hosting'] = this.webHostingService.hostingMap[item['hosting']].Host;
        if (item.database_user_id && dbUserList[item.database_user_id]) {
          item.database_user_id = dbUserList[item.database_user_id].database_user;
        }
        return item;
      }));
    });

    // this.apiService.get<WhDatabaseUserModel[]>('/web-hosting/database-users', {}, dbUsers => {
    //   dbUsers.forEach(dbUser => {
    //     this.databaseUserMap[dbUser.database_user_id] = dbUser;
    //   });
    //   this.apiService.get<WhDatabaseModel[]>(this.apiPath, { limit: 999999999, offset: 0 }, results => {

    //     callback(results.map(item => {
    //       item['hosting'] = this.webHostingService.hostingMap[item['hosting']].Host;
    //       if (item.database_user_id && this.databaseUserMap[item.database_user_id]) {
    //         item.database_user_id = this.databaseUserMap[item.database_user_id].database_user;
    //       }
    //       return item;
    //     }));

    //   });
    // });


  }

}

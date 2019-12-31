import { Component, OnInit } from '@angular/core';
import { WebHostingBaseListComponent } from '../../web-hosting-base-list.component';
import { WhDatabaseModel } from '../../../../models/wh-database.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { WebHostingService } from '../../web-hosting-service';
import { WhDatabaseUserModel } from '../../../../models/wh-database-user.model';

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

  databaseUserMap: { [key: string]: WhDatabaseUserModel } = {};

  constructor(
    protected apiService: ApiService,
    public router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    public webHostingService: WebHostingService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, webHostingService);
    this.apiService.get<WhDatabaseUserModel[]>('/web-hosting/database-users', {}, dbUsers => {
      dbUsers.forEach(dbUser => {
        this.databaseUserMap[dbUser.database_user_id] = dbUser;
      });
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: WhDatabaseModel[]) => void) {
    this.apiService.get<WhDatabaseModel[]>(this.apiPath, { limit: 999999999, offset: 0 }, results => {

      callback(results.map(item => {
        item['hosting'] = this.webHostingService.hostingMap[item['hosting']].Host;
        item.database_user_id = this.databaseUserMap[item.database_user_id].database_user;
        return item;
      }));

    });
  }

}

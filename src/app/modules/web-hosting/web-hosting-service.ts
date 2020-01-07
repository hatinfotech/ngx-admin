import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { WhHostingModel } from '../../models/wh-hosting.model';
import { CommonService } from '../../services/common.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { WhWebsiteModel } from '../../models/wh-website.model';
import { WhDatabaseUserModel } from '../../models/wh-database-user.model';

@Injectable({
  providedIn: 'root',
})
export class WebHostingService {

  hostingList: WhHostingModel[];
  // activeHosting: string;
  hostingListConfig = {
    placeholder: 'Chọn hosting...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Host',
    },
  };

  hostingMap: { [key: string]: WhHostingModel } = {};
  websiteMap: { [key: string]: WhWebsiteModel } = {};
  databaseUserMap: { [key: string]: WhDatabaseUserModel } = {};

  readySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  ready$ = this.readySubject.asObservable();

  activeHostingChangeSubject: BehaviorSubject<{ fromComponent: string, activeHosting: string }> = new BehaviorSubject<{ fromComponent: string, activeHosting: string }>({ fromComponent: '', activeHosting: '' });
  activeHostingChange$: Observable<{ fromComponent: string, activeHosting: string }> = this.activeHostingChangeSubject.asObservable();

  constructor(
    private apiService: ApiService,
    // private authService: NbAuthService,
    private commonService: CommonService,
  ) {
    const oldActiveHosting = this.activeHosting;
    this.activeHosting = Date.now().toString();
    this.apiService.get<WhHostingModel[]>('/web-hosting/hostings', {}, hostings => {
      this.hostingList = this.commonService.convertOptionList(hostings, 'Code', 'Host');
      this.activeHosting = oldActiveHosting;
      this.hostingList.forEach(hosting => {
        this.hostingMap[hosting.Code] = hosting;
      });
      this.reloadHostingData(() => {
        this.readySubject.next(true);
      }, true);

    });


  }

  get activeHosting() {
    return localStorage.getItem('active_hosting');
  }

  set activeHosting(hosting: string) {
    localStorage.setItem('active_hosting', hosting);
  }

  onChangeHosting(event: WhHostingModel, componentName: string) {
    if (event && event.Code) {
      this.activeHosting = event.Code;
      this.activeHostingChangeSubject.next({ fromComponent: componentName, activeHosting: this.activeHosting });
    }
    // this.reloadHostingData();
    this.clearCache();
  }

  reloadHostingData(callback?: () => void, force?: boolean) {
    this.commonService.takeUntil('webhosting_reload_hosting_data', force ? 0 : 300, () => {
      this.apiService.get<WhWebsiteModel[]>('/web-hosting/websites', { hosting: this.activeHosting }, websites => {
        this.websiteMap = {};
        websites.forEach(website => {
          this.websiteMap[website.domain_id] = website;
        });

        this.apiService.get<WhDatabaseUserModel[]>('/web-hosting/database-users', { hosting: this.activeHosting }, dbUsers => {
          this.databaseUserMap = {};
          dbUsers.forEach(dbUser => {
            this.databaseUserMap[dbUser.database_user_id] = dbUser;
          });
          if (callback) callback();
        });

      });
    });
  }

  async getWebsiteMap(): Promise<{ [key: string]: WhWebsiteModel }> {
    return new Promise<{ [key: string]: WhWebsiteModel }>(resp => {

      if (this.websiteMap) {
        resp(this.websiteMap);
      } else {

        this.apiService.get<WhWebsiteModel[]>('/web-hosting/websites', { hosting: this.activeHosting }, websites => {
          this.websiteMap = {};
          websites.forEach(website => {
            this.websiteMap[website.domain_id] = website;
          });

          resp(this.websiteMap);
        });
      }
    });
  }

  async getWebsiteList(): Promise<WhWebsiteModel[]> {
    const websiteMap = await this.getWebsiteMap();
    const websiteList: WhWebsiteModel[] = [];
    Object.keys(websiteMap).map(i => {
      websiteList.push(websiteMap[i]);
    });

    return websiteList;
  }

  async getDatabaseUserMap(): Promise<{ [key: string]: WhDatabaseUserModel }> {
    return new Promise<{ [key: string]: WhDatabaseUserModel }>(resp => {

      if (this.databaseUserMap) {
        resp(this.databaseUserMap);
      } else {

        this.apiService.get<WhDatabaseUserModel[]>('/web-hosting/database-users', { hosting: this.activeHosting }, dbUsers => {
          this.databaseUserMap = {};
          dbUsers.forEach(dbUser => {
            this.databaseUserMap[dbUser.database_user_id] = dbUser;
          });
          resp(this.databaseUserMap);
        });
      }
    });
  }

  async getDatabaseUserList(): Promise<WhDatabaseUserModel[]> {
    const databaseUserMap = await this.getDatabaseUserMap();
    const databaseUserList: WhDatabaseUserModel[] = [];
    Object.keys(databaseUserMap).map(i => {
      databaseUserList.push(databaseUserMap[i]);
    });

    return databaseUserList;
  }

  reloadCache() {
    this.apiService.get<WhHostingModel[]>('/web-hosting/hostings', {}, hostings => {
      this.hostingList = this.commonService.convertOptionList(hostings, 'Code', 'Host');
      this.hostingList.forEach(hosting => {
        this.hostingMap[hosting.Code] = hosting;
      });
    });
  }

  clearCache() {
    this.websiteMap = null;
    this.databaseUserMap = null;
  }
}

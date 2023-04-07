import { WpSiteModel } from './../../models/wordpress.model';
import { take, filter } from 'rxjs/operators';
import { CommonService } from '../../services/common.service';
import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NbAuthService } from '@nebular/auth';
import { BehaviorSubject } from 'rxjs';
import { PageModel } from '../../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {

  siteList$ = new BehaviorSubject<WpSiteModel[]>([]);
  currentSite$: BehaviorSubject<string>;

  constructor(
    public cms: CommonService,
    public apiService: ApiService,
    public authService: NbAuthService,
  ) {

    // Load current apge form local store
    let currenPageCache = localStorage.getItem('wordpress.site');
    if (typeof currenPageCache === 'string') {
      currenPageCache = JSON.parse(currenPageCache);
    }
    this.currentSite$ = new BehaviorSubject<string>(currenPageCache);

    // store current page on change
    this.currentSite$.subscribe(value => localStorage.setItem('wordpress.site', typeof value === 'undefined' ? null : JSON.stringify(value)));

    // wait for first authentication success
    this.authService.isAuthenticated().pipe(take(1), filter(f => !!f)).toPromise().then(() => {
      this.apiService.getPromise<PageModel[]>('/wordpress/sites', { onlyIdText: true }).then(pageList => this.siteList$.next([{'id': 'NONE', text: 'None'}, { id: 'ALL', text: 'Tất cả' }, ...pageList]));
    });

  }
}

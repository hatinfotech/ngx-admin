import { take, filter } from 'rxjs/operators';
import { CommonService } from '../../services/common.service';
import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NbAuthService } from '@nebular/auth';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PageModel } from '../../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {

  pageList$ = new BehaviorSubject<PageModel[]>([]);
  currentpage$: BehaviorSubject<string>;

  constructor(
    public cms: CommonService,
    public apiService: ApiService,
    public authService: NbAuthService,
  ) {

    let isAuthenticatedSubscription: Subscription = null;
    this.currentpage$ = new BehaviorSubject<string>(null);

    this.authService.isAuthenticated().subscribe(async isAuthenticated => {
      if (isAuthenticated) {

        // wait for first authentication success
        await this.apiService.getPromise<PageModel[]>('/collaborator/pages', { onlyIdText: true }).then(pageList => {
          this.pageList$.next([{ id: '', text: '' }, ...pageList]);
        });
        
        const loginInfo = await this.cms.loginInfo$.pipe(filter(f => !!f), take(1)).toPromise();
        // store current page on change
        isAuthenticatedSubscription = this.currentpage$.subscribe(async value => {
          const loginInfo = await this.cms.loginInfo$.pipe(filter(f => !!f), take(1)).toPromise();
          if (loginInfo && loginInfo.user?.Code) {
            localStorage.setItem(loginInfo.user.Code + '.collaborator.page', typeof value === 'undefined' ? '' : value);
          }
        });

        // Load current apge form local store
        const currenPageCache = localStorage.getItem(loginInfo.user.Code + '.collaborator.page');
        this.currentpage$.next(currenPageCache);

      } else {
        if (isAuthenticatedSubscription) {
          isAuthenticatedSubscription.unsubscribe();
        }
      }
    });

  }
}

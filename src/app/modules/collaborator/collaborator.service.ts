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
export class CollaboratorService {

  pageList$ = new BehaviorSubject<PageModel[]>([]);
  currentpage$: BehaviorSubject<string>;

  constructor(
    public cms: CommonService,
    public apiService: ApiService,
    public authService: NbAuthService,
  ) {

    // Load current apge form local store
    const currenPageCache = localStorage.getItem('collaborator.page');
    this.currentpage$ = new BehaviorSubject<string>(currenPageCache);

    // store current page on change
    this.currentpage$.subscribe(value => localStorage.setItem('collaborator.page', typeof value === 'undefined' ? '' : value));

    // wait for first authentication success
    this.authService.isAuthenticated().pipe(take(1), filter(f => !!f)).toPromise().then(() => {
      this.apiService.getPromise<PageModel[]>('/collaborator/pages', { onlyIdText: true }).then(pageList => this.pageList$.next([{id: '', text: ''}, ...pageList]));
    });

  }
}

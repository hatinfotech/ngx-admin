import { ApiService } from '../../services/api.service';
import { NbAuthService } from '@nebular/auth';
import { AccountModel } from '../../models/accounting.model';
import { filter, take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommercePosService {
  reportToDate$ = new BehaviorSubject<Date>(null);
  reportFromDate$ = new BehaviorSubject<Date>(null);
  accountList$ = new BehaviorSubject<AccountModel[]>(null);
  constructor(
    public authService: NbAuthService,
    public apiService: ApiService,
  ) {
    if (!this.reportFromDate$?.value) {
      const reportFromDateCache = localStorage.getItem('Accounting.ReportFromDate');
      if (reportFromDateCache) {
        this.reportFromDate$.next(new Date(parseInt(reportFromDateCache)));
      }
    }
    this.reportFromDate$.pipe(filter(f => f !== null)).subscribe(reportFromDate => {
      localStorage.setItem('Accounting.ReportFromDate', reportFromDate.getTime().toString());
    });
    if (!this.reportToDate$?.value) {
      const reportToDateCache = localStorage.getItem('Accounting.ReportToDate');
      if (reportToDateCache) {
        this.reportToDate$.next(new Date(parseInt(reportToDateCache)));
      }
    }
    this.reportToDate$.pipe(filter(f => f !== null)).subscribe(reportToDate => {
      localStorage.setItem('Accounting.ReportToDate', reportToDate.getTime().toString());
    });

    this.authService.isAuthenticated().pipe(filter(f => f === true), take(1)).toPromise().then(status => {
      this.apiService.getPromise<AccountModel[]>('/accounting/accounts', {limit: 'nolimit'}).then(accounts => {
        this.accountList$.next(accounts);
      });
    });
  }
}

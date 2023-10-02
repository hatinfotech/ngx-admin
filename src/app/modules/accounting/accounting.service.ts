import { ApiService } from './../../services/api.service';
import { NbAuthService } from '@nebular/auth';
import { AccountModel, CostClassificationModel } from './../../models/accounting.model';
import { filter, take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {
  reportToDate$ = new BehaviorSubject<Date>(null);
  reportFromDate$ = new BehaviorSubject<Date>(null);
  accountList$ = new BehaviorSubject<AccountModel[]>(null);
  costClassificationtList$ = new BehaviorSubject<CostClassificationModel[]>(null);
  accountMap$ = new BehaviorSubject<{ [key: string]: AccountModel }>(null);
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
      this.apiService.getPromise<AccountModel[]>('/accounting/accounts', { limit: 'nolimit' }).then(accounts => {
        this.accountList$.next(accounts);
        const accountMap = {};
        for (const account of accounts) {
          accountMap[account.Code] = account;
        }
        this.accountMap$.next(accountMap);
      });

      this.apiService.getPromise<CostClassificationModel[]>('/accounting/cost-classifications', { limit: 'nolimit', includeIdText: true, loadByTree: true }).then(costClassificationList => {
        this.costClassificationtList$.next(this.prepareCostClassifications(costClassificationList, 0));
      });
    });
  }

  prepareCostClassifications(tree: CostClassificationModel[], level: number) {
    let result = [];
    for (const node of tree) {
      node.level = level;
      node.text = `${node.text}` + ` (${node.id}/${node.AccModel})`;
      node.title = '+ - '.repeat(level) + node.text;
      result.push(node);
      if (node.children && node.children.length > 0) {
        const rs = this.prepareCostClassifications(node.children, level + 1);
        result = [
          ...result,
          ...rs,
        ];
        delete node.children;
      }
    }

    return result;

    // node.text = `[${node.id}] ${node.text}` + (node.Parent == null ? ` (${node.AccModel})` : '');
    // if(node.children && node.children.length > 0) {
    //   for(const chilNode of node.children) {
    //     this.prepareCostClassifications(chilNode);
    //   }
    // }
  }
}

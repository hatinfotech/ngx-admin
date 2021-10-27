import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {
  reportToDate$ = new BehaviorSubject<Date>(null);
  constructor() {
    if(!this.reportToDate$?.value) {
      const reportToDateCache = localStorage.getItem('Accounting.ReportToDate');
      if(reportToDateCache) {
        this.reportToDate$.next(new Date(parseInt(reportToDateCache)));
      }
    }
    this.reportToDate$.pipe(filter(f => f !== null)).subscribe(reportToDate => {
      localStorage.setItem('Accounting.ReportToDate', reportToDate.getTime().toString());
    });
   }
}

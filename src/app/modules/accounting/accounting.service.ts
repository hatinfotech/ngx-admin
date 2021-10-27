import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {
  reportToDate$ = new BehaviorSubject<Date>(null);
  constructor() { }
}

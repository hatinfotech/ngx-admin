import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MinierpService {

  readySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  ready$ = this.readySubject.asObservable();

  constructor() { }
}

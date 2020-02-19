import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActionControl } from '../../interface/action-control.interface';

export interface CallState {
  state: string;
  partnerName?: string;
  partnerNumber?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MobileAppService {

  callStateSubject: BehaviorSubject<CallState> = new BehaviorSubject<CallState>({ state: 'normal' });
  callState$: Observable<CallState> = this.callStateSubject.asObservable();

  constructor() { }

  hadIncommingCall(incommingCallState: CallState) {
    this.callStateSubject.next(incommingCallState);
  }

  hadOutgoingCall(outGogincallState: CallState) {
    this.callStateSubject.next(outGogincallState);
  }

  callEnd(callEndState: CallState) {
    this.callStateSubject.next(callEndState);
  }
}

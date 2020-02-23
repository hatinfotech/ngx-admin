import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActionControl } from '../../interface/action-control.interface';
import { ChatRoomComponent } from './chat-room/chat-room.component';

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

  requestOpenChatRoomSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  requestOpenChatRoom$: Observable<string> = this.requestOpenChatRoomSubject.asObservable();

  private mobileApp: ChatRoomComponent;

  constructor() { }

  registerMobileApp(mobileApp: ChatRoomComponent) {
    this.mobileApp = mobileApp;
  }

  hadIncommingCall(incommingCallState: CallState) {
    this.callStateSubject.next(incommingCallState);
  }

  hadOutgoingCall(outGogincallState: CallState) {
    this.callStateSubject.next(outGogincallState);
  }

  callEnd(callEndState: CallState) {
    this.callStateSubject.next(callEndState);
  }

  request<T>(action: string, data: any): Promise<T> {
    if (this.mobileApp) {
      switch (action) {
        case 'open-chat-room':
          this.mobileApp.openChatRoom(data);
          return;
      }
    }
    throw Error('Mobile app was not registered !!!');
  }

}

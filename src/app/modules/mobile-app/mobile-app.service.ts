import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MobileAppComponent } from './mobile-app.component';
import { CallingSession } from './phone-manager/calling-session';
import { DialpadComponent } from './dialpad/dialpad.component';

export interface CallState {
  state: string;
  partnerName?: string;
  partnerNumber?: string;
  session?: CallingSession;
}

@Injectable({
  providedIn: 'root',
})
export class MobileAppService {

  callStateSubject: BehaviorSubject<CallState> = new BehaviorSubject<CallState>({ state: 'normal' });
  callState$: Observable<CallState> = this.callStateSubject.asObservable();

  requestOpenChatRoomSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  requestOpenChatRoom$: Observable<string> = this.requestOpenChatRoomSubject.asObservable();

  public mobileApp: MobileAppComponent;
  public callScreen: DialpadComponent;

  constructor() { }

  get callScrennMinimized() {
    return this.callScreen.minimized;
  }

  registerMobileApp(mobileApp: MobileAppComponent) {
    this.mobileApp = mobileApp;
  }
  registerCallScreen(callScreen: DialpadComponent) {
    this.callScreen = callScreen;
  }

  updateCallState(incommingCallState: CallState) {
    this.mobileApp.switchScreen('phone');
    this.callStateSubject.next(incommingCallState);
  }

  hadAnotherIncommingCall(incommingCallState: CallState) {
    this.mobileApp.switchScreen('phone');
    this.callStateSubject.next(incommingCallState);
  }

  hadOutgoingCall(outGogincallState: CallState) {
    this.mobileApp.switchScreen('phone');
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

  switchScreen(screen: string) {
    this.mobileApp.switchScreen(screen);
  }

  phoneCall(phone: string, name: string) {
    this.callScreen.call(phone, name);
  }
}

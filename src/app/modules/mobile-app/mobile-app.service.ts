import { filter, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MobileAppComponent } from './mobile-app.component';
import { CallingSession } from './phone-manager/calling-session';
import { DialpadComponent } from './dialpad/dialpad.component';
import { Track } from '../../@core/utils/player.service';
import { FrameSocket } from '../../lib/frame-socket/frame-socket';

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
  frameSocket: FrameSocket;

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

  async request<T>(action: string, data: any): Promise<T> {
    if (this.mobileApp) {
      switch (action) {
        case 'open-chat-room':
          this.mobileApp.openChatRoom(data);
          return;
      }
    }
    throw Error('Mobile app was not registered !!!');
  }

  async openChatRoom(params: { ChatRoom: string, [key: string]: any }) {
    // if(!this.frameSocket) {
    //   throw new Error('Frame socket was not init');
    // }
    FrameSocket.broadcast('open-chat-room', { chatRoom: params.ChatRoom }).then(rsp => {
      console.debug(rsp);
    });
    return true;
    // if (this.mobileApp) {
    // return this.mobileApp.openChatRoom(params);
    // }11111
    throw Error('Mobile app was not registered !!!');
  }

  switchScreen(screen: string) {
    this.mobileApp.switchScreen(screen);
  }

  /**
   * Send make phone call request to mobile app
   * then return promise with CallSession.id as string
   */
  async phoneCall(phone: string, name: string): Promise<string> {
    // return this.callScreen.call(phone, name);
    if (!this.frameSocket) {
      throw new Error('Frame socket was not init');
    }
    return this.frameSocket.emit<string>('phone-call', { phonenumber: phone, name: name });
  }

  playMedia(tracks: Track[]) {
    this.mobileApp.playMedias(tracks);
  }

  async allReady() {
    while (FrameSocket._frameSockets.length < 1) {
      console.log('waiting for 2 socket online...');
      await new Promise(resolve => setTimeout(() => resolve(true), 1000));
    }
    return Promise.all(FrameSocket._frameSockets.map(frameSocket => {
      return frameSocket.isReady$.pipe(filter(f => f), take(1)).toPromise();
    })).then(rs => {
      console.log('all frame socket ready');
      return rs;
    });
  }
}

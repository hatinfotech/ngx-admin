import { take } from 'rxjs/operators';
import { CommonService } from './common.service';
import { Injectable, Pipe } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { ShowcaseDialogComponent } from '../modules/dialog/showcase-dialog/showcase-dialog.component';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { MobileAppService } from '../modules/mobile-app/mobile-app.service';

declare const $: any;
@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  constructor(
    private angularFireMessaging: AngularFireMessaging,
    private toastrService: NbToastrService,
    private mobileService: MobileAppService,
  ) {
    this.angularFireMessaging.messages.subscribe(
      (_messaging: any) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  }

  async requestPermission() {
    return this.angularFireMessaging.requestToken.pipe(take(1)).toPromise();
    // .then(
    //   (token) => {
    //     console.log(token);
    //   },
    //   (err) => {
    //     console.error('Unable to get permission to notify.', err);
    //   }
    // );
  }

  async deleteToken(token: string) {
    this.angularFireMessaging.deleteToken(token).pipe(take(1)).toPromise();
  }

  receiveMessage() {
    return this.angularFireMessaging.messages;
  }

  async getToken() {
    return this.angularFireMessaging.getToken.pipe(take(1)).toPromise();
  }
}
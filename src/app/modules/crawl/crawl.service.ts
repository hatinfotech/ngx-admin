import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActionControl } from '../../lib/custom-element/action-control-list/action-control.interface';
import { MySocket } from '../../lib/nam-socket/my-socket';

@Injectable({
  providedIn: 'root',
})
export class CrawlService {

  botSockets: { [key: string]: MySocket } = {};

  constructor() { }

  async getBotSocket(uri: string, reconnect?: boolean): Promise<MySocket> {
    let isNewConnect = false;
    if (!this.botSockets[uri]) {
      this.botSockets[uri] = new MySocket(uri);
      reconnect = false;
      isNewConnect = true;
    }
    if (reconnect) {
      this.botSockets[uri].disconnect();
      setTimeout(() => {
        this.botSockets[uri].connect();
      }, 1000);
      isNewConnect = true;
    }

    if (isNewConnect) {
      return new Promise<MySocket>((resolve, reject) => {
        const subc = this.botSockets[uri].onConnect$.subscribe(rs => {
          resolve(this.botSockets[uri]);
          subc.unsubscribe();
        });
      });
    }

    return this.botSockets[uri];
  }

}

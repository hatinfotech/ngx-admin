import * as socketIo from 'socket.io-client';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';

export interface SocketData<T> {
  seq: number;
  type: string;
  data: T;
}

export interface ISocketResult<T> {
  data: T;
  callback?: (response: any) => void;
}

export class MySocket {
  socket: SocketIOClient.Socket;
  io: SocketIOClient.Manager;
  nsp: string;
  id: string;
  get connected() { return this.socket.connected; }
  get disconnected() { return this.socket.disconnected; }
  emitTimeout = 30000;

  private seq = 0;

  emitCallbackSubject: BehaviorSubject<SocketData<any>> = new BehaviorSubject<SocketData<any>>(null);
  emitCallback$: Observable<SocketData<any>> = this.emitCallbackSubject.asObservable();

  stateSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  state$: Observable<string> = this.stateSubject.asObservable();

  onConnectSubject = new BehaviorSubject<any>(null);
  onConnect$ = this.onConnectSubject.asObservable();

  onReconnectSubject = new BehaviorSubject<any>(null);
  onReconnect$ = this.onReconnectSubject.asObservable();

  onDisconnectSubject = new BehaviorSubject<any>(null);
  onDisconnect$ = this.onDisconnectSubject.asObservable();

  private events: { [key: string]: Subscriber<any>[] } = {};

  constructor(
    protected uri: string,
    protected opts?: SocketIOClient.ConnectOpts,
  ) {
    this.socket = socketIo(uri, opts);
    this.initEvent();
    this.state$.subscribe(state => {
      if (state) {
        try {
          console.info(`Socket ${this.socket.id} change state to : ${state}`);
        } catch (e) { console.info(e); }
      }
    });

    this.stateSubject.next('constructor');
  }

  initEvent() {

    this.socket.on('reconnect', async (att: number) => {
      console.info(this.id + ' reconnect : ' + att);
      this.onReconnectSubject.next(att);
      this.stateSubject.next('connect');
    });
    this.socket.on('reconnect_attempt', (att: number) => {
      console.info(this.id + ' reconnect_attempt : ' + att);
    });
    this.socket.on('disconnect', (att: number) => {
      console.info(this.id + ' disconnect : ' + att);
      this.stateSubject.next('disconnect');
      this.onDisconnectSubject.next(att);
    });
    this.socket.on('reconnecting', (att: number) => {
      console.info(this.id + ' reconnecting : ' + att);
      this.stateSubject.next('reconnecting');
    });

    this.socket.on('connect', () => {
      this.onConnectSubject.next(true);
    });

    this.socket.on('callback', (result: SocketData<any>) => {
      console.info('On Callback : ', result);
      this.emitCallbackSubject.next(result);
      // this.stateSubject.next('init-event ');
    });

    // Restore events register
    Object.keys(this.events).forEach(eventName => {
      const event = this.events[eventName];
      event.forEach(subscriber => {
        this.eventRegister(eventName, subscriber);
      });
    });

  }

  removeAllListeners() {
    console.log('Remove socket event listener');
    this.stateSubject.next('no-event');
    this.socket.removeAllListeners();
  }

  public async emit<T>(event: string, data: any, timeout?: number): Promise<T> {
    const checkpointSeq = this.seq++;
    console.info(`Emit event : ${event} - seq : ${checkpointSeq} - data : `, data);
    // if (!this.socket.connected) {
    //   if (!(await this.retryConnect())) {
    //     throw Error('Socket ' + this.socket.id + ' was disconnected !!!');
    //   }
    // }

    if (!this.socket.connected) {
      await new Promise<boolean>((resolve, reject) => {
        this.connect();
        const subsc = this.onConnect$.subscribe(status => {
          resolve(true);
          try { subsc.unsubscribe(); } catch (e) { console.log(e); }
        });
      });
    }
    this.socket.emit(event, { seq: checkpointSeq, type: 'success', data });
    return new Promise<T>((resolve, reject) => {

      // Subcrice callback
      let complete = false;
      let subcription = this.emitCallback$.subscribe(result => {
        if (result) {
          if (result.seq === checkpointSeq) {
            subcription.unsubscribe();
            subcription = null;
            complete = true;
            if (result.type === 'success') {
              resolve(result.data);
            } else {
              reject(result.data);
            }
          }
        }

        // Reject on timeout
        setTimeout(async () => {
          if (subcription) {
            try { subcription.unsubscribe(); } catch (e) { console.log(e); }

            if (!complete) {
              console.log('Retry emit ' + event);
              this.stateSubject.next('emit-timeout');
              reject(`Socket emit timeout ${timeout ? timeout : this.emitTimeout}`);
            }
          }
        }, timeout ? timeout : this.emitTimeout);
      });

    });
  }

  async retryConnect(): Promise<boolean> {

    return this.reset();

    // let tryCount = 0;
    // while (true) {
    //   this.stateSubject.next('retry-connect');
    //   tryCount++;
    //   console.info('Retry to connect socket : ' + this.socket);
    //   const result = await new Promise<boolean>((resolve, reject) => {
    //     this.socket.connect();
    //     setTimeout(() => {
    //       resolve(false);
    //     }, 1000);
    //   });
    //   if (result) {
    //     return true;
    //   }
    //   if (tryCount > 2) {
    //     console.log('Retry connect timeout ' + tryCount);
    //     this.stateSubject.next('retry-connect-failed');
    //     await this.reset();
    //     return true;
    //     // return false;
    //   }
    //   if (tryCount > 5) {
    //     console.log('Retry connect timeout ' + tryCount);
    //     return false;
    //   }
    // }

    // return true;
  }

  connect() {
    this.socket.connect();
  }

  disconnect(): SocketIOClient.Socket {
    this.stateSubject.next('disconnect');
    return this.socket.disconnect();
  }

  // on<T>(event: string): Observable<T> {
  //   return new Observable<T>(observer => {
  //     this.socket.on(event, (data: T) => observer.next(data));
  //   });
  // }

  onBk<T>(event: string): Observable<{ data: T, callback?: (response?: any) => void }> {
    return new Observable<{ data: T, callback?: () => void }>(observer => {
      this.socket.on(event, (request: SocketData<T>) => {
        observer.next({
          data: request && request.data ? request.data : null,
          callback: (response?: any) => {
            this.callback<any>(request.seq, response);
          },
        });
      });
    });
  }

  on<T>(event: string): Observable<{ data: T, callback?: (response?: any) => void }> {
    const osb = new Observable<ISocketResult<T>>(subscriber => {
      // this.socket.on(event, (request: SocketData<T>) => {
      //   subscriber.next({
      //     data: request && request.data ? request.data : null,
      //     callback: (response?: any) => {
      //       this.callback<any>(request.seq, response);
      //     }
      //   });
      // });
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(subscriber);
      this.eventRegister(event, subscriber);
    });
    return osb;
    // return new Observable<{ data: T, callback?: () => void }>(observer => {
    //   this.socket.on(event, (request: SocketData<T>) => {
    //     observer.next({
    //       data: request && request.data ? request.data : null,
    //       callback: (response?: any) => {
    //         this.callback<any>(request.seq, response);
    //       }
    //     });
    //   });
    // });
  }


  eventRegister<T>(event: string, subscriber: Subscriber<ISocketResult<T>>) {
    // this.events[event]
    this.socket.on(event, (request: SocketData<T>) => {
      subscriber.next({
        data: request && request.data ? request.data : null,
        callback: (response?: any) => {
          this.callback<any>(request.seq, response);
        },
      });
    });
  }

  // onConnect() {
  //   return this.on<any>('connect');
  // }

  // onReconnect(): Observable<> {

  // }

  // onReconnecting() {

  // }

  // onDisconnect() {

  // }

  public async callback<T>(seq: number, data: T) {
    this.socket.emit('callback', { seq, type: 'success', data });
  }

  async reset() {
    console.log('Reset socket connenction');
    this.removeAllListeners();
    // this.socket.disconnect();
    this.socket.close();
    this.socket = socketIo(this.uri, this.opts);
    this.initEvent();

    await new Promise(resolve => setTimeout(() => resolve(), 5000));
    return true;
  }
}

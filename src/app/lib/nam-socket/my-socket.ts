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

export interface IMySocketContext {
  getLoginInfo: () => { token: string, user: { id: string, name: string, [key: string]: any }, [key: string]: any };
}

export class MySocket {
  socket: SocketIOClient.Socket;
  io: SocketIOClient.Manager;
  nsp: string;
  id: string;
  get connected() { return this.socket.connected; }
  get disconnected() { return this.socket.disconnected; }
  emitTimeout = 10000;

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
  public socketServerId$ = new BehaviorSubject<string>(null);

  /** Context where sokcet using */
  protected context: IMySocketContext;

  constructor(uri: string, opts?: SocketIOClient.ConnectOpts) {
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

    this.onReconnect$.subscribe(att => {
      console.info(this.id + ' reconnected : ' + att);
      this.stateSubject.next('reconnected');

      this.reInit();
    });
  }

  setContext(context: IMySocketContext) {
    this.context = context;
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
    this.stateSubject.next('no-event');
    this.socket.removeAllListeners();
  }

  reInit() {
    this.removeAllListeners();
    this.initEvent();
  }

  public async emit<T>(event: string, data: any, timeout?: number): Promise<T> {
    const checkpointSeq = this.seq++;
    console.info(`Emit event : ${event} - seq : ${checkpointSeq} - data : `, data);
    if (!this.socket.connected) {
      if (!(await this.retryConnect())) {
        throw Error('Socket ' + this.socket.id + ' was disconnected !!!');
      }
    }
    this.socket.emit(event, { seq: checkpointSeq, type: 'success', data });
    return new Promise<T>((resolve, reject) => {

      // Subcrice callback
      let subcription = this.emitCallback$.subscribe(result => {
        if (result) {
          if (result.seq === checkpointSeq) {
            if (result.type === 'success') {
              resolve(result.data);
            } else {
              reject(result.data);
            }
            subcription.unsubscribe();
            subcription = null;
          }
        }

        // Reject on timeout
        setTimeout(() => {
          if (subcription) {
            this.stateSubject.next('emit-timeout');
            subcription.unsubscribe();
            reject(`Socket emit timeout ${timeout ? timeout : this.emitTimeout}`);
          }
        }, timeout ? timeout : this.emitTimeout);
      });

    });
  }

  async retryConnect(): Promise<boolean> {
    let tryCount = 0;
    while (!this.socket.connected) {
      this.stateSubject.next('retry-connect');
      tryCount++;
      console.info('Retry to connect socket : ' + this.socket);
      const result = await new Promise<boolean>((resolve, reject) => {
        this.socket.connect();
        setTimeout(() => {
          resolve(false);
        }, 1000);
      });
      if (result) {
        break;
      }
      if (tryCount > 3) {
        this.stateSubject.next('retry-connect-failed');
        return false;
      }
    }

    return true;
  }

  connect() {
    this.socket.connect();
  }

  disconnect(): SocketIOClient.Socket {
    this.stateSubject.next('disconnect');
    return this.socket.disconnect();
  }

  on<T>(event: string): Observable<{ data: T, callback?: (response?: any) => void }> {
    const osb = new Observable<ISocketResult<T>>(subscriber => {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(subscriber);
      this.eventRegister(event, subscriber);
    });
    return osb;
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

  public async callback<T>(seq: number, data: T) {
    this.socket.emit('callback', { seq, type: 'success', data });
  }

  async reset() {

  }

}

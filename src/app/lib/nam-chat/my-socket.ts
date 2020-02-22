import * as socketIo from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

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
  connected: boolean;
  disconnected: boolean;

  private seq = 0;

  emitCallbackSubject: BehaviorSubject<SocketData<any>> = new BehaviorSubject<SocketData<any>>(null);
  emitCallback$: Observable<SocketData<any>> = this.emitCallbackSubject.asObservable();

  constructor(uri: string, opts?: SocketIOClient.ConnectOpts) {
    this.socket = socketIo(uri, opts);
    this.socket.on('callback', (result: SocketData<any>) => {
      this.emitCallbackSubject.next(result);
    });
  }

  public async emit<T>(event: string, data: any): Promise<T> {
    const checkpointSeq = this.seq++;
    if (!this.socket.connected) {
      if (!(await this.retryConnect())) {
        throw Error('Socket ' + this.socket.id + ' was disconnected !!!');
      }
    }
    this.socket.emit(event, { seq: checkpointSeq, type: 'success', data });
    return new Promise<T>((resolve, reject) => {

      const subcription = this.emitCallback$.subscribe(result => {
        if (result) {
          if (result.seq === checkpointSeq) {
            if (result.type === 'success') {
              resolve(result.data);
            } else {
              reject(result.data);
            }
            subcription.unsubscribe();
          }
        }
      });

    });
  }

  async retryConnect(): Promise<boolean> {
    let tryCount = 0;
    while (!this.socket.connected) {
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
      if (tryCount > 10) {
        return false;
      }
    }

    return true;
  }

  disconnect(): SocketIOClient.Socket {
    return this.socket.disconnect();
  }

  // on<T>(event: string): Observable<T> {
  //   return new Observable<T>(observer => {
  //     this.socket.on(event, (data: T) => observer.next(data));
  //   });
  // }

  on<T>(event: string): Observable<{ data: T, callback?: (response?: any) => void }> {
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

  onConnect() {
    return this.on<any>('connect');
  }

  public async callback<T>(seq: number, data: T) {
    this.socket.emit('callback', { seq, type: 'success', data });
  }

}

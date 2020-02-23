import { MySocket, ISocketResult } from './my-socket';
import { User } from './model/user';
import { Observable, BehaviorSubject } from 'rxjs';
import { Message } from './model/message';
import { ChatManager } from './chat-manager';

export interface JWTToken {
  access_token?: string;
  refresh_token?: string;
}

export interface IChatRoomContext {

  getAuthenticateToken(): JWTToken;
  onChatRoomInit(): void;
  onChatRoomConnect(): void;
  onChatRoomReconnect(): void;
  onChatRoomHadNewMessage(newMessage: Message): void;

}

export class ChatRoom {

  messageList: Message[] = [];
  lastMessageIndex = 0;
  stateSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  state$: Observable<string> = this.stateSubject.asObservable();

  private takeUltilCount = {};
  private takeUltilPastCount = {};

  constructor(
    public id: string,
    public roomSocket: MySocket,
    public user: User,
    public chatManager: ChatManager,
    public context: IChatRoomContext,
  ) {
    this.state$.subscribe(state => console.info(`Chat room ${this.id} change state to "${state}"`));
    this.initNamespaceSocket();
    this.stateSubject.next('construct');

    this.roomSocket.state$.subscribe(state => {
      // if (state === 'retry-connect-failed') {
      //   console.info('Room socket retry connect failed');
      //   this.reInit();
      // }
      if (state === 'emit-timeout') {
        this.stateSubject.next('socket-timeout');
      }
    });
  }

  async initNamespaceSocket() {
    console.info('Init namespace socket : ' + this.id);
    // let result: any;
    this.chatManager.mainSocket.emit<string>('open-namespace', { namespace: this.id, option: { user: this.user } }).then(rs => {
      console.info('response of open-namespace');
      console.info(rs);
    }).catch(e => {
      console.info('open namespace error');
      console.error(e);
    });

    console.info('connect to namespace : ' + this.id);
    if (!this.roomSocket) {
      this.roomSocket = new MySocket(this.chatManager.socketServerUri + '/' + this.id, {
        reconnection: true,
        reconnectionAttempts: 100,
      });
      // this.roomSocket.state$.subscribe(state => {
      //   if (state === 'retry-connect-failed') {
      //     console.info('Room socket retry connect failed');
      //     this.reInit();
      //   }
      // });
    }


    // Apply namespace event
    this.roomSocket.onReconnect$.subscribe(att => {
      console.info(this.id + ' reconnected : ' + att);
      this.stateSubject.next('reconnected');

      this.reInit();

      console.info('Register for re-connect');
      this.register().catch(e => {
        console.info('Chat room reconnect when register failed on socket reconnect');
        this.roomSocket.connect();
      });
    });
    // this.roomSocket.socket.on('reconnect', async (att: number) => {
    // });
    // this.roomSocket.socket.on('reconnect_attempt', (att: number) => console.info(this.id + ' reconnect_attempt : ' + att));
    // this.roomSocket.socket.on('disconnect', (att: number) => {
    //   console.info(this.id + ' disconnect : ' + att);
    //   this.stateSubject.next('disconnect');
    // });
    // this.roomSocket.socket.on('reconnecting', (att: number) => console.info(this.id + ' reconnecting : ' + att));

    this.roomSocket.onConnect$.subscribe(state => {
      console.info('namespace connected - ' + this.id);
      this.stateSubject.next('connect');

      console.info('Register for connect');
      this.register().catch(e => {
        console.info('Chat room reconnect when register failed on socket connect');
        this.roomSocket.connect();
      });
    });
    // this.roomSocket.socket.on('connect', () => {
    // });
    // this.roomSocket.socket.on('message', (request: ISocketResult<Message>) => {
    //   this.context.onChatRoomHadNewMessage(request.data);
    // });
    this.roomSocket.on<Message>('message').subscribe(newMessage => {
      this.context.onChatRoomHadNewMessage(newMessage.data);
    });

    this.state$.subscribe(async (state) => {
      // Load last messages
      if (state === 'ready') {
        this.takeUntil('load-last-message', 500).then(async () => {
          console.info('load last messages...');
          const lastMessage = this.messageList[this.messageList.length - 1];
          const lastMessages = await this.roomSocket.emit<Message[]>('request-last-messages', lastMessage ? lastMessage.index : 0);

          if (lastMessages && lastMessages.length > 0) {
            lastMessages.forEach(newMessage => {
              this.messageList.push(newMessage);
              this.context.onChatRoomHadNewMessage(newMessage);
            });
          }
        });
      }
    });

    this.stateSubject.next('init');
  }

  reInit() {
    this.roomSocket.removeAllListeners();

    console.info('Init namespace socket : ' + this.id);
    // let result: any;
    this.chatManager.mainSocket.emit<string>('open-namespace', { namespace: this.id, option: { user: this.user } }).then(rs => {
      console.info('response of open-namespace');
      console.info(rs);
    }).catch(e => {
      console.info('open namespace error');
      console.error(e);
    });

    // this.initNamespaceSocket();
    this.roomSocket.initEvent();
  }

  register(timeout?: number): Promise<boolean> {
    timeout = timeout ? timeout : 3000;
    return new Promise<boolean>(async (resolve, reject) => {
      this.takeUntil('chat-room-socket-register', 500).then(async () => {
        console.info('socket register...');
        // if (!this.roomSocket.connected) {
        //   if (!await this.roomSocket.retryConnect()) {
        //     reject('Can not retry socket connect');
        //   }
        // }
        // } else {
        this.roomSocket.emit<boolean>('register', {user: this.user, token: this.context.getAuthenticateToken()}, timeout).then(rs2 => {
          console.info(`Registered user ${this.user.id} to chat room ${this.id} : ${rs2}`);
          this.stateSubject.next('ready');
          resolve(true);
        }).catch(e => {
          console.error('Register failed', e);
          reject(e);
        });
        // }
      });
    });
  }

  sendMessage(message: Message, user: User): Promise<Message> {
    return new Promise<Message>((resolve, reject) => {
      if (this.stateSubject.value === 'ready') {
        console.info('Send message ' + JSON.stringify(message));
        message.index = Date.now();
        resolve(this.roomSocket.emit<Message>('message', message));
      } else {
        this.register();
        console.info('socket was not ready !!!');
        reject('socket was not ready, retry againt !');
      }
    });
  }

  onMessage(): Observable<{ data: Message, callback?: (response: any) => void }> {
    return this.roomSocket.on<Message>('message');
    // return new Observable<Message>(obs => {
    //   this.socket.on<Message>('message').subscribe(request => {
    //     obs.next(request.data);
    //   });
    // });
  }


  takeUntil(context: string, delay: number): Promise<any> {
    return new Promise<any>(resolve => {
      if (delay === 0) {
        resolve();
        return;
      }
      if (!this.takeUltilCount[context]) { this.takeUltilCount[context] = 0; }
      this.takeUltilCount[context]++;
      ((takeCount) => {
        setTimeout(() => {
          this.takeUltilPastCount[context] = takeCount;
        }, delay);
      })(this.takeUltilCount[context]);
      setTimeout(() => {
        if (this.takeUltilPastCount[context] === this.takeUltilCount[context]) {
          resolve();
        }
      }, delay);
    });

  }

  connect() {
    this.roomSocket.connect();
  }

  disconnect() {
    this.roomSocket.disconnect();
  }
}

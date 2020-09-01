import { MySocket } from './my-socket';
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
  getLastMesssage(): Message;
  onChatRoomInit(): Promise<boolean>;
  onChatRoomConnect(): Promise<boolean>;
  onChatRoomReconnect(): Promise<boolean>;
  onNewMessage(newMessage: Message): Promise<boolean>;
  onRestoreMessages(namespace: string, messages: Message[]): Promise<boolean>;
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

  public async setContextAndSync(context: IChatRoomContext) {
    this.context = context;
    await this.syncToContext();
    return true;
  }

  public async syncToContext() {
    console.info('load last messages...');
    // const lastMessage = this.messageList[this.messageList.length - 1];
    // const lastMessages = await this.roomSocket.emit<Message[]>('request-last-messages', lastMessage ? lastMessage.index : 0);

    // if (lastMessages && lastMessages.length > 0) {
    //   for (let i = 0; i < lastMessages.length; i++) {
    //     this.messageList.push(lastMessages[i]);
    //   }
    // }
    // const contextLastMessage = this.context.getLastMesssage();
    // for (let i = 0; i < this.messageList.length; i++) {
    //   // if (!contextLastMessage || contextLastMessage.index < this.messageList[i].index) {
    //     this.context.onNewMessage(this.messageList[i], true);
    //   // }
    // }
    if (!this.messageList || this.messageList.length === 0) {
      this.messageList = await this.roomSocket.emit<Message[]>('request-last-messages', 0);
    }
    return this.context.onRestoreMessages(this.id, this.messageList);
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
      this.messageList.push(newMessage.data);
      this.context.onNewMessage(newMessage.data);
    });

    this.state$.subscribe(async (state) => {
      // Load last messages
      if (state === 'ready') {
        this.takeUntil('load-last-message', 500).then(async () => {
          console.info('load last messages...');
          const lastMessage = this.messageList[this.messageList.length - 1];
          const lastMessages = await this.roomSocket.emit<Message[]>('request-last-messages', lastMessage && lastMessage.index || 0);

          // if (lastMessages && lastMessages.length > 0) {
          //   lastMessages.forEach(newMessage => {
          //     this.messageList.push(newMessage);
          //     this.context.onNewMessage(newMessage, true);
          //   });
          // }
          this.messageList = lastMessages;
          this.context.onRestoreMessages(this.id, lastMessages);
        });
      }
    });

    this.stateSubject.next('init');
  }

  reInit() {
    // this.roomSocket.removeAllListeners();

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
    // this.roomSocket.initEvent();
  }

  register(timeout?: number): Promise<boolean> {
    timeout = timeout ? timeout : 1000;
    return new Promise<boolean>(async (resolve, reject) => {
      this.takeUntil('chat-room-socket-register', 500).then(async () => {
        console.info('socket register...');
        // if (!this.roomSocket.connected) {
        //   if (!await this.roomSocket.retryConnect()) {
        //     reject('Can not retry socket connect');
        //   }
        // }
        // } else {
        this.roomSocket.emit<boolean>('register', { user: this.user, token: this.context.getAuthenticateToken() }, timeout).then(rs2 => {
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
    return new Promise<Message>(async (resolve, reject) => {
      // const maxTry = 10;
      // let tryCount = 0;
      // while (tryCount++ < maxTry) {
      // if (this.stateSubject.value === 'ready') {
      console.info('Send message ' + JSON.stringify(message));
      message.index = Date.now();
      try {
        const result = await this.roomSocket.emit<Message>('message', message);
        this.messageList.push(result);
        console.log(result);
        resolve(result);
      } catch (e) {
        reject(e);
      }
      // break;
      // } else {
      //   // Check socket connect status: false => reconnect, true => register
      //   this.connect();
      //   console.info('socket was not ready => reconnect...');
      //   await new Promise(resolve2 => setTimeout(() => resolve2(), 1000));
      // }
      // }
      // reject('socket was not ready, retry againt !');
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

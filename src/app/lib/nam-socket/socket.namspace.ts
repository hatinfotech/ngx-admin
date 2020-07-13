import { MySocket } from './my-socket';
import { User } from './model/user';
import { Observable, BehaviorSubject } from 'rxjs';
import { Message } from './model/message';
import { SocketManager } from './socket.manager';

export interface JWTToken {
  access_token?: string;
  refresh_token?: string;
}

export interface ISocketNamespaceContext {

  getAuthenticateToken(): JWTToken;
  onChatRoomInit(): void;
  onChatRoomConnect(): void;
  onChatRoomReconnect(): void;
  onChatRoomHadNewMessage(newMessage: Message): void;

}

export class SocketNamespace {

  messageList: Message[] = [];
  lastMessageIndex = 0;
  stateSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  state$: Observable<string> = this.stateSubject.asObservable();

  private takeUltilCount = {};
  private takeUltilPastCount = {};
  public roomSocket: MySocket;

  registered = false;

  constructor(
    public id: string,
    // public roomSocket: MySocket,
    public user: User,
    public chatManager: SocketManager,
    public context: ISocketNamespaceContext,
    public option?: any,
  ) {
    if (!option) {
      this.option = {};
    }
    // this.state$.subscribe(state => {
    //   console.info(`Socket namespace ${this.id} change state to "${state}"`);
    // });
    // this.init();
    // this.stateSubject.next('construct');


  }

  static async getInstance(
    id: string,
    user: User,
    chatManager: SocketManager,
    context: ISocketNamespaceContext,
    option?: any,
  ) {

    const self = new SocketNamespace(id, user, chatManager, context, option);
    await self.init();

    return self;
  }

  async init() {
    console.info('Init namespace socket : ' + this.id);
    // let result: any;
    const rs = await this.chatManager.mainSocket.emit<string>('open-namespace', { namespace: this.id, option: { user: this.user, ...this.option } });
    console.info('response of open-namespace');
    console.info(rs);
    // .then(rs => {
    //   console.info('response of open-namespace');
    //   console.info(rs);
    // }).catch(e => {
    //   console.info('open namespace error');
    //   console.error(e);
    // });

    console.info('connect to namespace : ' + this.id);
    // if (!this.roomSocket) {
    this.roomSocket = new MySocket(this.chatManager.socketServerUri + '/' + this.id, {
      reconnection: true,
      reconnectionAttempts: 100,
    });
    // }

    // Apply namespace event
    this.roomSocket.onConnect$.subscribe(async state => {
      console.info('namespace connected - ' + this.id);
      this.stateSubject.next('connect');

      console.info('Register for connect');
      await this.register();
      // .catch(e => {
      //   console.info('Namespsace reconnect when register failed on socket connect');
      //   this.roomSocket.connect();
      // });
    });

    this.roomSocket.onReconnect$.subscribe(async att => {
      console.info(this.id + ' reconnected : ' + att);
      this.stateSubject.next('reconnected');

      await this.reInit();

      console.info('Register for re-connect');
      await this.register();
      // .catch(e => {
      //   console.info('Chat room reconnect when register failed on socket reconnect');
      //   this.roomSocket.connect();
      // });
    });

    this.roomSocket.on<Message>('message').subscribe(newMessage => {
      this.context.onChatRoomHadNewMessage(newMessage.data);
    });

    this.state$.subscribe(async (state) => {
      // Load last messages
      if (state === 'ready') {
        this.registered = true;
        // this.takeUntil('load-last-message', 500).then(async () => {
        //   console.info('load last messages...');
        //   const lastMessage = this.messageList[this.messageList.length - 1];
        //   const lastMessages = await this.roomSocket.emit<Message[]>('request-last-messages', lastMessage ? lastMessage.index : 0);

        //   if (lastMessages && lastMessages.length > 0) {
        //     lastMessages.forEach(newMessage => {
        //       this.messageList.push(newMessage);
        //       this.context.onChatRoomHadNewMessage(newMessage);
        //     });
        //   }
        // });
      }
    });

    this.stateSubject.next('init');
    this.roomSocket.state$.subscribe(state => {
      if (state === 'emit-timeout') {
        this.stateSubject.next('socket-timeout');
      }
    });

    return true;
  }

  async syncMessageList() {
    const lastMessage = this.messageList[this.messageList.length - 1];
    const lastMessages = await this.roomSocket.emit<Message[]>('request-last-messages', lastMessage ? lastMessage.index : 0);
    if (lastMessages && lastMessages.length > 0) {
      lastMessages.forEach(newMessage => {
        this.messageList.push(newMessage);
        this.context.onChatRoomHadNewMessage(newMessage);
      });
    }
  }

  clearMessageList() {
    this.messageList = [];
  }

  async reInit() {
    this.roomSocket.removeAllListeners();

    console.info('Init namespace socket : ' + this.id);
    // let result: any;
    const rs = await this.chatManager.mainSocket.emit<string>('open-namespace', { namespace: this.id, option: { user: this.user, ...this.option } });
    // .then(rs => {
    console.info('response of open-namespace');
    console.info(rs);
    // }).catch(e => {
    // console.info('open namespace error');
    // console.error(e);
    // });

    // this.initNamespaceSocket();
    this.roomSocket.initEvent();
  }

  register(timeout?: number): Promise<boolean> {
    timeout = timeout ? timeout : 60000;
    return new Promise<boolean>(async (resolve, reject) => {
      this.takeUntil('chat-room-socket-register', 500).then(async () => {
        // console.info('socket register...');
        // if (!this.roomSocket.connected) {
        //   if (!await this.roomSocket.retryConnect()) {
        //     reject('Can not retry socket connect');
        //   }
        // }
        // } else {
        console.log('Socket register...');
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
    console.log('Send message', message);
    return new Promise<Message>(async (resolve, reject) => {
      // if (this.stateSubject.value !== 'ready') {
      //   while (true) {
      //     try {
      //       if (await this.register()) break;
      //     } catch (e) {
      //       console.error(e);
      //     }
      //   }
      // }
      if (this.registered) {
        console.info('Send message ' + JSON.stringify(message));
        message.index = Date.now();
        resolve(this.roomSocket.emit<Message>('message', message));
      } else {
        // this.register();
        console.info(`socket was not ready !!! [state:${this.stateSubject.value}]`);
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

  setContext(context: ISocketNamespaceContext) {
    this.context = context;
  }
}

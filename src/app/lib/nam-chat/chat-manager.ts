import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { MySocket } from './my-socket';
import { ChatRoom, IChatRoomContext } from './chat-room';
import { User } from '../../@core/data/users';

export class ChatManager {

  // user: User;
  chatRoom: string;
  messages: Message[] = [];
  messageContent: string;
  // socketServerUri = 'http://localhost:8080';

  mainSocket: MySocket;
  chatRoomSocketList: { [key: string]: SocketIOClient.Socket } = {};
  currentChatRoomSocket: MySocket;

  chatRoomList: { [key: string]: ChatRoom } = {};

  constructor(
    public socketServerUri: string,
    public user: User,
  ) {
    this.initIoConnection();
  }

  private initIoConnection() {

    // Main socket
    this.mainSocket = new MySocket(this.socketServerUri);

    this.mainSocket.socket.on('reconnect_attempt', (att: number) => console.info('main socket - reconnect_attempt : ' + att));
    this.mainSocket.socket.on('reconnecting', (att: number) => console.info('main socket - reconnecting : ' + att));
    this.mainSocket.socket.on('reconnect', async (att: number) => {

      console.info('main socket - reconnect : ' + att);
      console.info('Re open namespace : ' + this.chatRoom);
      let result: any;
      try {
        result = await this.mainSocket.emit<string>('open-namespace', { namespace: this.chatRoom, option: { user: this.user } });
        console.info(result);
      } catch (e) {
        console.info('open namespace error');
        console.error(e);
      }

      console.info('reconnect to namespace : ' + this.chatRoom + ' success');
    });

    // return new Promise<any>((resolve, reject) => {
    //   this.mainSocket.onConnect().subscribe(rs => {
    //     resolve();
    //   });
    // });

    // this.initNamespaceSocket(this.chatRoom);
  }

  onConnect() {
    return new Promise<any>((resolve, reject) => {
      const sucription = this.mainSocket.onConnect().subscribe(rs => {
        resolve();
        sucription.unsubscribe();
      });
    });
  }

  async openChatRoom(context: IChatRoomContext, chatRoomId: string, user: User): Promise<ChatRoom> {
    if (!this.mainSocket.connected) {
      if (!await this.mainSocket.retryConnect()) {
        console.info('Client chat socket was not ready !!!');
      }
    }
    const chatRoom = this.chatRoomList[chatRoomId] = new ChatRoom(
      chatRoomId,
      new MySocket(this.socketServerUri + '/' + chatRoomId),
      user,
      this,
      context,
    );
    chatRoom.roomSocket.socket.on('connect', () => {
      console.info('Chat room ' + chatRoomId + ' connected');
    });

    return chatRoom;
  }

  async initNamespaceSocket(namespace: string) {
    console.info('Init namespace socket : ' + namespace);
    let result: any;
    try {
      result = await this.mainSocket.emit<string>('open-namespace', { namespace: this.chatRoom, option: { user: this.user } });
      console.info(result);
    } catch (e) {
      console.info('open namespace error');
      console.error(e);
    }
    console.info('connect to namespace : ' + this.chatRoom);
    this.currentChatRoomSocket = new MySocket(this.socketServerUri + '/' + this.chatRoom, {
      reconnection: true,
      reconnectionAttempts: 100,
    });


    // Apply namespace event
    this.currentChatRoomSocket.socket.on('reconnect', async (att: number) => {
      console.info(this.chatRoom + ' reconnected : ' + att);
    });
    this.currentChatRoomSocket.socket.on('reconnect_attempt', (att: number) => console.info(this.chatRoom + ' reconnect_attempt : ' + att));
    this.currentChatRoomSocket.socket.on('reconnecting', (att: number) => console.info(this.chatRoom + ' reconnecting : ' + att));

    this.currentChatRoomSocket.on<any>('connect').subscribe(rs => {
      console.info('namespace connected - ' + this.chatRoom);
      console.info(rs);
    });
    this.currentChatRoomSocket.on<Message>('message').subscribe(request => {
      this.messages.push(request.data);
    });

    // Load last messages
    console.info('load last messages...');
    const lastMessages = await this.currentChatRoomSocket.emit<Message[]>('request-last-messages', 0);
    if (lastMessages) {
      lastMessages.forEach(msg => {
        this.messages.push(msg);
      });
    }
  }

  private getRandomId(): number {
    return Math.floor(Math.random() * (1000000)) + 1;
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.currentChatRoomSocket.emit('message', {
      chatRoom: this.chatRoom,
      from: this.user,
      content: message,
    }).then(result => console.info(result)).catch(error => console.error(error));

    this.messageContent = null;
  }
}

import { MySocket, ISocketResult } from './my-socket';
import { Observable } from 'rxjs';
import { ChatManager } from './chat-manager';
import { User } from '../../@core/data/users';
import { ChatMessageModel } from '../../models/chat-message.model';

export interface IChatRoomContext {

  onChatRoomInit(): void;
  onChatRoomConnect(): void;
  onChatRoomReconnect(): void;
  onChatRoomHadNewMessage(newMessage: ChatMessageModel): void;

}

export class ChatRoom {

  messageList: ChatMessageModel[] = [];
  lastMessageIndex = 0;

  constructor(
    public id: string,
    public roomSocket: MySocket,
    public user: User,
    public chatClient: ChatManager,
    public context: IChatRoomContext,
  ) {
    this.initNamespaceSocket();
  }

  async initNamespaceSocket() {
    console.info('Init namespace socket : ' + this.id);
    let result: any;
    try {
      result = await this.chatClient.mainSocket.emit<string>('open-namespace', { namespace: this.id, option: { user: this.user } });
      console.info(result);
    } catch (e) {
      console.info('open namespace error');
      console.error(e);
    }
    console.info('connect to namespace : ' + this.id);
    if (!this.roomSocket) {
      this.roomSocket = new MySocket(this.chatClient.socketServerUri + '/' + this.id, {
        reconnection: true,
        reconnectionAttempts: 100,
      });
    }


    // Apply namespace event
    this.roomSocket.socket.on('reconnect', async (att: number) => {
      console.info(this.id + ' reconnected : ' + att);

      this.roomSocket.socket.removeAllListeners();
      this.initNamespaceSocket();

    });
    this.roomSocket.socket.on('reconnect_attempt', (att: number) => console.info(this.id + ' reconnect_attempt : ' + att));
    this.roomSocket.socket.on('reconnecting', (att: number) => console.info(this.id + ' reconnecting : ' + att));

    this.roomSocket.on<any>('connect').subscribe((rs: any) => {
      console.info('namespace connected - ' + this.id);
      // console.info(rs);
    });
    this.roomSocket.socket.on('message', (request: ISocketResult<ChatMessageModel>) => {
      this.context.onChatRoomHadNewMessage(request.data);
    });

    // Load last messages
    console.info('load last messages...');
    const lastMessage = this.messageList[this.messageList.length - 1];
    const lastMessages = await this.roomSocket.emit<ChatMessageModel[]>('request-last-messages', lastMessage ? lastMessage.index : 0);
    if (lastMessages && lastMessages.length > 0) {

      lastMessages.forEach(newMessage => {
        this.messageList.push(newMessage);
        this.context.onChatRoomHadNewMessage(newMessage);
      });

    }

  }

  sendMessage(message: ChatMessageModel, user: User): Promise<ChatMessageModel> {
    message.index = Date.now();
    return this.roomSocket.emit<ChatMessageModel>('message', message);
  }

  onMessage(): Observable<{ data: ChatMessageModel, callback?: (response: any) => void }> {
    return this.roomSocket.on<ChatMessageModel>('message');
    // return new Observable<Message>(obs => {
    //   this.socket.on<Message>('message').subscribe(request => {
    //     obs.next(request.data);
    //   });
    // });
  }

}

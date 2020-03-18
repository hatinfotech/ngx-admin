import { SocketNamespace, ISocketNamespaceContext } from '../../../lib/nam-socket/socket.namspace';
import { Message } from '../../../lib/nam-socket/model/message';
import { User } from '../../../lib/nam-socket/model/user';
import { WpSyncSocketManager } from './wp-sync-socket.manager';

export class WpSyncMessage extends Message {
  command?: string;
  data?: any;
  percent?: number;
  part?: string;
  namespace?: string;
}

export class WpSyncSocketNamespace extends SocketNamespace {

  static async getInstance(
    id: string,
    user: User,
    chatManager: WpSyncSocketManager,
    context: ISocketNamespaceContext,
    option?: any,
  ) {

    const self = new WpSyncSocketNamespace(id, user, chatManager, context, option);
    await self.init();

    return self;
  }

  sendMessage(message: WpSyncMessage, user: User): Promise<WpSyncMessage> {
    return super.sendMessage(message, user);
  }

}

import { SocketManager } from '../../../lib/nam-socket/socket.manager';
import { ISocketNamespaceContext } from '../../../lib/nam-socket/socket.namspace';
import { WpSyncSocketNamespace } from './wp-sync-socket.namespace';
import { User } from '../../../lib/nam-socket/model/user';
import { CommonService } from '../../../services/common.service';

export class WpSyncSocketManager extends SocketManager {

  static socketNamespaceList: WpSyncSocketNamespace[] = [];

  constructor(
    public commonService: CommonService,
    public user?: User,
    public socketServerUri?: string,
  ) {
    super(commonService, user, socketServerUri);
    if (!socketServerUri) {
      this.socketServerUri = this.commonService.mainSocketInfo$.getValue().url;
    }
  }

  async openNamesapce(context: ISocketNamespaceContext, namespace: string, user: User, option?: any): Promise<WpSyncSocketNamespace> {

    const existSocketNamespace = WpSyncSocketManager.socketNamespaceList.filter(s => s.id === namespace)[0];
    if (existSocketNamespace) {

      // Re-assign context
      existSocketNamespace.setContext(context);

      existSocketNamespace.sendMessage({
        namespace: namespace,
        index: Date.now(),
        content: 'Update sync process info',
        command: 'update',
        data: option,
      }, user);

      return existSocketNamespace;

    }

    return new Promise<WpSyncSocketNamespace>( async (resolve, reject) => {
      if (!this.mainSocket.connected) {
        throw Error('Main socket was not connected !!!');
        // this.mainSocket.connect();
        //   console.info('Client chat socket was not ready !!!');
        // }
      }
      const socketNamespace = this.chatRoomList[namespace] = await WpSyncSocketNamespace.getInstance(
        namespace,
        // new MySocket(this.socketServerUri + '/' + namespace),
        user,
        this,
        context,
        option,
      );

      // Cache socket namespace
      WpSyncSocketManager.socketNamespaceList.push(socketNamespace);

      let connected = false;
      socketNamespace.roomSocket.socket.on('connect', () => {
        console.info('Namespace ' + namespace + ' is now connected');
        connected = true;
      });

      const subscription = socketNamespace.state$.subscribe(state => {
        if (state === 'ready') {
          resolve(socketNamespace);
          subscription.unsubscribe();
        }
      });

      setTimeout(() => {
        if (!connected) {
          reject('Socket namespace connect timeout');
        }
      }, 30000);

    });

  }
}

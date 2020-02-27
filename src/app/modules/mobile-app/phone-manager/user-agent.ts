import { User } from './user';
import { PhoneManager } from './phone-manager';
import * as SIP from 'sip.js';
import { CallingSession } from './calling-session';
import { BehaviorSubject, Subject } from 'rxjs';

export class UserAgent {

  // private stateChangedSubject = new BehaviorSubject<{ state: string, session?: CallingSession }>({state: 'normal'});
  // stateChanged$ = this.stateChangedSubject.asObservable();
  stateChanged$ = new Subject<{ state: string, session?: CallingSession }>();
  activated: boolean;

  constructor(
    public user: User,
    public manager?: PhoneManager,
    public agent?: SIP.UA,
  ) { }

  register(): boolean {

    if (!this.agent) {
      const config: any = {
        uri: this.user.uri,
        register: true,
        transportOptions: {
          wsServers: [this.user.serviceUrl],
          maxReconnectionAttempts: 1000,
          keepAliveInterval: 30,
        },
        authorizationUser: this.user.phone,
        password: this.user.password,
        wsServerMaxReconnection: 86400,
        connectionRecoveryMaxInterval: 10,
      };
      this.agent = new SIP.UA(config);
      this.applyEvents();
    } else {
      this.agent.register();
    }

    return true;

  }

  private applyEvents() {
    const $this = this;
    this.agent.on('invite', async (callReceiveSession) => {

      const caller = new User(
        callReceiveSession.remoteIdentity.uri.user,
        callReceiveSession.remoteIdentity.displayName,
        callReceiveSession.remoteIdentity.uri.user,
      );
      const callingSession = new CallingSession(this.manager, caller, this.user, callReceiveSession);
      this.stateChanged$.next({ state: 'invited', session: callingSession });
    });

  }

  unregister(): boolean {
    this.agent.unregister();
    return true;
  }

}

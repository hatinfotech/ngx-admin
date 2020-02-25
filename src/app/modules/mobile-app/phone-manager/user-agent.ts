import { User } from './user';
import { PhoneManager } from './phone-manager';
import * as SIP from 'sip.js';
import { CallingSession } from './calling-session';
import { BehaviorSubject } from 'rxjs';

export class UserAgent {

  private stateChangedSubject = new BehaviorSubject<{ state: string, session?: CallingSession }>({state: 'normal'});
  stateChanged$ = this.stateChangedSubject.asObservable();
  activated: boolean;

  constructor(
    public user: User,
    public manager?: PhoneManager,
    public agent?: SIP.UA,
  ) { }

  register(): boolean {

    if (!this.agent) {
      this.agent = new SIP.UA({
        uri: this.user.uri,
        register: true,
        transportOptions: {
          wsServers: [this.user.serviceUrl],
        },
        authorizationUser: this.user.phone,
        password: this.user.password,
      });
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
      this.stateChangedSubject.next({ state: 'invited', session: callingSession });


      // const callSession = new CallingSession(
      //   {
      //     id: self.inviteServerContext.remoteIdentity.uri.user,
      //     name: self.inviteServerContext.remoteIdentity.displayName,
      //     number: self.inviteServerContext.remoteIdentity.uri.user,
      //     uri: self.inviteServerContext.remoteIdentity.uri.user,
      //   },
      //   {
      //     id: this.sipUsername,
      //     name: this.sipUsername,
      //     number: '101',
      //     uri: this.sipUsername,
      //   },
      //   callReceiveSession,
      // );

      // this.callingSessionList.push(callSession);


      // self.inviteServerContext = callReceiveSession;
      // callkit.receiveCall("David Marcus");
      // if (self.state === 'normal') {
      //   self.state = 'incomming';
      //   this.partnerName = self.inviteServerContext.remoteIdentity.displayName;
      //   this.partnerNumber = self.inviteServerContext.remoteIdentity.uri.user;
      //   this.ring();
      //   this.mobileAppService.hadIncommingCall({ state: self.state, partnerName: this.partnerName, partnerNumber: this.partnerNumber });
      //   self.receiveCallEventConfig(this.inviteServerContext);
      //   // console.info('!!! accept call manula by call fucntion : acceptcall()');
      //   // session.accept();
      // } else {
      //   this.partnerName = self.inviteServerContext.remoteIdentity.displayName;
      //   this.partnerNumber = self.inviteServerContext.remoteIdentity.uri.user;
      //   this.mobileAppService.hadIncommingCall({ state: 'waiting-incomming', partnerName: this.partnerName, partnerNumber: this.partnerNumber });
      //   while (await new Promise<boolean>(resolve => {
      //     console.info('waiting for phone state update to normal...');
      //     setTimeout(() => {
      //       if (self.state !== 'normal') {
      //         resolve(true);
      //       } else {
      //         resolve(false);
      //       }
      //     }, 1000);
      //   })) { }
      //   self.inviteServerContext = callReceiveSession;
      //   self.state = 'incomming';
      //   // self.inviteServerContext.accept();
      //   this.partnerName = self.inviteServerContext.remoteIdentity.displayName;
      //   this.partnerNumber = self.inviteServerContext.remoteIdentity.uri.user;
      //   this.ring();
      //   self.receiveCallEventConfig(self.inviteServerContext);

      // }
    });
  }

  unregister(): boolean {
    this.agent.unregister();
    return true;
  }

}

import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../chat.service';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { ChatManager } from '../../../lib/nam-chat/chat-manager';
import { IChatRoomContext, ChatRoom } from '../../../lib/nam-chat/chat-room';
import { View } from 'framework7/components/view/view';
import Framework7 from 'framework7/framework7.esm.bundle';
import { Messages } from 'framework7/components/messages/messages';
import { Router as F7Router } from 'framework7/modules/router/router';
import { MessagesPage, AboutPage } from './f7pages';
import { Observable, BehaviorSubject } from 'rxjs';
import { Message } from '../../../lib/nam-chat/model/message';
import { User } from '../../../lib/nam-chat/model/user';
import { BaseComponent } from '../../../lib/base-component';
import { Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { MobileAppService } from '../mobile-app.service';
import { NbThemeService } from '@nebular/theme';
import { takeUntil, map } from 'rxjs/operators';


export interface F7Message {
  format?: string[];
  avatar?: string;
  name?: string;
  header?: string;
  headerContent?: string;
  photo?: string;
  content?: string;
  footerContent?: string;
  footer?: string;
}

@Component({
  selector: 'ngx-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent extends BaseComponent implements OnInit, AfterViewInit {

  componentName = 'ChatRoomComponent';

  chatServiceInfo: {
    domain: string,
    port: number,
    url?: string,
  };

  user: User;
  localChatClient: ChatManager;
  currentChatRoom: ChatRoom;
  chatRoomId: string;
  f7app: Framework7 & { router?: F7Router.Router };
  messagebar: any;
  messages: Messages.Messages;

  messageBarText: string = 'test';

  messageList: Messages.Message[] = [
    {
      type: 'sent',
      avatar: 'https://cdn.framework7.io/placeholder/people-100x100-7.jpg',
      name: 'John Doe',
      header: 'Message header',
      textHeader: 'Text header',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      textFooter: 'Text footer',
      footer: 'Message footer',
      isTitle: false,
      image: '',
      imageSrc: '',
    },
    {
      type: 'received',
      avatar: 'https://cdn.framework7.io/placeholder/people-100x100-7.jpg',
      name: 'John Doe',
      header: 'header',
      textHeader: 'Message header',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      textFooter: 'Text footer',
      footer: 'Message footer',
      isTitle: false,
      image: '',
      imageSrc: '',
    },
    {
      type: 'sent',
      name: '',
      avatar: '',
      header: '',
      textHeader: '',
      text: 'Hi, Kate',
      textFooter: '',
      footer: '',
      isTitle: false,
      image: '',
      imageSrc: '',
    },
    {
      type: 'sent',
      name: '',
      avatar: '',
      header: '',
      textHeader: '',
      text: 'How are you?',
      textFooter: '',
      footer: '',
      isTitle: false,
      image: '',
      imageSrc: '',
    },
    {
      avatar: 'https://cdn.framework7.io/placeholder/people-100x100-9.jpg',
      name: 'Kate',
      text: 'Hi, I am good!',
      type: 'sent',
      header: '',
      textHeader: '',
      textFooter: '',
      footer: '',
      isTitle: false,
      image: '',
      imageSrc: '',
    },
    {
      type: 'received',
      avatar: 'https://cdn.framework7.io/placeholder/people-100x100-7.jpg',
      name: 'Blue Ninja',
      text: 'Hi there, I am also fine, thanks! And how are you?',
      textHeader: '',
      textFooter: '',
      header: '',
      footer: '',
      isTitle: false,
      image: '',
      imageSrc: '',
    },
    {
      text: 'Hey, Blue Ninja! Glad to see you ;)',
      type: 'sent',
      avatar: '',
      name: '',
      textHeader: '',
      textFooter: '',
      header: '',
      footer: '',
      isTitle: false,
      image: '',
      imageSrc: '',
    },
    {

      avatar: '',
      name: '',
      textHeader: '',
      textFooter: '',
      header: '',
      footer: '',
      isTitle: false,
      image: '',
      imageSrc: '',
      text: 'Hey, look, cutest kitten ever!',
    },
    {
      type: 'sent',
      avatar: '',
      name: '',
      textHeader: '',
      textFooter: '',
      header: '',
      footer: '',
      isTitle: false,
      image: '',
      text: '',
      imageSrc: 'https://cdn.framework7.io/placeholder/cats-200x260-4.jpg',
    },
    {
      type: 'received',
      avatar: 'https://cdn.framework7.io/placeholder/people-100x100-9.jpg',
      name: 'Kate',
      text: 'Like it very much!',
      textHeader: '',
      textFooter: '',
      header: '',
      footer: '',
      isTitle: false,
      image: '',
      imageSrc: '',
    },
    {
      type: 'received',
      avatar: 'https://cdn.framework7.io/placeholder/people-100x100-7.jpg',
      name: 'Blue Ninja',
      text: 'Awesome!',
      textHeader: '',
      textFooter: '',
      header: '',
      footer: '',
      isTitle: false,
      image: '',
      imageSrc: '',
    },
  ];

  // @ViewChild('page', { static: true }) pageRef: ElementRef;
  mainView: View.View;

  isDarkTheme = false;

  readySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  ready$: Observable<boolean> = this.readySubject.asObservable();

  // app: Framework7;
  constructor(
    private chatService: ChatService,
    private mobileAppService: MobileAppService,
    // private apiService: ApiService,
    // private commonService: CommonService,
    protected commonService: CommonService,
    protected router: Router,
    protected apiService: ApiService,
    private authService: NbAuthService,
    public themeService: NbThemeService,
  ) {

    super(commonService, router, apiService);
    this.mobileAppService.registerMobileApp(this);

    // this.apiService.get<{ domain: string, port: number }>('/chat/services/connect-info', {}, rs => {
    //   this.chatServiceInfo = rs;
    //   this.chatServiceInfo.url = `http://${rs.domain}:${rs.port}`;
    //   console.info(rs);
    // });

  }

  async ngOnInit() {

    this.subcriptions.push(this.commonService.authenticated$.subscribe(loginInfo => {
      if (loginInfo) {
        this.chatRoomId = 'test';
        this.user = {
          id: loginInfo.user.Code,
          name: loginInfo.user.Name,
          avatar: 'https://cdn.framework7.io/placeholder/people-100x100-7.jpg',
        };

        // this.ready$ = new Observable<boolean>((obs) => {
        this.apiService.getPromise<{ domain: string, port: number }>('/chat/services/connect-info', {}).then(rs => {
          this.chatServiceInfo = rs;
          this.chatServiceInfo.url = `https://${this.chatServiceInfo.domain}:${this.chatServiceInfo.port}`;
          this.localChatClient = new ChatManager(this.chatServiceInfo.url, this.user);
          this.localChatClient.onConnect().then(() => {
            this.readySubject.next(true);
          }).catch(e => console.error(e));
          console.info('Conntect to local chat server success');
        }).catch(e => console.error(e));
      }

    }));

    // Auto update mobile theme
    this.themeService.onThemeChange()
      .pipe(map(({ name }) => name === 'cosmic' || name === 'dark'), takeUntil(this.destroy$))
      .subscribe(isDark => {
          this.isDarkTheme = isDark;
      });

  }

  ngAfterViewInit(): void {

    // const messsagesPage = F7Page.messages;

    this.ready$.subscribe(isReady => {
      if (isReady) {
        const routes: any[] = [
          new MessagesPage(this, this.commonService, this.authService).f7Component,
          new AboutPage(this, this.commonService, this.authService).f7Component,
        ];

        // Init Framework7 app
        this.f7app = new Framework7({
          // App root element
          root: '#mobile-app',
          // App Name
          name: 'My App',
          theme: 'ios',
          // App id
          id: 'com.myapp.test',
          // Enable swipe panel
          panel: {
            // swipe: 'left',
          },
          // Add default routes
          routes: routes,
          // ... other parameters˛
        });

        this.mainView = this.f7app.views.create('.view-main');
        this.f7app.$('.navbars.navbar-hidden').removeClass('navbar-hidden');

        const chatRoomGuiConfig: Messages.Parameters = {

          // First message rule
          firstMessageRule: function (message, previousMessage, nextMessage) {
            // Skip if title
            if (message.isTitle) return false;
            /* if:
              - there is no previous message
              - or previous message type (send/received) is different
              - or previous message sender name is different
            */
            if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) return true;
            return false;
          },
          // Last message rule
          lastMessageRule: function (message, previousMessage, nextMessage) {
            // Skip if title
            if (message.isTitle) return false;
            /* if:
              - there is no next message
              - or next message type (send/received) is different
              - or next message sender name is different
            */
            if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
            return false;
          },
          // Last message rule
          tailMessageRule: function (message, previousMessage, nextMessage) {
            // Skip if title
            if (message.isTitle) return false;
            /* if (bascially same as lastMessageRule):
            - there is no next message
            - or next message type (send/received) is different
            - or next message sender name is different
          */
            if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
            return false;
          },
        };
        chatRoomGuiConfig['el'] = '.messages';

        // this.messages = this.f7app.messages.create(chatRoomGuiConfig);

        // console.info(this.chatRoom);

        // Init Messagebar
        // this.messagebar = this.f7app.messagebar.create({
        //   el: '.messagebar',
        // });


        // this.messageList.forEach(message => {
        //   this.messages.addMessage(message, 'append');
        // });
        // console.info(this.messagebar);

      }
    });


  }

  openChatRoom(id: string) {
    this.mainView.router.navigate(`/chat-room/${id}`);
  }

  sendMessage(event: any) {

    // this.messageBarText = text;
    // if (text.length > 0) {
    //   const newMessage: F7Message = {
    //     format: ['message-sent', 'message-first', 'message-last', 'message-tail'],
    //     avatar: 'https://cdn.framework7.io/placeholder/people-100x100-7.jpg',
    //     name: 'Hat',
    //     header: 'Message header',
    //     headerContent: 'Text header',
    //     content: text,
    //     footerContent: 'Text footer',
    //     footer: 'Message footer',
    //   };
    //   this.messageList.push(newMessage);
    //   this.messageBarText = '';
    // }

    // this.scrollToBottom();

    // return false;


    const text = this.messagebar.getValue().replace(/\n/g, '<br>').trim();
    // return if empty message
    if (!text.length) return;

    // Clear area
    this.messagebar.clear();

    // Return focus to area
    this.messagebar.focus();

    // Add message to messages
    // let type = 'sent';
    this.messages.addMessage({
      type: 'sent',
      text: text,
      header: null,
      footer: 'just sent now',
      name: 'Triet',
      avatar: 'https://cdn.framework7.io/placeholder/people-100x100-7.jpg',
      textHeader: null,
      textFooter: null,
      image: '',
      imageSrc: '',
      isTitle: false,
    }, 'append');


  }

  scrollToBottom() {
    // const nativeRef = this.pageRef.nativeElement;
    // nativeRef.scrollTop = nativeRef.scrollHeight;
  }

  onChatRoomInit(): void {
    throw new Error('Method not implemented.');
  }
  onChatRoomConnect(): void {
    throw new Error('Method not implemented.');
  }
  onChatRoomReconnect(): void {
    throw new Error('Method not implemented.');
  }
  onChatRoomHadNewMessage(newMessage: Message): void {
    throw new Error('Method not implemented.');
  }

}

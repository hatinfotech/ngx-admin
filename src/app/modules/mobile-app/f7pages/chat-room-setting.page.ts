import { ChatRoom, IChatRoomContext, JWTToken } from '../../../lib/nam-chat/chat-room';
import { User } from '../../../@core/data/users';
import { Messages } from 'framework7/components/messages/messages';
// import { Messagebar } from 'framework7/components/messagebar/messagebar';
import { Message, MessageAttachment } from '../../../lib/nam-chat/model/message';
import { CommonService } from '../../../services/common.service';
import { NbAuthService, NbAuthOAuth2Token } from '@nebular/auth';
import { Component } from 'framework7';
import { MobileAppComponent } from '../mobile-app.component';
import { EventEmitter } from '@angular/core';
import { ApiService } from '../../../services/api.service';

export class ChatRoomSettingPage {

  currentChatRoom: ChatRoom;
  chatRoomId: string;
  user: User;
  f7Messages: Messages.Messages;
  instances: { [key: string]: Component } = {};
  token: JWTToken;
  onOpenChatRoom$ = new EventEmitter<Component & { sendMessage?: (message: any) => void }>();

  private chatRoomCacheList: { [key: string]: ChatRoom } = {};

  constructor(
    public parentCompoent: MobileAppComponent,
    private commonService: CommonService,
    private authService: NbAuthService,
    public apiService: ApiService,
  ) {
    // this.chatRoomId = 'test';
    // this.user = {
    //   id: Math.floor(Math.random() * (1000000)) + 1,
    //   name: 'user ' + Date.now(),
    //   picture: 'https://cdn.framework7.io/placeholder/people-100x100-7.jpg',
    // };
    this.init();
  }

  async init() {

    // this.authService.onTokenChange()
    //   .subscribe((token: NbAuthOAuth2Token) => {
    //     if (token.isValid()) {
    //       this.token = JSON.parse(token.toString());
    //     } else {
    //       console.info('token no valid');
    //     }
    //   });

    // this.authService.getToken().subscribe((token: NbAuthOAuth2Token) => {
    //   if (token.isValid()) {
    //     this.token = JSON.parse(token.toString());
    //   } else {
    //     console.info('token no valid');
    //   }
    // });

  }

  onF7pageRemove(chatRoomId: string) {
    // if (this.chatRoomCacheList[chatRoomId]) {
    //   this.chatRoomCacheList[chatRoomId].disconnect();
    // }
  }

  onChatRoomInit(): void {

  }

  getAuthenticateToken(): JWTToken {
    return this.token;
  }

  onChatRoomConnect(): void {

  }
  onChatRoomReconnect(): void {

  }

  createThumbnailWrap(attachments: MessageAttachment[]) {
    let images = '';
    let totalImage = 0;
    if (attachments) {
      totalImage = attachments.length;
      for (let i = 0; i < totalImage; i++) {
        const attachment = attachments[i];
        images += `<div class="message-bubble-img-wrap" style="background-image: url('${attachment.payload.thumbnail + '?token=' + this.apiService.getAccessToken()}'); ${totalImage % 2 !== 0 && i === 0 ? 'width: 100%; height: 100px' : ''}"></div>`;
      }
    }
    return images;
  }

  get f7Component() {
    const $this = this;
    return {
      name: 'chat-room-setting',
      path: '/chat-room-setting/:id',
      // Component Object
      component: {
        template: `<div class="page">
        <div class="navbar">
          <div class="navbar-bg"></div>
          <div class="navbar-inner sliding">
            <div class="left">
              <a href="#" class="link back">
                <i class="icon icon-back"></i>
                <span class="if-not-md">Back</span>
              </a>
            </div>
            <div class="title">List View</div>
            <div class="right">
              <a href="#" class="link" @click="openChooseContact">
                <i class="icon f7-icons if-not-md">menu</i>
                <i class="icon material-icons md-only">menu</i>
              </a>
            </div>
          </div>
        </div>
        <div class="page-content">
          <div class="block-title">Swipe with confirm modal</div>
          <div class="list">
            <ul>
              <li class="swipeout">
                <div class="item-content swipeout-content">
                  <div class="item-media">
                    <i class="f7-icons">doc_person_fill</i>
                  </div>
                  <div class="item-inner">
                    <div class="item-title">Swipe me please</div>
                  </div>
                </div>
                <div class="swipeout-actions-right">
                  <a href="#" data-confirm="Are you sure you want this item" class="swipeout-delete">Delete</a>
                </div>
              </li>
              <li class="swipeout">
                <div class="item-content swipeout-content">
                  <div class="item-media">
                    <i class="f7-icons">doc_person_fill</i>
                  </div>
                  <div class="item-inner">
                    <div class="item-title">Swipe me too</div>
                  </div>
                </div>
                <div class="swipeout-actions-right">
                  <a href="#" data-confirm="Are you sure you want this item" class="swipeout-delete">Delete</a>
                </div>
              </li>
              <li>
                <div class="item-content">
                  <div class="item-media">
                  <i class="f7-icons">doc_person_fill</i>
                  </div>
                  <div class="item-inner">
                    <div class="item-title">I am removable</div>
                  </div>
                </div>
              </li>
              <li @click="openChooseContact">
                <div class="item-content">
                  <div class="item-media">
                    <i class="f7-icons">folder_fill_badge_plus</i>
                  </div>
                  <div class="item-inner">
                    <div class="item-title">Thêm thành viên</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>`,
        style: `
          .red-link {
            color: red;
          }
          .framework7 .ios .message-bubble .message-bubble-img-wrap {
            width: 50%;
            height: 73px;
            background-repeat: no-repeat;
            background-size: cover;
            float: left;
          }
          .framework7 .ios .message-bubble {
            min-width: 200px;
          }
          .framework7 .messages-title, .framework7 .message {
              margin-top: 17px;
          }
        `,
        data: function () {
          return {
            images: [
              'https://cdn.framework7.io/placeholder/cats-300x300-1.jpg',
              'https://cdn.framework7.io/placeholder/cats-200x300-2.jpg',
              'https://cdn.framework7.io/placeholder/cats-400x300-3.jpg',
              'https://cdn.framework7.io/placeholder/cats-300x150-4.jpg',
              'https://cdn.framework7.io/placeholder/cats-150x300-5.jpg',
              'https://cdn.framework7.io/placeholder/cats-300x300-6.jpg',
              'https://cdn.framework7.io/placeholder/cats-300x300-7.jpg',
              'https://cdn.framework7.io/placeholder/cats-200x300-8.jpg',
              'https://cdn.framework7.io/placeholder/cats-400x300-9.jpg',
              'https://cdn.framework7.io/placeholder/cats-300x150-10.jpg',
            ],
            people: [
              {
                name: 'Kate Johnson',
                avatar: 'https://cdn.framework7.io/placeholder/people-100x100-9.jpg',
              },
              {
                name: 'Blue Ninja',
                avatar: 'https://cdn.framework7.io/placeholder/people-100x100-7.jpg',
              },
            ],
            answers: [
              'Yes!',
              'No',
              'Hm...',
              'I am not sure',
              'And what about you?',
              'May be ;)',
              'Lorem ipsum dolor sit amet, consectetur',
              'What?',
              'Are you sure?',
              'Of course',
              'Need to think about it',
              'Amazing!!!',
            ],
            responseInProgress: false,
          };
        },
        methods: {
          openChooseContact: () => {
            const self = this;
            this.parentCompoent.mainView.router.navigate('/contacts', {
              context: {
                onChooseContact: (contact: any[]) => {
                  console.log(contact);
                },
              },
            });
          },
        },
        on: {
          pageBeforeRemove: function (e: any, page: any) {
            const self: Component & { messagebar: any } = this;
            if (self.messagebar) self.messagebar.destroy();
            $this.onF7pageRemove(self.$route.params['id']);
          },
          pageInit: function (e: any, page: any) {
            const self = this;
            const app = self.$app;

            $this.instances[self.$route.params['id']] = self;
            try {
              // $this.initChatRoom(self.$route.params['id']).then(rs => {
              //   if (rs) {
              //     $this.onOpenChatRoom$.emit(self);
              //   }
              // });
            } catch (e) { }

            // Listen new messages
          },
        },
      },
    };
  }
}

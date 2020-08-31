import { ChatRoom, IChatRoomContext, JWTToken } from '../../../lib/nam-chat/chat-room';
import { User } from '../../../@core/data/users';
import { Messages } from 'framework7/components/messages/messages';
import { Message, MessageAttachment } from '../../../lib/nam-chat/model/message';
import { CommonService } from '../../../services/common.service';
import { NbAuthService, NbAuthOAuth2Token } from '@nebular/auth';
import { Component, Component as F7Component } from 'framework7';
import { MobileAppComponent } from '../mobile-app.component';
import { EventEmitter } from '@angular/core';
import { FileModel } from '../../../models/file.model';
import { ApiService } from '../../../services/api.service';
import { NbGlobalPhysicalPosition, NbToastRef } from '@nebular/theme';
import { Messagebar } from 'framework7/components/messagebar/messagebar';

export class GuiMessage {
  type?: 'sent' | 'received';
  avatar?: string;
  name?: string;
  header?: string;
  textHeader?: string;
  text?: string;
  textFooter?: string;
  footer?: string;
  isTitle?: boolean;
  image?: string;
  imageSrc?: string;
}

export interface State {
  component?: Component & {messagebar?: Messagebar.Messagebar, checkAttachments?: () => void};
  id?: string;
  socket?: ChatRoom;
  lastMessage?: Message;
  f7Message?: Messages.Messages;
  scrollPosition?: number;
  messageBar?: {
    text?: string,
    attachments?: string[],
    selectedAttachments?: any[],
  };
}

export class MessagesPage implements IChatRoomContext {

  currentChatRoom: ChatRoom;
  chatRoomId: string;
  user: User;
  f7Messages: Messages.Messages;
  instances: { [key: string]: Component } = {};
  states: { [key: string]: State } = {};
  currentInstance: Component;
  token: JWTToken;
  onOpenChatRoom$ = new EventEmitter<Component & { sendMessage?: (message: any) => void }>();
  lastMessage: Message;

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

    this.authService.onTokenChange()
      .subscribe((token: NbAuthOAuth2Token) => {
        if (token.isValid()) {
          this.token = JSON.parse(token.toString());
        } else {
          console.info('token no valid');
        }
      });

    this.authService.getToken().subscribe((token: NbAuthOAuth2Token) => {
      if (token.isValid()) {
        this.token = JSON.parse(token.toString());
      } else {
        console.info('token no valid');
      }
    });

  }

  async initChatRoom(chatRoomId: string) {
    // this.commonService.loginInfo;
    return new Promise<boolean>(async resolve => {
      let chatRoom = this.chatRoomCacheList[chatRoomId];
      this.chatRoomId = chatRoomId;
      if (!chatRoom) {
        if (chatRoomId) {
          this.user = {
            id: this.commonService.loginInfo.user.Code,
            name: this.commonService.loginInfo.user.Name,
            picture: 'https://cdn.framework7.io/placeholder/people-100x100-7.jpg',
          };
          this.currentChatRoom = await this.parentCompoent.localChatClient.openChatRoom(this, this.chatRoomId, this.user);
          this.currentChatRoom.state$.subscribe(state => {
            console.log('Chat room socket state : ' + state);
            if (state === 'ready') {
              resolve(true);
            }
          });
          chatRoom = this.chatRoomCacheList[chatRoomId] = this.currentChatRoom;
        } else {
          console.warn('Chat room id was not provided !!!');
          resolve(false);
          return;
        }
      } else {
        this.currentChatRoom = chatRoom;
        // this.currentChatRoom.connect();
        // chatRoom.setContextAndSync(this).then(() => {
        //   console.log('sync chat room with new context success');
        //   this.f7Messages.scroll(0, 9999999);
        // });
      }
      this.states[chatRoomId].socket = chatRoom;
      resolve(true);
    });
  }

  getLastMesssage() {
    return null; // Sync all messages cache
    // return this.states[this.chatRoomId].lastMessage;
  }

  onF7pageRemove(chatRoomId: string) {
    // if (this.chatRoomCacheList[chatRoomId]) {
    //   this.chatRoomCacheList[chatRoomId].disconnect();
    // }
  }

  async onChatRoomInit() {
    return true;
  }

  getAuthenticateToken(): JWTToken {
    return this.token;
  }

  async onChatRoomConnect() {
    return true;
  }
  async onChatRoomReconnect() {
    return true;
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

  async onNewMessage(newMessage: Message) {
    if (!this.f7Messages) {
      return false;
    }

    // If message chat room not matched with context => do nothing
    if (newMessage.namespace !== this.chatRoomId) {
      // Push notification
      const ref: NbToastRef = this.commonService.toastService.show(newMessage.content || 'Attachemnts', newMessage.namespace, {
        status: 'primary',
        duration: 10000,
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        limit: 5,
      });
      try {
        setTimeout(() => {
          const nativeEle = ref['toastContainer'].nativeElement;
          nativeEle.addEventListener('click', () => {
            this.parentCompoent.openChatRoom({ ChatRoom: newMessage.namespace });
          });
        }, 0);
      } catch (e) {
        console.log(e);
      }
      return false;
    }

    const images = this.createThumbnailWrap(newMessage.attachments);
    this.f7Messages.addMessage({
      type: newMessage.from.id === this.commonService.loginInfo && this.commonService.loginInfo.user.Code ? 'sent' : 'received',
      avatar: newMessage.from.avatar,
      name: newMessage.from.name,
      header: null,
      textHeader: null,
      text: newMessage.content,
      textFooter: null,
      footer: this.commonService.datePipe.transform(newMessage.date, 'short'),
      isTitle: false,
      image: images,
      imageSrc: '',
      // cssClass: newMessage.attachments && newMessage.attachments.length > 0 ? '' : '',
    }, 'append');
    this.states[this.chatRoomId].lastMessage = newMessage;
    return true;
  }

  async onRestoreMessages(namespace: string, messages: Message[]) {
    if (namespace !== this.chatRoomId) {
      return false;
    }
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const images = this.createThumbnailWrap(message.attachments);
      this.f7Messages.addMessage({
        type: message.from.id === this.user.id ? 'sent' : 'received',
        avatar: message.from.avatar,
        name: message.from.name,
        header: null,
        textHeader: null,
        text: message.content,
        textFooter: null,
        footer: this.commonService.datePipe.transform(message.date, 'short'),
        isTitle: false,
        image: images,
        imageSrc: '',
      }, 'append', false);
    }
    this.states[this.chatRoomId].lastMessage = messages[messages.length - 1];
    this.f7Messages.scroll(0, this.states[this.chatRoomId].scrollPosition || 9999999);
    return true;
  }

  get f7Component() {
    const $this = this;
    return {
      name: 'chat-room',
      path: '/chat-room/:id',
      // Component Object
      component: {
        template: `
        <div class="page">
        <div class="navbar">
          <div class="navbar-bg"></div>
          <div class="navbar-inner sliding">
            <div class="left">
              <a href="#" class="link back">
                <i class="icon icon-back"></i>
                <span class="if-not-md">Back</span>
              </a>
            </div>
            <div class="title">Messages</div>
            <div class="right">
              <a href="#" class="link" @click="openSetting">
                <i class="icon f7-icons if-not-md">menu</i>
                <i class="icon material-icons md-only">menu</i>
              </a>
            </div>
          </div>
        </div>
        <div class="toolbar messagebar" @messagebar:attachmentdelete="deleteAttachment">
          <div class="toolbar-inner">
            <a class="link icon-only" @click="sheetToggle">
              <i class="icon f7-icons if-not-md">camera_fill</i>
              <i class="icon material-icons md-only">camera_alt</i>
            </a>
            <div class="messagebar-area">
              <textarea class="resizable" placeholder="Message"></textarea>
            </div>
            <a class="link icon-only demo-send-message-link" @click="sendMessage">
              <i class="icon f7-icons if-not-md">arrow_up_circle_fill</i>
              <i class="icon material-icons md-only">send</i>
            </a>
          </div>
          <div class="messagebar-sheet">
            {{#each images}}
            <label class="checkbox messagebar-sheet-image" style="background-image:url({{this}})" @change="handleAttachment">
              <input type="checkbox">
              <i class="icon icon-checkbox"></i>
            </label>
            {{/each}}
          </div>
        </div>
        <div class="page-content messages-content">
          <div class="messages">
          </div>
        </div>
      </div>
        `,
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
          sheetToggle: function () {
            const self = this;
            // self.messagebar.sheetToggle();
            $this.parentCompoent.uploadFile().then((files: FileModel[]) => {
              for (let i = 0; i < files.length; i++) {
                const file = files[i];
                console.log(file);
                // self.messagebar.sheetToggle();
                if (!self.messagebar.selectedAttachments) {
                  self.messagebar.selectedAttachments = [];
                }
                self.messagebar.attachments.unshift(file.Thumbnail + '?token=' + $this.apiService.getAccessToken());
                self.messagebar.selectedAttachments.unshift({
                  type: 'image',
                  payload: {
                    id: `${file.Store}/${file.Id}.${file.Extension}`,
                    thumbnail: file.Thumbnail,
                    url: file.DownloadLink,
                  },
                });
              }
              self.messagebar.renderAttachments();
              self.checkAttachments();
            });
          },
          deleteAttachment: function (e: any, index: number) {
            const self = this;
            const image = self.messagebar.attachments.splice(index, 1)[0];
            self.messagebar.selectedAttachments.splice(index, 1)[0];
            self.messagebar.renderAttachments();
            self.checkAttachments();
            // Uncheck in sheet
            const imageIndex = self.images.indexOf(image);
            self.$el.find('.messagebar-sheet .checkbox').eq(imageIndex).find('input').prop('checked', false);
          },
          handleAttachment: function (e: any) {
            const self = this;
            // const $$ = self.$$;
            // tslint:disable-next-line: ban
            const index = $(e.target).parents('label.checkbox').index();
            const image = self.images[index];
            if (e.target.checked) {
              // Add to attachments
              self.messagebar.attachments.unshift(image);
            } else {
              // Remove from attachments
              self.messagebar.attachments.splice(self.messagebar.attachments.indexOf(image), 1);
            }
            self.messagebar.renderAttachments();
            self.checkAttachments();
          },
          checkAttachments: function () {
            const self = this;
            if (self.messagebar.attachments.length > 0) {
              self.messagebar.attachmentsShow();
              self.messagebar.setPlaceholder('Add comment or Send');
            } else {
              self.messagebar.attachmentsHide();
              self.messagebar.setPlaceholder('Message');
            }
          },
          sendMessage: async function (message: Message) {
            const self = this;
            const text: string = message && message.content ? message.content : self.messagebar.getValue().replace(/\n/g, '<br>').trim();
            const messagesToSend = [];
            const images = $this.createThumbnailWrap(self.messagebar.selectedAttachments);
            if (self.messagebar.selectedAttachments) {
              message.attachments = self.messagebar.selectedAttachments;
            }
            const msg: GuiMessage = {
              text: text,
              image: images,
            };

            messagesToSend.push(msg);
            // }
            // // Reset attachments
            self.messagebar.attachments = [];
            self.messagebar.selectedAttachments = [];
            self.checkAttachments();
            // // Hide sheet
            self.messagebar.sheetHide();
            // Uncheck selected images in sheet
            self.messagebar.$sheetEl.find('input').prop('checked', false);
            // Clear area
            self.messagebar.clear();
            // Focus area
            if (text.length) self.messagebar.focus();
            // Send message

            // Socket send message
            const msgData: Message = {
              index: Date.now(),
              namespace: $this.chatRoomId,
              from: $this.user,
              content: text,
              attachments: message.attachments,
            };

            self.messages.addMessages(messagesToSend);
            const rspMessage = await $this.currentChatRoom.sendMessage(msgData, $this.user);
            console.info(rspMessage);
            $this.states[$this.chatRoomId].lastMessage = rspMessage;

            // Mock response
            if (self.responseInProgress) return;
            self.responseInProgress = true;
            if (false) setTimeout(function () {
              const answer = self.answers[Math.floor(Math.random() * self.answers.length)];
              const person = self.people[Math.floor(Math.random() * self.people.length)];
              self.messages.showTyping({
                header: person.name + ' is typing',
                avatar: person.avatar,
              });
              setTimeout(function () {
                self.messages.addMessage({
                  text: answer,
                  type: 'received',
                  name: person.name,
                  avatar: person.avatar,
                });
                self.messages.hideTyping();
                self.responseInProgress = false;
              }, 4000);
            }, 1000);
          },
          openSetting: () => {
            const self: MessagesPage = this;
            this.parentCompoent.mainView.router.navigate('/chat-room-setting/' + this.chatRoomId);
          },
        },
        on: {
          pageBeforeRemove: function (e: any, page: any) {
            const self: Component & { messagebar: any } = this;
            if (self.messagebar) self.messagebar.destroy();
            $this.onF7pageRemove(self.$route.params['id']);
          },
          pageInit: function (e: any, page: any) {
            const self: Component & { [key: string]: any } = this;
            const app = self.$app;
            self.messagebar = app.messagebar.create({
              el: page.$el.find('.messagebar'),
              attachments: [],
            });
            self.messages = app.messages.create({
              el: page.$el.find('.messages'),
              firstMessageRule: function (message: Messages.Message, previousMessage: Messages.Message, nextMessage: Messages.Message) {
                if (message.isTitle) return false;
                if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) return true;
                return false;
              },
              lastMessageRule: function (message: Messages.Message, previousMessage: Messages.Message, nextMessage: Messages.Message) {
                if (message.isTitle) return false;
                if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
                return false;
              },
              tailMessageRule: function (message: Messages.Message, previousMessage: Messages.Message, nextMessage: Messages.Message) {
                if (message.isTitle) return false;
                if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
                return false;
              },
              sameFooterMessageRule: function (message: Messages.Message, previousMessage: Messages.Message, nextMessage: Messages.Message) {
                if (message.isTitle) return false;
                if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return false;
                return true;
              },
            } as Messages.Parameters);

            // const state: State = {
            //   id: self.$route.params['id'],
            //   component: self,
            // };
            // state.component = self;
            // state.id = self.$route.params['id'];
            if (!$this.states[self.$route.params['id']]) {
              $this.states[self.$route.params['id']] = {
                id: self.$route.params['id'],
                component: self,
              };
            }
            $this.states[self.$route.params['id']].component = self;
            $this.instances[self.$route.params['id']] = self;
            $this.states[self.$route.params['id']].f7Message = $this.f7Messages = self.messages;
            // $this.lastMessage = self.lastMessage;
            $this.currentInstance = self;

            try {
              $this.initChatRoom(self.$route.params['id']).then(rs => {
                if (rs) {
                  $this.onOpenChatRoom$.emit(self);
                }
              });
            } catch (e) { }

            // Listen new messages
          },
          pageMounted: function (e, page) {
            console.log('page mounted');
          },
          pageBeforeIn: function (e, page) {
            console.log('page before in');
            const chatRoomId = page.route.path.split('/')[2];
            // $this.states[chatRoomId];

            $this.states[chatRoomId].component.messagebar.setValue($this.states[chatRoomId].messageBar && $this.states[chatRoomId].messageBar.text);
            $this.states[chatRoomId].component.messagebar.attachments = $this.states[chatRoomId].messageBar.attachments;
            $this.states[chatRoomId].component.messagebar['selectedAttachments'] = $this.states[chatRoomId].messageBar.selectedAttachments;
            $this.states[chatRoomId].component.messagebar.renderAttachments();
            $this.states[chatRoomId].component.checkAttachments();

            if ($this.states[chatRoomId]) {
              $this.chatRoomId = $this.states[chatRoomId].id;
              new Promise((resolve, reject) => {
                const checkpoint = Date.now();
                (function loop() { if ($this.states[chatRoomId].socket) resolve(); else if (checkpoint + 10000 < Date.now()) reject(); else setTimeout(() => loop(), 200); })();
              }).then(() => {
                $this.states[chatRoomId].socket.setContextAndSync($this).then(() => {
                  console.log('sync chat room with new context success');
                });
              }).catch(() => {
                console.log('loop timeout');
              });
              // if (state.socket) {
              //   state.socket.setContextAndSync($this).then(() => {
              //     console.log('sync chat room with new context success');
              //     $this.f7Messages.scroll(0, 9999999);
              //   });
              // } else {
              //   $this.f7Messages.scroll(0, 9999999);
              // }
            }

          },
          pageAfterIn: function (e, page) {
            console.log('page after in');

          },
          pageBeforeOut: function (e, page) {
            console.log('page before out');
            const chatRoomId = page.route.path.split('/')[2];
            $this.states[chatRoomId].scrollPosition = page.$el[0].children[1].scrollTop;
            $this.states[chatRoomId].messageBar = {
              text: $this.states[chatRoomId].component.messagebar.getValue(),
              attachments: $this.states[chatRoomId].component.messagebar.attachments,
              selectedAttachments: $this.states[chatRoomId].component.messagebar['selectedAttachments'],
            };
          },
          pageAfterOut: function (e, page) {
            console.log('page after out');
          },
          pageBeforeUnmount: function (e, page) {
            console.log('page before unmount');
          },
        },
      },
    };
  }
}

import { ChatRoomComponent } from '../chat-room.component';
import { ChatRoom, IChatRoomContext } from '../../../../lib/nam-chat/chat-room';
import { User } from '../../../../@core/data/users';
import { Messages } from 'framework7/components/messages/messages';
import { Message } from '../../../../lib/nam-chat/model/message';
import { CommonService } from '../../../../services/common.service';

export class MessagesPage implements IChatRoomContext {

  currentChatRoom: ChatRoom;
  chatRoomId: string;
  user: User;
  f7Messages: Messages.Messages;

  constructor(
    public parentCompoent: ChatRoomComponent,
    private commonService: CommonService,
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
  }

  async initChatRoom() {
    // this.commonService.loginInfo;
    this.chatRoomId = 'test';
    this.user = {
      id: this.commonService.loginInfo.user.Code,
      name: this.commonService.loginInfo.user.Name,
      picture: 'https://cdn.framework7.io/placeholder/people-100x100-7.jpg',
    };
    this.currentChatRoom = await this.parentCompoent.localChatClient.openChatRoom(this, this.chatRoomId, this.user);
    this.currentChatRoom.state$.subscribe(state => {
      if (state === 'ready') {

      }
    });
  }

  onChatRoomInit(): void {

  }
  onChatRoomConnect(): void {

  }
  onChatRoomReconnect(): void {

  }
  onChatRoomHadNewMessage(newMessage: Message): void {
    if (this.f7Messages) {
      this.f7Messages.addMessage({
        type: newMessage.from.id === this.user.id ? 'sent' : 'received',
        avatar: newMessage.from.avatar,
        name: newMessage.from.name,
        header: null,
        textHeader: null,
        text: newMessage.content,
        textFooter: null,
        footer: 'just received',
        isTitle: false,
        image: '',
        imageSrc: '',
      }, 'append');
    }
  }

  get f7Component() {
    const $this = this;
    return {
      name: 'messages',
      path: '/messages/',
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
              <a href="#" class="link">
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
            self.messagebar.sheetToggle();
          },
          deleteAttachment: function (e: any, index: number) {
            const self = this;
            const image = self.messagebar.attachments.splice(index, 1)[0];
            self.messagebar.renderAttachments();
            self.checkAttachments();
            // Uncheck in sheet
            const imageIndex = self.images.indexOf(image);
            self.$el.find('.messagebar-sheet .checkbox').eq(imageIndex).find('input').prop('checked', false);
          },
          handleAttachment: function (e: any) {
            const self = this;
            const $$ = self.$$;
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
          sendMessage: async function () {
            const self = this;
            const text = self.messagebar.getValue().replace(/\n/g, '<br>').trim();
            const messagesToSend = [];
            self.messagebar.attachments.forEach(function (attachment) {
              const size = attachment.split('placeholder/cats-')[1].split('-')[0].split('x');
              messagesToSend.push({
                image: '<img src="' + attachment + '" style="width: ' + (size[0] / 2) + 'px; height: ' + (size[1] / 2) + 'px">',
              });
            });
            if (text.trim().length) {
              messagesToSend.push({
                text: text,
              });
            }
            // Reset attachments
            self.messagebar.attachments = [];
            self.checkAttachments();
            // Hide sheet
            self.messagebar.sheetHide();
            // Uncheck selected images in sheet
            self.messagebar.$sheetEl.find('input').prop('checked', false);
            // Clear area
            self.messagebar.clear();
            // Focus area
            if (text.length) self.messagebar.focus();
            // Send message

            // Socket send message
            const rspMessage = $this.currentChatRoom.sendMessage({
              index: Date.now(),
              chatRoom: $this.chatRoomId,
              from: $this.user,
              content: text,
            }, $this.user);
            console.info(rspMessage);
            self.messages.addMessages(messagesToSend);

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
        },
        on: {
          pageBeforeRemove: function (e, page) {
            const self = this;
            if (self.messagebar) self.messagebar.destroy();
          },
          pageInit: function (e: any, page: any) {
            const self = this;
            const app = self.$app;
            self.messagebar = app.messagebar.create({
              el: page.$el.find('.messagebar'),
              attachments: [],
            });
            self.messages = app.messages.create({
              el: page.$el.find('.messages'),
              firstMessageRule: function (message, previousMessage, nextMessage) {
                if (message.isTitle) return false;
                if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) return true;
                return false;
              },
              lastMessageRule: function (message, previousMessage, nextMessage) {
                if (message.isTitle) return false;
                if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
                return false;
              },
              tailMessageRule: function (message, previousMessage, nextMessage) {
                if (message.isTitle) return false;
                if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
                return false;
              },
            });

            $this.f7Messages = self.messages;
            $this.initChatRoom();

            // Listen new messages
          },
        },
      },
    };
  }
}

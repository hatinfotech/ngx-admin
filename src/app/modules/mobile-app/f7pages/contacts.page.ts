import { Router as F7Router } from 'framework7/modules/router/router';
import { View } from 'framework7/components/view/view';
import { ChatRoom, JWTToken } from '../../../lib/nam-chat/chat-room';
import { User } from '../../../@core/data/users';
import { Messages } from 'framework7/components/messages/messages';
// import { Messagebar } from 'framework7/components/messagebar/messagebar';
import { MessageAttachment } from '../../../lib/nam-chat/model/message';
import { CommonService } from '../../../services/common.service';
import { NbAuthService, NbAuthOAuth2Token } from '@nebular/auth';
import Framework7, { Component } from 'framework7';
import { MobileAppComponent } from '../mobile-app.component';
import { EventEmitter } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ContactModel } from '../../../models/contact.model';
import { VirtualList } from '@ag-grid-community/all-modules';
import { Page } from 'framework7/components/page/page';

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
export class ContactsPage {

  currentChatRoom: ChatRoom;
  chatRoomId: string;
  user: User;
  f7Messages: Messages.Messages;
  instances: { [key: string]: Component } = {};
  token: JWTToken;
  onOpenChatRoom$ = new EventEmitter<Component & { sendMessage?: (message: any) => void }>();
  activePage: { app: Framework7, $f7router: F7Router.Router, $f7route: { query: any, context: any, params: any }, [key: string]: any };
  activeConponent: Component & { [key: string]: any };

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
      name: 'contacts',
      path: '/contacts',
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
            <div class="title">Virtual "List" VDOM</div>
            <div class="subnavbar">
              <form data-search-container=".virtual-list-vdom" data-search-item="li" data-search-in=".item-title" class="searchbar searchbar-contacts searchbar-init">
                <div class="searchbar-inner">
                  <div class="searchbar-input-wrap">
                    <input type="search" placeholder="Search"/>
                    <i class="searchbar-icon"></i>
                    <span class="input-clear-button"></span>
                  </div>
                  <span class="searchbar-disable-button if-not-aurora">Cancel</span>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="searchbar-backdrop"></div>
        <div class="page-content">
          <div class="block">
            <p>This example shows how "to" "use" Virtual "List" "with" external renderer, "like" "with" built-in Virtual DOM</p>
          </div>
          <div class="list simple-list searchbar-not-found">
            <ul>
              <li>Nothing found</li>
            </ul>
          </div>
          <div class="list virtual-list virtual-list-vdom media-list searchbar-found">
            <ul>
              {{#each vlData.items}}
              <li key="{{id}}" _id="{{id}}" style="top: {{../../vlData.topPosition}}px" @click="itemClick">
                <a href="#" class="item-link item-content">
                  <div class="item-media"><i class="icon" style="background-image: url(https://framework7.io/kitchen-sink/core/img/f7-icon.png); width: 28px; height: 28px"></i></div>
                  <div class="item-inner">
                    <div class="item-title-row">
                      <div class="item-title">{{title}}</div>
                    </div>
                    <div class="item-subtitle">{{subtitle}}</div>
                  </div>
                </a>
              </li>
              {{/each}}
            </ul>
          </div>
        </div>
      </div>`,
        style: `
        `,
        data: async () => {
          return {
            items: [],
            vlData: {
              items: [],
            },
          };
        },
        methods: {
          itemClick: (event: MouseEvent) => {
            const self = this;
            // const id = $(item).attr('_id');
            // const select
            console.log(event);
            const id = $(event.currentTarget).attr('_id');
            const contact = $this.activeConponent.items.find(c => c.id === id);
            if ($this.activeConponent.$f7route['context']['onChooseContact']) {
              $this.activeConponent.$f7route.context['onChooseContact'](contact);
              $this.activeConponent.$f7router.back();
            }
          },
        },
        on: {
          pageBeforeRemove: function () {
            const self = this;
            self.virtualList.destroy();
          },
          pageInit: function (e, page) {
            const self = this;
            $this.activeConponent = this;
            $this.activePage = page;
            self.searchBar = self.$app.searchbar.create({
              el: '.searchbar-contacts',
              // searchContainer: '.virtual-list-vdom',
              // searchin: '.item-title',
            });
            $(self.searchBar.$inputEl[0]).keyup(e => {
              // console.log(e);
              $this.commonService.takeUntil('contact_search', 300).then(() => {
                // console.log(self.searchBar.$inputEl[0].value);
                $this.apiService.getPromise<ContactModel[]>('/contact/contacts', { search: self.searchBar.$inputEl[0].value }).then(rs => {
                  const contacts = rs.map(contact => ({
                    ...contact,
                    id: contact.Code,
                    title: contact.Name,
                    subtitle: contact.Name,
                  }));
                  self.items = self.virtualList.items = contacts;
                  self.virtualList.update();
                });
              });
            });

            self.virtualList = self.$app.virtualList.create({
              // List Element
              el: self.$el.find('.virtual-list'),
              // Pass array with items
              items: self.items,
              // Custom search function for searchbar
              searchByItem: (query: string, item: any, index: number) => true,
              // Item height
              height: self.$theme.ios ? 63 : (self.$theme.md ? 73 : 46),
              // Render external function
              renderExternal: (vl: VirtualList, vlData: any) => {
                self.$setState({
                  vlData: vlData,
                });
              },
            });
          },
        },
      },
    };
  }
}

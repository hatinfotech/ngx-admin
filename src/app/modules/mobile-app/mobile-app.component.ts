import { OnInit, AfterViewInit, Component, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ChatManager } from './../../lib/nam-chat/chat-manager';
import { ChatRoom } from '../../lib/nam-chat/chat-room';
import { View } from 'framework7/components/view/view';
import Framework7 from 'framework7/framework7.esm.bundle';
import { Messages } from 'framework7/components/messages/messages';
import { Router as F7Router } from 'framework7/modules/router/router';
// import { MessagesPage, AboutPage } from './f7pages';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Message } from '../../lib/nam-chat/model/message';
import { User } from '../../lib/nam-chat/model/user';
import { BaseComponent } from '../../lib/base-component';
import { Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { MobileAppService } from './mobile-app.service';
import { NbThemeService } from '@nebular/theme';
import { takeUntil, map } from 'rxjs/operators';
import { MessagesPage } from './f7pages/messages.page';
import { AboutPage } from './f7pages/about.page';
import { PhonePage } from './f7pages/phone.page';
import { Track } from '../../@core/utils/player.service';
import { Component as F7Component } from 'framework7';
import { UploaderOptions, UploadFile, UploadInput, humanizeBytes, UploadOutput } from '../../../vendor/ngx-uploader/src/public_api';
import { FormGroup } from '@angular/forms';
import { ProductModel } from '../../models/product.model';
import { FileModel } from '../../models/file.model';
import { ChatRoomSettingPage } from './f7pages/chat-room-setting.page';
import { ContactsPage } from './f7pages/contacts.page';

// Global var
let f7app = null;

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
  selector: 'ngx-mobile-app',
  templateUrl: './mobile-app.component.html',
  styleUrls: ['./mobile-app.component.scss'],
})
export class MobileAppComponent extends BaseComponent implements OnInit, AfterViewInit {

  componentName = 'ChatRoomComponent';
  mobileScreen = 'phone';

  chatServiceInfo: {
    protocol?: string,
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

  mediaTracks: Track[] = [];

  messagePage: MessagesPage;
  chatRoomSettingPage: ChatRoomSettingPage;

  // app: Framework7;
  constructor(
    // private chatService: ChatService,
    public mobileAppService: MobileAppService,
    // private apiService: ApiService,
    // private commonService: CommonService,
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
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
      // if (false) {
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
          this.chatServiceInfo.url = `${this.chatServiceInfo.protocol || 'https'}://${this.chatServiceInfo.domain}:${this.chatServiceInfo.port}`;
          this.localChatClient = new ChatManager(this.chatServiceInfo.url, this.user);
          this.localChatClient.onConnect().then(() => {
            this.readySubject.next(true);
          }).catch(e => console.error(e));
          console.info('Conntect to local chat server success');
        }).catch(e => console.error(e));
      }
      // }
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
        this.messagePage = new MessagesPage(this, this.commonService, this.authService, this.apiService);
        this.chatRoomSettingPage = new ChatRoomSettingPage(this, this.commonService, this.authService, this.apiService);
        const routes: any[] = [
          this.messagePage.f7Component,
          this.chatRoomSettingPage.f7Component,
          new AboutPage(this, this.commonService, this.authService).f7Component,
          new PhonePage(this, this.commonService, this.authService).f7Component,
          new ContactsPage(this, this.commonService, this.authService, this.apiService).f7Component,
        ];

        // Init Framework7 app
        if (f7app) {
          this.f7app = f7app;
        } else {
          f7app = this.f7app = new Framework7({
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

          this.mainView = this.f7app.views.create('.view-main', {
            stackPages: true,
          });
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
      }
    });


  }

  async openChatRoom(option: any) {
    this.commonService.openMobileSidebar();
    if (typeof option === 'string') {
      option = {
        ChatRoom: option,
      };
    }
    if (typeof option['silient'] === 'undefined') {
      option['silient'] = false;
    }
    if (option['silient'] === false) {
      this.switchScreen('f7app');
    }
    const id = option['ChatRoom'];
    if (this.mainView.history.some(url => url === `/chat-room/${id}`)) {
      this.mainView.router.back(`/chat-room/${id}`, { force: true });
    } else {
      this.mainView.router.navigate(`/chat-room/${id}`);
    }
    return new Promise<F7Component & { sendMessage?: (message: any) => void }>(resolve => {
      const subcription = this.messagePage.onOpenChatRoom$.asObservable().subscribe(f7MessageComponent => {
        if (f7MessageComponent.$route.params['id'] === option.ChatRoom) {
          if (subcription) {
            subcription.unsubscribe();
          }
          resolve(f7MessageComponent);
        }
      });
    });
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

  switchScreen(screen: string) {
    this.commonService.openMobileSidebar();
    this.mobileScreen = screen;
  }

  playMedias(tracks: Track[]) {
    this.commonService.openMobileSidebar();
    this.switchScreen('media-player');
    // this.mediaTracks = [];
    // this.mediaTracks = tracks;
    this.mediaTracks = [
      {
        name: 'Ring tone',
        artist: 'MTSG',
        url: 'https://static.stringee.com/stringeex/web_phone/lastest/audio/Antique-Phone5.mp3',
        cover: 'assets/images/cover1.jpg',
      },
    ];
  }

  /** ngx-uploader */
  options: UploaderOptions = { concurrency: 1, maxUploads: 0, maxFileSize: 1024 * 1024 * 1024 };
  formData: FormData;
  files: UploadFile[] = [];
  uploadInput: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();
  humanizeBytes: Function = humanizeBytes;
  dragOver: { [key: string]: boolean } = {};
  filesIndex: { [key: string]: UploadFile } = {};
  pictureFormIndex: { [key: string]: FormGroup } = {};
  uploadComplete$ = new Subject<{ tracking: string, file: FileModel }>();
  uploadAddToQueue$ = new Subject<any>();
  uploadForProduct: ProductModel;
  @ViewChild('uploadBtn') uploadBtn: ElementRef;

  async onUploadOutput(output: UploadOutput) {
    // console.log(output);
    // console.log(this.files);
    switch (output.type) {
      case 'allAddedToQueue':
        // uncomment this if you want to auto upload files when added
        const event: UploadInput = {
          type: 'uploadAll',
          url: this.apiService.buildApiUrl('/file/files'),
          method: 'POST',
          data: { foo: 'bar' },
        };
        this.uploadInput.emit(event);
        break;
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          this.files.push(output.file);
          this.filesIndex[output.file.id] = output.file;
          this.uploadAddToQueue$.next(output.file.id);
        }
        break;
      case 'uploading':
        if (typeof output.file !== 'undefined') {
          // update current data in files array for uploading file
          const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
          this.files[index] = output.file;
          console.log(`[${output.file.progress.data.percentage}%] Upload file ${output.file.name}`);
        }
        break;
      case 'removed':
        // remove file from array when removed
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
        break;
      case 'dragOver':
        // this.dragOver[formItemIndex] = true;
        break;
      case 'dragOut':
      case 'drop':
        // this.dragOver[formItemIndex] = false;
        break;
      case 'done':
        // The file is downloaded
        console.log('Upload complete');
        const fileResponse: FileModel = output.file.response[0];

        try {

          if (fileResponse) {

            // get product
            // const product = (await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { id: [this.uploadForProduct.Code], includePictures: true }))[0];
            // if (product) {
            //   product.Pictures.push({ Image: fileResponse.Store + '/' + fileResponse.Id });
            //   await this.apiService.putPromise<ProductModel[]>('/admin-product/products', {}, [{
            //     Code: this.uploadForProduct.Code,
            //     FeaturePicture: fileResponse.Store + '/' + fileResponse.Id,
            //     Pictures: product.Pictures,
            //   }]);

            // this.source['isLocalUpdate'] = true; // local reload
            // await this.source.update(this.uploadForProduct, { ...this.uploadForProduct, FeaturePictureThumbnail: fileResponse['Thumbnail'] });
            // this.source['isLocalUpdate'] = true;

            this.uploadComplete$.next({
              tracking: output.file.id,
              file: fileResponse,
            });

            // this.files = [];
            this.uploadBtn.nativeElement.value = '';

            // } else {
            //   throw Error('Get product failed');
            // }

          } else {
            throw Error('upload failed');
          }

          console.log(output);
        } catch (e) {
          this.files = [];
          this.uploadBtn.nativeElement.value = '';
        }

        break;
    }
  }

  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.apiService.buildApiUrl('/file/files'),
      method: 'POST',
      data: { foo: 'bar' },
    };

    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

  async uploadFile() {
    this.uploadBtn.nativeElement.click();
    const uploadedFiles = [];
    return new Promise<FileModel[]>(resolve => {
      const subscription1 = this.uploadAddToQueue$.subscribe(index => {
        const subscription2 = this.uploadComplete$.subscribe(response => {
          if (index === response.tracking) {
            uploadedFiles.push(response.file);
            console.log(response);
            this.files = this.files.filter(f => f.id !== index);
            this.filesIndex[index] = null;
            if (this.files.length === 0) {
              subscription1.unsubscribe();
              subscription2.unsubscribe();
              resolve(uploadedFiles);
            }
          }
        });
      });
    });
  }
  /** End ngx-uploader */

}

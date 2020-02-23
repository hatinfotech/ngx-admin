import { ChatRoomComponent } from '../chat-room.component';
import { CommonService } from '../../../../services/common.service';
import { NbAuthService } from '@nebular/auth';

export class AboutPage {

  constructor(
    public parentComponent: ChatRoomComponent,
    private commonService: CommonService,
    private authService: NbAuthService,
  ) {

  }

  get f7Component() {
    return {
      name: 'about',
      path: '/about/',
      // Component Object
      component: {
        template: `
      <div class="page page-about">
      <div class="navbar navbar-large-transparent">
        <div class="navbar-bg"></div>
        <div class="navbar-inner sliding">
          <div class="left">
            <a href="#" class="link back">
              <i class="icon icon-back"></i>
              <span class="if-not-md">Framework7</span>
            </a>
          </div>
          <div class="title">About</div>
          <div class="title-large">
            <div class="title-large-text">About</div>
          </div>
        </div>
      </div>
      <div class="page-content">
        <div class="block-title block-title-medium">Welcome to Framework7</div>
        <div class="block block-strong">
          <p>Framework7 - is a free and open source HTML mobile framework to develop hybrid mobile apps or web apps with iOS or Android (Material) native look and feel. It is also an indispensable prototyping apps tool to show working app prototype as soon as possible in case you need to. Framework7 is created by Vladimir Kharlampidi (iDangero.us).</p>
          <p>The main approach of the Framework7 is to give you an opportunity to create iOS and Android (Material) apps with HTML, CSS and JavaScript easily and clear. Framework7 is full of freedom. It doesn't limit your imagination or offer ways of any solutions somehow. Framework7 gives you freedom!</p>
          <p>Framework7 is not compatible with all platforms. It is focused only on iOS and Android (Material) to bring the best experience and simplicity.</p>
          <p>Framework7 is definitely for you if you decide to build iOS and Android hybrid app (Cordova or PhoneGap) or web app that looks like and feels as great native iOS or Android (Material) apps.</p>
        </div>
      </div>
    </div>
        `,
        style: ``,
        data: function () {
          return {};
        },
        methods: {

        },
        on: {
          pageBeforeRemove: function (e: any, page: any) {
            // let self = this;
          },
          pageInit: function (e: any, page: any) {
            // const self = this;
            // let app = self.$app;
          },
        },
      },
    };
  }

}

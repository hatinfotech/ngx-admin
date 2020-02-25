import { NbAuthService } from '@nebular/auth';
import { CommonService } from '../../../services/common.service';
import { MobileAppComponent } from '../mobile-app.component';

export class PhonePage {

  constructor(
    public parentComponent: MobileAppComponent,
    private commonService: CommonService,
    private authService: NbAuthService,
  ) {

  }

  get f7Component() {
    return {
      name: 'phone',
      path: '/phone/',
      // Component Object
      component: {
        template: `
        `,
        style: `

        `,
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

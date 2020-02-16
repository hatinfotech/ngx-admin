import { Component, OnInit, AfterViewInit } from '@angular/core';
import Framework7 from 'framework7';
import { Framework7Params } from 'framework7/components/app/app-class';

@Component({
  selector: 'ngx-mobile-app',
  templateUrl: './mobile-app.component.html',
  styleUrls: ['./mobile-app.component.scss'],
})
export class MobileAppComponent implements OnInit, AfterViewInit {

  app: Framework7;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.app = new Framework7({
      // App root element
      root: '#mobile-app',
      // App Name
      name: 'Mini-ERP',
      // App id
      id: 'com.namsoftware.minierpapp',
      // Enable swipe panel
      panel: {
        // swipe: 'left',
      },
      // Add default routes
      routes: [
        {
          path: '/about/',
          url: 'about.html',
        },
      ],
      // ... other parameters
    });
    // const mainView = this.app.views.create('.view-main');
    console.info(this.app);
    // console.info(mainView);
  }

}

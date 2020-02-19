import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'ngx-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit {

  // app: Framework7;
  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  // ngAfterViewInit(): void {
  //   this.app = new Framework7({
  //     // App root element
  //     root: '#mobile-app',
  //     // App Name
  //     name: 'Mini-ERP',
  //     // App id
  //     id: 'com.namsoftware.minierpapp',
  //     // Enable swipe panel
  //     panel: {
  //       // swipe: 'left',
  //     },
  //     // Add default routes
  //     routes: [
  //       {
  //         path: '/about/',
  //         url: 'about.html',
  //       },
  //     ],
  //     // ... other parameters
  //   });
  //   // const mainView = this.app.views.create('.view-main');
  //   console.info(this.app);
  //   // console.info(mainView);
  // }

}

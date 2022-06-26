import { ContactModel } from './../../../../models/contact.model';
import { MobileAppService } from './../../../mobile-app/mobile-app.service';
import { ApiService } from './../../../../services/api.service';
import { ShowcaseDialogComponent } from './../../../dialog/showcase-dialog/showcase-dialog.component';
import { CommonService } from './../../../../services/common.service';
import { Component, Input, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { Contacts, RecentUsers, UserData } from '../../../../@core/data/users';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ngx-most-active-publishers',
  styleUrls: ['./most-active-publishers.component.scss'],
  templateUrl: './most-active-publishers.component.html',
})
export class MostActivePublishersComponent implements OnDestroy {

  private alive = true;

  @Input('publishers') publishers: any[];
  @Input('products') products: any[];

  constructor(
    private userService: UserData,
    public commonService: CommonService,
    public apiService: ApiService,
    public mobileAppService: MobileAppService,
  ) {
    // forkJoin(
    //   this.userService.getContacts(),
    //   this.userService.getRecentUsers(),
    // )
    //   .pipe(takeWhile(() => this.alive))
    //   .subscribe(([contacts, recent]: [Contacts[], RecentUsers[]]) => {
    //     this.contacts = contacts;
    //     this.recent = recent;
    //   });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  createTask(e, publisher) {
    // this.commonService.showDialog('Tạo task trao đổi', 'Tính năng đang phát triển !', [
    // ]);

    this.commonService.openDialog(DialogFormComponent, {
      context: {
        title: 'Tạo task trao đổi với CTV',
        controls: [
          {
            name: 'Description',
            label: 'Mô tả',
            // initValue: '',
            placeholder: 'Mô tả task tro đổi với CTV',
            type: 'textarea',
          },
        ],
        actions: [
          {
            label: 'Trở về',
            icon: 'back',
            status: 'info',
            action: () => { },
          },
          {
            label: 'Tạo task',
            icon: 'generate',
            status: 'success',
            action: async (form: FormGroup) => {
              // let contact = await this.apiService.getPromise<ContactModel[]>('/contact/contacts', { searchByOutsideReference: true, eq_RefUserId: publisher.Publisher }).then(rs => rs[0]);
              // if(!contact) {
              //   contact = await this.apiService.postPromise<ContactModel[]>('/contact/contacts', { }, [{
              //     Name: publisher.Name,
              //     Name: publisher.Name,
              //   }]).then(rs => rs[0]);
              // }
              this.apiService.postPromise('/chat/rooms', { createRefCoreChatRoom: true }, [{
                Description: form.value['Description'],
                Members: [{
                  Type: 'CONTACT',
                  RefType: 'PUBLISHER',
                  RefPlatform: 'PROBOXONE',
                  Page: publisher.Page,
                  RefUserUuid: publisher.Publisher,
                  Name: publisher.Name,
                }],
              }]).then(rs => {
                // this.refresh();
                this.commonService.openMobileSidebar();
                this.mobileAppService.openChatRoom({ ChatRoom: rs[0]['Code'] });
              });

              return true;
            },
          },
        ],
        cardStyle: { width: '600px' }
      },
    });

    // this.commonService.showDialog('Tạo task trao đổi', 'Bạn có muốn tạo task trao đổi với ' + publisher.Name +' không?', [
    //   {
    //     status: 'info',
    //     label: 'Trở về'
    //   },
    //   {
    //     status: 'success',
    //     label: 'Tạo task',
    //     action: () => {

    //     },        
    //   }
    // ])
  }
}

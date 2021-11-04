import { CommonService } from './../../../../services/common.service';
import { Component, Input, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { Contacts, RecentUsers, UserData } from '../../../../@core/data/users';

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
    this.commonService.showDialog('Tạo task trao đổi', 'Tính năng đang phát triển !', [
    ]);
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

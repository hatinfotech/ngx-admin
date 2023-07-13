import { CommonService } from '../../../../services/common.service';
import { Component, Input, OnDestroy } from '@angular/core';

import { UserData } from '../../../../@core/data/users';

@Component({
  selector: 'ngx-collaborator-most-of-debt',
  styleUrls: ['./collaborator-most-of-debt.component.scss'],
  templateUrl: './collaborator-most-of-debt.component.html',
})
export class CollaboratorMostOfDebtComponent implements OnDestroy {

  private alive = true;

  @Input('customerReceivableDebt') customerList: any[];
  @Input('liabilitityDebt') supplierList: any[];

  constructor(
    private userService: UserData,
    public cms: CommonService,
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
    this.cms.showDialog('Tạo task trao đổi', 'Tính năng đang phát triển !', [
    ]);
    // this.cms.showDialog('Tạo task trao đổi', 'Bạn có muốn tạo task trao đổi với ' + publisher.Name +' không?', [
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

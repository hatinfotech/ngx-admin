import { DataManagerListComponent } from '../../lib/data-manager/data-manger-list.component';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Component, OnInit } from '@angular/core';
import { ReuseComponent } from '../../lib/reuse-component';
import { HttpErrorResponse } from '@angular/common/http';
import { MinierpService } from './minierp-service.service';
import { RootServices } from '../../services/root.services';

@Component({template: ''})
export abstract class MinierpBaseListComponent<M> extends DataManagerListComponent<M> implements OnInit, ReuseComponent {

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public miniErpService: MinierpService,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService);
  }

  ngOnInit() {
    super.ngOnInit();
    // const subscription = this.miniErpService.ready$.subscribe(ready => {
    //   if (ready) {

    //   }
    // });

    // this.subcriptions.push(this.miniErpService.activeHostingChange$.subscribe(state => {
    //   if (state.fromComponent === this.componentName) {
    //     this.refresh();
    //   } else {
    //     this.refreshPendding = true;
    //   }
    // }));
  }

  executeGet(params: any, success: (resources: M[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: M[] | HttpErrorResponse) => void) {
    // params['hosting'] = this.webHostingService.activeHosting;
    super.executeGet(params, success, error, complete);
  }

  /** Api delete funciton */
  async executeDelete(id: any, success: (resp: any) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: any | HttpErrorResponse) => void) {
    super.executeDelete({id: id,
      // 'hosting': this.webHostingService.activeHosting,
    }, success, error, complete);
  }

  /** User for reuse component */
  onResume() {
    super.onResume();
  }

  // onChangeHosting(event) {
  //   // this.webHostingService.onChangeHosting(event, this.componentName);
  // }

}

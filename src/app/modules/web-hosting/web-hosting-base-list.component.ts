import { DataManagerListComponent } from '../../lib/data-manager/data-manger-list.component';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { OnInit } from '@angular/core';
import { ReuseComponent } from '../../lib/reuse-component';
import { WebHostingService } from './web-hosting-service';
import { WhHostingModel } from '../../models/wh-hosting.model';
import { HttpErrorResponse } from '@angular/common/http';
import { WhWebsiteModel } from '../../models/wh-website.model';
import { WhDatabaseUserModel } from '../../models/wh-database-user.model';

export abstract class WebHostingBaseListComponent<M> extends DataManagerListComponent<M> implements OnInit, ReuseComponent {

  // hostingList: WhHostingModel[] = [];
  // hostingListConfig: {
  //   placeholder: 'Chọn hositng...',
  //   allowClear: false,
  //   width: '100%',
  //   dropdownAutoWidth: true,
  //   minimumInputLength: 0,
  //   keyMap: {
  //     id: 'Code',
  //     text: 'Host',
  //   },
  // };

  constructor(
    protected apiService: ApiService,
    protected router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    protected webHostingService: WebHostingService,
  ) {
    super(apiService, router, commonService, dialogService, toastService);
  }

  ngOnInit() {
    const subscription = this.webHostingService.ready$.subscribe(ready => {
      if (ready) {
        super.ngOnInit();
        // if (subscription) subscription.unsubscribe();
      }
    });

    this.subcriptions.push(this.webHostingService.activeHostingChange$.subscribe(state => {
      if (state.fromComponent === this.componentName) {
        this.refresh();
      } else {
        this.refreshPendding = true;
      }
    }));
  }

  executeGet(params: any, success: (resources: M[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: M[] | HttpErrorResponse) => void) {
    params['hosting'] = this.webHostingService.activeHosting;
    super.executeGet(params, success, error, complete);
  }

  /** User for reuse component */
  onResume() {
    super.onResume();
  }

  onChangeHosting(event) {
    this.webHostingService.onChangeHosting(event, this.componentName);
  }


  // getList(callback: (list: M[]) => void) {
  //   if (this.ivoipService.getPbxActiveDomainUuid()) {
  //     this.commonService.takeUntil('pbx_ext_get_list', 300, () => {
  //       // this.ivoipService.activeDomainUuid$.subscribe(activeDoaminUUid => {
  //       this.apiService.get<M[]>(this.apiPath, { limit: 999999999, offset: 0, domainId: this.ivoipService.getPbxActiveDomainUuid() }, results => callback(results));
  //       // });
  //     });
  //   } else {
  //     console.info('Active domain uuuid was not set');
  //   }
  // }

  // executeDelete(ids: string[], callback: (result: any) => void) {
  //   const params = {};
  //   ids.forEach((item, index) => {
  //     params['id' + index] = encodeURIComponent(item);
  //   });
  //   params['domainId'] = this.ivoipService.getPbxActiveDomainUuid();
  //   this.apiService.delete(this.apiPath, params, result => {
  //     if (callback) callback(result);
  //   });
  // }

  // onReloadBtnClick(): false {
  //   this.ivoipService.loadDomainList(domains => {
  //     this.domainList = domains;
  //     // this.activePbxDoamin = this.ivoipService.getPbxActiveDomainUuid();
  //     this.loadList();
  //   });
  //   return false;
  // }


}

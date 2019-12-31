import { DataManagerListComponent } from '../../lib/data-manager/data-manger-list.component';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { OnInit } from '@angular/core';
import { ReuseComponent } from '../../lib/reuse-component';
import { WebHostingService } from './web-hosting-service';

export abstract class WebHostingBaseListComponent<M> extends DataManagerListComponent<M> implements OnInit, ReuseComponent {

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
    super.ngOnInit();
  }

  /** User for reuse component */
  onResume() {
    super.onResume();
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

  // onChangeDomain(event: PbxDomainModel) {
  //   // console.info(event);
  //   if (event && event['id']) {
  //     // this.ivoipService.setPbxActiveDomain(event['id']);
  //     this.ivoipService.onChangeDomain(event['id']);
  //     // this.activePbxDoamin = event['id'];
  //     this.ivoipService.setPbxActiveDomain(event['id']);
  //     // this.setAc
  //     this.loadList();
  //   }
  // }
}

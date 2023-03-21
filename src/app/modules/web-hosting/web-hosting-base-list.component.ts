import { DataManagerListComponent } from '../../lib/data-manager/data-manger-list.component';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Component, OnInit } from '@angular/core';
import { ReuseComponent } from '../../lib/reuse-component';
import { WebHostingService } from './web-hosting-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({template: ''})
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
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public webHostingService: WebHostingService,
  ) {
    super(apiService, router, cms, dialogService, toastService);
  }

  ngOnInit() {
    this.webHostingService.ready$.subscribe(ready => {
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

  async init() {
    const rs = await super.init();
    // Extend action control list
    this.actionButtonList.unshift({
      type: 'select2',
      name: 'hosting',
      status: 'success',
      label: 'Hosting',
      icon: 'plus',
      title: this.cms.textTransform(this.cms.translate.instant('Common.createNew'), 'head-title'),
      size: 'medium',
      select2: { data: this.webHostingService.hostingList, option: this.webHostingService.hostingListConfig },
      value: this.webHostingService.activeHosting,
      change: (value: any, option: any) => {
        this.onChangeHosting(value);
      },
      disabled: () => {
        return false;
      },
      click: () => {
        this.gotoForm();
        return false;
      },
    });
    return rs;
  }

  executeGet(params: any, success: (resources: M[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: M[] | HttpErrorResponse) => void) {
    params['hosting'] = this.webHostingService.activeHosting;
    super.executeGet(params, success, error, complete);
  }

  /** Api delete funciton */
  async executeDelete(id: any, success: (resp: any) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: any | HttpErrorResponse) => void) {
    super.executeDelete({id: id, 'hosting': this.webHostingService.activeHosting}, success, error, complete);
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
  //     this.cms.takeUntil('pbx_ext_get_list', 300, () => {
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

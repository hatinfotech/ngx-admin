import { DataManagerListComponent } from '../../lib/data-manager/data-manger-list.component';
import { DataManagerFormComponent } from '../../lib/data-manager/data-manager-form.component';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NbDialogService, NbToastrService, NbIconLibraries } from '@nebular/theme';
import { IvoipService, PbxDomainSelection } from './ivoip-service';
import { OnInit } from '@angular/core';
import { PbxDomainModel } from '../../models/pbx-domain.model';
import { ReuseComponent } from '../../lib/reuse-component';
import { Observable } from 'rxjs';

export abstract class IvoipBaseListComponent<M> extends DataManagerListComponent<M> implements OnInit, ReuseComponent {

  domainList: PbxDomainSelection[] = [];
  select2OptionForDoaminList = this.ivoipService.getDomainListOption();
  activePbxDoamin: string;

  constructor(
    protected apiService: ApiService,
    protected router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    protected ivoipService: IvoipService,
  ) {
    super(apiService, router, commonService, dialogService, toastService);
  }

  ngOnInit() {
    this.ivoipService.loadDomainList(domains => {
      this.domainList = domains;
      // setTimeout(() => {
      this.ivoipService.onChangeDomain(this.ivoipService.getPbxActiveDomainUuid());
      // this.ivoipService.activeDomainUuid = localStorage.getItem('active_pbx_domain');
      // }, 500);
      super.ngOnInit();
    });
  }

  /** User for reuse component */
  onResume() {
    this.activePbxDoamin = this.ivoipService.getPbxActiveDomainUuid();
  }

  getList(callback: (list: M[]) => void) {
    if (this.ivoipService.getPbxActiveDomainUuid()) {
      this.commonService.takeUntil('pbx_ext_get_list', 1000, () => {
        // this.ivoipService.activeDomainUuid$.subscribe(activeDoaminUUid => {
        this.apiService.get<M[]>(this.apiPath, { limit: 999999999, offset: 0, domainId: this.ivoipService.getPbxActiveDomainUuid() }, results => callback(results));
        // });
      });
    } else {
      console.info('Active domain uuuid was not set');
    }
  }

  executeDelete(ids: string[], callback: (result: any) => void) {
    const params = {};
    ids.forEach((item, index) => {
      params['id' + index] = encodeURIComponent(item);
    });
    params['domainId'] = this.ivoipService.getPbxActiveDomainUuid();
    this.apiService.delete(this.apiPath, params, result => {
      if (callback) callback(result);
    });
  }

  onReloadBtnClick(): false {
    this.ivoipService.loadDomainList(domains => {
      this.domainList = domains;
      // this.activePbxDoamin = this.ivoipService.getPbxActiveDomainUuid();
      this.loadList();
    });
    return false;
  }

  onChangeDomain(event: PbxDomainModel) {
    // console.info(event);
    if (event && event['id']) {
      // this.ivoipService.setPbxActiveDomain(event['id']);
      this.ivoipService.onChangeDomain(event['id']);
      // this.activePbxDoamin = event['id'];
      this.ivoipService.setPbxActiveDomain(event['id']);
      // this.setAc
      this.loadList();
    }
  }
}

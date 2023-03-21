import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipService, PbxDomainSelection } from './ivoip-service';
import { Component, OnInit } from '@angular/core';
import { PbxDomainModel } from '../../models/pbx-domain.model';
import { ReuseComponent } from '../../lib/reuse-component';
import { ServerDataManagerListComponent } from '../../lib/data-manager/server-data-manger-list.component';
import { CdrModel } from '../../models/cdr.model';

@Component({template: ''})
export abstract class IvoipServerBaseListComponent<M> extends ServerDataManagerListComponent<M> implements OnInit, ReuseComponent {

  domainList: PbxDomainSelection[] = [];
  select2OptionForDoaminList = this.ivoipService.getDomainListOption();
  activePbxDoamin: string;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public ivoipService: IvoipService,
  ) {
    super(apiService, router, cms, dialogService, toastService);
  }

  ngOnInit() {
    this.ivoipService.loadDomainList(domains => {
      this.domainList = domains;
      this.ivoipService.onChangeDomain(this.ivoipService.getPbxActiveDomainUuid());
      super.ngOnInit();
    });
  }

  async init() {
    const rs = await super.init();
    // Extend action control list
    this.actionButtonList.unshift({
      type: 'select2',
      name: 'pbxdomain',
      status: 'success',
      label: 'Select pbx domain',
      icon: 'plus',
      title: this.cms.textTransform(this.cms.translate.instant('Common.createNew'), 'head-title'),
      size: 'medium',
      select2: { data: this.domainList, option: this.select2OptionForDoaminList },
      value: this.ivoipService.activeDomainUuid,
      change: (value: any, option: any) => {
        this.onChangeDomain(value);
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

  /** User for reuse component */
  onResume() {
    super.onResume();
    this.activePbxDoamin = this.ivoipService.getPbxActiveDomainUuid();
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareData
    source.prepareData = (data: CdrModel[]) => {
      return data;
    };

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['domainId'] = this.ivoipService.getPbxActiveDomainUuid();
      return params;
    };

    return source;
  }

  // loadList(callback?: (list: CdrModel[])) {
  //   // Set DataSource: prepareParams
  //   this.source.prepareParams = (params: any) => {
  //     // params['includeCategories'] = true;
  //     // params['includeUnit'] = true;
  //     return params;
  //   };
  //   super.loadList(callback);
  // }

  getList(callback: (list: M[]) => void) {
    if (this.ivoipService.getPbxActiveDomainUuid()) {
      this.cms.takeUntil('pbx_ext_get_list', 300, () => {
        // this.ivoipService.activeDomainUuid$.subscribe(activeDoaminUUid => {
        this.apiService.get<M[]>(this.apiPath, { limit: 999999999, offset: 0, domainId: this.ivoipService.getPbxActiveDomainUuid() }, results => callback(results));
        // });
      });
    } else {
      console.info('Active domain uuuid was not set');
    }
  }

  async executeDelete(ids: string[], callback: (result: any) => void) {
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

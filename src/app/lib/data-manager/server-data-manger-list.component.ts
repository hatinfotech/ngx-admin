import { OnInit } from '@angular/core';
import { ReuseComponent } from '../reuse-component';
import { DataManagerListComponent } from './data-manger-list.component';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { CustomServerDataSource } from '../custom-element/smart-table/custom-server.data-source';

export abstract class ServerDataManagerListComponent<M> extends DataManagerListComponent<M> implements OnInit, ReuseComponent {

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
  ) {
    super(apiService, router, commonService, dialogService, toastService);
    this.source = null;
  }

  getApiPath() {
    return this.apiPath;
  }

  /** List init event */
  ngOnInit() {
    super.ngOnInit();
  }

  /** Config for paging */
  protected configPaging() {
    return {
      display: true,
      perPage: 40,
    };
  }

  initDataSource() {
    return this.source = new CustomServerDataSource<M>(this.apiService, this.getApiPath());
  }

  /** Get data from api and push to list */
  loadList(callback?: (list: M[]) => void) {
    this.selectedIds = [];
    this.hasSelect = 'none';
    if (!this.source) {
      this.initDataSource();
    } else {
      this.source.refresh();
    }
  }

  onReloadBtnClick(): false {
    // this.source.reset();
    this.loadList();
    return false;
  }


  refresh() {
    // this.loadList();
    this.source.refresh();
  }

}

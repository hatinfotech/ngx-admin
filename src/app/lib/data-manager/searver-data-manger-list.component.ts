import { OnInit } from '@angular/core';
import { ReuseComponent } from '../reuse-component';
import { CustomeServerDataSource } from '../custom-element/smart-table/customer-server.data-source';
import { DataManagerListComponent } from './data-manger-list.component';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';

export abstract class ServerDataManagerListComponent<M> extends DataManagerListComponent<M> implements OnInit, ReuseComponent {

  constructor(
    protected apiService: ApiService,
    protected router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
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
    return this.source = new CustomeServerDataSource<M>(this.apiService, this.getApiPath());
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

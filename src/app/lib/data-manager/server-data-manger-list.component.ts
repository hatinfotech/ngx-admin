import { filter, take } from 'rxjs/operators';
import { Component, Injectable, OnInit } from '@angular/core';
import { ReuseComponent } from '../reuse-component';
import { DataManagerListComponent } from './data-manger-list.component';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { CustomServerDataSource } from '../custom-element/smart-table/custom-server.data-source';

export abstract class ServerDataManagerListComponent<M> extends DataManagerListComponent<M> implements OnInit, ReuseComponent {

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public ref?: NbDialogRef<ServerDataManagerListComponent<M>>,
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
    this.commonService.activeRoute.params.subscribe(params => {
      // if (params['id']) callback(decodeURIComponent(params['id']).split('&')); else callback();
      console.log(params);
    });
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


  async refresh() {
    // this.loadList();
    this.source.refresh();
    setTimeout(() => {
      this.syncSelectedStatus();
    }, 1000);
  }

  async refreshPromise() {
    this.refresh();
    return (this.source as CustomServerDataSource<M>).state$.pipe(filter(f => f === 'NORMAL'), take(1)).toPromise();
  }

}

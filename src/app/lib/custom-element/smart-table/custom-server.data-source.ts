import { CommonService } from './../../../services/common.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CustomServerDataSource<M> extends LocalDataSource {

  lastRequestCount: number = 0;
  prepareData: (data: M[] | any) => any[] = (data) => data;
  prepareParams: (params: any, filter?: any, sort?: any, paging?: any) => any;

  initFilterConf: any;
  initSortConfig: any;
  initPagingConf: any;
  initWithUserConfig = false;
  isLocalUpdate = false;
  state$ = new BehaviorSubject<string>('INIT');

  constructor(protected apiService: ApiService, protected commonService: CommonService, protected url: string, filterConf?: any, sortConf?: any, pagingConf?: any) {
    super();
    if (filterConf && filterConf.length > 0) {
      filterConf.init = true;
      // this.setFilter(filterConf);
      this.initFilterConf = filterConf;
      this.initSortConfig = sortConf;
      this.pagingConf = pagingConf;
      if (filterConf || sortConf || pagingConf) {
        this, this.initFilterConf = true;
      }
      // this.filterConf.filters = filterConf;
    }
  }

  setUrl(url: string) {
    this.url = url;
  }

  count(): number {
    return this.lastRequestCount;
  }

  getElements(): Promise<any> {
    this.state$.next('GETELEMENT');
    if (this.isLocalUpdate) {
      // this.isLocalUpdate = false;
      this.state$.next('NORMAL');
      return super.getElements();
    }
    if (this.initWithUserConfig) {
      setTimeout(() => {
        this.setFilter(this.initFilterConf);
        this.initWithUserConfig = false;
      }, 500);
      this.state$.next('NORMAL');
      return new Promise<M>(resolve2 => { resolve2([] as any); });
    }
    let params = {};
    if (this.prepareParams) {
      params = this.prepareParams(params, this.filterConf, this.sortConf, this.pagingConf);
    }
    if (this.sortConf.length > 0) {
      // Clear init sort params
      // tslint:disable-next-line: prefer-const
      for (let p in params) {
        if (/^sort_.*/.test(p)) {
          delete params[p];
        }
      }
      this.sortConf.forEach((fieldConf) => {
        params[`sort_${fieldConf.field}`] = fieldConf.direction.toLowerCase();
      });
    }

    if (this.pagingConf && this.pagingConf['page'] && this.pagingConf['perPage']) {
      params['offset'] = (this.pagingConf['page'] - 1) * this.pagingConf['perPage'];
      params['limit'] = this.pagingConf['perPage'];
    }

    if (this.filterConf.filters) {
      // this.filterConf.filters.forEach((fieldConf) => {
      for (const fieldConf of this.filterConf.filters) {
        if (fieldConf['search']) {
          // params[`filter_${fieldConf['field']}`] = fieldConf['search'];
          if (typeof fieldConf['search'] === 'object') {
            if (fieldConf['search']['searchType'] === 'range') {
              if (fieldConf['search']['dataType'] === 'date') {
                if (!(fieldConf['search']['range'][0] instanceof Date)) {
                  throw new Error('Search from not instance of date');
                }
                if (!(fieldConf['search']['range'][1] instanceof Date)) {
                  throw new Error('Search to not instance of date');
                }
              }
              params[`ge_${fieldConf['field']}`] = this.encodeFilterQuery(this.commonService.getBeginOfDate(fieldConf['search']['range'][0]).toISOString());
              params[`le_${fieldConf['field']}`] = this.encodeFilterQuery(this.commonService.getEndOfDate(fieldConf['search']['range'][1]).toISOString());
            } else {
              params[`filter_${fieldConf['search']['condition']}`] = this.encodeFilterQuery(fieldConf['search']['value']);
            }
          } else {
            if (fieldConf['search'] !== null) {
              params[`filter_${fieldConf['field']}`] = this.encodeFilterQuery(fieldConf['search']);
            }

          }
        }
      }
    }

    return this.apiService.getObservable<M[]>(this.url, params).pipe(
      map((res) => {
        this.lastRequestCount = +res.headers.get('x-total-count');
        let data = res.body;
        // Auto add no
        data = data.map((item: M, index: number) => {
          const paging = this.getPaging();
          item['No'] = (paging.page - 1) * paging.perPage + index + 1;
          return item;
        });
        this.data = data = (this.prepareData ? this.prepareData(data) : data);
        return data;
      }),
    ).toPromise().then(rs => {
      this.state$.next('NORMAL');
      return rs;
    });

  }

  encodeFilterQuery(query: { instance: any, value: any } | any) {
    if (typeof query === 'object' && query?.instance) {
      return query.instance.encodeFilterQuery(query.value);
    } else {
      return query;
    }
  }

}

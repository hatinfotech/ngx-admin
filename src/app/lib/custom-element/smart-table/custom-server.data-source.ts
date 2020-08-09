import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';
import { LocalDataSource } from 'ng2-smart-table';

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

  constructor(protected apiService: ApiService, protected url: string, filterConf?: any, sortConf?: any, pagingConf?: any) {
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

  count(): number {
    return this.lastRequestCount;
  }

  getElements(): Promise<any> {
    if (this.isLocalUpdate) {
      // this.isLocalUpdate = false;
      return super.getElements();
    }
    if (this.initWithUserConfig) {
      setTimeout(() => {
        this.setFilter(this.initFilterConf);
        this.initWithUserConfig = false;
      }, 500);
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
      this.filterConf.filters.forEach((fieldConf) => {
        if (fieldConf['search']) {
          // params[`filter_${fieldConf['field']}`] = fieldConf['search'];
          params[`filter_${fieldConf['field']}`] = this.encodeFilterQuery(fieldConf['search']);
        }
      });
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
    ).toPromise();

  }

  encodeFilterQuery(query: { instance: any, value: any }) {
    if (typeof query === 'object' && query.instance) {
      return query.instance.encodeFilterQuery(query.value);
    } else {
      return query;
    }
  }

}

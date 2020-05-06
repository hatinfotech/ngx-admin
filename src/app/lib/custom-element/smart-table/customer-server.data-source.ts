import { Injectable } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class CustomeServerDataSource<M> extends LocalDataSource {

  lastRequestCount: number = 0;
  prepareData: (data: M[] | any) => any[];
  prepareParams: (params: any) => any;

  constructor(protected apiService: ApiService, protected url: string) {
    super();
  }

  count(): number {
    return this.lastRequestCount;
  }

  getElements(): Promise<any> {
    let params = {};
    if (this.sortConf) {
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
          params[`filter_${fieldConf['field']}`] = fieldConf['search'];
        }
      });
    }

    if (this.prepareParams) {
      params = this.prepareParams(params);
    }

    return this.apiService.getObservable<M>(this.url, params).pipe(
      map((res) => {
        this.lastRequestCount = +res.headers.get('x-total-count');
        return this.prepareData ? this.prepareData(res.body) : res.body;
      }),
    ).toPromise();

  }

}

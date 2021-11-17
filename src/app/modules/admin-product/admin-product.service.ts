import { take, filter } from 'rxjs/operators';
import { NbAuthService } from '@nebular/auth';
import { ApiService } from './../../services/api.service';
import { UnitModel } from './../../models/unit.model';
import { BehaviorSubject } from 'rxjs';
import { ProductGroupModel, ProductCategoryModel, ProductUnitModel } from './../../models/product.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {

  groupList$ = new BehaviorSubject<ProductGroupModel[]>(null);
  categoryList$ = new BehaviorSubject<ProductCategoryModel[]>(null);
  unitList$ = new BehaviorSubject<ProductUnitModel[]>(null);

  constructor(
    public authService: NbAuthService,
    public apiService: ApiService,
  ) {
    this.authService.isAuthenticated().pipe(filter(f => f === true), take(1)).toPromise().then(status => {
      this.updateUnitList();
      this.updateCategoryList();
      this.updateGroupList();
    });
  }

  async updateUnitList() {
    return this.apiService.getPromise<ProductUnitModel[]>('/admin-product/units', { onlyIdText: true, limit: 'nolimit' }).then(rs => {
      this.unitList$.next(rs);
      return rs;
    });
  }

  async updateCategoryList() {
    return this.apiService.getPromise<ProductCategoryModel[]>('/admin-product/categories', { limit: 'nolimit', onlyIdText: true }).then(rs => {
      this.categoryList$.next(rs);
      return rs;
    });
  }

  async updateGroupList() {
    return this.apiService.getPromise<ProductGroupModel[]>('/admin-product/groups', { limit: 'nolimit', onlyIdText: true }).then(rs => {
      this.groupList$.next(rs);
      return rs;
    });
  }
}

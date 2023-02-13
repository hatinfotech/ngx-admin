import { take, filter } from 'rxjs/operators';
import { NbAuthService } from '@nebular/auth';
import { ApiService } from './../../services/api.service';
import { UnitModel } from './../../models/unit.model';
import { BehaviorSubject } from 'rxjs';
import { ProductGroupModel, ProductCategoryModel, ProductUnitModel, ProductPropertyModel, ProductPropertyValueModel, ProductBrandModel, ProductTagModel } from './../../models/product.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {

  groupList$ = new BehaviorSubject<ProductGroupModel[]>(null);
  categoryList$ = new BehaviorSubject<ProductCategoryModel[]>(null);
  unitList$ = new BehaviorSubject<ProductUnitModel[]>(null);
  propertyList$ = new BehaviorSubject<ProductPropertyModel[]>(null);
  propertyValueList$ = new BehaviorSubject<ProductPropertyValueModel[]>(null);
  brandList$ = new BehaviorSubject<ProductBrandModel[]>(null);
  tagList$ = new BehaviorSubject<ProductTagModel[]>(null);

  constructor(
    public authService: NbAuthService,
    public apiService: ApiService,
  ) {
    this.authService.isAuthenticated().pipe(filter(f => f === true), take(1)).toPromise().then(status => {
      this.updateAllCache();
    });
  }

  async updateAllCache() {
    return Promise.all([
      this.updateUnitList(),
      this.updateCategoryList(),
      this.updateGroupList(),
      this.updatePropertyList(),
      this.updatePropertyValueList(),
      this.updateBrandList(),
      this.updateTagList(),
    ]);
  }


  async updateUnitList() {
    return this.apiService.getPromise<ProductUnitModel[]>('/admin-product/units', { onlyIdText: true, limit: 'nolimit' }).then(rs => {
      this.unitList$.next(rs);
      return rs;
    });
  }

  async updatePropertyList() {
    return this.apiService.getPromise<ProductUnitModel[]>('/admin-product/properties', { includeIdText: true, limit: 'nolimit' }).then(rs => {
      this.propertyList$.next(rs);
      return rs;
    });
  }

  async updatePropertyValueList() {
    return this.apiService.getPromise<ProductUnitModel[]>('/admin-product/property-values', { onlyIdText: true, limit: 'nolimit' }).then(rs => {
      this.propertyValueList$.next(rs);
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
  async updateBrandList() {
    return this.apiService.getPromise<ProductBrandModel[]>('/admin-product/brands', { limit: 'nolimit', onlyIdText: true }).then(rs => {
      this.brandList$.next(rs);
      return rs;
    });
  }
  async updateTagList() {
    return this.apiService.getPromise<ProductBrandModel[]>('/admin-product/tags', { limit: 'nolimit', onlyIdText: true }).then(rs => {
      this.tagList$.next(rs);
      return rs;
    });
  }
}

import { take, filter } from 'rxjs/operators';
import { NbAuthService } from '@nebular/auth';
import { ApiService } from './../../services/api.service';
import { BehaviorSubject } from 'rxjs';
import { ProductGroupModel, ProductCategoryModel, ProductUnitModel, ProductPropertyModel, ProductPropertyValueModel, ProductBrandModel, ProductKeywordModel } from './../../models/product.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {

  groupList$ = new BehaviorSubject<ProductGroupModel[]>(null);
  categoryList$ = new BehaviorSubject<ProductCategoryModel[]>(null);
  unitList$ = new BehaviorSubject<ProductUnitModel[]>(null);
  unitMap$ = new BehaviorSubject<{ [key: string]: ProductUnitModel }>(null);
  propertyList$ = new BehaviorSubject<ProductPropertyModel[]>(null);
  propertyValueList$ = new BehaviorSubject<ProductPropertyValueModel[]>(null);
  brandList$ = new BehaviorSubject<ProductBrandModel[]>(null);
  keywordList$ = new BehaviorSubject<ProductKeywordModel[]>(null);

  constructor(
    public authService: NbAuthService,
    public apiService: ApiService,
  ) {
    this.authService.isAuthenticated().pipe(filter(f => f === true), take(1)).toPromise().then(status => {
      this.updateAllCache();
    });
  }

  async updateAllCache() {
    // return Promise.all([
    //   this.updateUnitList(),
    //   this.updateCategoryList(),
    //   this.updateGroupList(),
    //   this.updatePropertyList(),
    //   this.updatePropertyValueList(),
    //   this.updateBrandList(),
    //   this.updateKeywordList(),
    // ]);
    return this.apiService.postPromise<any[]>('/utility/multi-resources', { onlyIdText: true, limit: 'nolimit' }, [
      {
        path: 'admin-product/units',
        params: {}
      },
      {
        path: 'admin-product/properties',
        params: {}
      },
      {
        path: 'admin-product/property-values',
        params: {}
      },
      {
        path: 'admin-product/categories',
        params: {}
      },
      {
        path: 'admin-product/groups',
        params: {}
      },
      {
        path: 'admin-product/brands',
        params: {}
      },
      {
        path: 'admin-product/keywords',
        params: {}
      },
    ]).then(rs => {
      console.log(rs);

      // Update unit list & map
      this.unitList$.next(rs[0]);
      this.updateUnitMap(rs[0]);

      // Update attribuite list
      this.propertyList$.next(rs[1]);

      // Update attribuite value list
      this.propertyValueList$.next(rs[2]);

      // Update category list
      this.categoryList$.next(rs[3]);

      // Update group list
      this.groupList$.next(rs[4]);

      // Update brand list
      this.brandList$.next(rs[5]);

      // Update keyboard list
      this.keywordList$.next(rs[6]);
      return rs;
    });
  }


  async updateUnitList() {
    return this.apiService.getPromise<ProductUnitModel[]>('/admin-product/units', { onlyIdText: true, limit: 'nolimit' }).then(rs => {
      this.unitList$.next(rs);
      this.updateUnitMap(rs);
      return rs;
    });
  }

  updateUnitMap(unitList: ProductUnitModel[]) {
    const unitMap = {};
    for (const unit of unitList) {
      unitMap[unit.Code] = unit;
    }
    this.unitMap$.next(unitMap);
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
  async updateKeywordList() {
    return this.apiService.getPromise<ProductBrandModel[]>('/admin-product/keywords', { limit: 'nolimit', onlyIdText: true }).then(rs => {
      this.keywordList$.next(rs);
      return rs;
    });
  }
}

import { take, filter } from 'rxjs/operators';
import { NbAuthService } from '@nebular/auth';
import { ApiService } from './../../services/api.service';
import { BehaviorSubject } from 'rxjs';
import { ProductGroupModel, ProductCategoryModel, ProductUnitModel, ProductPropertyModel, ProductPropertyValueModel, ProductBrandModel, ProductKeywordModel, ProductSearchIndexModel, ProductModel } from './../../models/product.model';
import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CommonService } from '../../services/common.service';
import { _ } from 'ag-grid-community';
import { WarehouseGoodsContainerModel } from '../../models/warehouse.model';
import { UnitModel } from '../../models/unit.model';

@Injectable({
  providedIn: 'root',
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
  containerList$ = new BehaviorSubject<WarehouseGoodsContainerModel[]>(null);


  updateCacheProcessing = null;
  constructor(
    public authService: NbAuthService,
    public apiService: ApiService,
    public cms: CommonService,
  ) {
    this.authService.isAuthenticated().pipe(filter(f => f === true), take(1)).toPromise().then(async status => {
      this.updateAllCache();
    });
    this.authService.isAuthenticated().subscribe(async status => {
      if (!status) {
        clearInterval(this.updateCacheProcessing);
        return;
      }
      const loginId = await this.cms.loginInfo$.pipe(filter(f => !!f), take(1)).toPromise().then(loginInfo => loginInfo?.user?.Code);
      this.apiService.getPromise<any>('/admin-product/product-search-indexs', { cacheCheckPonit: true }).then(rs => rs.data).then(serverProductSearchIndexCheckPoint => {
        console.log(serverProductSearchIndexCheckPoint);
        localStorage.setItem(loginId + '_ADMIN_PRODUCT_SEARCH_INDEX_CACHE_CHECK_POINT', serverProductSearchIndexCheckPoint);
      });
      while (true) {
        try {
          await this.updateGoodsInfo();
          break;
        } catch (err) {
          console.error(err);
          this.cms.showToast('Chưa thể tải thông tin sản phẩm, thử lại trong 3s', 'Tải thông tin sản phẩm thất bại', { status: 'danger' });
          await new Promise(resolve => setTimeout(() => resolve(true), 3000));
        }
      }

      if (!this.updateCacheProcessing) {
        this.updateCacheProcessing = setInterval(() => {
          console.log('Listen new master price table update...');
          this.apiService.getPromise<any>('/admin-product/product-search-indexs', { cacheCheckPonit: true }).then(rs => rs.data).then(serverProductSearchIndexCheckPoint => {
            console.log(serverProductSearchIndexCheckPoint);
            const productSearchCacheCheckPoint = localStorage.getItem(loginId + '_ADMIN_PRODUCT_SEARCH_INDEX_CACHE_CHECK_POINT');
            if (serverProductSearchIndexCheckPoint && serverProductSearchIndexCheckPoint != productSearchCacheCheckPoint) {
              this.cms.showToast('Có bảng giá mới, vui lòng chờ trong giây lát !', 'Có bảng giá mới !', { ...this.toastDefaultConfig, status: 'primary' });
              return this.updateGoodsInfo().then(status => {
                this.cms.showToast('Hệ thống đã cập nhật bảng giá mới, mời bạn tiếp tục bán hàng !', 'Đã cập nhật bảng giá mới !', { ...this.toastDefaultConfig, status: 'success' });
                localStorage.setItem(loginId + '_ADMIN_PRODUCT_SEARCH_INDEX_CACHE_CHECK_POINT', serverProductSearchIndexCheckPoint);
                return status;
              });
            }
            return false;
          }).catch(err => {
            console.log(err);
          });
        }, 20000);
      }
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
      {
        path: 'warehouse/goods-containers',
        params: { includePath: true, includeIdText: true }
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

      // Update container list
      this.containerList$.next(rs[7].map(container => ({ ...container, text: `${container.FindOrder} - ${container.Path}` })));
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

  // this.containerList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includePath: true, includeIdText: true, limit: 'nolimit' })).map(container => ({ ...container, text: `${container.FindOrder} - ${container.Path}` })) as any;
  async updateContainerList() {
    return this.apiService.getPromise<ProductGroupModel[]>('/warehouse/goods-containers', { includePath: true, includeIdText: true, limit: 'nolimit' }).then(rs => {
      this.containerList$.next(rs.map(container => ({ ...container, text: `${container.FindOrder} - ${container.Path}` })));
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

  /** Load product search index */
  productSearchIndexsGroupByIdUnitAndContainer: ProductModel[] = [];
  productSearchIndexsGroupByIdAndUnit: ProductModel[] = [];
  productSearchIndexsGroupById: ProductModel[] = [];
  productMap: any = {};
  unitMap: any = {};
  productUnitMap: any = {};
  findOrderMap: any = {};
  status: string;
  progressStatus: string;
  progress: number;
  progressLabel: string;
  updateGoodsInfoProcessing = false;
  skuBaseUnitMap: any = {};
  toastDefaultConfig = {};
  async updateGoodsInfo() {
    await this.cms.waitFor(300, 1000, async () => !!this.cms?.currencyPipe?.transform);
    this.status = 'Đang tải bảng giá...';
    if (this.updateGoodsInfoProcessing) {
      console.warn('Other processing in progress...');
      return false;
    }
    this.updateGoodsInfoProcessing = true;
    // while (true) {
    try {
      // Get goods list
      this.productSearchIndexsGroupByIdUnitAndContainer = [];
      this.productMap = {};
      this.unitMap = {};
      this.findOrderMap = {};
      let offset = 0;
      this.progressStatus = 'danger';
      this.progress = 0;
      // while (true) {
      this.progressStatus = 'success';
      this.progress = 0;
      this.progressLabel = 'Đang tải thông tin sản phẩm...';
      const rs = await this.apiService.getProgress<ProductSearchIndexModel[]>('/admin-product/product-search-indexs', { fromCache: true }, (loaded, total) => {
        // this.progress = parseInt(loaded / total * 100 as any);
        // this.progressLabel = 'Đang tải thông tin sản phẩm...' + this.progress + '%';
      }).then(rs => {
        // this.progress = 0;

        const productSearchIndexsGroupByIdUnitAndContainer: ProductModel[] = [];
        const productSearchIndexsGroupByIdAndUnit: ProductModel[] = [];
        const productSearchIndexsGroupById: ProductModel[] = [];
        for (const productSearchIndex of rs) {
          // const price = this.masterPriceTable[`${productSearchIndex.Code}-${this.cms.getObjectId(productSearchIndex.Unit)}`]?.Price || null;
          productSearchIndex['WarehouseUnit'] = { id: productSearchIndex.BaseUnit, text: productSearchIndex.BaseUnitLabel };
          let goods = productSearchIndex;
          goods['id'] = `${productSearchIndex.Code}-${productSearchIndex.Unit}-${productSearchIndex.Container}`;
          goods['text'] = productSearchIndex.Name + ' (' + productSearchIndex.UnitLabel + ')';
          goods['Sku'] = productSearchIndex.Sku?.toUpperCase();
          goods['Container'] = {
            id: productSearchIndex.Container,
            text: `[${productSearchIndex.ContainerFindOrder}] ${productSearchIndex.WarehouseName} » ${productSearchIndex.ContainerShelfName} » ${productSearchIndex.ContainerName}`,
            Name: productSearchIndex.ContainerName,
            FindOrder: productSearchIndex.ContainerFindOrder,
            Shelf: productSearchIndex.ContainerShelf,
            ShelfName: productSearchIndex.ContainerShelfName,
            Warehouse: productSearchIndex.Warehouse,
            WarehouseName: productSearchIndex.WarehouseName,
          };
          goods['BaseUnit'] = { id: productSearchIndex.BaseUnit, text: productSearchIndex.BaseUnitLabel };
          goods['Unit'] = {
            id: productSearchIndex.Unit, text: productSearchIndex.UnitLabel,
            Sequence: productSearchIndex.UnitSeq,
            IsExpirationGoods: !!parseInt(productSearchIndex.IsExpirationGoods),
            IsAutoAdjustInventory: !!parseInt(productSearchIndex.IsAutoAdjustInventory),
            IsManageByAccessNumber: !!parseInt(productSearchIndex.IsManageByAccessNumber),
            IsDefaultSales: !!parseInt(productSearchIndex.IsDefaultSales),
            IsDefaultPurchase: !!parseInt(productSearchIndex.IsDefaultPurchase),
            ConversionRatio: !!parseInt(productSearchIndex.ConversionRatio as any),
            UnitNo: parseInt(productSearchIndex.UnitNo),
            Price: productSearchIndex.Price,
          };
          goods['Units'] = [];
          goods['Price'] = productSearchIndex.Price;
          goods['PriceOfBaseUnitText'] = productSearchIndex.Price && productSearchIndex.BaseUnit != productSearchIndex.Unit && (' (' + (this.cms.currencyPipe.transform(productSearchIndex.Price / productSearchIndex.ConversionRatio, 'VND') + '/' + productSearchIndex.BaseUnitLabel) + ')') || '';
          goods['Inventory'] = null;
          goods['Keyword'] = (productSearchIndex.Sku + ' ' + productSearchIndex.Name + ' (' + productSearchIndex.UnitLabel + ')').toLowerCase();

          productSearchIndexsGroupByIdUnitAndContainer.push(goods);
          // this.productSearchIndex[`${productSearchIndex.Code}-${productSearchIndex.Unit}-${productSearchIndex.Container}`] = productSearchIndex;

          if (!this.productMap[productSearchIndex.Code]) {
            this.productMap[productSearchIndex.Code] = goods;
            productSearchIndexsGroupById.push(goods);
          }
          if (!this.productUnitMap[productSearchIndex.Code + '-' + productSearchIndex.Unit]) {
            this.productUnitMap[productSearchIndex.Code + '-' + productSearchIndex.Unit] = goods;
            productSearchIndexsGroupByIdAndUnit.push(goods);
          }

          // Add unit to unit list
          if (this.productMap[productSearchIndex.Code]) {
            if (!this.productMap[productSearchIndex.Code].Units) {
              this.productMap[productSearchIndex.Code].Units = [];
            }

            let unit: Partial<ProductUnitModel> = this.productMap[productSearchIndex.Code].Units.find(f => f.id == this.cms.getObjectId(goods.Unit));
            if (!unit) {
              unit = goods.Unit;
              this.productMap[productSearchIndex.Code].Units.push(unit);
            }
            if (unit) {

              // add container to list
              if (productSearchIndex.Container) {
                if (!unit.Containers) {
                  unit.Containers = [];
                }
                if (unit.Containers.findIndex(f => this.cms.getObjectId(f) == this.cms.getObjectId(productSearchIndex.Container)) < 0) {
                  unit.Containers.push(productSearchIndex.Container);
                }
              }

            }

          }

          if (!this.unitMap[productSearchIndex.UnitSeq]) {
            this.unitMap[productSearchIndex.UnitSeq] = { id: productSearchIndex.Unit, text: productSearchIndex.UnitLabel, Sequence: productSearchIndex.UnitSeq };
          }
          if (!this.findOrderMap[productSearchIndex.ContainerFindOrder]) {
            this.findOrderMap[productSearchIndex.ContainerFindOrder] = goods;
          }
          if (productSearchIndex.BaseUnit == productSearchIndex.Unit) {
            if (!this.skuBaseUnitMap[(productSearchIndex.Sku || '').toUpperCase()]) {
              this.skuBaseUnitMap[(productSearchIndex.Sku || '').toUpperCase()] = goods;
            }
          }
        }

        this.productSearchIndexsGroupByIdUnitAndContainer = productSearchIndexsGroupByIdUnitAndContainer;
        this.productSearchIndexsGroupByIdAndUnit = productSearchIndexsGroupByIdAndUnit;
        this.productSearchIndexsGroupById = productSearchIndexsGroupById;

        // offset += 100;
        return rs;
      });
      this.progress = 0;
      this.updateGoodsInfoProcessing = false;
      return true;
    } catch (err) {
      this.updateGoodsInfoProcessing = false;
      this.progress = 0;
      console.error(err);
      console.log('retry...');
      this.status = 'Lỗi tải bảng giá, đang thử lại...';
      this.cms.showToast('Bảng giá mới chưa được cập nhật, refersh trình duyệt để tải lại', 'Cập nhật bảng giá không thành công !', { ...this.toastDefaultConfig, status: 'danger' });
      return false;
    }
    // }
  }
  /** End Load product search index */
}

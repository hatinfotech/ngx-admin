import { ProductListComponent } from './../../../admin-product/product/product-list/product-list.component';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { SmartTableButtonComponent, SmartTableCurrencyEditableComponent, SmartTableThumbnailComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { AccBankModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { WordpressProductFormComponent } from '../product-form/product-form.component';
import { FormGroup } from '@angular/forms';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { ProductModel } from '../../../../models/product.model';
import { ImagesViewerComponent } from '../../../../lib/custom-element/my-components/images-viewer/images-viewer.component';

@Component({
  selector: 'ngx-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class WordpressProductListComponent extends ServerDataManagerListComponent<AccBankModel> implements OnInit {

  componentName: string = 'WordpressProductListComponent';
  formPath = '';
  apiPath = '/wordpress/products';
  idKey = 'Id';
  formDialog = WordpressProductFormComponent;

  reuseDialog = true;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };
  _workingSite: any;
  set workingSite(value) {
    if (!value) {
      localStorage.setItem('wordpress_workingsite', null);
    } else {
      localStorage.setItem('wordpress_workingsite', JSON.stringify({ 'id': this.cms.getObjectId(value), 'text': this.cms.getObjectText(value) }));
    }
    this._workingSite = value;
  }
  get workingSite() {
    if (!this._workingSite || !this._workingSite.id) {
      this._workingSite = localStorage.getItem('wordpress_workingsite');
      if (typeof this._workingSite === 'string') {
        this._workingSite = JSON.parse(this._workingSite);
      } else {
        this._workingSite = null;
      }
    }
    return this._workingSite;
  }
  refCategoryList = [];

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<WordpressProductListComponent>,
  ) {
    super(apiService, router, cms, dialogService, toastService, ref);
  }

  siteList: [];

  // productListDialog: NbDialogRef<ProductListComponent> = null;

  async init() {
    // await this.loadCache();
    return super.init().then(async rs => {

      this.siteList = await this.apiService.getPromise('/wordpress/wp-sites', { includeIdText: true });

      this.actionButtonList.unshift({
        name: 'importProducts',
        status: 'primary',
        label: this.cms.textTransform(this.cms.translate.instant('Import'), 'head-title'),
        icon: 'download-outline',
        title: this.cms.textTransform(this.cms.translate.instant('Import'), 'head-title'),
        size: 'medium',
        disabled: () => !this.workingSite,
        hidden: () => false,
        click: () => {
          // if (!this.productListDialog) {
          this.cms.openDialog(ProductListComponent, {
            context: {
              // showLoadinng: true,
              inputMode: 'dialog',
              pagingConfig: { display: true, perPage: 100 },
              reuseDialog: true,
              onDialogClose: () => {
                // if (onDialogClose) onDialogClose();
                // this.refresh();
              },
              onDialogChoose: async (chooseItems) => {
                console.log(chooseItems);

                if (!this.cms.getObjectId(this.workingSite)) {
                  this.cms.showToast('Bạn phải chọn site làm việc trước khi thêm sản phẩm !', 'Chưa chọn site làm việc', { status: 'danger' })
                  return;
                }

                const unitType = await new Promise<string>((resolve) => {
                  this.cms.showDialog('Import theo đơn vị tính', 'Bạn muốn import tất cả đvt hay chỉ đơn vị tính cơ bản hoặc đvt đầu tiên ?', [
                    {
                      label: 'Trở về',
                      status: 'basic',
                      action: () => {
                        resolve(null);
                      }
                    },
                    {
                      label: 'Tất cả',
                      status: 'danger',
                      action: () => {
                        resolve('all');
                      }
                    },
                    {
                      label: 'ĐVT Cơ bản',
                      status: 'info',
                      action: () => {
                        resolve('base');
                      }
                    },
                    {
                      label: 'ĐVT đầu tiên',
                      status: 'primary',
                      action: () => {
                        resolve('first');
                      }
                    },
                  ], () => {
                    resolve(null);
                  });
                });

                if (!unitType) {
                  return;
                }

                const siteProducts = [];
                const checkDupplicate = {};
                for (const product of chooseItems) {
                  product.UnitConversions = product.UnitConversions || product.Units;

                  if (unitType === 'first') {

                    const item = {
                      Site: this.cms.getObjectId(this.workingSite),
                      SiteName: this.cms.getObjectText(this.workingSite),
                      Product: product.Code,
                      Name: product.Name,
                      Sku: product.Sku,
                      FeaturePicture: product.FeaturePicture,
                      Pictures: product.Pictures,
                      Unit: this.cms.getObjectId(product.UnitConversions[0]),
                      UnitName: this.cms.getObjectText(product.UnitConversions[0]),
                    };
                    if (!checkDupplicate[`${item.Site}-${item.Product}-${item.Unit}`]) {
                      siteProducts.push(item);
                      checkDupplicate[`${item.Site}-${item.Product}-${item.Unit}`] = true;
                    }

                  } else if (unitType === 'base') {

                    const item = {
                      Site: this.cms.getObjectId(this.workingSite),
                      SiteName: this.cms.getObjectText(this.workingSite),
                      Product: product.Code,
                      Name: product.Name,
                      Sku: product.Sku,
                      FeaturePicture: product.FeaturePicture,
                      Pictures: product.Pictures,
                      Unit: this.cms.getObjectId(product.WarehouseUnit),
                      UnitName: this.cms.getObjectText(product.WarehouseUnit),
                    };
                    if (!checkDupplicate[`${item.Site}-${item.Product}-${item.Unit}`]) {
                      siteProducts.push(item);
                      checkDupplicate[`${item.Site}-${item.Product}-${item.Unit}`] = true;
                    }

                  } else {

                    for (const unit of product.UnitConversions) {
                      const item = {
                        Site: this.cms.getObjectId(this.workingSite),
                        SiteName: this.cms.getObjectText(this.workingSite),
                        Product: product.Code,
                        Name: product.Name,
                        Sku: product.Sku,
                        FeaturePicture: product.FeaturePicture,
                        Pictures: product.Pictures,
                        Unit: this.cms.getObjectId(unit),
                        UnitName: this.cms.getObjectText(unit),
                      };
                      if (!checkDupplicate[`${item.Site}-${item.Product}-${item.Unit}`]) {
                        siteProducts.push(item);
                        checkDupplicate[`${item.Site}-${item.Product}-${item.Unit}`] = true;
                      }
                    }

                  }
                }

                await this.apiService.putPromise<any[]>('/wordpress/products', { skipError: true }, siteProducts);
                this.refresh();

              },
            },
            closeOnEsc: false,
            closeOnBackdropClick: false,
          });
          // } else {
          //   this.productListDialog['show']();
          // }
          return false;
        },
      });

      this.actionButtonList.unshift({
        name: 'assignRefCategories',
        status: 'info',
        label: 'Gán/Gở danh mục',
        icon: 'layout-outline',
        title: 'Gán/Gở danh mục',
        size: 'medium',
        disabled: () => this.selectedIds.length === 0,
        hidden: () => false,
        click: () => {
          this.cms.openDialog(DialogFormComponent, {
            context: {
              cardStyle: { width: '500px' },
              title: 'Gán/Gở danh mục',
              onInit: async (form, dialog) => {
                return true;
              },
              onClose: async (form, dialog) => {
                // ev.target.
                return true;
              },
              controls: [
                {
                  name: 'Categories',
                  label: 'Danh mục',
                  placeholder: 'Chọn danh mục...',
                  type: 'select2',
                  // initValue: this.sheets[0],
                  // focus: true,
                  option: {
                    data: this.refCategoryList,
                    placeholder: 'Chọn danh mục...',
                    allowClear: true,
                    width: '100%',
                    dropdownAutoWidth: true,
                    minimumInputLength: 0,
                    withThumbnail: false,
                    keyMap: {
                      id: 'id',
                      text: 'text',
                    },
                    multiple: true,
                  }
                },
              ],
              actions: [
                {
                  label: 'Esc - Trở về',
                  icon: 'back',
                  status: 'basic',
                  keyShortcut: 'Escape',
                  action: async () => { return true; },
                },
                {
                  label: 'Gán',
                  icon: 'generate',
                  status: 'primary',
                  // keyShortcut: 'Enter',
                  action: async (form: FormGroup, formDialogConpoent: DialogFormComponent) => {

                    const categories = form.get('Categories').value;

                    if (categories) {
                      await this.apiService.putPromise<any[]>('/wordpress/products', { id: this.selectedIds }, this.selectedItems.map(m => ({
                        Id: m.Id,
                        RefCategories: categories.map(m => ({ id: m.id, text: m.text })),
                      })));
                      this.refresh();
                    }


                    return true;
                  },
                },
                {
                  label: 'Gở',
                  icon: 'generate',
                  status: 'danger',
                  // keyShortcut: 'Enter',
                  action: async (form: FormGroup, formDialogConpoent: DialogFormComponent) => {

                    const categories = form.get('Categories').value;

                    if (categories) {
                      await this.apiService.putPromise<any[]>('/wordpress/products', { id: this.selectedIds }, this.selectedItems.map(m => ({
                        Id: m.Id,
                        RefCategories: (m.RefCategories || []).filter(f => categories.some(s => this.cms.getObjectId(s) != this.cms.getObjectId(f))),
                      })));
                      this.refresh();
                    }

                    return true;
                  },
                },
              ],
            },
            closeOnEsc: false,
            closeOnBackdropClick: false,
          });
          return false;
        },
      });

      this.actionButtonList.unshift({
        name: 'assignPrice',
        status: 'info',
        label: 'Gán giá',
        icon: 'pricetags-outline',
        title: 'Gán giá',
        size: 'medium',
        disabled: () => !this.workingSite,
        hidden: () => false,
        click: () => {
          this.cms.openDialog(DialogFormComponent, {
            context: {
              cardStyle: { width: '500px' },
              title: 'Gán giá từ bảng giá',
              onInit: async (form, dialog) => {
                return true;
              },
              onClose: async (form, dialog) => {
                // ev.target.
                return true;
              },
              controls: [
                {
                  name: 'MasterPriceTable',
                  label: 'Bảng giá',
                  placeholder: '',
                  type: 'select2',
                  // initValue: this.sheets[0],
                  // focus: true,
                  option: {
                    // data: this.refCategoryList,
                    placeholder: 'Chọn bảng giá...',
                    ...this.cms.makeSelect2AjaxOption('/sales/master-price-tables'),
                    allowClear: true,
                    width: '100%',
                    dropdownAutoWidth: true,
                    minimumInputLength: 0,
                    withThumbnail: false,
                    keyMap: {
                      id: 'id',
                      text: 'text',
                    },
                    // multiple: true,
                  }
                },
                {
                  name: 'DiscountByPercent',
                  label: 'Giảm giá (%)',
                  placeholder: 'Giảm giá theo %',
                  type: 'text',
                  initValue: 0,
                  // focus: true,
                },
              ],
              actions: [
                {
                  label: 'Esc - Trở về',
                  icon: 'back',
                  status: 'basic',
                  keyShortcut: 'Escape',
                  action: async () => { return true; },
                },
                {
                  label: 'Gán',
                  icon: 'generate',
                  status: 'primary',
                  // keyShortcut: 'Enter',
                  action: async (form: FormGroup, formDialogConpoent: DialogFormComponent) => {


                    const masterPriceTable = form.get('MasterPriceTable').value;
                    const discountByPercent = form.get('DiscountByPercent').value;
                    this.cms.showDialog('Giá giá từ bảng giá', `Bạn có muốn gán giá từ bảng giá ${this.cms.getObjectText(masterPriceTable)}? Giá hiện tại sẽ bị ghi đè !`, [
                      {
                        label: 'Trở về',
                        status: 'basic',
                        action: () => {

                        }
                      },
                      {
                        label: 'Gán',
                        status: 'danger',
                        action: () => {
                          if (this.cms.getObjectId(this.workingSite) && this.cms.getObjectId(masterPriceTable)) {
                            this.apiService.putPromise<any[]>('/wordpress/sites/' + this.cms.getObjectId(this.workingSite), { assignMasterPriceTable: this.cms.getObjectId(masterPriceTable), discountByPercent: discountByPercent }, [
                              {
                                Code: this.cms.getObjectId(this.workingSite),
                              }
                            ]).then(rs => {
                              this.refresh();
                            });
                          }
                        }
                      },
                    ]);


                    return true;
                  },
                },
              ],
            },
            closeOnEsc: false,
            closeOnBackdropClick: false,
          });
          return false;
        },
      });

      this.actionButtonList.unshift({
        type: 'select2',
        name: 'account',
        status: 'success',
        label: 'Select page',
        icon: 'plus',
        title: 'Site',
        size: 'medium',
        select2: {
          option: {
            placeholder: 'Chọn site...',
            allowClear: true,
            width: '100%',
            dropdownAutoWidth: true,
            minimumInputLength: 0,
            keyMap: {
              id: 'id',
              text: 'text',
            },
            data: this.siteList,
          }
        },
        value: this.workingSite,
        change: async (value: any, option: any) => {
          // this.contraAccount$.next((value || []).map(m => this.cms.getObjectId(m)));
          this.workingSite = value;
          this.refresh();

          // // Get ref categories
          if (this.cms.getObjectId(value)) {
            this.refCategoryList = await this.apiService.getPromise<any[]>('/wordpress/ref-categories', { site: this.cms.getObjectId(value), limit: 'nolimit' }).then(rs => rs.map(m => {
              m.text = m.name;
              return m;
            }));
            console.log(this.refCategoryList);
          } else {
            this.refCategoryList = [];
          }

        },
        disabled: () => {
          return false;
        },
        click: () => {
          // this.gotoForm();
          return false;
        },
      });

      return rs;
    });
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      columns: {
        FeaturePicture: {
          title: 'Hình',
          type: 'custom',
          width: '5%',
          renderComponent: SmartTableThumbnailComponent,
          onComponentInitFunction: (instance: SmartTableThumbnailComponent) => {
            instance.valueChange.subscribe(value => {
            });
            instance.previewAction.subscribe((row: ProductModel) => {
              const pictureList = row?.Pictures || [];
              if ((pictureList.length == 0 && row.FeaturePicture?.OriginImage)) {
                pictureList.push(row.FeaturePicture);
              }
              if (pictureList.length > 0) {
                const currentIndex = pictureList.findIndex(f => f.Id == row.FeaturePicture.Id) || 0;
                if (pictureList.length > 1) {
                  const currentItems = pictureList.splice(currentIndex, 1);
                  pictureList.unshift(currentItems[0]);
                }
                this.cms.openDialog(ImagesViewerComponent, {
                  context: {
                    images: pictureList.map(m => m['OriginImage']),
                    imageIndex: 0,
                  }
                });
              }
            });
            instance.uploadAction.subscribe((row: ProductModel) => {

            });
            instance.title = this.cms.translateText('click to change main product picture');
          },
        },
        Product: {
          title: this.cms.translateText('Common.code'),
          type: 'string',
          width: '5%',
        },
        Sku: {
          title: 'Sku',
          type: 'string',
          width: '5%',
        },
        Name: {
          title: this.cms.translateText('Common.name'),
          type: 'string',
          width: '15%',
        },
        RefId: {
          title: 'RefId',
          type: 'string',
          width: '5%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        Unit: {
          title: 'ĐVT',
          type: 'string',
          width: '5%',
          valuePrepareFunction: (cell: any, row) => {
            return row.UnitName;
          }
        },
        Categories: {
          title: 'Danh mục',
          type: 'string',
          width: '10%',
          valuePrepareFunction: (cell: any, row) => {
            return (cell || []).map(m => this.cms.getObjectText(m)).join(', ');
          }
        },
        RefCategories: {
          title: 'Danh mục WP',
          type: 'string',
          width: '10%',
          valuePrepareFunction: (cell: any, row) => {
            return (cell || []).map(m => this.cms.getObjectText(m)).join(', ');
          }
        },
        Site: {
          title: 'Site',
          type: 'string',
          width: '10%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
          valuePrepareFunction: (cell, row) => {
            return row.SiteName;
          }
        },
        Price: {
          title: 'Giá niêm yết',
          width: '10%',
          type: 'currency-editable',
          editable: true,
          delay: 3000,
          onChange: (value: number, row: any, instance: SmartTableCurrencyEditableComponent) => {
            if (row.Id) {
              instance.status = 'primary';
              console.log(instance.rowData.Code);
              this.apiService.putPromise<any[]>('/wordpress/products/' + row.Id, {}, [{
                Id: row.Id,
                Price: value,
              }]).then(rs => {
                console.log(instance.rowData.Code);
                instance.status = 'success';
              });
            }
          },
        },
        SalePrice: {
          title: 'Giá bán',
          width: '10%',
          type: 'currency-editable',
          editable: true,
          delay: 3000,
          onChange: (value: number, row: any, instance: SmartTableCurrencyEditableComponent) => {
            if (row.Id) {
              instance.status = 'primary';
              console.log(instance.rowData.Code);
              this.apiService.putPromise<any[]>('/wordpress/products/' + row.Id, {}, [{
                Id: row.Id,
                SalePrice: value,
              }]).then(rs => {
                console.log(instance.rowData.Code);
                instance.status = 'success';
              });
            }
          },
        },
        LastSync: {
          title: 'Đồng bộ lần cuối',
          type: 'datetime',
          width: '6%',
        },
        State: {
          title: this.cms.translateText('Common.state'),
          type: 'string',
          width: '5%',
        },
        Sync: {
          title: 'Sync',
          type: 'custom',
          width: '5%',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'cloud-upload-outline';
            instance.display = true;
            instance.status = 'danger';
            instance.valueChange.subscribe(value => {
            });
            instance.click.subscribe(async (row: AccBankModel) => {

            });
          },
        },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['eq_Site'] = this.cms.getObjectId(this.workingSite);
      return params;
    };

    return source;
  }

}

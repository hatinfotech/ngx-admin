import { CurrencyPipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { take, filter } from 'rxjs/operators';
import { UploaderOptions, UploadFile, UploadInput, humanizeBytes, UploadOutput } from '../../../../../vendor/ngx-uploader/src/public_api';
import { SmartTableThumbnailComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { FileModel } from '../../../../models/file.model';
import { PageModel } from '../../../../models/page.model';
import { ProductModel, ProductCategoryModel, ProductGroupModel } from '../../../../models/product.model';
import { UnitModel } from '../../../../models/unit.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AssignCategoriesFormComponent } from '../../../admin-product/product/assign-categories-form/assign-categories-form.component';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { CollaboratorService } from '../../collaborator.service';
import { CollaboratorProductPreviewListComponent } from '../collaborator-product-preview-list/collaborator-product-preview-list.component';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-collaborator-subscription-product',
  templateUrl: './collaborator-subscription-product.component.html',
  styleUrls: ['./collaborator-subscription-product.component.scss'],
  providers: [CurrencyPipe],
})
export class CollaboratorSubscriptionProductComponent extends ServerDataManagerListComponent<ProductModel> implements OnInit {

  componentName: string = 'CollaboratorSubscriptionProductComponent';
  formPath = '/collaborator/product/form';
  apiPath = '/collaborator/product-subscriptions';
  idKey: string | string[] = 'Id';
  currentPage: PageModel;

  reuseDialog = true;
  static _dialog: NbDialogRef<CollaboratorSubscriptionProductComponent>;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  // Category list for filter
  categoryList: ProductCategoryModel[] = [];
  groupList: ProductGroupModel[] = [];
  unitList: UnitModel[] = [];

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<CollaboratorSubscriptionProductComponent>,
    public collaboratorService: CollaboratorService,
    public currencyPipe: CurrencyPipe,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, ref);
  }


  async loadCache() {
    // iniit category
    this.categoryList = (await this.apiService.getPromise<ProductCategoryModel[]>('/collaborator/product-categories', { limit: 'nolimit' })).map(cate => ({ ...cate, id: cate.Code, text: cate.Name })) as any;
    this.groupList = (await this.apiService.getPromise<ProductGroupModel[]>('/collaborator/product-groups', { limit: 'nolimit' })).map(cate => ({ ...cate, id: cate.Code, text: cate.Name })) as any;
    this.unitList = (await this.apiService.getPromise<UnitModel[]>('/collaborator/product-units', { includeIdText: true, limit: 'nolimit' }));
  }

  async init() {
    await this.loadCache();
    return super.init().then(rs => {



      // this.actionButtonList.unshift({
      //   name: 'assignCategories',
      //   status: 'info',
      //   label: this.cms.textTransform(this.cms.translate.instant('Common.tag/untag'), 'head-title'),
      //   icon: 'pricetags',
      //   title: this.cms.textTransform(this.cms.translate.instant('Common.tag/untag'), 'head-title'),
      //   size: 'medium',
      //   disabled: () => this.selectedIds.length === 0,
      //   hidden: () => false,
      //   click: () => {
      //     this.openAssignCategoiesDialplog();
      //     return false;
      //   },
      // });

      // Remove buttons
      this.actionButtonList = this.actionButtonList.filter(f => ['add', 'edit'].indexOf(f.name) < 0);

      const deleteBtn = this.actionButtonList.find(f => f.name === 'delete');
      if (deleteBtn) {
        deleteBtn.label = this.cms.translateText('Common.unsubscribe');
        deleteBtn.icon = 'flash-off-outline';
      }

      this.actionButtonList.unshift({
        type: 'button',
        name: 'subscribe',
        label: this.cms.translateText('Common.subscribe'),
        icon: 'cast-outline',
        status: 'success',
        size: 'medium',
        title: this.cms.translateText('Common.subscribe'),
        click: () => {
          this.cms.openDialog(CollaboratorProductPreviewListComponent, {
            context: {
              inputMode: 'dialog',
              onDialogChoose: async (chooseItems: ProductModel[]) => {
                console.log(chooseItems);
                this.cms.openDialog(ShowcaseDialogComponent, {
                  context: {
                    title: this.cms.translateText('Common.subscribe'),
                    content: this.cms.translateText('Collaborator.Product.subscribeConfirmText') + '<br>' + chooseItems.map(product => product.Name).join(', '),
                    actions: [
                      {
                        label: this.cms.translateText('Common.close'),
                        status: 'primary',
                      },
                      {
                        label: this.cms.translateText('Common.subscribe'),
                        status: 'danger',
                        action: () => {
                          this.apiService.putPromise<ProductModel[]>('/collaborator/products', { id: [chooseItems.map(product => product.Code)], subscribe: true, page: this.collaboratorService.currentpage$.value }, chooseItems.map(product => ({ Code: product.Code, WarehouseUnit: product.WarehouseUnit }))).then(rs => {
                            this.cms.toastService.show(this.cms.translateText('Common.success'), this.cms.translateText('Collaborator.Product.subscribeSuccessText'), {
                              status: 'success',
                            })
                            this.refresh();
                          });
                        }
                      },
                    ],
                  },
                })
              },
              onDialogClose: () => {
              },
            },
          })
        },
      });

      // Add page choosed
      this.collaboratorService.pageList$.pipe(take(1), filter(f => f && f.length > 0)).toPromise().then(pageList => {
        this.actionButtonList.unshift({
          type: 'select2',
          name: 'pbxdomain',
          status: 'success',
          label: 'Select page',
          icon: 'plus',
          title: this.cms.textTransform(this.cms.translate.instant('Common.createNew'), 'head-title'),
          size: 'medium',
          select2: {
            data: pageList, option: {
              placeholder: 'Chọn trang...',
              allowClear: true,
              width: '100%',
              dropdownAutoWidth: true,
              minimumInputLength: 0,
              keyMap: {
                id: 'id',
                text: 'text',
              },
            }
          },
          value: this.collaboratorService.currentpage$.value,
          change: (value: any, option: any) => {
            this.onChangePage(value);
          },
          disabled: () => {
            return false;
          },
          click: () => {
            // this.gotoForm();
            return false;
          },
        });
      });

      return rs;
    });
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      mode: 'external',
      selectMode: 'multi',
      actions: {
        position: 'right',
      },
      add: this.configAddButton(),
      edit: this.configEditButton(),
      delete: this.configDeleteButton(),
      pager: this.configPaging(),
      columns: {
        FeaturePicture: {
          title: 'Hình',
          type: 'custom',
          width: '5%',
          valuePrepareFunction: (value: string, product: ProductModel) => {
            return product['FeaturePicture']['Thumbnail'];
          },
          renderComponent: SmartTableThumbnailComponent,
          onComponentInitFunction: (instance: SmartTableThumbnailComponent) => {
            instance.valueChange.subscribe(value => {
            });
            // instance.click.subscribe(async (row: ProductModel) => {
            //   if (this.files.length === 0) {
            //     this.uploadForProduct = row;
            //     this.uploadBtn.nativeElement.click();
            //   } else {
            //     this.cms.toastService.show(
            //       this.cms.translateText('Common.uploadInProcess'),
            //       this.cms.translateText('Common.upload'),
            //       {
            //         status: 'warning',
            //       });
            //     // this.cms.openDialog(ShowcaseDialogComponent, {
            //     //   context: {
            //     //     title: this.cms.translateText('Common.upload'),
            //     //     content: this.cms.translateText('Common.uploadInProcess'),
            //     //   },
            //     // });
            //   }
            // });
            // instance.title = this.cms.translateText('click to change main product picture');
          },
        },
        Name: {
          title: 'Tên',
          type: 'string',
          width: '15%',
        },
        Categories: {
          title: 'Danh mục',
          type: 'html',
          width: '15%',
          valuePrepareFunction: (value: string, product: ProductModel) => {
            return product['Categories'] ? ('<span class="tag">' + product['Categories'].map(cate => cate['text']).join('</span><span class="tag">') + '</span>') : '';
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              select2Option: {
                placeholder: 'Chọn danh mục...',
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                minimumInputLength: 0,
                keyMap: {
                  id: 'id',
                  text: 'text',
                },
                multiple: true,
                ajax: {
                  url: (params: any) => {
                    return 'data:text/plan,[]';
                  },
                  delay: 0,
                  processResults: (data: any, params: any) => {
                    return {
                      results: this.categoryList.filter(cate => !params.term || this.cms.smartFilter(cate.text, params.term)),
                    };
                  },
                },
              },
            },
          },
        },
        Groups: {
          title: 'Nhóm',
          type: 'html',
          width: '15%',
          valuePrepareFunction: (value: string, product: ProductModel) => {
            return product['Groups'] ? ('<span class="tag">' + product['Groups'].map(cate => cate['text']).join('</span><span class="tag">') + '</span>') : '';
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              select2Option: {
                placeholder: 'Chọn nhóm...',
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                minimumInputLength: 0,
                keyMap: {
                  id: 'id',
                  text: 'text',
                },
                multiple: true,
                ajax: {
                  url: (params: any) => {
                    return 'data:text/plan,[]';
                  },
                  delay: 0,
                  processResults: (data: any, params: any) => {
                    return {
                      results: this.groupList.filter(cate => !params.term || this.cms.smartFilter(cate.text, params.term)),
                    };
                  },
                },
              },
            },
          },
        },
        Units: {
          title: 'Giá/ĐVT',
          type: 'html',
          width: '18%',
          valuePrepareFunction: (cell: any, row?: any) => {
            return (cell || []).map(m => {
              let text = `${this.currencyPipe.transform(m.Price, 'VND')}/${m.text}`;
              if(row.Unit == m.id) text = `<b>${text}</b>`;
              return text;
            } ).join('<br>');
          },
          // onComponentInitFunction: (cell, row) => {
            
          // },
        },
        // Price: {
        //   title: 'Giá',
        //   type: 'currency',
        //   width: '8%',
        // },
        // Code: {
        //   title: 'Code',
        //   type: 'string',
        //   width: '5%',
        // },
        Sku: {
          title: 'Sku',
          type: 'string',
          width: '13%',
        },
        PageName: {
          title: 'Trang',
          type: 'string',
          width: '12%',
        },
        Subscribed: {
          title: 'Ngày đăng ký',
          type: 'datetime',
          width: '8%',
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

    // Set DataSource: prepareData
    source.prepareData = (data: ProductModel[]) => {
      data.map((product: ProductModel) => {
        if (product.WarehouseUnit && product.WarehouseUnit.Name) {
          product.WarehouseUnit.text = product.WarehouseUnit.Name;
        }
        return product;
      });
      return data;
    };

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeCategories'] = true;
      params['includeGroups'] = true;
      params['includeUnitPrices'] = true;
      params['includePage'] = true;
      // params['includeFeaturePicture'] = true;
      // params['includeUnitConversions'] = true;
      params['sort_Id'] = 'desc';
      // params['subscription'] = true;
      if (this.collaboratorService.currentpage$.value) {
        params['page'] = this.collaboratorService.currentpage$.value;
      }
      return params;
    };

    return source;
  }

  /** Api get funciton */
  // executeGet(params: any, success: (resources: ProductModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: ProductModel[] | HttpErrorResponse) => void) {
  //   params['includeCategories'] = true;
  //   if (this.currentPage) {
  //     params['page'] = this.cms.getObjectId(this.currentPage);
  //   }
  //   super.executeGet(params, success, error, complete);
  // }

  /** Api delete funciton */
  async executeDelete(ids: any, success: (resp: any) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: any | HttpErrorResponse) => void) {
    const params = { id: ids };
    if (this.collaboratorService.currentpage$.value) {
      params['page'] = this.collaboratorService.currentpage$.value;
    }
    return super.executeDelete(params, success, error, complete);
  }

  getList(callback: (list: ProductModel[]) => void) {
    super.getList((rs) => {
      // rs.map((product: any) => {
      //   product['Unit'] = product['Unit']['Name'];
      //   if (product['Categories']) {
      //     product['CategoriesRendered'] = product['Categories'].map(cate => cate['text']).join(', ');
      //   }
      //   return product;
      // });
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  async openAssignCategoiesDialplog() {
    if (this.selectedIds.length > 0) {
      const editedItems = await this.convertIdsToItems(this.selectedIds);
      this.cms.openDialog(AssignCategoriesFormComponent, {
        context: {
          inputMode: 'dialog',
          inputProducts: this.selectedItems,
          onDialogSave: (newData: ProductModel[]) => {
            // this.refresh();
            this.updateGridItems(editedItems, newData);
          },
          onDialogClose: () => {
          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    }
  }


  onChangePage(page: PageModel) {
    // this.currentPage = page;
    this.collaboratorService.currentpage$.next(this.cms.getObjectId(page));
    this.refresh();
  }

}

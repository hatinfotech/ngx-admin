import { take, filter, takeUntil } from 'rxjs/operators';
import { CollaboratorService } from '../../collaborator.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { UploaderOptions, UploadFile, UploadInput, humanizeBytes, UploadOutput } from '../../../../../vendor/ngx-uploader/src/public_api';
import { SmartTableButtonComponent, SmartTableThumbnailComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { FileModel } from '../../../../models/file.model';
import { ProductModel, ProductCategoryModel, ProductGroupModel } from '../../../../models/product.model';
import { UnitModel } from '../../../../models/unit.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AssignCategoriesFormComponent } from '../../../admin-product/product/assign-categories-form/assign-categories-form.component';
import { CollaboratorProductFormComponent } from '../collaborator-product-form/collaborator-product-form.component';
import { ProductListComponent } from '../../../admin-product/product/product-list/product-list.component';
import { PageModel } from '../../../../models/page.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'ngx-collaborator-product-list',
  templateUrl: './collaborator-product-list.component.html',
  styleUrls: ['./collaborator-product-list.component.scss'],
  providers: [CurrencyPipe],
})
export class CollaboratorProductListComponent extends ServerDataManagerListComponent<ProductModel> implements OnInit {

  componentName: string = 'CollaboratorProductListComponent';
  formPath = '/collaborator/product/form';
  apiPath = '/collaborator/page-products';
  idKey: string | string[] = ['Page', 'Product'];
  formDialog = CollaboratorProductFormComponent;
  currentPage: PageModel;

  reuseDialog = true;
  static _dialog: NbDialogRef<CollaboratorProductListComponent>;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  // Category list for filter
  categoryList: ProductCategoryModel[] = [];
  groupList: ProductGroupModel[] = [];
  unitList: UnitModel[] = [];

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<CollaboratorProductListComponent>,
    public collaboratorService: CollaboratorService,
    public currencyPipe: CurrencyPipe,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
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

      // Remove buttons
      this.actionButtonList = this.actionButtonList.filter(f => ['add'].indexOf(f.name) < 0);

      // this.actionButtonList.unshift({
      //   name: 'assignCategories',
      //   status: 'info',
      //   label: this.commonService.textTransform(this.commonService.translate.instant('Common.tag/untag'), 'head-title'),
      //   icon: 'pricetags',
      //   title: this.commonService.textTransform(this.commonService.translate.instant('Common.tag/untag'), 'head-title'),
      //   size: 'medium',
      //   disabled: () => this.selectedIds.length === 0,
      //   hidden: () => false,
      //   click: () => {
      //     this.openAssignCategoiesDialplog();
      //     return false;
      //   },
      // });

      this.actionButtonList.unshift({
        type: 'button',
        name: 'addProduct',
        label: this.commonService.translateText('Collaborator.Product.add'),
        icon: 'cube-outline',
        status: 'primary',
        size: 'medium',
        title: this.commonService.translateText('Common.subscribe'),
        click: () => {
          this.commonService.openDialog(ProductListComponent, {
            context: {
              inputMode: 'dialog',
              onDialogChoose: async (chooseItems: ProductModel[]) => {
                console.log(chooseItems);
                const page = this.collaboratorService.currentpage$?.value;
                this.apiService.putPromise<ProductModel[]>('/collaborator/products', { id: chooseItems.map(product => product.Code), assign: true, page: this.collaboratorService.currentpage$.value }, chooseItems.map(product => ({ Code: product.Code }))).then(rs => {
                  this.commonService.toastService.show(this.commonService.translateText('Common.success'), this.commonService.translateText('Collaborator.Product.subscribeSuccessText'), {
                    status: 'success',
                  })
                  this.refresh();
                });
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
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.createNew'), 'head-title'),
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
          value: () => this.collaboratorService.currentpage$.value,
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
        FeaturePictureThumbnail: {
          title: 'Hình',
          type: 'custom',
          width: '5%',
          valuePrepareFunction: (value: string, product: ProductModel) => {
            return product && product['FeaturePicture'] && product['FeaturePicture']['Thumbnail'] || 'assets/images/no-image-available.png';
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
            //     this.commonService.toastService.show(
            //       this.commonService.translateText('Common.uploadInProcess'),
            //       this.commonService.translateText('Common.upload'),
            //       {
            //         status: 'warning',
            //       });
            //     // this.commonService.openDialog(ShowcaseDialogComponent, {
            //     //   context: {
            //     //     title: this.commonService.translateText('Common.upload'),
            //     //     content: this.commonService.translateText('Common.uploadInProcess'),
            //     //   },
            //     // });
            //   }
            // });
            // instance.title = this.commonService.translateText('click to change main product picture');
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
                      results: this.categoryList.filter(cate => !params.term || this.commonService.smartFilter(cate.text, params.term)),
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
                      results: this.groupList.filter(cate => !params.term || this.commonService.smartFilter(cate.text, params.term)),
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
          width: '13%',
          valuePrepareFunction: (cell: any, row?: any) => {
            return (cell || []).map(m => {
              let text = `${this.currencyPipe.transform(m.Price, 'VND')}/${m.text}`;
              if(row.Unit == m.id) text = `<b>${text}</b>`;
              return text;
            } ).join('<br>');
          },
        },
        Product: {
          title: 'Code',
          type: 'string',
          width: '5%',
        },
        Sku: {
          title: 'Sku',
          type: 'string',
          width: '10%',
        },
        Cycle: {
          title: 'Chu kỳ',
          type: 'string',
          width: '10%',
        },
        IsAutoExtended: {
          title: 'Gia hạn',
          type: 'boolean',
          width: '5%',
        },
        IsUsed: {
          title: 'Đã sử dụng',
          type: 'boolean',
          width: '5%',
        },
        PageName: {
          title: 'Trang',
          type: 'string',
          width: '15%',
        },
        Link: {
          title: 'Link',
          type: 'custom',
          width: '5%',
          exclude: this.isChoosedMode,
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'link-2-outline';
            // instance.label = this.commonService.translateText('Common.copy');
            instance.display = true;
            instance.status = 'primary';
            instance.init.pipe(takeUntil(this.destroy$)).subscribe((row: any) => {
              const link = `/${(row.Page && row.Page.id || row.Page).toLowerCase()}/ctvbanhang/product/${row?.Product?.toLowerCase()}`;
              instance.title = link;
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe(async (row: any) => {
              const link = `/${(row.Page && row.Page.id || row.Page).toLowerCase()}/ctvbanhang/product/${row?.Product?.toLowerCase()}`;
              this.commonService.copyTextToClipboard(link);
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
      params['includeProduct'] = true;
      params['includeUnit'] = true;
      params['includeUnitPrices'] = true;
      // params['includeFeaturePicture'] = true;
      // params['includeUnitConversions'] = true;
      params['productOfPage'] = true;
      params['sort_Id'] = 'desc';
      if (this.collaboratorService.currentpage$.value) {
        params['page'] = this.collaboratorService.currentpage$.value;
      }
      return params;
    };

    return source;
  }

  /** Api delete funciton */
  async executeDelete(ids: any, success: (resp: any) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: any | HttpErrorResponse) => void) {
    const params = { id: ids, page: this.collaboratorService.currentpage$?.value };
    return super.executeDelete(params, success, error, complete);
  }

  /** Api get funciton */
  // executeGet(params: any, success: (resources: ProductModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: ProductModel[] | HttpErrorResponse) => void) {
  //   params['includeCategories'] = true;
  //   if (this.currentPage) {
  //     params['page'] = this.commonService.getObjectId(this.currentPage);
  //   }
  //   super.executeGet(params, success, error, complete);
  // }

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
  // async openAssignCategoiesDialplog() {
  //   if (this.selectedIds.length > 0) {
  //     const editedItems = await this.convertIdsToItems(this.selectedIds);
  //     this.commonService.openDialog(AssignCategoriesFormComponent, {
  //       context: {
  //         inputMode: 'dialog',
  //         inputProducts: this.selectedItems,
  //         onDialogSave: (newData: ProductModel[]) => {
  //           // this.refresh();
  //           this.updateGridItems(editedItems, newData);
  //         },
  //         onDialogClose: () => {
  //         },
  //       },
  //       closeOnEsc: false,
  //       closeOnBackdropClick: false,
  //     });
  //   }
  // }

  /** ngx-uploader */
  // options: UploaderOptions = { concurrency: 1, maxUploads: 0, maxFileSize: 1024 * 1024 * 1024 };
  // formData: FormData;
  // files: UploadFile[] = [];
  // uploadInput: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();
  // humanizeBytes: Function = humanizeBytes;
  // dragOver: { [key: string]: boolean } = {};
  // filesIndex: { [key: string]: UploadFile } = {};
  // pictureFormIndex: { [key: string]: FormGroup } = {};
  // uploadForProduct: ProductModel;
  // @ViewChild('uploadBtn') uploadBtn: ElementRef;

  // async onUploadOutput(output: UploadOutput): Promise<void> {
  //   // console.log(output);
  //   // console.log(this.files);
  //   switch (output.type) {
  //     case 'allAddedToQueue':
  //       // uncomment this if you want to auto upload files when added
  //       const event: UploadInput = {
  //         type: 'uploadAll',
  //         url: this.apiService.buildApiUrl('/file/files'),
  //         method: 'POST',
  //         data: { foo: 'bar' },
  //       };
  //       this.uploadInput.emit(event);
  //       break;
  //     case 'addedToQueue':
  //       if (typeof output.file !== 'undefined') {
  //         this.files.push(output.file);
  //         this.filesIndex[output.file.id] = output.file;
  //       }
  //       break;
  //     case 'uploading':
  //       if (typeof output.file !== 'undefined') {
  //         // update current data in files array for uploading file
  //         const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
  //         this.files[index] = output.file;
  //         console.log(`[${output.file.progress.data.percentage}%] Upload file ${output.file.name}`);
  //       }
  //       break;
  //     case 'removed':
  //       // remove file from array when removed
  //       this.files = this.files.filter((file: UploadFile) => file !== output.file);
  //       break;
  //     case 'dragOver':
  //       // this.dragOver[formItemIndex] = true;
  //       break;
  //     case 'dragOut':
  //     case 'drop':
  //       // this.dragOver[formItemIndex] = false;
  //       break;
  //     case 'done':
  //       // The file is downloaded
  //       console.log('Upload complete');
  //       const fileResponse: FileModel = output.file.response[0];

  //       try {

  //         if (fileResponse) {

  //           // get product
  //           const product = (await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { id: [this.uploadForProduct.Code], includePictures: true }))[0];
  //           if (product) {
  //             product.Pictures.push({ Image: fileResponse.Store + '/' + fileResponse.Id });
  //             await this.apiService.putPromise<ProductModel[]>('/admin-product/products', {}, [{
  //               Code: this.uploadForProduct.Code,
  //               FeaturePicture: fileResponse.Store + '/' + fileResponse.Id,
  //               Pictures: product.Pictures,
  //             }]);

  //             this.source['isLocalUpdate'] = true; // local reload
  //             await this.source.update(this.uploadForProduct, { ...this.uploadForProduct, FeaturePictureThumbnail: fileResponse['Thumbnail'] });
  //             this.source['isLocalUpdate'] = true;

  //             this.files = [];
  //             this.uploadBtn.nativeElement.value = '';

  //           } else {
  //             throw Error('Get product failed');
  //           }

  //         } else {
  //           throw Error('upload failed');
  //         }

  //         console.log(output);
  //       } catch (e) {
  //         this.files = [];
  //         this.uploadBtn.nativeElement.value = '';
  //       }

  //       break;
  //   }
  // }

  // startUpload(): void {
  //   const event: UploadInput = {
  //     type: 'uploadAll',
  //     url: this.apiService.buildApiUrl('/file/files'),
  //     method: 'POST',
  //     data: { foo: 'bar' },
  //   };

  //   this.uploadInput.emit(event);
  // }

  // cancelUpload(id: string): void {
  //   this.uploadInput.emit({ type: 'cancel', id: id });
  // }

  // removeFile(id: string): void {
  //   this.uploadInput.emit({ type: 'remove', id: id });
  // }

  // removeAllFiles(): void {
  //   this.uploadInput.emit({ type: 'removeAll' });
  // }
  /** End ngx-uploader */

  onChangePage(page: PageModel) {
    this.collaboratorService.currentpage$.next(this.commonService.getObjectId(page));
    this.commonService.takeOnce(this.componentName + '_on_domain_changed', 1000).then(() => {
      this.refresh();
    });
  }

}

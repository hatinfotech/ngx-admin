import { WarehouseGoodsContainerModel } from './../../../../models/warehouse.model';
import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { WarehouseBookModel, WarehouseModel, GoodsModel } from '../../../../models/warehouse.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductCategoryModel, ProductGroupModel, ProductUnitConversoinModel } from '../../../../models/product.model';
import { SmartTableThumbnailComponent, SmartTableCurrencyEditableComponent, SmartTableCheckboxComponent, SmartTableNumberEditableComponent, SmartTableTextEditableComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSelect2FilterComponent, SmartTableFilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { SalesMasterPriceTableDetailModel } from '../../../../models/sales.model';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { takeUntil } from 'rxjs/operators';
import { CustomServerDataSource } from '../../../../lib/custom-element/smart-table/custom-server.data-source';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { UnitModel } from '../../../../models/unit.model';

@Component({
  selector: 'ngx-warehouse-book-form',
  templateUrl: './warehouse-book-form.component.html',
  styleUrls: ['./warehouse-book-form.component.scss'],
})
export class WarehouseBookFormComponent extends DataManagerFormComponent<WarehouseBookModel> implements OnInit {

  componentName: string = 'WarehouseBookFormComponent';
  idKey = 'Code';
  baseFormUrl = '/warehouse/book/form';
  apiPath = '/warehouse/books';

  static _warehouseList: WarehouseModel[];
  get warehouseList() { return WarehouseBookFormComponent._warehouseList; }
  select2OptionForWarehouse = {
    placeholder: this.commonService.translateText('Common.choose'),
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<WarehouseBookFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  async loadCache() {
    await this.clearCache();
    WarehouseBookFormComponent._warehouseList = WarehouseBookFormComponent._warehouseList || await this.apiService.getPromise<WarehouseModel[]>('/warehouse/warehouses', { includeIdText: true, sort_Name: 'asc' });
    // WarehouseBookFormComponent._goodsContainerList = WarehouseBookFormComponent._goodsContainerList || (await this.apiService.getPromise<WarehouseBookModel[]>('/warehouse/goods-containers', { includePath: true, includeIdText: true, includeWarehouse: true })).map(item => ({...item, 'text': item.Path})).sort((a, b) => a.Path.localeCompare(b.Path));
    return super.loadCache();
  }

  async loadGoodsContainerList(warehouseCode: string) {
    // WarehouseBookFormComponent._goodsContainerList = (await this.apiService.getPromise<WarehouseBookModel[]>('/warehouse/goods-containers', { includePath: true, includeIdText: true, filter_Warehouse: warehouseCode })).map(item => ({...item, 'text': item.Path})).sort((a, b) => a.Path.localeCompare(b.Path));

  }

  async clearCache() {
    WarehouseBookFormComponent._warehouseList = null;
    // WarehouseBookFormComponent._goodsContainerList = null;
    this.categoryList = (await this.apiService.getPromise<ProductCategoryModel[]>('/admin-product/categories', {limit: 'nolimit'})).map(cate => ({ ...cate, id: cate.Code, text: cate.Name })) as any;
    this.groupList = (await this.apiService.getPromise<ProductGroupModel[]>('/admin-product/groups', {limit: 'nolimit'})).map(cate => ({ ...cate, id: cate.Code, text: cate.Name })) as any;
    this.containerList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includePath: true, includeIdText: true })).map(container => ({ ...container, text: container.Path })) as any;
    this.unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units', { includeIdText: true, limit: 'nolimit' }));
    return super.clearCache();
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    return super.init();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: WarehouseBookModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeParent'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: WarehouseBookModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [{ disabled: true, value: '' }],
      DateOfStart: [null, Validators.required],
      DateOfEnd: [null, Validators.required],
      DateOfBeginning: [null, Validators.required],
      // PreviousBook: [''],
      // Warehouse: [''],
      Note: [''],
      // Branch: ['MAINBRANCH'],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: WarehouseBookModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  async save() {
    const result = super.save();
    result.then(rs => {
      this.loadCache();
    });
    return result;
  }

  onChangeWarehouse(event: WarehouseModel) {
    this.loadGoodsContainerList(event.Code);
  }

  async formLoad(formData: WarehouseBookModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: WarehouseBookModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {
      // Load details
      this.loadList();

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }












  /** Common function for ng2-smart-table */

  // Category list for filter
  categoryList: (ProductCategoryModel & { id?: string, text?: string })[] = [];
  groupList: (ProductGroupModel & { id?: string, text?: string })[] = [];
  containerList: WarehouseGoodsContainerModel[] = [];
  unitList: UnitModel[] = [];
  // async loadCache() {
  //   // iniit category
  //   this.categoryList = (await this.apiService.getPromise<ProductCategoryModel[]>('/admin-product/categories', {})).map(cate => ({ ...cate, id: cate.Code, text: cate.Name })) as any;
  // }

  editing = {};
  rows = [];

  settings = this.configSetting({
    actions: false,
    pager: this.configPaging(),
    columns: {
      FeaturePictureThumbnail: {
        title: 'Hình',
        type: 'custom',
        width: '5%',
        renderComponent: SmartTableThumbnailComponent,
        onComponentInitFunction: (instance: SmartTableThumbnailComponent) => {
          instance.valueChange.subscribe(value => {
          });
          instance.click.subscribe(async (row: GoodsModel) => {
          });
        },
      },
      Name: {
        title: 'Tên',
        type: 'string',
        width: '15%',
        // filter: {
        //   type: 'custom',
        //   component: SmartTableFilterComponent,
        //   config: {
        //     delay: 3000,
        //   },
        // },
      },
      Categories: {
        title: 'Danh mục',
        type: 'html',
        width: '15%',
        valuePrepareFunction: (value: string, product: GoodsModel) => {
          return product['Categories'] ? ('<span class="tag">' + product['Categories'].map(cate => cate['text']).join('</span><span class="tag">') + '</span>') : '';
        },
        // valuePrepareFunction: (value: string, product: GoodsModel) => {
        //   return product['Categories'] ? product['Categories'].map(cate => cate['text']).join(', ') : '';
        // },
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
              // code template: smart-table fiter with data update
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
        valuePrepareFunction: (value: string, product: GoodsModel) => {
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
              // code template: smart-table fiter with data update
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
      Container: {
        title: this.commonService.translateText('Warehouse.GoodsContainer.title', { action: '', definition: '' }),
        type: 'html',
        width: '10%',
        valuePrepareFunction: (value: string, product: GoodsModel) => {
          return this.commonService.getObjectText(value);
          // try {
          //   return product['Containers'] ? ('<span class="tag">' + product['Containers'].filter(container => !!container['Container']).map(container => container['Container']['Path']).join('</span><span class="tag">') + '</span>') : '';
          // } catch (e) {
          //   return '';
          // }
        },
        filter: {
          type: 'custom',
          component: SmartTableSelect2FilterComponent,
          config: {
            delay: 0,
            select2Option: {
              placeholder: this.commonService.translateText('Warehouse.GoodsContainer.title', { action: this.commonService.translateText('Common.choose'), definition: '' }),
              allowClear: true,
              width: '100%',
              dropdownAutoWidth: true,
              minimumInputLength: 0,
              keyMap: {
                id: 'id',
                text: 'text',
              },
              multiple: true,
              logic: 'OR',
              ajax: {
                url: (params: any) => {
                  return 'data:text/plan,[]';
                },
                delay: 0,
                processResults: (data: any, params: any) => {
                  return {
                    results: this.containerList.filter(cate => !params.term || this.commonService.smartFilter(cate.text, params.term)),
                  };
                },
              },
            },
          },
        },
      },
      ConversionUnit: {
        title: 'ĐVT',
        type: 'html',
        width: '5%',
        valuePrepareFunction: (value: string, product: GoodsModel) => {
          return product.UnitConversions instanceof Array ? (product.UnitConversions.map((uc: UnitModel & ProductUnitConversoinModel) => (uc.Unit === this.commonService.getObjectId(product['WarehouseUnit']) ? `<b>${uc.Name}</b>` : uc.Name)).join(', ')) : this.commonService.getObjectText(product['WarehouseUnit']);
        },
        filter: {
          type: 'custom',
          component: SmartTableSelect2FilterComponent,
          config: {
            delay: 0,
            select2Option: {
              placeholder: this.commonService.translateText('AdminProduct.Unit.title', { action: this.commonService.translateText('Common.choose'), definition: '' }),
              allowClear: true,
              width: '100%',
              dropdownAutoWidth: true,
              minimumInputLength: 0,
              keyMap: {
                id: 'id',
                text: 'text',
              },
              multiple: true,
              logic: 'OR',
              ajax: {
                url: (params: any) => {
                  return 'data:text/plan,[]';
                },
                delay: 0,
                processResults: (data: any, params: any) => {
                  return {
                    results: this.unitList.filter(cate => !params.term || this.commonService.smartFilter(cate.text, params.term)),
                  };
                },
              },
            },
          },
        },
      },
      Code: {
        title: 'Code',
        type: 'string',
        width: '10%',
      },
      Sku: {
        title: 'Sku',
        type: 'string',
        width: '5%',
      },
      Inventory: {
        title: this.commonService.translateText('Warehouse.inventory'),
        width: '8%',
        type: 'number-editable',
        editable: true,
        delay: 3000,
        onChange: (value: number, row: GoodsModel, instance: SmartTableNumberEditableComponent) => {
          const masterPriceTable = this.array.controls[0].get('Code').value;
          if (value !== null) {
            if (this.commonService.getObjectId(row.WarehouseUnit)) {
              instance.status = 'primary';
              console.log(instance.rowData.Code);
              this.apiService.putPromise<SalesMasterPriceTableDetailModel[]>('/warehouse/books', {
                id: [this.array.controls[0].get('Code').value],
                updateHeadInventory: true,
                goods: row.Code,
                unit: this.commonService.getObjectId(row.WarehouseUnit),
                container: this.commonService.getObjectId(row['Container']),
                inventory: value,
                currency: value,
              }, [{
                MasterPriceTable: masterPriceTable,
                Product: row.Code,
                Unit: row.WarehouseUnit.Code,
                Price: value,
              }]).then(rs => {
                console.log(instance.rowData.Code);
                instance.status = 'success';
              });
              // }
            } else {
              instance.status = 'danger';
              this.commonService.openDialog(ShowcaseDialogComponent, {
                context: {
                  title: 'Cảnh báo',
                  content: 'Sản phẩm này không có đơn vị tính, để cập nhật giá cho sản phẩm vui lòng cài đặt đơn vị tính trước !',
                  actions: [
                    {
                      label: 'Trở về',
                      icon: 'back',
                      status: 'info',
                      action: () => { },
                    },
                  ],
                },
              });
            }
          }
        },
      },
      UnitPrice: {
        title: this.commonService.translateText('Warehouse.warehousePrice'),
        width: '12%',
        type: 'number-editable',
        editable: true,
        delay: 3000,
        onChange: (value: number, row: GoodsModel, instance: SmartTableNumberEditableComponent) => {
          const masterPriceTable = this.array.controls[0].get('Code').value;
          if (value !== null) {
            if (this.commonService.getObjectId(row.WarehouseUnit)) {
              instance.status = 'primary';
              console.log(instance.rowData.Code);
              this.apiService.putPromise<SalesMasterPriceTableDetailModel[]>('/warehouse/books', {
                id: [this.array.controls[0].get('Code').value],
                updateHeadInventory: true,
                goods: row.Code,
                unit: this.commonService.getObjectId(row.WarehouseUnit),
                container: this.commonService.getObjectId(row['Container']),
                unitPrice: value,
                currency: this.commonService.loginInfo.configuration.defaultCurrency,
              }, [{
                MasterPriceTable: masterPriceTable,
                Product: row.Code,
                Unit: row.WarehouseUnit.Code,
                Price: value,
              }]).then(rs => {
                console.log(instance.rowData.Code);
                instance.status = 'success';
              });
              // }
            } else {
              instance.status = 'danger';
              this.commonService.openDialog(ShowcaseDialogComponent, {
                context: {
                  title: 'Cảnh báo',
                  content: 'Sản phẩm này không có đơn vị tính, để cập nhật giá cho sản phẩm vui lòng cài đặt đơn vị tính trước !',
                  actions: [
                    {
                      label: 'Trở về',
                      icon: 'back',
                      status: 'info',
                      action: () => { },
                    },
                  ],
                },
              });
            }
          }
        },
      },
    },
  });

  /** Seleted ids */
  selectedIds: string[] = [];
  selectedItems: SalesMasterPriceTableDetailModel[] = [];

  /** Config for stmart table setttings */
  protected configSetting(settings: SmartTableSetting) {

    // Set default filter function
    Object.keys(settings.columns).forEach(key => {
      const column = settings.columns[key];
      if (!settings.columns[key]['filterFunction']) {
        settings.columns[key]['filterFunction'] = (value: string, query: string) => this.commonService.smartFilter(value, query);
      }

      if (column.type === 'boolean') {
        column.type = 'custom';
        column.renderComponent = SmartTableCheckboxComponent;
        column.onComponentInitFunction = (instance: SmartTableCheckboxComponent) => {
          instance.disabled = !column.editable;
          instance.valueChange.asObservable().pipe(takeUntil(this.destroy$)).subscribe(value => {
            // console.info(value);
            if (column.onChange) {
              column.onChange(value, instance.rowData, instance);
            }
          });
        };
      }

      if (column.type === 'currency-editable') {
        column.type = 'custom';
        column.renderComponent = SmartTableCurrencyEditableComponent;
        column.onComponentInitFunction = (instance: SmartTableCurrencyEditableComponent) => {
          instance.disabled = !column.editable;
          instance.placeholder = column.title;
          instance.name = key;
          if (column.delay) {
            instance.delay = column.delay;
          }
          instance.valueChange.asObservable().pipe(takeUntil(this.destroy$)).subscribe(value => {
            if (column.onChange) {
              column.onChange(value, instance.rowData, instance);
            }
          });
        };
      }

      if (column.type === 'number-editable') {
        column.type = 'custom';
        column.renderComponent = SmartTableNumberEditableComponent;
        column.onComponentInitFunction = (instance: SmartTableNumberEditableComponent) => {
          instance.disabled = !column.editable;
          instance.placeholder = column.title;
          instance.name = key;
          if (column.delay) {
            instance.delay = column.delay;
          }
          instance.valueChange.asObservable().pipe(takeUntil(this.destroy$)).subscribe(value => {
            if (column.onChange) {
              column.onChange(value, instance.rowData, instance);
            }
          });
        };
      }

      if (column.type === 'text-editable') {
        column.type = 'custom';
        column.renderComponent = SmartTableTextEditableComponent;
        column.onComponentInitFunction = (instance: SmartTableTextEditableComponent) => {
          instance.disabled = !column.editable;
          instance.placeholder = column.title;
          instance.name = key;
          if (column.delay) {
            instance.delay = column.delay;
          }
          instance.valueChange.asObservable().pipe(takeUntil(this.destroy$)).subscribe(value => {
            if (column.onChange) {
              column.onChange(value, instance.rowData, instance);
            }
          });
        };
      }

      if (typeof column['filter'] === 'undefined') {
        column['filter'] = {
          type: 'custom',
          component: SmartTableFilterComponent,
        };
      }

    });

    return settings;
  }

  /** Config for add button */
  protected configAddButton() {
    return {
      addButtonContent: '<i class="nb-edit"></i> <i class="nb-trash"></i> <i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    };
  }

  /** Config for add button */
  protected configFilterButton() {
    return {
      addButtonContent: '<i class="nb-search"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    };
  }

  /** Config for edit button */
  protected configEditButton() {
    return {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    };
  }

  /** Config for delete button */
  protected configDeleteButton() {
    return {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    };
  }

  /** Config for paging */
  protected configPaging() {
    return {
      display: true,
      perPage: 100,
    };
  }

  /** User select event */
  onUserRowSelect(event: any) {
    this.selectedItems = event.selected;
    this.selectedIds = event.selected.map((item: SalesMasterPriceTableDetailModel) => {
      return item[this.idKey];
    });
    // console.info(event);
    if (this.selectedIds.length > 0) {
      this.hasSelect = 'selected';
    } else {
      this.hasSelect = 'none';
    }
  }

  /** Row select event */
  onRowSelect(event) {
    // console.info(event);
  }

  hasSelect = 'none';

  /** Local dat source */
  source: CustomServerDataSource<GoodsModel>;

  // initDataSource() {
  //   return this.source = new CustomeServerDataSource<SalesMasterPriceTableDetailModel>(this.apiService, '/sales/master-price-table-details');
  // }

  initDataSource() {
    this.source = new CustomServerDataSource<GoodsModel>(this.apiService, this.commonService, '/warehouse/goods');

    // Set DataSource: prepareData
    this.source.prepareData = (data: GoodsModel[]) => {
      data.map((product: any) => {
        if (product['WarehouseUnit']) {
          product['UnitLabel'] = product['WarehouseUnit']['Name'];
        }
        // if (product['Categories']) {
        //   product['Categories'] = product['Categories'].map(cate => cate['text']).join(', ');
        // }
        if (product['FeaturePictureThumbnail']) {
          product['FeaturePictureThumbnail'] += '?token=' + this.apiService.getAccessToken();
        } else {
          delete product['FeaturePictureThumbnail'];
        }
        return product;
      });
      return data;
    };

    // Set DataSource: prepareParams
    this.source.prepareParams = (params: any) => {
      params['masterPriceTable'] = this.array.controls[0].get('Code').value;
      params['includeCategories'] = true;
      params['includeGroups'] = true;
      params['includeUnit'] = true;
      params['includeContainer'] = true;
      params['includeFeaturePicture'] = true;
      params['includeHeadBookEntry'] = true;
      // params['filter_Warehouse'] = this.commonService.getObjectId(this.array.controls[0].get('Warehouse').value);
      params['sort_Id'] = 'desc';
      return params;
    };

    return this.source;
  }

  /** Get data from api and push to list */
  loadList(callback?: (list: GoodsModel[]) => void) {
    this.selectedIds = [];
    this.hasSelect = 'none';
    if (!this.source) {
      this.initDataSource();
    } else {
      this.source.refresh();
    }
  }

  /** Edit event */
  onEditAction(event: { data: GoodsModel }) {
    // this.router.navigate(['modules/manager/form', event.data[this.idKey]]);
    this.openProductForm([event.data['Code']]);
  }

  /** Implement required */
  openProductForm(ids?: string[], onDialogSave?: (newData: GoodsModel[]) => void, onDialogClose?: () => void) {
    this.commonService.openDialog(ProductFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: GoodsModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
          this.loadList();
        },
      },
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
  }

  /** Create and multi edit/delete action */
  onSerialAction(event: any) {
    if (this.selectedIds.length > 0) {
      this.editChoosedItems();
    } else {
      // this.router.navigate(['modules/manager/form']);
      this.openProductForm();
    }
  }

  editChoosedItems(): false {
    this.commonService.openDialog(ShowcaseDialogComponent, {
      context: {
        title: 'Xác nhận',
        content: 'Bạn muốn chỉnh sửa các dữ liệu đã chọn hay xoá chúng ?',
        actions: [
          // {
          //   label: 'Xoá',
          //   icon: 'delete',
          //   status: 'danger',
          //   action: () => {
          //     this.deleteConfirm(this.selectedIds, () => this.loadList());
          //   },
          // },
          {
            label: 'Trở về',
            icon: 'back',
            status: 'success',
            action: () => { },
          },
          {
            label: 'Chỉnh',
            icon: 'edit',
            status: 'warning',
            action: () => {
              // this.router.navigate(['modules/manager/form/', this.selectedIds.join('-')]);
              this.openProductForm(this.selectedIds);
            },
          },
        ],
      },
    });
    return false;
  }

  /** End Common function for ng2-smart-table */

}

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef, NbThemeService } from '@nebular/theme';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { CommonService } from '../../../../services/common.service';
import { WordpressProductFormComponent } from '../product-form/product-form.component';
import { ProductModel } from '../../../../models/product.model';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { DatePipe } from '@angular/common';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/cell/date.component';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { agMakeImageColDef } from '../../../../lib/custom-element/ag-list/column-define/image.define';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { agMakeTagsColDef } from '../../../../lib/custom-element/ag-list/column-define/tags.define';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { WordpressService } from '../../wordpress.service';
import { filter, take, takeUntil } from 'rxjs/operators';
import { WpSiteModel } from '../../../../models/wordpress.model';
import { ProductListComponent } from '../../../admin-product/product/product-list/product-list.component';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { FormGroup } from '@angular/forms';
import { agMakeCurrencyColDef } from '../../../../lib/custom-element/ag-list/column-define/currency.define';
import { AgCurrencyCellInput } from '../../../../lib/custom-element/ag-list/cell/input/curency.component';

@Component({
  selector: 'ngx-wp-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class WordpressProductListComponent extends AgGridDataManagerListComponent<ProductModel, WordpressProductFormComponent> implements OnInit {

  componentName: string = 'WordpressProductListComponent';
  formPath = '';
  apiPath = '/wordpress/products';
  idKey = ['Id'];
  formDialog = WordpressProductFormComponent;

  // AG-Grid config
  public rowHeight: number = 50;
  // @Input() suppressRowClickSelection = false;

  @Input() gridHeight = '100%';
  refCategoryList = [];
  siteList: WpSiteModel[];
  refCategoriesLoading = false;

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<WordpressProductListComponent>,
    public datePipe: DatePipe,
    public wordpressService: WordpressService,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, themeService, ref);

    this.defaultColDef = {
      ...this.defaultColDef,
      cellClass: 'ag-cell-items-center',
    }

    this.pagination = false;
    // this.maxBlocksInCache = 5;
    this.paginationPageSize = 100;
    this.cacheBlockSize = 100;
  }

  async init() {
    return super.init().then(async state => {

      // const processingMap = AppModule.processMaps['purchaseOrder'];
      await this.cms.waitForLanguageLoaded();
      this.columnDefs = this.configSetting([
        {
          ...agMakeSelectionColDef(this.cms),
          headerName: 'ID',
          field: 'Id',
          width: 100,
          valueGetter: 'node.data.Id',
          // sortingOrder: ['desc', 'asc'],
          initialSort: 'desc',
        },
        {
          ...agMakeImageColDef(this.cms, null, (rowData) => {
            return rowData.Pictures?.map(m => m['LargeImage']);
          }),
          headerName: 'Hình',
          pinned: 'left',
          field: 'FeaturePicture',
          width: 100,
        },
        {
          headerName: 'Sản phẩm',
          field: 'Name',
          width: 300,
          pinned: 'left',
          filter: 'agTextColumnFilter', 
          autoHeight: true,
        },
        {
          headerName: 'Danh mục',
          field: 'Categories',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/admin-product/categories', { includeIdText: true, includeGroups: true, sort_Name: 'asc' }, {
                placeholder: 'Chọn danh mục...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                  return item;
                }
              }),
              multiple: true,
              logic: 'OR',
              allowClear: true,
            }
          },
        },
        {
          headerName: 'Danh mục WP',
          field: 'RefCategories',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'Sku',
          field: 'Sku',
          width: 120,
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          headerName: 'ID',
          field: 'Product',
          width: 150,
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          headerName: 'RefId',
          field: 'RefId',
          width: 100,
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          headerName: 'ĐVT',
          field: 'Unit',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: 'agTextColumnFilter',
        },
        // {
        //   ...agMakeTagsColDef(this.cms, (tag) => {
        //   }),
        //   headerName: 'ĐVT',
        //   field: 'Unit',
        //   width: 130,
        //   valueGetter: (params: { data: ProductModel }) => {
        //     return params.data?.Unit ?[params.data?.Unit] : [];
        //     // const baseUnitId = this.cms.getObjectId(params.data?.WarehouseUnit);
        //     // const baseUnitText = this.cms.getObjectText(params.data?.WarehouseUnit);
        //     // return params.data?.Units?.map(unit => {
        //     //   let text = '';
        //     //   if (baseUnitId == unit?.id) {
        //     //     text = unit.text;
        //     //   } else {
        //     //     text = `${unit.text} = ${unit.ConversionRatio} ${baseUnitText}`;
        //     //   }
        //     //   unit.toolTip = `${text} (${unit.IsAutoAdjustInventory ? 'Trừ kho tự động' : 'Không tự động trừ kho'}, ${unit.IsManageByAccessNumber ? 'Quản lý theo số truy xuất' : 'Không quản lý theo số truy xuất'})`;
        //     //   if (unit.IsManageByAccessNumber) {
        //     //     unit.status = 'danger';
        //     //   }
        //     //   if (!unit.IsAutoAdjustInventory) {
        //     //     unit.status = 'warning';
        //     //   }
        //     //   unit.label = `${unit.text} (${unit.ConversionRatio})`;
        //     //   return unit;
        //     // });
        //   },
        //   filter: AgSelect2Filter,
        //   filterParams: {
        //     select2Option: {
        //       ...this.cms.makeSelect2AjaxOption('/admin-product/units', { includeIdText: true, includeGroups: true, sort_Name: 'asc' }, {
        //         placeholder: 'Chọn liên hệ...', limit: 10, prepareReaultItem: (item) => {
        //           item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
        //           return item;
        //         }
        //       }),
        //       multiple: true,
        //       logic: 'OR',
        //       allowClear: true,
        //     }
        //   },
        // },
        {
          headerName: 'Site',
          field: 'Site',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          valueGetter: 'node.data.SiteName',
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'Cập nhật cuối',
          field: 'LastSync',
          width: 180,
          filter: 'agDateColumnFilter',
          pinned: 'right',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        {
          headerName: 'Giá niêm yết',
          field: 'Price',
          width: 150,
          filter: 'agTextColumnFilter',
          pinned: 'right',
          type: 'rightAligned',
          cellClass: ['ag-cell-items-center', 'ag-cell-justify-end'],
          cellRenderer: AgCurrencyCellInput,
          cellStyle: { border: "none" },
          cellRendererParams: {
            changed: (value, params) => {
              this.apiService.putPromise<any[]>('/wordpress/products/' + params.node.data.Id, {}, [{
                Id: params.node.data.Id,
                Price: value,
              }]).then(rs => {
                params.status = 'success';
              });
            }
          }
        },
        {
          headerName: 'Giá bán',
          field: 'SalePrice',
          width: 150,
          filter: 'agTextColumnFilter',
          pinned: 'right',
          type: 'rightAligned',
          cellClass: ['ag-cell-items-center', 'ag-cell-justify-end'],
          cellRenderer: AgCurrencyCellInput,
          cellStyle: { border: "none" },
          cellRendererParams: {
            changed: (value, params) => {
              this.apiService.putPromise<any[]>('/wordpress/products/' + params.node.data.Id, {}, [{
                Id: params.node.data.Id,
                SalePrice: value,
              }]).then(rs => {
                params.status = 'success';
              });
            }
          }
        },
        {
          ...agMakeCommandColDef(this, this.cms, false, true, false),
          headerName: 'Lệnh',
        },
      ] as ColDef[]);

      await this.wordpressService.siteList$.pipe(takeUntil(this.destroy$), filter(f => f && f.length > 0), take(1)).toPromise().then(siteList => {
        this.siteList = siteList;
      });

      this.actionButtonList.unshift({
        name: 'importProducts',
        status: 'primary',
        label: this.cms.textTransform(this.cms.translate.instant('Import'), 'head-title'),
        icon: 'download-outline',
        title: this.cms.textTransform(this.cms.translate.instant('Import'), 'head-title'),
        size: 'medium',
        disabled: () => !this.wordpressService.currentSite$?.value,
        hidden: () => false,
        click: () => {
          // if (!this.productListDialog) {
          this.cms.openDialog(ProductListComponent, {
            context: {
              // showLoadinng: true,
              inputMode: 'dialog',
              width: '90%',
              height: '95vh',
              maxBlocksInCache: 100,
              // paginationAutoPageSize: true,
              pagination: true,
              // pagingConfig: { display: true, perPage: 100 },
              paginationPageSize: 300,
              cacheBlockSize: 300,
              reuseDialog: true,
              rowMultiSelectWithClick: true,
              onDialogClose: () => {
                // if (onDialogClose) onDialogClose();
                // this.refresh();
              },
              onDialogChoose: async (chooseItems) => {
                console.log(chooseItems);

                if (!this.cms.getObjectId(this.wordpressService.currentSite$?.value)) {
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
                      Site: this.cms.getObjectId(this.wordpressService.currentSite$?.value),
                      SiteName: this.cms.getObjectText(this.wordpressService.currentSite$?.value),
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
                      Site: this.cms.getObjectId(this.wordpressService.currentSite$?.value),
                      SiteName: this.cms.getObjectText(this.wordpressService.currentSite$?.value),
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
                        Site: this.cms.getObjectId(this.wordpressService.currentSite$?.value),
                        SiteName: this.cms.getObjectText(this.wordpressService.currentSite$?.value),
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
        disabled: () => this.selectedIds.length === 0 || this.refCategoriesLoading,
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
                    // closeOnSelect: false,
                    allowHtml: true,
                    tags: true,
                    templateResult: (d) => { return d.html ? $(`<span>${d.html}</span>`) : d.text; },
                    templateSelection: (d) => { return d.text; },
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

                      const selectedItems = this.selectedItems;
                      for (const selectedItem of selectedItems) {
                        if (!selectedItem.RefCategories) {
                          selectedItem.RefCategories = [];
                        }
                        for (const cate of categories) {
                          if (!selectedItem.RefCategories.some(s => this.cms.getObjectId(s) == this.cms.getObjectId(cate))) {
                            selectedItem.RefCategories.push({ ...cate, text: cate.name });
                          }
                        }
                      }

                      await this.apiService.putPromise<any[]>('/wordpress/products', { id: this.selectedIds }, selectedItems.map(m => ({
                        Id: m.Id,
                        RefCategories: m.RefCategories,
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
                        RefCategories: (m.RefCategories || []).filter(f => !categories.some(s => this.cms.getObjectId(s) == this.cms.getObjectId(f))),
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
        disabled: () => !this.wordpressService.currentSite$?.value,
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
                  name: 'IncreaseByPercent',
                  label: 'Tăng giá niêm yết (%)',
                  placeholder: 'Tăng giá niêm yết (%)',
                  type: 'text',
                  initValue: 0,
                  // focus: true,
                },
                {
                  name: 'DiscountByPercent',
                  label: 'Giảm giá theo niêm yết (%)',
                  placeholder: 'Giảm giá theo niêm yết (%)',
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
                    const increaseByPercent = form.get('IncreaseByPercent').value;
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
                          if (this.cms.getObjectId(this.wordpressService.currentSite$?.value) && this.cms.getObjectId(masterPriceTable)) {
                            this.apiService.putPromise<any[]>('/wordpress/sites/' + this.cms.getObjectId(this.wordpressService.currentSite$?.value), { assignMasterPriceTable: this.cms.getObjectId(masterPriceTable), increaseByPercent: increaseByPercent, discountByPercent: discountByPercent }, [
                              {
                                Code: this.cms.getObjectId(this.wordpressService.currentSite$?.value),
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
            allowClear: false,
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
        value: this.wordpressService.currentSite$?.value,
        change: async (value: any, option: any) => {
          // this.contraAccount$.next((value || []).map(m => this.cms.getObjectId(m)));
          this.cms.takeOnce('wordpress_load_ref_categories', 500).then(async () => {
            if (this.cms.getObjectId(this.wordpressService.currentSite$?.value) != this.cms.getObjectId(value) || this.refCategoryList.length == 0) {
              // this.workingSite = value;
              this.wordpressService.currentSite$.next(value);
              await this.refresh();

              // Get ref categories
              if (this.cms.getObjectId(value) != 'NONE') {
                this.refCategoriesLoading = true;
                const toastRef = this.cms.showToast('Đang tải danh mục wordpress ' + this.cms.getObjectText(value), 'Tải danh mục wordpress', { status: 'info', duration: 60000 });
                this.refCategoryList = await this.apiService.getPromise<any[]>('/wordpress/ref-categories', { site: this.cms.getObjectId(value), limit: 'nolimit', loadByTree: true }).then(rs => {

                  function extractTreeToList(list: any[], lv?: number): any[] {
                    let results = [];
                    lv = lv || 0;
                    for (const item of list) {
                      // item.lv = lv;
                      item.text = item.name;
                      item.html = (new Array(lv + 1).join('&nbsp;&nbsp;')) + item.name;
                      // item.text = item.name;
                      results.push(item);
                      if (item['children']) {
                        results = [
                          ...results,
                          ...extractTreeToList(item['children'], lv + 1),
                        ];
                      }
                      delete item['children'];
                    }
                    return results;
                  }

                  const results = extractTreeToList(rs);
                  return results;
                  // return rs.map(m => {
                  //   m.text = m.name;
                  //   return m;
                  // });
                }).catch(err => {
                  this.refCategoriesLoading = false;
                  toastRef.close();
                  return Promise.reject(err);
                });
                this.refCategoriesLoading = false;
                toastRef.close();
                console.log(this.refCategoryList);
              } else {
                this.refCategoryList = [];
              }
            }
          });

        },
        disabled: () => {
          return this.loading;
        },
        click: () => {
          // this.gotoForm();
          return false;
        },
      });

      return state;
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

  // @Input() getRowHeight = (params: RowHeightParams<CommercePosOrderModel>) => {
  //   return 123;
  // }

  prepareApiParams(params: any, getRowParams: IGetRowsParams) {
    params['includeContact'] = true;
    params['includeObject'] = true;
    params['includeCreator'] = true;
    params['includeRelativeVouchers'] = true;

    if (this.cms.getObjectId(this.wordpressService.currentSite$?.value) != 'ALL' && this.cms.getObjectId(this.wordpressService.currentSite$?.value) != 'NONE') {
      params['eq_Site'] = this.cms.getObjectId(this.wordpressService.currentSite$?.value);
    }
    
    // params['sort_Id'] = 'desc';
    return params;
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: ProductModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(WordpressProductFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: ProductModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
        },
      },
    });
    return false;
  }

  onGridReady(params) {
    super.onGridReady(params);
  }
}

import { SalesPriceTableModel } from './../../../../models/sales.model';
import { Component, OnInit, Type } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { SalesMasterPriceTableModel, SalesPriceTableDetailModel, SalesMasterPriceTableDetailModel } from '../../../../models/sales.model';
import { environment } from '../../../../../environments/environment';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel, ProductCategoryModel, ProductGroupModel } from '../../../../models/product.model';
import { ProductListComponent } from '../../../admin-product/product/product-list/product-list.component';
import { SmartTableThumbnailComponent, SmartTableCheckboxComponent, SmartTableCurrencyEditableComponent, SmartTableTagsComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSelect2FilterComponent, SmartTableFilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { CustomServerDataSource } from '../../../../lib/custom-element/smart-table/custom-server.data-source';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { SalesProductDemoTemPrintComponent } from '../../product/product-demo-tem-print/product-demo-tem-print.component';
import { MasterPriceTablePrintComponent } from '../master-price-table-print/master-price-table-print.component';
import { WarehouseGoodsContainerModel } from '../../../../models/warehouse.model';
import { ThisReceiver } from '@angular/compiler';
import { ImagesViewerComponent } from '../../../../lib/custom-element/my-components/images-viewer/images-viewer.component';

@Component({
  selector: 'ngx-master-price-table-form',
  templateUrl: './master-price-table-form.component.html',
  styleUrls: ['./master-price-table-form.component.scss'],
})
export class MasterPriceTableFormComponent extends DataManagerFormComponent<SalesMasterPriceTableModel> implements OnInit {

  componentName: string = 'MasterPriceTableFormComponent';
  idKey = 'Code';
  apiPath = '/sales/master-price-tables';
  baseFormUrl = '/sales/master-price-table/form';

  env = environment;

  locale = this.cms.getCurrentLoaleDataset();
  // curencyFormat: CurrencyMaskConfig = { prefix: '', suffix: ' ' + this.locale[15], thousands: this.locale[13][1], decimal: this.locale[13][0], precision: 0, align: 'right', allowNegative: false };
  // numberFormat: CurrencyMaskConfig = { prefix: '', suffix: '', thousands: this.locale[13][1], decimal: this.locale[13][0], precision: 0, align: 'right', allowNegative: false };
  // numberFormat = getLocaleNumberFormat('vi', NumberFormatStyle.Decimal);

  /** Tax list */
  static _taxList: (TaxModel & { id?: string, text?: string })[];
  taxList: (TaxModel & { id?: string, text?: string })[];

  /** Unit list */
  static _unitList: (UnitModel & { id?: string, text?: string })[];
  unitList: (UnitModel & { id?: string, text?: string })[];

  select2ContactOption = {
    placeholder: 'Chọn liên hệ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      // url: params => {
      //   return this.apiService.buildApiUrl('/contact/contacts', { filter_Name: params['term'] ? params['term'] : '' });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/contact/contacts', { filter_Name: params['term'] ? params['term'] : '' }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Name'];
            return item;
          }),
        };
      },
    },
  };

  printTemplateList: { id: string, text: string, name: Type<DataManagerPrintComponent<SalesMasterPriceTableModel>> }[] = [
    // {
    //   id: 'PriceTablePrintAsListComponent',
    //   text: this.cms.textTransform(this.cms.translate.instant('Print.listTemplate'), 'head-title'),
    //   name: PriceTablePrintAsListComponent,
    // },
    {
      id: 'PriceTablePrintComponent',
      text: this.cms.textTransform(this.cms.translate.instant('Print.gridTemplate'), 'head-title'),
      name: MasterPriceTablePrintComponent,
    },
  ];

  typeList: { id: string, text: string }[] = [
    {
      id: 'RETAIL',
      text: this.cms.textTransform(this.cms.translate.instant('Sales.retail'), 'head-title'),
    },
    {
      id: 'WHOLESALE',
      text: this.cms.textTransform(this.cms.translate.instant('Sales.wholesale'), 'head-title'),
    },
  ];

  priceTableList: (SalesMasterPriceTableModel & { id?: string, text?: string })[] = [];
  select2OptionForParent = {
    placeholder: 'Chọn bảng giá cha...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<MasterPriceTableFormComponent>,
    // public currencyPipe: CurrencyPipe,
    public decimalPipe: DecimalPipe,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  select2OptionForProduct = {
    placeholder: 'Chọn Hàng hoá/dịch vụ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      // url: params => {
      //   return this.apiService.buildApiUrl('/admin-product/products', { includeUnit: true, 'filter_Name': params['term'] });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/admin-product/products', { includeUnit: true, 'filter_Name': params['term'] }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Name'];
            return item;
          }),
        };
      },
    },
  };

  select2OptionForUnit = {
    placeholder: 'Chọn ĐVT...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    // ajax: {
    //   url: params => {
    //     return this.apiService.buildApiUrl('/admin-product/units', { 'filter_Name': params['term'] });
    //   },
    //   delay: 300,
    //   processResults: (data: any, params: any) => {
    //     // console.info(data, params);
    //     return {
    //       results: data.map(item => {
    //         item['id'] = item['Code'];
    //         item['text'] = item['Name'];
    //         return item;
    //       }),
    //     };
    //   },
    // },
  };

  select2OptionForTax = {
    placeholder: 'Chọn thuế...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    // multiple: false,
    // ajax: {
    //   url: params => {
    //     return this.apiService.buildApiUrl('/accounting/taxes', { 'filter_Name': params['term'] });
    //   },
    //   delay: 300,
    //   processResults: (data: any, params: any) => {
    //     // console.info(data, params);
    //     return {
    //       results: data.map(item => {
    //         item['id'] = item['Code'];
    //         item['text'] = item['Name'];
    //         return item;
    //       }),
    //     };
    //   },
    // },
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init(): Promise<boolean> {
    await this.loadCache();
    /** Load and cache tax list */
    this.taxList = (await this.apiService.getPromise<TaxModel[]>('/accounting/taxes')).map(tax => {
      tax['id'] = tax.Code;
      tax['text'] = tax.Name;
      return tax;
    });
    // if (!SalesPriceReportFormComponent._taxList) {
    // } else {
    //   this.taxList = SalesPriceReportFormComponent._taxList;
    // }

    /** Load and cache unit list */
    this.unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units', { limit: 'nolimit' })).map(tax => {
      tax['id'] = tax.Code;
      tax['text'] = tax.Name;
      return tax;
    });
    // if (!SalesPriceReportFormComponent._unitList) {
    // } else {
    //   this.unitList = SalesPriceReportFormComponent._unitList;
    // }

    /** Load and cache sales price table list */
    // this.priceTableList = (await this.apiService.getPromise<SalesMasterPriceTableModel[]>('/sales/master-price-tables', { sort_Name: 'desc' })).map(item => ({ ...item, id: item.Code, text: '[' + item.Code + '] ' + item.Title }));

    return super.init();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: SalesMasterPriceTableModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeConditions'] = true;
    // params['includeProduct'] = true;
    params['includeContact'] = true;
    // params['includeDetails'] = true;
    params['useBaseTimezone'] = true;
    // params['includeDetails'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: SalesMasterPriceTableModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: SalesMasterPriceTableModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Details form load
      // if (itemFormData.Details) {
      //   itemFormData.Details.forEach(condition => {
      //     const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, condition);
      //     const details = this.getDetails(newForm);
      //     details.push(newDetailFormGroup);
      //     // const comIndex = details.length - 1;
      //     this.onAddDetailFormGroup(newForm, newDetailFormGroup);
      //   });
      // }

      // if (itemFormData.Details) {
      //   this.gridReady$.pipe(takeUntil(this.destroy$)).subscribe(ready => {
      //     if (ready) {
      //       this.gridApi.setRowData([]);
      //       this.gridApi.updateRowData({
      //         add: itemFormData.Details.map((item: any, index2: number) => ({ ...item, Product: item['Product'] && item['Product']['id'] ? item['Product']['id'] : item['Product'] })),
      //       });
      //     }
      //   });
      // }

      // Load details
      this.loadList();

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: SalesMasterPriceTableModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      // Object: [''],
      // ObjectName: [''],
      // ObjectEmail: [''],
      // ObjectPhone: [''],
      // ObjectAddress: [''],
      // Recipient: [''],
      // ObjectTaxCode: [''],
      // DirectReceiverName: [''],
      // ObjectBankName: [''],
      // ObjectBankCode: [''],
      // PaymentStep: [''],
      // DeliveryAddress: [''],
      // Parent: [''],
      Title: [''],
      Type: ['', Validators.required],
      Description: [''],
      // DateOfApproved: [''],
      PrintTemplate: ['MasterPriceTablePrintComponent'],
      // _total: [''],
      // Details: this.formBuilder.array([]),
    });
    if (data) {
      // data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    } else {
      // this.addDetailFormGroup(newForm);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: SalesMasterPriceTableModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/sales/master-price-table/list']);
    } else {
      this.ref.close();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Detail Form */
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: SalesPriceTableDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      No: [''],
      Type: [''],
      Product: ['', Validators.required],
      Note: ['', Validators.required],
      Quantity: [1],
      Price: [0],
      Unit: [''],
      Tax: [''],
      ToMoney: [0],
      Image: [''],
      Reason: [''],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      newForm.patchValue(data);
      // this.toMoney(parentFormGroup, newForm);
    }
    return newForm;
  }
  getDetails(parentFormGroup: FormGroup) {
    return parentFormGroup.get('Details') as FormArray;
  }
  addDetailFormGroup(parentFormGroup: FormGroup) {
    const newChildFormGroup = this.makeNewDetailFormGroup(parentFormGroup);
    this.getDetails(parentFormGroup).push(newChildFormGroup);
    this.onAddDetailFormGroup(parentFormGroup, newChildFormGroup);
    return false;
  }
  removeDetailGroup(parentFormGroup: FormGroup, detail: FormGroup, index: number) {
    this.getDetails(parentFormGroup).removeAt(index);
    this.onRemoveDetailFormGroup(parentFormGroup, detail);
    return false;
  }
  onAddDetailFormGroup(parentFormGroup: FormGroup, newChildFormGroup: FormGroup) { }
  onRemoveDetailFormGroup(parentFormGroup: FormGroup, detailFormGroup: FormGroup) { }
  /** End Detail Form */

  onObjectChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        if (selectedData.Code) {
          // formGroup.get('ObjectName').setValue(selectedData.Name);
          // formGroup.get('ObjectPhone').setValue(selectedData.Phone);
          // formGroup.get('ObjectEmail').setValue(selectedData.Email);
          // formGroup.get('ObjectAddress').setValue(selectedData.Address);
          // formGroup.get('ObjectTaxCode').setValue(selectedData.TaxCode);
          // formGroup.get('ObjectBankName').setValue(selectedData.BankName);
          // formGroup.get('ObjectBankCode').setValue(selectedData.BankAcc);
        }
      }
    }

  }

  onSelectProduct(detail: FormGroup, selectedData: ProductModel) {
    console.log(selectedData);
    if (selectedData) {
      detail.get('Description').setValue(selectedData.Name);
      if (selectedData.WarehouseUnit && selectedData.WarehouseUnit.Code) {
        detail.get('Unit').patchValue({
          id: selectedData.WarehouseUnit['Code'],
          text: selectedData.WarehouseUnit['Name'],
          Code: selectedData.WarehouseUnit['Code'],
          Name: selectedData.WarehouseUnit['Name'],
          Symbol: selectedData.WarehouseUnit['Symbol'],
        });
      }
    } else {
      detail.get('Description').setValue('');
      detail.get('Unit').setValue('');
    }
    return false;
  }

  calculatToMoney(detail: FormGroup) {
    let toMoney = detail.get('Quantity').value * detail.get('Price').value;
    let tax = detail.get('Tax').value;
    if (tax) {
      if (typeof tax === 'string') {
        tax = this.taxList.filter(t => t.Code === tax)[0];
      }
      toMoney += toMoney * tax.Tax / 100;
    }
    return toMoney;
  }

  toMoney(formItem: FormGroup, detail: FormGroup) {
    detail.get('ToMoney').setValue(this.calculatToMoney(detail));

    // Call culate total
    const details = this.getDetails(formItem);
    let total = 0;
    for (let i = 0; i < details.controls.length; i++) {
      total += this.calculatToMoney(details.controls[i] as FormGroup);
    }
    formItem.get('_total').setValue(total);
    return false;
  }

  async preview(formItem: FormGroup) {
    const data: SalesMasterPriceTableModel = formItem.value;

    const printTemplate = this.printTemplateList.find((item: { id: string }) => item.id === formItem.get('PrintTemplate').value);
    if (printTemplate) {
      data.Details = (await this.apiService.getPromise<(SalesMasterPriceTableDetailModel & ProductModel & { string, Price?: string | number })[]>(
        '/sales/master-price-table-details',
        {
          excludeNoPrice: true,
          masterPriceTable: data.Code,
          includeUnit: true,
          includeFeaturePicture: true,
        }));
      // this.cms.openDialog(printTemplate.name, {
      //   context: {
      //     title: 'Xem trước',
      //     data: data,
      //     onSaveAndClose: (priceReportCode: string) => {
      //       this.saveAndClose();
      //     },
      //     onSaveAndPrint: (priceReportCode: string) => {
      //       this.save();
      //     },
      //   },
      // });
    } else {
      throw Error('Print.Error.noTemplateChoosed');
    }

    return false;
  }

  /** Implement required */
  openProductListDialplog(filter?: {}, onDialogChoose?: (newData: ProductModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(ProductListComponent, {
      context: {
        inputMode: 'dialog',
        // inputId: ids,
        onDialogChoose: (chooseItems: ProductModel[]) => {
          if (onDialogChoose) onDialogChoose(chooseItems);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
          // this.refresh();
        },
      },
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
  }

  // chooseProducts(formItem: FormGroup) {
  //   this.openProductListDialplog({}, choosedProducts => {
  //     console.log(choosedProducts);
  //     this.gridReady$.pipe(takeUntil(this.destroy$)).subscribe(isReady => {
  //       if (isReady) {
  //         // choosedProducts.forEach(product => {
  //         // const detail = this.makeNewDetailFormGroup(formItem, {
  //         //   Product: product as any,
  //         //   Note: product.Name,
  //         //   Unit: product.WarehouseUnit,
  //         // });
  //         // this.getDetails(formItem).controls.push(detail);

  //         this.gridApi.forEachNode(node => {
  //           choosedProducts = choosedProducts.filter(product => product.Code !== node.data['Product']);
  //         });
  //         if (choosedProducts.length > 0) {
  //           const total = this.gridApi.getDisplayedRowCount();
  //           this.gridApi.updateRowData({
  //             add: choosedProducts.map((product, index) => ({
  //               No: total + index + 1,
  //               Id: product.Code,
  //               PictureThumbnail: (product['FeaturePictureThumbnail'] ? (product['FeaturePictureThumbnail'].replace(/\?token=[^\&]*/, '')) : ''),
  //               Product: product.Code,
  //               Name: product.Name,
  //               Note: product.Description,
  //               Unit: product.WarehouseUnit,
  //             })),
  //           });
  //         }
  //         // });
  //       }
  //     });
  //   });
  // }

  /** Override for case : use Ag-Grid as details */
  getRawFormData() {
    const data = super.getRawFormData();
    data.array[0]['Details'] = [];
    // this.gridApi.forEachNode(node => {
    //   data.array[0]['Details'].push(node.data);
    // });
    // data['Details'] = this.rowData.map(item => ({...item, Name: item['Name'] ? item['Name'] : item['Sku']}));
    return data;
  }

  // clearDetails(formItem: FormGroup) {
  //   this.gridApi.setRowData([]);
  // }

  // removeDetails(formItem: FormGroup) {
  //   this.gridApi.updateRowData({
  //     remove: this.getSelectedRows(),
  //   });
  // }

  /** Common function for ng2-smart-table */

  // Category list for filter
  categoryList: (ProductCategoryModel & { id?: string, text?: string })[] = [];
  groupList: (ProductGroupModel & { id?: string, text?: string })[] = [];
  containerList: WarehouseGoodsContainerModel[] = [];

  async loadCache() {
    // iniit category
    this.categoryList = (await this.apiService.getPromise<ProductCategoryModel[]>('/admin-product/categories', { limit: 'nolimit' })).map(cate => ({ ...cate, id: cate.Code, text: cate.Name })) as any;
    this.groupList = (await this.apiService.getPromise<ProductCategoryModel[]>('/admin-product/groups', { limit: 'nolimit' })).map(cate => ({ ...cate, id: cate.Code, text: cate.Name })) as any;
    this.containerList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includePath: true, includeIdText: true, limit: 'nolimit' })).map(container => ({ ...container, text: container.Path })) as any;
  }

  editing = {};
  rows = [];

  settings = this.configSetting({
    mode: 'external',
    selectMode: 'multi',
    actions: false,
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
        },
      },
      Name: {
        title: 'Tên',
        type: 'string',
        width: '12%',
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
        // valuePrepareFunction: (value: string, product: ProductModel) => {
        //   return product['Categories'] ? product['Categories'].map(cate => cate['text']).join(', ') : '';
        // },
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
              // code template: smart-table fiter with data update
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
        width: '10%',
        valuePrepareFunction: (value: string, product: ProductModel) => {
          return product['Groups'] ? ('<span class="tag">' + product['Groups'].map(cate => cate['text']).join('</span><span class="tag">') + '</span>') : '';
        },
        // valuePrepareFunction: (value: string, product: ProductModel) => {
        //   return product['Categories'] ? product['Categories'].map(cate => cate['text']).join(', ') : '';
        // },
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
                    results: this.groupList.filter(cate => !params.term || this.cms.smartFilter(cate.text, params.term)),
                  };
                },
              },
            },
          },
        },
      },
      Unit: {
        title: 'ĐVT',
        type: 'string',
        width: '10%',
        valuePrepareFunction: (cell: any, row: any) => {
          return this.cms.getObjectText(cell);
        },
        filter: {
          type: 'custom',
          component: SmartTableSelect2FilterComponent,
          config: {
            condition: 'eq',
            delay: 0,
            select2Option: {
              placeholder: this.cms.translateText('AdminProduct.Unit.title', { action: this.cms.translateText('Common.choose'), definition: '' }),
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
                    results: this.unitList.filter(cate => !params.term || this.cms.smartFilter(cate.text, params.term)),
                  };
                },
              },
            },
          },
        },
      },
      BaseUnit: {
        title: 'ĐVT cơ bản',
        type: 'boolean',
        width: '10%',
        filter: {
          type: 'custom',
          component: SmartTableSelect2FilterComponent,
          config: {
            delay: 0,
            condition: 'eq',
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
              data: [
                { id: 'BASEUNIT', text: 'ĐVT cơ bản' },
                { id: 'ALL', text: 'Tất cả' },
              ],
            },
          },
        },
      },
      // Containers: {
      //   title: this.cms.textTransform(this.cms.translate.instant('Warehouse.container'), 'head-title'),
      //   type: 'html',
      //   onComponentInitFunction: (instance: SmartTableTagsComponent) => {
      //     // instance.click.subscribe((tag: { id: string, text: string, type: string }) => this.cms.previewVoucher(tag.type, tag.id));
      //   },
      //   valuePrepareFunction: (cell: any, row) => {
      //     return cell ? (cell.map(container => this.cms.getObjectText(container)).join('<br>')) : '';
      //   },
      //   width: '15%',
      //   // filter: {
      //   //   type: 'custom',
      //   //   component: SmartTableSelect2FilterComponent,
      //   //   config: {
      //   //     delay: 0,
      //   //     select2Option: {
      //   //       placeholder: this.cms.translateText('Warehouse.GoodsContainer.title', { action: this.cms.translateText('Common.choose'), definition: '' }),
      //   //       allowClear: true,
      //   //       width: '100%',
      //   //       dropdownAutoWidth: true,
      //   //       minimumInputLength: 0,
      //   //       keyMap: {
      //   //         id: 'id',
      //   //         text: 'text',
      //   //       },
      //   //       multiple: true,
      //   //       logic: 'OR',
      //   //       ajax: {
      //   //         url: (params: any) => {
      //   //           return 'data:text/plan,[]';
      //   //         },
      //   //         delay: 0,
      //   //         processResults: (data: any, params: any) => {
      //   //           return {
      //   //             results: this.containerList.filter(cate => !params.term || this.cms.smartFilter(cate.text, params.term)),
      //   //           };
      //   //         },
      //   //       },
      //   //     },
      //   //   },
      //   // },
      // },
      // Containers: {
      //   title: this.cms.translateText('Warehouse.GoodsContainer.title', { action: '', definition: '' }),
      //   type: 'html',
      //   width: '15%',
      //   valuePrepareFunction: (value: any, product: ProductModel) => {
      //     return value && (value.map(container => this.cms.getObjectText(container).join('<br>'))) || '';
      //   },
      // },
      Code: {
        title: 'Code',
        type: 'string',
        width: '5%',
      },
      Sku: {
        title: 'Sku',
        type: 'string',
        width: '13%',
      },
      Price: {
        title: 'Price',
        width: '20%',
        type: 'currency-editable',
        editable: true,
        delay: 3000,
        onChange: (value: number, row: ProductModel, instance: SmartTableCurrencyEditableComponent) => {
          const masterPriceTable = this.array.controls[0].get('Code').value;
          if (value) {
            if (row.WarehouseUnit.Code) {
              // if (!instance.isPatchingValue) {
              instance.status = 'primary';
              console.log(instance.rowData.Code);
              this.apiService.putPromise<SalesMasterPriceTableDetailModel[]>('/sales/master-price-table-details', {}, [{
                MasterPriceTable: masterPriceTable,
                Product: row.Code,
                Unit: row.WarehouseUnit.Code,
                Price: value,
              }]).then(rs => {
                // console.log(rs);
                console.log(instance.rowData.Code);
                instance.status = 'success';
                // setTimeout(() => {
                //   console.log(instance.rowData.Code);
                //   instance.status = '';
                // }, 15000);
              });
              // }
            } else {
              instance.status = 'danger';
              this.cms.openDialog(ShowcaseDialogComponent, {
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
          // }
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
        settings.columns[key]['filterFunction'] = (value: string, query: string) => this.cms.smartFilter(value, query);
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
  source: CustomServerDataSource<ProductModel>;

  // initDataSource() {
  //   return this.source = new CustomeServerDataSource<SalesMasterPriceTableDetailModel>(this.apiService, '/sales/master-price-table-details');
  // }

  initDataSource() {
    this.source = new CustomServerDataSource<ProductModel>(this.apiService, this.cms, '/sales/master-price-table-details');

    // Set DataSource: prepareData
    this.source.prepareData = (data: ProductModel[]) => {
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
      params['includeFeaturePicture'] = true;
      params['sort_Id'] = 'desc';
      params['group_Unit'] = true;
      params['includeContainers'] = true;
      return params;
    };

    return this.source;
  }

  /** Get data from api and push to list */
  loadList(callback?: (list: ProductModel[]) => void) {
    this.selectedIds = [];
    this.hasSelect = 'none';
    if (!this.source) {
      this.initDataSource();
    } else {
      this.source.refresh();
    }
  }

  /** Edit event */
  onEditAction(event: { data: ProductModel }) {
    // this.router.navigate(['modules/manager/form', event.data[this.idKey]]);
    this.openProductForm([event.data['Code']]);
  }

  /** Implement required */
  openProductForm(ids?: string[], onDialogSave?: (newData: ProductModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(ProductFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: ProductModel[]) => {
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
    this.cms.openDialog(ShowcaseDialogComponent, {
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

  makeDetailId(item: SalesPriceTableDetailModel) {
    return ['Code', 'WarehouseUnit'].map(key => this.encodeId(item[key])).join('-');
  }

  printQrcode(priceTable: SalesPriceTableModel) {
    this.cms.openDialog(SalesProductDemoTemPrintComponent, {
      context: {
        priceTable: priceTable.Code,
        id: this.selectedItems.map(item => this.makeDetailId(item as any)),
      }
    });
  }
}

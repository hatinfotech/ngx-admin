import { Component, OnInit, Type } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { SalesMasterPriceTableModel, SalesPriceTableDetailModel, SalesMasterPriceTableDetailModel } from '../../../../models/sales.model';
import { environment } from '../../../../../environments/environment';
import { CurrencyMaskConfig } from 'ng2-currency-mask/src/currency-mask.config';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { CurrencyPipe } from '@angular/common';
import { SalesPriceReportFormComponent } from '../../price-report/sales-price-report-form/sales-price-report-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { ProductListComponent } from '../../../admin-product/product/product-list/product-list.component';
import { MasterPriceTablePrintComponent } from '../master-price-table-print/master-price-table-print.component';
import { SmartTableThumbnailComponent, SmartTableCheckboxComponent, SmartTableCurrencyEditableComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSelect2FilterComponent, SmartTableFilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { CustomeServerDataSource } from '../../../../lib/custom-element/smart-table/customer-server.data-source';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';

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

  locale = this.commonService.getCurrentLoaleDataset();
  curencyFormat: CurrencyMaskConfig = { prefix: '', suffix: ' ' + this.locale[15], thousands: this.locale[13][1], decimal: this.locale[13][0], precision: 0, align: 'right', allowNegative: false };
  numberFormat: CurrencyMaskConfig = { prefix: '', suffix: '', thousands: this.locale[13][1], decimal: this.locale[13][0], precision: 0, align: 'right', allowNegative: false };
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
      url: params => {
        return this.apiService.buildApiUrl('/contact/contacts', { filter_Name: params['term'] ? params['term'] : '' });
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
    //   text: this.commonService.textTransform(this.commonService.translate.instant('Print.listTemplate'), 'head-title'),
    //   name: PriceTablePrintAsListComponent,
    // },
    {
      id: 'PriceTablePrintComponent',
      text: this.commonService.textTransform(this.commonService.translate.instant('Print.gridTemplate'), 'head-title'),
      name: MasterPriceTablePrintComponent,
    },
  ];

  typeList: { id: string, text: string }[] = [
    {
      id: 'RETAIL',
      text: this.commonService.textTransform(this.commonService.translate.instant('Sales.retail'), 'head-title'),
    },
    {
      id: 'WHOLESALE',
      text: this.commonService.textTransform(this.commonService.translate.instant('Sales.wholesale'), 'head-title'),
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
    public commonService: CommonService,
    public ref: NbDialogRef<MasterPriceTableFormComponent>,
    public currencyPipe: CurrencyPipe,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
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
      url: params => {
        return this.apiService.buildApiUrl('/admin-product/products', { includeUnit: true, 'filter_Name': params['term'] });
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

    /** Load and cache tax list */
    if (!SalesPriceReportFormComponent._taxList) {
      this.taxList = SalesPriceReportFormComponent._taxList = (await this.apiService.getPromise<TaxModel[]>('/accounting/taxes')).map(tax => {
        tax['id'] = tax.Code;
        tax['text'] = tax.Name;
        return tax;
      });
    } else {
      this.taxList = SalesPriceReportFormComponent._taxList;
    }

    /** Load and cache unit list */
    if (!SalesPriceReportFormComponent._unitList) {
      this.unitList = SalesPriceReportFormComponent._unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units')).map(tax => {
        tax['id'] = tax.Code;
        tax['text'] = tax.Name;
        return tax;
      });
    } else {
      this.unitList = SalesPriceReportFormComponent._unitList;
    }

    /** Load and cache sales price table list */
    // this.priceTableList = (await this.apiService.getPromise<SalesMasterPriceTableModel[]>('/sales/master-price-tables', { sort_Name: 'desc' })).map(item => ({ ...item, id: item.Code, text: '[' + item.Code + '] ' + item.Title }));

    return super.init();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: SalesMasterPriceTableModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeConditions'] = true;
    // params['includeProduct'] = true;
    params['includeContact'] = true;
    params['includeDetails'] = true;
    params['useBaseTimezone'] = true;
    params['includeDetails'] = true;
    super.executeGet(params, success, error);
  }

  formLoad(formData: SalesMasterPriceTableModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: SalesMasterPriceTableModel) => void) {
    super.formLoad(formData, (index, newForm, itemFormData) => {

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

  preview(formItem: FormGroup) {
    const data: SalesMasterPriceTableModel = formItem.value;
    data.Details = [];
    // this.gridApi.forEachNode(node => {
    //   data.Details.push(node.data);
    // });
    // data.Details.forEach(detail => {
    //   if (typeof detail['Tax'] === 'string') {
    //     detail['Tax'] = this.taxList.filter(t => t.Code === detail['Tax'])[0] as any;
    //   }
    // });
    const printTemplate = this.printTemplateList.find((item: { id: string }) => item.id === formItem.get('PrintTemplate').value);
    if (printTemplate) {
      this.dialogService.open(printTemplate.name, {
        context: {
          title: 'Xem trước',
          data: data,
          onSaveAndClose: (priceReportCode: string) => {
            this.saveAndClose();
          },
          onSaveAndPrint: (priceReportCode: string) => {
            this.save();
          },
        },
      });
    } else {
      throw Error('Print.Error.noTemplateChoosed');
    }

    return false;
  }

  /** Implement required */
  openProductListDialplog(filter?: {}, onDialogChoose?: (newData: ProductModel[]) => void, onDialogClose?: () => void) {
    this.dialogService.open(ProductListComponent, {
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

  editing = {};
  rows = [];

  settings = this.configSetting({
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
        renderComponent: SmartTableThumbnailComponent,
        onComponentInitFunction: (instance: SmartTableThumbnailComponent) => {
          instance.valueChange.subscribe(value => {
          });
          instance.click.subscribe(async (row: ProductModel) => {
          });
        },
      },
      Name: {
        title: 'Tên',
        type: 'string',
        width: '20%',
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
        type: 'string',
        width: '20%',
        filter: {
          type: 'custom',
          component: SmartTableSelect2FilterComponent,
          config: {
            delay: 1000,
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
                  return this.apiService.buildApiUrl('/admin-product/categories', { 'filter_Name': params['term'] ? params['term'] : '', select: 'id=>Code,text=>Name' });
                },
                delay: 300,
                processResults: (data: any, params: any) => {
                  console.info(data, params);
                  return {
                    results: data.map(item => {
                      // item['id'] = item['Code'];
                      // item['text'] = item['Name'];
                      delete item['Id'];
                      return item;
                    }),
                  };
                },
              },
            }

          }
        },
      },
      UnitLabel: {
        title: 'ĐVT',
        type: 'string',
        width: '10%',
      },
      Code: {
        title: 'Code',
        type: 'string',
        width: '10%',
      },
      Sku: {
        title: 'Sku',
        type: 'string',
        width: '10%',
      },
      Price: {
        title: 'Price',
        width: '15%',
        type: 'currency-editable',
        editable: true,
        delay: 3000,
        onChange: (value: number, row: ProductModel) => {
          const masterPriceTable = this.array.controls[0].get('Code').value;
          // if (!masterPriceTable) {
          //   this.dialogService.open(ShowcaseDialogComponent, {
          //     context: {
          //       title: 'Xác nhận',
          //       content: 'Bảng giá cần được lưu trước khi nhập giá cho sản phẩm, bạn có muốn lưu không ?',
          //       actions: [
          //         {
          //           label: 'Trở về',
          //           icon: 'back',
          //           status: 'info',
          //           action: () => { },
          //         },
          //         {
          //           label: 'Lưu',
          //           icon: 'save',
          //           status: 'success',
          //           action: () => {
          //             // this.apiService.delete(this.apiPath, ids, result => {
          //             //   if (callback) callback();
          //             // });
          //             this.save();
          //           },
          //         },
          //       ],
          //     },
          //   });
          // } else {
          if (value) {
            if (row.WarehouseUnit.Code) {
              this.apiService.putPromise<SalesMasterPriceTableDetailModel[]>('/sales/master-price-table-details', {}, [{
                MasterPriceTable: masterPriceTable,
                Product: row.Code,
                Unit: row.WarehouseUnit.Code,
                Price: value,
              }]).then(rs => {
                console.log(rs);
              });
            } else {
              this.dialogService.open(ShowcaseDialogComponent, {
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
        settings.columns[key]['filterFunction'] = (value: string, query: string) => this.commonService.smartFilter(value, query);
      }

      if (column.type === 'boolean') {
        column.type = 'custom';
        column.renderComponent = SmartTableCheckboxComponent;
        column.onComponentInitFunction = (instance: SmartTableCheckboxComponent) => {
          instance.disable = !column.editable;
          instance.valueChange.asObservable().pipe(takeUntil(this.destroy$)).subscribe(value => {
            // console.info(value);
            if (column.onChange) {
              column.onChange(value, instance.rowData);
            }
          });
        };
      }

      if (column.type === 'currency-editable') {
        column.type = 'custom';
        column.renderComponent = SmartTableCurrencyEditableComponent;
        column.onComponentInitFunction = (instance: SmartTableCurrencyEditableComponent) => {
          instance.disable = !column.editable;
          instance.placeholder = column.title;
          instance.name = key;
          if (column.delay) {
            instance.delay = column.delay;
          }
          instance.valueChange.asObservable().pipe(takeUntil(this.destroy$)).subscribe(value => {
            if (column.onChange) {
              column.onChange(value, instance.rowData);
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
  source: CustomeServerDataSource<ProductModel>;

  // initDataSource() {
  //   return this.source = new CustomeServerDataSource<SalesMasterPriceTableDetailModel>(this.apiService, '/sales/master-price-table-details');
  // }

  initDataSource() {
    this.source = new CustomeServerDataSource<ProductModel>(this.apiService, '/sales/master-price-table-details');

    // Set DataSource: prepareData
    this.source.prepareData = (data: ProductModel[]) => {
      data.map((product: any) => {
        if (product['WarehouseUnit']) {
          product['UnitLabel'] = product['WarehouseUnit']['Name'];
        }
        if (product['Categories']) {
          product['Categories'] = product['Categories'].map(cate => cate['text']).join(', ');
        }
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
      params['includeUnit'] = true;
      params['includeFeaturePicture'] = true;
      params['sort_Id'] = 'desc';
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
    this.dialogService.open(ProductFormComponent, {
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
    this.dialogService.open(ShowcaseDialogComponent, {
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

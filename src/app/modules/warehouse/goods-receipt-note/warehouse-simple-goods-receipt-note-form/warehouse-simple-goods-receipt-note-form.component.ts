import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { WarehouseGoodsReceiptNoteModel, WarehouseGoodsReceiptNoteDetailModel, WarehouseGoodsContainerModel, GoodsModel, WarehouseModel } from '../../../../models/warehouse.model';
import { environment } from '../../../../../environments/environment';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { Select2Option, Select2Component } from '../../../../lib/custom-element/select2/select2.component';
import { ProductModel } from '../../../../models/product.model';
import { SalesPriceReportFormComponent } from '../../../sales/price-report/sales-price-report-form/sales-price-report-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ContactModel } from '../../../../models/contact.model';
import { WarehouseGoodsReceiptNotePrintComponent } from '../warehouse-goods-receipt-note-print/warehouse-goods-receipt-note-print.component';
import { delay } from 'rxjs/operators';
import { Select2SelectionObject } from '../../../../../vendor/ng2-select2/lib/ng2-select2.interface';

@Component({
  selector: 'ngx-warehouse-simple-goods-receipt-note-form',
  templateUrl: './warehouse-simple-goods-receipt-note-form.component.html',
  styleUrls: ['./warehouse-simple-goods-receipt-note-form.component.scss'],
})
export class WarehouseSimpleGoodsReceiptNoteFormComponent extends DataManagerFormComponent<WarehouseGoodsReceiptNoteModel> implements OnInit {

  componentName: string = 'WarehouseSimpleGoodsReceiptNoteFormComponent';
  idKey = 'Code';
  baseFormUrl = '/warehouse/goods-receipt-note/form';
  apiPath = '/warehouse/goods-receipt-notes';

  env = environment;

  locale = this.commonService.getCurrentLoaleDataset();
  // localeExtra = localeViExtra;
  curencyFormat: CurrencyMaskConfig = this.commonService.getCurrencyMaskConfig();
  numberFormat: CurrencyMaskConfig = this.commonService.getNumberMaskConfig();
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

  warehouseList: WarehouseModel[];
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
    public ref: NbDialogRef<WarehouseSimpleGoodsReceiptNoteFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
    this.actionButtonList.splice(this.actionButtonList.length - 2, 0, {
      name: 'print',
      status: 'primary',
      label: this.commonService.textTransform(this.commonService.translate.instant('Common.print'), 'head-title'),
      icon: 'printer',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.print'), 'head-title'),
      size: 'medium',
      disabled: () => this.isProcessing,
      hidden: () => false,
      click: (event: any, option: ActionControlListOption) => {
        this.preview(option.form);
      },
    });
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  select2OptionForProduct: Select2Option = {
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
        return this.apiService.buildApiUrl('/warehouse/goods', { 'filter_Name': params['term'], limit: 20, includeFeaturePicture: true, includeUnits: true, includeContainers: true });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Name'];
            item['image'] = item['FeaturePictureThumbnail'] ? (item['FeaturePictureThumbnail'] + '?token=' + this.apiService.getAccessToken()) : '';
            return item;
          }),
        };
      },
    },
    templateResult: (state: Select2SelectionObject & ProductModel): JQuery | string => {
      if (!state.id) {
        return state.text;
      }
      // tslint:disable-next-line: ban
      return $('\
      <div class="select2-results-option-with-image">\
        <div class="image-wrap" style="width: 3rem; height: 3rem;">\
          <div class="image" style="width: 3rem; height: 3rem; background-image: url(' + state.image + ')"></div>\
        </div>\
        <div class="text">' + state.text + (state.Units ? ('<br>' + this.commonService.translateText('Product.unit') + ': ' + state.Units.map(unit => unit.Name).join(', ')) : '') + '</div>\
      </div>');
    },
    templateSelection: (state: Select2SelectionObject & ProductModel): JQuery | string => {
      if (!state.id) {
        return state.text;
      }

      // tslint:disable-next-line: ban
      return $('<span>' + state.text + '</span>');
    },
  };

  goodsContainerList: WarehouseGoodsContainerModel[];
  select2OptionForContainer: Select2Option = {
    placeholder: 'Chọn cha...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'ProductCategory',
      text: 'ProductCategoryName',
    },
    matcher: (term: string, text: string, option: any) => {
      return this.commonService.smartFilter(text, term);
    },
    sorter: (data: WarehouseGoodsContainerModel[]) => {
      return data.sort((a, b) => a.text.localeCompare(b.text));
    },
    // multiple: false,
    // delay: 5000,
    // ajax: {
    //   url: (params: any) => {
    //     return 'data:text/plan,[]';
    //   },
    //   delay: 300,
    //   processResults: (data: any, params: any) => {
    //     const suggestedDataList = this.activeFormGroup ? this.activeFormGroup.get('Container')['dataList'] : null;
    //     return {
    //       results: (!params.term && suggestedDataList) ? suggestedDataList : this.goodsContainerList.filter((item: WarehouseGoodsContainerModel) => this.commonService.smartFilter(item.text, params.term)),
    //     };
    //   },
    // },
  };
  select2OptionForContainerAjax: Select2Option = {
    placeholder: 'Chọn cha...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'ProductCategory',
      text: 'ProductCategoryName',
    },
    // matcher: (term: string, text: string, option: any) => {
    //   return this.commonService.smartFilter(text, term);
    // },
    // sorter: (data: WarehouseGoodsContainerModel[]) => {
    //   return data.sort((a, b) => a.text.localeCompare(b.text));
    // },
    // multiple: false,
    // delay: 5000,
    ajax: {
      url: (params: any) => {
        return 'data:text/plan,[]';
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        const suggestedDataList = this.activeFormGroup ? this.activeFormGroup.get('Container')['dataList'] : null;
        return {
          results: (!params.term && suggestedDataList) ? suggestedDataList : this.goodsContainerList.filter((item: WarehouseGoodsContainerModel) => this.commonService.smartFilter(item.text, params.term)),
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
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init(): Promise<boolean> {
    this.warehouseList = await this.apiService.getPromise<WarehouseModel[]>('/warehouse/warehouses', { includeIdText: true, sort_Name: 'asc' });
    this.goodsContainerList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', {
      includeIdText: true, includePath: true, includeWarehouse: true,
      select: 'Parent=>Parent,Code=>Code,Name=>Name,Warehouse=>Warehouse',
    })).map(item => {
      item['text'] = item['Path'];
      return item;
    });

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
      this.taxList = SalesPriceReportFormComponent._taxList;
    }
    return super.init();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: WarehouseGoodsReceiptNoteModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeConditions'] = true;
    // params['includeProduct'] = true;
    params['includeObject'] = true;
    params['includeDetails'] = true;
    params['useBaseTimezone'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: WarehouseGoodsReceiptNoteModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: WarehouseGoodsReceiptNoteModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Details form load
      if (itemFormData.Details) {
        itemFormData.Details.forEach(detail => {
          const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, detail);
          newDetailFormGroup.get('Unit')['dataList'] = detail.Product.Units;
          const containers = [];
          try {
            containers.push({
              id: 'A-' + this.commonService.translateText('Common.suggest'),
              text: 'A-' + this.commonService.translateText('Common.suggest'),
              children: detail.Product.Units.find(unit => this.commonService.getObjectId(unit) === this.commonService.getObjectId(detail.Unit))['Containers'],
            });
          } catch (e) { console.log(e); }

          containers.push({
            id: 'B-' + this.commonService.translateText('Common.all'),
            text: 'B-' + this.commonService.translateText('Common.all'),
            children: this.goodsContainerList,
          });
          newDetailFormGroup.get('Container')['dataList'] = containers;

          if (detail.ImageThumbnail) {
            newDetailFormGroup.get('Image')['thumbnail'] = detail.ImageThumbnail + '?token=' + this.apiService.getAccessToken();
          }
          const details = this.getDetails(newForm);
          details.push(newDetailFormGroup);
          // const comIndex = details.length - 1;
          this.onAddDetailFormGroup(newForm, newDetailFormGroup);
          // this.toMoney(newForm, newDetailFormGroup);
        });
      }

      // // Actions form load
      // if (itemFormData.Actions) {
      //   itemFormData.Actions.forEach(action => {
      //     const newActionFormGroup = this.makeNewActionFormGroup(action);
      //     this.getActions(index).push(newActionFormGroup);
      //     const comIndex = this.getActions(index).length - 1;
      //     this.onAddActionFormGroup(index, comIndex, newActionFormGroup);
      //   });
      // }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: WarehouseGoodsReceiptNoteModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [{ disabled: true, value: '' }],
      Object: ['', Validators.required],
      ObjectName: [''],
      // Tax: [''],
      Title: [''],
      Warehouse: ['', Validators.required],
      DateOfReceipted: [new Date()],
      Description: [''],
      PriceTable: [''],
      _total: [''],
      Details: this.formBuilder.array([]),
    });
    if (data) {
      // data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    } else {
      // this.addDetailFormGroup(newForm);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: WarehouseGoodsReceiptNoteModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/sales/sales-voucher/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Detail Form */
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: WarehouseGoodsReceiptNoteDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Product: ['', Validators.required],
      // ProductName: ['', Validators.required],
      Quantity: [1, Validators.required],
      // SuggestedSalesPrice: [0],
      Unit: ['', Validators.required],
      Image: [''],
      Container: ['', Validators.required],
    });

    if (data) {
      newForm.get('Container')['option'] = this.select2OptionForContainer;
      newForm.patchValue(data);
    }
    return newForm;
  }
  getDetails(parentFormGroup: FormGroup) {
    return parentFormGroup.get('Details') as FormArray;
  }
  addDetailFormGroup(parentFormGroup: FormGroup) {
    // this.componentList[formGroupIndex].push([]);
    const newChildFormGroup = this.makeNewDetailFormGroup(parentFormGroup);
    this.getDetails(parentFormGroup).push(newChildFormGroup);
    this.onAddDetailFormGroup(parentFormGroup, newChildFormGroup);
    return false;
  }
  removeDetailGroup(parentFormGroup: FormGroup, detail: FormGroup, index: number) {
    this.getDetails(parentFormGroup).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemoveDetailFormGroup(parentFormGroup, detail);
    return false;
  }
  onAddDetailFormGroup(parentFormGroup: FormGroup, newChildFormGroup: FormGroup) {
    // this.componentList[mainIndex].push([]);
  }
  onRemoveDetailFormGroup(parentFormGroup: FormGroup, detailFormGroup: FormGroup) {
    // this.componentList[mainIndex].splice(index, 1);
  }
  /** End Detail Form */

  /** Action Form */
  // makeNewActionFormGroup(data?: PromotionActionModel): FormGroup {
  //   const newForm = this.formBuilder.group({
  //     Id: [''],
  //     Type: ['', Validators.required],
  //     Product: [''],
  //     Amount: [''],
  //     // Discount: [''],
  //   });

  //   if (data) {
  //     // data['Id_old'] = data['Id'];
  //     newForm.patchValue(data);
  //   }
  //   return newForm;
  // }
  // getActions(formGroupIndex: number) {
  //   return this.array.controls[formGroupIndex].get('Actions') as FormArray;
  // }
  // addActionFormGroup(formGroupIndex: number) {
  //   // this.componentList[formGroupIndex].push([]);
  //   const newFormGroup = this.makeNewActionFormGroup();
  //   this.getActions(formGroupIndex).push(newFormGroup);
  //   this.onAddActionFormGroup(formGroupIndex, this.getActions(formGroupIndex).length - 1, newFormGroup);
  //   return false;
  // }
  // removeActionGroup(formGroupIndex: number, index: number) {
  //   this.getActions(formGroupIndex).removeAt(index);
  //   // this.componentList[formGroupIndex].splice(index, 1);
  //   this.onRemoveActionFormGroup(formGroupIndex, index);
  //   return false;
  // }
  // onAddActionFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
  //   // this.componentList[mainIndex].push([]);
  // }
  // onRemoveActionFormGroup(mainIndex: number, index: number) {
  //   // this.componentList[mainIndex].splice(index, 1);
  // }
  /** End Action Form */

  onObjectChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (selectedData.Code) {
          formGroup.get('ObjectName').setValue(selectedData.Name);
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

  onSelectProduct(detail: FormGroup, selectedData: GoodsModel) {
    console.log(selectedData);
    if (selectedData) {
      let defaultUnit = null;
      if (selectedData.Units) {
        defaultUnit = selectedData.Units.find((item: any) => item['DefaultImport'] === '1');
        detail.get('Unit')['dataList'] = selectedData.Units.map((item: any) => ({ ...item, id: item['Code'], text: item['Name'] }));
        if (defaultUnit) {
          detail.get('Unit').patchValue({
            id: defaultUnit['Code'],
            text: defaultUnit['Name'],
            Code: defaultUnit['Code'],
            Name: defaultUnit['Name'],
            Symbol: defaultUnit['Name'],
          });
        }
      }
      // detail.get('ProductName').setValue(selectedData.Name);
      detail.get('Image').setValue(selectedData.FeaturePicture);
      detail.get('Image')['thumbnail'] = (selectedData.FeaturePictureThumbnail ? (selectedData.FeaturePictureThumbnail + '?token=' + this.apiService.getAccessToken()) : '');

    } else {
      // detail.get('ProductName').setValue('');
      detail.get('Unit').setValue('');
    }
    return false;
  }

  onSelectUnit(detail: FormGroup, selectedData: UnitModel & {Containers: WarehouseGoodsContainerModel[]}) {
    const containers = [];
    try {
      containers.push({
        id: 'A-' + this.commonService.translateText('Common.suggest'),
        text: 'A-' + this.commonService.translateText('Common.suggest'),
        children: selectedData.Containers,
      });
    } catch (e) { console.log(e); }

    containers.push({
      id: 'B-' + this.commonService.translateText('Common.all'),
      text: 'B-' + this.commonService.translateText('Common.all'),
      children: this.goodsContainerList,
    });

    detail.get('Container')['dataList'] = containers;
  }

  // calculatToMoney(detail: FormGroup) {
  //   const toMoney = detail.get('Quantity').value * detail.get('Price').value;
  //   // let tax = detail.get('Tax').value;
  //   // if (tax) {
  //   //   if (typeof tax === 'string') {
  //   //     tax = this.taxList.filter(t => t.Code === tax)[0];
  //   //   }
  //   //   toMoney += toMoney * tax.Tax / 100;
  //   // }
  //   return toMoney;
  // }

  // toMoney(formItem: FormGroup, detail: FormGroup) {
  //   // console.log('calculate to money: ' + (detail.get('Quantity').value * detail.get('Price').value));
  //   // let toMoney = detail.get('Quantity').value * detail.get('Price').value;
  //   // let tax = detail.get('Tax').value;
  //   // if (tax) {
  //   //   if (typeof tax === 'string') {
  //   //     tax = this.taxList.filter(t => t.Code === tax)[0];
  //   //   }
  //   //   toMoney += toMoney * tax.Tax / 100;
  //   // }
  //   detail.get('ToMoney').setValue(this.calculatToMoney(detail));

  //   // Call culate total
  //   const details = this.getDetails(formItem);
  //   let total = 0;
  //   for (let i = 0; i < details.controls.length; i++) {
  //     total += this.calculatToMoney(details.controls[i] as FormGroup);
  //   }
  //   formItem.get('_total').setValue(total);
  //   return false;
  // }


  preview(formItem: FormGroup) {
    const data: WarehouseGoodsReceiptNoteModel = formItem.getRawValue();
    data.Details.forEach(detail => {
      if (typeof detail['Tax'] === 'string') {
        detail['Tax'] = this.taxList.filter(t => t.Code === detail['Tax'])[0] as any;
      }
    });
    this.commonService.openDialog(WarehouseGoodsReceiptNotePrintComponent, {
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
    return false;
  }

  activeFormGroup: FormGroup;
  onContainerClick(event: any, formControl: Select2Component, formGroup: FormGroup) {
    // this.activeFormGroup = formGroup;
    // formControl['option'] = this.select2OptionForContainerAjax;
    console.log(formControl);
  }

  getContainerOption(formControl: FormControl) {
    return formControl['option'];
  }

}

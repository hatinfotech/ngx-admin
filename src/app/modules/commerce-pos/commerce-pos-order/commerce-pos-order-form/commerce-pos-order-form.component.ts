import { ProductUnitModel } from '../../../../models/product.model'
import { filter, take, takeUntil } from 'rxjs/operators';
import { ChatRoomModel } from '../../../../models/chat-room.model';
import { SalesMasterPriceTableDetailModel, SalesMasterPriceTableModel, SalesPriceReportModel } from '../../../../models/sales.model';
import { PriceReportModel } from '../../../../models/price-report.model';
import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { environment } from '../../../../../environments/environment';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PromotionActionModel } from '../../../../models/promotion.model';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { CommercePosOrderModel, CommercePosOrderDetailModel } from '../../../../models/commerce-pos.model';
import { CommercePosOrderPrintComponent } from '../commerce-pos-order-print/commerce-pos-order-print.component';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { BusinessModel } from '../../../../models/accounting.model';
import { WarehouseGoodsDeliveryNoteModel } from '../../../../models/warehouse.model';
import { ReferenceChoosingDialogComponent } from '../../../dialog/reference-choosing-dialog/reference-choosing-dialog.component';
import { CustomIcon } from '../../../../lib/custom-element/form/form-group/form-group.component';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { ProductUnitFormComponent } from '../../../admin-product/unit/product-unit-form/product-unit-form.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-commerce-pos-order-form',
  templateUrl: './commerce-pos-order-form.component.html',
  styleUrls: ['./commerce-pos-order-form.component.scss'],
  providers: [DatePipe]
})
export class CommercePosOrderFormComponent extends DataManagerFormComponent<CommercePosOrderModel> implements OnInit {

  componentName: string = 'CommercePosOrderFormComponent';
  idKey = 'Code';
  apiPath = '/commerce-pos/orders';
  baseFormUrl = '/commerce-pos/order/form';
  previewAfterCreate = true;
  printDialog = CommercePosOrderPrintComponent;

  env = environment;

  locale = this.commonService.getCurrentLoaleDataset();
  priceCurencyFormat: CurrencyMaskConfig = { ...this.commonService.getCurrencyMaskConfig(), precision: 0 };
  toMoneyCurencyFormat: CurrencyMaskConfig = { ...this.commonService.getCurrencyMaskConfig(), precision: 0 };
  quantityFormat: CurrencyMaskConfig = { ...this.commonService.getNumberMaskConfig(), precision: 2 };

  towDigitsInputMask = this.commonService.createFloatNumberMaskConfig({
    digitsOptional: false,
    digits: 2
  });

  /** Tax list */
  static _taxList: (TaxModel & { id?: string, text?: string })[];
  taxList: (TaxModel & { id?: string, text?: string })[];

  /** Unit list */
  static _unitList: (UnitModel & { id?: string, text?: string })[];
  unitList: ProductUnitModel[];



  objectControlIcons: CustomIcon[] = [{
    icon: 'plus-square-outline',
    title: this.commonService.translateText('Common.addNewContact'),
    status: 'success',
    states: {
      '<>': {
        icon: 'edit-outline',
        status: 'primary',
        title: this.commonService.translateText('Common.editContact'),
      },
      '': {
        icon: 'plus-square-outline',
        status: 'success',
        title: this.commonService.translateText('Common.addNewContact'),
      },
    },
    action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      const currentObject = this.commonService.getObjectId(formGroup.get('Object').value);
      this.commonService.openDialog(ContactFormComponent, {
        context: {
          inputMode: 'dialog',
          inputId: currentObject ? [currentObject] : null,
          showLoadinng: true,
          onDialogSave: (newData: ContactModel[]) => {
            console.log(newData);
            const newContact: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name };
            formGroup.get('Object').patchValue(newContact);
          },
          onDialogClose: () => {

          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    },
  }];

  contactControlIcons: CustomIcon[] = [{
    icon: 'plus-square-outline',
    title: this.commonService.translateText('Common.addNewContact'),
    status: 'success',
    states: {
      '<>': {
        icon: 'edit-outline',
        status: 'primary',
        title: this.commonService.translateText('Common.editContact'),
      },
      '': {
        icon: 'plus-square-outline',
        status: 'success',
        title: this.commonService.translateText('Common.addNewContact'),
      },
    },
    action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      const currentObject = this.commonService.getObjectId(formGroup.get('Contact').value);
      this.commonService.openDialog(ContactFormComponent, {
        context: {
          inputMode: 'dialog',
          inputId: currentObject ? [currentObject] : null,
          showLoadinng: true,
          onDialogSave: (newData: ContactModel[]) => {
            console.log(newData);
            const newContact: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name };
            formGroup.get('Contact').patchValue(newContact);
          },
          onDialogClose: () => {

          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    },
  }];


  // select2ContactOption = {
  //   placeholder: 'Chọn liên hệ...',
  //   allowClear: true,
  //   width: '100%',
  //   dropdownAutoWidth: true,
  //   minimumInputLength: 0,
  //   // multiple: true,
  //   // tags: true,
  //   keyMap: {
  //     id: 'id',
  //     text: 'text',
  //   },
  //   ajax: {
  //     transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
  //       console.log(settings);
  //       const params = settings.data;
  //       this.apiService.getPromise('/contact/contacts', { includeIdText: true, includeGroups: true, filter_Name: params['term'] }).then(rs => {
  //         success(rs);
  //       }).catch(err => {
  //         console.error(err);
  //         failure();
  //       });
  //     },
  //     delay: 300,
  //     processResults: (data: any, params: any) => {
  //       console.info(data, params);
  //       return {
  //         results: data.map(item => {
  //           item['id'] = item['Code'];
  //           item['text'] = item['Code'] + ' - ' + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
  //           return item;
  //         }),
  //       };
  //     },
  //   },
  // };

  uploadConfig = {

  };

  select2SalesPriceReportOption = {
    placeholder: 'Chọn bảng giá...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Title',
    },
    ajax: {
      // url: params => {
      //   return this.apiService.buildApiUrl('/sales/master-price-tables', { filter_Title: params['term'] ? params['term'] : '', limit: 20 });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        this.apiService.getPromise('/sales/master-price-tables', { filter_Title: settings.data['term'] ? settings.data['term'] : '', limit: 20 }).then(rs => {
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
            item['id'] = item['id'] || item['Code'];
            item['text'] = (item['DateOfApproved'] ? ('[' + this.datePipe.transform(item['DateOfApproved'], 'short') + '] ') : '') + (item['text'] || item['Title']);
            return item;
          }),
        };
      },
    },
  };

  selectPriceReportOption = {
    placeholder: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + '...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Title',
    },
    ajax: {
      // url: params => {
      //   return this.apiService.buildApiUrl('/sales/price-reports', { filter_Title: params['term'] ? params['term'] : '', sort_Created: 'desc', limit: 20, eq_State: '[ACCEPTANCE,COMPLETE]' });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        this.apiService.getPromise('/sales/price-reports', { filter_Title: settings.data['term'] ? settings.data['term'] : '', sort_Created: 'desc', limit: 20, eq_State: '[ACCEPTANCE,COMPLETE]' }).then(rs => {
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
            item['id'] = item['id'] || item['Code'];
            item['text'] = item['Code'] + ': ' + (item['text'] || item['Title'] || item['ObjectName']) + ' (' + this.commonService.datePipe.transform(item['Reported'], 'short') + ')';
            return item;
          }),
        };
      },
    },
  };

  selectEmployeeOption = {
    placeholder: this.commonService.translateText('Common.employee') + '...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      // url: params => {
      //   return this.apiService.buildApiUrl('/contact/contacts', { filter_Name: params['term'] ? params['term'] : '', sort_Name: 'asc', limit: 20, eq_Group: '[EMPLOYEE]' });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        this.apiService.getPromise('/contact/contacts', { filter_Name: settings.data['term'] ? settings.data['term'] : '', sort_Name: 'asc', limit: 20, eq_Group: '[EMPLOYEE]' }).then(rs => {
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
            item['id'] = item['id'] || item['Code'];
            item['text'] = item['text'] || item['Name'];
            return item;
          }),
        };
      },
    },
  };

  accountingBusinessList: BusinessModel[] = [];
  select2OptionForAccountingBusiness = {
    placeholder: 'Nghiệp vụ kế toán...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    dropdownCssClass: 'is_tags',
    multiple: true,
    // maximumSelectionLength: 1,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  // customIcons: CustomIcon[] = [{
  //   icon: 'plus-square-outline', title: this.commonService.translateText('Common.addNewProduct'), status: 'success', action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
  //     this.commonService.openDialog(ProductFormComponent, {
  //       context: {
  //         inputMode: 'dialog',
  //         // inputId: ids,
  //         onDialogSave: (newData: ProductModel[]) => {
  //           console.log(newData);
  //           // const formItem = formGroupComponent.formGroup;
  //           const newProduct: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name, Units: newData[0].UnitConversions?.map(unit => ({ ...unit, id: this.commonService.getObjectId(unit?.Unit), text: this.commonService.getObjectText(unit?.Unit) })) };
  //           formGroup.get('Product').patchValue(newProduct);
  //         },
  //         onDialogClose: () => {

  //         },
  //       },
  //       closeOnEsc: false,
  //       closeOnBackdropClick: false,
  //     });
  //   }
  // }];

  customIcons: { [key: string]: CustomIcon[] } = {};
  getCustomIcons(name: string): CustomIcon[] {
    if (this.customIcons[name]) return this.customIcons[name];
    return this.customIcons[name] = [{
      icon: 'plus-square-outline',
      title: this.commonService.translateText('Common.addNewProduct'),
      status: 'success',
      states: {
        '<>': {
          icon: 'edit-outline',
          status: 'primary',
          title: this.commonService.translateText('Common.editProduct'),
        },
        '': {
          icon: 'plus-square-outline',
          status: 'success',
          title: this.commonService.translateText('Common.addNewProduct'),
        },
      },
      action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
        const currentProduct = this.commonService.getObjectId(formGroup.get('Product').value);
        this.commonService.openDialog(ProductFormComponent, {
          context: {
            inputMode: 'dialog',
            inputId: currentProduct ? [currentProduct] : null,
            showLoadinng: true,
            onDialogSave: (newData: ProductModel[]) => {
              console.log(newData);
              // const formItem = formGroupComponent.formGroup;
              const newProduct: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name, Units: newData[0].UnitConversions?.map(unit => ({ ...unit, id: this.commonService.getObjectId(unit?.Unit), text: this.commonService.getObjectText(unit?.Unit) })) };
              formGroup.get('Product').patchValue(newProduct);
            },
            onDialogClose: () => {

            },
          },
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      }
    }];
  }

  unitCustomIcons: CustomIcon[] = [{
    icon: 'plus-square-outline', title: this.commonService.translateText('Common.addUnit'), status: 'success', action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      this.commonService.openDialog(ProductUnitFormComponent, {
        context: {
          inputMode: 'dialog',
          // inputId: ids,
          showLoadinng: true,
          onDialogSave: (newData: UnitModel[]) => {
            console.log(newData);
            // const formItem = formGroupComponent.formGroup;
            const newUnit: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name };
            formGroup.get('Unit').patchValue(newUnit);
          },
          onDialogClose: () => {

          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    }
  }];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<CommercePosOrderFormComponent>,
    public adminProductService?: AdminProductService,
    public datePipe?: DatePipe
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);

    /** Append print button to head card */
    this.actionButtonList.splice(this.actionButtonList.length - 1, 0, {
      name: 'print',
      status: 'primary',
      label: this.commonService.textTransform(this.commonService.translate.instant('Common.print'), 'head-title'),
      icon: 'printer',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.print'), 'head-title'),
      size: 'medium',
      disabled: () => this.isProcessing,
      hidden: () => false,
      click: (event: any, option: ActionControlListOption) => {
        this.preview([option.form?.value], 'form');
      },
    });
    // this.actionButtonList.splice(this.actionButtonList.length - 1, 0, {
    //   name: 'print',
    //   status: 'info',
    //   label: this.commonService.textTransform(this.commonService.translate.instant('Common.task'), 'head-title'),
    //   icon: 'link-2',
    //   title: this.commonService.textTransform(this.commonService.translate.instant('Common.task'), 'head-title'),
    //   size: 'medium',
    //   disabled: () => this.isProcessing,
    //   hidden: () => false,
    //   click: (event: any, option: ActionControlListOption) => {
    //     this.preview(option.form);
    //   },
    // });
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  select2OptionForProduct = {
    ...this.commonService.makeSelect2AjaxOption('/admin-product/products', { select: "id=>Code,text=>Name,Code=>Code,Name,OriginName=>Name,Sku,FeaturePicture,Pictures", includeSearchResultLabel: true, includeUnits: true }, {
      limit: 10,
      placeholder: 'Chọn hàng hóa/dịch vụ...',
      prepareReaultItem: (item) => {
        item.thumbnail = item?.FeaturePicture?.Thumbnail;
        return item;
      }
    }),
    withThumbnail: true,
    // placeholder: 'Chọn Hàng hoá/dịch vụ...',
    // allowClear: true,
    // width: '100%',
    // dropdownAutoWidth: true,
    // minimumInputLength: 0,
    // withThumbnail: true,
    // // tags: false,
    // keyMap: {
    //   id: 'Code',
    //   text: 'Name',
    // },
    // ajax: {
    //   transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
    //     console.log(settings);
    //     this.apiService.getPromise('/admin-product/products', { select: "id=>Code,text=>Name,Code=>Code,Name=>Name,FeaturePicture=>FeaturePicture,Pictures=>Pictures", limit: 40, includeUnit: true, includeUnits: true, 'search': settings.data['term'] }).then(rs => {
    //       success(rs);
    //     }).catch(err => {
    //       console.error(err);
    //       failure();
    //     });
    //   },
    //   delay: 300,
    //   processResults: (data: any, params: any) => {
    //     return {
    //       results: data.map(product => {
    //         product.thumbnail = product?.FeaturePicture?.Thumbnail;
    //         return product;
    //       })
    //     };
    //   },
    // },
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

  // Type field option
  select2OptionForType = {
    placeholder: 'Chọn loại...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };
  select2DataForType = [
    { id: 'PRODUCT', text: 'Sản phẩm' },
    // { id: 'SERVICE', text: 'Dịch vụ' },
    { id: 'CATEGORY', text: 'Danh mục' },
  ];

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async loadCache() {
    await Promise.all([
      this.adminProductService.unitList$.pipe(filter(f => !!f), take(1)).toPromise().then(list => this.unitList = list),
    ]);
  }

  async init(): Promise<boolean> {
    /** Load and cache tax list */
    this.taxList = (await this.apiService.getPromise<TaxModel[]>('/accounting/taxes')).map(tax => {
      tax['id'] = tax.Code;
      tax['text'] = tax.Name;
      return tax;
    });
    // if (!CommercePosOrderFormComponent._taxList) {
    // } else {
    //   this.taxList = CommercePosOrderFormComponent._taxList;
    // }

    /** Load and cache unit list */
    // this.unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units', { limit: 'nolimit' })).map(tax => {
    //   tax['id'] = tax.Code;
    //   tax['text'] = tax.Name;
    //   return tax;
    // });
    // if (!CommercePosOrderFormComponent._unitList) {
    // } else {
    //   this.taxList = CommercePosOrderFormComponent._taxList;
    // }

    this.accountingBusinessList = await this.apiService.getPromise<BusinessModel[]>('/accounting/business', { eq_Type: '[SALES,WAREHOUSEDELIVERY]', select: 'id=>Code,text=>Name,type=>Type' });

    return super.init().then(status => {
      if (this.isDuplicate) {
        // Clear id
        this.id = [];
        this.array.controls.forEach((formItem, index) => {
          formItem.get('Code').setValue('');
          formItem.get('Title').setValue('Copy of: ' + formItem.get('Title').value);
          this.getDetails(formItem as FormGroup).controls.forEach(conditonFormGroup => {
            // Clear id
            conditonFormGroup.get('Id').setValue('');
          });
        });
      }
      return status;
    });
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: CommercePosOrderModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeContact'] = true;
    params['includeObject'] = true;
    params['includeDetails'] = true;
    params['includeRelativeVouchers'] = true;
    params['useBaseTimezone'] = true;
    params['includeEmployee'] = true;
    params['includeUnit'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: CommercePosOrderModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: CommercePosOrderModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Details form load
      if (itemFormData?.Details) {
        const details = this.getDetails(newForm);
        details.clear();
        for (const detailData of itemFormData.Details) {
          detailData.AccessNumbers = Array.isArray(detailData.AccessNumbers) && detailData.AccessNumbers.length > 0 ? (detailData.AccessNumbers.map(ac => this.commonService.getObjectId(ac)).join('\n') + '\n') : '';
          const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, detailData);
          details.push(newDetailFormGroup);
          // const comIndex = details.length - 1;
          this.onAddDetailFormGroup(newForm, newDetailFormGroup, details.length - 1);
        }
        // itemFormData.Details.forEach(detail => {
        // });
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
      return;
    });

  }

  makeNewFormGroup(data?: CommercePosOrderModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Object: ['', Validators.required],
      ObjectName: ['', Validators.required],
      ObjectEmail: [''],
      ObjectPhone: [''],
      ObjectAddress: [''],
      ObjectIdentifiedNumber: [''],
      Recipient: [''],
      ObjectTaxCode: [''],
      DirectReceiverName: [''],
      ObjectBankName: [''],
      ObjectBankCode: [''],
      Contact: [''],
      ContactName: [''],
      ContactPhone: [''],
      ContactEmail: [''],
      ContactAddress: [''],
      ContactIdentifiedNumber: [''],
      DateOfDelivery: [''],
      DeliveryAddress: [''],
      PriceTable: [''],
      IsObjectRevenue: [false],
      // PriceReportVoucher: [''],
      PriceReport: [''],
      // Employee: [''],
      Title: ['', Validators.required],
      Note: [''],
      SubNote: [''],
      DateOfSale: [null, Validators.required],
      _total: [''],
      RelativeVouchers: [''],
      RequireInvoice: [false],
      Details: this.formBuilder.array([]),
    });
    if (data) {
      // data['Code_old'] = data['Code'];
      if (!((data.DateOfSale as any) instanceof Date)) {
        data.DateOfSale = new Date(data.DateOfSale) as any;
      }
      this.patchFormGroupValue(newForm, data);
    } else {
      this.addDetailFormGroup(newForm);
    }

    const titleControl = newForm.get('Title');
    newForm.get('ObjectName').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(objectName => {
      if (objectName && (!titleControl.touched || !titleControl.value) && (!titleControl.value || /^Bán hàng: /.test(titleControl.value))) {
        titleControl.setValue(`Bán hàng: ${objectName}`);
      }
    });

    newForm.get('DateOfSale').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(dateOfSate => {
      if (dateOfSate) {
        this.commonService.lastVoucherDate = dateOfSate;
      }
    });
    return newForm;
  }

  patchFormGroupValue = (formGroup: FormGroup, data: CommercePosOrderModel) => {

    if (data) {
      formGroup.get('ObjectPhone')['placeholder'] = data['ObjectPhone'];
      formGroup.get('ObjectAddress')['placeholder'] = data['ObjectAddress'];
      data['ObjectPhone'] = null;
      data['ObjectAddress'] = null;

      formGroup.get('ContactPhone')['placeholder'] = data['ContactPhone'];
      formGroup.get('ContactAddress')['placeholder'] = data['ContactAddress'];
      data['ContactPhone'] = null;
      data['ContactAddress'] = null;

      formGroup.patchValue(data);
    }
    return true;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: CommercePosOrderModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/promotion/promotion/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Detail Form */
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: CommercePosOrderDetailModel): FormGroup {
    let newForm = null;
    newForm = this.formBuilder.group({
      // Id: [''],
      No: [''],
      Type: ['PRODUCT', Validators.required],
      Product: ['', (control: FormControl) => {
        if (newForm && this.commonService.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.commonService.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      Description: ['', Validators.required],
      Quantity: [1, (control: FormControl) => {
        if (newForm && this.commonService.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.commonService.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      Price: ['', (control: FormControl) => {
        if (newForm && this.commonService.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.commonService.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      Unit: ['', (control: FormControl) => {
        if (newForm && this.commonService.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.commonService.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      // Tax: ['NOTAX', (control: FormControl) => {
      //   if (newForm && this.commonService.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.commonService.getObjectId(control.value)) {
      //     return { invalidName: true, required: true, text: 'trường bắt buộc' };
      //   }
      //   return null;
      // }],
      ToMoney: [0],
      Image: [[]],
      // Reason: [''],
      // Business: { value: this.accountingBusinessList.filter(f => f.id === 'NETREVENUE'), disabled: true },
      Business: [this.accountingBusinessList.filter(f => f.id === 'NETREVENUE')],
      AccessNumbers: [''],
      // IsDebt: [false],
    });

    if (data) {
      newForm.patchValue(data);

      if (data.Product?.Units && data.Product?.Units?.length > 0) {
        newForm['unitList'] = data.Product.Units;
      } else {
        newForm['unitList'] = this.adminProductService.unitList$.value;
      }
    } else {
      newForm['unitList'] = this.adminProductService.unitList$.value;
    }

    const imagesFormControl = newForm.get('Image');
    newForm.get('Product').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (value) {
        if (value.Pictures && value.Pictures.length > 0) {
          imagesFormControl.setValue(value.Pictures);
        } else {
          imagesFormControl.setValue([]);
        }
      }
    });
    newForm['IsManageByAccessNumber'] = data.Unit['IsManageByAccessNumber'] || false;

    return newForm;
  }
  getDetails(parentFormGroup: FormGroup) {
    return parentFormGroup.get('Details') as FormArray;
  }
  addDetailFormGroup(parentFormGroup: FormGroup) {
    const newChildFormGroup = this.makeNewDetailFormGroup(parentFormGroup);
    const detailsFormArray = this.getDetails(parentFormGroup);
    detailsFormArray.push(newChildFormGroup);
    const noFormControl = newChildFormGroup.get('No');
    if (!noFormControl.value) {
      noFormControl.setValue(detailsFormArray.length);
    }
    this.onAddDetailFormGroup(parentFormGroup, newChildFormGroup, detailsFormArray.length - 1);
    return false;
  }
  removeDetailGroup(parentFormGroup: FormGroup, detail: FormGroup, index: number) {
    this.getDetails(parentFormGroup).removeAt(index);
    this.onRemoveDetailFormGroup(parentFormGroup, detail);
    return false;
  }
  onAddDetailFormGroup(parentFormGroup: FormGroup, newChildFormGroup: FormGroup, index: number) {
    this.updateInitialFormPropertiesCache(newChildFormGroup);
    this.toMoney(parentFormGroup, newChildFormGroup, null, index);
  }
  onRemoveDetailFormGroup(parentFormGroup: FormGroup, detailFormGroup: FormGroup) {
  }
  /** End Detail Form */

  /** Action Form */
  makeNewActionFormGroup(data?: PromotionActionModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Type: ['', Validators.required],
      Product: [''],
      Amount: [''],
      // Discount: [''],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  getActions(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Actions') as FormArray;
  }
  addActionFormGroup(formGroupIndex: number) {
    const newFormGroup = this.makeNewActionFormGroup();
    this.getActions(formGroupIndex).push(newFormGroup);
    this.onAddActionFormGroup(formGroupIndex, this.getActions(formGroupIndex).length - 1, newFormGroup);
    return false;
  }
  removeActionGroup(formGroupIndex: number, index: number) {
    this.getActions(formGroupIndex).removeAt(index);
    this.onRemoveActionFormGroup(formGroupIndex, index);
    return false;
  }
  onAddActionFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
  }
  onRemoveActionFormGroup(mainIndex: number, index: number) {
  }
  /** End Action Form */

  onObjectChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (selectedData.Code) {
          formGroup.get('ObjectName').setValue(selectedData.Name);
          formGroup.get('ObjectPhone').setValue(selectedData.Phone);
          formGroup.get('ObjectEmail').setValue(selectedData.Email);
          formGroup.get('ObjectAddress').setValue(selectedData.Address);
          formGroup.get('ObjectTaxCode').setValue(selectedData.TaxCode);
          formGroup.get('ObjectBankName').setValue(selectedData.BankName);
          formGroup.get('ObjectBankCode').setValue(selectedData.BankAcc);
        }
      }
    }
  }

  onContactChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (selectedData.Code) {
          formGroup.get('ContactName').setValue(selectedData.Name);
          if (selectedData['Phone'] && selectedData['Phone']['restricted']) formGroup.get('ContactPhone')['placeholder'] = selectedData['Phone']['placeholder']; else formGroup.get('ContactPhone').setValue(selectedData['Phone']);
          if (selectedData['Email'] && selectedData['Email']['restricted']) formGroup.get('ContactEmail')['placeholder'] = selectedData['Email']['placeholder']; else formGroup.get('ContactEmail').setValue(selectedData['Email']);
          if (selectedData['Address'] && selectedData['Address']['restricted']) formGroup.get('ContactAddress')['placeholder'] = selectedData['Address']['placeholder']; else formGroup.get('ContactAddress').setValue(selectedData['Address']);
          formGroup.get('ContactIdentifiedNumber').setValue(selectedData.TaxCode);
        }
      }
    }
  }

  onPriceTableChange(formGroup: FormGroup, selectedData: SalesMasterPriceTableModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
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

  onPriceReportVoucherChange(formGroup: FormGroup, selectedData: PriceReportModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (selectedData.Code) {

          this.apiService.getPromise<PriceReportModel[]>('/sales/price-reports/' + selectedData.Code, {
            includeContact: true,
            includeDetails: true,
            includeProductUnitList: true,
            includeProductPrice: true,
          }).then(rs => {

            if (rs && rs.length > 0) {
              const salesVoucher: CommercePosOrderModel = { ...rs[0] };
              salesVoucher.PriceReportVoucher = selectedData.Code;
              delete salesVoucher.Code;
              delete salesVoucher.Id;
              for (const detail of salesVoucher.Details) {
                delete detail['Id'];
                delete detail['Voucher'];
                detail.Description = detail['Description'];
              }
              this.formLoad([salesVoucher]);
            }
          });

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

  onSalectPriceReport(formGroup: FormGroup, selectedData: ChatRoomModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (selectedData.Code) {

          // Get first price report => prototype
          // const firstPriceReport = selectedData['PriceReports'] && selectedData['PriceReports'][0];
          this.apiService.getPromise<PriceReportModel[]>('/sales/price-reports/' + this.commonService.getObjectId(selectedData), {
            includeContact: true,
            includeDetails: true,
            includeProductUnitList: true,
            includeProductPrice: true,
          }).then(rs => {

            if (rs && rs.length > 0) {
              const salesVoucher: CommercePosOrderModel = { ...rs[0] };
              // salesVoucher.PriceReportVoucher = selectedData.Code;
              delete salesVoucher.Code;
              delete salesVoucher.Id;
              salesVoucher['SalesTask'] = { id: selectedData.Code, text: selectedData?.Description, Code: selectedData.Code, Description: selectedData.Description };
              for (const detail of salesVoucher.Details) {
                delete detail['Id'];
                delete detail['Voucher'];
                detail.Description = detail['Description'];
              }
              this.formLoad([salesVoucher]);
            }
          });

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

  /** Choose product event */
  onSelectProduct(detail: FormGroup, selectedData: ProductModel, parentForm: FormGroup, detailForm?: FormGroup) {
    console.log(selectedData);
    const priceTable = this.commonService.getObjectId(parentForm.get('PriceTable').value);
    const unitControl = detail.get('Unit');
    detail.get('Description').setValue(selectedData.Name);
    if (selectedData && selectedData.Units && selectedData.Units.length > 0) {
      const detaultUnit = selectedData.Units.find(f => f['IsDefaultSales'] === true) || selectedData.Units[0];
      if (priceTable) {
        this.apiService.getPromise<SalesMasterPriceTableDetailModel[]>('/sales/master-price-tables/getProductPriceByUnits', {
          priceTable: priceTable,
          product: this.commonService.getObjectId(selectedData),
          includeUnit: true,
        }).then(rs => {
          console.log(rs);
          unitControl['UnitList'] = rs.map(priceDetail => ({ id: priceDetail.UnitCode, text: priceDetail.UnitName, Price: priceDetail.Price }))
          // if (selectedData.Units) {
          if (detaultUnit) {
            const choosed = rs.find(f => f.UnitCode === detaultUnit.id);
            detail.get('Unit').setValue('');
            setTimeout(() => detail.get('Unit').setValue(detaultUnit.id), 0);
            setTimeout(() => {
              detail.get('Price').setValue(choosed.Price);
              this.toMoney(parentForm, detail);
            }, 0);
          }
          // } else {
          //   detail['unitList'] = this.commonService.unitList;
          // }
        });
      } else {
        unitControl['UnitList'] = selectedData.Units;
        // unitControl.patchValue(selectedData.Units.find(f => f['DefaultImport'] === true || f['IsDefaultPurchase'] === true));
        unitControl.setValue(detaultUnit);
      }

    } else {
      // detail.get('Description').setValue('');
      detail.get('Unit').setValue('');

      unitControl['UnitList'] = [];
      unitControl['UnitList'] = null;
    }
    // Callculate: Doanh thu bán lẻ dựa triên thu chi
    if (selectedData && this.commonService.getObjectId(selectedData) == 'BANLE' && detailForm) {
      this.apiService.getPromise('/accounting/reports', {
        reportSummary: true,
        Accounts: '1111',
        toDate: this.commonService.getEndOfDate(parentForm.get('DateOfSale')?.value).toISOString(),
      }).then(rs => {
        console.log(rs);
        this.commonService.openDialog(DialogFormComponent, {
          context: {
            title: 'Tính doanh thu bán lẻ',
            onInit: async (form, dialog) => {
              const reatilRevenue = form.get('RetailRevenue');
              form.get('RealCash').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(realCashValue => {
                reatilRevenue.setValue(realCashValue - rs[0]['TailAmount']);
              });
              return true;
            },
            controls: [
              {
                name: 'RealCash',
                label: 'Tiền mặt cuối ngày',
                placeholder: 'Tiền đếm được cuối ngày',
                type: 'currency',
                initValue: 0,
              },
              {
                name: 'CurrentCash',
                label: 'Tiền mặt hiện tại trên phền mềm',
                placeholder: 'Tiền đếm được cuối ngày',
                type: 'currency',
                initValue: rs[0]['TailAmount'],
                disabled: true,
              },
              {
                name: 'RetailRevenue',
                label: 'Doanh thu bán lẻ',
                placeholder: 'Doanh thu bán lẻ',
                type: 'currency',
                disabled: true,
              },
            ],
            actions: [
              {
                label: 'Trở về',
                icon: 'back',
                status: 'basic',
                action: () => {
                  return true;
                },
              },
              {
                label: 'Tính doanh thu bán lẻ',
                icon: 'generate',
                status: 'success',
                action: (form: FormGroup) => {
                  console.log(rs);
                  detailForm.get('Price').setValue(form.get('RealCash').value - rs[0]['TailAmount']);
                  this.toMoney(parentForm, detail, 'Product');

                  return true;
                },
              },
            ],
          },
        });
      });
    }
    return false;
  }

  /** Choose unit event */
  onSelectUnit(detail: FormGroup, selectedData: UnitModel, formItem: FormGroup) {
    if (selectedData && selectedData.Price !== null) {
      if (selectedData.Price >= 0) {
        detail.get('Price').setValue(selectedData.Price);
        this.toMoney(formItem, detail);
      }
    }
    return false;
  }

  // calculatToMoney(detail: FormGroup) {
  //   let toMoney = detail.get('Quantity').value * detail.get('Price').value;
  //   let tax = detail.get('Tax').value;
  //   if (tax) {
  //     if (typeof tax === 'string') {
  //       tax = this.taxList.filter(t => t.Code === tax)[0];
  //     }
  //     toMoney += toMoney * tax.Tax / 100;
  //   }
  //   return toMoney;
  // }

  // toMoney(formItem: FormGroup, detail: FormGroup) {
  //   detail.get('ToMoney').setValue(this.calculatToMoney(detail));
  //   this.calulateTotal(formItem);
  //   return false;
  // }

  calulateTotal(formItem: FormGroup) {
    this.commonService.takeUntil('calulcate_sales_voucher', 300).then(rs => {
      let total = 0;
      const details = this.getDetails(formItem);
      for (let i = 0; i < details.controls.length; i++) {
        total += this.calculatToMoney(details.controls[i] as FormGroup);
      }
      formItem.get('_total').setValue(this.commonService.roundUsing(total, Math.floor, 2));
    });
  }

  calculatToMoney(detail: FormGroup, source?: string) {
    // let tax = detail.get('Tax').value;
    // if (typeof tax === 'string') {
    //   tax = this.taxList.filter(t => t.Code === tax)[0];
    // }
    if (source === 'ToMoney') {
      const price = detail.get('ToMoney').value / detail.get('Quantity').value;
      // if (tax) {
      //   price = price / (1 + parseFloat(tax.Tax) / 100);
      // }
      // console.log(detail.value);
      return price;
    } else {
      const toMoney = detail.get('Quantity').value * detail.get('Price').value;

      // if (tax) {
      //   if (typeof tax === 'string') {
      //     tax = this.taxList.filter(t => t.Code === tax)[0];
      //   }
      //   toMoney += toMoney * tax.Tax / 100;
      // }
      // console.log(detail.value);
      return toMoney;
    }
  }

  toMoney(formItem: FormGroup, detail: FormGroup, source?: string, index?: number) {
    this.commonService.takeUntil(this.componentName + '_ToMoney_ ' + index, 300).then(() => {
      if (source === 'ToMoney') {
        detail.get('Price').setValue(this.calculatToMoney(detail, source));
      } else {
        detail.get('ToMoney').setValue(this.calculatToMoney(detail));
      }
      // Call culate total
      const details = this.getDetails(formItem);
      let total = 0;
      for (let i = 0; i < details.controls.length; i++) {
        total += this.calculatToMoney(details.controls[i] as FormGroup);
      }
      formItem.get('_total').setValue(total);
    });
    return false;
  }

  // preview(formItem: FormGroup) {
  //   const data: CommercePosOrderModel = formItem.value;
  //   data.Details.forEach(detail => {
  //     detail['Tax'] = this.commonService.getObjectText(this.taxList.find(t => t.Code === this.commonService.getObjectId(detail['Tax'])), 'Lable2');
  //     detail['Unit'] = this.commonService.getObjectText(this.unitList.find(f => f.id === this.commonService.getObjectId(detail['Unit'])));
  //   });
  //   this.commonService.openDialog(CommercePosOrderPrintComponent, {
  //     context: {
  //       title: 'Xem trước',
  //       data: [data],
  //       mode: 'preview',
  //       idKey: ['Code'],
  //       onSaveAndClose: (rs: CommercePosOrderModel) => {
  //         this.saveAndClose();
  //       },
  //       onSaveAndPrint: (rs: CommercePosOrderModel) => {
  //         this.save();
  //       },
  //     },
  //   });
  //   return false;
  // }

  // getRawFormData() {
  //   return super.getRawFormData();
  // }

  openRelativeVoucherChoosedDialog(formGroup: FormGroup) {
    this.commonService.openDialog(ReferenceChoosingDialogComponent, {
      context: {
        components: {
          'PRICEREPORT': { title: 'Phiếu báo giá' },
          'GOODSDELIVERY': { title: 'Phiếu xuất kho' },
        },
        onDialogChoose: async (chooseItems: any[], type?: string) => {
          console.log(chooseItems, type);
          const relationVoucher = formGroup.get('RelativeVouchers');
          const relationVoucherValue: any[] = (relationVoucher.value || []);
          const insertList = [];
          this.onProcessing();
          if (type === 'GOODSDELIVERY') {
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                const details = this.getDetails(formGroup);
                // get purchase order
                const refVoucher = await this.apiService.getPromise<WarehouseGoodsDeliveryNoteModel[]>('/warehouse/goods-delivery-notes/' + chooseItems[i].Code, { includeContact: true, includeDetails: true }).then(rs => rs[0]);

                if (['APPROVED'].indexOf(this.commonService.getObjectId(refVoucher.State)) < 0) {
                  this.commonService.toastService.show(this.commonService.translateText('Phiếu xuất kho chưa được duyệt'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.commonService.getObjectId(formGroup.get('Object').value)) {
                  if (this.commonService.getObjectId(refVoucher.Object, 'Code') != this.commonService.getObjectId(formGroup.get('Object').value)) {
                    this.commonService.toastService.show(this.commonService.translateText('Khách hàng trong phiếu mua hàng không giống với phiếu bán hàng'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete refVoucher.Id;
                  // delete refVoucher.Code;
                  formGroup.patchValue({ ...refVoucher, Code: null, Object: { id: this.commonService.getObjectId(refVoucher.Object), text: refVoucher.ObjectName }, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);

                // Insert order details into voucher details
                if (refVoucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu xuất kho: ' + refVoucher.Code + ' - ' + refVoucher.Title }));
                  for (const voucherDetail of refVoucher.Details) {
                    if (voucherDetail.Type !== 'CATEGORY') {
                      // delete voucherDetail.Id;
                      // delete voucherDetail.Voucher;
                      // delete voucherDetail.No;
                      const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Id: null, Voucher: null, No: null, Business: this.accountingBusinessList.filter(f => f.id === 'NETREVENUE') } as any);
                      newDtailFormGroup.get('Business').disable();
                      details.push(newDtailFormGroup);
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: type }))]);
          }
          if (type === 'PRICEREPORT') {
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                const details = this.getDetails(formGroup);
                // get purchase order
                const refVoucher = await this.apiService.getPromise<SalesPriceReportModel[]>('/sales/price-reports/' + chooseItems[i].Code, { includeContact: true, includeDetails: true, includeProductUnitList: true, includeProductPrice: true, includeRelativeVouchers: true }).then(rs => rs[0]);

                if (['APPROVED', 'COMPLETE'].indexOf(this.commonService.getObjectId(refVoucher.State)) < 0) {
                  this.commonService.toastService.show(this.commonService.translateText('Phiếu báo giá chưa được duyệt'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.commonService.getObjectId(formGroup.get('Object').value)) {
                  if (this.commonService.getObjectId(refVoucher.Object, 'Code') != this.commonService.getObjectId(formGroup.get('Object').value)) {
                    this.commonService.toastService.show(this.commonService.translateText('Khách hàng trong phiếu báo giá không giống với phiếu bán hàng'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  // delete goodsDeliveryNote.Id;
                  // formGroup.patchValue(priceReport);
                  // if (typeof priceReport.Object === 'string') {
                  //   priceReport.Object = {
                  //     id: priceReport.Object as string,
                  //     text: priceReport.ObjectName,
                  //     Code: priceReport.Object,
                  //     Name: priceReport.ObjectName,
                  //   };
                  // }
                  delete refVoucher.Id;
                  // delete refVoucher.Code;
                  formGroup.patchValue({ ...refVoucher, Code: null, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);
                if (refVoucher.RelativeVouchers && refVoucher.RelativeVouchers.length > 0) {
                  for (const relativeVoucher of refVoucher.RelativeVouchers) {
                    insertList.push(relativeVoucher);
                  }
                }

                // Insert order details into voucher details
                if (refVoucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Báo giá: ' + refVoucher.Code + ' - ' + refVoucher.Title }));
                  for (const voucherDetail of refVoucher.Details) {
                    if (voucherDetail.Type !== 'CATEGORY') {
                      // delete voucherDetail.Id;
                      // delete voucherDetail.Voucher;
                      // delete voucherDetail.No;
                      const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Id: null, Voucher: null, No: null, Business: this.accountingBusinessList.filter(f => f.id === 'NETREVENUE') } as any);
                      newDtailFormGroup.get('Business').disable();
                      newDtailFormGroup.get('Unit')['UnitList'] = voucherDetail.Product?.Units;
                      details.push(newDtailFormGroup);
                      await new Promise(resolve => setTimeout(() => resolve(true), 300));
                      this.toMoney(formGroup, newDtailFormGroup);
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.id || m?.Code, text: m?.text || m.Title, type: m?.type || type as any }))]);
          }

          setTimeout(() => {
            this.onProcessed();
          }, 1000);
        },
      }
    });
    return false;
  }

  openRelativeVoucher(relativeVocher: any) {
    if (relativeVocher) this.commonService.previewVoucher(relativeVocher.type, relativeVocher);
    return false;
  }

  removeRelativeVoucher(formGroup: FormGroup, relativeVocher: any) {
    const relationVoucher = formGroup.get('RelativeVouchers');
    relationVoucher.setValue(relationVoucher.value.filter(f => f?.id !== this.commonService.getObjectId(relativeVocher)));
    return false;
  }

  async onSelectAccessNumbers(detail: FormGroup, selectedData: ProductModel, force?: boolean) {
    console.log(selectedData);
    if (detail['IsManageByAccessNumber']) {
      detail.get('Quantity').setValue(detail.get('AccessNumbers').value.trim().split('\n').length);
    }
  }

  getRawFormData() {
    const data = super.getRawFormData();
    for (const item of data.array) {
      for (const detail of item.Details) {
        if (typeof detail.AccessNumbers == 'string') {
          detail.AccessNumbers = detail?.AccessNumbers.trim().split('\n').filter(f => !!f).map(ac => {
            if (/^127/.test(ac)) {
              return { id: ac, text: ac };
            }
            const acd = this.commonService.decompileAccessNumber(ac);
            return acd.accessNumber;
          });
        }
      }
    }
    return data;
  }

}

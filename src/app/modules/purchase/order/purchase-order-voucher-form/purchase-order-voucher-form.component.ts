import { ProductUnitModel } from './../../../../models/product.model';
import { AdminProductService } from './../../../admin-product/admin-product.service';
import { DynamicListDialogComponent } from './../../../dialog/dynamic-list-dialog/dynamic-list-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { environment } from '../../../../../environments/environment';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { CustomIcon, FormGroupComponent } from '../../../../lib/custom-element/form/form-group/form-group.component';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { PromotionActionModel } from '../../../../models/promotion.model';
import { PurchaseOrderVoucherDetailModel, PurchaseOrderVoucherModel } from '../../../../models/purchase.model';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { PurchaseOrderVoucherPrintComponent } from '../purchase-order-voucher-print/purchase-order-voucher-print.component';
import { SmartTableButtonComponent, SmartTableCurrencyComponent, SmartTableTagsComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { takeUntil } from 'rxjs/operators';
import { ReferenceChoosingDialogComponent } from '../../../dialog/reference-choosing-dialog/reference-choosing-dialog.component';
import { CommercePosOrderModel } from '../../../../models/commerce-pos.model';
import * as XLSX from 'xlsx';
import { defaultAuthOptions } from '@nebular/auth';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { _ } from 'ag-grid-community';

@Component({
  selector: 'ngx-purchase-order-voucher-form',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './purchase-order-voucher-form.component.html',
  styleUrls: ['./purchase-order-voucher-form.component.scss']
})
export class PurchaseOrderVoucherFormComponent extends DataManagerFormComponent<PurchaseOrderVoucherModel> implements OnInit {

  componentName: string = 'PurchaseOrderVoucherFormComponent';
  idKey = 'Code';
  apiPath = '/purchase/order-vouchers';
  baseFormUrl = '/purchase/order-voucher/form';

  env = environment;

  locale = this.commonService.getCurrentLoaleDataset();
  curencyFormat: CurrencyMaskConfig = this.commonService.getCurrencyMaskConfig();
  numberFormat: CurrencyMaskConfig = this.commonService.getNumberMaskConfig();

  // locale = this.commo nService.getCurrentLoaleDataset();
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
  unitList: (UnitModel & { id?: string, text?: string })[];

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

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public adminProductService: AdminProductService,
    public ref: NbDialogRef<PurchaseOrderVoucherFormComponent>,
    // public changeDirectorRef: ChangeDetectorRef,
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
        this.preview(option.form);
      },
    });
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
    // keyMap: {
    //   id: 'id',
    //   text: 'text',
    // },
    // ajax: {
    //   transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
    //     console.log(settings);
    //     const params = settings.data;
    //     this.apiService.getPromise('/admin-product/products', { select: "id=>Code,text=>Name,Code=>Code,Name=>Name,Sku=>Sku,FeaturePicture=>FeaturePicture,Pictures=>Pictures", includeSearchResultLabel: true, includeUnits: true, 'search': params['term'] }).then(rs => {
    //       success(rs);
    //     }).catch(err => {
    //       console.error(err);
    //       failure();
    //     });
    //   },
    //   delay: 300,
    //   processResults: (data: any, params: any) => {
    //     return {
    //       results: data.map(item => {
    //         item.thumbnail = item?.FeaturePicture?.Thumbnail;
    //         return item;
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
    { id: 'CATEGORY', text: 'Danh mục' },
  ];

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
    action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
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
    action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
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

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init(): Promise<boolean> {

    /** Load and cache tax list */
    this.taxList = (await this.apiService.getPromise<TaxModel[]>('/accounting/taxes')).map(tax => {
      tax['id'] = tax.Code;
      tax['text'] = tax.Name;
      return tax;
    });
    // if (!PurchaseOrderVoucherFormComponent._taxList) {
    // } else {
    //   this.taxList = PurchaseOrderVoucherFormComponent._taxList;
    // }

    /** Load and cache unit list */
    this.unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units', { limit: 'nolimit' })).map(tax => {
      tax['id'] = tax.Code;
      tax['text'] = tax.Name;
      return tax;
    });
    // if (!PurchaseOrderVoucherFormComponent._unitList) {
    // } else {
    //   this.taxList = PurchaseOrderVoucherFormComponent._taxList;
    // }
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
      // this.changeDirectorRef.detectChanges();//https://viblo.asia/p/tim-hieu-ve-change-detection-trong-angular-djeZ18EjKWz
      return status;
    });
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: PurchaseOrderVoucherModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeContact'] = true;
    params['includeObject'] = true;
    params['includeDetails'] = true;
    params['includeRelativeVouchers'] = true;
    params['useBaseTimezone'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: PurchaseOrderVoucherModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: PurchaseOrderVoucherModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Details form load
      if (itemFormData.Details) {
        const details = this.getDetails(newForm);
        itemFormData.Details.forEach(detail => {
          const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, detail);
          details.push(newDetailFormGroup);
          // const comIndex = details.length - 1;
          this.onAddDetailFormGroup(newForm, newDetailFormGroup, details.length - 1);
        });
        this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: PurchaseOrderVoucherModel): FormGroup {
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
      // DirectReceiverName: [''],
      ObjectBankName: [''],
      ObjectBankCode: [''],

      Contact: [],
      ContactName: [],
      ContactPhone: [],
      ContactEmail: [],
      ContactAddress: [],
      ContactIdentifiedNumber: [],

      DateOfReceived: [''],
      DeliveryAddress: [''],
      Title: ['', Validators.required],
      Note: [''],
      SubNote: [''],
      DateOfOrder: [null, Validators.required],
      // RelativeVouchers: [],
      _total: [''],
      RelativeVouchers: [],
      RequireInvoice: [false],
      Details: this.formBuilder.array([]),
    });
    if (data) {
      // data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    } else {
      this.addDetailFormGroup(newForm);
    }
    newForm['_details'] = this.getDetails(newForm);
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: PurchaseOrderVoucherModel): void {
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
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: PurchaseOrderVoucherDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      // Id: [''],
      SystemUuid: [''],
      No: [''],
      Type: ['PRODUCT'],
      Product: [''],
      Description: [''],
      Quantity: [1],
      Price: [0],
      Unit: [''],
      // Tax: ['VAT10'],
      ToMoney: [0],
      Image: [[]],
      Reason: [''],
      ProductTaxName: [''],
      Tax: [''],
    });

    if (data) {
      if (data?.Product && Array.isArray(data.Product['Units'])) {
        const unitControl = newForm.get('Unit');
        newForm['UnitList'] = data?.Product['Units'];
      }
      // (async () => {
      newForm.patchValue(data);
      if (!data['Type']) {
        data["Type"] = 'PRODUCT';
      }
      // await new Promise(resolve => setTimeout(() => resolve(true), 300));
      // this.toMoney(parentFormGroup, newForm, null, );
      // })()

    }
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
    this.toMoney(parentFormGroup, newChildFormGroup, null, index);
    // Load product name    
    newChildFormGroup.get('Product').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(async value => {
      const productNames = await this.apiService.getPromise<any[]>('/admin-product/names', { eq_Type: '[SUPPLIERPRODUCT,SUPPLIERPRODUCTTAX]', eq_product: this.commonService.getObjectId(value), eq_Object: this.commonService.getObjectId(parentFormGroup.get('Object').value), sort_LastUpdate: 'asc' });

      if (productNames) {
        for (const productName of productNames) {
          if (productName.Type == 'SUPPLIERPRODUCT') {
            if (!newChildFormGroup['IsImport'] || !newChildFormGroup.get('Description').value) {
              newChildFormGroup.get('Description').setValue(productName.Name);
            }
          }
          if (productName.Type == 'SUPPLIERPRODUCTTAX') {
            if (!newChildFormGroup['IsImport'] || !newChildFormGroup.get('ProductTaxName').value) {
              newChildFormGroup.get('ProductTaxName').setValue(productName.Name);
            }
          }
        }
      }
    });
  }
  onRemoveDetailFormGroup(parentFormGroup: FormGroup, detailFormGroup: FormGroup) {
  }

  /**
   * Choose product form recent purchase order and add to details
   * @param parentFormGroup 
   * @returns 
   */
  addMultiProducts(parentFormGroup: FormGroup) {

    const filter = { group_Object: true, group_Product: true, includeUnit: true };
    const objectId = this.commonService.getObjectId(parentFormGroup.get('Object').value);
    if (objectId) {
      filter['eq_Object'] = objectId;
      filter['sort_DateOfOrder'] = 'desc';
    }

    this.commonService.openDialog(DynamicListDialogComponent, {
      context: {
        inputMode: 'dialog',
        choosedMode: true,
        onDialogChoose: async (choosedItems: PurchaseOrderVoucherDetailModel[]) => {
          console.log(choosedItems);
          const productIds = choosedItems.map(m => m.Product);
          const productList = await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { eq_Code: '[' + productIds.join(',') + ']', select: "id=>Code,text=>Name,Code=>Code,Name,OriginName=>Name,Sku,FeaturePicture,Pictures", includeSearchResultLabel: true, includeUnits: true });
          const details = this.getDetails(parentFormGroup);
          for (const product of productList) {
            const chooseItem = choosedItems.find(f => f.Product as any == product.Code);
            const newDetailFormGroup = this.makeNewDetailFormGroup(parentFormGroup, {
              Product: product as any,
              Price: chooseItem?.Price,
              Quantity: chooseItem?.Quantity,
              Image: chooseItem?.Image
            });
            newDetailFormGroup['UnitList'] = product.Units;
            details.push(newDetailFormGroup);
            newDetailFormGroup.get('Unit').setValue(product.Units.find(f => f['DefaultImport']));
            this.onAddDetailFormGroup(parentFormGroup, newDetailFormGroup, details.length - 1);
          }
          this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
          // this.changeDirectorRef.detectChanges();
        },
        title: 'Danh sách hàng hóa đã đặt hàng nhà cung cấp ' + parentFormGroup.get('ObjectName').value,
        apiPath: '/purchase/order-voucher-details',
        idKey: ['Product'],
        params: filter,
        // actionButtonList: [],
        listSettings: {
          // pager: {
          //   display: true,
          //   perPage: 10,
          // },
          actions: false,
          columns: {
            // No: {
            //   title: 'No.',
            //   type: 'string',
            //   width: '5%',
            //   filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
            // },
            Order: {
              title: this.commonService.textTransform(this.commonService.translate.instant('Common.voucher'), 'head-title'),
              type: 'text',
              renderComponent: SmartTableTagsComponent,
              // onComponentInitFunction: (instance: SmartTableTagsComponent) => {
              //   instance.click.subscribe((voucher: string) => this.commonService.previewVoucher('CLBRTORDER', voucher));
              // },
              width: '10%',
              // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
              // valuePrepareFunction: (cell: string, row: any) => {
              //   return [{ id: cell, text: cell }] as any;
              // },
            },
            Product: {
              title: this.commonService.textTransform(this.commonService.translate.instant('Common.product'), 'head-title'),
              type: 'string',
              width: '10%',
              filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
            },
            Description: {
              title: this.commonService.textTransform(this.commonService.translate.instant('Common.description'), 'head-title'),
              type: 'string',
              width: '40%',
              filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
            },
            Unit: {
              title: this.commonService.textTransform(this.commonService.translate.instant('Product.unit'), 'head-title'),
              type: 'string',
              width: '10%',
              filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
              valuePrepareFunction: (cell, row) => {
                return this.commonService.getObjectText(cell);
              }
            },
            Quantity: {
              title: this.commonService.textTransform(this.commonService.translate.instant('Common.quantity'), 'head-title'),
              type: 'string',
              width: '10%',
              filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
            },
            Price: {
              title: this.commonService.textTransform(this.commonService.translate.instant('Common.price'), 'head-title'),
              type: 'custom',
              class: 'align-right',
              width: '10%',
              position: 'right',
              renderComponent: SmartTableCurrencyComponent,
              onComponentInitFunction: (instance: SmartTableCurrencyComponent) => {
                // instance.format$.next('medium');
                instance.style = 'text-align: right';
              },
            },
            ToMoney: {
              title: this.commonService.textTransform(this.commonService.translate.instant('Common.numOfMoney'), 'head-title'),
              type: 'custom',
              class: 'align-right',
              width: '10%',
              position: 'right',
              renderComponent: SmartTableCurrencyComponent,
              onComponentInitFunction: (instance: SmartTableCurrencyComponent) => {
                // instance.format$.next('medium');
                instance.style = 'text-align: right';
              },
              valuePrepareFunction: (cell: string, row: PurchaseOrderVoucherDetailModel) => {
                return `${row.Quantity * row.Price}`;
              },
            },
            Preview: {
              title: this.commonService.translateText('Common.show'),
              type: 'custom',
              width: '5%',
              class: 'align-right',
              renderComponent: SmartTableButtonComponent,
              onComponentInitFunction: (instance: SmartTableButtonComponent) => {
                instance.iconPack = 'eva';
                instance.icon = 'external-link-outline';
                instance.display = true;
                instance.status = 'primary';
                instance.style = 'text-align: right';
                instance.class = 'align-right';
                instance.title = this.commonService.translateText('Common.preview');
                instance.valueChange.subscribe(value => {
                  // instance.icon = value ? 'unlock' : 'lock';
                  // instance.status = value === 'REQUEST' ? 'warning' : 'success';
                  // instance.disabled = value !== 'REQUEST';
                });
                instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: PurchaseOrderVoucherDetailModel) => {
                  this.commonService.previewVoucher('PURCHASEORDER', rowData.Order);
                });
              },
            }
          }
        }
      },
    });

    // const newChildFormGroup = this.makeNewDetailFormGroup(parentFormGroup);
    // const detailsFormArray = this.getDetails(parentFormGroup);
    // detailsFormArray.push(newChildFormGroup);
    // const noFormControl = newChildFormGroup.get('No');
    // if (!noFormControl.value) {
    //   noFormControl.setValue(detailsFormArray.length);
    // }
    // this.onAddDetailFormGroup(parentFormGroup, newChildFormGroup, detailsFormArray.length - 1);
    return false;
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
          formGroup.get('ContactPhone').setValue(selectedData.Phone);
          formGroup.get('ContactEmail').setValue(selectedData.Email);
          formGroup.get('ContactAddress').setValue(selectedData.Address);
        }
      }
    }
  }

  onSelectProduct(detail: FormGroup, selectedData: ProductModel, parentForm: FormGroup) {
    console.log(selectedData);
    if (!this.isProcessing) {
      if (selectedData) {
        if (!detail['IsImport'] || !detail.get('Description').value) {
          detail.get('Description').setValue(selectedData.Name);
        }
        if (selectedData.Units) {
          const unitControl = detail.get('Unit');
          detail['UnitList'] = selectedData.Units;
          unitControl.patchValue(selectedData.Units.find(f => f['DefaultImport'] === true));
        }
        if (selectedData.Pictures && selectedData.Pictures.length > 0) {
          detail.get('Image').setValue(selectedData.Pictures);
        } else {
          detail.get('Image').setValue([]);
        }
      } else {
        if (!detail['IsImport'] || !detail.get('Description').value) {
          detail.get('Description').setValue('');
        }
        detail.get('Unit').setValue('');
      }
    }
    return false;
  }

  // calculatToMoney(detail: FormGroup) {
  //   let toMoney = detail.get('Quantity').value * detail.get('Price').value;
  //   // let tax = detail.get('Tax').value;
  //   // if (tax) {
  //   //   if (typeof tax === 'string') {
  //   //     tax = this.taxList.filter(t => t.Code === tax)[0];
  //   //   }
  //   //   toMoney += toMoney * tax.Tax / 100;
  //   // }
  //   return toMoney;
  // }
  calculatToMoney(detail: FormGroup, source?: string) {
    if (source === 'ToMoney') {
      const price = detail.get('ToMoney').value / detail.get('Quantity').value;
      return price;
    } else {
      const toMoney = detail.get('Quantity').value * detail.get('Price').value;
      return toMoney;
    }
  }

  // toMoney(formItem: FormGroup, detail: FormGroup) {
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


  async preview(formItem: FormGroup) {
    const data: PurchaseOrderVoucherModel = formItem.value;
    // data.Details.forEach(detail => {
    //   if (typeof detail['Tax'] === 'string') {
    //     detail['Tax'] = this.taxList.filter(t => t.Code === detail['Tax'])[0] as any;
    //     if (this.unitList) {
    //       detail['Unit'] = (detail['Unit'] && detail['Unit'].Name) || this.unitList.filter(t => t.Code === detail['Unit'])[0] as any;
    //     }
    //   }
    // });
    this.commonService.openDialog(PurchaseOrderVoucherPrintComponent, {
      context: {
        showLoadinng: true,
        title: 'Xem trước',
        data: [data],
        idKey: ['Code'],
        onSaveAndClose: (priceReport: PurchaseOrderVoucherModel) => {
          this.saveAndClose();
        },
        onSaveAndPrint: (priceReport: PurchaseOrderVoucherModel) => {
          this.save();
        },
      },
    });
    return false;
  }

  getRawFormData() {
    return super.getRawFormData();
  }

  openRelativeVoucher(relativeVocher: any) {
    if (relativeVocher) this.commonService.previewVoucher(relativeVocher.type, relativeVocher);
    // if (relativeVocher) {
    //   if (relativeVocher.type == 'PURCHASE') {
    //     this.commonService.openDialog(PurchaseVoucherPrintComponent, {
    //       context: {
    //         showLoadinng: true,
    //         title: 'Xem trước',
    //         id: [this.commonService.getObjectId(relativeVocher)],
    //         // data: data,
    //         idKey: ['Code'],
    //         // approvedConfirm: true,
    //         onClose: (data: PurchaseVoucherModel) => {
    //           this.refresh();
    //         },
    //       },
    //     });
    //   }
    // }
    return false;
  }

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
      action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
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

  openRelativeVoucherChoosedDialog(formGroup: FormGroup) {
    this.commonService.openDialog(ReferenceChoosingDialogComponent, {
      context: {
        components: {
          'COMMERCEPOSORDER': { title: 'Đơn hàng POS' },
          'SALES': { title: 'Phiếu bán hàng' },
          'PRICEREPORT': { title: 'Phiếu báo giá' },
        },
        // inputMode: 'dialog',
        onDialogChoose: async (chooseItems: any[], type?: string) => {
          console.log(chooseItems);
          const relationVoucher = formGroup.get('RelativeVouchers');
          const relationVoucherValue: any[] = (relationVoucher.value || []);
          const insertList = [];
          this.onProcessing();
          if (type === 'COMMERCEPOSORDER') {
            const details = this.getDetails(formGroup);
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                // get purchase order
                const voucher = await this.apiService.getPromise<CommercePosOrderModel[]>('/commerce-pos/orders/' + chooseItems[i].Code, { includeContact: true, includeObject: true, includeDetails: true, includeRelativeVouchers: true, includeUnit: true }).then(rs => rs[0]);

                if (['PRICEREPORT'].indexOf(this.commonService.getObjectId(voucher.State)) < 0) {
                  this.commonService.toastService.show(this.commonService.translateText('Đơn đặt POS chưa được báo giá'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                delete voucher.Id;
                formGroup.patchValue({ ...voucher, Code: null, Id: null, Object: null, ObjectName: null, ObjectPhone: null, PbjectAddress: null, ObjectIdentifiedNumber: null, Details: [] });
                details.clear();
                // }
                insertList.push(chooseItems[i]);

                // Insert order details into voucher details
                if (voucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Đơn đặt hàng POS: ' + voucher.Code + ' - ' + voucher.Title }));
                  for (const voucherDetail of voucher.Details) {
                    if (voucherDetail.Type === 'PRODUCT') {
                      const newDetailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Id: null, No: null, Voucher: null, Price: null, RelateDetail: `COMMERCEPOSORDER/${voucher.Code}/${voucherDetail.SystemUuid}` });
                      details.push(newDetailFormGroup);
                      // const selectedUnit = voucherDetail.Product.Units.find(f => f.id == voucherDetail.Unit.id);
                      // if (selectedUnit) {
                      // }
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: 'COMMERCEPOSORDER' }))]);
            this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
          }

          setTimeout(() => {
            this.onProcessed();
          }, 1000);
        },
      }
    })
    return false;
  }

  exportDetails(formItem: FormGroup) {
    const data = this.getRawFormData();
    const details = [];
    let no = 0;
    for (const detail of data.array[0].Details) {
      no++;
      details.push({
        STT: no,
        Sku: detail['Product']['Sku'],
        Product: this.commonService.getObjectId(detail['Product']),
        ProductName: detail['Description'],
        ProductTaxName: detail['ProductTaxName'],
        Tax: detail['Tax'],
        Unit: this.commonService.getObjectId(detail['Unit']),
        UnitName: this.commonService.getObjectText(detail['Unit']),
        Price: detail['Price'],
        Quantity: detail['Quantity'],
        ToMoney: detail['ToMoney'],
      });
    }
    const sheet = XLSX.utils.json_to_sheet(details);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Chi tiết đơn đặt mua hàng');
    XLSX.writeFile(workbook, 'DDMH-' + data.array[0].Code + ' - ' + data.array[0].Title + ' - NCC: ' + this.commonService.getObjectId(data.array[0].Object) + ' - ' + data.array[0].ObjectName + '.xlsx');

  }

  fileName: string;
  importDetails(formItem: FormGroup, ev: any) {
    const reader = new FileReader();
    const file = ev.target.files[0];
    if (!file) return;
    this.fileName = file.name;
    reader.onload = async (event) => {
      try {
        this.isProcessing = true;
        let chooseSheet = null;
        const data = reader.result;
        const workBook = XLSX.read(data, { type: 'binary' });
        let sheet = null;
        const jsonData = workBook.SheetNames.reduce((initial, name) => {
          sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        this.isProcessing = false;

        const sheets = Object.keys(jsonData);
        if (sheets.length > 1) {
          sheet = await new Promise((resove, reject) => {
            this.commonService.openDialog(DialogFormComponent, {
              context: {
                cardStyle: { width: '500px' },
                title: 'File excel có nhiều hơn 1 sheet, mời bạn chọn sheet cần import',
                onInit: async (form, dialog) => {
                  // const sheet = form.get('Sheet');
                  // const description = form.get('Description');
                  // sheet.setValue(null);
                  // description.setValue(parseFloat(activeDetail.get('Description').value));
                  return true;
                },
                onClose: async (form, dialog) => {
                  // ev.target.
                  return true;
                },
                controls: [
                  {
                    name: 'Sheet',
                    label: 'Sheet',
                    placeholder: 'Chọn sheet...',
                    type: 'select2',
                    initValue: sheets[0],
                    // focus: true,
                    option: {
                      data: sheets.map(m => ({ id: m, text: m })),
                      placeholder: 'Chọn sheet...',
                      allowClear: true,
                      width: '100%',
                      dropdownAutoWidth: true,
                      minimumInputLength: 0,
                      withThumbnail: false,
                      keyMap: {
                        id: 'id',
                        text: 'text',
                      },
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
                    label: 'Chọn',
                    icon: 'generate',
                    status: 'success',
                    // keyShortcut: 'Enter',
                    action: async (form: FormGroup, formDialogConpoent: DialogFormComponent) => {

                      console.log(form.value);
                      chooseSheet = this.commonService.getObjectId(form.get('Sheet').value);
                      resove(jsonData[chooseSheet]);

                      // formDialogConpoent.dismiss();

                      return true;
                    },
                  },
                ],
              },
              closeOnEsc: false,
              closeOnBackdropClick: false,
            });

          });
        } else {
          sheet = jsonData[sheets[0]];
          chooseSheet = sheets[0];
        }

        // const productList: any[] = sheet;

        // Confirm mapping
        const tmpSheet: string[][] = XLSX.utils.sheet_to_json(workBook.Sheets[chooseSheet], { header: 1 });
        const columnList = tmpSheet[0].map((m: string) => {
          const id = m.split('/')[0];
          const text = m;
          return { id, text };
        });

        // Confirm mapping
        // const columnList = Object.keys(sheet[0]).map(m => ({ id: m, text: m }));
        let details = [];
        this.commonService.openDialog(DialogFormComponent, {
          context: {
            cardStyle: { width: '500px' },
            title: 'Mời bạn chọn cột tương ứng với các trường thông tin sản phẩm',
            onInit: async (form, dialog) => {
              // const sku = form.get('Sku');
              // sheet.setValue('Sku');
              return true;
            },
            controls: [
              {
                name: 'Sku',
                label: 'Sku',
                placeholder: '',
                type: 'select2',
                initValue: columnList.find(f => this.commonService.getObjectId(f) == 'Sku'),
                // focus: true,
                option: {
                  data: columnList,
                  placeholder: 'Chọn sku...',
                  allowClear: true,
                  width: '100%',
                  dropdownAutoWidth: true,
                  minimumInputLength: 0,
                  withThumbnail: false,
                  keyMap: {
                    id: 'id',
                    text: 'text',
                  },
                }
              },
              {
                name: 'Product',
                label: 'Sản phẩm',
                placeholder: '',
                type: 'select2',
                initValue: columnList.find(f => this.commonService.getObjectId(f) == 'Product'),
                // focus: true,
                option: {
                  data: columnList,
                  placeholder: 'Chọn sản phẩm...',
                  allowClear: true,
                  width: '100%',
                  dropdownAutoWidth: true,
                  minimumInputLength: 0,
                  withThumbnail: false,
                  keyMap: {
                    id: 'id',
                    text: 'text',
                  },
                }
              },
              {
                name: 'ProductName',
                label: 'Tên sản phẩm',
                placeholder: '',
                type: 'select2',
                initValue: columnList.find(f => this.commonService.getObjectId(f) == 'ProductName'),
                // focus: true,
                option: {
                  data: columnList,
                  placeholder: 'Chọn tên sản phẩm...',
                  allowClear: true,
                  width: '100%',
                  dropdownAutoWidth: true,
                  minimumInputLength: 0,
                  withThumbnail: false,
                  keyMap: {
                    id: 'id',
                    text: 'text',
                  },
                }
              },
              {
                name: 'Unit',
                label: 'ĐVT',
                placeholder: '',
                type: 'select2',
                initValue: columnList.find(f => this.commonService.getObjectId(f) == 'Unit'),
                // focus: true,
                option: {
                  data: columnList,
                  placeholder: 'Chọn ĐVT...',
                  allowClear: true,
                  width: '100%',
                  dropdownAutoWidth: true,
                  minimumInputLength: 0,
                  withThumbnail: false,
                  keyMap: {
                    id: 'id',
                    text: 'text',
                  },
                }
              },
              {
                name: 'UnitName',
                label: 'Tên ĐVT',
                placeholder: '',
                type: 'select2',
                initValue: columnList.find(f => this.commonService.getObjectId(f) == 'UnitName'),
                // focus: true,
                option: {
                  data: columnList,
                  placeholder: 'Chọn tên ĐVT...',
                  allowClear: true,
                  width: '100%',
                  dropdownAutoWidth: true,
                  minimumInputLength: 0,
                  withThumbnail: false,
                  keyMap: {
                    id: 'id',
                    text: 'text',
                  },
                }
              },
              {
                name: 'Price',
                label: 'Đơn giá',
                placeholder: '',
                type: 'select2',
                initValue: columnList.find(f => this.commonService.getObjectId(f) == 'Price'),
                // focus: true,
                option: {
                  data: columnList,
                  placeholder: 'Chọn đơn giá...',
                  allowClear: true,
                  width: '100%',
                  dropdownAutoWidth: true,
                  minimumInputLength: 0,
                  withThumbnail: false,
                  keyMap: {
                    id: 'id',
                    text: 'text',
                  },
                }
              },
              {
                name: 'Quantity',
                label: 'Số lượng',
                placeholder: '',
                type: 'select2',
                initValue: columnList.find(f => this.commonService.getObjectId(f) == 'Quantity'),
                // focus: true,
                option: {
                  data: columnList,
                  placeholder: 'Chọn số lượng...',
                  allowClear: true,
                  width: '100%',
                  dropdownAutoWidth: true,
                  minimumInputLength: 0,
                  withThumbnail: false,
                  keyMap: {
                    id: 'id',
                    text: 'text',
                  },
                }
              },
              {
                name: 'ProductTaxName',
                label: 'Tên thuế',
                placeholder: '',
                type: 'select2',
                initValue: columnList.find(f => this.commonService.getObjectId(f) == 'ProductTaxName'),
                // focus: true,
                option: {
                  data: columnList,
                  placeholder: 'Chọn tên thuế',
                  allowClear: true,
                  width: '100%',
                  dropdownAutoWidth: true,
                  minimumInputLength: 0,
                  withThumbnail: false,
                  keyMap: {
                    id: 'id',
                    text: 'text',
                  },
                }
              },
              {
                name: 'Tax',
                label: 'Thuế NCC',
                placeholder: '',
                type: 'select2',
                initValue: columnList.find(f => this.commonService.getObjectId(f) == 'Tax'),
                // focus: true,
                option: {
                  data: columnList,
                  placeholder: 'Chọn thuế NCC...',
                  allowClear: true,
                  width: '100%',
                  dropdownAutoWidth: true,
                  minimumInputLength: 0,
                  withThumbnail: false,
                  keyMap: {
                    id: 'id',
                    text: 'text',
                  },
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
                label: 'Xác nhận',
                icon: 'generate',
                status: 'success',
                // keyShortcut: 'Enter',
                action: async (form: FormGroup, formDialogConpoent: DialogFormComponent) => {
                  this.onProcessing();
                  try {
                    const mapping = form.getRawValue();
                    for (const i in mapping) {
                      mapping[i] = this.commonService.getObjectText(mapping[i]);
                    }

                    console.log(form.value);


                    // details = [];
                    // let index = 0;
                    const details = this.getDetails(formItem);
                    if (details.length == 1 && !this.commonService.getObjectId(details.controls[0].get('Product').value)) {
                      details.clear();
                    }

                    const productIds = [];
                    const detailsData: PurchaseOrderVoucherDetailModel[] = [];

                    for (const row of sheet) {
                      //  = sheet.map(async (row: any, index: number) => {

                      let product: ProductModel = null;
                      if (row[mapping['Sku']]) {
                        product = await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { eq_Sku: row[mapping['Sku']], includeIdText: true, includeUnitConversions: true }).then(rs => rs[0]);
                      } else if (row[mapping['Product']]) {
                        product = await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { eq_Code: row[mapping['Product']] }).then(rs => rs[0]);
                      } else if (row[mapping['ProductName']]) {// Load product by product name map by supplier
                        const productName = await this.apiService.getPromise<any[]>('/admin-product/names', { eq_Type: 'SUPPLIERPRODUCT', eq_Name: row[mapping['ProductName']], eq_Object: this.commonService.getObjectId(formItem.get('Object').value), sort_LastUpdate: 'desc' }).then(rs => rs[0]);
                        if (productName) {
                          product = await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { eq_Code: productName.Product, includeIdText: true, includeUnitConversions: true }).then(rs => rs[0]);
                        } else {
                          product = await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { eq_Name: row[mapping['ProductName']], includeIdText: true, includeUnitConversions: true }).then(rs => rs[0]);
                        }
                      }

                      let unit = null;
                      if (row[mapping['Unit']]) {
                        unit = this.adminProductService.unitMap$?.value[row[mapping['Unit']]?.trim()];
                      }
                      if (!unit && product) {
                        unit = product.UnitConversions?.find(f => f.Name == row[mapping['UnitName']]?.trim());
                      }

                      if (product) productIds.push(this.commonService.getObjectId(product));

                      const detail = {
                        Image: product?.Pictures,
                        Product: product,
                        Description: product && product.Name || row[mapping['ProductName']],
                        Unit: unit,
                        Price: row[mapping['Price']],
                        Quantity: row[mapping['Quantity']],
                        ProductTaxName: row[mapping['ProductTaxName']],
                        Tax: row[mapping['Tax']],
                        UnitList: product?.UnitConversions || [],
                      };
                      detailsData.push(detail);
                    }

                    const tmpRs = await this.apiService.getPromise<any[]>('/admin-product/names', { eq_Product: '[' + productIds.join(',') + ']', eq_Object: this.commonService.getObjectId(formItem.get('Object').value), sort_LastUpdate: 'asc' });
                    const productNameMap = {
                      SUPPLIERPRODUCT: {},
                      SUPPLIERPRODUCTTAX: {},
                    };
                    for (const tmp of tmpRs) {
                      if (productNameMap[tmp.Type]) productNameMap[tmp.Type][tmp.Product] = tmp;
                    }

                    for (const detail of detailsData) {
                      const supplierProductName = productNameMap['SUPPLIERPRODUCT'][this.commonService.getObjectId(detail.Product)];
                      const supplierProductTaxName = productNameMap['SUPPLIERPRODUCTTAX'][this.commonService.getObjectId(detail.Product)];
                      if (supplierProductName) {
                        detail.Description = supplierProductName.Name;
                      }
                      if (supplierProductTaxName) {
                        detail.ProductTaxName = supplierProductTaxName.Name;
                      }
                      const newDetailFormGroup = this.makeNewDetailFormGroup(formItem, detail);
                      newDetailFormGroup['UnitList'] = detail['UnitList'];
                      newDetailFormGroup['IsImport'] = true;
                      details.push(newDetailFormGroup);
                      // newDetailFormGroup.get('Unit').setValue(product.UnitConversions.find(f => f['DefaultImport']));
                      this.onAddDetailFormGroup(formItem, newDetailFormGroup, details.length - 1);
                      this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
                    }
                    this.onProcessed();
                  } catch (err) {
                    this.onProcessed();
                  }
                  return true;
                }
              }
            ]
          }
        });
      } catch (err) {
        this.isProcessing = false;
      }
    };
    reader.readAsBinaryString(file);


    // this.commonService.openDialog(DialogFormComponent, {
    //   context: {
    //     cardStyle: { width: '500px' },
    //     title: 'Mời bạn chọn đơn vị tính cho khớp và xác nhận',
    //     onInit: async (form, dialog) => {
    //       // const sku = form.get('Sku');
    //       // sheet.setValue('Sku');
    //       return true;
    //     },
    //     controls: [
    //       {
    //         name: 'Sku',
    //         label: 'Sku',
    //         placeholder: 'Chọn sku...',
    //         type: 'select2',
    //         initValue: 'Sku',
    //         // focus: true,
    //         option: {
    //           data: columnList,
    //           placeholder: 'Chọn sku...',
    //           allowClear: true,
    //           width: '100%',
    //           dropdownAutoWidth: true,
    //           minimumInputLength: 0,
    //           withThumbnail: false,
    //           keyMap: {
    //             id: 'id',
    //             text: 'text',
    //           },
    //         }
    //       },
    //     ],
    //     actions: [
    //       {
    //         label: 'Esc - Trở về',
    //         icon: 'back',
    //         status: 'basic',
    //         keyShortcut: 'Escape',
    //         action: () => { return true; },
    //       },
    //       {
    //         label: 'Xác nhận',
    //         icon: 'generate',
    //         status: 'success',
    //         // keyShortcut: 'Enter',
    //         action: (form: FormGroup, formDialogConpoent: DialogFormComponent) => {
    //           return true;
    //         },
    //       },
    //     ],
    //   },
    //   closeOnEsc: false,
    //   closeOnBackdropClick: false,
    // });
  }

}

import { Select2Component } from './../../../../../vendor/ng2select2 copy/lib/ng2-select2.component';
import { ProductUnitModel } from '../../../../models/product.model';
import { WarehouseGoodsContainerModel, WarehouseInventoryAdjustNoteDetailModel, WarehouseInventoryAdjustNoteModel } from '../../../../models/warehouse.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { environment } from '../../../../../environments/environment';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { PurchaseVoucherModel } from '../../../../models/purchase.model';
import { SalesVoucherModel } from '../../../../models/sales.model';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { WarehouseInventoryAdjustNotePrintComponent } from '../inventory-adjust-note-print/inventory-adjust-note-print.component';
import { BusinessModel } from '../../../../models/accounting.model';
import { CustomIcon } from '../../../../lib/custom-element/form/form-group/form-group.component';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { filter, take, takeUntil } from 'rxjs/operators';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { ReferenceChoosingDialogComponent } from '../../../dialog/reference-choosing-dialog/reference-choosing-dialog.component';
import { SystemConfigModel } from '../../../../models/model';

@Component({
  selector: 'ngx-inventory-adjust-note-form',
  templateUrl: './inventory-adjust-note-form.component.html',
  styleUrls: ['./inventory-adjust-note-form.component.scss'],
})
export class WarehouseInventoryAdjustNoteFormComponent extends DataManagerFormComponent<WarehouseInventoryAdjustNoteModel> implements OnInit {

  componentName: string = 'WarehouseInventoryAdjustNoteFormComponent';
  idKey = 'Code';
  apiPath = '/warehouse/inventory-adjust-notes';
  baseFormUrl = '/warehouse/inventory-adjust-notes/form';

  previewAfterCreate = true;
  printDialog = WarehouseInventoryAdjustNotePrintComponent;

  env = environment;

  locale = this.commonService.getCurrentLoaleDataset();
  curencyFormat: CurrencyMaskConfig = this.commonService.getCurrencyMaskConfig();
  numberFormat: CurrencyMaskConfig = this.commonService.getNumberMaskConfig();
  // sortableInstance: any;

  /** Tax list */
  static _taxList: (TaxModel & { id?: string, text?: string })[];
  taxList: (TaxModel & { id?: string, text?: string })[];

  /** Unit list */
  static _unitList: (UnitModel & { id?: string, text?: string })[];
  unitList: ProductUnitModel[];

  warehouseContainerList = [];

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

  accountingBusinessList: BusinessModel[] = [
    {
      id: 'GOODSINVENTORYADJUST',
      text: 'Điều chỉnh hàng hóa tồn kho',
    },
  ];
  select2OptionForAccountingBusiness = {
    placeholder: 'Nghiệp vụ kế toán...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    dropdownCssClass: 'is_tags',
    multiple: true,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  select2OptionForAccessNumbers = {
    placeholder: 'Số truy xuất...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    dropdownCssClass: 'is_tags',
    multiple: true,
    // maximumSelectionLength: 1,
    tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  customIcons: CustomIcon[] = [{
    icon: 'plus-square-outline', title: this.commonService.translateText('Common.addNewProduct'), status: 'success', action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      this.commonService.openDialog(ProductFormComponent, {
        context: {
          inputMode: 'dialog',
          // inputId: ids,
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

  systemConfigs: SystemConfigModel;

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<WarehouseInventoryAdjustNoteFormComponent>,
    public adminProductService: AdminProductService,
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

    this.commonService.systemConfigs$.pipe(takeUntil(this.destroy$)).subscribe(configs => this.systemConfigs = configs);
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  select2OptionForProduct = {
    ...this.commonService.makeSelect2AjaxOption('/admin-product/products', { select: "id=>Code,text=>Name,Code=>Code,Name,OriginName=>Name,Sku,FeaturePicture,Pictures", includeSearchResultLabel: true, includeUnits: true }, {
      limit: 10,
      placeholder: 'Chọn hàng hóa...',
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
    // // tags: true,
    // withThumbnail: true,
    // keyMap: {
    //   id: 'Code',
    //   text: 'Name',
    // },
    // ajax: {
    //   // url: params => {
    //   //   return this.apiService.buildApiUrl('/admin-product/products', { select: "id=>Code,text=>Name,Code=>Code,Name=>Name,FeaturePicture=>FeaturePicture,Pictures=>Pictures", includeUnit: true, 'search': params['term'] });
    //   // },
    //   transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
    //     console.log(settings);
    //     const params = settings.data;
    //     this.apiService.getPromise('/admin-product/products', { select: "id=>Code,text=>Name,Code=>Code,Name=>Name,FeaturePicture=>FeaturePicture,Pictures=>Pictures", includeUnit: true, includeUnits: true, 'search': params['term'] }).then(rs => {
    //       success(rs);
    //     }).catch(err => {
    //       console.error(err);
    //       failure();
    //     });
    //   },
    //   delay: 300,
    //   processResults: (data: any, params: any) => {
    //     // console.info(data, params);
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

  select2OptionForContainer = {
    placeholder: 'Chọn kho/ngăn/kệ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
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
    icon: 'plus-square-outline', title: this.commonService.translateText('Common.addNewContact'), status: 'success', action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      this.commonService.openDialog(ContactFormComponent, {
        context: {
          inputMode: 'dialog',
          // inputId: ids,
          data: [{ Groups: [{ id: 'SUPPLIER', text: this.commonService.translateText('Common.supplier') }] }],
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
    }
  }];

  contactControlIcons: CustomIcon[] = [{
    icon: 'plus-square-outline', title: this.commonService.translateText('Common.addNewContact'), status: 'success', action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      this.commonService.openDialog(ContactFormComponent, {
        context: {
          inputMode: 'dialog',
          // inputId: ids,
          data: [{ Groups: [{ id: 'CONTACT', text: this.commonService.translateText('Common.contact') }] }],
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
    }
  }];

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init(): Promise<boolean> {

    /** Load and cache tax list */
    // if (!PurchaseOrderVoucherFormComponent._taxList) {
    //   this.taxList = PurchaseOrderVoucherFormComponent._taxList = (await this.apiService.getPromise<TaxModel[]>('/accounting/taxes')).map(tax => {
    //     tax['id'] = tax.Code;
    //     tax['text'] = tax.Name;
    //     return tax;
    //   });
    // } else {
    //   this.taxList = PurchaseOrderVoucherFormComponent._taxList;
    // }

    /** Load and cache unit list */
    // this.unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units', {limit: 'nolimit'})).map(tax => {
    //   tax['id'] = tax.Code;
    //   tax['text'] = tax.Name;
    //   return tax;
    // });

    await this.adminProductService.unitList$.pipe(filter(f => !!f), take(1)).toPromise().then(list => this.unitList = list);

    // if (!PurchaseOrderVoucherFormComponent._unitList) {
    // } else {
    //   this.unitList = PurchaseOrderVoucherFormComponent._unitList;
    // }

    this.warehouseContainerList = await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { sort_Path: 'asc', select: 'id=>Code,text=>Path' });
    // this.accountingBusinessList = await this.apiService.getPromise<BusinessModel[]>('/accounting/business', { eq_Type: 'WAREHOUSERECEIPT', select: 'id=>Code,text=>Name,type=>Type' });

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
  executeGet(params: any, success: (resources: WarehouseInventoryAdjustNoteModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeContact'] = true;
    params['includeDetails'] = true;
    params['includeRelativeVouchers'] = true;
    params['useBaseTimezone'] = true;
    params['includeAccessNumbers'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: WarehouseInventoryAdjustNoteModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: WarehouseInventoryAdjustNoteModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Details form load
      if (itemFormData.Details) {
        const details = this.getDetails(newForm);
        itemFormData.Details.forEach(detail => {
          const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, detail);
          details.push(newDetailFormGroup);
          // const comIndex = details.length - 1;
          this.onAddDetailFormGroup(newForm, newDetailFormGroup);
          if (detail.Product) {
            this.onSelectProduct(newDetailFormGroup, detail.Product, true);
            const seelctedUnit = detail.Product.Units.find(f => f.id == detail.Unit.id);
            this.onSelectUnit(newDetailFormGroup, seelctedUnit);
          }
        });
        this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }

    });

  }

  makeNewFormGroup(data?: WarehouseInventoryAdjustNoteModel): FormGroup {
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

      DateOfAdjusted: [null, Validators.required],
      ReceiptAddress: [''],
      Title: [''],
      Note: [''],
      SubNote: [''],
      RelativeVouchers: [],
      _total: [''],
      Details: this.formBuilder.array([]),
    });
    if (data) {
      // data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    } else {
      this.addDetailFormGroup(newForm);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: WarehouseInventoryAdjustNoteModel): void {
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
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: WarehouseInventoryAdjustNoteDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      // Id: [''],
      No: [''],
      Type: ['PRODUCT', Validators.required],
      Product: [''],
      Description: ['', Validators.required],
      Quantity: [0],
      // Price: [0],
      Unit: [''],
      // Tax: ['VAT10'],
      // ToMoney: [0],
      Image: [[]],
      Container: [''],
      RelateDetail: [''],
      Business: [this.accountingBusinessList.filter(f => f.id === 'GOODSINVENTORYADJUST')],
      AccessNumbers: [[]],
    });

    if (data) {
      newForm.patchValue(data);
      if (!data['Type']) {
        data["Type"] = 'PRODUCT';
      }
      this.toMoney(parentFormGroup, newForm);
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
    this.onAddDetailFormGroup(parentFormGroup, newChildFormGroup);
    return false;
  }
  removeDetailGroup(parentFormGroup: FormGroup, detail: FormGroup, index: number) {
    this.getDetails(parentFormGroup).removeAt(index);
    this.onRemoveDetailFormGroup(parentFormGroup, detail);
    return false;
  }
  onAddDetailFormGroup(parentFormGroup: FormGroup, newChildFormGroup: FormGroup) {
  }
  onRemoveDetailFormGroup(parentFormGroup: FormGroup, detailFormGroup: FormGroup) {
  }
  /** End Detail Form */

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

  onSelectProduct(detail: FormGroup, selectedData: ProductModel, doNotAutoFill?: boolean) {

    console.log(selectedData);
    const productId = this.commonService.getObjectId(selectedData);
    if (productId) {
      if (!doNotAutoFill) {
        const descriptionControl = detail.get('Description');
        descriptionControl.setValue(selectedData['OriginName']);
      }
      detail['unitList'] = selectedData.Units;
      if (!doNotAutoFill) {
        if (selectedData.Units && selectedData?.Units.length > 0) {
          const defaultUnit = selectedData.Units.find(f => f['DefaultExport'] === true);
          detail.get('Unit').setValue(defaultUnit);
        }
      }
      // detail['IsManageByAccessNumber'] = selectedData?.IsManageByAccessNumber;
    }
    return false;
  }

  async onSelectUnit(detail: FormGroup, selectedData: ProductModel, force?: boolean) {
    const unitId = this.commonService.getObjectId(selectedData);
    const productId = this.commonService.getObjectId(detail.get('Product').value);
    if (typeof selectedData?.IsManageByAccessNumber !== 'undefined') {
      detail['IsManageByAccessNumber'] = selectedData.IsManageByAccessNumber;
    }
    if (unitId && productId) {
      const containerList = await this.apiService.getPromise<any[]>('/warehouse/goods', {
        select: 'Code',
        includeUnit: true,
        includeContainers: true,
        includeAccessNumbers: true,
        eq_Code: productId,
        eq_ConversionUnit: unitId
      }).then(goodsList => {
        // const results = [];
        if (goodsList && goodsList.length > 0) {
          if (goodsList[0].WarehouseUnit && goodsList[0].WarehouseUnit['IsManageByAccessNumber']) {
            detail['IsManageByAccessNumber'] = goodsList[0].WarehouseUnit['IsManageByAccessNumber'] || false;
          }
          return goodsList[0].Containers.map(m => ({
            // ...m,
            AccessNumbers: m?.AccessNumbers,
            // AccessNumbers: m?.AccessNumbers?.map(an => ({ id: an, text: an })),
            id: m.Container,
            text: `${m.ContainerPath}: ${m.ContainerDescription}`
          }));
        }
        return [];
      });
      detail['ContainerList'] = containerList;
      if (containerList && containerList.length == 1) {
        detail.get('Container').setValue(containerList[0]);
      }

    }
  }

  // compileAccessNumber(accessNumber: string, goodsId: string) {
  //   const coreEmbedId = this.systemConfigs.ROOT_CONFIGS.coreEmbedId;
  //   let _goodsId = goodsId.replace(new RegExp(`^118${coreEmbedId}`), '');
  //   let an = accessNumber.replace(/^127/, '');
  //   return (_goodsId.length + 10 + '').padStart(2, '0') + `${_goodsId}` + an;
  // }

  // decompileAccessNumber(accessNumber: string) {
  //   const coreEmbedId = this.systemConfigs.ROOT_CONFIGS.coreEmbedId;
  //   const goodsIdLength = parseInt(accessNumber.substring(0, 2)) - 10;
  //   const goodsId = '118' + coreEmbedId + accessNumber.substring(2, 2 + goodsIdLength);
  //   const _accessNumber = accessNumber.substring(2 + goodsIdLength);
  //   return { accessNumber: '127' + _accessNumber, goodsId: goodsId };
  // }

  async onSelectContainer(detail: FormGroup, selectedData: ProductModel, force?: boolean) {
    console.log(selectedData);
    if (selectedData && selectedData['AccessNumbers']) {
      detail['AccessNumberList'] = selectedData['AccessNumbers'].map(accessNumber => {
        // const coreEmbedId = this.systemConfigs.ROOT_CONFIGS.coreEmbedId;
        // let goodsId = this.commonService.getObjectId(detail.get('Product').value).replace(new RegExp(`^118${coreEmbedId}`), '');
        // let an = accessNumber.replace(/^127/, '');

        accessNumber = { origin: true, id: accessNumber, text: this.commonService.compileAccessNumber(accessNumber, this.commonService.getObjectId(detail.get('Product').value)) };
        return accessNumber;
      });
    } else {
      detail['AccessNumberList'] = [];
    }
  }
  async onSelectAccessNumbers(detail: FormGroup, selectedData: any[], force?: boolean, element?: Select2Component) {
    console.log(selectedData);
    let hadChanged = false;
    if (selectedData && selectedData.length > 0) {
      for (const an of selectedData) {
        if (!an?.origin && an.id == an.text) {
          const { accessNumber, goodsId } = this.commonService.decompileAccessNumber(this.commonService.getObjectId(an));
          console.log(accessNumber, goodsId);
          an.id = accessNumber;
          hadChanged = true;
        }
      }
      if (hadChanged) {
        const accessNumbersControl = detail.get('AccessNumbers');
        accessNumbersControl.setValue(selectedData);
        setTimeout(() => {
          $(element['controls'].element[0])['select2']('open');
        }, 500);
      }
      detail.get('Quantity').setValue(selectedData && selectedData.length || 0);
    }
  }

  calculatToMoney(detail: FormGroup) {
    // let toMoney = detail.get('Quantity').value * detail.get('Price').value;
    // let tax = detail.get('Tax').value;
    // if (tax) {
    //   if (typeof tax === 'string') {
    //     tax = this.taxList.filter(t => t.Code === tax)[0];
    //   }
    //   toMoney += toMoney * tax.Tax / 100;
    // }
    // return toMoney;
    return 0;
  }

  toMoney(formItem: FormGroup, detail: FormGroup) {
    // detail.get('ToMoney').setValue(this.calculatToMoney(detail));

    // // Call culate total
    // const details = this.getDetails(formItem);
    // let total = 0;
    // for (let i = 0; i < details.controls.length; i++) {
    //   total += this.calculatToMoney(details.controls[i] as FormGroup);
    // }
    // formItem.get('_total').setValue(total);
    return false;
  }


  // async preview(formItem: FormGroup) {
  //   const data: WarehouseInventoryAdjustNoteModel = formItem.value;
  //   // data.Details.forEach(detail => {
  //   //   if (typeof detail['Tax'] === 'string') {
  //   //     detail['Tax'] = this.taxList.filter(t => t.Code === detail['Tax'])[0] as any;
  //   //     if (this.unitList) {
  //   //       detail['Unit'] = (detail['Unit'] && detail['Unit'].Name) || this.unitList.filter(t => t.Code === detail['Unit'])[0] as any;
  //   //     }
  //   //   }
  //   // });
  //   this.commonService.openDialog(WarehouseInventoryAdjustNotePrintComponent, {
  //     context: {
  //       showLoadinng: true,
  //       title: 'Xem trước',
  //       data: [data],
  //       idKey: ['Code'],
  //       onSaveAndClose: (priceReport: WarehouseInventoryAdjustNoteModel) => {
  //         this.saveAndClose();
  //       },
  //       onSaveAndPrint: (priceReport: WarehouseInventoryAdjustNoteModel) => {
  //         this.save();
  //       },
  //     },
  //   });
  //   return false;
  // }

  getRawFormData() {
    return super.getRawFormData();
  }

  openRelativeVoucherChoosedDialog(formGroup: FormGroup) {
    this.commonService.openDialog(ReferenceChoosingDialogComponent, {
      context: {
        components: {
          'PURCHASE': { title: 'Phiếu mua hàng' },
          'GOODSDELIVERY': { title: 'Phiếu xuất kho' },
        },
        // inputMode: 'dialog',
        onDialogChoose: async (chooseItems: any[], type?: string) => {
          console.log(chooseItems);
          const relationVoucher = formGroup.get('RelativeVouchers');
          const relationVoucherValue: any[] = (relationVoucher.value || []);
          const insertList = [];
          this.onProcessing();
          if (type === 'PURCHASE') {
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                const details = this.getDetails(formGroup);
                // get purchase order
                const voucher = await this.apiService.getPromise<SalesVoucherModel[]>('/purchase/vouchers/' + chooseItems[i].Code, { includeContact: true, includeDetails: true }).then(rs => rs[0]);

                if (['APPROVED', 'COMPLETE'].indexOf(this.commonService.getObjectId(voucher.State)) < 0) {
                  this.commonService.toastService.show(this.commonService.translateText('Phiếu bán hàng chưa được duyệt'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.commonService.getObjectId(formGroup.get('Object').value)) {
                  if (this.commonService.getObjectId(voucher.Object, 'Code') != this.commonService.getObjectId(formGroup.get('Object').value)) {
                    this.commonService.toastService.show(this.commonService.translateText('Nhà cung cấp trong phiếu mua hàng không giống với phiếu nhập kho'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete voucher.Id;
                  // delete voucher.Code;
                  formGroup.patchValue({ ...voucher, Id: null, Code: null, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);

                // Insert order details into voucher details
                if (voucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu bán hàng: ' + voucher.Code + ' - ' + voucher.Title }));
                  for (const voucherDetail of voucher.Details) {
                    if (voucherDetail.Type === 'PRODUCT') {
                      // delete orderDetail.Id;
                      // delete orderDetail.Voucher;
                      // delete orderDetail.No;
                      const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Id: null, No: null, Voucher: null, Business: null, RelateDetail: `PURCHASE/${voucher.Code}/${voucherDetail.Id}` });
                      newDtailFormGroup.get('Business').disable();
                      details.push(newDtailFormGroup);
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: 'PURCHASE' }))]);
          }
          if (type === 'GOODSDELIVERY') {
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                const details = this.getDetails(formGroup);
                // get purchase order
                const voucher = await this.apiService.getPromise<SalesVoucherModel[]>('/warehouse/goods-delivery-notes/' + chooseItems[i].Code, { includeContact: true, includeDetails: true }).then(rs => rs[0]);

                if (['APPROVED', 'COMPLETE'].indexOf(this.commonService.getObjectId(voucher.State)) < 0) {
                  this.commonService.toastService.show(this.commonService.translateText('Phiếu bán hàng chưa được duyệt'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.commonService.getObjectId(formGroup.get('Object').value)) {
                  if (this.commonService.getObjectId(voucher.Object, 'Code') != this.commonService.getObjectId(formGroup.get('Object').value)) {
                    this.commonService.toastService.show(this.commonService.translateText('Đối tượng theo dõi trong phiếu nhập không giống với phiếu nhập xuất'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete voucher.Id;
                  // delete voucher.Code;
                  formGroup.patchValue({ ...voucher, Id: null, Code: null, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);

                // Insert order details into voucher details
                if (voucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Id: null, Description: 'Phiếu bán hàng: ' + voucher.Code + ' - ' + voucher.Title }));
                  for (const voucherDetail of voucher.Details) {
                    if (voucherDetail.Type === 'PRODUCT') {
                      // delete orderDetail.Id;
                      // delete orderDetail.Voucher;
                      // delete orderDetail.No;
                      const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Id: null, No: null, Voucher: null, Business: null, RelateDetail: `GOODSDELIVERY/${voucher.Code}/${voucherDetail.Id}` });
                      newDtailFormGroup.get('Business').disable();
                      details.push(newDtailFormGroup);
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: 'PURCHASE' }))]);
          }
          setTimeout(() => {
            this.onProcessed();
          }, 1000);
        },
      }
    })
    return false;
  }

  openRelativeVoucher(relativeVocher: any) {
    if (relativeVocher) this.commonService.previewVoucher(relativeVocher.type, relativeVocher);
    // if (relativeVocher && relativeVocher.type == 'PURCHASE') {
    //   this.commonService.openDialog(PurchaseVoucherPrintComponent, {
    //     context: {
    //       showLoadinng: true,
    //       title: 'Xem trước',
    //       id: [this.commonService.getObjectId(relativeVocher)],
    //       // data: data,
    //       idKey: ['Code'],
    //       // approvedConfirm: true,
    //       onClose: (data: SalesVoucherModel) => {
    //         this.refresh();
    //       },
    //     },
    //   });
    // }
    return false;
  }

  removeRelativeVoucher(formGroup: FormGroup, relativeVocher: any) {
    const relationVoucher = formGroup.get('RelativeVouchers');
    relationVoucher.setValue(relationVoucher.value.filter(f => f?.id !== this.commonService.getObjectId(relativeVocher)));
    return false;
  }

}

import { ProductUnitConversoinModel, ProductUnitModel } from './../../../../models/product.model';
import { GoodsModel, WarehouseGoodsContainerModel } from './../../../../models/warehouse.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { environment } from '../../../../../environments/environment';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { MultifunctionalPurchaseDetailModel, MultifunctionalPurchaseModel, MultifunctionalPurchaseTransportPointModel, PurchaseOrderVoucherModel, PurchaseVoucherModel } from '../../../../models/purchase.model';
import { SalesReturnsVoucherModel, SalesVoucherModel } from '../../../../models/sales.model';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { BusinessModel } from '../../../../models/accounting.model';
import { CustomIcon, FormGroupComponent } from '../../../../lib/custom-element/form/form-group/form-group.component';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { filter, pairwise, startWith, take, takeUntil } from 'rxjs/operators';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { ReferenceChoosingDialogComponent } from '../../../dialog/reference-choosing-dialog/reference-choosing-dialog.component';
import { RootServices } from '../../../../services/root.services';
import { AssignNewContainerFormComponent } from '../../../warehouse/goods/assign-new-containers-form/assign-new-containers-form.component';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';

@Component({
  selector: 'ngx-multifunctional-purchase-form',
  templateUrl: './multifunctional-purchase-form.component.html',
  styleUrls: ['./multifunctional-purchase-form.component.scss'],
})
export class MultifunctionalPurchaseFormComponent extends DataManagerFormComponent<MultifunctionalPurchaseModel> implements OnInit {

  componentName: string = 'MultifunctionalPurchaseFormComponent';
  idKey = 'Code';
  apiPath = '/purchase/multifunctional-purchases';
  baseFormUrl = '/purchase/multifunctional-purchase/form';

  previewAfterCreate = true;
  // printDialog = MultifunctionalPurchaseGoodsReceiptPrintComponent;

  env = environment;

  locale = this.cms.getCurrentLoaleDataset();
  priceCurencyFormat: CurrencyMaskConfig = { ...this.cms.getCurrencyMaskConfig(), precision: 0 };
  toMoneyCurencyFormat: CurrencyMaskConfig = { ...this.cms.getCurrencyMaskConfig(), precision: 0 };
  quantityFormat: CurrencyMaskConfig = { ...this.cms.getNumberMaskConfig(), precision: 2 };
  // sortableInstance: any;

  /** Tax list */
  static _taxList: (TaxModel & { id?: string, text?: string })[];
  taxList: (TaxModel & { id?: string, text?: string })[];

  /** Unit list */
  static _unitList: (UnitModel & { id?: string, text?: string })[];
  unitList: ProductUnitModel[];

  towDigitsInputMask = this.cms.createFloatNumberMaskConfig({
    digitsOptional: false,
    digits: 2
  });

  warehouseContainerList = [];

  uploadConfig = {

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

  select2OptionForDetailSupplier: Select2Option = {
    ...this.select2OptionForContact,
    placeholder: 'Chọn nhà cung cấp...'
  };
  select2OptionForDetailShippingUnit: Select2Option = {
    ...this.select2OptionForContact,
    placeholder: 'Chọn ĐV Vận chuyển...'
  };

  customIcons: CustomIcon[] = [{
    icon: 'plus-square-outline', title: this.cms.translateText('Common.addNewProduct'), status: 'success', action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      this.cms.openDialog(ProductFormComponent, {
        context: {
          inputMode: 'dialog',
          // inputId: ids,
          onDialogSave: (newData: ProductModel[]) => {
            console.log(newData);
            // const formItem = formGroupComponent.formGroup;
            const newProduct: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name, Units: newData[0].UnitConversions?.map(unit => ({ ...unit, id: this.cms.getObjectId(unit?.Unit), text: this.cms.getObjectText(unit?.Unit) })) };
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

  customIconsForContainer: CustomIcon[] = [{
    icon: 'plus-square-outline', title: this.cms.translateText('Gán vị trí'),
    status: 'danger',
    states: {
      '<>': {
        icon: 'plus-square-outline',
        status: 'danger',
        title: this.cms.translateText('Thêm vị trí mới'),
      },
      '': {
        icon: 'plus-square-outline',
        status: 'success',
        title: this.cms.translateText('Thêm vị trí mới'),
      },
    },
    action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      const currentProduct = this.cms.getObjectId(formGroup.get('Product').value);
      const currentUnit = this.cms.getObjectId(formGroup.get('Unit').value);
      this.cms.openDialog(AssignNewContainerFormComponent, {
        context: {
          inputMode: 'dialog',
          inputGoodsList: [{ Code: currentProduct, WarehouseUnit: currentUnit }],
          onDialogSave: async (newData: ProductModel[]) => {
            await this.bulkLoadGoodsInfo([currentProduct]);
            this.onSelectUnit(formGroup, null, formGroup.get('Unit').value, true).then(rs => {
              formGroup.get('Container').patchValue({
                id: newData[0].Code, text: newData[0].Path + newData[0].Name,
              })
            });
          },
          onDialogClose: () => {
          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    }
  }];

  customIconsForProduct: { [key: string]: CustomIcon[] } = {};
  getCustomIconsForProduct(name: string): CustomIcon[] {
    if (this.customIconsForProduct[name]) return this.customIconsForProduct[name];
    return this.customIconsForProduct[name] = [{
      icon: 'plus-square-outline',
      title: this.cms.translateText('Common.addNewProduct'),
      status: 'success',
      states: {
        '<>': {
          icon: 'edit-outline',
          status: 'primary',
          title: this.cms.translateText('Common.editProduct'),
        },
        '': {
          icon: 'plus-square-outline',
          status: 'success',
          title: this.cms.translateText('Common.addNewProduct'),
        },
      },
      action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
        const currentProduct = this.cms.getObjectId(formGroup.get('Product').value);
        this.cms.openDialog(ProductFormComponent, {
          context: {
            inputMode: 'dialog',
            inputId: currentProduct ? [currentProduct] : null,
            showLoadinng: true,
            onDialogSave: (newData: ProductModel[]) => {
              console.log(newData);
              // const formItem = formGroupComponent.formGroup;
              const newProduct: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name, Units: newData[0].UnitConversions?.map(unit => ({ ...unit, id: this.cms.getObjectId(unit?.Unit), text: this.cms.getObjectText(unit?.Unit) })) };
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

  constructor(
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<MultifunctionalPurchaseFormComponent>,
    public adminProductService: AdminProductService,
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);

    /** Append print button to head card */
    this.actionButtonList.splice(this.actionButtonList.length - 1, 0, {
      name: 'print',
      status: 'primary',
      label: this.cms.textTransform(this.cms.translate.instant('Common.print'), 'head-title'),
      icon: 'printer',
      title: this.cms.textTransform(this.cms.translate.instant('Common.print'), 'head-title'),
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

  // select2OptionForProduct = {
  //   ...this.cms.makeSelect2AjaxOption('/admin-product/products', {
  //     select: "id=>Code,text=>Name,Code=>Code,Name,OriginName=>Name,Sku,FeaturePicture,Pictures",
  //     includeSearchResultLabel: true,
  //     includeUnits: true,
  //     sort_SearchRank: 'desc',
  //   }, {
  //     limit: 10,
  //     placeholder: 'Chọn hàng hóa...',
  //     prepareReaultItem: (item) => {
  //       item.thumbnail = item?.FeaturePicture?.Thumbnail;
  //       return item;
  //     }
  //   }),
  //   withThumbnail: true,
  // };

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

  select2OptionForAccessNumbers = {
    placeholder: 'Số truy xuất, tự động phát sinh khi lưu phiếu...',
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

  // accountingBusinessListForTransport: BusinessModel[] = [];
  select2OptionForAccountingBusinessForTransport = {
    placeholder: 'Nghiệp vụ kế toán...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    dropdownCssClass: 'is_tags',
    // multiple: true,
    // maximumSelectionLength: 1,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  availableShippingUnitList: ContactModel[] = [];
  select2OptionForShippingUnit = {
    ...this.cms.select2OptionForTemplate,
    placeholder: 'Nhân viên/ĐV Vận chuyển...',
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
    title: this.cms.translateText('Common.addNewContact'),
    status: 'success',
    states: {
      '<>': {
        icon: 'edit-outline',
        status: 'primary',
        title: this.cms.translateText('Common.editContact'),
      },
      '': {
        icon: 'plus-square-outline',
        status: 'success',
        title: this.cms.translateText('Common.addNewContact'),
      },
    },
    action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      const currentObject = this.cms.getObjectId(formGroup.get('Object').value);
      this.cms.openDialog(ContactFormComponent, {
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
    title: this.cms.translateText('Common.addNewContact'),
    status: 'success',
    states: {
      '<>': {
        icon: 'edit-outline',
        status: 'primary',
        title: this.cms.translateText('Common.editContact'),
      },
      '': {
        icon: 'plus-square-outline',
        status: 'success',
        title: this.cms.translateText('Common.addNewContact'),
      },
    },
    action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      const currentObject = this.cms.getObjectId(formGroup.get('Contact').value);
      this.cms.openDialog(ContactFormComponent, {
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

    await this.adminProductService.unitList$.pipe(filter(f => !!f), take(1)).toPromise().then(list => this.unitList = list);

    this.warehouseContainerList = await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { sort_Path: 'asc', select: 'id=>Code,text=>Path' });
    // this.accountingBusinessList = await this.apiService.getPromise<BusinessModel[]>('/accounting/business', { eq_Type: 'WAREHOUSERECEIPT', select: 'id=>Code,text=>Name,type' });
    this.rsv.accountingService.accountingBusinessList$.pipe(filter(f => !!f), takeUntil(this.destroy$)).subscribe(list => {
      this.accountingBusinessList = list.filter(f => ['PURCHASEWAREHOUSE', 'PURCHASECOSTDEBT'].indexOf(f.Code) > -1);
      // this.accountingBusinessListForTransport = list.filter(f => ['PURCHASECOSTDEBT'].indexOf(f.Code) > -1);
    });

    return super.init().then(status => {
      if (this.isDuplicate) {
        // Clear id
        this.id = [];
        this.array.controls.forEach((formItem, index) => {
          formItem.get('Code').setValue('');
          formItem.get('Title').setValue('Copy of: ' + formItem.get('Title').value);
          this.getDetails(formItem as FormGroup).controls.forEach(conditonFormGroup => {
            // Clear id
            // conditonFormGroup.get('Id').setValue('');
          });
        });
      }

      return status;
    });
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: MultifunctionalPurchaseModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeContact'] = true;
    params['includeDetails'] = true;
    params['includeTransportPoints'] = true;
    params['includeRelativeVouchers'] = true;
    params['useBaseTimezone'] = true;
    params['includeUnit'] = true;
    params['includeAccessNumbers'] = true;
    super.executeGet(params, (resources: MultifunctionalPurchaseModel[]) => {
      success(resources);
    }, error);
  }

  goodsMap: { [key: string]: GoodsModel } = {};
  async bulkLoadGoodsInfo(goodsIds: string[]) {
    // Bulk load containers
    const goodsList = await this.apiService.getPromise<any[]>('/warehouse/goods', {
      select: 'Code',
      includeUnit: true,
      includeContainers: true,
      eq_Code: '[' + goodsIds.join(',') + ']',
      limit: 'nolimit'
    });
    for (const goods of goodsList) {
      if (goods.Containers) {
        goods.Containers = goods.Containers.map(m => ({
          id: m.Container,
          text: `[${m.ContainerFindOrder}] ${m.ContainerPath}: ${m.ContainerDescription}`,
          Unit: m.Unit
        }))
      }
      if (!this.goodsMap[goods.Code]) {
        this.goodsMap[goods.Code] = goods;
      } else {
        if (!this.goodsMap[goods.Code].Containers) {
          this.goodsMap[goods.Code].Containers = [];
        }
        for (const container of goods.Containers) {
          if (!this.goodsMap[goods.Code].Containers.some(f => this.cms.getObjectId(f) == this.cms.getObjectId(container))) {
            this.goodsMap[goods.Code].Containers.push(container);
          }
        }
        // this.goodsMap[goods.Code].Containers = [
        //   ...this.goodsMap[goods.Code].Containers,
        //   ...goods.Containers,
        // ];
      }
    }
  }

  async formLoad(formData: MultifunctionalPurchaseModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: MultifunctionalPurchaseModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Details form load
      const contactIds = [
        ...new Set([
          ...itemFormData.Details.map(m => this.cms.getObjectId(m.Supplier)).filter(f => !!f),
          ...itemFormData.Details.map(m => this.cms.getObjectId(m.ShippingUnit)).filter(f => !!f),
        ])];
      const cotnacts = (contactIds.length > 0 ? (await this.apiService.getPromise<ContactModel[]>('/contact/contacts', {
        eq_Code: `[${contactIds.join(',')}]`,
        includeIdText: true,
        includeGroups: true,
      })) : []).reduce((result, curr, index) => {
        result[curr.id] = curr;
        curr['text'] = (curr['Title'] ? (curr['Title'] + '. ') : '') + (curr['ShortName'] ? (curr['ShortName'] + '/') : '') + curr['Name'] + ' - ' + curr['Code'] + (curr['Groups'] ? (' (' + curr['Groups'].map(g => g.text).join(', ') + ')') : '');
        return result;
      }, {} as { [key: string]: ContactModel });
      if (itemFormData.Details) {
        const details = this.getDetails(newForm);

        // Bulk load containers
        const goodsIds = itemFormData.Details.filter(f => this.cms.getObjectId(f.Type) != 'CATEGORY').map(m => this.cms.getObjectId(m.Product));
        await this.bulkLoadGoodsInfo(goodsIds);



        for (const detail of itemFormData.Details) {
          const productInfo = this.rsv.adminProductService.productMap[this.cms.getObjectId(detail.Product)];
          detail.Product.Units = productInfo.Units;

          detail.AccessNumbers = (Array.isArray(detail.AccessNumbers) && detail.AccessNumbers.length > 0 ? (detail.AccessNumbers.map(ac => this.cms.getObjectId(ac)).join('\n')) : '') as any;

          if (detail.Supplier) {
            detail.Supplier = cotnacts[this.cms.getObjectId(detail.Supplier)];
          }
          if (detail.ShippingUnit) {
            detail.ShippingUnit = cotnacts[this.cms.getObjectId(detail.ShippingUnit)];
          }

          const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, detail);
          details.push(newDetailFormGroup);
          // const comIndex = details.length - 1;
          this.onAddDetailFormGroup(newForm, newDetailFormGroup);
          if (detail.Product) {
            this.onSelectProduct(newDetailFormGroup, detail.Product, true);
            if (detail.Product.Units) {
              const seelctedUnit = detail.Product.Units.find(f => this.cms.getObjectId(f) == this.cms.getObjectId(detail.Unit));
              if (seelctedUnit) {
                this.onSelectUnit(newDetailFormGroup, null, seelctedUnit);
              }
            }
          }
          // if (detail.Supplier) {
          //   detail.Supplier = cotnacts[this.cms.getObjectId(detail.Supplier)];
          // }
        }
        this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
      }

      if (itemFormData.TransportPoints) {
        const transportPointArray = this.getTransportPoints(newForm);
        for (const transportPoint of itemFormData.TransportPoints) {
          if (transportPoint.ShippingUnit) {
            transportPoint.ShippingUnit = cotnacts[this.cms.getObjectId(transportPoint.ShippingUnit)];
          }
          const newTransportPointFormGroup = this.makeNewTransportPointFormGroup(newForm, transportPoint);
          transportPointArray.push(newTransportPointFormGroup);
          const comIndex = transportPointArray.length - 1;
          this.onAddTransportPointFormGroup(newForm, newTransportPointFormGroup, comIndex);
        }
        this.setNoForArray(transportPointArray.controls as FormGroup[], (detail: FormGroup) => true);
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }

    });

  }

  showTransportPointFormArray = true;
  makeNewFormGroup(data?: MultifunctionalPurchaseModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: { value: null, disabled: true },
      // Object: ['', Validators.required],
      // ObjectName: ['', Validators.required],
      // ObjectEmail: [''],
      // ObjectPhone: [''],
      // ObjectAddress: [''],
      // ObjectIdentifiedNumber: [''],
      // Recipient: [''],
      // ObjectTaxCode: [''],
      // DirectReceiverName: [''],
      // ObjectBankName: [''],
      // ObjectBankCode: [''],

      // Contact: [],
      // ContactName: [],
      // ContactPhone: [],
      // ContactEmail: [],
      // ContactAddress: [],
      // ContactIdentifiedNumber: [],

      DateOfPurchase: [null, Validators.required],
      // ReceiptAddress: [''],
      Title: [''],
      Note: [''],
      SubNote: [''],
      Thread: [],
      RelativeVouchers: [],
      // _total: [''],
      Details: this.formBuilder.array([]),
      TransportPoints: this.formBuilder.array([]),
    });
    if (data) {
      // data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    } else {
      this.addDetailFormGroup(newForm);
    }

    const transportPointArray = newForm['TransportPoints'] = newForm.get('TransportPoints') as FormArray;
    const detailArray = newForm['Details'] = newForm.get('Details') as FormArray;
    // Auto sum transport cost
    transportPointArray.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((transportPoints: MultifunctionalPurchaseTransportPointModel[]) => {
      this.cms.takeUntil('987346_transport_points_change', 300, () => {
        console.log('987346_transport_points_change: ', transportPoints);
        newForm['_totalTransportCost'] = 0;
        for (const transportPoint of transportPoints) {
          newForm['_totalTransportCost'] += parseFloat(transportPoint.TransportCost as any);
        }
      });
    });
    detailArray.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((details: MultifunctionalPurchaseDetailModel[]) => {
      this.cms.takeUntil('987346_details_change', 500, () => {
        console.log('987346_details_change: ', details);
        const shippingUnitMap = {};
        details.filter(detail => detail.ShippingUnit).map(detail => shippingUnitMap[this.cms.getObjectId(detail.ShippingUnit)] = detail.ShippingUnit);
        this.showTransportPointFormArray = false;
        this.availableShippingUnitList = Object.keys(shippingUnitMap).map(m => shippingUnitMap[m]);
        console.log('shipping unit list', this.availableShippingUnitList);
        setTimeout(() => {
          this.showTransportPointFormArray = true;
        }, 300);
      });
    });

    const titleControl = newForm.get('Title');
    // newForm.get('ObjectName').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(objectName => {
    //   if (objectName && (!titleControl.touched || !titleControl.value) && (!titleControl.value || /^Nhập kho: /.test(titleControl.value))) {
    //     titleControl.setValue(`Nhập kho: ${objectName}`);
    //   }
    // });

    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: MultifunctionalPurchaseModel): void {
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
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: MultifunctionalPurchaseDetailModel): FormGroup {
    let newForm: FormGroup = null;
    newForm = this.formBuilder.group({
      // Id: [''],
      SystemUuid: [''],
      No: [''],
      Type: ['PRODUCT', Validators.required],
      Product: [null, (control: FormControl) => {
        if (newForm && this.cms.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.cms.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      Description: ['', Validators.required],
      Quantity: [1],
      Price: [0],
      ToMoney: [0],
      // Price: [0],
      Unit: [null, (control: FormControl) => {
        if (newForm && this.cms.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.cms.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      // Tax: ['VAT10'],
      // ToMoney: [0],
      Image: [[]],
      Container: ['', (control: FormControl) => {
        if (newForm && this.cms.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.cms.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      RelateDetail: [''],
      Signature: [''],
      Supplier: [],
      SupplierAddress: [],
      SupplierMapLink: [],
      Business: [this.accountingBusinessList.filter(f => f.id === 'PURCHASEWAREHOUSE' || f.id === 'PURCHASECOSTDEBT')],
      AccessNumbers: [[]],
      DateOfManufacture: [null],
      ExpiryDate: [null],
      ShippingUnit: [null],
      ShippingCostWeight: [1],
      ShippingCost: {value: 0, disabled: true},//Todo: hạch toán vào 1562 (chi phí mua hàng), khi tính giá kho thì tính tổng trên 156 (tức là bao gồn cả 1561 và 1562)
    });

    if (data) {
      if (data?.AccessNumbers && this.cms.getObjectId(data?.Product)) {
        for (const accessNumber of data?.AccessNumbers) {
          if (accessNumber?.id && accessNumber.id == accessNumber?.text) {
            accessNumber.text += ' (' + this.cms.compileAccessNumber(accessNumber.id, this.cms.getObjectId(data?.Product)) + ')';
          }
        }
      }
      newForm.patchValue(data);
      setTimeout(() => {
        if (data.Unit) newForm.get('Unit').setValue(data.Unit);
      }, 0);
      if (!data['Type']) {
        data["Type"] = 'PRODUCT';
      }
      this.toMoney(parentFormGroup, newForm);

    }
    newForm.get('Unit').valueChanges.pipe(takeUntil(this.destroy$), startWith(null), pairwise()).subscribe(([prev, next]) => {
      console.log(prev, next);
      this.onSelectUnit(newForm, prev, next);
    });

    const imagesFormControl = newForm.get('Image');
    const supplierControl = newForm.get('Supplier');
    const supplierAddressControl = newForm.get('SupplierAddress');
    const supplierMapLinkControl = newForm.get('SupplierMapLink');
    newForm.get('Product').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (value) {
        if (value.Pictures && value.Pictures.length > 0) {
          imagesFormControl.setValue(value.Pictures);
        } else {
          imagesFormControl.setValue([]);
        }
      }
    });
    newForm.get('Supplier').valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: ContactModel) => {
      if (!this.isProcessing) {
        if (value) {
          if (value.FullAddress) {
            supplierAddressControl.setValue(value.FullAddress, { emitEvent: false });
          } else {
            supplierAddressControl.setValue(null, { emitEvent: false });
          }
          if (value.MapLink) {
            supplierMapLinkControl.setValue(value.MapLink, { emitEvent: false });
          } else {
            supplierMapLinkControl.setValue(null, { emitEvent: false });
          }
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

  /** Transport Trip Form */
  makeNewTransportPointFormGroup(parentFormGroup: FormGroup, data?: MultifunctionalPurchaseTransportPointModel): FormGroup {
    let newForm: FormGroup = null;
    newForm = this.formBuilder.group({
      // Id: [''],
      SystemUuid: [''],
      No: [''],
      ShippingUnit: [],
      ShippingUnitPhone: [],
      ShippingUnitAddress: [],
      ShippingUnitMapLink: [],
      // ShippingUnitName: [],
      // TransportFrom: [],
      // TransportTo: [],
      Note: [],
      TransportCost: [],
      // Business: [],
    });

    if (data) {
      newForm.patchValue(data);
    }

    const shipingUnit = newForm.get('ShippingUnit');
    const shipingUnitPhone = newForm.get('ShippingUnitPhone');
    const shipingUnitMapLink = newForm.get('ShippingUnitMapLink');
    const shipingUnitAddress = newForm.get('ShippingUnitAddress');
    shipingUnit.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((contact: ContactModel) => {
      if (!this.isProcessing) {
        console.log('Shipping unit change: ', contact);
        shipingUnitPhone.setValue(contact?.Phone);
        shipingUnitAddress.setValue(contact?.FullAddress);
        shipingUnitMapLink.setValue(contact?.MapLink);
      }
    });
    return newForm;
  }

  onTransportPointSupplierChange(detail: FormGroup, supplier: ContactModel, formItem: FormGroup) {
    console.log(supplier);
  }
  onShippingUnitChange(transportPoint: FormGroup, shippingUnit: ContactModel, formItem: FormGroup) {
    console.log(shippingUnit);
    // if (shippingUnit) {
    //   transportPoint.get('ShippingUnitPhone').setValue(shippingUnit.Phone);
    //   transportPoint.get('ShippingUnitEmail').setValue(shippingUnit.Email);
    // }
  }

  getTransportPoints(parentFormGroup: FormGroup) {
    return parentFormGroup.get('TransportPoints') as FormArray;
  }
  addTransportPointFormGroup(parentFormGroup: FormGroup) {
    const newChildFormGroup = this.makeNewTransportPointFormGroup(parentFormGroup);
    const detailsFormArray = this.getTransportPoints(parentFormGroup);
    detailsFormArray.push(newChildFormGroup);
    const noFormControl = newChildFormGroup.get('No');
    if (!noFormControl.value) {
      noFormControl.setValue(detailsFormArray.length);
    }
    this.onAddTransportPointFormGroup(parentFormGroup, newChildFormGroup, detailsFormArray.length - 1);
    return false;
  }
  removeTransportPointGroup(parentFormGroup: FormGroup, detail: FormGroup, index: number) {
    this.getTransportPoints(parentFormGroup).removeAt(index);
    this.onRemoveTransportPointFormGroup(parentFormGroup, detail);
    return false;
  }
  onAddTransportPointFormGroup(parentFormGroup: FormGroup, newChildFormGroup: FormGroup, index: number) {
  }
  onRemoveTransportPointFormGroup(parentFormGroup: FormGroup, detailFormGroup: FormGroup) {
  }
  /** End TransportPoint Form */

  // onObjectChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {
  //   // console.info(item);

  //   if (!this.isProcessing) {
  //     if (selectedData && !selectedData['doNotAutoFill']) {

  //       // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
  //       if (selectedData.Code) {
  //         formGroup.get('ObjectName').setValue(selectedData.Name);
  //         formGroup.get('ObjectPhone').setValue(selectedData.Phone);
  //         formGroup.get('ObjectEmail').setValue(selectedData.Email);
  //         formGroup.get('ObjectAddress').setValue(selectedData.Address);
  //         formGroup.get('ObjectTaxCode').setValue(selectedData.TaxCode);
  //         formGroup.get('ObjectBankName').setValue(selectedData.BankName);
  //         formGroup.get('ObjectBankCode').setValue(selectedData.BankAcc);
  //       }
  //     }
  //   }
  // }

  // onContactChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {
  //   // console.info(item);

  //   if (!this.isProcessing) {
  //     if (selectedData && !selectedData['doNotAutoFill']) {

  //       // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
  //       if (selectedData.Code) {
  //         formGroup.get('ContactName').setValue(selectedData.Name);
  //         formGroup.get('ContactPhone').setValue(selectedData.Phone);
  //         formGroup.get('ContactEmail').setValue(selectedData.Email);
  //         formGroup.get('ContactAddress').setValue(selectedData.Address);
  //       }
  //     }
  //   }
  // }



  onSelectProduct(detail: FormGroup, selectedData: ProductModel, doNotAutoFill?: boolean) {

    console.log(selectedData);
    const productId = this.cms.getObjectId(selectedData);
    if (productId) {
      if (!doNotAutoFill) {
        const descriptionControl = detail.get('Description');
        descriptionControl.setValue(selectedData['OriginName'] || selectedData['Name']);
      }
      detail['unitList'] = selectedData.Units;
      if (!doNotAutoFill && selectedData.Units && selectedData?.Units.length > 0) {
        const defaultUnit = selectedData.Units.find(f => f['IsDefaultPurchase'] === true);
        detail.get('Unit').setValue(defaultUnit);
      }
      // detail['IsManageByAccessNumber'] = selectedData?.IsManageByAccessNumber;
    }
    return false;
  }

  async onSelectUnit(detail: FormGroup, prevUnit: ProductUnitConversoinModel, nextUnit: ProductUnitConversoinModel, force?: boolean) {
    const unitId = this.cms.getObjectId(nextUnit);
    const productId = this.cms.getObjectId(detail.get('Product').value);
    if (typeof nextUnit?.IsManageByAccessNumber !== 'undefined') {
      detail['IsManageByAccessNumber'] = nextUnit.IsManageByAccessNumber;
      if (!this.isProcessing) {
        detail.get('AccessNumbers').setValue(null);
      }
    }
    if (unitId && productId) {

      let containerList = [];

      if (this.goodsMap[productId]) {
        containerList = (this.goodsMap[productId].Containers || []).filter(f => this.cms.getObjectId(f.Unit) == unitId);
      }
      if (containerList.length == 0) {
        containerList = await this.apiService.getPromise<any[]>('/warehouse/goods', {
          select: 'Code',
          includeUnit: true,
          includeContainers: true,
          eq_Code: productId,
          eq_ConversionUnit: unitId
        }).then(goodsList => {
          // const results = [];
          if (goodsList && goodsList.length > 0) {
            return goodsList[0].Containers.map(m => ({
              id: m.Container,
              text: `[${m.ContainerFindOrder}] ${m.ContainerPath}: ${m.ContainerDescription}`
            }));
          }
          return [];
        });
      }
      detail['ContainerList'] = containerList;
      if (containerList && containerList.length == 1) {
        detail.get('Container').setValue(containerList[0]);
      }

      // if (nextUnit && nextUnit['ConversionQuantity']) {
      //   if (!this.isProcessing) {
      //     detail.get('Quantity').setValue(nextUnit['ConversionQuantity']);
      //   }
      // }

      // Convertsion quantity
      if (prevUnit && prevUnit.id && !prevUnit.ConversionRatio) {
        const product: ProductModel = detail.get('Product').value;
        if (product && (product.Units || product.UnitConversions)) {
          if (!product.Units) {
            product.Units = product.UnitConversions.map(m => ({ ...m, id: this.cms.getObjectId(m.Unit), text: m.Name }))
          }
        }
        prevUnit = product?.Units.find(f => this.cms.getObjectId(f) == this.cms.getObjectId(prevUnit))
      }
      if (prevUnit && nextUnit && this.cms.getObjectId(prevUnit) != this.cms.getObjectId(nextUnit) && prevUnit.ConversionRatio && nextUnit.ConversionRatio) {
        const currentQuantity = parseFloat(detail.get('Quantity').value);

        let baseQuantity = currentQuantity * prevUnit.ConversionRatio;
        let nextQuantity = baseQuantity / nextUnit.ConversionRatio;

        detail.get('Quantity').setValue(nextQuantity);
      }
    }
  }

  calculatToMoney(detail: FormGroup) {
    return 0;
  }

  toMoney(formItem: FormGroup, detail: FormGroup, source?: string, index?: number) {
    // this.cms.takeUntil(this.componentName + '_ToMoney_ ' + index, 300).then(() => {
    const quantity = parseFloat(detail.get('Quantity').value || 0);
    const toMoney = parseFloat(detail.get('ToMoney').value || 0);
    if (source === 'ToMoney' && detail.get('ToMoney').value) {
      const price = toMoney / quantity;
      detail.get('Price').setValue(price, { emitEvent: false });
    } else {
      const price = parseFloat(detail.get('Price').value || 0);
      detail.get('ToMoney').setValue(quantity * price, { emitEvent: false });
    }
    // Call culate total
    const details = this.getDetails(formItem);
    let total = 0;
    for (const detail of details.value) {
      const quantity = parseFloat(detail.Quantity || 0);
      const price = parseFloat(detail.Price || 0);
      total += quantity * price;
    }
    formItem['_total'] = total;
    // });
    return false;
  }

  getRawFormData() {
    const data = super.getRawFormData();
    for (const item of data.array) {
      for (const detail of item.Details) {
        if (typeof detail.AccessNumbers == 'string') {
          detail.AccessNumbers = detail?.AccessNumbers.trim().split('\n').filter(ac => !!ac).map(ac => {
            if (/^127/.test(ac)) {
              return { id: ac, text: ac };
            }
            const acd = this.cms.decompileAccessNumber(ac);
            return { id: acd.accessNumber, text: acd.accessNumber };
          });
        }
      }
    }
    return data;
  }

  openRelativeVoucherChoosedDialog(formGroup: FormGroup) {
    this.cms.openDialog(ReferenceChoosingDialogComponent, {
      context: {
        components: {
          'PURCHASE': { title: 'Phiếu mua hàng' },
          'PURCHASEORDER': { title: 'Đơn đặt mua hàng' },
          'GOODSDELIVERY': { title: 'Phiếu xuất kho' },
          'SALESRETURNS': { title: 'Phiếu hàng bán trả lại' },
        },
        // inputMode: 'dialog',
        onDialogChoose: async (chooseItems: any[], type?: string) => {
          console.log(chooseItems);
          const relationVoucher = formGroup.get('RelativeVouchers');
          const relationVoucherValue: any[] = (relationVoucher.value || []);
          const insertList = [];
          this.onProcessing();
          if (type === 'PURCHASE') {
            const details = this.getDetails(formGroup);
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                // get purchase order
                const voucher = await this.apiService.getPromise<PurchaseVoucherModel[]>('/purchase/vouchers/' + chooseItems[i].Code, { includeObject: true, includeContact: true, includeDetails: true, dIncludeUnitConversionCalculate: true }).then(rs => rs[0]);

                if (['APPROVED', 'COMPLETE'].indexOf(this.cms.getObjectId(voucher.State)) < 0) {
                  this.cms.toastService.show(this.cms.translateText('Phiếu mua hàng chưa được duyệt'), this.cms.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.cms.getObjectId(formGroup.get('Object').value)) {
                  if (this.cms.getObjectId(voucher.Object, 'Code') != this.cms.getObjectId(formGroup.get('Object').value)) {
                    this.cms.toastService.show(this.cms.translateText('Nhà cung cấp trong phiếu mua hàng không giống với phiếu nhập kho'), this.cms.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete voucher.Id;
                  // delete voucher.Code;
                  formGroup.patchValue({ ...voucher, Code: null, Id: null, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);

                // Bulk load goods info
                const goodsIds = (voucher.Details || []).filter(f => this.cms.getObjectId(f.Type) != 'CATEGORY').map(m => this.cms.getObjectId(m.Product));
                await this.bulkLoadGoodsInfo(goodsIds);

                // Insert order details into voucher details
                if (voucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu mua hàng: ' + voucher.Code + ' - ' + voucher.Title }));
                  for (const voucherDetail of voucher.Details) {
                    const sourceDetailBusiness = voucherDetail.Business || [];
                    if (voucherDetail.Type === 'PRODUCT' && sourceDetailBusiness.findIndex(f => this.cms.getObjectId(f) == 'PURCHASESKIPWAREHOUSE') < 0) {
                      // delete orderDetail.Id;
                      // delete orderDetail.Voucher;
                      // delete orderDetail.No;
                      const newDetailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Id: null, No: null, Voucher: null, Business: null, RelateDetail: `PURCHASE/${voucher.Code}/${voucherDetail.SystemUuid}` });
                      newDetailFormGroup.get('Business').disable();
                      details.push(newDetailFormGroup);
                      this.onSelectProduct(newDetailFormGroup, voucherDetail.Product, true);
                      const selectedUnit = voucherDetail.Product.Units.find(f => f.id == voucherDetail.Unit.id);
                      if (selectedUnit) {
                        this.onSelectUnit(newDetailFormGroup, null, selectedUnit);
                      }
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: 'PURCHASE', typeMap: this.cms.voucherTypeMap['PURCHASE'] }))]);
            this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
          }
          if (type === 'PURCHASEORDER') {
            const details = this.getDetails(formGroup);
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                // get purchase order
                const voucher = await this.apiService.getPromise<PurchaseOrderVoucherModel[]>('/purchase/order-vouchers/' + chooseItems[i].Code, { includeObject: true, includeContact: true, includeDetails: true, dIncludeUnitConversionCalculate: true }).then(rs => rs[0]);

                if (!voucher) {
                  this.cms.toastService.show(this.cms.translateText('Không lấy được thông tin đơn đặt mua hàng'), this.cms.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }

                if (['APPROVED'].indexOf(this.cms.getObjectId(voucher.State)) < 0) {
                  this.cms.toastService.show(this.cms.translateText('Phiếu đặt mua hàng chưa được duyệt'), this.cms.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.cms.getObjectId(formGroup.get('Object').value)) {
                  if (this.cms.getObjectId(voucher.Object, 'Code') != this.cms.getObjectId(formGroup.get('Object').value)) {
                    this.cms.toastService.show(this.cms.translateText('Nhà cung cấp trong phiếu đặt mua hàng không giống với phiếu nhập kho'), this.cms.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete voucher.Id;
                  // delete voucher.Code;
                  formGroup.patchValue({ ...voucher, Code: null, Id: null, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);

                // Bulk load goods info
                const goodsIds = (voucher.Details || []).filter(f => this.cms.getObjectId(f.Type) != 'CATEGORY').map(m => this.cms.getObjectId(m.Product));
                await this.bulkLoadGoodsInfo(goodsIds);

                // Insert order details into voucher details
                if (voucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu đặt mua hàng: ' + voucher.Code + ' - ' + voucher.Title }));
                  for (const voucherDetail of voucher.Details) {
                    // Chỉ import sản phẩm nào được yêu cầu hạch toán mua hàng nhập kho
                    if (voucherDetail.Type == 'CATEGORY') {
                      const newDetailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Id: null, No: null, Voucher: null, Business: null, RelateDetail: `PURCHASEORDER/${voucher.Code}/${voucherDetail.SystemUuid}`, Signature: voucherDetail['Signature1'] } as any);
                      details.push(newDetailFormGroup);
                    } else {
                      if (Array.isArray(voucherDetail.Business) && voucherDetail.Business.find(f => this.cms.getObjectId(f) === 'PURCHASEWAREHOUSE')) {
                        const newDetailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Id: null, No: null, Voucher: null, Business: null, RelateDetail: `PURCHASEORDER/${voucher.Code}/${voucherDetail.SystemUuid}`, Signature: voucherDetail['Signature1'] } as any);
                        newDetailFormGroup.get('Business').disable();
                        details.push(newDetailFormGroup);
                        this.onSelectProduct(newDetailFormGroup, voucherDetail.Product, true);
                        const selectedUnit = voucherDetail.Product.Units.find(f => f.id == voucherDetail.Unit.id);
                        if (selectedUnit) {
                          this.onSelectUnit(newDetailFormGroup, null, selectedUnit);
                        }
                      }
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: 'PURCHASEORDER', typeMap: this.cms.voucherTypeMap['PURCHASEORDER'] }))]);
            this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
          }
          if (type === 'SALESRETURNS') {
            const details = this.getDetails(formGroup);
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                // get purchase order
                const voucher = await this.apiService.getPromise<SalesReturnsVoucherModel[]>('/sales/sales-returns-vouchers/' + chooseItems[i].Code, { includeRelativeVouchers: true, includeContact: true, includeDetails: true, includeUnit: true }).then(rs => rs[0]);

                if (['APPROVED', 'COMPLETE'].indexOf(this.cms.getObjectId(voucher.State)) < 0) {
                  this.cms.toastService.show(this.cms.translateText('Phiếu bán hàng chưa được duyệt'), this.cms.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.cms.getObjectId(formGroup.get('Object').value)) {
                  if (this.cms.getObjectId(voucher.Object, 'Code') != this.cms.getObjectId(formGroup.get('Object').value)) {
                    this.cms.toastService.show(this.cms.translateText('Nhà cung cấp trong phiếu mua hàng không giống với phiếu nhập kho'), this.cms.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete voucher.Id;
                  // delete voucher.Code;
                  formGroup.patchValue({ ...voucher, Code: null, Id: null, Details: [] });
                  details.clear();
                }

                // Bulk load goods info
                const goodsIds = (voucher.Details || []).filter(f => this.cms.getObjectId(f.Type) != 'CATEGORY').map(m => this.cms.getObjectId(m.Product));
                await this.bulkLoadGoodsInfo(goodsIds);

                insertList.push(chooseItems[i]);
                if (voucher.RelativeVouchers) {
                  for (const relativeVoucher of voucher.RelativeVouchers) {
                    if (relativeVoucher.type == 'GOODSDELIVERY') {
                      insertList.push(relativeVoucher);
                      const goodsDeliveryVoucher = await this.apiService.getPromise<MultifunctionalPurchaseModel[]>('/warehouse/goods-delivery-notes/' + relativeVoucher.id, { includeContact: true, includeDetails: true, includeUnit: true }).then(rs => rs[0]);
                      if (goodsDeliveryVoucher && goodsDeliveryVoucher.Details && goodsDeliveryVoucher.Details.length > 0) {
                        details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu xuất kho: ' + goodsDeliveryVoucher.Code + ' - ' + goodsDeliveryVoucher.Title }));
                        for (const goodsDeliveryDetail of goodsDeliveryVoucher.Details) {
                          if (goodsDeliveryDetail.Type === 'PRODUCT') {
                            const quantity = voucher.Details.find(f => this.cms.getObjectId(f.Product) == this.cms.getObjectId(goodsDeliveryDetail.Product))?.Quantity;
                            const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...goodsDeliveryDetail, Id: null, No: null, Voucher: null, Business: [this.accountingBusinessList.find(f => f.id == 'GOODSRECEIPTFORRETURNS')], RelateDetail: `GOODSDELIVERY/${goodsDeliveryVoucher.Code}/${goodsDeliveryDetail.Id}`, Quantity: quantity });
                            newDtailFormGroup.get('Business').disable();
                            details.push(newDtailFormGroup);
                            this.onSelectUnit(newDtailFormGroup, null, goodsDeliveryDetail.Unit, true);
                          }
                        }
                      }
                    }
                  }
                }

                // Insert order details into voucher details
                // if (voucher?.Details) {
                //   details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu trả hàng: ' + voucher.Code + ' - ' + voucher.Title }));
                //   for (const voucherDetail of voucher.Details) {
                //     if (voucherDetail.Type === 'PRODUCT') {
                //       // delete orderDetail.Id;
                //       // delete orderDetail.Voucher;
                //       // delete orderDetail.No;
                //       const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, No: null, Voucher: null, Business: [this.accountingBusinessList.find(f => f.id == 'GOODSRECEIPTFORRETURNS')], RelateDetail: `SALESRETURNS/${voucher.Code}/${voucherDetail.Id}` });
                //       newDtailFormGroup.get('Business').disable();
                //       details.push(newDtailFormGroup);
                //       this.onSelectUnit(newDtailFormGroup, voucherDetail.Unit, true);
                //     }
                //   }
                // }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.id || m?.Code, text: m?.text || m.Title, type: m?.type || type, typeMap: this.cms.voucherTypeMap[m?.type || type] }))]);
            this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
          }
          if (type === 'GOODSDELIVERY') {
            // Qui trình tqmj xuất tái nhập
            const details = this.getDetails(formGroup);
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                // get purchase order
                const voucher = await this.apiService.getPromise<SalesVoucherModel[]>('/warehouse/goods-delivery-notes/' + chooseItems[i].Code, { includeContact: true, includeDetails: true, dIncludeUnitConversionCalculate_x: true, includeAccessNumbers: true }).then(rs => rs[0]);

                if (['APPROVED', 'COMPLETE'].indexOf(this.cms.getObjectId(voucher.State)) < 0) {
                  this.cms.toastService.show(this.cms.translateText('Phiếu xuất kho chưa được duyệt'), this.cms.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.cms.getObjectId(formGroup.get('Object').value)) {
                  if (this.cms.getObjectId(voucher.Object, 'Code') != this.cms.getObjectId(formGroup.get('Object').value)) {
                    this.cms.toastService.show(this.cms.translateText('Đối tượng theo dõi trong phiếu nhập không giống với phiếu nhập xuất'), this.cms.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete voucher.Id;
                  // delete voucher.Code;
                  formGroup.patchValue({ ...voucher, Code: null, Id: null, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);

                // Bulk load goods info
                const goodsIds = (voucher.Details || []).filter(f => this.cms.getObjectId(f.Type) != 'CATEGORY').map(m => this.cms.getObjectId(m.Product));
                await this.bulkLoadGoodsInfo(goodsIds);

                // Insert order details into voucher details
                if (voucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Id: null, Description: 'Phiếu xuất: ' + voucher.Code + ' - ' + voucher.Title }));
                  for (const voucherDetail of voucher.Details) {
                    if (voucherDetail.Type === 'PRODUCT') {
                      // delete orderDetail.Id;
                      // delete orderDetail.Voucher;
                      // delete orderDetail.No;

                      // check duplicate
                      const existsDetail = details.controls.find(fDetail => this.cms.getObjectId(fDetail.get('Product').value) == this.cms.getObjectId(voucherDetail.Product) && this.cms.getObjectId(fDetail.get('Unit').value) == this.cms.getObjectId(voucherDetail.Unit));
                      if (!existsDetail) {

                        const accessNumbers = voucherDetail.AccessNumbers && Array.isArray(voucherDetail.AccessNumbers) && voucherDetail.AccessNumbers.length > 0 ? (voucherDetail.AccessNumbers.map(ac => this.cms.getObjectId(ac)).join('\n')) : '';
                        const newDetailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, AccessNumbers: accessNumbers as any, No: null, Voucher: null, Business: null, RelateDetail: `GOODSDELIVERY/${voucher.Code}/${voucherDetail.Id}` });
                        // newDetailFormGroup.get('Business').disable();
                        newDetailFormGroup['case'] = 'REIMPORT';

                        let business = [...voucherDetail.Business];
                        if (business) {
                          const busunessItemIndex = business.findIndex(f => this.cms.getObjectId(f) == 'WAREHOUSETEMPORARYEXPORT')
                          if (busunessItemIndex > -1) {
                            business[busunessItemIndex] = { id: 'WAREHOUSEREIMPORT', text: 'Tái nhập hàng hóa' };
                          }
                          newDetailFormGroup.get('Business').setValue(business);
                        }

                        details.push(newDetailFormGroup);

                        if (voucherDetail.Product?.Units) {
                          newDetailFormGroup['unitList'] = voucherDetail.Product?.Units;
                        }

                        const chooseUnit = voucherDetail.Product?.Units.find(f => this.cms.getObjectId(f) == this.cms.getObjectId(voucherDetail.Unit));
                        this.onSelectUnit(newDetailFormGroup, chooseUnit, null, true);
                      } else {
                        // Duplicate
                        existsDetail.get('Quantity').setValue(parseFloat(existsDetail.get('Quantity').value) + parseFloat(voucherDetail.Quantity));
                        if (voucherDetail.AccessNumbers && voucherDetail.AccessNumbers.length > 0) {
                          existsDetail.get('AccessNumbers').setValue(existsDetail.get('AccessNumbers').value + '\n' + voucherDetail.AccessNumbers.map(m => this.cms.getObjectId(m)).join('\n'));
                        }

                      }


                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: type, typeMap: this.cms.voucherTypeMap[type] }))]);
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

  openRelativeVoucher(relativeVocher: any) {
    if (relativeVocher) this.cms.previewVoucher(this.cms.getObjectId(relativeVocher.type), relativeVocher);
    return false;
  }

  removeRelativeVoucher(formGroup: FormGroup, relativeVocher: any) {
    const relationVoucher = formGroup.get('RelativeVouchers');
    relationVoucher.setValue(relationVoucher.value.filter(f => f?.id !== this.cms.getObjectId(relativeVocher)));
    return false;
  }

  extractToOtherUnits(parentFormGroup: FormGroup, detail: FormGroup, index: number) {
    const formDetails = this.getDetails(parentFormGroup);
    const newDetailFormGroup = this.makeNewDetailFormGroup(parentFormGroup, { ...detail.value, Id: null, SystemUuid: null });
    newDetailFormGroup['unitList'] = detail['unitList'];
    newDetailFormGroup['case'] = detail['case'];
    newDetailFormGroup['IsManageByAccessNumber'] = detail['IsManageByAccessNumber'];
    formDetails.controls.splice(index + 1, 0, newDetailFormGroup);
    this.onSelectUnit(newDetailFormGroup, null, newDetailFormGroup.get('Unit').value);
  }

  onSelectAccessNumbers(detail: FormGroup, event: any, force?: boolean, element?: any) {

    if (event.key == 'Enter' || force) {
      detail.get('Quantity').setValue(element.value.trim().split('\n').filter(ac => !!ac).length);
    }

    // // const { accessNumber, goodsId } = this.cms.decompileAccessNumber(this.cms.getObjectId(an));
    // let hadChanged = false;
    // for (const an of selectedData) {
    //   if (an.id == an.text) {
    //     const { accessNumber, goodsId } = this.cms.decompileAccessNumber(this.cms.getObjectId(an));
    //     console.log(accessNumber, goodsId);
    //     // an.text = an.text + ' (' + accessNumber + ')';
    //     an.text = accessNumber + ' (' + this.cms.getObjectId(an) + ')';
    //     an.id = accessNumber;
    //     hadChanged = true;
    //   }
    // }
    // if (hadChanged) {// Todo: nếu có thay đổi (quét thêm mã vào) thì giao điện không thể scroll được
    //   detail.get('AccessNumbers').setValue(selectedData);
    //   // const accessNumbersControl = detail.get('AccessNumbers');
    //   // accessNumbersControl.setValue(selectedData);
    //   setTimeout(() => {
    //     $(select2Conponent['controls']['element'][0])['select2']('open');
    //   }, 500);
    // }

    // // Update quantity by number access numbers
    // detail.get('Quantity').setValue(selectedData.length);
  }

  distributeCostIntoCostOfGoodsSold(formItem: FormGroup) {
    const detailArray = this.getDetails(formItem);
    const data: MultifunctionalPurchaseModel = formItem.value;
    const purchaseCosts = data.TransportPoints;
    const details = data.Details;

    for (const purchaseCost of purchaseCosts) {
      const shippingUnit = purchaseCost.ShippingUnit;
      const cost = purchaseCost.TransportCost;

      const relativeDetails: { [key: string]: MultifunctionalPurchaseDetailModel } = {};
      let totalWeight = 0;
      for (const i in details) {
        if (this.cms.getObjectId(details[i].ShippingUnit) == this.cms.getObjectId(shippingUnit)) {
          relativeDetails[i] = details[i];
          totalWeight += relativeDetails[i].ShippingCostWeight;
        }
      }
      const numOfRelativeDetails = Object.keys(relativeDetails).length;
      const distributeCost = cost / numOfRelativeDetails;
      for (const i in relativeDetails) {
        const shippingCostWeight = parseFloat(relativeDetails[i].ShippingCostWeight as any);
        (detailArray.controls[i] as FormGroup).get('ShippingCost').setValue(cost * shippingCostWeight / totalWeight, {emitEvent: false});
      }

    }

    return true;

  }

}

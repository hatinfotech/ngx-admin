import { Select2Component } from './../../../../../vendor/ng2select2 copy/lib/ng2-select2.component';
import { ProductUnitModel } from '../../../../models/product.model';
import { WarehouseGoodsContainerModel, WarehouseInventoryAdjustNoteDetailModel, WarehouseInventoryAdjustNoteModel } from '../../../../models/warehouse.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef, NbGlobalPhysicalPosition } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { environment } from '../../../../../environments/environment';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { SalesVoucherModel } from '../../../../models/sales.model';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { WarehouseInventoryAdjustNotePrintComponent } from '../inventory-adjust-note-print/inventory-adjust-note-print.component';
import { BusinessModel } from '../../../../models/accounting.model';
import { CustomIcon, FormGroupComponent } from '../../../../lib/custom-element/form/form-group/form-group.component';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { filter, take, takeUntil } from 'rxjs/operators';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { ReferenceChoosingDialogComponent } from '../../../dialog/reference-choosing-dialog/reference-choosing-dialog.component';
import { SystemConfigModel } from '../../../../models/model';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { _ } from 'ag-grid-community';
import { AssignNewContainerFormComponent } from '../../goods/assign-new-containers-form/assign-new-containers-form.component';
import { WarehouseGoodsContainerFormComponent } from '../../goods-container/warehouse-goods-container-form/warehouse-goods-container-form.component';

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

  towDigitsInputMask = this.commonService.createFloatNumberMaskConfig({
    digitsOptional: false,
    digits: 2
  });

  // @ViewChild('newDetailPipSound', { static: true }) newDetailPipSound: ElementRef;
  // @ViewChild('increaseDetailPipSound', { static: true }) increaseDetailPipSound: ElementRef;
  // @ViewChild('errorSound', { static: true }) errorSound: ElementRef;
  // newDetailPipSound: HTMLAudioElement = new Audio('assets/sounds/beep-08b.wav');
  // increaseDetailPipSound: HTMLAudioElement = new Audio('assets/sounds/beep-07a.wav');
  // errorSound: HTMLAudioElement = new Audio('assets/sounds/beep-03.wav');

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
    icon: 'plus-square-outline', title: this.commonService.translateText('Common.addNewProduct'), status: 'success', action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
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

  customIconsForContainerX: CustomIcon[] = [{
    icon: 'plus-square-outline', title: this.commonService.translateText('Gán vị trí'),
    status: 'danger',
    states: {
      '<>': {
        icon: 'plus-square-outline',
        status: 'danger',
        title: this.commonService.translateText('Thêm vị trí mới'),
      },
      '': {
        icon: 'plus-square-outline',
        status: 'success',
        title: this.commonService.translateText('Thêm vị trí mới'),
      },
    },
    action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      const currentProduct = this.commonService.getObjectId(formGroup.get('Product').value);
      const currentUnit = this.commonService.getObjectId(formGroup.get('Unit').value);
      this.commonService.openDialog(AssignNewContainerFormComponent, {
        context: {
          inputMode: 'dialog',
          inputGoodsList: [{ Code: currentProduct, WarehouseUnit: currentUnit }],
          onDialogSave: (newData: ProductModel[]) => {
            this.onSelectUnit(formGroup, formGroup.get('Unit').value, true).then(rs => {
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

  customIconsForProduct: { [key: string]: CustomIcon[] } = {};
  getCustomIconsForProduct(name: string): CustomIcon[] {
    if (this.customIconsForProduct[name]) return this.customIconsForProduct[name];
    return this.customIconsForProduct[name] = [{
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

  customIconsForContainer: { [key: string]: CustomIcon[] } = {};
  getCustomIconsForContainer(name: string): CustomIcon[] {
    if (this.customIconsForContainer[name]) return this.customIconsForContainer[name];
    return this.customIconsForContainer[name] = [{
      icon: 'plus-square-outline',
      title: this.commonService.translateText('Thêm vị trí mới'),
      status: 'success',
      states: {
        '<>': {
          icon: 'edit-outline',
          status: 'primary',
          title: this.commonService.translateText('Chỉnh sửa vị trí'),
        },
        '': {
          icon: 'plus-square-outline',
          status: 'success',
          title: this.commonService.translateText('Thêm vị trí mới'),
        },
      },
      action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
        const containerId = this.commonService.getObjectId(formGroup.get('Container').value);
        const currentProduct = this.commonService.getObjectId(formGroup.get('Product').value);
        const currentUnit = this.commonService.getObjectId(formGroup.get('Unit').value);
        if (containerId) {
          this.commonService.openDialog(WarehouseGoodsContainerFormComponent, {
            context: {
              inputMode: 'dialog',
              // inputGoodsList: [{ Code: currentProduct, WarehouseUnit: currentUnit }],
              inputId: [containerId],
              onDialogSave: (newData: (WarehouseGoodsContainerModel & {[key: string]: any})[]) => {
                let containerList = formGroup['ContainerList'];
                if (Array.isArray(containerList)) {
                  let containerUpdateIndex = containerList.findIndex(f => f.Code = containerId);
                  if (containerUpdateIndex > -1) {
                    containerList[containerUpdateIndex] = { ...newData[0], ContainerShelf: newData[0].Shelf, ContainerShelfName: newData[0].ShelfName, id: newData[0].Code, text: newData[0].Path + newData[0].Name, Path: newData[0].Path + newData[0].Name };
                  }
                  formGroup['ContainerList'] = null;
                  setTimeout(() => {
                    formGroup.get('Container').setValue(containerList[containerUpdateIndex]);
                    formGroup['ContainerList'] = [...containerList];
                    // this.onSelectContainer(formGroup, containerList[containerUpdateIndex], true, option?.parentForm).then(rs => { });
                  }, 100);
                }
              },
              onDialogClose: () => {
              },
            },
            closeOnEsc: false,
            closeOnBackdropClick: false,
          });
        } else {
          this.commonService.openDialog(AssignNewContainerFormComponent, {
            context: {
              inputMode: 'dialog',
              inputGoodsList: [{ Code: currentProduct, WarehouseUnit: currentUnit }],
              onDialogSave: (newData: ProductModel[]) => {
                this.onSelectContainer(formGroup, formGroup.get('Container').value, true).then(rs => {
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
      }
    }];
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

  select2OptionForShelf = {
    placeholder: 'Chọn kệ hàng hóa...',
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
    icon: 'plus-square-outline', title: this.commonService.translateText('Common.addNewContact'), status: 'success', action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
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
    icon: 'plus-square-outline', title: this.commonService.translateText('Common.addNewContact'), status: 'success', action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
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

  private unitMap: { [key: string]: ProductUnitModel } = {};
  private shelfList: WarehouseGoodsContainerModel[] = null;
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

    return super.init().then(async status => {
      if (this.isDuplicate) {
        // Clear id
        this.id = [];
        this.array.controls.forEach((formItem, index) => {
          formItem.get('Code').setValue('');
          formItem.get('Title').setValue('Copy of: ' + formItem.get('Title').value);
          this.getDetails(formItem as FormGroup).controls.forEach(conditonFormGroup => {
            // Clear id
            conditonFormGroup.get('Id').setValue(null);
            conditonFormGroup.get('SystemUuid').setValue(null);
          });
        });
      }

      await this.apiService.getPromise<ProductUnitModel[]>('/admin-product/units', { limit: 'nolimit', includeIdText: true }).then(unitList => {
        for (const unit of unitList) {
          this.unitMap[unit['Sequence']] = unit;
        }
        console.log(this.unitMap);
        // this.commonService.toastService.show('Đã tải danh sách đơn vị tính', 'POS Thương mại', { status: 'success' });
        return true;
      });

      // Test pip sound
      // for (let i = 0; i < 100; i++) {
      //   this.playNewPipSound();
      //   await new Promise(resolve => setTimeout(() => resolve(true), 300));
      // }

      this.shelfList = await this.apiService.getPromise('/warehouse/goods-containers', { eq_Type: 'SHELF', limit: 'nolimit', includeIdText: true });
      return status;
    });
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: WarehouseInventoryAdjustNoteModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeContact'] = true;
    params['includeObject'] = true;
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

        // Get product unit info
        let goodsList = [];
        let page = 1;
        const limit = 50;
        while (true) {
          const ids = itemFormData.Details.slice((page - 1) * limit, page * limit).map(m => `${this.commonService.getObjectId(m.Product)}-${this.commonService.getObjectId(m.Unit)}`);
          if (ids.length == 0) break;
          const pageList = await this.apiService.getPromise<any[]>('/warehouse/goods', {
            select: 'Code',
            includeUnit: true,
            includeContainers: true,
            id: ids,
            limit: 'nolimit'
          }).then(goodsList => {
            return goodsList;
          });
          if (pageList.length == 0) {
            break;
          }
          goodsList = goodsList.concat(pageList);
          page++;
        }

        const goodsListIndex = {};
        for (const goods of goodsList) {
          goodsListIndex[`${goods.Code}-${this.commonService.getObjectId(goods.ConversionUnit)}`] = goods;
        }

        // itemFormData.Details.forEach(detail => {
        //   detail.AccessNumbers = Array.isArray(detail.AccessNumbers) && detail.AccessNumbers.length > 0 ? (detail.AccessNumbers.map(ac => this.commonService.getObjectId(ac)).join('\n') + '\n') : '';
        //   const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, detail);
        //   details.push(newDetailFormGroup);
        //   // const comIndex = details.length - 1;
        //   this.onAddDetailFormGroup(newForm, newDetailFormGroup);
        //   if (detail.Product) {
        //     this.onSelectProduct(newDetailFormGroup, detail.Product, true);
        //     let seelctedUnit = detail.Product?.Units?.find(f => f.id == detail.Unit.id);
        //     const relateGoods = goodsListIndex[`${this.commonService.getObjectId(detail.Product)}-${this.commonService.getObjectId(detail.Unit)}`];
        //     if (relateGoods) {
        //       seelctedUnit.IsManageByAccessNumber = relateGoods.IsManageByAccessNumber;
        //       seelctedUnit['Containers'] = relateGoods.Containers;
        //     }
        //     if (seelctedUnit) {
        //       this.onSelectUnit(newDetailFormGroup, seelctedUnit);
        //     } else {
        //       seelctedUnit = detail.Unit;
        //       this.onSelectUnit(newDetailFormGroup, seelctedUnit);
        //     }
        //   }
        // });


        for (let id = 0; id < itemFormData.Details.length; id++) {
          const detail = itemFormData.Details[id];
          // detail.AccessNumbers = Array.isArray(detail.AccessNumbers) && detail.AccessNumbers.length > 0 ? (detail.AccessNumbers.map(ac => this.commonService.getObjectId(ac)).join('\n') + '\n') : '';
          detail.AccessNumbers = Array.isArray(detail.AccessNumbers) ? detail.AccessNumbers.map(m => this.commonService.getObjectId(m)) : [];

          // const item = itemFormData.Details[id];
          let detailFormGroup: FormGroup;
          if (!details.controls[id]) {
            detailFormGroup = this.makeNewDetailFormGroup(newForm, detail);
            details.push(detailFormGroup);
            this.onAddDetailFormGroup(newForm, detailFormGroup);

            if (detail.Product) {
              this.onSelectProduct(detailFormGroup, detail.Product, true);
              let seelctedUnit = detail.Product?.Units?.find(f => f.id == detail.Unit.id);
              const relateGoods = goodsListIndex[`${this.commonService.getObjectId(detail.Product)}-${this.commonService.getObjectId(detail.Unit)}`];
              if (relateGoods) {
                seelctedUnit.IsManageByAccessNumber = relateGoods.IsManageByAccessNumber;
                seelctedUnit['Containers'] = relateGoods.Containers;
              } else {
                console.log('Can not found relate goods');
              }
              if (seelctedUnit) {
                this.onSelectUnit(detailFormGroup, seelctedUnit);
              } else {
                seelctedUnit = detail.Unit;
                this.onSelectUnit(detailFormGroup, seelctedUnit);
              }
            }

          } else {
            detailFormGroup = details.controls[id] as FormGroup;
            // await this.patchFormGroupValue(detailFormGroup, item);
            detailFormGroup.patchValue(detail);
          }
        }

        // remove dirty form group
        if (itemFormData.Details.length < details.controls.length) {
          this.array.controls.splice(itemFormData.Details.length, details.controls.length - itemFormData.Details.length);
        }

        this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }

    });

  }

  patchFormGroupValue = (formGroup: FormGroup, data: WarehouseInventoryAdjustNoteModel) => {

    if (data) {
      if (data.Details) {
        for (const detail of data.Details) {
          if (Array.isArray(detail.AccessNumbers)) {
            detail.AccessNumbers = detail.AccessNumbers.map(m => this.commonService.getObjectId(m));
          }
          // this.getDetails(formGroup).push(this.makeNewDetailFormGroup(formGroup));
        }
      }
      formGroup.patchValue(data, { onlySelf: true });
    }
    return true;
  }

  makeNewFormGroup(data?: WarehouseInventoryAdjustNoteModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Type: [null],
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
      Shelf: [],
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
      SystemUuid: [''],
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
      Container: ['', Validators.required],
      RelateDetail: [''],
      Business: [this.accountingBusinessList.filter(f => f.id === 'GOODSINVENTORYADJUST')],
      // AccessNumbers: { value: '', disabled: true },
      AccessNumbers: { value: [], disabled: true },
    });

    if (data) {

      if (Array.isArray(data.AccessNumbers)) {
        // data.AccessNumbers = Array.isArray(data.AccessNumbers) && data.AccessNumbers.length > 0 ? (data.AccessNumbers.map(ac => this.commonService.getObjectId(ac)).join('\n') + '\n') : '';
        data.AccessNumbers = Array.isArray(data.AccessNumbers) ? data.AccessNumbers.map(ac => this.commonService.getObjectId(ac)) : [];
      }
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
    // this.updateInitialDetailFormPropertiesCache(newChildFormGroup);
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

  async onSelectUnit(detail: FormGroup, selectedData: any, force?: boolean) {
    const unitId = this.commonService.getObjectId(selectedData);
    const productId = this.commonService.getObjectId(detail.get('Product').value);
    if (selectedData?.IsManageByAccessNumber) {
      detail['IsManageByAccessNumber'] = selectedData.IsManageByAccessNumber;
    } else {
      detail['IsManageByAccessNumber'] = false;
    }
    if (unitId && productId) {
      let containerList;
      if (selectedData.Containers && (typeof selectedData.Containers[0]) == 'object') {
        containerList = selectedData.Containers;
      } else {
        containerList = await this.apiService.getPromise<any[]>('/warehouse/goods', {
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
            } else {
              detail['IsManageByAccessNumber'] = false;
            }
            return goodsList[0].Containers.map(m => ({
              // ...m,
              ContainerShelf: m.ContainerShelf,
              ContainerShelfName: m.ContainerShelfName,
              AccessNumbers: m?.AccessNumbers,
              // AccessNumbers: m?.AccessNumbers?.map(an => ({ id: an, text: an })),
              id: m.Container,
              text: `${m.ContainerPath}: ${m.ContainerDescription}`
            }));
          }
          return [];
        });
      }
      detail['ContainerList'] = containerList;
      if (containerList && containerList.length == 1) {
        detail.get('Container').setValue(containerList[0]);
      } else {
        const selectedContainer = containerList.find(f => f.selected);
        if (selectedContainer) {
          setTimeout(() => {
            detail.get('Container').setValue(selectedContainer);
          }, 0);
        }
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

  async onSelectContainer(detail: FormGroup, selectedData: ProductModel, force?: boolean, parentForm?: FormGroup) {
    // console.log(selectedData);
    const selectedShelf = parentForm && this.commonService.getObjectId(parentForm.get('Shelf').value) || null;
    if (selectedShelf && selectedData?.ContainerShelf && selectedData?.ContainerShelf != selectedShelf) {
      this.commonService.toastService.show('Vị trí hàng hóa không đúng kệ đã chọn', 'Vị trí hàng hóa không đúng kệ đã chọn', { status: 'warning' });
      // this.errorSound.nativeElement.pause();
      // this.errorSound.nativeElement.currentTime = 0;
      this.playErrorPipSound();
      return false;
    }
    if (false) if (selectedData && selectedData['AccessNumbers']) {
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
    return true;
  }
  async onSelectAccessNumbers(detail: FormGroup, event: any, force?: boolean, element?: any) {
    console.log(element, event);
    if (event.key == 'Enter' || force) {
      detail.get('Quantity').setValue(element.value.trim().split('\n').length);
    }
    // console.log(selectedData);
    // let hadChanged = false;
    // if (selectedData && selectedData.length > 0) {
    //   for (const an of selectedData) {
    //     if (!an?.origin && an.id == an.text) {
    //       const { accessNumber, goodsId } = this.commonService.decompileAccessNumber(this.commonService.getObjectId(an));
    //       console.log(accessNumber, goodsId);
    //       an.id = accessNumber;
    //       hadChanged = true;
    //     }
    //   }
    //   if (hadChanged) {
    //     const accessNumbersControl = detail.get('AccessNumbers');
    //     accessNumbersControl.setValue(selectedData);
    //     setTimeout(() => {
    //       $(element['controls'].element[0])['select2']('open');
    //     }, 500);
    //   }
    //   detail.get('Quantity').setValue(selectedData && selectedData.length || 0);
    // }
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
    const data = super.getRawFormData();
    for (const item of data.array) {
      for (const prop in item) {
        if (prop != 'Details') {
          item[prop] = this.commonService.getObjectId(item[prop]);
        }
      }
      for (const detail of item.Details) {
        for (const prop in detail) {
          if (prop != 'AccessNumbers') {
            detail[prop] = this.commonService.getObjectId(detail[prop]);
          }
        }
        if (typeof detail.AccessNumbers == 'string') {
          detail.AccessNumbers = detail?.AccessNumbers.trim().split('\n').filter(ac => !!ac).map(ac => {
            if (/^127/.test(ac)) {
              return { id: ac, text: ac };
            }
            const acd = this.commonService.decompileAccessNumber(ac);
            return { id: acd.accessNumber, text: acd.accessNumber };
          });
        }
      }
    }
    return data;
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

  public barcode = '';
  onKeyboardEvent(event: KeyboardEvent) {
    // if(this.commonService.dialogStack) {

    // }
    if (this.ref && document.activeElement.tagName == 'BODY') {
      this.barcode += event.key;
      this.commonService.takeUntil('warehouse-receipt-note-barcode-scan', 100, () => {
        this.barcode = '';
      });
      console.log(this.barcode);
      if (this.barcode && /Enter$/.test(this.barcode)) {
        try {
          if (this.barcode.length > 5) {
            this.barcodeProcess(this.barcode.replace(/Enter.*$/, ''));
          }
          // this.findOrderKeyInput = '';
        } catch (err) {
          this.commonService.toastService.show(err, 'Cảnh báo', { status: 'warning' });
        }
        this.barcode = '';
      }
      // });
    }
    return true;
  }

  public activeDetailIndex = 0;
  barcodeQueue = [];
  barcodeInPrgress = false;
  barcodeProcess(barcode: string) {
    console.log(barcode);

    if (this.barcodeInPrgress) {
      console.log('barcode in progress => push to queue');
      this.barcodeQueue.push(barcode);
      return;
    }

    this.barcodeInPrgress = true;

    const coreId = this.systemConfigs.ROOT_CONFIGS.coreEmbedId;

    let unitSeq, productId, unit, unitId, accessNumber;

    if (/^9\d+/.test(barcode)) {
      // Đây là barcode vị trí hàng hóa
      let tmpcode = barcode.substring(1);
      const findOrderLength = parseInt(tmpcode.substring(0, 1));
      tmpcode = tmpcode.substring(1);
      const findOrder = tmpcode.substring(0, findOrderLength);
      tmpcode = tmpcode.substring(findOrderLength);
      const unitSeqLength = parseInt(tmpcode.substring(0, 1));
      tmpcode = tmpcode.substring(1);
      unitSeq = tmpcode.substring(0, unitSeqLength);
      unit = this.unitMap[unitSeq];
      unitId = this.commonService.getObjectId(unit);
      tmpcode = tmpcode.substring(unitSeqLength);
      productId = tmpcode;
      productId = '118' + coreId + productId;
    } else {

      const productIdLength = parseInt(barcode.substring(0, 2)) - 10;
      accessNumber = barcode.substring(productIdLength + 2);
      if (accessNumber) {
        accessNumber = '127' + accessNumber;
      }
      productId = barcode.substring(2, 2 + productIdLength);
      let unitIdLength = parseInt(productId.slice(0, 1));
      unitSeq = productId.slice(1, unitIdLength + 1);
      unit = this.unitMap[unitSeq];
      unitId = this.commonService.getObjectId(unit);
      productId = productId.slice(unitIdLength + 1);
      productId = '118' + coreId + productId;
    }

    const details = this.getDetails(this.array.controls[0] as FormGroup);
    let existGoodsIndex = details.controls.findIndex(f => this.commonService.getObjectId(f.get('Product').value) == productId && this.commonService.getObjectId(f.get('Unit').value) == unitId);
    let existsGoods = details.controls[existGoodsIndex] as FormGroup;
    if (!existsGoods) {
      if (!this.commonService.getObjectId(details.controls[0]?.get('Product').value)) {
        details.removeAt(0);
      }

      this.apiService.getPromise<any[]>('/warehouse/goods', {
        includeCategories: true,
        includeFeaturePicture: true,
        includeUnit: true,
        includeContainers: true,
        includeInventory: true,
        sort_Id: 'desc',
        offset: 0,
        limit: 100,
        eq_Code: productId,
        eq_UnitSeq: unitSeq,
      }).then(rs => {
        console.log(rs);
        const goods = rs[0];
        existsGoods = this.makeNewDetailFormGroup(this.array.controls[0] as FormGroup, {
          Product: { Code: goods.Code, id: goods.Code, text: goods.Name },
          Unit: goods.WarehouseUnit,
          Container: goods.Container,
          // AccessNumbers: `${accessNumber}\n`,
          AccessNumbers: accessNumber ? [accessNumber] : [],
          Quantity: 1,
          Description: goods.Name,
          Image: goods.Pictures
        } as any);
        existsGoods['IsManageByAccessNumber'] = true;
        details.push(existsGoods);


        if (goods.Containers && goods.Containers.length > 0) {
          // this.errorSound.nativeElement.pause();
          // this.errorSound.nativeElement.currentTime = 0;

          const selectedShelf = this.commonService.getObjectId(this.array.controls[0].get('Shelf').value);

          let container = null;
          if (selectedShelf) {
            container = goods.Containers.find(f => f.ContainerShelf == selectedShelf);
            if (container) {
              container.selected = true;
              this.playNewPipSound();
            } else {
              this.commonService.toastService.show(`Không có vị trí nào phù hợp cho ${goods.Code} !`, 'Không có vị trí nào phù hợp !', { status: 'warning' });
              this.playErrorPipSound();
            }
          } else {
            if (accessNumber) {
              container = goods.Containers.find(f => f.AccessNumbers.some(s => s == accessNumber));
              if (!container) {
                this.commonService.toastService.show(`Số truy xuất ${accessNumber} không có trong kho !`, 'Số truy xuất không có trong kho !', { status: 'warning' });
                this.playErrorPipSound();
              } else {
                container.selected = true;
                this.playNewPipSound();
              }
            } else {

            }
          }
        } else {
          this.playErrorPipSound();
          this.commonService.toastService.show(`${goods.Name} chưa được cài đặt vị trí !`, 'Hàng hóa chưa được cài đặt vị trí', { status: 'warning' });
        }
        this.onSelectUnit(existsGoods, { ...unit, IsManageByAccessNumber: true, Containers: goods.Containers });
        this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
        this.activeDetailIndex = details.length - 1;
        setTimeout(() => {
          $('.form-detail-item').eq(this.activeDetailIndex)[0]?.scrollIntoView();
        }, 0);
        this.barcodeInPrgress = false;
        if (this.barcodeQueue.length > 0) {
          this.barcodeProcess(this.barcodeQueue.shift());
        }
      }).catch(err => {
        this.barcodeInPrgress = false;
        if (this.barcodeQueue.length > 0) {
          this.barcodeProcess(this.barcodeQueue.shift());
        }
        return Promise.reject(err);
      });

    } else {
      if (accessNumber) {
        // let currentAccessNumbers: string = existsGoods.get('AccessNumbers').value || '';
        let currentAccessNumbers: string[] = existsGoods.get('AccessNumbers').value || [];
        this.activeDetailIndex = existGoodsIndex;
        $('.form-detail-item').eq(this.activeDetailIndex)[0]?.scrollIntoView();
        if (currentAccessNumbers.indexOf(accessNumber) < 0) {
          // currentAccessNumbers = currentAccessNumbers.replace(/\n$/, '') + '\n' + (accessNumber) + '\n';
          currentAccessNumbers.push(accessNumber)
          existsGoods.get('AccessNumbers').setValue(currentAccessNumbers);
          // existsGoods.get('Quantity').setValue(currentAccessNumbers.trim().split('\n').length);
          existsGoods.get('Quantity').setValue(currentAccessNumbers.length);
          this.playIncreasePipSound();
        } else {
          this.commonService.toastService.show(`${accessNumber} đang có trong danh sách rồi !`, 'Số truy xuất đang trong danh sánh !', { status: 'warning' });
          this.playErrorPipSound();
          $('.form-detail-item').eq(this.activeDetailIndex)[0]?.scrollIntoView();
        }
      } else {
        existsGoods.get('Quantity').setValue(parseFloat(existsGoods.get('Quantity').value) + 1);
        this.playIncreasePipSound();
      }
      this.barcodeInPrgress = false;
      if (this.barcodeQueue.length > 0) {
        this.barcodeProcess(this.barcodeQueue.shift());
      }
    }
  }

  addGoodsOfShelf(parentFormGroup: FormGroup) {
    this.commonService.openDialog(DialogFormComponent, {
      context: {
        title: 'Thay đổi giá bán',
        onInit: async (form, dialog) => {
          // const price = form.get('Price');
          // const description = form.get('Description');
          // price.setValue(parseFloat(activeDetail.get('Price').value));
          // description.setValue(parseFloat(activeDetail.get('Description').value));
          return true;
        },
        controls: [
          {
            name: 'Shelf',
            label: 'Kệ hàng hóa',
            placeholder: 'Chọn kệ hàng hóa',
            type: 'select2',
            initValue: null,
            // focus: true,
            option: {
              placeholder: 'Chọn kệ...',
              allowClear: true,
              width: '100%',
              dropdownAutoWidth: true,
              minimumInputLength: 0,
              keyMap: {
                id: 'id',
                text: 'text',
              },
              ajax: {
                transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
                  console.log(settings);
                  this.apiService.getPromise('/warehouse/goods-containers', { filter_Name: settings.data['term'] ? settings.data['term'] : '', includeIdText: true, eq_Type: 'SHELF', limit: 20 }).then(rs => {
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
                    results: data,
                  };
                },
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
            action: () => { return true; },
          },
          {
            label: 'Chọn',
            icon: 'generate',
            status: 'success',
            // keyShortcut: 'Enter',
            action: (form: FormGroup, formDialogConpoent: DialogFormComponent) => {

              console.log(form.value);

              // Get all container of shelf
              this.isProcessing = true;
              this.apiService.getPromise<any[]>('/warehouse/goods-containers', { includeGoods: true, eq_Shelf: this.commonService.getObjectId(form.value?.Shelf), limit: 'nolimit' }).then(rs => {
                console.log(rs);

                if (rs && rs.length > 0) {
                  const details = this.getDetails(this.array.controls[0] as FormGroup);
                  if (!this.commonService.getObjectId(details.controls[0]?.get('Product').value)) {
                    details.removeAt(0);
                  }
                  for (const container of rs) {
                    const goods = container?.Goods[0];
                    let existGoodsIndex = details.controls.findIndex(f => this.commonService.getObjectId(f.get('Product').value) == this.commonService.getObjectId(goods) && this.commonService.getObjectId(f.get('Unit').value) == goods.Unit);
                    let existsGoods = details.controls[existGoodsIndex] as FormGroup;
                    if (!existsGoods) {
                      existsGoods = this.makeNewDetailFormGroup(this.array.controls[0] as FormGroup, {
                        Product: { Code: this.commonService.getObjectId(goods), id: this.commonService.getObjectId(goods), text: this.commonService.getObjectText(goods) },
                        Unit: { id: goods.Unit, text: goods.UnitLabel },
                        Container: { id: container.Code, text: container.Path },
                        AccessNumbers: [],
                        Quantity: 0,
                        Description: container.GoodsName,
                        Image: [goods.GoodsThumbnail]
                      } as any);
                      existsGoods['IsManageByAccessNumber'] = goods.IsManageByAccessNumber;
                      existsGoods['ContainerList'] = [{ id: container.Code, text: container.Path }];
                      details.push(existsGoods);
                      // this.onSelectUnit(existsGoods, { id: goods.Unit, text: goods.UnitLabel, IsManageByAccessNumber: true });
                      this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
                      this.activeDetailIndex = 0;
                    }
                  }
                }
                this.isProcessing = false;
              }).catch(err => {
                this.isProcessing = false;
                Promise.reject(err);
              });

              // formDialogConpoent.dismiss();

              return true;
            },
          },
        ],
      },
    });
  }

  barcodeScan(formItem: FormGroup) {
    this.commonService.openDialog(DialogFormComponent, {
      context: {
        title: 'BarCode Scan',
        onInit: async (form, dialog) => {
          // const price = form.get('Price');
          // const description = form.get('Description');
          // price.setValue(parseFloat(activeDetail.get('Price').value));
          // description.setValue(parseFloat(activeDetail.get('Description').value));
          return true;
        },
        controls: [
          {
            name: 'BarCode',
            label: 'BarCode',
            placeholder: 'Quét barcode vào đây...',
            type: 'text',
            initValue: null,
            focus: true,
          },
        ],
        actions: [
          {
            label: 'Esc - Trở về',
            icon: 'back',
            status: 'basic',
            keyShortcut: 'Escape',
            action: () => { return true; },
          },
          {
            label: 'Enter',
            icon: 'generate',
            status: 'success',
            keyShortcut: 'Enter',
            action: (form: FormGroup, formDialogConpoent: DialogFormComponent) => {

              const barCodeField = form.get('BarCode');
              const barCode = barCodeField.value.replace(/\n/, '');
              barCodeField.setValue('');
              console.log(barCode);

              this.barcodeProcess(barCode);

              return false;
            },
          },
        ],
      },
    });
  }

  createAlternateAdjustVoucher(formItem: FormGroup) {
    if (!formItem.get('Code').value) {
      this.commonService.toastService.show(`Bạn phải lưu phiếu trước khi tạo phiếu phụ !`, 'Phiếu chưa được lưu !', { status: 'warning' });
      this.playErrorPipSound();
      return false;
    }
    if (!formItem.get('Title').value) {
      this.commonService.toastService.show(`Bạn phải điền tiêu đề trước khi tạo phiếu phụ !`, 'Phiếu chưa có tiêu đề !', { status: 'warning' });
      this.playErrorPipSound();
      return false;
    }
    this.commonService.openDialog(DialogFormComponent, {
      context: {
        title: 'Thông tin phiếu kiểm kho phụ cho trường hợp teamwork',
        onInit: async (form, dialog) => {
          // const price = form.get('Price');
          // const description = form.get('Description');
          // price.setValue(parseFloat(activeDetail.get('Price').value));
          // description.setValue(parseFloat(activeDetail.get('Description').value));
          return true;
        },
        controls: [
          {
            name: 'Object',
            label: 'Người tiếp nhận nhiệm vụ',
            placeholder: 'Chọn người tiếp nhận nhiệm vụ...',
            type: 'select2',
            initValue: null,
            // focus: true,
            option: {
              ...this.select2OptionForContact
            }
          },
        ],
        actions: [
          {
            label: 'Esc - Trở về',
            icon: 'back',
            status: 'basic',
            keyShortcut: 'Escape',
            action: () => { return true; },
          },
          {
            label: 'Tạo',
            icon: 'generate',
            status: 'success',
            // keyShortcut: 'Enter',
            action: (form: FormGroup, formDialogConpoent: DialogFormComponent) => {

              console.log(form.value);
              const object = form.get('Object').value;
              const relationVoucher = formItem.get('RelativeVouchers');

              this.apiService.postPromise<WarehouseInventoryAdjustNoteModel[]>(this.apiPath, {}, [
                {
                  Type: 'SUB',
                  Object: this.commonService.getObjectId(object),
                  ObjectName: this.commonService.getObjectText(object),
                  Title: formItem.get('Title').value + ' (phiếu phụ)',
                  Shelf: formItem.get('Shelf').value
                }
              ]).then(rs => {
                const newSubVoucher = rs[0];
                if (newSubVoucher) {
                  relationVoucher.setValue([...(relationVoucher.value || []), { id: newSubVoucher.Code, text: newSubVoucher.Title, type: 'INVENTORYADJUSTSUB' }]);
                }
              });

              // formDialogConpoent.dismiss();

              return true;
            },
          },
        ],
      },
    });
  }

  syncWithSubVoucher(formItem: FormGroup) {
    const relativeVoucher: { id: string, text: string, type: string }[] = formItem.get('RelativeVouchers').value;
    if (relativeVoucher && relativeVoucher.length > 0) {
      try {
        this.commonService.showDialog('Đồng bộ với phiếu phụ', 'Hệ thống sẽ lấy chi tiết của các phiếu phụ và đồng bộ với chi tiết của phiếu chính, bạn có chắc là muốn đồng bộ ?', [
          {
            label: 'Trở về',
            status: 'basic',
            action: () => {

              return true;
            }
          },
          {
            label: 'Đồng bộ',
            status: 'primary',
            action: () => {

              this.apiService.getPromise<WarehouseInventoryAdjustNoteModel[]>(this.apiPath, { id: relativeVoucher.map(m => this.commonService.getObjectId(m)), includeDetails: true, includeAccessNumbers: true }).then(subVouchers => {

                console.log(subVouchers);
                const details = this.getDetails(this.array.controls[0] as FormGroup);

                if (subVouchers && subVouchers.length > 0) {
                  for (const subVoucher of subVouchers) {
                    if (subVoucher.Type != 'SUB') {
                      return Promise.reject('Phiếu liên quan không phải phiếu phụ');
                    }
                    if (this.commonService.getObjectId(subVoucher.Shelf) != this.commonService.getObjectId(formItem.get('Shelf').value)) {
                      return Promise.reject('Phiếu phụ không chung kệ với phiếu chính');
                    }

                    if (subVoucher.Details && subVoucher.Details.length > 0) {
                      for (const detail of subVoucher.Details) {


                        let existGoodsIndex = details.controls.findIndex(f => this.commonService.getObjectId(f.get('Product').value) == this.commonService.getObjectId(detail.Product) && this.commonService.getObjectId(f.get('Unit').value) == this.commonService.getObjectId(detail.Unit));
                        let existsGoods = details.controls[existGoodsIndex] as FormGroup;


                        if (!existsGoods) {
                          existsGoods = this.makeNewDetailFormGroup(formItem, detail);
                          existsGoods['_type'] = 'IMPORT';
                          details.push(existsGoods);
                        } else {
                          if (detail.Quantity > 0) {
                            if (detail.AccessNumbers && detail.AccessNumbers.length > 0) {
                              let currentAccessNumbers: string[] = existsGoods.get('AccessNumbers').value || [];

                              for (const ac of detail.AccessNumbers) {
                                const accessNumber = this.commonService.getObjectId(ac);
                                if (currentAccessNumbers.indexOf(accessNumber) < 0) {
                                  // currentAccessNumbers = currentAccessNumbers.replace(/\n$/, '') + '\n' + (accessNumber) + '\n';
                                  currentAccessNumbers.push(accessNumber);
                                  existsGoods.get('AccessNumbers').setValue(currentAccessNumbers);
                                  // existsGoods.get('Quantity').setValue(currentAccessNumbers.trim().split('\n').length);
                                  existsGoods.get('Quantity').setValue(currentAccessNumbers.length);
                                }
                              }

                            } else {
                              existsGoods.get('Quantity').setValue(parseFloat(existsGoods.get('Quantity').value) + parseFloat(detail.Quantity as any));
                            }
                          }
                        }

                      }
                    }
                  }
                }

                this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');

              });
              return true;
            }
          },
        ])
      } catch (err) {
        this.commonService.toastService.show(err, 'Lỗi trong lúc đồng bộ phiếu phụ !', { status: 'warning' });
      }
    }
  }

  newPipSoundQueue = [];
  increasePipSoundQueue = [];
  errorPipSoundQueue = [];

  newPipSoundPlaying = false;
  increasePipSoundPlaying = false;
  errorPipSoundPlaying = false;

  playNewPipSound() {
    const sound: HTMLAudioElement = new Audio('assets/sounds/beep-08b.wav');
    sound.play();
  }

  playIncreasePipSound() {
    const sound: HTMLAudioElement = new Audio('assets/sounds/beep-07a.wav');
    sound.play();
  }

  playErrorPipSound() {
    const sound: HTMLAudioElement = new Audio('assets/sounds/beep-03.wav');
    sound.play();
  }

  // updateInitialFormPropertiesCache(form: FormGroup) {
  //   super.updateInitialFormPropertiesCache(form);
  //   const details = this.getDetails(form);
  //   for (const detail of details.controls) {
  //     this.updateInitialDetailFormPropertiesCache(detail as FormGroup);
  //   }
  // }

  // updateInitialDetailFormPropertiesCache(detailForm: FormGroup) {
  //   Object.keys(detailForm.controls).forEach(name => {
  //     const control = detailForm.controls[name];
  //     if (control.disabled) {
  //       this.disabledControls.push(detailForm.controls[name]);
  //     }
  //   });
  // }

  /** After main form create event */
  onAfterCreateSubmit(newFormData: WarehouseInventoryAdjustNoteModel[]) {
    // this.formLoad(newFormData);

    for (const i in this.array.controls) {
      // this.patchFormGroupValue(this.array.controls[i] as FormGroup, newFormData[i]);
      const formItem = this.array.controls[i];
      formItem.get('Code').patchValue(newFormData[i].Code);
      const detailsForm = this.getDetails(formItem as FormGroup);
      for (const d in detailsForm.controls) {
        const detailForm = detailsForm.controls[d];
        detailForm.get('SystemUuid').patchValue(newFormData[i]['Details'][d]['SystemUuid']);
        detailForm.get('AccessNumbers').patchValue(this.convertAccessNumberToStringList(newFormData[i]['Details'][d]['AccessNumbers']));
      }
    }

    if (!this.silent) {
      this.toastrService.show('success', 'Dữ liệu đã được lưu lại', {
        status: 'success',
        hasIcon: true,
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        duration: 3000,
      });
    }
    this.id = newFormData.map(item => this.makeId(item));
    if (this.mode === 'page') {
      this.commonService.location.go(this.generateUrlByIds(this.id));
    }
    if (this.queryParam && this.queryParam['list']) {
      this.commonService.componentChangeSubject.next({ componentName: this.queryParam['list'], state: true });
    }

    if (this.mode === 'dialog' && this.onDialogSave) {
      this.onDialogSave(newFormData);
    }
  }

  convertAccessNumberToStringList(accessNumbers: any[]) {
    return accessNumbers && Array.isArray(accessNumbers) ? accessNumbers.map(m => this.commonService.getObjectId(m)) : [];
  }

  /** Affter main form update event: Override to disable formLoad and execute patch value to formItem */
  onAfterUpdateSubmit(newFormData: WarehouseInventoryAdjustNoteModel[]) {
    // this.formLoad(newFormData);
    for (const i in this.array.controls) {
      // this.patchFormGroupValue(this.array.controls[i] as FormGroup, newFormData[i]);
      const formItem = this.array.controls[i];
      const detailsForm = this.getDetails(formItem as FormGroup);
      for (const d in detailsForm.controls) {
        const detailForm = detailsForm.controls[d];
        detailForm.get('SystemUuid').patchValue(newFormData[i]['Details'][d]['SystemUuid']);
        detailForm.get('AccessNumbers').patchValue(this.convertAccessNumberToStringList(newFormData[i]['Details'][d]['AccessNumbers']));
      }
    }
    if (!this.silent) {
      this.toastrService.show('success', 'Dữ liệu đã được cập nhật', {
        status: 'success',
        hasIcon: true,
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        duration: 3000,
      });
    }
    this.id = newFormData?.map(item => this.makeId(item));
    if (this.mode === 'page') {
      this.commonService.location.go(this.generateUrlByIds(this.id));
    }
    if (this.queryParam && this.queryParam['list']) {
      this.commonService.componentChangeSubject.next({ componentName: this.queryParam['list'], state: true });
    }

    if (this.mode === 'dialog' && this.onDialogSave) {
      this.onDialogSave(newFormData);
    }
  }

}

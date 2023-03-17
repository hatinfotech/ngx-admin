import { take, takeUntil, filter } from 'rxjs/operators';
import { UnitModel } from './../../../../models/unit.model';
import { ProductUnitFormComponent } from './../../unit/product-unit-form/product-unit-form.component';
import { ShowcaseDialogComponent } from './../../../dialog/showcase-dialog/showcase-dialog.component';
import { ProductBrandModel, ProductGroupModel, ProductInPropertyModel, ProductPropertyModel, ProductPropertyValueModel, ProductKeywordModel } from './../../../../models/product.model';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { DataManagerFormComponent, MyUploadAdapter } from '../../../../lib/data-manager/data-manager-form.component';
import { ProductModel, ProductUnitModel, ProductPictureModel, ProductUnitConversoinModel, ProductCategoryModel } from '../../../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef, NbGlobalPhysicalPosition } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FileModel } from '../../../../models/file.model';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';
import * as ClassicEditorBuild from '../../../../../vendor/ckeditor/ckeditor5-custom-build/build/ckeditor.js';
import { CustomIcon, FormGroupComponent } from '../../../../lib/custom-element/form/form-group/form-group.component';
import { AdminProductService } from '../../admin-product.service';
import { ImagesViewerComponent } from '../../../../lib/custom-element/my-components/images-viewer/images-viewer.component';

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    // Configure the URL to the upload script in your back-end here!
    const options = editor.config.get('simpleUpload');
    return new MyUploadAdapter(loader, options);
  };
}

@Component({
  selector: 'ngx-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent extends DataManagerFormComponent<ProductModel> implements OnInit {

  componentName: string = 'ProductFormComponent';
  idKey = 'Code';
  apiPath = '/admin-product/products';
  baseFormUrl = '/admin-product/product/form';

  unitList: ProductUnitModel[] = [];
  propertyList: ProductPropertyModel[] = [];
  propertyValueList: ProductPropertyValueModel[] = [];

  towDigitsInputMask = this.cms.createFloatNumberMaskConfig({
    digitsOptional: false,
    digits: 2
  });

  // Category list for select2
  categoryList: (ProductCategoryModel)[] = [];
  // Group list for select2
  groupList: (ProductGroupModel & { id?: string, text?: string })[] = [];
  brandList: (ProductBrandModel & { id?: string, text?: string })[] = [];
  keywordList: (ProductKeywordModel & { id?: string, text?: string })[] = [];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref?: NbDialogRef<ProductFormComponent>,
    public adminProductService?: AdminProductService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);



    // Config editor
    // this.Editor;
  }

  public Editor = ClassicEditorBuild;
  public ckEditorConfig = {
    height: '200px',
    // plugins: [ImageResize],
    extraPlugins: [MyCustomUploadAdapterPlugin],
    simpleUpload: {
      uploadUrl: () => {
        // return this.apiService.getPromise<FileStoreModel[]>('/file/file-stores', { filter_Type: 'REMOTE', sort_Weight: 'asc', requestUploadToken: true, weight: 4194304, limit: 1 }).then(fileStores => {
        return this.cms.getAvailableFileStores().then(fileStores => fileStores[0]).then(fileStore => {
          return this.apiService.buildApiUrl(fileStore.Path + '/v1/file/files', { token: fileStore['UploadToken'] });
        });
      },
    },
  };

  async loadCache() {
    await Promise.all([
      this.adminProductService.unitList$.pipe(filter(f => !!f), take(1)).toPromise().then(list => this.unitList = list),
      this.adminProductService.propertyList$.pipe(filter(f => !!f), take(1)).toPromise().then(list => this.propertyList = list),
      this.adminProductService.propertyValueList$.pipe(filter(f => !!f), take(1)).toPromise().then(list => this.propertyValueList = list),
      this.adminProductService.categoryList$.pipe(filter(f => !!f), take(1)).toPromise().then(list => this.categoryList = list),
      this.adminProductService.groupList$.pipe(filter(f => !!f), take(1)).toPromise().then(list => this.groupList = list),
      this.adminProductService.brandList$.pipe(filter(f => !!f), take(1)).toPromise().then(list => this.brandList = list),
      this.adminProductService.keywordList$.pipe(filter(f => !!f), take(1)).toPromise().then(list => this.keywordList = list),
    ]);
  }

  getRequestId(callback: (id?: string[]) => void) {
    if (this.mode === 'page') {
      super.getRequestId(callback);
    } else {
      callback(this.inputId);
    }
  }

  unitControlIcons: CustomIcon[] = [{
    icon: 'plus-square-outline', title: this.cms.translateText('Common.addNewContact'), status: 'success', action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      this.cms.openDialog(ProductUnitFormComponent, {
        context: {
          inputMode: 'dialog',
          onDialogSave: (newData: UnitModel[]) => {
            console.log(newData);
            const newUnit: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name };
            formGroup.get('WarehouseUnit').patchValue(newUnit);
          },
          onDialogClose: () => {

          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    }
  }];

  select2OptionForCategories: Select2Option = {
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
    // tags: true,
  };
  select2OptionForKeywords: Select2Option = {
    placeholder: 'Chọn từ khóa...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    multiple: true,
    tags: true,
  };
  select2OptionForPropertyValue: Select2Option = {
    placeholder: 'Chọn giá trị...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    multiple: true,
    tags: true,
  };

  select2OptionForUnit = {
    placeholder: 'Chọn đơn vị tính...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };
  select2OptionForBrand = {
    placeholder: 'Chọn thương hiệu...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };
  select2OptionForProperty = {
    placeholder: 'Chọn thuộc tính...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  select2OptionForGroups = {
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
    // tags: true,
  };

  select2OptionForType = {
    placeholder: 'Chọn loại...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    // multiple: true,
    // tags: true,
    data: [
      { id: 'PRODUCT', text: 'Hàng hóa' },
      { id: 'SERVICE', text: 'Dịch vụ' },
    ],
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    this.adminProductService.updateAllCache();
    super.ngOnDestroy();
  }

  async init() {
    // await this.loadCache();
    return super.init().then(rs => {
      if (this.isDuplicate) {
        this.array.controls.forEach((formItem, index) => {
          formItem.get('Sku').setValue('');
        });
      }
      return rs;
    });
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: ProductModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeConditions'] = true;
    // params['includeActions'] = true;
    // params['forNgPickDateTime'] = true;
    params['includeCategories'] = true;
    params['includeGroups'] = true;
    params['includePictures'] = true;
    params['includeUnitConversions'] = true;
    params['includeProperties'] = true;
    params['includeWarehouseUnit'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: ProductModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: ProductModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Conditions form load
      // if (itemFormData.Pictures) {
      //   itemFormData.Pictures.forEach(picture => {
      //     picture['Thumbnail'] += '?token=' + this.apiService.getAccessToken();
      //     const newPictureFormGroup = this.makeNewPictureFormGroup(picture);
      //     this.getPictures(index).push(newPictureFormGroup);
      //     const comIndex = this.getPictures(index).length - 1;
      //     this.onAddPictureFormGroup(index, comIndex, newPictureFormGroup);
      //   });
      // }

      if (itemFormData?.UnitConversions) {
        const details = this.getUnitConversions(newForm);
        details.clear();
        itemFormData.UnitConversions.forEach(unitConversion => {
          // unitConversion['Thumbnail'] += '?token=' + this.apiService.getAccessToken();
          const newUnitConversionFormGroup = this.makeNewUnitConversionFormGroup(unitConversion, newForm);
          details.push(newUnitConversionFormGroup);
          const comIndex = details.length - 1;
          this.onAddUnitConversionFormGroup(newForm, comIndex, newUnitConversionFormGroup);
        });
      }

      if (itemFormData?.Properties) {
        const details = this.getProperties(newForm);
        details.clear();
        itemFormData.Properties.forEach(property => {
          // unitConversion['Thumbnail'] += '?token=' + this.apiService.getAccessToken();
          property.Property.Values = this.propertyList.find(f => this.cms.getObjectId(f) == this.cms.getObjectId(property))?.Values;
          const newPropertyFormGroup = this.makeNewPropertyFormGroup(property, newForm);
          details.push(newPropertyFormGroup);
          const comIndex = details.length - 1;
          this.onAddPropertyFormGroup(newForm, comIndex, newPropertyFormGroup);
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

  makeNewFormGroup(data?: ProductModel): FormGroup {
    let newForm = null;
    newForm = this.formBuilder.group({
      // Code_old: [''],
      Code: [''],
      // Sku: { disabled: true, value: '' },
      Sku: [''],
      Barcode: [''],
      WarehouseUnit: ['n/a', (control: FormControl) => {
        if (newForm && !this.cms.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      Name: ['', Validators.required],
      TaxName: [''],
      FeaturePicture: [''],
      Description: [''],
      Technical: [''],
      Categories: [''],
      Type: ['PRODUCT', (control: FormControl) => {
        if (newForm && !this.cms.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      Groups: [''],
      Pictures: [''],
      VatTax: [''],
      Brand: [null],
      Tags: [[]],
      Keywords: [[]],
      RequireVatTax: [false],
      IsStopBusiness: [false],
      UnitConversions: this.formBuilder.array([]),
      Properties: this.formBuilder.array([]),
    });
    const unitConversions = this.getUnitConversions(newForm);
    const properties = this.getProperties(newForm);
    if (data) {
      // data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    } else {
      const newUnitConversion = this.makeNewUnitConversionFormGroup({}, newForm);
      unitConversions.push(newUnitConversion);
      this.onAddUnitConversionFormGroup(newForm, 0, newUnitConversion);

      // const newProperty = this.makeNewPropertyFormGroup({}, newForm);
      // properties.push(newProperty);
      // this.onAddPropertyFormGroup(newForm, 0, newProperty);
    }

    newForm.get('WarehouseUnit').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (unitConversions.controls.length === 0) {
        const newUnitConversion = this.makeNewUnitConversionFormGroup({}, newForm);
        unitConversions.push(newUnitConversion);
        this.onAddUnitConversionFormGroup(newForm, 0, newUnitConversion);
      }
      // else {
      // unitConversions.controls[0].get('Unit').setValue(value);
      // }
    });
    // const skuControl = newForm.get('Sku');
    // const nameControl = newForm.get('Name');
    // setTimeout(() => {
    //   nameControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: string) => {
    //     if (!this.isProcessing && !data?.Sku) {
    //       let sku = this.cms.convertUnicodeToNormal(value).toLowerCase();
    //       let nameParse = sku.replace(/[^a-z0-9]/, ' ').split(/ +/).map(m => m.substring(0, 1));
    //       sku = nameParse.join('');
    //       skuControl.setValue(sku);
    //     }
    //   });
    // }, 1000);

    const featurePictureFormControl = newForm.get('FeaturePicture');
    newForm.get('Pictures').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (!featurePictureFormControl.value && value && value.length > 0) {
        featurePictureFormControl.setValue(value[0]);
      }
    });
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: ProductModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/admin-product/product/list']);
    } else {
      this.ref.close();
      // this.onDialogClose();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Picture Form */
  makeNewPictureFormGroup(data?: ProductPictureModel): FormGroup {
    const newForm = this.formBuilder.group({
      // Id_old: [''],
      // Id: [''],
      Image: [''],
      Thumbnail: [''],
      DownloadLink: [''],
      ProgressId: [''],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  getPictures(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Pictures') as FormArray;
  }
  addPictureFormGroup(formGroupIndex: number) {
    // this.componentList[formGroupIndex].push([]);
    const newFormGroup = this.makeNewPictureFormGroup();
    this.getPictures(formGroupIndex).push(newFormGroup);
    this.onAddPictureFormGroup(formGroupIndex, this.getPictures(formGroupIndex).length - 1, newFormGroup);
    return false;
  }
  removePictureGroup(formGroupIndex: number, index: number) {
    this.getPictures(formGroupIndex).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemovePictureFormGroup(formGroupIndex, index);
    return false;
  }
  onAddPictureFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
    // this.componentList[mainIndex].push([]);
  }
  onRemovePictureFormGroup(mainIndex: number, index: number) {
    // this.componentList[mainIndex].splice(index, 1);
  }
  // previewPicture(pictureFormGroup: FormGroup) {
  //   let link = pictureFormGroup.get('DownloadLink').value;
  //   if (!link && pictureFormGroup.get('ProgressId').value) {
  //     link = this.filesIndex[pictureFormGroup.get('ProgressId').value].response[0].DownloadLink;
  //   }
  //   window.open(link + '?token=' + this.apiService.getAccessToken(), '_blank');
  //   return false;
  // }
  setAsFeaturePicture(formIndex: number, pictureFormGroup: FormGroup) {
    this.array.controls[formIndex].get('FeaturePicture').setValue(pictureFormGroup.get('Image').value);
    return false;
  }
  /** End Picture Form */

  /** Picture Form */
  makeNewUnitConversionFormGroup(data?: ProductUnitConversoinModel, formItem?: FormGroup): FormGroup {
    const newForm = this.formBuilder.group({
      Unit: [formItem.get('WarehouseUnit').value || ''],
      ConversionRatio: ['1'],
      IsDefaultSales: [false],
      IsDefaultPurchase: [false],
      IsManageByAccessNumber: [false],
      IsAutoAdjustInventory: [true],
      IsExpirationGoods: [false],
    });

    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  getUnitConversions(formItem: FormGroup) {
    return formItem.get('UnitConversions') as FormArray;
  }
  addUnitConversionFormGroup(formItem: FormGroup) {
    // this.componentList[formGroupIndex].push([]);
    const newFormGroup = this.makeNewUnitConversionFormGroup(null, formItem);
    this.getUnitConversions(formItem).push(newFormGroup);
    this.onAddUnitConversionFormGroup(formItem, this.getUnitConversions(formItem).length - 1, newFormGroup);
    return false;
  }
  removeUnitConversionGroup(parentForm: FormGroup, formItem: FormGroup, index: number) {
    this.getUnitConversions(parentForm).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemoveUnitConversionFormGroup(formItem, index);
    return false;
  }
  onAddUnitConversionFormGroup(parentForm: FormGroup, index: number, newFormGroup: FormGroup) {
    // this.componentList[mainIndex].push([]);
  }
  onRemoveUnitConversionFormGroup(formItem: FormGroup, index: number) {
    // this.componentList[mainIndex].splice(index, 1);
  }

  makeNewPropertyFormGroup(data?: ProductInPropertyModel, formItem?: FormGroup): FormGroup {
    const newForm = this.formBuilder.group({
      Property: [null, Validators.required],
      PropertyValues: [[], Validators.required],
    });

    if (data) {
      newForm.patchValue(data);
      setTimeout(() => {
        newForm['dataList'] = this.propertyList.find(f => this.cms.getObjectId(f) == this.cms.getObjectId(data.Property))?.Values || [];
      }, 300);
    }
    newForm.get('Property').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      newForm['dataList'] = this.propertyList.find(f => this.cms.getObjectId(f) == this.cms.getObjectId(value))?.Values || [];
    })
    return newForm;
  }
  getProperties(formItem: FormGroup) {
    return formItem.get('Properties') as FormArray;
  }
  addPropertyFormGroup(formItem: FormGroup) {
    // this.componentList[formGroupIndex].push([]);
    const newFormGroup = this.makeNewPropertyFormGroup(null, formItem);
    this.getProperties(formItem).push(newFormGroup);
    this.onAddPropertyFormGroup(formItem, this.getProperties(formItem).length - 1, newFormGroup);
    return false;
  }
  removePropertyGroup(parentForm: FormGroup, formItem: FormGroup, index: number) {
    this.getProperties(parentForm).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemovePropertyFormGroup(formItem, index);
    return false;
  }
  onAddPropertyFormGroup(parentForm: FormGroup, index: number, newFormGroup: FormGroup) {
    // this.componentList[mainIndex].push([]);
  }
  onRemovePropertyFormGroup(formItem: FormGroup, index: number) {
    // this.componentList[mainIndex].splice(index, 1);
  }
  /** End Picture Form */


  copyFormControlValueToOthers(array: FormArray, i: number, formControlName: string) {
    const currentFormItem = array.controls[i];
    let copyItemData;
    let currentValue = currentFormItem.get(formControlName).value;
    if (formControlName === 'Pictures') {
      copyItemData = currentFormItem.get('FeaturePicture').value;
      array.controls.forEach((formItem, index) => {
        if (index !== i) {
          const picturesFormArray = (formItem.get('Pictures') as FormArray);
          picturesFormArray.controls = [];
          currentValue.forEach(pic => {
            const newPictireForm = this.makeNewPictureFormGroup(pic);
            picturesFormArray.controls.push(newPictireForm);
          });
          formItem.get('FeaturePicture').patchValue(copyItemData);
        }
      });
    }

    if (formControlName === 'UnitConversions') {
      copyItemData = currentFormItem.get('UnitConversions').value;
      array.controls.forEach((formItem, index) => {
        if (index !== i) {
          const itemFormArray = (formItem.get('UnitConversions') as FormArray);
          itemFormArray.controls = [];
          currentValue.forEach(item => {
            const newFormForm = this.makeNewUnitConversionFormGroup(item, formItem as FormGroup);
            itemFormArray.controls.push(newFormForm);
          });
          formItem.get('UnitConversions').patchValue(copyItemData);
        }
      });
    } else {
      super.copyFormControlValueToOthers(array, i, formControlName);
    }

    if (formControlName === 'Properties') {
      copyItemData = currentFormItem.get('Proprties').value;
      array.controls.forEach((formItem, index) => {
        if (index !== i) {
          const itemFormArray = (formItem.get('Properties') as FormArray);
          itemFormArray.controls = [];
          currentValue.forEach(item => {
            const newFormForm = this.makeNewUnitConversionFormGroup(item, formItem as FormGroup);
            itemFormArray.controls.push(newFormForm);
          });
          formItem.get('Properties').patchValue(copyItemData);
        }
      });
    } else {
      super.copyFormControlValueToOthers(array, i, formControlName);
    }
  }

  onThumbnailPcitureClick(file: FileModel, form: FormGroup) {
    console.log(file);
    this.cms.openDialog(ShowcaseDialogComponent, {
      context: {
        title: this.cms.translateText('Common.action'),
        actions: [
          {
            label: this.cms.translateText('Common.close'),
            status: 'danger',
            action: () => {

            },
          },
          {
            label: this.cms.translateText('Common.preview'),
            status: 'success',
            action: () => {
              // window.open(file.OriginImage, '_blank');
              const pictures = form.get('Pictures').value;
              // console.log(pictures);
              if (pictures && pictures.length > 0) {
                this.cms.openDialog(ImagesViewerComponent, {
                  context: {
                    images: pictures.map(m => m.OriginImage),
                    imageIndex: pictures.findIndex(f => f.Id == file.Id)
                  }
                });
              }
            },
          },
          {
            label: this.cms.translateText('Common.setFeaturePicture'),
            status: 'primary',
            action: () => {
              form.get('FeaturePicture').setValue(file);
            },
          },
        ],
      }
    });
  }

  onCkeditorReady(editor: any) {
    console.log(editor);
  }

  async save(): Promise<ProductModel[]> {
    return super.save().then(rs => {
      this.adminProductService.updateGroupList();
      this.adminProductService.updateCategoryList();
      return rs;
    });
  };

  onIsDefaultSalesChange(parentFormItem: FormGroup, formItem: FormGroup, event: any, index: number) {
    console.log(event);
    if (!this.isProcessing) {
      const unitConversions = this.getUnitConversions(parentFormItem);
      const isDefaultSalesControl = formItem.get('IsDefaultSales');
      if (isDefaultSalesControl.value === true) {
        for (const unitConversion of unitConversions.controls) {
          if (unitConversion !== formItem) {
            unitConversion.get('IsDefaultSales').setValue(false);
          }
        }
      }
    }
  }

  onIsDefaultPurchaseChange(parentFormItem: FormGroup, formItem: FormGroup, event: any, index: number) {
    console.log(event);
    if (!this.isProcessing) {
      const unitConversions = this.getUnitConversions(parentFormItem);
      const isDefaultPurchaseControl = formItem.get('IsDefaultPurchase');
      if (isDefaultPurchaseControl.value === true) {
        for (const unitConversion of unitConversions.controls) {
          if (unitConversion !== formItem) {
            unitConversion.get('IsDefaultPurchase').setValue(false);
          }
        }
      }
    }
  }

  onWarehouseChange(formGroup: FormGroup, seltectData: UnitModel, index: number) {
    if (!this.isProcessing) {
      const unitConversion = this.getUnitConversions(formGroup);
      unitConversion.controls[0].get('Unit').setValue(seltectData?.id);
    }
  }


  /** After main form create event */
  onAfterCreateSubmit(newFormData: ProductModel[]) {
    // this.formLoad(newFormData);

    for (const i in this.array.controls) {
      const formItem = this.array.controls[i];
      formItem.get('Code').patchValue(newFormData[i].Code);
      formItem.get('Sku').patchValue(newFormData[i].Sku);
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
      this.cms.location.go(this.generateUrlByIds(this.id));
    }
    if (this.queryParam && this.queryParam['list']) {
      this.cms.componentChangeSubject.next({ componentName: this.queryParam['list'], state: true });
    }

    if (this.mode === 'dialog' && this.onDialogSave) {
      this.onDialogSave(newFormData);
    }
  }
  

  /** Affter main form update event: Override to disable formLoad and execute patch value to formItem */
  onAfterUpdateSubmit(newFormData: ProductModel[]) {
    for (const i in this.array.controls) {
      const formItem = this.array.controls[i];
      formItem.get('Code').patchValue(newFormData[i].Code);
      formItem.get('Sku').patchValue(newFormData[i].Sku);
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
      this.cms.location.go(this.generateUrlByIds(this.id));
    }
    if (this.queryParam && this.queryParam['list']) {
      this.cms.componentChangeSubject.next({ componentName: this.queryParam['list'], state: true });
    }

    if (this.mode === 'dialog' && this.onDialogSave) {
      this.onDialogSave(newFormData);
    }
  }
}

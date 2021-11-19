import { take, takeUntil, filter } from 'rxjs/operators';
import { UnitModel } from './../../../../models/unit.model';
import { ProductUnitFormComponent } from './../../unit/product-unit-form/product-unit-form.component';
// import { SimpleUploadAdapter } from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
import { ShowcaseDialogComponent } from './../../../dialog/showcase-dialog/showcase-dialog.component';
import { ProductGroupModel } from './../../../../models/product.model';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ProductModel, ProductUnitModel, ProductPictureModel, ProductUnitConversoinModel, ProductCategoryModel } from '../../../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
// import '../../../../lib/ckeditor.loader';
// import 'ckeditor';
// import * as ckeditor from "ckeditor"
import { FileModel, FileStoreModel } from '../../../../models/file.model';
import { humanizeBytes, UploadInput, UploaderOptions, UploadFile, UploadOutput } from '../../../../../vendor/ngx-uploader/src/public_api';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';
// import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic/build/ckeditor.js';
// import * as ClassicEditorBuild from '../../../../../vendor/ckeditor5-build-classic/build/ckeditor.js'; 
import * as ClassicEditorBuild from '../../../../../vendor/ckeditor/ckeditor5-custom-build/build/ckeditor.js';
import { CustomIcon } from '../../../../lib/custom-element/form/form-group/form-group.component';
import { AdminProductService } from '../../admin-product.service';

class MyUploadAdapter {
  xhr: XMLHttpRequest;
  loader: any;
  options: any;
  editor: any;
  constructor(loader: any, options: any) {
    // The file loader instance to use during the upload.
    this.loader = loader;
    this.options = options;
  }


  // Starts the upload process.
  upload() {
    return this.loader.file
      .then(file => new Promise(async (resolve, reject) => {
        await this._initRequest();
        this._initListeners(resolve, reject, file);
        this._sendRequest(file);
      }));
  }

  // Aborts the upload process.
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  // Initializes the XMLHttpRequest object using the URL passed to the constructor.
  async _initRequest() {
    const xhr = this.xhr = new XMLHttpRequest();

    // Note that your request may look different. It is up to you and your editor
    // integration to choose the right communication channel. This example uses
    // a POST request with JSON as a data structure but your configuration
    // could be different.
    xhr.open('POST', await this.options.uploadUrl(), true);
    xhr.responseType = 'json';
  }

  // Initializes XMLHttpRequest listeners.
  _initListeners(resolve, reject, file) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr.addEventListener('error', () => reject(genericErrorText));
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener('load', () => {
      const response = xhr.response;

      // This example assumes the XHR server's "response" object will come with
      // an "error" which has its own "message" that can be passed to reject()
      // in the upload promise.
      //
      // Your integration may handle upload errors in a different way so make sure
      // it is done properly. The reject() function must be called when the upload fails.
      if (!response || response.error) {
        return reject(response && response.error ? response.error.message : genericErrorText);
      }

      // If the upload is successful, resolve the upload promise with an object containing
      // at least the "default" URL, pointing to the image on the server.
      // This URL will be used to display the image in the content. Learn more in the
      // UploadAdapter#upload documentation.
      resolve({
        default: response[0].OriginImage
      });
    });

    // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
    // properties which are used e.g. to display the upload progress bar in the editor
    // user interface.
    if (xhr.upload) {
      xhr.upload.addEventListener('progress', evt => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  // Prepares the data and sends the request.
  _sendRequest(file) {
    // Prepare the form data.
    const data = new FormData();

    data.append('file', file);

    // Important note: This is the right place to implement security mechanisms
    // like authentication and CSRF protection. For instance, you can use
    // XMLHttpRequest.setRequestHeader() to set the request headers containing
    // the CSRF token generated earlier by your application.

    // Send the request.
    this.xhr.send(data);
  }
}

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

  // Category list for select2
  categoryList: (ProductCategoryModel)[] = [];
  // Group list for select2
  groupList: (ProductGroupModel & { id?: string, text?: string })[] = [];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref?: NbDialogRef<ProductFormComponent>,
    public adminProductService?: AdminProductService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);



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
        return this.commonService.getAvailableFileStores().then(fileStores => fileStores[0]).then(fileStore => {
          return this.apiService.buildApiUrl(fileStore.Path + '/v1/file/files', { token: fileStore['UploadToken'] });
        });
      },
    },
    // toolbar: {
    //   items: [
    //     'heading',
    //     '|',
    //     'bold',
    //     'italic',
    //     'link',
    //     'bulletedList',
    //     'numberedList',
    //     '|',
    //     'outdent',
    //     'indent',
    //     '|',
    //     'imageUpload',
    //     'blockQuote',
    //     'insertTable',
    //     'mediaEmbed',
    //     'undo',
    //     'redo',
    //     'imageInsert',
    //     'alignment',
    //     'removeFormat'
    //   ]
    // },
    // language: 'en',
    // image: {
    //   toolbar: [
    //     'imageTextAlternative',
    //     'imageStyle:inline',
    //     'imageStyle:block',
    //     'imageStyle:side',
    //     'linkImage'
    //   ]
    // },
    // table: {
    //   contentToolbar: [
    //     'tableColumn',
    //     'tableRow',
    //     'mergeTableCells',
    //     'tableCellProperties',
    //     'tableProperties'
    //   ]
    // }
  };

  async loadCache() {
    await Promise.all([
      this.adminProductService.unitList$.pipe(filter(f => !!f), take(1)).toPromise().then(list => this.unitList = list),
      this.adminProductService.categoryList$.pipe(filter(f => !!f), take(1)).toPromise().then(list => this.categoryList = list),
      this.adminProductService.groupList$.pipe(filter(f => !!f), take(1)).toPromise().then(list => this.groupList = list),
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
    icon: 'plus-square-outline', title: this.commonService.translateText('Common.addNewContact'), status: 'success', action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      this.commonService.openDialog(ProductUnitFormComponent, {
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
    tags: true,
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    // await this.loadCache();
    return super.init();
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
    const newForm = this.formBuilder.group({
      Code_old: [''],
      Code: [''],
      Sku: [''],
      WarehouseUnit: ['n/a'],
      Name: ['', Validators.required],
      FeaturePicture: [''],
      Description: [''],
      Technical: [''],
      Categories: [''],
      Groups: [''],
      Pictures: [''],
      UnitConversions: this.formBuilder.array([]),
    });
    const unitConversions = this.getUnitConversions(newForm);
    if (data) {
      // data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    } else {
      const newUnitConversion = this.makeNewUnitConversionFormGroup({}, newForm);
      unitConversions.push(newUnitConversion);
      this.onAddUnitConversionFormGroup(newForm, 0, newUnitConversion);
    }
    
    newForm.get('WarehouseUnit').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if(unitConversions.controls.length === 0) {
        const newUnitConversion = this.makeNewUnitConversionFormGroup({}, newForm);
        unitConversions.push(newUnitConversion);
        this.onAddUnitConversionFormGroup(newForm, 0, newUnitConversion);        
      } else {
        unitConversions.controls[0].get('Unit').setValue(value);
      }
    });

    const featurePictureFormControl = newForm.get('FeaturePicture');
    newForm.get('Pictures').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if(!featurePictureFormControl.value && value && value.length > 0) {
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
      Id: [''],
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
      // Id_old: [''],
      Id: [''],
      Unit: [formItem.get('WarehouseUnit').value || ''],
      ConversionRatio: ['1'],
      IsDefaultSales: [true],
      IsDefaultPurchase: [false],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
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
  /** End Picture Form */


  copyFormControlValueToOthers(array: FormArray, i: number, formControlName: string) {
    if (formControlName === 'Pictures') {
      const currentFormItem = array.controls[i];
      const currentValue = currentFormItem.get(formControlName).value;
      const featurePicture = currentFormItem.get('FeaturePicture').value;
      array.controls.forEach((formItem, index) => {
        if (index !== i) {
          const picturesFormArray = (formItem.get('Pictures') as FormArray);
          picturesFormArray.controls = [];
          currentValue.forEach(pic => {
            const newPictireForm = this.makeNewPictureFormGroup(pic);
            picturesFormArray.controls.push(newPictireForm);
          });
          formItem.get('FeaturePicture').patchValue(featurePicture);
        }
      });
    } else {
      super.copyFormControlValueToOthers(array, i, formControlName);
    }
  }

  onThumbnailPcitureClick(file: FileModel, form: FormGroup) {
    console.log(file);
    this.commonService.openDialog(ShowcaseDialogComponent, {
      context: {
        title: this.commonService.translateText('Common.action'),
        actions: [
          {
            label: this.commonService.translateText('Common.close'),
            status: 'danger',
            action: () => {

            },
          },
          {
            label: this.commonService.translateText('Common.preview'),
            status: 'success',
            action: () => {
              window.open(file.OriginImage, '_blank');
            },
          },
          {
            label: this.commonService.translateText('Common.setFeaturePicture'),
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
}

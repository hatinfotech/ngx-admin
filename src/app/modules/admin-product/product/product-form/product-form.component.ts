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
import { FileModel } from '../../../../models/file.model';
import { humanizeBytes, UploadInput, UploaderOptions, UploadFile, UploadOutput } from '../../../../../vendor/ngx-uploader/src/public_api';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';


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
  categoryList: (ProductCategoryModel & { id?: string, text?: string })[] = [];
  // Group list for select2
  groupList: (ProductGroupModel & { id?: string, text?: string })[] = [];

  public Editor = ClassicEditorBuild;

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref?: NbDialogRef<ProductFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);

    /** ngx-uploader */
    this.options = { concurrency: 1, maxUploads: 0, maxFileSize: 1024 * 1024 * 1024 };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
    /** End ngx-uploader */


    // Config editor
    // this.Editor;
  }

  async loadCache() {
    // iniit category
    this.categoryList = (await this.apiService.getPromise<ProductCategoryModel[]>('/admin-product/categories', {limit: 'nolimit'})).map(cate => ({ id: cate.Code, text: cate.Name })) as any;
    this.groupList = (await this.apiService.getPromise<ProductGroupModel[]>('/admin-product/groups', {limit: 'nolimit'})).map(cate => ({ id: cate.Code, text: cate.Name })) as any;
  }

  getRequestId(callback: (id?: string[]) => void) {
    if (this.mode === 'page') {
      super.getRequestId(callback);
    } else {
      callback(this.inputId);
    }
  }

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
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    await this.loadCache();
    this.unitList = await this.apiService.getPromise<ProductUnitModel[]>('/admin-product/units', { select: 'id=>Code,text=>Name', limit: 'nolimit' });
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
      WarehouseUnit: ['CAI'],
      Name: ['', Validators.required],
      FeaturePicture: [''],
      Description: [''],
      Technical: [''],
      Categories: [''],
      Groups: [''],
      Pictures: [''],
      UnitConversions: this.formBuilder.array([]),
    });
    if (data) {
      data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    }
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
  previewPicture(pictureFormGroup: FormGroup) {
    let link = pictureFormGroup.get('DownloadLink').value;
    if (!link && pictureFormGroup.get('ProgressId').value) {
      link = this.filesIndex[pictureFormGroup.get('ProgressId').value].response[0].DownloadLink;
    }
    window.open(link + '?token=' + this.apiService.getAccessToken(), '_blank');
    return false;
  }
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
      Unit: [ formItem.get('WarehouseUnit').value || ''],
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

  /** ngx-uploader */
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: { [key: string]: boolean } = {};
  filesIndex: { [key: string]: UploadFile } = {};
  pictureFormIndex: { [key: string]: FormGroup } = {};

  onUploadOutput(output: UploadOutput, formItem: FormGroup, formItemIndex: number): void {
    // console.log(output);
    // console.log(this.files);
    switch (output.type) {
      case 'allAddedToQueue':
        // uncomment this if you want to auto upload files when added
        const event: UploadInput = {
          type: 'uploadAll',
          url: this.apiService.buildApiUrl('/file/files'),
          method: 'POST',
          data: { foo: 'bar' },
        };
        this.uploadInput.emit(event);
        break;
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          this.files.push(output.file);
          this.filesIndex[output.file.id] = output.file;

          // const fileResponse: FileModel = output.file.response[0];
          const newPictureFormGroup = this.makeNewPictureFormGroup();
          this.pictureFormIndex[output.file.id] = newPictureFormGroup;
          newPictureFormGroup['file'] = output.file;
          newPictureFormGroup.get('ProgressId').setValue(output.file.id);
          this.getPictures(formItemIndex).push(newPictureFormGroup);
        }
        break;
      case 'uploading':
        if (typeof output.file !== 'undefined') {
          // update current data in files array for uploading file
          const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
          this.files[index] = output.file;
          console.log(`[${output.file.progress.data.percentage}%] Upload file ${output.file.name}`);
        }
        break;
      case 'removed':
        // remove file from array when removed
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
        break;
      case 'dragOver':
        this.dragOver[formItemIndex] = true;
        break;
      case 'dragOut':
      case 'drop':
        this.dragOver[formItemIndex] = false;
        break;
      case 'done':
        // The file is downloaded
        console.log('Upload complete');
        const fileResponse: FileModel = output.file.response[0];
        // const newPictureFormGroup = this.makeNewPictureFormGroup({ Image: fileResponse.Store + '/' + fileResponse.Id + '.' + fileResponse.Extension });
        // newPictureFormGroup.get('Thumbnail').setValue(fileResponse.Thumbnail);
        // newPictureFormGroup['file'] = output.file;
        // this.getPictures(0).push(newPictureFormGroup);
        // const beforeCount = this.getPictures(formItemIndex).controls.length;
        const pictureFormGroup = this.pictureFormIndex[output.file.id];
        pictureFormGroup.get('Image').setValue(fileResponse.Store + '/' + fileResponse.Id + '.' + fileResponse.Extension);
        pictureFormGroup.get('Thumbnail').setValue(fileResponse.Thumbnail + '?token=' + this.apiService.getAccessToken());
        this.files.splice(this.files.findIndex(f => f.id === output.file.id), 1);

        if (!formItem.get('FeaturePicture').value) {
          this.setAsFeaturePicture(formItemIndex, pictureFormGroup);
        }

        break;
    }
  }

  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.apiService.buildApiUrl('/file/files'),
      method: 'POST',
      data: { foo: 'bar' },
    };

    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }
  /** End ngx-uploader */

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
}

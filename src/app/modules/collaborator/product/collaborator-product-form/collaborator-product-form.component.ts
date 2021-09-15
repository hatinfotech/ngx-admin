import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { take, filter } from 'rxjs/operators';
import { UploadInput, humanizeBytes, UploaderOptions, UploadFile, UploadOutput } from '../../../../../vendor/ngx-uploader/src/public_api';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { FileModel } from '../../../../models/file.model';
import { ProductModel, ProductUnitModel, ProductCategoryModel, ProductGroupModel, ProductPictureModel, ProductUnitConversoinModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { CollaboratorService } from '../../collaborator.service';

@Component({
  selector: 'ngx-collaborator-product-form',
  templateUrl: './collaborator-product-form.component.html',
  styleUrls: ['./collaborator-product-form.component.scss']
})
export class CollaboratorProductFormComponent extends DataManagerFormComponent<ProductModel> implements OnInit {

  componentName: string = 'CollaboratorProductFormComponent';
  idKey = ['Page', 'Product', 'Unit'];
  apiPath = '/collaborator/page-products';
  baseFormUrl = '/collaborator/product/form';

  unitList: ProductUnitModel[] = [];

  // Category list for select2
  categoryList: (ProductCategoryModel & { id?: string, text?: string })[] = [];
  // Group list for select2
  groupList: (ProductGroupModel & { id?: string, text?: string })[] = [];

  // public Editor = ClassicEditorBuild;
  percentFormat: CurrencyMaskConfig = this.commonService.getNumberMaskConfig();

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref?: NbDialogRef<CollaboratorProductFormComponent>,
    public collaboratorService?: CollaboratorService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);

    /** ngx-uploader */
    // this.options = { concurrency: 1, maxUploads: 0, maxFileSize: 1024 * 1024 * 1024 };
    // this.files = []; // local uploading files array
    // this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    // this.humanizeBytes = humanizeBytes;
    /** End ngx-uploader */


    // Config editor
    // this.Editor;
  }

  async loadCache() {
    // iniit category
    this.categoryList = (await this.apiService.getPromise<ProductCategoryModel[]>('/admin-product/categories', { limit: 'nolimit' })).map(cate => ({ id: cate.Code, text: cate.Name })) as any;
    this.groupList = (await this.apiService.getPromise<ProductGroupModel[]>('/admin-product/groups', { limit: 'nolimit' })).map(cate => ({ id: cate.Code, text: cate.Name })) as any;
  }

  getRequestId(callback: (id?: string[]) => void) {
    if (this.mode === 'page') {
      super.getRequestId(callback);
    } else {
      callback(this.inputId);
    }
  }

  levelList = [
    { id: 'CTVLEVEL1', text: 'CTV Level 1', },
    { id: 'CTVLEVEL2', text: 'CTV Level 2' },
    { id: 'CTVLEVEL3', text: 'CTV Level 3' },
  ];
  select2OptionForLevel = {
    placeholder: 'Chọn level...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };
  badgeList = [
    { id: 'DONG1', text: 'Đồng 1' },
    { id: 'BAC2', text: 'Bạc 2' },
    { id: 'VANG3', text: 'Vàng 3' },
  ];
  select2OptionForbadge = {
    placeholder: 'Chọn danh hiệu...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };
  cycleList = [
    { id: 'WEEKLY', text: 'Tuần' },
    { id: 'MONTHLY', text: 'Tháng' },
    { id: 'YEARLY', text: 'Năm' },
  ];
  select2OptionForCycle = {
    placeholder: 'Chọn chu kỳ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };
  onLevelChange(level: any, formGroup: FormGroup) {
    if (level && level.text) {
      formGroup.get('Description').setValue(level.text);
    }
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    await this.loadCache();
    // this.unitList = await this.apiService.getPromise<ProductUnitModel[]>('/admin-product/units', { select: 'id=>Code,text=>Name', limit: 'nolimit' });
    return super.init().then(rs => {
      // Add page choosed
      // this.collaboratorService.pageList$.pipe(take(1), filter(f => f && f.length > 0)).toPromise().then(pageList => {
      //   this.actionButtonList.unshift({
      //     type: 'select2',
      //     name: 'pbxdomain',
      //     status: 'success',
      //     label: 'Select page',
      //     icon: 'plus',
      //     title: this.commonService.textTransform(this.commonService.translate.instant('Common.createNew'), 'head-title'),
      //     size: 'medium',
      //     select2: {
      //       data: pageList, option: {
      //         placeholder: 'Chọn trang...',
      //         allowClear: false,
      //         width: '100%',
      //         dropdownAutoWidth: true,
      //         minimumInputLength: 0,
      //         keyMap: {
      //           id: 'id',
      //           text: 'text',
      //         },
      //       }
      //     },
      //     value: () => this.collaboratorService.currentpage$.value,
      //     change: (value: any, option: any) => {
      //       // this.onChangePage(value);
      //       this.collaboratorService.currentpage$.next(this.commonService.getObjectId(value));
      //     },
      //     disabled: () => {
      //       return true;
      //     },
      //     click: () => {
      //       // this.gotoForm();
      //       return false;
      //     },
      //   });
      // });
      return rs;
    });
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: ProductModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeConditions'] = true;
    // params['includeActions'] = true;
    // params['forNgPickDateTime'] = true;
    params['includeProduct'] = true;
    params['includeLevels'] = true;
    // params['page'] = this.collaboratorService?.currentpage$?.value;
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

      if (itemFormData?.Levels) {
        const details = this.getLevels(newForm);
        details.clear();
        itemFormData.Levels.forEach(unitConversion => {
          // unitConversion['Thumbnail'] += '?token=' + this.apiService.getAccessToken();
          const newLevelFormGroup = this.makeNewLevelFormGroup(unitConversion, newForm);
          details.push(newLevelFormGroup);
          const comIndex = details.length - 1;
          this.onAddLevelFormGroup(newForm, comIndex, newLevelFormGroup);
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
      Page: { value: '', disabled: true },
      Product: { value: '', disabled: true },
      IsUsed: [false],
      Sku: { value: '', disabled: true },
      Name: { value: '', disabled: true },
      Unit: { value: '', disabled: true },
      Cycle: ['MONTHLY'],
      DateOfStart: [new Date()],
      IsAutoExtended: [true],
      Levels: this.formBuilder.array([]),
    });
    if (data) {
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
  // makeNewPictureFormGroup(data?: ProductPictureModel): FormGroup {
  //   const newForm = this.formBuilder.group({
  //     // Id_old: [''],
  //     Id: [''],
  //     Image: [''],
  //     Thumbnail: [''],
  //     DownloadLink: [''],
  //     ProgressId: [''],
  //   });

  //   if (data) {
  //     // data['Id_old'] = data['Id'];
  //     newForm.patchValue(data);
  //   }
  //   return newForm;
  // }
  // getPictures(formGroupIndex: number) {
  //   return this.array.controls[formGroupIndex].get('Pictures') as FormArray;
  // }
  // addPictureFormGroup(formGroupIndex: number) {
  //   // this.componentList[formGroupIndex].push([]);
  //   const newFormGroup = this.makeNewPictureFormGroup();
  //   this.getPictures(formGroupIndex).push(newFormGroup);
  //   this.onAddPictureFormGroup(formGroupIndex, this.getPictures(formGroupIndex).length - 1, newFormGroup);
  //   return false;
  // }
  // removePictureGroup(formGroupIndex: number, index: number) {
  //   this.getPictures(formGroupIndex).removeAt(index);
  //   // this.componentList[formGroupIndex].splice(index, 1);
  //   this.onRemovePictureFormGroup(formGroupIndex, index);
  //   return false;
  // }
  // onAddPictureFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
  //   // this.componentList[mainIndex].push([]);
  // }
  // onRemovePictureFormGroup(mainIndex: number, index: number) {
  //   // this.componentList[mainIndex].splice(index, 1);
  // }
  // previewPicture(pictureFormGroup: FormGroup) {
  //   let link = pictureFormGroup.get('DownloadLink').value;
  //   if (!link && pictureFormGroup.get('ProgressId').value) {
  //     link = this.filesIndex[pictureFormGroup.get('ProgressId').value].response[0].DownloadLink;
  //   }
  //   window.open(link + '?token=' + this.apiService.getAccessToken(), '_blank');
  //   return false;
  // }
  // setAsFeaturePicture(formIndex: number, pictureFormGroup: FormGroup) {
  //   this.array.controls[formIndex].get('FeaturePicture').setValue(pictureFormGroup.get('Image').value);
  //   return false;
  // }
  /** End Picture Form */

  /** Picture Form */
  makeNewLevelFormGroup(data?: ProductUnitConversoinModel, formItem?: FormGroup): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [],
      Level: [],
      Description: [],
      Badge: [],
      CommissionRatio: [],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  getLevels(formItem: FormGroup) {
    return formItem.get('Levels') as FormArray;
  }
  addLevelFormGroup(formItem: FormGroup) {
    // this.componentList[formGroupIndex].push([]);
    const newFormGroup = this.makeNewLevelFormGroup(null, formItem);
    this.getLevels(formItem).push(newFormGroup);
    this.onAddLevelFormGroup(formItem, this.getLevels(formItem).length - 1, newFormGroup);
    return false;
  }
  removeLevelGroup(parentForm: FormGroup, formItem: FormGroup, index: number) {
    this.getLevels(parentForm).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemoveLevelFormGroup(formItem, index);
    return false;
  }
  onAddLevelFormGroup(parentForm: FormGroup, index: number, newFormGroup: FormGroup) {
    // this.componentList[mainIndex].push([]);
  }
  onRemoveLevelFormGroup(formItem: FormGroup, index: number) {
    // this.componentList[mainIndex].splice(index, 1);
  }
  /** End Picture Form */

  /** ngx-uploader */
  // options: UploaderOptions;
  // formData: FormData;
  // files: UploadFile[];
  // uploadInput: EventEmitter<UploadInput>;
  // humanizeBytes: Function;
  // dragOver: { [key: string]: boolean } = {};
  // filesIndex: { [key: string]: UploadFile } = {};
  // pictureFormIndex: { [key: string]: FormGroup } = {};

  // onUploadOutput(output: UploadOutput, formItem: FormGroup, formItemIndex: number): void {
  //   // console.log(output);
  //   // console.log(this.files);
  //   switch (output.type) {
  //     case 'allAddedToQueue':
  //       // uncomment this if you want to auto upload files when added
  //       const event: UploadInput = {
  //         type: 'uploadAll',
  //         url: this.apiService.buildApiUrl('/file/files'),
  //         method: 'POST',
  //         data: { foo: 'bar' },
  //       };
  //       this.uploadInput.emit(event);
  //       break;
  //     case 'addedToQueue':
  //       if (typeof output.file !== 'undefined') {
  //         this.files.push(output.file);
  //         this.filesIndex[output.file.id] = output.file;

  //         // const fileResponse: FileModel = output.file.response[0];
  //         const newPictureFormGroup = this.makeNewPictureFormGroup();
  //         this.pictureFormIndex[output.file.id] = newPictureFormGroup;
  //         newPictureFormGroup['file'] = output.file;
  //         newPictureFormGroup.get('ProgressId').setValue(output.file.id);
  //         this.getPictures(formItemIndex).push(newPictureFormGroup);
  //       }
  //       break;
  //     case 'uploading':
  //       if (typeof output.file !== 'undefined') {
  //         // update current data in files array for uploading file
  //         const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
  //         this.files[index] = output.file;
  //         console.log(`[${output.file.progress.data.percentage}%] Upload file ${output.file.name}`);
  //       }
  //       break;
  //     case 'removed':
  //       // remove file from array when removed
  //       this.files = this.files.filter((file: UploadFile) => file !== output.file);
  //       break;
  //     case 'dragOver':
  //       this.dragOver[formItemIndex] = true;
  //       break;
  //     case 'dragOut':
  //     case 'drop':
  //       this.dragOver[formItemIndex] = false;
  //       break;
  //     case 'done':
  //       // The file is downloaded
  //       console.log('Upload complete');
  //       const fileResponse: FileModel = output.file.response[0];
  //       // const newPictureFormGroup = this.makeNewPictureFormGroup({ Image: fileResponse.Store + '/' + fileResponse.Id + '.' + fileResponse.Extension });
  //       // newPictureFormGroup.get('Thumbnail').setValue(fileResponse.Thumbnail);
  //       // newPictureFormGroup['file'] = output.file;
  //       // this.getPictures(0).push(newPictureFormGroup);
  //       // const beforeCount = this.getPictures(formItemIndex).controls.length;
  //       const pictureFormGroup = this.pictureFormIndex[output.file.id];
  //       pictureFormGroup.get('Image').setValue(fileResponse.Store + '/' + fileResponse.Id + '.' + fileResponse.Extension);
  //       pictureFormGroup.get('Thumbnail').setValue(fileResponse.Thumbnail + '?token=' + this.apiService.getAccessToken());
  //       this.files.splice(this.files.findIndex(f => f.id === output.file.id), 1);

  //       if (!formItem.get('FeaturePicture').value) {
  //         this.setAsFeaturePicture(formItemIndex, pictureFormGroup);
  //       }

  //       break;
  //   }
  // }

  // startUpload(): void {
  //   const event: UploadInput = {
  //     type: 'uploadAll',
  //     url: this.apiService.buildApiUrl('/file/files'),
  //     method: 'POST',
  //     data: { foo: 'bar' },
  //   };

  //   this.uploadInput.emit(event);
  // }

  // cancelUpload(id: string): void {
  //   this.uploadInput.emit({ type: 'cancel', id: id });
  // }

  // removeFile(id: string): void {
  //   this.uploadInput.emit({ type: 'remove', id: id });
  // }

  // removeAllFiles(): void {
  //   this.uploadInput.emit({ type: 'removeAll' });
  // }
  /** End ngx-uploader */

  // copyFormControlValueToOthers(array: FormArray, i: number, formControlName: string) {
  //   if (formControlName === 'Pictures') {
  //     const currentFormItem = array.controls[i];
  //     const currentValue = currentFormItem.get(formControlName).value;
  //     const featurePicture = currentFormItem.get('FeaturePicture').value;
  //     array.controls.forEach((formItem, index) => {
  //       if (index !== i) {
  //         const picturesFormArray = (formItem.get('Pictures') as FormArray);
  //         picturesFormArray.controls = [];
  //         currentValue.forEach(pic => {
  //           const newPictireForm = this.makeNewPictureFormGroup(pic);
  //           picturesFormArray.controls.push(newPictireForm);
  //         });
  //         formItem.get('FeaturePicture').patchValue(featurePicture);
  //       }
  //     });
  //   } else {
  //     super.copyFormControlValueToOthers(array, i, formControlName);
  //   }
  // }

  // onThumbnailPcitureClick(file: FileModel, form: FormGroup) {
  //   console.log(file);
  //   this.commonService.openDialog(ShowcaseDialogComponent, {
  //     context: {
  //       title: this.commonService.translateText('Common.action'),
  //       actions: [
  //         {
  //           label: this.commonService.translateText('Common.close'),
  //           status: 'danger',
  //           action: () => {

  //           },
  //         },
  //         {
  //           label: this.commonService.translateText('Common.preview'),
  //           status: 'success',
  //           action: () => {
  //             window.open(file.OriginImage, '_blank');
  //           },
  //         },
  //         {
  //           label: this.commonService.translateText('Common.setFeaturePicture'),
  //           status: 'primary',
  //           action: () => {
  //             form.get('FeaturePicture').setValue(file);
  //           },
  //         },
  //       ],
  //     }
  //   });
  // }

  // onCkeditorReady(editor: any) {
  //   console.log(editor);
  // }


  /** Execute api put */
  executePut(params: any, data: ProductModel[], success: (data: ProductModel[]) => void, error: (e: any) => void) {
    // params['page'] = this.collaboratorService?.currentpage$?.value;
    return super.executePut(params, data, success, error);
  }

  /** Execute api post */
  executePost(params: any, data: ProductModel[], success: (data: ProductModel[]) => void, error: (e: any) => void) {
    // params['page'] = this.collaboratorService?.currentpage$?.value;
    return super.executePost(params, data, success, error);
  }

  getRawFormData() {
    const data = super.getRawFormData();
    for (const item of data.array) {
      // item['Page'] = this.collaboratorService.currentpage$.value;
      // if (item['DateOfStart']) {
        // const dateOfStart = new Date(item['DateOfStart']);
        // item['DateOfStart'] = new Date(dateOfStart.getFullYear(), dateOfStart.getMonth(), dateOfStart.getDate(), 0, 0, 0);
      // }
    }
    return data;
  }

  async save(): Promise<ProductModel[]> {
    // if (!this.collaboratorService?.currentpage$?.value) {
    // this.commonService.toastService.show(this.commonService.translateText('Common.error'), 'Bạn chưa chọn trang mà sản phẩm sẽ được khai báo !', {
    //   status: 'danger',
    //   // });
    // }
    return super.save();
  }

}

import { Component, OnInit, EventEmitter } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ProductModel, ProductUnitModel, ProductPictureModel } from '../../../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import '../../../../lib/ckeditor.loader';
import 'ckeditor';
import { FileModel } from '../../../../models/file.model';
import { humanizeBytes, UploadInput, UploaderOptions, UploadFile, UploadOutput } from '../../../../../vendor/ngx-uploader/src/public_api';

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

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    protected ref: NbDialogRef<ProductFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);

    /** ngx-uploader */
    this.options = { concurrency: 1, maxUploads: 0, maxFileSize: 1024 * 1024 * 1024 };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
    /** End ngx-uploader */

  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  // select2OptionForProduct = {
  //   placeholder: 'Chọn sản phẩm...',
  //   allowClear: true,
  //   width: '100%',
  //   dropdownAutoWidth: true,
  //   minimumInputLength: 0,
  //   keyMap: {
  //     id: 'Code',
  //     text: 'Name',
  //   },
  //   ajax: {
  //     url: params => {
  //       return this.apiService.buildApiUrl('/admin-product/products', { 'filter_Name': params['term'] });
  //     },
  //     delay: 300,
  //     processResults: (data: any, params: any) => {
  //       console.info(data, params);
  //       return {
  //         results: data.map(item => {
  //           item['id'] = item['Code'];
  //           item['text'] = item['Name'];
  //           return item;
  //         }),
  //       };
  //     },
  //   },
  // };

  select2OptionForCategories = {
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
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/admin-product/categories', { 'filter_Name': params['term'] ? params['term'] : '', select: 'id=>Code,text=>Name' });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data.map(item => {
            // item['id'] = item['ProductCategory'];
            // item['text'] = item['ProductCategoryName'];
            return item;
          }),
        };
      },
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
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/admin-product/groups', { 'filter_Name': params['term'] ? params['term'] : '', select: 'id=>Code,text=>Name' });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data.map(item => {
            // item['id'] = item['ProductCategory'];
            // item['text'] = item['ProductCategoryName'];
            return item;
          }),
        };
      },
    },
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    this.unitList = await this.apiService.getPromise<ProductUnitModel[]>('/admin-product/units');
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
    super.executeGet(params, success, error);
  }

  formLoad(formData: ProductModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: ProductModel) => void) {
    super.formLoad(formData, (index, newForm, itemFormData) => {

      // Conditions form load
      if (itemFormData.Pictures) {
        itemFormData.Pictures.forEach(picture => {
          picture['Thumbnail'] += '?token=' + this.apiService.getAccessToken();
          const newPictureFormGroup = this.makeNewPictureFormGroup(picture);
          this.getPictures(index).push(newPictureFormGroup);
          const comIndex = this.getPictures(index).length - 1;
          this.onAddPictureFormGroup(index, comIndex, newPictureFormGroup);
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
      Pictures: this.formBuilder.array([]),
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
      this.router.navigate(['/promotion/promotion/list']);
    } else {
      this.ref.close();
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

  /** ngx-uploader */
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  filesIndex: { [key: string]: UploadFile } = {};
  pictureFormIndex: { [key: string]: FormGroup } = {};

  onUploadOutput(output: UploadOutput): void {
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
          this.getPictures(0).push(newPictureFormGroup);
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
        this.dragOver = true;
        break;
      case 'dragOut':
      case 'drop':
        this.dragOver = false;
        break;
      case 'done':
        // The file is downloaded
        console.log('Upload complete');
        const fileResponse: FileModel = output.file.response[0];
        // const newPictureFormGroup = this.makeNewPictureFormGroup({ Image: fileResponse.Store + '/' + fileResponse.Id + '.' + fileResponse.Extension });
        // newPictureFormGroup.get('Thumbnail').setValue(fileResponse.Thumbnail);
        // newPictureFormGroup['file'] = output.file;
        // this.getPictures(0).push(newPictureFormGroup);
        const pictureFormGropu = this.pictureFormIndex[output.file.id];
        pictureFormGropu.get('Image').setValue(fileResponse.Store + '/' + fileResponse.Id + '.' + fileResponse.Extension);
        pictureFormGropu.get('Thumbnail').setValue(fileResponse.Thumbnail + '?token=' + this.apiService.getAccessToken());
        this.files.splice(this.files.findIndex(f => f.id === output.file.id), 1);
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
}

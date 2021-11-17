import { CollaboratorService } from './../../collaborator.service';
import { CollaboratorEducationArticlePrintComponent } from '../education-article-print/collaborator-education-article-print.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { environment } from '../../../../../environments/environment';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ProductModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { CurrencyPipe } from '@angular/common';
import { CollaboratorEducationArticleModel } from '../../../../models/collaborator.model';
import * as ClassicEditorBuild from '../../../../../vendor/ckeditor/ckeditor5-custom-build/build/ckeditor.js';

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
  selector: 'ngx-collaborator-education-article-form',
  templateUrl: './collaborator-education-article-form.component.html',
  styleUrls: ['./collaborator-education-article-form.component.scss'],
  providers: [
    CurrencyPipe,
  ]
})
export class CollaboratorEducationArticleFormComponent extends DataManagerFormComponent<CollaboratorEducationArticleModel> implements OnInit {

  componentName: string = 'CollaboratorEducationArticleFormComponent';
  idKey = ['Code', 'Page'];
  baseFormUrl = '/collaborator/education-article/form';
  apiPath = '/collaborator/education-articles';

  previewAfterCreate = true;  
  printDialog = CollaboratorEducationArticlePrintComponent;

  env = environment;

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<CollaboratorEducationArticleFormComponent>,
    public currencyPipe: CurrencyPipe,
    public collaboratorService: CollaboratorService,
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
  };

  select2OptionForPage = {
    placeholder: 'Chọn trang...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  select2OptionForProduct = {
    placeholder: 'Chọn Hàng hoá/dịch vụ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: false,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/collaborator/page-products', { select: "id=>Product,text=>ProductName,Product=>Product,ProductName=>ProductName", limit: 40, includeUnit: false, includeUnits: true, unitPrice: true, 'search': params['term'], page: this.collaboratorService.currentpage$?.value });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(product => {
            product['text'] = `${product['text']} - ${product['id']}`;
            return product;
          })
        };
      },
    },
  };

  uploadConfig = {

  };

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init(): Promise<boolean> {

    return super.init().then(status => {
      if (this.isDuplicate) {
        // Clear id
        this.id = [];
        this.array.controls.forEach((formItem, index) => {
          formItem.get('Code').setValue('');
          formItem.get('Title').setValue('Copy of: ' + formItem.get('Title').value);
        });
      }
      return status;
    });
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: CollaboratorEducationArticleModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includePage'] = true;
    params['includeProduct'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: CollaboratorEducationArticleModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: CollaboratorEducationArticleModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: CollaboratorEducationArticleModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [null],
      Page: [null, Validators.required],
      Product: [null],
      Title: [null, Validators.required],
      Summary: [null],
      ContentBlock1: [null],
      ContentBlock2: [null],
      ContentBlock3: [null],
      Photo: [null],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: CollaboratorEducationArticleModel): void {
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
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  onSelectProduct(detail: FormGroup, selectedData: ProductModel) {
    console.log(selectedData);
    if (selectedData) {
      detail.get('Description').setValue(selectedData.Name);
      if (selectedData.Units) {
        const unitControl = detail.get('Unit');
        unitControl['UnitList'] = selectedData.Units;
        unitControl.patchValue(selectedData.Units.find(f => f['DefaultImport'] === true || f['IsDefaultPurchase'] === true));
      }
      detail.get('Description').setValue(selectedData.Name);
    } else {
      detail.get('Description').setValue('');
      detail.get('Unit').setValue('');
    }
    return false;
  }

  getRawFormData() {
    return super.getRawFormData();
  }

  onCkeditorReady(editor: any) {
    console.log(editor);
  }


}

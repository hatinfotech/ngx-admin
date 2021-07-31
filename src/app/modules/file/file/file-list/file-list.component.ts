import { Component, OnInit, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FileModel, FileStoreModel } from '../../../../models/file.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FileFormComponent } from '../file-form/file-form.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { SmartTableThumbnailComponent, SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { humanizeBytes, UploadInput, UploaderOptions, UploadFile, UploadOutput, UploadStatus } from '../../../../../vendor/ngx-uploader/src/public_api';
import { CustomServerDataSource } from '../../../../lib/custom-element/smart-table/custom-server.data-source';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
})
export class FileListComponent extends ServerDataManagerListComponent<FileModel> implements OnInit {

  componentName: string = 'FileListComponent';
  formPath = '/file/file/form';
  apiPath = '/file/files';
  idKey = 'Id';

  @ViewChild('uploadButton') uploadButton: ElementRef;


  fileStoreList: FileStoreModel[] = [];
  currentFileStore: FileStoreModel;
  fileStoreListConfig = {
    placeholder: 'Chọn hosting...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
  ) {
    super(apiService, router, commonService, dialogService, toastService);

    // Update card header: action control list
    this.actionButtonList = this.actionButtonList.filter(btn => !['add', 'edit'].some(test => test === btn.name));
    this.actionButtonList.unshift({
      name: 'upload',
      status: 'danger',
      // label: 'Refresh',
      icon: 'cloud-upload',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.close'), 'head-title'),
      size: 'medium',
      disabled: () => false,
      hidden: () => false,
      click: () => {
        this.uploadButton.nativeElement.click();
        return false;
      },
    });

    /** ngx-uploader */
    this.options = { concurrency: 3, maxUploads: 0, maxFileSize: 1024 * 1024 * 1024 };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
    /** End ngx-uploader */
  }

  async init() {
    const result = await super.init();
    this.fileStoreList = await this.apiService.getPromise<FileStoreModel[]>('/file/file-stores', { filter_Type: 'REMOTE', sort_Name: 'asc', select: 'id=>Code,text=>Name,Code=>Code,Name=>Name,Path=>Path' });
    this.actionButtonList.unshift({
      type: 'select2',
      name: 'fileStore',
      status: 'success',
      label: 'File Store',
      icon: 'plus',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.createNew'), 'head-title'),
      size: 'medium',
      select2: { data: this.fileStoreList, option: this.fileStoreListConfig },
      value: () => '',
      change: (value: FileStoreModel, option: any) => {
        this.currentFileStore = value;
        if (this.currentFileStore && this.currentFileStore.Path) {
          this.apiPath = this.currentFileStore.Path + '/v1/file/files';
          (this.source as CustomServerDataSource<FileModel>).setUrl(this.apiPath);
        } else {
          this.apiPath = '/v1/file/files';
          (this.source as CustomServerDataSource<FileModel>).setUrl(this.apiPath);
        }
        this.refresh();
      },
      disabled: () => {
        return false;
      },
      click: () => {
        this.gotoForm();
        return false;
      },
    });
    return result;
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      mode: 'external',
      selectMode: 'multi',
      actions: {
        position: 'right',
      },
      add: this.configAddButton(),
      edit: this.configEditButton(),
      delete: this.configDeleteButton(),
      pager: this.configPaging(),
      columns: {
        Thumbnail: {
          title: 'Hình',
          type: 'custom',
          width: '5%',
          renderComponent: SmartTableThumbnailComponent,
          onComponentInitFunction: (instance: SmartTableThumbnailComponent) => {
            instance.valueChange.subscribe(value => {
            });
            instance.click.subscribe(async (row: FileModel) => {
            });
          },
        },
        Name: {
          title: 'Tên file',
          type: 'string',
          width: '25%',
        },
        Created: {
          title: 'Ngày upload',
          type: 'string',
          width: '15%',
        },
        Update: {
          title: 'Cập nhật',
          type: 'string',
          width: '15%',
        },
        Store: {
          title: 'Kho lưu trữ',
          type: 'string',
          width: '10%',
        },
        Id: {
          title: 'Id',
          type: 'string',
          width: '5%',
        },
        Protected: {
          title: 'Bảo mật',
          type: 'string',
          width: '5%',
        },
        Download: {
          title: 'Tải',
          type: 'custom',
          width: '5%',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'download-outline';
            instance.label = 'Tải về';
            instance.display = true;
            instance.status = 'success';
            instance.valueChange.subscribe(value => {
            });
            instance.click.subscribe(async (row: FileModel) => {
              window.open(row['DownloadLink'], '_blank');
            });
          },
        },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareData
    source.prepareData = (data: FileModel[]) => {
      data.forEach(item => {
        // item['Thumbnail'] += '?token=' + this.apiService.getAccessToken();
        // item['DownloadLink'] += '?token=' + this.apiService.getAccessToken();
      });
      return data;
    };

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['sort_Id'] = 'desc';
      return params;
    };

    return source;
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: FileModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: FileModel[] | HttpErrorResponse) => void) {
    // params['includeParent'] = true;
    super.executeGet(params, success, error, complete);
  }

  getList(callback: (list: FileModel[]) => void) {
    super.getList((rs) => {
      // rs.forEach(item => {
      //   item.Content = item.Content.substring(0, 256) + '...';
      // });
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: FileModel[]) => void, onDialogClose?: () => void) {
    this.commonService.openDialog(FileFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: FileModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
          this.refresh();
        },
      },
    });
  }

  /** Go to form */
  gotoForm(id?: string): false {
    this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
    return false;
  }

  /** ngx-uploader */
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;

  onUploadOutput(output: UploadOutput): void {
    // console.log(output);
    // console.log(this.files);
    switch (output.type) {
      case 'allAddedToQueue':
        // uncomment this if you want to auto upload files when added
        const event: UploadInput = {
          type: 'uploadAll',
          url: this.apiService.buildApiUrl(this.apiPath),
          method: 'POST',
          data: { foo: 'bar' },
        };
        this.uploadInput.emit(event);
        break;
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          this.files.push(output.file);
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
        console.log('Upload complete', output);
        if (this.files.filter(f => f.progress.status !== UploadStatus.Done).length === 0) {
          setTimeout(() => {
            this.files = [];
          }, 10000);
          this.refresh();
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
}

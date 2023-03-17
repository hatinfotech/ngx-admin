import { Component, OnInit, EventEmitter } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { SmsPhoneNumberListModel, SmsReceipientModel, SmsPhoneNumberListDetailModel } from '../../../../models/sms.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef, NbGlobalPhysicalPosition } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { UploadInput, humanizeBytes, UploaderOptions, UploadFile, UploadOutput } from '../../../../../vendor/ngx-uploader/src/public_api';
import { GridApi, ColumnApi, Module, AllCommunityModules, IDatasource, IGetRowsParams } from '@ag-grid-community/all-modules';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { FileModel } from '../../../../models/file.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';

@Component({
  selector: 'ngx-sms-phone-number-form',
  templateUrl: './sms-phone-number-form.component.html',
  styleUrls: ['./sms-phone-number-form.component.scss'],
})
export class SmsPhoneNumberFormComponent extends DataManagerFormComponent<SmsPhoneNumberListModel> implements OnInit {

  componentName: string = 'SmsPhoneNumberFormComponent';
  idKey = 'Code';
  apiPath = '/sms/phone-number-lists';
  baseFormUrl = '/sms/phone-number/form';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<SmsPhoneNumberFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);

    /** AG-Grid */
    this.columnDefs = [
      {
        headerName: '#',
        width: 52,
        valueGetter: 'node.data.No',
        cellRenderer: 'loadingCellRenderer',
        sortable: false,
        pinned: 'left',
      },
      {
        headerName: 'Số điện thoại',
        field: 'PhoneNumber',
        width: 300,
        filter: 'agTextColumnFilter',
        // pinned: 'left',
        autoHeight: true,
      },
      {
        headerName: 'Tên',
        field: 'Name',
        width: 400,
        filter: 'agTextColumnFilter',
        // pinned: 'left',
      },
      {
        headerName: 'Số lần gửi',
        field: 'NumOfSent',
        width: 100,
        filter: 'agTextColumnFilter',
        pinned: 'right',
      },
    ];

    this.pagination = false;
    this.maxBlocksInCache = 5;
    this.paginationPageSize = this.cacheBlockSize = 1000;
    /** End AG-Grid */


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

  select2ParamsOption = {
    placeholder: 'Brandname...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };



  /** AG-Grid */
  public gridApi: GridApi;
  public gridColumnApi: ColumnApi;
  public modules: Module[] = AllCommunityModules;
  public dataSource: IDatasource;
  public columnDefs: any;
  public rowSelection = 'multiple';
  public rowModelType = 'infinite';
  public paginationPageSize: number;
  public cacheOverflowSize = 2;
  public maxConcurrentDatasourceRequests = 2;
  public infiniteInitialRowCount = 1;
  public maxBlocksInCache: number;
  public cacheBlockSize: number;
  public rowData: SmsReceipientModel[];
  public gridParams;
  public multiSortKey = 'ctrl';
  public rowDragManaged = false;
  public getRowHeight;
  public rowHeight: number;
  public hadRowsSelected = false;
  public pagination: boolean;
  public phoneNumberListDetails: SmsPhoneNumberListDetailModel[] = [];

  public defaultColDef = {
    sortable: true,
    resizable: true,
    // suppressSizeToFit: true,
  };
  public getRowNodeId = (item: { id: string }) => {
    return item.id;
  }
  public components = {
    loadingCellRenderer: (params) => {
      if (params.value) {
        return params.value;
      } else {
        return '<img src="assets/images/loading.gif">';
      }
    },
  };
  onGridReady(params) {
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.loadList();

  }
  onColumnResized() {
    this.gridApi.resetRowHeights();
  }
  onRowSelected() {
    this.updateActionState();
  }
  updateActionState() {
    this.hadRowsSelected = this.getSelectedRows().length > 0;
  }
  getSelectedRows() {
    return this.gridApi.getSelectedRows();
  }
  loadList(callback?: (list: SmsReceipientModel[]) => void) {

    if (this.gridApi) {
      this.cms.takeUntil('reload-contact-list', 500, () => this.gridApi.setDatasource(this.dataSource));
    }

  }

  initDataSource() {
    this.dataSource = {
      rowCount: null,
      getRows: (getRowParams: IGetRowsParams) => {
        console.info('asking for ' + getRowParams.startRow + ' to ' + getRowParams.endRow);

        const query = { limit: this.paginationPageSize, offset: getRowParams.startRow };
        getRowParams.sortModel.forEach(sortItem => {
          query['sort_' + sortItem['colId']] = sortItem['sort'];
        });
        Object.keys(getRowParams.filterModel).forEach(key => {
          const condition: { filter: string, filterType: string, type: string } = getRowParams.filterModel[key];
          query['filter_' + key] = condition.filter;
        });

        query['noCount'] = true;
        query['filter_PhoneNumberList'] = this.id[0] ? this.id[0] : 'X';

        // const contact = this.array.controls[0].get('Contact');
        // const contactGroups = this.array.controls[0].get('ContactGroups');

        // if (contact.value) {
        //   query['id'] = contact.value.id;
        // } else if (contactGroups.value && contactGroups.value.length > 0) {
        //   query['byGroups'] = contactGroups.value.map(i => i.id);
        // } else {
        //   query['byGroups'] = ['unknow'];
        // }

        new Promise<(SmsPhoneNumberListDetailModel & { Message?: string })[]>((resolve2, reject2) => {
          this.apiService.getPromise<SmsPhoneNumberListDetailModel[]>('/sms/phone-number-list-details', query).then(phoneNumberListDetails => {
            phoneNumberListDetails.forEach((item, index) => {
              item['No'] = (getRowParams.startRow + index + 1);
              item['id'] = item[this.idKey];
            });

            this.phoneNumberListDetails = phoneNumberListDetails;
            resolve2(phoneNumberListDetails);

          }).catch(e => reject2(e));
        }).then(phoneNumberListDetails => {
          // smsSendList.forEach(item => {
          //   const message = this.generatePreviewByContact(item, this.array.controls[0]);
          //   item.Message = '[' + message.length + '/160] ' + message;
          // });
          let lastRow = -1;
          if (phoneNumberListDetails.length < this.paginationPageSize) {
            lastRow = getRowParams.startRow + phoneNumberListDetails.length;
          }
          getRowParams.successCallback(phoneNumberListDetails, lastRow);
          this.gridApi.resetRowHeights();
        });



        // this.executeGet(query, contactList => {
        //   contactList.forEach((item, index) => {
        //     item['No'] = (getRowParams.startRow + index + 1);
        //     item['id'] = item[this.idKey];
        //   });

        //   let lastRow = -1;
        //   if (contactList.length < this.paginationPageSize) {
        //     lastRow = getRowParams.startRow + contactList.length;
        //   }
        //   getRowParams.successCallback(contactList, lastRow);
        //   this.gridApi.resetRowHeights();
        // });
        // this.getList(contactList => {

        // });

      },
    };
  }
  /** End AG-Grid */

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

        this.cms.openDialog(DialogFormComponent, {
          context: {
            title: 'Thứ tự cột số điện thoại và tên',
            controls: [
              {
                name: 'ImportPhoneNumberIndex',
                label: 'Sốt thứ tự cột số điện thoại',
                placeholder: '1,2,3,...',
                type: 'text',
              },
              {
                name: 'ImportNameIndex',
                label: 'Sốt thứ tự cột tên',
                placeholder: '1,2,3,...',
                type: 'text',
              },
            ],
            actions: [
              {
                label: 'Trở về',
                icon: 'back',
                status: 'info',
                action: async () => { return true; },
              },
              {
                label: 'Tải lên',
                icon: 'generate',
                status: 'success',
                action: async (form: FormGroup) => {

                  this.array.controls[0].get('ImportPhoneNumberIndex').setValue(form.value['ImportPhoneNumberIndex']);
                  this.array.controls[0].get('ImportNameIndex').setValue(form.value['ImportNameIndex']);

                  const event: UploadInput = {
                    type: 'uploadAll',
                    url: this.apiService.buildApiUrl('/file/files'),
                    method: 'POST',
                    data: { foo: 'bar' },
                  };
                  this.uploadInput.emit(event);
                  return true;
                },
              },
            ],
          },
        });

        break;
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          this.files.push(output.file);
          this.filesIndex[output.file.id] = output.file;

          // const fileResponse: FileModel = output.file.response[0];
          // const newPictureFormGroup = this.makeNewPictureFormGroup();
          // this.pictureFormIndex[output.file.id] = newPictureFormGroup;
          // newPictureFormGroup['file'] = output.file;
          // newPictureFormGroup.get('ProgressId').setValue(output.file.id);
          // this.getPictures(0).push(newPictureFormGroup);
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
        // const pictureFormGropu = this.pictureFormIndex[output.file.id];
        // pictureFormGropu.get('Image').setValue(fileResponse.Store + '/' + fileResponse.Id + '.' + fileResponse.Extension);
        // pictureFormGropu.get('Thumbnail').setValue(fileResponse.Thumbnail + '?token=' + this.apiService.getAccessToken());
        const fileId = `${fileResponse['Store']}/${fileResponse['Id']}.${fileResponse['Extension']}`;
        this.array.controls[0].get('ImportFile').setValue(fileId);

        this.save().then(rs => {
          console.log(rs);
          this.array.controls[0].patchValue(rs[0]);
          this.files.splice(this.files.findIndex(f => f.id === output.file.id), 1);
          this.array.controls[0].get('ImportFile').setValue('');
        });

        // setTimeout(() => {
        //   this.files.splice(this.files.findIndex(f => f.id === output.file.id), 1);
        // }, 15000);

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


  ngOnInit() {
    this.restrict();
    super.ngOnInit();

    this.initDataSource();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: SmsPhoneNumberListModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeParent'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: SmsPhoneNumberListModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code_old: [''],
      Code: [''],
      Name: ['', Validators.required],
      Description: [''],
      ImportFile: [],
      ImportPhoneNumberIndex: [],
      ImportNameIndex: [],
    });
    if (data) {
      data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: SmsPhoneNumberListModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/admin-product/units/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  resetSentCount() {

    if (this.id[0]) {
      this.cms.openDialog(ShowcaseDialogComponent, {
        context: {
          title: 'Xác nhận',
          content: 'Bạn có muốn đặt lại trạng thái gửi cho danh sách này không ?',
          actions: [
            {
              label: 'Đặt lại',
              icon: 'reset',
              status: 'danger',
              action: () => {
                const runningToast = this.toastrService.show('running', 'Đang đặt lại danh sách số điện thoại', {
                  status: 'danger',
                  hasIcon: true,
                  position: NbGlobalPhysicalPosition.TOP_RIGHT,
                  duration: 0,
                });
                this.apiService.putPromise<SmsPhoneNumberListModel[]>('/sms/phone-number-lists', { id: [this.id[0]], resetSentCount: true }, [{ Code: this.id[0] as any }]).then(rs => {
                  runningToast.close();
                  this.toastrService.show('success', 'Danh sách số điện thoại đã được đặt lại', {
                    status: 'success',
                    hasIcon: true,
                    position: NbGlobalPhysicalPosition.TOP_RIGHT,
                    // duration: 5000,
                  });

                  this.loadList();

                });
              },
            },
            {
              label: 'Trở về',
              icon: 'back',
              status: 'success',
              action: () => { },
            },
          ],
        },
      });

    }

    return false;
  }
}

import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { DataManagerFormComponent } from '../../../lib/data-manager/data-manager-form.component';
import { EmailAddressListModel, EmailAddressListDetailModel } from '../../../models/email.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef, NbGlobalPhysicalPosition } from '@nebular/theme';
import { CommonService } from '../../../services/common.service';
import { EmailAddressFormComponent } from '../address/email-address-form/email-address-form.component';
import { UploadInput, humanizeBytes, UploaderOptions, UploadFile, UploadOutput } from '../../../../vendor/ngx-uploader/src/public_api';
import { GridApi, ColumnApi, Module, AllCommunityModules, IDatasource, IGetRowsParams } from '@ag-grid-community/all-modules';
import { SmsReceipientModel } from '../../../models/sms.model';
import { DialogFormComponent } from '../../dialog/dialog-form/dialog-form.component';
import { FileModel } from '../../../models/file.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ShowcaseDialogComponent } from '../../dialog/showcase-dialog/showcase-dialog.component';

@Component({
  selector: 'ngx-email-sent-stats-list',
  templateUrl: './email-sent-stats-list.component.html',
  styleUrls: ['./email-sent-stats-list.component.scss']
})
export class EmailSentStatsListComponent extends DataManagerFormComponent<EmailAddressListModel> implements OnInit {

  componentName: string = 'EmailSentStatsListComponent';
  idKey = 'Code';
  apiPath = '/email-marketing/address-lists';
  baseFormUrl = '/email-marketing/address/form';

  @Input() inputEmail: string;

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<EmailAddressFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);

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
        headerName: 'Email',
        field: 'EmailAddress',
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
        headerName: 'Thời gian',
        field: 'EventDate',
        width: 200,
        filter: 'agTextColumnFilter',
        pinned: 'right',
      },
      {
        headerName: 'Trạng thái',
        field: 'State',
        width: 100,
        filter: 'agTextColumnFilter',
        pinned: 'right',
      },
    ];

    this.pagination = false;
    this.maxBlocksInCache = 5;
    this.paginationPageSize = this.cacheBlockSize = 1000;
    /** End AG-Grid */
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
  public emailAddressListDetails: EmailAddressListDetailModel[] = [];

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
      this.commonService.takeUntil('reload-contact-list', 500, () => this.gridApi.setDatasource(this.dataSource));
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
        query['includeEmailSentState'] = true;
        query['sort_EventDate'] = 'desc';
        query['filter_AddressList'] = this.id[0] ? this.id[0] : 'X';
        query['byEmail'] = this.inputEmail;

        // const contact = this.array.controls[0].get('Contact');
        // const contactGroups = this.array.controls[0].get('ContactGroups');

        // if (contact.value) {
        //   query['id'] = contact.value.id;
        // } else if (contactGroups.value && contactGroups.value.length > 0) {
        //   query['byGroups'] = contactGroups.value.map(i => i.id);
        // } else {
        //   query['byGroups'] = ['unknow'];
        // }

        new Promise<(EmailAddressListDetailModel & { Message?: string })[]>((resolve2, reject2) => {
          // if (this.updateMode === 'live' || this.smsSendList.length === 0) {
          this.apiService.getPromise<EmailAddressListDetailModel[]>('/email-marketing/address-list-details', query).then(emailAddressListDetails => {
            emailAddressListDetails.forEach((item, index) => {
              item['No'] = (getRowParams.startRow + index + 1);
              item['id'] = item[this.idKey];
            });

            this.emailAddressListDetails = emailAddressListDetails;
            resolve2(emailAddressListDetails);

          }).catch(e => reject2(e));
          // } else {
          //   resolve2(this.smsSendList);
          // }
        }).then(emailAddressListDetails => {
          // smsSendList.forEach(item => {
          //   const message = this.generatePreviewByContact(item, this.array.controls[0]);
          //   item.Message = '[' + message.length + '/160] ' + message;
          // });
          let lastRow = -1;
          if (emailAddressListDetails.length < this.paginationPageSize) {
            lastRow = getRowParams.startRow + emailAddressListDetails.length;
          }
          getRowParams.successCallback(emailAddressListDetails, lastRow);
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

  ngOnInit() {
    this.restrict();
    super.ngOnInit();

    this.initDataSource();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: EmailAddressListModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeParent'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: EmailAddressListModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code_old: [''],
      Code: [''],
      Name: ['', Validators.required],
      Description: [''],
      ImportFile: [],
      ImportEmailIndex: [],
      ImportNameIndex: [],
    });
    if (data) {
      data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: EmailAddressListModel): void {
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
      this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'Xác nhận',
          content: 'Bạn có muốn đặt lại trạng thái gửi cho danh sách này không ?',
          actions: [
            {
              label: 'Đặt lại',
              icon: 'reset',
              status: 'danger',
              action: () => {
                const runningToast = this.toastrService.show('running', 'Đang đặt lại danh sách địa chỉ email', {
                  status: 'danger',
                  hasIcon: true,
                  position: NbGlobalPhysicalPosition.TOP_RIGHT,
                  duration: 0,
                });
                this.apiService.putPromise<EmailAddressListModel[]>('/email-marketing/address-lists', { id: [this.id[0]], resetSentCount: true }, [{ Code: this.id[0] as any }]).then(rs => {
                  runningToast.close();
                  this.toastrService.show('success', 'Danh sách địa chỉ email đã được đặt lại', {
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

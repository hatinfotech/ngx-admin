import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { HttpErrorResponse } from '@angular/common/http';
import { SmsPhoneNumberFormComponent } from '../phone-number/sms-phone-number-form/sms-phone-number-form.component';
import { SmsPhoneNumberListModel, SmsReceipientModel, SmsPhoneNumberListDetailModel, SmsSentStateModel } from '../../../models/sms.model';
import { DataManagerFormComponent } from '../../../lib/data-manager/data-manager-form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnApi, GridApi, IDatasource, IGetRowsParams, Module } from '@ag-grid-community/core';
import { RootServices } from '../../../services/root.services';
// import { GridApi, ColumnApi, Module, AllCommunityModules, IDatasource, IGetRowsParams } from '@ag-grid-community/all-modules';

@Component({
  selector: 'ngx-sms-sent-stats-list',
  templateUrl: './sms-sent-stats-list.component.html',
  styleUrls: ['./sms-sent-stats-list.component.scss'],
})
export class SmsSentStatsListComponent extends DataManagerFormComponent<SmsPhoneNumberListModel> implements OnInit {

  componentName: string = 'SmsSentStatsListComponent';
  idKey = 'Code';
  apiPath = '/sms/phone-number-lists';
  baseFormUrl = '/sms/phone-number/form';
  @Input() inputSms: string & number;

  constructor(
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<SmsPhoneNumberFormComponent>,
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);

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
  // public modules: Module[] = AllCommunityModules;
  public modules: Module[] = [
    
  ];
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
        query['includeSmsSentState'] = true;
        query['sort_EventDate'] = 'desc';
        query['filter_PhoneNumberList'] = this.id[0] ? this.id[0] : 'X';
        query['bySms'] = this.inputSms;

        // const contact = this.array.controls[0].get('Contact');
        // const contactGroups = this.array.controls[0].get('ContactGroups');

        // if (contact.value) {
        //   query['id'] = contact.value.id;
        // } else if (contactGroups.value && contactGroups.value.length > 0) {
        //   query['byGroups'] = contactGroups.value.map(i => i.id);
        // } else {
        //   query['byGroups'] = ['unknow'];
        // }

        new Promise<(SmsSentStateModel & { Message?: string })[]>((resolve2, reject2) => {
          this.apiService.getPromise<SmsSentStateModel[]>('/sms/phone-number-list-details', query).then(phoneNumberListDetails => {
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

    // if (this.id[0]) {
    //   this.cms.openDialog(ShowcaseDialogComponent, {
    //     context: {
    //       title: 'Xác nhận',
    //       content: 'Bạn có muốn đặt lại trạng thái gửi cho danh sách này không ?',
    //       actions: [
    //         {
    //           label: 'Đặt lại',
    //           icon: 'reset',
    //           status: 'danger',
    //           action: () => {
    //             const runningToast = this.toastrService.show('running', 'Đang đặt lại danh sách số điện thoại', {
    //               status: 'danger',
    //               hasIcon: true,
    //               position: NbGlobalPhysicalPosition.TOP_RIGHT,
    //               duration: 0,
    //             });
    //             this.apiService.putPromise<SmsPhoneNumberListModel[]>('/sms/phone-number-lists', { id: [this.id[0]], resetSentCount: true }, [{ Code: this.id[0] as any }]).then(rs => {
    //               runningToast.close();
    //               this.toastrService.show('success', 'Danh sách số điện thoại đã được đặt lại', {
    //                 status: 'success',
    //                 hasIcon: true,
    //                 position: NbGlobalPhysicalPosition.TOP_RIGHT,
    //                 // duration: 5000,
    //               });

    //               this.loadList();

    //             });
    //           },
    //         },
    //         {
    //           label: 'Trở về',
    //           icon: 'back',
    //           status: 'success',
    //           action: () => { },
    //         },
    //       ],
    //     },
    //   });

    // }

    return false;
  }
}

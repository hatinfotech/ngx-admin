import { Component, OnInit, EventEmitter, Input, Output, ElementRef } from '@angular/core';
import { SmsModel, SmsReceipientModel } from '../../../../models/sms.model';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ActionControl } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { ApiService } from '../../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { GridApi, Module, ColumnApi, AllCommunityModules, IDatasource, IGetRowsParams } from '@ag-grid-community/all-modules';
import { ContactModel } from '../../../../models/contact.model';

@Component({
  selector: 'ngx-sms-sent-form',
  templateUrl: './sms-sent-form.component.html',
  styleUrls: ['./sms-sent-form.component.scss'],
})
export class SmsSentFormComponent extends DataManagerFormComponent<SmsModel> implements OnInit {

  componentName: string = 'SmsSentFormComponent';
  idKey = 'Code';
  apiPath = '/helpdesk/tickets';
  baseFormUrl = '/helpdesk/ticket/form';

  @Input('ticketCode') ticketCode: string;
  @Input('index') index: string;
  @Input('phoneNumber') phoneNumber: string;
  @Output() onClose = new EventEmitter<string>();
  @Output() onInit = new EventEmitter<SmsSentFormComponent>();

  select2ContactOption = {
    placeholder: 'Chọn liên hệ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/contact/contacts', { filter_Name: params['term'] ? params['term'] : '' });
        // return environment.api.baseUrl + '/contact/contacts?token='
        //   + localStorage.getItem('api_access_token') + '&filter_Name=' + params['term'];
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Name'];
            return item;
          }),
        };
      },
    },
  };

  select2ContactGroupOption = {
    placeholder: 'Chọn nhóm liên hệ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/contact/groups', { filter_Name: params['term'] ? params['term'] : '' });
        // return environment.api.baseUrl + '/contact/contacts?token='
        //   + localStorage.getItem('api_access_token') + '&filter_Name=' + params['term'];
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Name'];
            return item;
          }),
        };
      },
    },
  };

  select2TempateOption = {
    placeholder: 'Chọn mẫu SMS...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/sms/templates', { filter_Name: params['term'] ? params['term'] : '' });
        // return environment.api.baseUrl + '/contact/contacts?token='
        //   + localStorage.getItem('api_access_token') + '&filter_Name=' + params['term'];
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Name'];
            return item;
          }),
        };
      },
    },
  };

  actionControlList: ActionControl[] = [
    {
      type: 'button',
      name: 'save',
      status: 'success',
      label: 'Lưu',
      icon: 'save',
      title: 'Lưu yêu cầu',
      size: 'tiny',
      disabled: (option) => {
        return !option.form.valid;
        // return false;
      },
      click: () => {
        return true;
      },
    },
    {
      type: 'button',
      name: 'reset',
      status: 'warning',
      label: 'Tải lại',
      icon: 'refresh',
      title: 'Tải lại',
      size: 'tiny',
      disabled: () => {
        return false;
      },
      click: () => {
        // this.refresh();
        this.formLoad();
        return false;
      },
    },
    {
      type: 'button',
      name: 'close',
      status: 'danger',
      label: 'Đóng',
      icon: 'close-circle',
      title: 'Đóng',
      size: 'tiny',
      disabled: () => {
        return false;
      },
      click: (event, option: { formIndex: number }) => {
        this.goback();
        return false;
      },
    },
    // {
    //   type: 'button',
    //   name: 'undo',
    //   status: 'warning',
    //   label: 'Hoàn tác',
    //   icon: 'undo',
    //   title: 'Hoàn tác',
    //   size: 'tiny',
    //   disabled: () => {
    //     return false;
    //   },
    //   click: () => {
    //     this.onFormUndo();
    //     return false;
    //   },
    // },
  ];

  /** Local dat source */
  dataSource: IDatasource;
  columnDefs: any;
  pagination: boolean;
  maxBlocksInCache: number;
  paginationPageSize: number;
  cacheBlockSize: number;

  public gridApi: GridApi;
  public gridColumnApi: ColumnApi;
  public modules: Module[] = AllCommunityModules;

  public defaultColDef = {
    sortable: true,
    resizable: true,
    // suppressSizeToFit: true,
  };

  public rowSelection = 'multiple';
  public rowModelType = 'infinite';
  public maxConcurrentDatasourceRequests = 2;
  public infiniteInitialRowCount = 1;
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
  public multiSortKey = 'ctrl';
  public rowDragManaged = false;
  public rowHeight: number;
  public getRowHeight;
  public hadRowsSelected = false;
  public rowData: SmsReceipientModel[];
  public gridParams;
  public cacheOverflowSize = 2;

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

  onGridReady(params) {
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.loadList();

  }

  /** Get data from api and push to list */
  loadList(callback?: (list: SmsReceipientModel[]) => void) {

    // if (!this.dataSource) {

    // }
    if (this.gridApi) {
      this.gridApi.setDatasource(this.dataSource);
    }

    // this.selectedIds = [];
    // this.hasSelect = 'none';
    // this.getList(list => {
    //   this.source.load(list.map((item, index) => {
    //     if (!item['No']) {
    //       item['No'] = index + 1;
    //     }
    //     return item;
    //   }));
    //   if (callback) callback(list);
    // });
  }

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    public elRef: ElementRef,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
    this.silent = true;
    if (this.ticketCode) {
      this.id = [this.ticketCode];
    }


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
        headerName: 'Tên',
        field: 'Name',
        width: 250,
        filter: 'agTextColumnFilter',
        pinned: 'left',
      },
      {
        headerName: 'Số điện thoại',
        field: 'Phone',
        width: 250,
        filter: 'agTextColumnFilter',
        pinned: 'left',
        autoHeight: true,
      },
      {
        headerName: 'Email',
        field: 'Email',
        width: 250,
        filter: 'agTextColumnFilter',
        // pinned: 'left',
        autoHeight: true,
      },
      {
        headerName: 'Địa chỉ',
        field: 'Address',
        width: 500,
        filter: 'agTextColumnFilter',
      },
    ];

    this.pagination = false;
    this.maxBlocksInCache = 5;
    this.paginationPageSize = 100;
    this.cacheBlockSize = 100;


  }

  ngOnInit() {
    // this.restrict();
    super.ngOnInit();
    // if (this.inputId) {
    //   this.mode = 'dialog';
    // }
    this.onInit.emit(this);
    this.initDataSource();
  }

  onObjectChange(item, formIndex: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (item && !item['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (item['Code']) {
          this.array.controls[formIndex].get('Name').setValue(item['Name']);
          this.array.controls[formIndex].get('Phone').setValue(item['Phone']);
          this.array.controls[formIndex].get('Email').setValue(item['Email']);
          this.array.controls[formIndex].get('Address').setValue(item['Address']);
        }
      }
    }

  }
  onTemplateChanged(event: any, formItem: FormControl) {
    // console.info(item);

    if (!this.isProcessing) {
      // if (item && !item['doNotAutoFill']) {

        const template = formItem.get('Template');

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (template.value['id']) {
          formItem.get('Content').setValue(template.value['Content']);
        }
      // }
    }

  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.ticketCode ? [this.ticketCode] : null);
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: SmsModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: SmsModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Contact: [''],
      ContactGroups: [''],
      Name: [''],
      Phone: [''],
      Template: [''],
      Email: [''],
      Address: [''],
      Content: [''],
    });
    if (data) {
      // let formData: any;
      // if (typeof data.SupportedPerson === 'string') {
      //   data['SupportedPerson'] = '1';
      //   formData = data;
      //   formData['SupportedPerson'] = { id: data.SupportedPerson, text: data.SupportedPersonName };
      // } else {
      //   formData = data;
      // }
      newForm.patchValue(data);
    }

    const contact = newForm.get('Contact');
    const contactGroups = newForm.get('ContactGroups');
    contact.valueChanges.subscribe(value => {
      if (value) {
        contactGroups.setValue([]);
        contactGroups.disable();
      } else {
        contactGroups.enable();
      }
      this.loadList();
    });
    contactGroups.valueChanges.subscribe(value => {
      // if (value && value.length > 0) {
      this.loadList();
      // }
    });
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: SmsModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    // super.goback();
    // if (this.mode === 'page') {
    //   this.router.navigate(['/contact/contact/list']);
    // } else {
    //   this.ref.close();
    //   // this.dismiss();
    // }
    this.dialogService.open(ShowcaseDialogComponent, {
      context: {
        title: 'Phiếu yêu cầu hỗ trợ',
        content: 'Bạn có muốn đóng phiếu yêu cầu hỗ trợ, dữ liệu sẽ được tự dđộng lưu lại!',
        actions: [
          {
            label: 'Tiếp tục',
            icon: 'back',
            status: 'warning',
            action: () => { },
          },
          {
            label: 'Lưu và đóng',
            icon: 'save',
            status: 'success',
            action: () => {
              this.save();
              this.onClose.emit(this.index);
            },
          },
          {
            label: 'Đóng',
            icon: 'close',
            status: 'danger',
            action: () => {
              this.onClose.emit(this.index);
            },
          },
        ],
      },
    });

    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  onAfterCreateSubmit(newFormData: SmsModel[]) {
    super.onAfterCreateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }
  onAfterUpdateSubmit(newFormData: SmsModel[]) {
    super.onAfterUpdateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }

  // dismiss() {
  //   this.ref.close();
  // }

  set description(value: string) {
    this.array.controls[0].get('Description').setValue(value);
  }

  get description() {
    return this.array.controls[0].get('Description').value;
  }

  checkDiabled(event: any, form: FormGroup) {
    const value: [] = form.get('Contacts').value;
    return value && value.length > 0;
  }

  initDataSource() {
    this.dataSource = {
      rowCount: null,
      getRows: (getRowParams: IGetRowsParams) => {
        console.info('asking for ' + getRowParams.startRow + ' to ' + getRowParams.endRow);

        const query = { limit: this.cacheBlockSize, offset: getRowParams.startRow };
        getRowParams.sortModel.forEach(sortItem => {
          query['sort_' + sortItem['colId']] = sortItem['sort'];
        });
        Object.keys(getRowParams.filterModel).forEach(key => {
          const condition: { filter: string, filterType: string, type: string } = getRowParams.filterModel[key];
          query['filter_' + key] = condition.filter;
        });

        const contact = this.array.controls[0].get('Contact');
        const contactGroups = this.array.controls[0].get('ContactGroups');

        if (contact.value) {
          query['id'] = contact.value.id;
        } else if (contactGroups.value && contactGroups.value.length > 0) {
          query['byGroups'] = contactGroups.value.map(i => i.id);
        } else {
          query['byGroups'] = ['unknow'];
        }

        this.apiService.getPromise<ContactModel[]>('/contact/contacts', query).then(contactList => {
          contactList.forEach((item, index) => {
            item['No'] = (getRowParams.startRow + index + 1);
            item['id'] = item[this.idKey];
          });

          let lastRow = -1;
          if (contactList.length < this.paginationPageSize) {
            lastRow = getRowParams.startRow + contactList.length;
          }
          getRowParams.successCallback(contactList, lastRow);
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
}

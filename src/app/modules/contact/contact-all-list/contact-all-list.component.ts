import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { ContactModel } from '../../../models/contact.model';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { ContactFormComponent } from '../contact/contact-form/contact-form.component';
import { AgGridDataManagerListComponent } from '../../../lib/data-manager/ag-grid-data-manger-list.component';
import { DatePipe } from '@angular/common';
import { AppModule } from '../../../app.module';
import { AgDateCellRenderer } from '../../../lib/custom-element/ag-list/cell/date.component';
import { AgTextCellRenderer } from '../../../lib/custom-element/ag-list/cell/text.component';
import { agMakeCommandColDef } from '../../../lib/custom-element/ag-list/column-define/command.define';
import { agMakeSelectionColDef } from '../../../lib/custom-element/ag-list/column-define/selection.define';
import { AgSelect2Filter } from '../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { DialogFormComponent } from '../../dialog/dialog-form/dialog-form.component';
import { FormGroup } from '@angular/forms';
import { RootServices } from '../../../services/root.services';

@Component({
  selector: 'ngx-contact-all-list',
  templateUrl: './contact-all-list.component.html',
  styleUrls: ['./contact-all-list.component.scss']
})
export class ContactAllListComponent extends AgGridDataManagerListComponent<ContactModel, ContactFormComponent> implements OnInit {

  componentName: string = 'ContactAllListComponent';
  formPath = '/contact/contact-form/form';
  apiPath = '/contact/contacts';
  idKey = ['Code'];
  formDialog = ContactFormComponent;

  // AG-Grid config
  public rowHeight: number = 50;
  // @Input() suppressRowClickSelection = false;

  @Input() gridHeight = 'calc(100vh - 230px)';


  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<ContactAllListComponent>,
    public datePipe: DatePipe,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, themeService, ref);

    this.defaultColDef = {
      ...this.defaultColDef,
      cellClass: 'ag-cell-items-center',
    }

    this.pagination = false;
    // this.maxBlocksInCache = 5;
    this.paginationPageSize = 100;
    this.cacheBlockSize = 100;
  }

  async init() {
    return super.init().then(async state => {

      this.actionButtonList.unshift({
        name: 'merge',
        status: 'danger',
        label: this.cms.textTransform(this.cms.translate.instant('Common.merge'), 'head-title'),
        icon: 'checkmark-square',
        title: this.cms.textTransform(this.cms.translate.instant('Common.merge'), 'head-title'),
        size: 'medium',
        disabled: () => this.selectedIds.length === 0,
        hidden: () => !this.ref || Object.keys(this.ref).length === 0 ? true : false,
        click: () => {
          console.log('merge contact', this.selectedIds);
          return false;
        },
      });

      const processingMap = AppModule.processMaps['purchaseOrder'];
      await this.cms.waitForLanguageLoaded();
      this.columnDefs = this.configSetting([
        {
          ...agMakeSelectionColDef(this.cms),
          headerName: 'ID',
          field: 'Id',
          width: 100,
          valueGetter: 'node.data.Id',
          // sortingOrder: ['desc', 'asc'],
          initialSort: 'desc',
        },
        // {
        //   ...agMakeImageColDef(this.cms, null, (rowData) => {
        //     return rowData.AvatarUrl;
        //   }),
        //   headerName: 'Hình',
        //   pinned: 'left',
        //   field: 'AvatarUrl',
        //   width: 100,
        // },
        {
          headerName: 'Mã',
          field: 'Code',
          width: 140,
          filter: 'agTextColumnFilter',
          // pinned: 'left',
        },
        {
          headerName: 'Tên',
          field: 'Name',
          width: 200,
          filter: 'agTextColumnFilter',
          autoHeight: true,
          // pinned: 'left',
        },
        {
          headerName: 'Số điện thoại',
          field: 'Phone',
          width: 200,
          filter: 'agTextColumnFilter',
          autoHeight: true,
          // pinned: 'left',
        },
        {
          headerName: 'Email',
          field: 'Email',
          width: 200,
          filter: 'agTextColumnFilter',
          autoHeight: true,
          // pinned: 'left',
        },
        {
          headerName: 'Nhóm',
          field: 'Groups',
          // pinned: 'left',
          width: 250,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/contact/groups', { includeIdText: true, includeGroups: true, sort_Name: 'asc' }, {
                placeholder: 'Chọn nhóm...', limit: 10, prepareReaultItem: (item) => {
                  // item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                  return item;
                }
              }),
              multiple: true,
              logic: 'OR',
              allowClear: true,
            }
          },
        },
        {
          headerName: 'Ghi chú',
          field: 'Note',
          width: 300,
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          headerName: 'Người tạo',
          field: 'Creator',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/user/users', { includeIdText: true, includeGroups: true, sort_SearchRank: 'desc' }, {
                placeholder: 'Chọn người tạo...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                  return item;
                }
              }),
              multiple: true,
              logic: 'OR',
              allowClear: true,
            }
          },
        },
        {
          headerName: 'Ngày tạo',
          field: 'Created',
          width: 180,
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        // {
        //   ...agMakeStateColDef(this.cms, processingMap, (data) => {
        //     this.preview([data]);
        //   }),
        //   headerName: 'Trạng thái',
        //   field: 'State',
        //   width: 155,
        // },
        {
          ...agMakeCommandColDef(this, this.cms, true, true, true, [
            {
              name: 'assignMemberCard',
              appendTo: 'head',
              title: 'Gán thẻ thành viên',
              status: 'success',
              icon: 'credit-card-outline',
              outline: false,
              action: async (params: { node: { data: ContactModel } }) => {
                this.cms.openDialog(DialogFormComponent, {
                  context: {
                    title: 'Phát hành thẻ thành viên',
                    width: '600px',
                    onInit: async (form, dialog) => {
                      return true;
                    },
                    controls: [
                      {
                        name: 'MemberCard',
                        label: 'ID thẻ thành viên',
                        placeholder: 'Quét ID thẻ thành viên...',
                        type: 'text',
                        focus: true,
                        initValue: '',
                      },
                    ],
                    actions: [
                      {
                        label: 'Trở về',
                        icon: 'back',
                        status: 'basic',
                        action: async () => { return true; },
                      },
                      {
                        label: 'Phát hành',
                        icon: 'npm-outline',
                        status: 'success',
                        action: async (form: FormGroup) => {

                          let memberCard: string[] = form.get('MemberCard').value.trim();

                          if (memberCard) {
                            let toastRef = null;
                            try {
                              // ids = [...new Set(ids)];
                              this.loading = true;
                              if (params.node?.data?.Code) {
                                await this.apiService.putPromise('/marketing/member-cards/' + memberCard, { distribute: true, contact: params.node.data.Code }, [{ Code: memberCard }]);
                                // toastRef.close();
                                toastRef = this.cms.showToast('Thẻ thành viên đã được phát hành cho khách hàng ' + params.node.data.Name, 'Phát hành thẻ thành công', { status: 'success', duration: 10000 });
                              }
                              this.loading = false;
                            } catch (err) {
                              console.error(err);
                              this.loading = false;
                              toastRef.close();
                              toastRef = this.cms.showToast('Chưa thể phát hành thẻ thành viên', 'Lỗi phát hành thẻ thành viên', { status: 'danger', duration: 30000 });
                            }
                          }

                          return true;
                        },
                      },
                    ],
                  },
                });
                return true;
              }
            }
          ]),
          headerName: 'Lệnh',
        },
      ] as ColDef[]);

      return state;
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

  // @Input() getRowHeight = (params: RowHeightParams<CommercePosOrderModel>) => {
  //   return 123;
  // }

  @Input() prepareApiParams(params: any, getRowParams: IGetRowsParams) {
    params['includeGroups'] = true;
    params['eq_IsDeleted'] = false;
    return params;
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: ContactModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(ContactFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: ContactModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
        },
      },
    });
    return false;
  }

  onGridReady(params) {
    super.onGridReady(params);
  }
}

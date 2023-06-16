import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { MktMemberCardFormComponent } from '../member-card-form/member-card-form.component';
import { MktMemberCardPrintComponent } from '../member-card-print/member-card-print.component';
import { AppModule } from '../../../../app.module';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { FormGroup } from '@angular/forms';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { DatePipe } from '@angular/common';
import { AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/cell/date.component';
import { agMakeCurrencyColDef } from '../../../../lib/custom-element/ag-list/column-define/currency.define';
import { agMakeStateColDef } from '../../../../lib/custom-element/ag-list/column-define/state.define';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { MktMemberCardModel } from '../../../../models/marketing.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'ngx-mkt-member-card-list',
  templateUrl: './member-card-list.component.html',
  styleUrls: ['./member-card-list.component.scss'],
  providers: [DatePipe]
})
export class MktMemberCardListComponent extends AgGridDataManagerListComponent<MktMemberCardModel, MktMemberCardFormComponent> implements OnInit {

  componentName: string = 'MktMemberCardListComponent';
  formPath = '/marketing/member-card/form';
  apiPath = '/marketing/member-cards';
  idKey = ['Code'];

  formDialog = MktMemberCardFormComponent;
  printDialog = MktMemberCardPrintComponent;

  // AG-Grid config
  public rowHeight: number = 50;
  // @Input() suppressRowClickSelection = false;

  @Input() gridHeight = '100%';

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<MktMemberCardListComponent>,
    public datePipe: DatePipe,
  ) {
    super(apiService, router, cms, dialogService, toastService, themeService, ref);

    this.defaultColDef = {
      ...this.defaultColDef,
      cellClass: 'ag-cell-items-center',
    }

    this.pagination = false;
    this.maxBlocksInCache = 5;
    this.paginationPageSize = 100;
    this.cacheBlockSize = 100;
  }

  async init() {
    return super.init().then(async state => {

      this.actionButtonList.unshift({
        name: 'downaloExcel',
        label: 'Excel',
        title: 'Download Excel',
        status: 'primary',
        size: 'medium',
        icon: 'download-outline',
        click: (event, option) => {
          this.downloadExcel(option?.index);
          return true;
        }
      });

      this.actionButtonList.unshift({
        type: 'button',
        name: 'generateMemberCards',
        status: 'danger',
        label: 'Khởi tạo ther',
        title: 'Khởi tạo thẻ hàng loạt',
        size: 'medium',
        icon: 'flash-outline',
        // disabled: () => {
        //   return this.selectedIds.length == 0;
        // },
        click: () => {
          this.cms.openDialog(DialogFormComponent, {
            context: {
              title: 'Phát hành thẻ thành viên',
              width: '600px',
              onInit: async (form, dialog) => {
                return true;
              },
              controls: [
                {
                  name: 'Quantity',
                  label: 'Số lượng thẻ',
                  placeholder: 'Số lượng thẻ sẽ được tạo tự động...',
                  type: 'text',
                  initValue: 0,
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
                  label: 'Khởi tạo',
                  icon: 'npm-outline',
                  status: 'danger',
                  action: async (form: FormGroup) => {

                    let quantity = form.get('Quantity').value.trim();
                    let toastRef = this.cms.showToast('Đang khởi tạo ' + quantity + ' thẻ thành viên', 'Đang khởi tạo thẻ', { status: 'info', duration: 60000 });
                    try {
                      await this.apiService.postPromise(this.apiPath, { generateMemberCards: true, quantity: quantity }, []);
                      this.loading = true;
                      toastRef.close();
                      toastRef = this.cms.showToast('Đã khởi tạo ' + quantity + ' thẻ thành viên', 'Hoàn tất khởi tạo thẻ', { status: 'success', duration: 10000 });
                      this.refresh();
                      this.loading = false;
                    } catch (err) {
                      console.error(err);
                      this.loading = false;
                      toastRef.close();
                      toastRef = this.cms.showToast('Chưa khởi tạo được thẻ do có lỗi xảy ra trong quá trình thực thi', 'Lỗi khởi tạo thẻ', { status: 'danger', duration: 30000 });
                    }

                    return true;
                  },
                },
              ],
            },
          });
        }
      });

      const processingMap = AppModule.processMaps['memberCard'];
      await this.cms.waitForLanguageLoaded();
      this.columnDefs = this.configSetting([
        {
          ...agMakeSelectionColDef(this.cms),
          headerName: '#',
          field: 'Id',
          width: 100,
          valueGetter: 'node.data.Id',
          // sortingOrder: ['desc', 'asc'],
          initialSort: 'desc',
        },
        {
          headerName: 'ID Thẻ',
          field: 'Code',
          width: 200,
          filter: 'agTextColumnFilter',
          pinned: 'left',
        },
        {
          headerName: 'Ngày khởi tạo',
          field: 'GeneratedDate',
          width: 200,
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        {
          headerName: 'Ngày phát hành',
          field: 'DistributedDate',
          width: 200,
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        {
          headerName: 'Khách hàng',
          field: 'Contact',
          // pinned: 'left',
          width: 400,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/contact/contacts', { includeIdText: true, includeGroups: true, sort_SearchRank: 'desc' }, {
                placeholder: 'Chọn liên hệ...', limit: 10, prepareReaultItem: (item) => {
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
          ...agMakeCurrencyColDef(this.cms),
          headerName: 'Điểm tích lũy',
          field: 'Amount',
          pinned: 'right',
          width: 150,
        },
        {
          ...agMakeStateColDef(this.cms, processingMap, (data) => {
            this.preview([data]);
          }),
          pinned: 'right',
          headerName: 'Level',
          field: 'MemberLevel',
          width: 150,
        },
        {
          ...agMakeStateColDef(this.cms, processingMap, (data) => {
            this.preview([data]);
          }),
          headerName: 'Trạng thái',
          field: 'State',
          width: 170,
        },
        {
          ...agMakeCommandColDef(this, this.cms, true, true, false),
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

  prepareApiParams(params: any, getRowParams?: IGetRowsParams) {
    // params['includeCreator'] = true;
    params['includeContact'] = true;
    params['includeMemberLevel'] = true;
    // params['includeRelativeVouchers'] = true;
    // params['sort_Id'] = 'desc';
    return params;
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: MktMemberCardModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(MktMemberCardFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: MktMemberCardModel[]) => {
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

  downloadExcel(index: number) {
    // for (const index in ids) {
    let params = { limit: 'nolimit', sort_GeneratedDate: 'asc', sort_Id: 'asc' };
    params = this.prepareApiParams(params);
    this.apiService.getPromise<MktMemberCardModel[]>(this.apiPath, params).then(data => {
      // const data = this.data[index];
      const details = [];
      let no = 0;
      for (const detail of data) {
        no++;
        details.push({
          'STT': no,
          'ID Thẻ': detail['Code'],
          'ID Liên hệ': this.cms.getObjectId(detail['Contact']),
          'Tên liên hệ': this.cms.getObjectText(detail['Contact']),
          'Ngày khởi tạo': this.datePipe.transform(detail['GeneratedDate'], 'short'),
          'Ngày phát hành': this.datePipe.transform(detail['DistributedDate'], 'short'),
          'Cấp độ thẻ': this.cms.getObjectId(detail['MemberLevel']),
          // 'MemberLevelName': this.cms.getObjectText(detail['MemberLevel']),
          'Trạng thái': this.cms.getObjectId(detail['State']),
          // 'StateName': this.cms.getObjectText(detail['State']),
        });
      }
      const sheet = XLSX.utils.json_to_sheet(details);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, sheet, 'Chi tiết đơn đặt mua hàng');
      XLSX.writeFile(workbook, 'MemberCard_' + new Date().toLocaleString() + '.xlsx');
    });


  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { ContactModel } from '../../../../models/contact.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { ContactAllListComponent } from '../../../contact/contact-all-list/contact-all-list.component';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { DatePipe } from '@angular/common';
import { RootServices } from '../../../../services/root.services';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { Model } from '../../../../models/model';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { AppModule } from '../../../../app.module';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { ImportContactsDialogComponent } from '../../../contact/import-contacts-dialog/import-contacts-dialog.component';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { CollaboratorService } from '../../collaborator.service';
import { AgCellButton } from '../../../../lib/custom-element/ag-list/cell/button.component';
import { FormGroup } from '@angular/forms';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { agMakeTextColDef } from '../../../../lib/custom-element/ag-list/column-define/text.define';

@Component({
  selector: 'ngx-collaborator-seller-list',
  templateUrl: './collaborator-seller-list.component.html',
  styleUrls: ['./collaborator-seller-list.component.scss']
})
export class CollaboratorSellerListComponent extends AgGridDataManagerListComponent<Model, ContactFormComponent> implements OnInit {

  componentName: string = 'CollaboratorSellerListComponent';
  static _dialog: NbDialogRef<CollaboratorSellerListComponent>;
  apiPath: string = '/collaborator/sellers';
  formDialog = ContactFormComponent;
  idKey = ['Id'];

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
    public collaboratorService: CollaboratorService,
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

      const addActionButton = this.actionButtonList.find(f => f.name == 'add');
      addActionButton.label = 'Thêm';
      addActionButton.title = 'Thêm nhân viên sell vào danh sách';
      addActionButton.click = () => {
        if (!this.collaboratorService.currentpage$.value) {
          throw new Error('Bạn chưa chọn trang');
        }
        this.cms.openDialog(ContactAllListComponent, {
          context: {
            inputMode: 'dialog',
            gridHeight: '90vh',
            onDialogChoose: (contacts: ContactModel[]) => {
              this.loading = true;
              this.apiService.postPromise<Model[]>(this.apiPath, {}, contacts.map(m => ({ Page: this.collaboratorService.currentpage$.value, Contact: m.Code, Name: m.Name }))).then(rs2 => {
                this.loading = false;
                this.refresh();
                console.log(rs2);
              }).catch(err => {
                this.loading = false;
                return Promise.reject(err);
              });
            },
          }
        })
      };

      const processingMap = AppModule.processMaps['purchaseOrder'];
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
          headerName: 'ID Liên hệ',
          field: 'Contact',
          width: 140,
          filter: 'agTextColumnFilter',
          // pinned: 'left',
        },
        {
          headerName: 'Tên',
          field: 'Name',
          width: 300,
          filter: 'agTextColumnFilter',
          autoHeight: true,
          // pinned: 'left',
        },
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'Quản lý đội sales',
          field: 'Manager',
          // pinned: 'left',
          width: 200,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/collaborator/sales-managers', { includeIdText: true, includeGroups: true, sort_Name: 'asc' }, {
                placeholder: 'Chọn manager...', limit: 10, prepareReaultItem: (item) => {
                  item.id = item.Contact;
                  return item;
                }
              }),
              multiple: true,
              logic: 'OR',
              allowClear: true,
            }
          },
          cellRendererParams: {
            coalesceButton: {
              label: 'Gán quản lý',
              // icon: '',
              status: 'primary',
              outline: true,
              disabled: (data, params) => !params?.node?.data?.Contact,
              action: (params => {
                if (!params.node?.data?.Id || !params?.node?.data?.Contact) {
                  this.cms
                  console.log(params);
                } else {
                  this.cms.openDialog(DialogFormComponent, {
                    context: {
                      title: 'Gán quản lý',
                      width: '600px',
                      onInit: async (form, dialog) => {
                        return true;
                      },
                      controls: [
                        {
                          name: 'Manager',
                          label: 'Quản lý đội sales',
                          placeholder: 'Chọn quản lý đội sales...',
                          type: 'select2',
                          focus: true,
                          initValue: '',
                          option: {
                            ...this.cms.makeSelect2AjaxOption('/collaborator/sales-managers', { includeIdText: true }, {
                              placeholder: 'Chọn quản lý...', limit: 10, prepareReaultItem: (item) => {
                                item['id'] = item.Contact;
                                item['text'] = item['Contact'] + ' - ' + item['Name'];
                                return item;
                              }
                            }),
                            multiple: false,
                            allowClear: true,
                          }
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
                          label: 'Gán',
                          icon: 'link-2-outline',
                          status: 'success',
                          keyShortcut: 'Enter',
                          action: async (form: FormGroup) => {

                            let manager: string[] = this.cms.getObjectId(form.get('Manager').value);
                            const pageId = this.cms.getObjectId(this.collaboratorService.currentpage$.value);

                            if (manager && pageId) {
                              this.apiService.putPromise(this.apiPath + '/' + params.node.data.Id, { assignPublisherManager: true }, [{ Id: params.node.data.Id, Page: pageId, Contact: this.cms.getObjectId(params.node.data.Contact), Manager: manager }]).then(rs => {
                                this.cms.showToast('Đã gán người quản lý cho CTV', 'Gán quản lý thành công', { status: 'success' });
                                this.refreshItems([params.node.data.Id]);
                              });
                            }

                            return true;
                          },
                        },
                      ],
                    },
                  });
                }
              }),
            } as AgCellButton
          }
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
        // {
        //   headerName: 'Ghi chú',
        //   field: 'Note',
        //   width: 300,
        //   filter: 'agTextColumnFilter',
        //   autoHeight: true,
        // },
        // {
        //   headerName: 'Người tạo',
        //   field: 'Creator',
        //   // pinned: 'left',
        //   width: 200,
        //   cellRenderer: AgTextCellRenderer,
        //   filter: AgSelect2Filter,
        //   filterParams: {
        //     select2Option: {
        //       ...this.cms.makeSelect2AjaxOption('/user/users', { includeIdText: true, includeGroups: true, sort_SearchRank: 'desc' }, {
        //         placeholder: 'Chọn người tạo...', limit: 10, prepareReaultItem: (item) => {
        //           item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
        //           return item;
        //         }
        //       }),
        //       multiple: true,
        //       logic: 'OR',
        //       allowClear: true,
        //     }
        //   },
        // },
        // {
        //   headerName: 'Ngày tạo',
        //   field: 'Created',
        //   width: 180,
        //   filter: 'agDateColumnFilter',
        //   filterParams: {
        //     inRangeFloatingFilterDateFormat: 'DD/MM/YY',
        //   },
        //   cellRenderer: AgDateCellRenderer,
        // },
        {
          ...agMakeCommandColDef(this, this.cms, false, true, false, []),
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

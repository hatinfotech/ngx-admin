import { Component, ComponentFactoryResolver, OnInit } from "@angular/core";
import { CollaboratorPublisherFormComponent } from "../collaborator-publisher-form/collaborator-publisher-form.component";
import { AgGridDataManagerListComponent } from "../../../../lib/data-manager/ag-grid-data-manger-list.component";
import { ContactModel } from "../../../../models/contact.model";
import { ContactFormComponent } from "../../../contact/contact/contact-form/contact-form.component";
import { ApiService } from "../../../../services/api.service";
import { Router } from "@angular/router";
import { CommonService } from "../../../../services/common.service";
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from "@nebular/theme";
import { DatePipe } from "@angular/common";
import { agMakeSelectionColDef } from "../../../../lib/custom-element/ag-list/column-define/selection.define";
import { AgDateCellRenderer } from "../../../../lib/custom-element/ag-list/cell/date.component";
import { agMakeCommandColDef } from "../../../../lib/custom-element/ag-list/column-define/command.define";
import { ColDef, IGetRowsParams } from "@ag-grid-community/core";
import { agMakeTextColDef } from '../../../../lib/custom-element/ag-list/column-define/text.define';
import { CollaboratorService } from '../../collaborator.service';
import { AgTextCellRenderer } from "../../../../lib/custom-element/ag-list/cell/text.component";
import { AgSelect2Filter } from "../../../../lib/custom-element/ag-list/filter/select2.component.filter";
import { AgCellButton } from "../../../../lib/custom-element/ag-list/cell/button.component";
import { filter, take } from "rxjs/operators";
import { PageModel } from "../../../../models/page.model";
import { DialogFormComponent } from "../../../dialog/dialog-form/dialog-form.component";
import { FormGroup } from "@angular/forms";
import { ShowcaseDialogComponent } from "../../../dialog/showcase-dialog/showcase-dialog.component";
import QRCode from 'qrcode';
import { environment } from "../../../../../environments/environment";

@Component({
  selector: 'ngx-collaborator-publisher-list',
  templateUrl: './collaborator-publisher-list.component.html',
  styleUrls: ['./collaborator-publisher-list.component.scss']
})
export class CollaboratorPublisherListComponent extends AgGridDataManagerListComponent<ContactModel, ContactFormComponent> implements OnInit {

  componentName: string = 'CollaboratorPublisherListComponent';
  formPath = '/collaborator/publisher/form';
  apiPath = '/collaborator/publishers';
  idKey = ['Id'];
  formDialog = CollaboratorPublisherFormComponent;

  // AG-Grid config
  public rowHeight: number = 50;
  // @Input() suppressRowClickSelection = false;

  // @Input() gridHeight = 'calc(100vh - 230px)';


  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<CollaboratorPublisherListComponent>,
    public datePipe: DatePipe,
    public collaboratorService: CollaboratorService,
  ) {
    super(apiService, router, cms, dialogService, toastService, themeService, ref);

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

      this.collaboratorService.pageList$.pipe(take(1), filter(f => f && f.length > 0)).toPromise().then(pageList => {
        this.actionButtonList.unshift({
          type: 'select2',
          name: 'pbxdomain',
          status: 'success',
          label: 'Select page',
          icon: 'plus',
          title: this.cms.textTransform(this.cms.translate.instant('Common.createNew'), 'head-title'),
          size: 'medium',
          select2: {
            data: pageList, option: {
              placeholder: 'Chọn trang...',
              allowClear: true,
              width: '100%',
              dropdownAutoWidth: true,
              minimumInputLength: 0,
              keyMap: {
                id: 'id',
                text: 'text',
              },
            }
          },
          value: this.collaboratorService.currentpage$.value,
          change: (value: any, option: any) => {
            this.onChangePage(value);
          },
          disabled: () => {
            return false;
          },
          click: () => {
            // this.gotoForm();
            return false;
          },
        });
      });

      // const processingMap: {[key: string]: ProcessMap} = {
      //   "ACTIVE": {

      //   }
      // };
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
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'ID Liên hệ',
          field: 'Contact',
          width: 155,
        },
        {
          headerName: 'Tên',
          field: 'Name',
          width: 400,
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
          headerName: 'Địa chỉ',
          field: 'Address',
          width: 250,
          filter: 'agTextColumnFilter',
          autoHeight: true,
          // pinned: 'left',
        },
        {
          headerName: 'Gia nhập',
          field: 'Assigned',
          width: 180,
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
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
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'];
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
          ...agMakeTextColDef(this.cms),
          headerName: 'Quản lý',
          field: 'Manager',
          // pinned: 'left',
          width: 200,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/user/users', { includeIdText: true, sort_SearchRank: 'desc' }, {
                placeholder: 'Chọn quản lý...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'];
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
                          label: 'ID người dùng app ProBox',
                          placeholder: 'Điền ID của người dùng trên app ProBox...',
                          type: 'select2',
                          focus: true,
                          initValue: '',
                          option: {
                            ...this.cms.makeSelect2AjaxOption('/user/users', { includeIdText: true, sort_SearchRank: 'desc' }, {
                              placeholder: 'Chọn quản lý...', limit: 10, prepareReaultItem: (item) => {
                                item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'];
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
                              this.apiService.putPromise(this.apiPath, { assignPublisherManager: true }, [{ Id: params.node.data.Id, Page: pageId, Contact: this.cms.getObjectId(params.node.data.Contact), Manager: manager }]).then(rs => {
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
          ...agMakeTextColDef(this.cms),
          headerName: 'ID App ProBox',
          field: 'Publisher',
          width: 200,
          cellRendererParams: {
            colaseButton: {
              label: 'Gán ID App ProBox',
              // icon: '',
              status: 'danger',
              outline: true,
              action: (params => {
                this.cms.openDialog(DialogFormComponent, {
                  context: {
                    title: 'Gán ID App ProBox',
                    width: '600px',
                    onInit: async (form, dialog) => {
                      return true;
                    },
                    controls: [
                      {
                        name: 'UserIDAppProdBox',
                        label: 'ID người dùng app ProBox',
                        placeholder: 'Điền ID của người dùng trên app ProBox...',
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
                        label: 'Gán',
                        icon: 'link-2-outline',
                        status: 'success',
                        keyShortcut: 'Enter',
                        action: async (form: FormGroup) => {

                          let userIdAppProBox: string[] = form.get('UserIDAppProdBox').value.trim();
                          const pageId = this.cms.getObjectId(this.collaboratorService.currentpage$.value);

                          if (userIdAppProBox && pageId) {
                            this.apiService.putPromise(this.apiPath, { assignProBoxAppUserId: true }, [{ Id: params.node?.data?.Id, Page: pageId, Publisher: userIdAppProBox }]).then(rs => {
                              this.cms.showToast('Đã gán ID người dùng trên app ProBox', 'Gán ID thành công', { status: 'success' });
                              this.refreshItems([params.node?.data?.Id]);
                            });
                          }

                          return true;
                        },
                      },
                    ],
                  },
                });
              })
            } as AgCellButton
          }
        },
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'Level',
          field: 'Level',
          valueGetter: 'node.data.LevelLabel',
          width: 155,
          pinned: 'right',
        },
        {
          ...agMakeCommandColDef(this, this.cms, true, true, false, [
            {
              name: 'createReferredCode',
              appendTo: 'head',
              title: 'Tạo Ref Code ',
              status: 'success',
              icon: 'share-outline',
              outline: false,
              action: async (params: { node: { data: ContactModel } }) => {
                if (!params?.node?.data?.Id) {
                  this.cms.showError('Không đủ điều kiện tạo Ref Code');
                  return;
                }
                const publisher = params.node.data;
                // const referredToken = await this.apiService.putPromise(this.apiPath + '/', { createReferredCode: true }, [{ Id: params.node.data.Id }]).then(rs => rs[0]['ReferredCode']);
                const pageId = this.cms.getObjectId(publisher.Page) as string;
                // const referredCode = pageId.length.toString().padStart(2, '0') + pageId + publisher.Id;
                const referredLink = `${environment.proboxApp.deepLink}/${pageId}/refcode/${publisher.Id}`;

                const qrCodeImage = await QRCode.toDataURL(referredLink,
                  {
                    // version: this.version,
                    // errorCorrectionLevel: this.errorCorrectionLevel,
                    // margin: this.margin,
                    // scale: this.scale,
                    width: 250,
                    // color: {
                    //   dark: this.colorDark,
                    //   light: this.colorLight
                    // }
                  })

                this.cms.openDialog(ShowcaseDialogComponent, {
                  context: {
                    title: 'Link REF đăng ký cho CTV trên app ProBox',
                    // width: '600px',
                    content: `<img src="${qrCodeImage}">`,
                    // controls: [
                    //   {
                    //     name: 'ReferredToken',
                    //     label: 'Mã Referred',
                    //     placeholder: 'Mã Referred...',
                    //     type: 'text',
                    //     focus: true,
                    //     initValue: referredLink,
                    //   },
                    // ],
                    actions: [
                      {
                        label: 'Trở về',
                        icon: 'chevron-left-outline',
                        status: 'basic',
                        action: async () => { return true; },
                      },
                      {
                        label: 'Copy',
                        icon: 'copy-outline',
                        status: 'primary',
                        action: async () => {

                          this.cms.copyTextToClipboard(referredLink);
                          this.cms.showToast('Đã copy Ref Code', 'Đã copy Ref Code, gửi mã này cho CTV Bán Hàng để đăng ký', { status: 'success', duration: 10000 });

                          return true;
                        },
                      },
                      {
                        label: 'Download',
                        icon: 'copy-outline',
                        status: 'success',
                        action: async () => {

                          fetch(qrCodeImage)
                            .then(response => response.blob())
                            .then(blob => {
                              const link = document.createElement("a");
                              link.href = URL.createObjectURL(blob);
                              link.download = 'reflink.png';
                              link.click();
                            })
                            .catch(console.error);

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

  prepareApiParams(params: any, getRowParams: IGetRowsParams) {
    params['includeParent'] = true;
    params['includeRelativeVouchers'] = true;
    params['sort_DateOfStart'] = 'asc';
    params['page'] = this.collaboratorService?.currentpage$?.value;
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

  onChangePage(page: PageModel) {
    this.collaboratorService.currentpage$.next(this.cms.getObjectId(page));
    this.cms.takeOnce(this.componentName + '_on_domain_changed', 1000).then(() => {
      this.refresh();
    });
  }
}

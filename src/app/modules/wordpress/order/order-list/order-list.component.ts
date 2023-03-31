import { Type } from '@angular/core';
// import { SalesModule } from './../../sales.module';
import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { SmartTableButtonComponent, SmartTableDateTimeComponent, SmartTableRelativeVouchersComponent, SmartTableTagsComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { WordpressOrderFormComponent } from '../order-form/order-form.component';
import { WordpressOrderPrintComponent } from '../order-print/order-print.component';
import { ResourcePermissionEditComponent } from '../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';
import { take, takeUntil, filter } from 'rxjs/operators';
import { SmartTableDateRangeFilterComponent, SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { UserGroupModel } from '../../../../models/user-group.model';
import { AppModule } from '../../../../app.module';
import { WpOrderModel, WpSiteModel } from '../../../../models/wordpress.model';
import { WordpressService } from '../../wordpress.service';

@Component({
  selector: 'ngx-wordpress-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class WordpressOrderListComponent extends ServerDataManagerListComponent<WpOrderModel> implements OnInit {

  componentName: string = 'WpPosOrderListComponent';
  formPath = '/wordpress/order/form';
  apiPath = '/wordpress/orders';
  idKey = 'Code';
  formDialog = WordpressOrderFormComponent;
  printDialog = WordpressOrderPrintComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<WordpressOrderListComponent>;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };
  loaded = false;
  siteList: WpSiteModel[];

  // _workingSite: any;
  // set workingSite(value) {
  //   if (!value) {
  //     localStorage.setItem('wordpress_workingsite', null);
  //   } else {
  //     localStorage.setItem('wordpress_workingsite', JSON.stringify({ 'id': this.cms.getObjectId(value), 'text': this.cms.getObjectText(value) }));
  //   }
  //   this._workingSite = value;
  // }
  // get workingSite() {
  //   if (!this._workingSite || !this._workingSite.id) {
  //     this._workingSite = localStorage.getItem('wordpress_workingsite');
  //     if (typeof this._workingSite === 'string') {
  //       this._workingSite = JSON.parse(this._workingSite);
  //     } else {
  //       this._workingSite = null;
  //     }
  //   }
  //   return this._workingSite;
  // }

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<WordpressOrderListComponent>,
    public wordpressService: WordpressService,
  ) {
    super(apiService, router, cms, dialogService, toastService, ref);
  }

  async init() {
    return super.init().then(async state => {
      // this.siteList = await this.apiService.getPromise<WpSiteModel[]>('/wordpress/wp-sites', { includeIdText: true }).then(rs => [{ id: 'ALL', text: 'Tất cả' }, ...rs]);
      await this.wordpressService.siteList$.pipe(takeUntil(this.destroy$), filter(f => f && f.length > 0), take(1)).toPromise().then(siteList => {
        this.siteList = siteList;
      });
      this.actionButtonList.unshift({
        type: 'button',
        name: 'unrecord',
        status: 'warning',
        label: 'Bỏ ghi',
        title: 'Bỏ ghi các phiếu đã chọn',
        size: 'medium',
        icon: 'slash-outline',
        disabled: () => {
          return this.selectedIds.length == 0;
        },
        click: () => {
          this.cms.showDialog('Đơn hàng POS', 'Bạn có chắc muốn bỏ ghi các đơn hàng đã chọn ?', [
            {
              label: 'Trở về',
              status: 'basic',
              action: () => {
              }
            },
            {
              label: 'Bỏ ghi',
              status: 'warning',
              focus: true,
              action: () => {
                this.apiService.putPromise(this.apiPath, { changeState: 'UNRECORDED' }, this.selectedIds.map(id => ({ Code: id }))).then(rs => {
                  this.cms.toastService.show('Bỏ ghi thành công !', 'Đơn hàng POS', { status: 'success' });
                  this.refresh();
                });
              }
            },
          ]);
        }
      });

      this.actionButtonList.unshift({
        type: 'button',
        name: 'writetobook',
        status: 'primary',
        label: 'Duyệt',
        title: 'Duyệt các phiếu đã chọn',
        size: 'medium',
        icon: 'checkmark-square-outline',
        disabled: () => {
          return this.selectedIds.length == 0;
        },
        click: () => {
          this.cms.showDialog('Đơn hàng POS', 'Bạn có chắc muốn bỏ ghi các đơn hàng đã chọn ?', [
            {
              label: 'Trở về',
              status: 'basic',
              action: () => {
              }
            },
            {
              label: 'Duyệt',
              status: 'primary',
              focus: true,
              action: () => {
                this.apiService.putPromise(this.apiPath, { changeState: 'APPROVED' }, this.selectedIds.map(id => ({ Code: id }))).then(rs => {
                  this.cms.toastService.show('Duyệt thành công !', 'Đơn hàng POS', { status: 'success' });
                  this.refresh();
                });
              }
            },
          ]);
        }
      });

      this.actionButtonList.unshift({
        type: 'button',
        name: 'downloadOrder',
        status: 'success',
        label: 'Tải đơn WP',
        title: 'Tải các đơn hàng trên wordpress',
        size: 'medium',
        icon: 'checkmark-square-outline',
        disabled: () => {
          return !this.wordpressService.currentSite$?.value;
        },
        click: () => {
          this.apiService.putPromise('/wordpress/orders/' + this.cms.getObjectId(this.wordpressService.currentSite$?.value), { pullWpOrder: true }, [
            {
              Code: this.cms.getObjectId(this.wordpressService.currentSite$?.value),
            }
          ]).then(rs => {
            this.refresh();
          });
        }
      });

      this.actionButtonList.unshift({
        type: 'select2',
        name: 'account',
        status: 'success',
        label: 'Chọn site',
        icon: 'plus',
        title: 'Site',
        size: 'medium',
        select2: {
          option: {
            placeholder: 'Chọn site...',
            allowClear: false,
            width: '100%',
            dropdownAutoWidth: true,
            minimumInputLength: 0,
            keyMap: {
              id: 'id',
              text: 'text',
            },
            data: this.siteList,
          }
        },
        value: this.wordpressService.currentSite$?.value,
        change: async (value: any, option: any) => {
          // this.contraAccount$.next((value || []).map(m => this.cms.getObjectId(m)));
          this.cms.takeOnce('wordpress_load_ref_categories', 500).then(async () => {
            if (this.cms.getObjectId(this.wordpressService.currentSite$?.value) != this.cms.getObjectId(value)) {
              // this.workingSite = value;
              this.wordpressService.currentSite$?.next(value);
              await this.refresh();
            }
          });

        },
        disabled: () => {
          return this.loading;
        },
        click: () => {
          // this.gotoForm();
          return false;
        },
      });
      return state;
    });
  }

  editing = {};
  rows = [];

  stateDic = {
    APPROVE: { label: this.cms.translateText('Common.approved'), status: 'success', outline: false },
    IMPLEMENT: { label: this.cms.translateText('Common.implement'), status: 'warning', outline: false },
    // ACCEPTANCEREQUEST: { label: this.cms.translateText('Common.completeRequest'), status: 'primary', outline: false },
    ACCEPTANCE: { label: this.cms.translateText('Common.acceptance'), status: 'info', outline: false },
    COMPLETE: { label: this.cms.translateText('Common.completed'), status: 'success', outline: true },
    CANCEL: { label: this.cms.translateText('Common.cancel'), status: 'info', outline: true },
  };

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      mode: 'external',
      selectMode: 'multi',
      actions: this.isChoosedMode ? false : {
        position: 'right',
      },
      add: this.configAddButton(),
      edit: this.configEditButton(),
      delete: this.configDeleteButton(),
      pager: this.configPaging(),
      columns: {
        No: {
          title: 'No.',
          type: 'string',
          width: '1%',
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        Code: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.code'), 'head-title'),
          type: 'string',
          width: '5%',
        },
        Object: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.Object.title'), 'head-title'),
          type: 'string',
          width: '20%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
          valuePrepareFunction: (cell: any, row: WpOrderModel) => {
            return row.ObjectName;
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                ...this.cms.makeSelect2AjaxOption('/contact/contacts', { includeIdText: true, includeGroups: true }, {
                  placeholder: 'Chọn liên hệ...', limit: 10, prepareReaultItem: (item) => {
                    item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                    return item;
                  }
                }),
                multiple: true,
                logic: 'OR',
                allowClear: true,
              },
            },
          },
        },
        Title: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.title'), 'head-title'),
          type: 'string',
          width: '15%',
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        Creator: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.creator'), 'head-title'),
          type: 'string',
          width: '10%',
          valuePrepareFunction: (cell: string, row?: any) => {
            return this.cms.getObjectText(cell);
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                logic: 'OR',
                placeholder: 'Chọn người tạo...',
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                minimumInputLength: 0,
                keyMap: {
                  id: 'id',
                  text: 'text',
                },
                multiple: true,
                ajax: {
                  transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
                    console.log(settings);
                    const params = settings.data;
                    this.apiService.getPromise('/user/users', { 'search': params['term'], includeIdText: true }).then(rs => {
                      success(rs);
                    }).catch(err => {
                      console.error(err);
                      failure();
                    });
                  },
                  delay: 300,
                  processResults: (data: any, params: any) => {
                    // console.info(data, params);
                    return {
                      results: data.map(item => {
                        return item;
                      }),
                    };
                  },
                },
              },
            },
          },
        },
        Created: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.dateOfCreated'), 'head-title'),
          type: 'custom',
          width: '10%',
          filter: {
            type: 'custom',
            component: SmartTableDateRangeFilterComponent,
          },
          renderComponent: SmartTableDateTimeComponent,
          onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
            // instance.format$.next('medium');
          },
        },
        DateOfSale: {
          title: this.cms.textTransform(this.cms.translate.instant('Sales.dateOfSales'), 'head-title'),
          type: 'custom',
          width: '10%',
          filter: {
            type: 'custom',
            component: SmartTableDateRangeFilterComponent,
          },
          renderComponent: SmartTableDateTimeComponent,
          onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
            // instance.format$.next('medium');
          },
        },
        SiteName: {
          title: 'Site',
          type: 'string',
          width: '15%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        RelativeVouchers: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.relationVoucher'), 'head-title'),
          type: 'custom',
          renderComponent: SmartTableRelativeVouchersComponent,
          width: '10%',
        },
        Amount: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.amount'), 'head-title'),
          type: 'currency',
          width: '5%',
          class: 'align-right',
          position: 'right',
        },
        // IsDebt: {
        //   title: this.cms.textTransform(this.cms.translate.instant('Nợ'), 'head-title'),
        //   type: 'boolean',
        //   width: '5%',
        // },
        // Copy: {
        //   title: 'Copy',
        //   type: 'custom',
        //   width: '5%',
        //   exclude: this.isChoosedMode,
        //   renderComponent: SmartTableButtonComponent,
        //   onComponentInitFunction: (instance: SmartTableButtonComponent) => {
        //     instance.iconPack = 'eva';
        //     instance.icon = 'copy';
        //     instance.display = true;
        //     instance.status = 'warning';
        //     instance.valueChange.subscribe(value => {
        //     });
        //     instance.click.subscribe(async (row: WpPosOrderModel) => {

        //       this.cms.openDialog(WordpressPosOrderFormComponent, {
        //         context: {
        //           inputMode: 'dialog',
        //           inputId: [row.Code],
        //           isDuplicate: true,
        //           onDialogSave: (newData: WpPosOrderModel[]) => {
        //             // if (onDialogSave) onDialogSave(row);
        //           },
        //           onDialogClose: () => {
        //             // if (onDialogClose) onDialogClose();
        //             this.refresh();
        //           },
        //         },
        //       });

        //     });
        //   },
        // },
        State: {
          title: this.cms.translateText('Common.state'),
          type: 'custom',
          width: '5%',
          // class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'checkmark-circle';
            instance.display = true;
            instance.status = 'success';
            instance.disabled = this.isChoosedMode;
            // instance.style = 'text-align: right';
            // instance.class = 'align-right';
            instance.title = this.cms.translateText('Common.approved');
            instance.label = this.cms.translateText('Common.approved');
            instance.valueChange.subscribe(value => {
              const processMap = AppModule.processMaps['wordpressOrder'][value || ''];
              instance.label = this.cms.translateText(processMap?.label);
              instance.status = processMap?.status;
              instance.outline = processMap?.outline;
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: WpOrderModel) => {
              // this.preview([rowData]);
              if (rowData.State == 'PROCESSING') {
                this.gotoForm(rowData.Code);
              } else {
                this.preview([rowData]);
              }
            });
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                logic: 'OR',
                placeholder: 'Chọn trạng thái...',
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                minimumInputLength: 0,
                keyMap: {
                  id: 'id',
                  text: 'text',
                },
                multiple: true,
                data: Object.keys(AppModule.processMaps['wordpressOrder']).map(stateId => ({
                  id: stateId,
                  text: this.cms.translateText(AppModule.processMaps['wordpressOrder'][stateId].label)
                })).filter(f => f.id != '')
              },
            },
          },
        },
        Permission: {
          title: this.cms.translateText('Common.permission'),
          type: 'custom',
          width: '5%',
          class: 'align-right',
          exclude: this.isChoosedMode,
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'shield';
            instance.display = true;
            instance.status = 'danger';
            instance.style = 'text-align: right';
            instance.class = 'align-right';
            instance.title = this.cms.translateText('Common.preview');
            instance.valueChange.subscribe(value => {
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: WpOrderModel) => {

              this.cms.openDialog(ResourcePermissionEditComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [rowData.Code],
                  note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
                  resourceName: this.cms.translateText('Sales.WpPosOrder  .title', { action: '', definition: '' }) + ` ${rowData.Title || ''}`,
                  // resrouce: rowData,
                  apiPath: '/sales/orders',
                }
              });
            });
          },
        },
        Preview: {
          title: this.cms.translateText('Common.show'),
          type: 'custom',
          width: '5%',
          class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'external-link-outline';
            instance.display = true;
            instance.status = 'primary';
            instance.style = 'text-align: right';
            instance.class = 'align-right';
            instance.title = this.cms.translateText('Common.preview');
            instance.valueChange.subscribe(value => {
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: WpOrderModel) => {
              this.preview([rowData]);
            });
          },
        }
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<WpOrderModel[]>('/sales/orders', { id: ids, includeContact: true, includeDetails: true, useBaseTimezone: true });
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeCreator'] = true;
      params['includeContact'] = true;
      params['includeRelativeVouchers'] = true;
      params['sort_Id'] = 'desc';
      if (this.cms.getObjectId(this.wordpressService.currentSite$?.value) !== 'ALL') {
        params['eq_Site'] = this.cms.getObjectId(this.wordpressService.currentSite$?.value);
      }
      // params['eq_Type'] = 'PAYMENT';
      return params;
    };

    return source;
  }

  /** Api get funciton */
  // executeGet(params: any, success: (resources: UserGroupModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: UserGroupModel[] | HttpErrorResponse) => void) {
  //   params['includeCategories'] = true;
  //   super.executeGet(params, success, error, complete);
  // }

  getList(callback: (list: UserGroupModel[]) => void) {
    super.getList((rs) => {
      // rs.map((product: any) => {
      //   product['Unit'] = product['Unit']['Name'];
      //   if (product['Categories']) {
      //     product['CategoriesRendered'] = product['Categories'].map(cate => cate['text']).join(', ');
      //   }
      //   return product;
      // });
      if (callback) callback(rs);
    });
  }

  // async preview(data: WpPosOrderModel[]) {
  //   this.cms.openDialog(WpPosOrderPrintComponent, {
  //     context: {
  //       showLoadinng: true,
  //       title: 'Xem trước',
  //       id: data.map(m => m[this.idKey]),
  //       mode: 'print',
  //       idKey: ['Code'],
  //       // approvedConfirm: true,
  //       onClose: (data: WpPosOrderModel) => {
  //         this.refresh();
  //       },
  //     },
  //   });
  //   return false;
  // }

  async preview(data: WpOrderModel[], source?: string) {
    this.cms.openDialog(WordpressOrderPrintComponent, {
      context: {
        showLoadinng: true,
        title: 'Xem trước',
        // data: data,
        // id: data.map(m => m[this.idKey]),
        id: data.map(item => this.makeId(item)),
        sourceOfDialog: 'list',
        mode: 'print',
        idKey: ['Code'],
        // approvedConfirm: true,
        onChange: async (data: WpOrderModel, printComponent: WordpressOrderPrintComponent) => {

          printComponent.close();
          if (data.State === 'PROCESSING') {
            // Get relative vouchers
            // const order = await this.apiService.getPromise('/collaborator/orders/' + data.Code, {includeRelativeVouchers : true});
            // if (data.RelativeVouchers && data.RelativeVouchers.length > 0) {
            // const priceReportRef = data.RelativeVouchers.find(f => f.type === 'PRICEREPORT');
            // if (priceReportRef) {
            // this.cms.openDialog(CollaboratorOrderTeleCommitFormComponent, {
            //   context: {
            //     inputId: [priceReportRef.id],
            //     inputMode: 'dialog',
            //     onDialogSave: async (data) => {
            //       console.log(data);
            //       // setTimeout(() => {
            //       this.refresh();
            //       // }, 1000);
            //     },
            //     onDialogClose: () => { },
            //   }
            // });
            this.gotoForm(data.Code);
            // }
            // }
          } else {
            this.refresh();
          }

        },
        onSaveAndClose: () => {
          this.refresh();
        },
        // onSaveAndClose: () => {
        //   this.refresh();
        // },
      },
    });
    return false;
  }

}

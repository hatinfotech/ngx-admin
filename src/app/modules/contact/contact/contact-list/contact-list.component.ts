import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { takeUntil } from 'rxjs/operators';
import { CustomServerDataSource } from '../../../../lib/custom-element/smart-table/custom-server.data-source';
import { SmartTableBaseComponent, SmartTableButtonComponent, SmartTableCurrencyComponent, SmartTableDateTimeComponent, SmartTableThumbnailComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableDateTimeRangeFilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { CashVoucherModel } from '../../../../models/accounting.model';
import { ContactModel } from '../../../../models/contact.model';
import { UserGroupModel } from '../../../../models/user-group.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { ContactFormComponent } from '../contact-form/contact-form.component';

@Component({
  selector: 'ngx-contact-list',
  templateUrl: './contact-list.component.html',
})
export class ContactListComponent extends ServerDataManagerListComponent<ContactModel> implements OnInit {

  componentName: string = 'ContactListComponent';
  formPath = '/contact/contact-form/form';
  apiPath = '/contact/contacts';
  idKey = 'Code';
  formDialog = ContactFormComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<ContactFormComponent>;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };
  prepareRemoveSource: CustomServerDataSource<ContactModel>;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<ContactListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
    this.actionButtonList.unshift({
      name: 'merge',
      status: 'danger',
      label: this.commonService.textTransform(this.commonService.translate.instant('Common.merge'), 'head-title'),
      icon: 'checkmark-square',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.merge'), 'head-title'),
      size: 'medium',
      disabled: () => this.selectedIds.length === 0,
      hidden: () => !this.ref || Object.keys(this.ref).length === 0 ? true : false,
      click: () => {
        console.log('merge contact', this.selectedIds);
        return false;
      },
    });
    this.prepareRemoveSource = new CustomServerDataSource<ContactModel>(this.apiService, this.getApiPath());
    // Set DataSource: prepareParams
    this.prepareRemoveSource.prepareParams = (params: any) => {
      params['sort_Id'] = 'desc';
      params['includeOrganizations'] = true;
      params['includeGroups'] = true;
      params['eq_IsDeleted'] = '1';
      return params;
    };

    // this.prepareRemoveSource.prepareData = (data: ContactModel[] | any) => {
    //   return data;
    // };
  }

  // async loadCache() {
  //   // iniit category
  //   // this.categoryList = (await this.apiService.getPromise<ProductCategoryModel[]>('/admin-product/categories', {})).map(cate => ({ ...cate, id: cate.Code, text: cate.Name })) as any;
  // }

  async init() {
    // await this.loadCache();
    return super.init();
  }

  editing = {};
  rows = [];

  settings = this.configSetting({
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
      AvatarUrl: {
        title: 'Hình',
        type: 'custom',
        width: '5%',
        valuePrepareFunction: (value: string, contact: ContactModel) => {
          return contact.AvatarUrl;
        },
        renderComponent: SmartTableThumbnailComponent,
        onComponentInitFunction: (instance: SmartTableThumbnailComponent) => {
          instance.valueChange.subscribe(value => {
          });
          instance.click.subscribe(async (row: ContactModel) => {
            // if (this.files.length === 0) {
            //   this.uploadForProduct = row;
            //   this.uploadBtn.nativeElement.click();
            // } else {
            //   this.commonService.toastService.show(
            //     this.commonService.translateText('Common.uploadInProcess'),
            //     this.commonService.translateText('Common.upload'),
            //     {
            //       status: 'warning',
            //     });
            // }
          });
          instance.title = this.commonService.translateText('click to change main contact avatar');
        },
      },
      // No: {
      //   title: 'No.',
      //   type: 'string',
      //   width: '5%',
      //   filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      // },
      Name: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.Object.title'), 'head-title'),
        type: 'string',
        width: '20%',
        filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      },
      Groups: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.groups'), 'head-title'),
        type: 'html',
        width: '20%',
        valuePrepareFunction: (cell: any) => {
          return cell && cell.map(group => `<div class="tag"><nb-icon icon="person-stalker" pack="ion"></nb-icon> ${group.Name}</div></div>`).join('');
        },
        filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      },
      // Phone: {
      //   title: this.commonService.textTransform(this.commonService.translate.instant('Common.phone'), 'head-title'),
      //   type: 'string',
      //   width: '20%',
      //   filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      // },
      Email: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.email'), 'head-title'),
        type: 'string',
        width: '20%',
      },
      Code: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.code'), 'head-title'),
        type: 'string',
        width: '10%',
      },
      Created: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.created'), 'head-title'),
        type: 'custom',
        width: '10%',
        filter: {
          type: 'custom',
          component: SmartTableDateTimeRangeFilterComponent,
        },
        renderComponent: SmartTableDateTimeComponent,
        onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
          // instance.format$.next('medium');
        },
      },
      // Amount: {
      //   title: this.commonService.textTransform(this.commonService.translate.instant('Common.numOfMoney'), 'head-title'),
      //   type: 'custom',
      //   class: 'align-right',
      //   width: '10%',
      //   position: 'right',
      //   renderComponent: SmartTableCurrencyComponent,
      //   onComponentInitFunction: (instance: SmartTableCurrencyComponent) => {
      //     // instance.format$.next('medium');
      //     instance.style = 'text-align: right';
      //   },
      // },
      Merge: {
        title: this.commonService.translateText('Common.preview'),
        type: 'custom',
        width: '5%',
        class: 'align-right',
        renderComponent: SmartTableButtonComponent,
        onComponentInitFunction: (instance: SmartTableButtonComponent) => {
          instance.iconPack = 'eva';
          instance.icon = 'checkmark-circle';
          instance.display = true;
          instance.status = 'warning';
          instance.style = 'text-align: right';
          instance.class = 'align-right';
          instance.title = this.commonService.translateText('Common.approve');
          instance.valueChange.subscribe(value => {
            // instance.icon = value ? 'unlock' : 'lock';
            // instance.status = value === 'REQUEST' ? 'warning' : 'success';
            // instance.disabled = value !== 'REQUEST';
          });
          instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CashVoucherModel) => {
            this.commonService.openDialog(ShowcaseDialogComponent, {
              context: {
                title: this.commonService.translateText('Common.confirm'),
                content: 'Contact.mergeConfirm',
                actions: [
                  {
                    label: this.commonService.translateText('Common.close'),
                    status: 'primary',
                  },
                  {
                    label: this.commonService.translateText('Common.merge'),
                    status: 'danger',
                    action: () => {
                      this.apiService.putPromise<ContactModel[]>('/contact/contacts', { id: [rowData.Code], mergeContact: true, fromContacts: this.selectedItems.map(item => item.Code).join(',') }, [rowData]).then(rs => {
                        // this.reset();
                        this.unselectAll();
                        this.refresh();
                      });
                    }
                  },
                ],
              },
            });

            // this.apiService.getPromise('/accounting/cash-vouchers', { id: [rowData.Code], includeDetails: true, includeContact: true }).then(rs => {
            //   this.preview(rs[0]);
            // });


          });
        },
      }
    },
  });

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareData
    // source.prepareData = (data: UserGroupModel[]) => {
    //   // const paging = source.getPaging();
    //   // data.map((product: any, index: number) => {
    //   //   product['No'] = (paging.page - 1) * paging.perPage + index + 1;
    //   //   return product;
    //   // });
    //   return data;
    // };

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['sort_Id'] = 'desc';
      params['includeOrganizations'] = true;
      params['includeGroups'] = true;
      params['is_IsDeleted'] = 'NULL';
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

  // preview(data: CashVoucherModel) {
  //   // data.Details.forEach(detail => {
  //   //   // if (typeof detail['Tax'] === 'string') {
  //   //   //   detail['Tax'] = this.taxList.filter(t => t.Code === detail['Tax'])[0] as any;
  //   //   // }
  //   // });
  //   // this.commonService.openDialog(ContactFormComponent, {
  //   //   context: {
  //   //     title: 'Xem trước',
  //   //     data: data,
  //   //     approvedConfirm: true,
  //   //     onClose: (id: string) => {
  //   //       this.refresh();
  //   //     },
  //   //   },
  //   // });
  //   return false;
  // }

  refresh() {
    super.refresh();
    this.prepareRemoveSource.refresh();
  }

  /** Api delete funciton */
  async executeDelete(ids: any, success: (resp: any) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: any | HttpErrorResponse) => void) {
    let deletedItems: ContactModel[] = await this.convertIdsToItems(ids);
    if (!deletedItems || deletedItems.length === 0) {
      deletedItems = await this.convertIdsToItems(ids, this.prepareRemoveSource);
    }
    this.apiService.delete(this.apiPath, {id: ids, permanent: (deletedItems[0] && deletedItems[0].IsDeleted)}, (resp) => {
      // this.removeGridItems(deletedItems);
      this.refresh();
      if (success) success(resp);
    }, error, complete);
  }

}

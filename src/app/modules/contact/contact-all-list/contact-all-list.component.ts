import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { CustomServerDataSource } from '../../../lib/custom-element/smart-table/custom-server.data-source';
import { SmartTableThumbnailComponent, SmartTableDateTimeComponent, SmartTableButtonComponent } from '../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableDateTimeRangeFilterComponent, SmartTableSelect2FilterComponent } from '../../../lib/custom-element/smart-table/smart-table.filter.component';
import { SmartTableSetting } from '../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../lib/data-manager/server-data-manger-list.component';
import { CashVoucherModel } from '../../../models/accounting.model';
import { ContactGroupModel, ContactModel } from '../../../models/contact.model';
import { UserGroupModel } from '../../../models/user-group.model';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { ShowcaseDialogComponent } from '../../dialog/showcase-dialog/showcase-dialog.component';
import { ContactFormComponent } from '../contact/contact-form/contact-form.component';

@Component({
  selector: 'ngx-contact-all-list',
  templateUrl: './contact-all-list.component.html',
  styleUrls: ['./contact-all-list.component.scss']
})
export class ContactAllListComponent extends ServerDataManagerListComponent<ContactModel> implements OnInit {

  componentName: string = 'ContactAllListComponent';
  formPath = '/contact/contact-form/form';
  apiPath = '/contact/contacts';
  idKey = 'Code';
  formDialog = ContactFormComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<ContactAllListComponent>;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };
  groupsList: ContactGroupModel[];

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<ContactAllListComponent>,
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
  }

  async init() {
    this.groupsList = await this.apiService.getPromise<ContactGroupModel[]>('/contact/groups', { onlyIdText: true });
    return super.init();
  }

  editing = {};
  rows = [];

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
            });
            instance.title = this.commonService.translateText('click to change main contact avatar');
          },
        },
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
            return cell && cell.map(group => `<div class="tag"><nb-icon icon="person-stalker" pack="ion"></nb-icon> ${group.text}</div></div>`).join('');
          },
          // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                placeholder: this.commonService.translateText('Common.groups') + '...',
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                minimumInputLength: 0,
                keyMap: {
                  id: 'id',
                  text: 'text',
                },
                // multiple: true,
                ajax: {
                  url: (params: any) => {
                    return 'data:text/plan,[]';
                  },
                  delay: 0,
                  processResults: (data: any, params: any) => {
                    return {
                      results: this.groupsList.filter(cate => !params.term || this.commonService.smartFilter(cate.text, params.term)),
                    };
                  },
                },
              },
            },
          },
        },
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
        Note: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.note'), 'head-title'),
          type: 'string',
          width: '10%',
        },
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

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['sort_Id'] = 'desc';
      params['includeOrganizations'] = true;
      params['includeGroups'] = true;
      params['eq_IsDeleted'] = false;
      return params;
    };

    return source;
  }

  getList(callback: (list: UserGroupModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  async refresh() {
    super.refresh();
  }

}

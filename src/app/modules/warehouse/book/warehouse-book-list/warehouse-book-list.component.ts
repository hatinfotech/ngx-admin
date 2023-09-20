import { takeUntil } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { WarehouseBookModel } from '../../../../models/warehouse.model';
import { WarehouseBookFormComponent } from '../warehouse-book-form/warehouse-book-form.component';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { WarehouseBookCommitComponent } from '../warehouse-book-commit/warehouse-book-commit.component';
import { FormGroup } from '@angular/forms';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';

@Component({
  selector: 'ngx-warehouse-book-list',
  templateUrl: './warehouse-book-list.component.html',
  styleUrls: ['./warehouse-book-list.component.scss'],
})
export class WarehouseBookListComponent extends DataManagerListComponent<WarehouseBookModel> implements OnInit {

  componentName: string = 'WarehouseBookListComponent';
  formPath = '/warehouse/book/form';
  apiPath = '/warehouse/books';
  idKey = 'Code';
  formDialog = WarehouseBookFormComponent;

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService);

    this.actionButtonList.map(button => {
      if (button.name === 'add') {
        button.name = 'openbook';
        button.icon = 'book-open';
        button.label = this.cms.translateText('Common.openBook');
        button.title = this.cms.translateText('Common.openBook');
        // button.click = () => {};
      }
      if (button.name === 'delete') {
        button.name = 'closebook';
        button.icon = 'lock';
        button.label = this.cms.translateText('Common.lockBook');
        button.title = this.cms.translateText('Common.lockBook');
        button.click = () => { };
      }
      return button;
    });
    this.actionButtonList.splice(2, 0,
      {
        name: 'commit',
        status: 'primary',
        label: this.cms.translateText('Warehouse.Book.commit', 'head-title'),
        icon: 'lock',
        title: this.cms.translateText('Warehouse.Book.commit', 'head-title'),
        size: 'medium',
        disabled: () => this.selectedIds.length === 0,
        click: () => {
          this.cms.openDialog(WarehouseBookCommitComponent, {
            context: {
              inputWarehouseBooks: this.selectedItems,
              onDialogSave: (rs) => {
                this.refresh();
              },
            },
          });
          return false;
        },
      },
    );

    // Remove edit button
    this.actionButtonList = this.actionButtonList.filter(button => button.name !== 'edit');
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      mode: 'external',
      selectMode: 'multi',
      actions: {
        position: 'right',
      },
      // add: this.configAddButton(),
      // edit: this.configEditButton(),
      // delete: this.configDeleteButton(),
      // pager: this.configPaging(),
      columns: {
        Code: {
          title: this.cms.translateText('Common.code'),
          type: 'string',
          width: '5%',
        },
        Warehouse: {
          title: this.cms.translateText('Common.warehouse'),
          type: 'string',
          width: '30%',
        },
        Note: {
          title: this.cms.translateText('Common.note'),
          type: 'string',
          width: '50%',
        },
        // Commited: {
        //   title: this.cms.translateText('Warehouse.Book.commit'),
        //   type: 'datetime',
        //   width: '15%',
        // },
        Commited: {
          title: this.cms.translateText('Chốt sổ'),
          type: 'custom',
          width: '5%',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'lock-outline';
            instance.display = true;
            instance.status = 'danger';
            instance.valueChange.subscribe(value => {
              instance.label = instance.rowData.Commited ? this.cms.datePipe.transform(instance.rowData.Commited, 'shortDate') : this.cms.translateText('Chưa chốt sổ');
              instance.title = instance.rowData.Commited ? ('Chốt sổ đến hết ngày: ' + this.cms.datePipe.transform(instance.rowData.Commited, 'shortDate')) : 'Chưa chốt sổ';
              if (instance.rowData.Commited) {
                instance.icon = 'lock-outline';
              } else {
                instance.icon = 'unlock-outline';
              }
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: WarehouseBookModel) => {
              this.cms.openDialog(DialogFormComponent, {
                context: {
                  title: 'Chốt sổ kho',
                  cardStyle: { width: '377px' },
                  onInit: async (form, dialog) => {
                    return true;
                  },
                  controls: [
                    {
                      name: 'Commmited',
                      label: 'Chốt sổ đến ngày',
                      placeholder: 'Chốt sổ đến ngày',
                      type: 'date',
                      initValue: instance.rowData.Commited && new Date(instance.rowData.Commited) || new Date(),
                      focus: true,
                    },
                  ],
                  actions: [
                    {
                      label: 'Esc - Trở về',
                      icon: 'back',
                      status: 'basic',
                      keyShortcut: 'Escape',
                      action: async () => { return true; },
                    },
                    {
                      label: 'Chốt sổ',
                      icon: 'lock-outline',
                      status: 'danger',
                      disabled: (actionParams, form: FormGroup, dialog) => {
                        const oldCommited = instance.rowData.Commited && new Date(instance.rowData.Commited) || null;
                        const commited = (form.get('Commmited').value as Date);
                        if (oldCommited && commited && oldCommited.getFullYear() == commited.getFullYear() && oldCommited.getMonth() == commited.getMonth() && oldCommited.getDate() == commited.getDate()) {
                          return true;
                        }
                        return false;
                      },
                      // keyShortcut: 'Enter',
                      action: async (form: FormGroup, formDialogConpoent: DialogFormComponent) => {
                        const commited = (form.get('Commmited').value as Date);
                        commited.setHours(23, 59, 59, 999);
                        formDialogConpoent.startProcessing();
                        await this.apiService.putPromise('/warehouse/books/' + instance.rowData.Code, {}, [{ Code: instance.rowData.Code, Commited: commited.toISOString() }]).then(rs => {
                          console.log(rs);
                          this.cms.toastService.show('Đã chốt sổ kho đến ngày ' + this.cms.datePipe.transform(commited.toISOString(), 'short') + ', các chứng từ trước ngày chốt sổ sẽ không thể điều chỉnh được nữa !', 'Chốt sổ kho', { status: 'success', duration: 15000 });
                          this.refresh();
                          return rs;
                        }).catch(err => {
                          console.error(err);
                          formDialogConpoent.stopProcessing();
                        });
                        formDialogConpoent.stopProcessing();
                        return true;
                      },
                    },
                    {
                      label: 'Mở khóa',
                      icon: 'unlock-outline',
                      status: 'primary',
                      keyShortcut: 'Escape',
                      action: async (form: FormGroup, formDialogConpoent: DialogFormComponent) => {
                        formDialogConpoent.startProcessing();
                        await this.apiService.putPromise('/warehouse/books/' + instance.rowData.Code, {}, [{ Code: instance.rowData.Code, Commited: null }]).then(rs => {
                          console.log(rs);
                          this.cms.toastService.show('Đã mở chốt sổ kho !', 'Chốt sổ kho', { status: 'success', duration: 15000 });
                          this.refresh();
                          return rs;
                        }).catch(err => {
                          console.error(err);
                          formDialogConpoent.stopProcessing();
                        });
                        formDialogConpoent.stopProcessing();
                        return true;
                      },
                    },
                  ],
                },
              });
            });
          },
        },
        State: {
          title: this.cms.translateText('Common.state'),
          type: 'string',
          width: '15%',
        },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: WarehouseBookModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: WarehouseBookModel[] | HttpErrorResponse) => void) {
    params['includeParent'] = true;
    params['includePath'] = true;
    params['includeWarehouse'] = true;
    super.executeGet(params, success, error, complete);
  }

  getList(callback: (list: WarehouseBookModel[]) => void) {
    super.getList((rs) => {
      // rs.forEach(item => {
      //   item.Content = item.Content.substring(0, 256) + '...';
      // });
      if (callback) callback(rs.map(item => ({ ...item, Warehouse: this.cms.getObjectText(item.Warehouse) })));
    });
  }

}


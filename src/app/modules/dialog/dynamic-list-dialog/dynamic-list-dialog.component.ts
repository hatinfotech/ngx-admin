import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { takeUntil } from 'rxjs/operators';
import { AppModule } from '../../../app.module';
import { ActionControl } from '../../../lib/custom-element/action-control-list/action-control.interface';
import { SmartTableTagsComponent, SmartTableCurrencyComponent, SmartTableButtonComponent } from '../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSetting } from '../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../lib/data-manager/server-data-manger-list.component';
import { CollaboratorCommissionVoucherModel } from '../../../models/collaborator.model';
import { UserGroupModel } from '../../../models/user-group.model';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { CollaboratorCommissionFormComponent } from '../../collaborator/commission/collaborator-commission-form/collaborator-commission-form.component';
import { CollaboratorCommissionListComponent } from '../../collaborator/commission/collaborator-commission-list/collaborator-commission-list.component';
import { CollaboratorCommissionPrintComponent } from '../../collaborator/commission/collaborator-commission-print/collaborator-commission-print.component';

@Component({
  selector: 'ngx-dynamic-list-dialog',
  templateUrl: './dynamic-list-dialog.component.html',
  styleUrls: ['./dynamic-list-dialog.component.scss']
})
export class DynamicListDialogComponent<M> extends ServerDataManagerListComponent<M> implements OnInit {

  componentName: string = 'DynamicListDialogComponent';
  formPath = '';

  @Input() title: string;
  @Input() apiPath: string;
  @Input() idKey: string[];
  @Input() listSettings: SmartTableSetting;
  // @Input() actionButtonList?: ActionControl[];
  @Input() params?: any;
  @Input() data?: M[];
  // formDialog = CollaboratorCommissionFormComponent;

  @Input('context') context?: any;

  reuseDialog = true;
  static _dialog: NbDialogRef<DynamicListDialogComponent<any>>;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  @Input('filter') filter: any;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref?: NbDialogRef<ServerDataManagerListComponent<M>>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    return super.init().then(rs => {
      this.actionButtonList = this.actionButtonList.filter(f => f.name !== 'choose');
      return rs;
    });
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
      add: this.configAddButton(),
      edit: this.configEditButton(),
      delete: this.configDeleteButton(),
      pager: this.configPaging(),
      ...this.listSettings,
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  initDataSource() {
    if (!this.data) {
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
        // params['includeParent'] = true;
        params['includeRelativeVouchers'] = true;
        params['sort_Created'] = 'desc';
        if (this.params) params = {
          ...params,
          ...this.params,
        };
        // params['eq_Type'] = 'RECEIPT';
        if (this.filter) {
          for (const key in this.filter) {
            params[key] = this.filter[key];
          }
        }
        return params;
      };
      return source;
    }
    this.source = new LocalDataSource() as any;
    return this.source as any;
  }

  /** Api get funciton */
  // executeGet(params: any, success: (resources: UserGroupModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: UserGroupModel[] | HttpErrorResponse) => void) {
  //   params['includeCategories'] = true;
  //   super.executeGet(params, success, error, complete);
  // }

  getList(callback: (list: M[]) => void) {
    if (this.data) {
      callback(this.data);
    } else {
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
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<M[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true });
  }

  preview(ids: any[]) {
    this.commonService.openDialog(CollaboratorCommissionPrintComponent, {
      context: {
        showLoadinng: true,
        title: 'Xem trước',
        id: typeof ids[0] === 'string' ? ids as any : null,
        data: typeof ids[0] !== 'string' ? ids as any : null,
        idKey: ['Code'],
        // approvedConfirm: true,
        onClose: (data: CollaboratorCommissionVoucherModel) => {
          this.refresh();
        },
      },
    });
    return false;
  }

  async refresh() {
    if (this.data) {
      this.loadList(() => {
        this.syncSelectedStatus();
      });
    } else {
      super.refresh();
    }
  }

  loadList(callback?: (list: M[]) => void) {
    if (this.data) {

      if (!this.source) {
        this.initDataSource();
      }

      this.selectedIds = [];
      this.hasSelect = 'none';
      this.getList(list => {
        this.source.load(list.map((item, index) => {
          if (!item['No']) {
            item['No'] = index + 1;
          }
          return item;
        }));
        if (callback) callback(list);
      });
    } else {
      super.loadList(callback);
    }
  }

  get isChoosedMode() {
    return false;
  }

}

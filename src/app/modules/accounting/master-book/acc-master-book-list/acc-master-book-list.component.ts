import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { AccMasterBookModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccBusinessFormComponent } from '../../acc-business/acc-business-form/acc-business-form.component';
import { AccMasterBookFormComponent } from '../acc-master-book-form/acc-master-book-form.component';
import { AccMasterBookHeadAmountComponent } from '../acc-master-book-head-amount/acc-master-book-head-amount.component';

@Component({
  selector: 'ngx-acc-master-book-list',
  templateUrl: './acc-master-book-list.component.html',
  styleUrls: ['./acc-master-book-list.component.scss']
})
export class AccMasterBookListComponent extends ServerDataManagerListComponent<AccMasterBookModel> implements OnInit {

  componentName: string = 'AccMasterBookListComponent';
  formPath = '/accounting/business/form';
  apiPath = '/accounting/master-books';
  idKey = 'Code';
  formDialog = AccMasterBookFormComponent;

  reuseDialog = true;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<AccMasterBookListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    return super.init().then(rs => {
      
      return rs;
    });
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      columns: {
        Code: {
          title: this.commonService.translateText('Common.code'),
          type: 'string',
          width: '10%',
        },
        Branch: {
          title: this.commonService.translateText('Common.branch'),
          type: 'string',
          width: '15%',
          // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        },
        Year: {
          title: this.commonService.translateText('Common.year'),
          type: 'string',
          width: '20%',
        },
        Creator: {
          title: this.commonService.translateText('Accounting.creator'),
          type: 'string',
          width: '15%',
        },
        DateOfCreate: {
          title: this.commonService.translateText('Accounting.dateOfCreate'),
          type: 'string',
          width: '15%',
        },
        DateOfStart: {
          title: this.commonService.translateText('Common.dateOfStart'),
          type: 'string',
          width: '10%',
        },
        DateOfEnd: {
          title: this.commonService.translateText('Common.dateOfEnd'),
          type: 'string',
          width: '10%',
        },
        DateOfBeginning: {
          title: this.commonService.translateText('Common.dateOfBeginning'),
          type: 'string',
          width: '10%',
        },
        State: {
          title: this.commonService.translateText('Common.state'),
          type: 'string',
          width: '10%',
        },
        Preview: {
          title: this.commonService.translateText('Common.show'),
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
            instance.label = this.commonService.translateText('Accounting.MasterBook.headAmount');
            instance.title = this.commonService.translateText('Common.preview');
            instance.valueChange.subscribe(value => {
              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: AccMasterBookModel) => {
              this.commonService.openDialog(AccMasterBookHeadAmountComponent, {
                context: {
                  inputMode: 'dialog',
                  masterBook: rowData,
                  // inputId: ids,
                  // data: [{ Type: 'RECEIPT' }],
                  // onDialogSave: (newAccBusiness: AccMasterBookModel[]) => {
                  //   console.log(newAccBusiness);
                  //   // const accBusiness: any = { ...newAccBusiness[0], id: newAccBusiness[0].Code, text: newAccBusiness[0].Name };
                  //   // detailFormGroup.get('AccountingBusiness').patchValue(accBusiness);
                  // },
                  // onDialogClose: () => {

                  // },
                },
                closeOnEsc: false,
                closeOnBackdropClick: false,
              });
            });
          },
        },
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
      params['includeParent'] = true;
      return params;
    };

    return source;
  }

}

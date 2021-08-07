import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { CustomServerDataSource } from '../../../lib/custom-element/smart-table/custom-server.data-source';
import { SmartTableThumbnailComponent, SmartTableDateTimeComponent, SmartTableButtonComponent } from '../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableDateTimeRangeFilterComponent } from '../../../lib/custom-element/smart-table/smart-table.filter.component';
import { SmartTableSetting } from '../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../lib/data-manager/server-data-manger-list.component';
import { CashVoucherModel } from '../../../models/accounting.model';
import { ContactModel } from '../../../models/contact.model';
import { UserGroupModel } from '../../../models/user-group.model';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { ShowcaseDialogComponent } from '../../dialog/showcase-dialog/showcase-dialog.component';
import { ContactAllListComponent } from '../contact-all-list/contact-all-list.component';
import { ContactFormComponent } from '../contact/contact-form/contact-form.component';

@Component({
  selector: 'ngx-contact-removed-list',
  templateUrl: './contact-removed-list.component.html',
  styleUrls: ['./contact-removed-list.component.scss']
})
export class ContactRemovedListComponent extends ContactAllListComponent implements OnInit {

  static _dialog: NbDialogRef<ContactRemovedListComponent>;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<ContactRemovedListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, _http, ref);
  }

  async init() {
    return super.init();
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  loadListSetting(): SmartTableSetting {
    const settings = super.loadListSetting();

    settings.actions = false;
    delete settings.columns['Merge'];
    settings.columns['Restore'] = {
      title: this.commonService.translateText('Common.restore'),
      type: 'custom',
      width: '5%',
      class: 'align-right',
      renderComponent: SmartTableButtonComponent,
      onComponentInitFunction: (instance: SmartTableButtonComponent) => {
        instance.iconPack = 'eva';
        instance.icon = 'undo';
        instance.display = true;
        instance.status = 'success';
        instance.style = 'text-align: right';
        instance.class = 'align-right';
        instance.title = this.commonService.translateText('Common.restore');
        instance.label = this.commonService.translateText('Common.restore');
        instance.valueChange.subscribe(value => {
          // instance.icon = value ? 'unlock' : 'lock';
          // instance.status = value === 'REQUEST' ? 'warning' : 'success';
          // instance.disabled = value !== 'REQUEST';
        });
        instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CashVoucherModel) => {
          this.commonService.openDialog(ShowcaseDialogComponent, {
            context: {
              title: this.commonService.translateText('Common.confirm'),
              content: this.commonService.translateText('Common.restoreConfirm'),
              actions: [
                {
                  label: this.commonService.translateText('Common.close'),
                  status: 'danger',
                },
                {
                  label: this.commonService.translateText('Common.restore'),
                  status: 'success',
                  action: () => {
                    this.apiService.putPromise<ContactModel[]>('/contact/contacts', { id: [rowData.Code], restore: true }, [rowData]).then(rs => {
                      // this.reset();
                      // this.unselectAll();
                      this.refresh();
                    });
                  }
                },
              ],
            },
          });
        });
      },
    };

    return settings;
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    const parentPrepareParams = source.prepareParams;
    source.prepareParams = (params: any) => {
      parentPrepareParams && parentPrepareParams(params);
      params['eq_IsDeleted'] = true;
      return params;
    };

    return source;
  }

}

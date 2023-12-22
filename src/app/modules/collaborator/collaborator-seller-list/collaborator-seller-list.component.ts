import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { takeUntil, filter } from 'rxjs/operators';
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
import { ContactAllListComponent } from '../../contact/contact-all-list/contact-all-list.component';
import { ContactFormComponent } from '../../contact/contact/contact-form/contact-form.component';
import { IGetRowsParams } from '@ag-grid-community/core';
import { ContactSupplierListComponent } from '../../contact/contact-supplier-list/contact-supplier-list.component';
import { DatePipe } from '@angular/common';
import { RootServices } from '../../../services/root.services';
import { FormGroup } from '@angular/forms';
import { DialogFormComponent } from '../../dialog/dialog-form/dialog-form.component';
import { ColDef } from 'ag-grid-community';
import { agMakeCommandColDef } from '../../../lib/custom-element/ag-list/column-define/command.define';

@Component({
  selector: 'ngx-collaborator-seller-list',
  templateUrl: './collaborator-seller-list.component.html',
  styleUrls: ['./collaborator-seller-list.component.scss']
})
export class CollaboratorSellerListComponent extends ContactAllListComponent implements OnInit {

  componentName: string = 'CollaboratorSellerListComponent';
  static _dialog: NbDialogRef<CollaboratorSellerListComponent>;
  apiPath: string = '/collaborator/contacts';

  @Input() gridHeight = '100%';

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public _http: HttpClient,
    public ref: NbDialogRef<ContactSupplierListComponent>,
    public datePipe: DatePipe,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, themeService, ref, datePipe);
  }

  async init() {
    return super.init().then(rs => {
      this.actionButtonList.splice(this.actionButtonList.findIndex(f => f.name == 'importFromFile'),1);
      const addActionButton = this.actionButtonList.find(f => f.name == 'add');
      addActionButton.click = () => {
        this.cms.openDialog(ContactAllListComponent, {
          context: {
            inputMode: 'dialog',
            gridHeight: '90vh',
            onDialogChoose: (contacts: ContactModel[]) => {
              this.loading = true;
              this.apiService.putPromise<ContactModel[]>(this.apiPath, {}, contacts.map(m => ({ Code: m.Code, Groups: [...(m.Groups.filter(f => this.cms.getObjectId(f) != 'PUBLISHERSUPPORTER')), { id: 'PUBLISHERSUPPORTER', text: 'Cham soc CTV' }] }))).then(rs2 => {
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
      return rs;
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  prepareApiParams(params: any, getRowParams: IGetRowsParams) {
    params['eq_IsDeleted'] = false;
    params['eq_Groups'] = 'PUBLISHERSUPPORTER';
    params['includeGroups'] = true;
    return params;
  }

  protected configSetting(settings: any[]) {
    settings.splice(settings.findIndex(f => f.field == 'Command'), 1, {
      ...agMakeCommandColDef(this, this.cms, false, false, false, []),
      headerName: 'Lệnh',
    });
    return super.configSetting(settings);
  }

}

import { Component, OnInit } from '@angular/core';
import { WebHostingBaseFormComponent } from '../../web-hosting-base-form.component';
import { WhDatabaseModel } from '../../../../models/wh-database.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { WebHostingService } from '../../web-hosting-service';
import { HttpErrorResponse } from '@angular/common/http';
import { WhDatabaseUserModel } from '../../../../models/wh-database-user.model';
import { WhWebsiteModel } from '../../../../models/wh-website.model';

@Component({
  selector: 'ngx-database-form',
  templateUrl: './database-form.component.html',
  styleUrls: ['./database-form.component.scss']
})
export class DatabaseFormComponent extends WebHostingBaseFormComponent<WhDatabaseModel> implements OnInit {

  componentName: string = 'DatabaseFormComponent';
  idKey = 'database_id';
  apiPath = '/web-hosting/databases';
  baseFormUrl = '/web-hosting/databases/form';

  databaseUserList: WhDatabaseUserModel[] = [];
  databaseUserListConfig = {
    placeholder: 'Chọn tài khoản...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'database_user_id',
      text: 'database_user',
    },
  };

  websiteList: WhWebsiteModel[] = [];
  websiteListConfig = {
    placeholder: 'Chọn website...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'domain_id',
      text: 'domain',
    },
  };

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    public webHostingService: WebHostingService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService, webHostingService);
  }

  ngOnInit() {
    this.restrict();

    this.apiService.get<WhDatabaseUserModel[]>('/web-hosting/database-users', {}, dbUsers => {
      this.databaseUserList = this.convertOptionList(dbUsers, 'database_user_id', 'database_user');

      this.apiService.get<WhWebsiteModel[]>('/web-hosting/websites', {}, websites => {
        this.websiteList = this.convertOptionList(websites, 'domain_id', 'domain');

        super.ngOnInit();
      });
    });
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: WhDatabaseModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: WhDatabaseModel): FormGroup {
    const newForm = this.formBuilder.group({
      database_id: [''],
      hosting: [''],
      parent_domain_id: [''],
      database_name: [''],
      database_user_id: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: WhDatabaseModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/web-hosting/databases/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}

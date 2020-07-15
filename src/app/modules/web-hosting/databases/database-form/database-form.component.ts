import { Component, OnInit } from '@angular/core';
import { WebHostingBaseFormComponent } from '../../web-hosting-base-form.component';
import { WhDatabaseModel } from '../../../../models/wh-database.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  styleUrls: ['./database-form.component.scss'],
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
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public webHostingService: WebHostingService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService, webHostingService);
  }

  async ngOnInit() {
    this.restrict();

    this.websiteList = this.convertOptionList(await this.webHostingService.getWebsiteList(), 'domain_id', 'domain');
    this.databaseUserList = this.convertOptionList(await this.webHostingService.getDatabaseUserList(), 'database_user_id', 'database_user');
    super.ngOnInit();

    // this.apiService.get<WhDatabaseUserModel[]>('/web-hosting/database-users', { hosting: this.webHostingService.activeHosting }, dbUsers => {
    //   this.databaseUserList = this.convertOptionList(dbUsers, 'database_user_id', 'database_user');

    //   this.apiService.get<WhWebsiteModel[]>('/web-hosting/websites', { hosting: this.webHostingService.activeHosting }, websites => {
    //     this.websiteList = this.convertOptionList(websites, 'domain_id', 'domain');

    //     super.ngOnInit();
    //   });
    // });
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: WhDatabaseModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: WhDatabaseModel): FormGroup {
    const newForm = this.formBuilder.group({
      database_id: [''],
      hosting: [this.webHostingService ? this.webHostingService.activeHosting : '', Validators.required],
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

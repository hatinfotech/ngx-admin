import { Component, OnInit } from '@angular/core';
import { WebHostingBaseFormComponent } from '../../web-hosting-base-form.component';
import { WhDatabaseUserModel } from '../../../../models/wh-database-user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { WebHostingService } from '../../web-hosting-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-database-user-form',
  templateUrl: './database-user-form.component.html',
  styleUrls: ['./database-user-form.component.scss'],
})
export class DatabaseUserFormComponent extends WebHostingBaseFormComponent<WhDatabaseUserModel> implements OnInit {

  componentName: string = 'WebsiteFormComponent';
  idKey = 'database_user_id';
  apiPath = '/web-hosting/database-users';
  baseFormUrl = '/web-hosting/database-users/form';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public webHostingService: WebHostingService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms, webHostingService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: WhDatabaseUserModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: WhDatabaseUserModel): FormGroup {
    const newForm = this.formBuilder.group({
      database_user_id: [''],
      database_user: [''],
      database_password: ['', Validators.required],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: WhDatabaseUserModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/web-hosting/database-users/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}

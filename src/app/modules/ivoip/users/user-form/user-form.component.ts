import { Component, OnInit } from '@angular/core';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { IvoipService } from '../../ivoip-service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserModel } from '../../../../models/user.model';

@Component({
  selector: 'ngx-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent extends IvoipBaseFormComponent<UserModel> implements OnInit {

  componentName: string = 'UserFormComponent';
  idKey = 'user_uuid';
  apiPath = '/ivoip/users';
  baseFormUrl = '/ivoip/users/form';

  groupList: {id: string, text: string}[] = [
    {
      id: 'admin',
      text: 'Admin',
    },
    {
      id: 'agent',
      text: 'Agent',
    },
    {
      id: 'all',
      text: 'All',
    },
    {
      id: 'public',
      text: 'Public',
    },
    {
      id: 'subadmin',
      text: 'Subadmin',
    },
    {
      id: 'superadmin',
      text: 'Superadmin',
    },
    {
      id: 'user',
      text: 'User',
    },
  ];
  select2OptionForGroups = {
    placeholder: 'Chọn nhóm...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ivoipService: IvoipService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms, ivoipService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: UserModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeApiKey'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: UserModel): FormGroup {
    const newForm = this.formBuilder.group({
      user_uuid: [''],
      domain_uuid: [this.ivoipService ? this.ivoipService.getPbxActiveDomainId() : '', Validators.required],
      username: ['', Validators.required],
      password: [''],
      contact_organization: ['', Validators.required],
      contact_name_given: ['', Validators.required],
      contact_name_family: ['', Validators.required],
      user_email: ['', Validators.required],
      groups: [''],
      api_key: [''],
      user_enabled: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: UserModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/ivoip/users/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  generateApiKey(outputControl: FormControl) {
    this.apiService.get<{data: string}>('/ivoip/users', {generateApiKey: true}, apiKey => {
      outputControl.setValue(apiKey.data);
    });
  }
}

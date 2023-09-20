import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { HelpdeskUserModel, HelpdeskUserExtensionModel } from '../../../../models/helpdesk.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserModel } from '../../../../models/user.model';
import { IvoipService, PbxDomainSelection } from '../../../ivoip/ivoip-service';
import { PbxExtensionModel } from '../../../../models/pbx-extension.model';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-user-extension-form',
  templateUrl: './user-extension-form.component.html',
  styleUrls: ['./user-extension-form.component.scss'],
})
export class UserExtensionFormComponent extends DataManagerFormComponent<HelpdeskUserModel> implements OnInit {

  componentName: string = 'UserExtensionFormComponent';
  idKey = 'Code';
  apiPath = '/helpdesk/users';
  baseFormUrl = '/helpdesk/user-extension/form';

  domainList: PbxDomainSelection[] = [];

  select2OptionPbxDomain = {
    placeholder: this.cms.translateText('Ivoip.chooseDomain'),
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: false,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  onPbxDomainChange(domain: any, phoneExt: FormGroup) {
    // Get extension list
    this.apiService.get<PbxExtensionModel[]>('/ivoip/extensions', { select: 'extension_uuid,extension,description', domainId: domain.id }, extList => {
      phoneExt['extensionList'] = this.convertOptionList(extList, 'extension', 'description');
    });
  }

  extensionList: PbxExtensionModel[];
  extensionListConfig = {
    placeholder: this.cms.translateText('Ivoip.chooseExtension'),
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'extension',
      text: 'description',
    },
  };

  constructor(
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<UserExtensionFormComponent>,
    public ivoipService: IvoipService,
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms, ref);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
    // this.formLoad();
    // this.id = [this.cms.loginInfo.user.Code];
  }

  async init() {
    this.ivoipService.loadDomainList(domains => {
      this.domainList = domains;
    });
    return super.init();
  }

  // getRequestId(callback: (id?: string[]) => void) {
  //   callback(['CURRENT']);
  // }

  /** Execute api get */
  // executeGet(params: any, success: (resources: UserModel[]) => void, error?: (e: HttpErrorResponse) => void) {
  //   params['includeUserPhoneExtensions'] = true;
  //   super.executeGet(params, success, error);
  // }

  /** Get form data by id from api */
  getFormData(callback: (data: HelpdeskUserModel[]) => void) {
    this.apiService.get<HelpdeskUserModel[]>(this.apiPath, { id: this.id, multi: true, includeGroups: true, includeUserPhoneExtensions: true },
      data => callback(data),
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  async formLoad(formData?: HelpdeskUserModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: HelpdeskUserModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Resources form load
      if (itemFormData.Extensions) {
        for (let i = 0; i < itemFormData.Extensions.length; i++) {
          const phoneExt = itemFormData.Extensions[i];
          let extList = [];
          if (phoneExt.Pbx && phoneExt.DomainUuid) {
            phoneExt.DomainUuid = phoneExt.DomainUuid + '@' + phoneExt.Pbx;

            // Load extensions of domain
            extList = await this.apiService.getPromise<PbxExtensionModel[]>('/ivoip/extensions', { select: 'extension_uuid,extension,description', domainId: phoneExt.DomainUuid });
          }
          const phoneExtFormGroup = this.makeNewUserPhoneExtensionFormGroup(phoneExt);
          phoneExtFormGroup['extensionList'] = this.convertOptionList(extList, 'extension', 'description');
          (newForm.get('Extensions') as FormArray).push(phoneExtFormGroup);
          this.updateInitialFormPropertiesCache(phoneExtFormGroup);
        }
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });
  }

  makeNewFormGroup(data?: HelpdeskUserModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Name: [{ value: '', disabled: true }, Validators.required],
      // Phone: ['', Validators.required],
      // Email: ['', Validators.required],
      // Password: [''],
      // RePassword: [''],

      Extensions: this.formBuilder.array([

      ]),
    });

    if (data) {
      data[this.idKey + '_old'] = data.Code;
      // data['Groups'] = data['Groups'].map(item => {
      //   return item.Code;
      // });
      newForm.patchValue(data);
    }
    return newForm;
  }

  makeNewUserPhoneExtensionFormGroup(data?: HelpdeskUserExtensionModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      DomainUuid: [''],
      Extension: [''],
      Host: [{ value: '' }],
      Port: [{ value: '' }],
      Password: [{ value: '' }],
      Transport: [{ value: '' }],
      DisplayName: [{ value: '' }],
    });

    if (data) {
      // data['Name_old'] = data.Name;
      newForm.patchValue(data);
    }
    return newForm;
  }

  getUserPhoneExtensions(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Extensions') as FormArray;
  }

  addUserPhoneExtensionFormGroup(formGroupIndex: number) {
    const newForm = this.makeNewUserPhoneExtensionFormGroup();
    this.getUserPhoneExtensions(formGroupIndex).push(newForm);
    this.updateInitialFormPropertiesCache(newForm);
    return false;
  }

  removeUserPhoneExtensionGroup(formGroupIndex: number, index: number) {
    this.getUserPhoneExtensions(formGroupIndex).removeAt(index);
    return false;
  }

  // checkPasswords(group: FormGroup) { // here we have the 'passwords' group
  //   const pass = group.controls.Password.value;
  //   const confirmPass = group.controls.RePassword.value;

  //   return !pass || pass === confirmPass ? null : { notSame: true };
  // }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: UserModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void { }
  // goback(): false {
  //   this.router.navigate(['/']);
  //   return false;
  // }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Execute api post */
  // executePost(params: any, data: HelpdeskUserModel[], success: (data: HelpdeskUserModel[]) => void, error: (e: any) => void) {
  //   throw Error('Tính năng bị chặn');
  // }

  getRawFormData() {
    const rawData = super.getRawFormData();

    rawData.array = rawData.array.map((item: HelpdeskUserModel) => {
      item['Extensions'] = item['Extensions'].map(extension => {
        const domainUuid = extension['DomainUuid'];
        if (domainUuid) {
          const doaminExtrancted = this.cms.getObjectId(extension['DomainUuid']).split('@');
          // const doaminName = extension['Domain']['text'];
          // extension['Domain'] = doaminName;
          extension['DomainUuid'] = doaminExtrancted[0];
          extension['Pbx'] = doaminExtrancted[1];
          extension['Extension'] = this.cms.getObjectId(extension.Extension);
        }
        return extension;
      });
      return item;
    });

    return rawData;
  }
}

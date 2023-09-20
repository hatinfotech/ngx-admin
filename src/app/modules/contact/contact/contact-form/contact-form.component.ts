import { ContactGroupModel } from './../../../../models/contact.model';
import { IdTextModel } from './../../../../models/common.model';
import { Component, OnInit } from '@angular/core';
import { ContactModel, ContactDetailTypeModel, ContactDetailModel } from '../../../../models/contact.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent extends DataManagerFormComponent<ContactModel> implements OnInit {

  componentName: string = 'ContactFormComponent';
  idKey = 'Code';
  apiPath = '/contact/contacts';
  baseFormUrl = '/contact/contact/form';

  // organizationList: ContactModel[];
  select2Option = {
    placeholder: 'Tổ chức...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      // url: params => {
      //   return this.apiService.buildApiUrl('/contact/contacts', { filter_Name: params['term'] });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/contact/contacts', { filter_Name: params['term'] }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Name'];
            return item;
          }),
        };
      },
    },
  };

  select2OptionForPage = {
    placeholder: this.cms.translateText('Common.page') + '...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: false,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    ajax: {
      // url: params => {
      //   return this.apiService.buildApiUrl('/zalooa/official-accounts', { filter_Name: params['term'], select: 'id=>Code,text=>Name' });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/zalooa/official-accounts', { filter_Name: params['term'], select: 'id=>Code,text=>Name' }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data.map(item => {
            // item['id'] = item['Code'];
            // item['text'] = item['Name'];
            return item;
          }),
        };
      },
    },
  };

  groupList: ContactGroupModel[];
  select2GroupsOption = {
    placeholder: this.cms.translateText('Common.group') + '...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  typeList: ContactDetailTypeModel[];
  select2OptionForType = {
    placeholder: this.cms.translateText('Common.type') + '...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  platformList: IdTextModel[] = [
    { id: 'PROBOXONE', text: 'ProBox One' },
    { id: 'ZALO', text: 'Zalo' },
    { id: 'FACEBOOK', text: 'Facebook' },
    { id: 'TELEGRAM', text: 'Telegram' },
  ];
  select2OptionForPlatForm = {
    placeholder: this.cms.translateText('Common.platform') + '...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };
  select2OptionForLocationType = {
    placeholder: this.cms.translateText('Common.type') + '...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    data: [
      {id: 'HOME', text: 'Nhà riêng'},
      {id: 'WORK', text: 'Nơi làm việc'},
      {id: 'OTHER', text: 'Khác'},
    ]
  };
  select2BaseOption = {
    placeholder: this.cms.translateText('Common.select') + '...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  makeSelect2Option(select2Options: any, formGroup: FormGroup) {
    return {
      ...select2Options,
      formGroup
    }
  }
  select2OptionForProvince = {
    placeholder: 'Chọn tỉnh/TP...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    ajax: {
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/general/locations', { token: this.apiService?.token?.access_token, select: 'id=>Code,text=>CONCAT(TypeLabel;\' \';FullName)', limit: 100, 'search': params['term'], eq_Type: '[PROVINCE,CITY]' }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data
        };
      },
    },
  };
  select2OptionForDistrict = {
    placeholder: 'Chọn quận/huyện...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    ajax: {
      url: (params, options: any) => {
        const formGroup = options?.formGroup;
        const provice = formGroup && this.cms.getObjectId(formGroup.get('Province').value);
        return this.apiService.buildApiUrl('/general/locations', { token: this.apiService?.token?.access_token, select: 'id=>Code,text=>CONCAT(TypeLabel;\' \';FullName)', limit: 100, 'search': params['term'], eq_Type: '[CDISTRICT,PDISTRICT,BURG,CITYDISTRICT]', eq_Parent: provice });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data
        };
      },
    },
  };

  select2OptionForWard = {
    placeholder: 'Chọn phường/xã/thị trấn...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    ajax: {
      url: (params: any, options: any) => {
        const formGroup = options?.formGroup;
        const district = formGroup && this.cms.getObjectId(formGroup.get('District').value);
        return this.apiService.buildApiUrl('/general/locations', { token: this.apiService?.token?.access_token, select: 'id=>Code,text=>CONCAT(TypeLabel;\' \';FullName)', limit: 100, 'search': params['term'], eq_Type: '[VILLAGE,WARD,TOWNS]', eq_Parent: district });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data
        };
      },
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
    public ref: NbDialogRef<ContactFormComponent>,
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
    // if (this.inputId) {
    //   this.mode = 'dialog';
    // }
  }

  async init() {
    this.typeList = (await this.apiService.getPromise<ContactDetailTypeModel[]>('/contact/detailTypes')).map(type => ({ ...type, id: type.Code, text: type.Name }));
    this.groupList = await this.apiService.getPromise<ContactGroupModel[]>('/contact/groups', { onlyIdText: true });
    return super.init();
  }

  async formLoad(formData: ContactModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: ContactModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      if (itemFormData.Details) {
        const details = this.getDetails(newForm);
        details.clear();
        itemFormData.Details.forEach(detail => {
          const newUnitConversionFormGroup = this.makeNewDetailFormGroup(detail);
          details.push(newUnitConversionFormGroup);
          const comIndex = details.length - 1;
          this.onAddDetailFormGroup(newForm, comIndex, newUnitConversionFormGroup);
        });
      }

      if (itemFormData.OutsideReferences) {
        itemFormData.OutsideReferences.forEach(outsideReference => {
          const newUnitConversionFormGroup = this.makeNewOutsideReferenceFormGroup(outsideReference);
          this.getOutsideReferences(newForm).push(newUnitConversionFormGroup);
          const comIndex = this.getOutsideReferences(newForm).length - 1;
          this.onAddOutsideReferenceFormGroup(newForm, comIndex, newUnitConversionFormGroup);
        });
      }

      if (itemFormData.Locations) {
        itemFormData.Locations.forEach(location => {
          const locationFormGroup = this.makeNewLocationFormGroup(location);
          this.getLocations(newForm).push(locationFormGroup);
          const comIndex = this.getLocations(newForm).length - 1;
          this.onAddLocationFormGroup(newForm, comIndex, locationFormGroup);
        });
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  // getRequestId(callback: (id?: string[]) => void) {
  //   callback(this.inputId);
  // }

  /** Execute api get */
  executeGet(params: any, success: (resources: ContactModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeOrganizations'] = true;
    params['includeGroups'] = true;
    params['includeDetails'] = true;
    params['includeOutsideReferences'] = true;
    params['includeLocations'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: ContactModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Name: ['', Validators.required],
      Phone: [''],
      // Phone2: [''],
      // Phone3: [''],
      Email: [''],
      Address: [''],
      Title: [''],
      Province: [''],
      District: [''],
      Ward: [''],
      ShortName: [''],
      // Sex: [''],
      Note: [''],
      Organizations: [''],
      Groups: [''],
      Details: this.formBuilder.array([]),
      OutsideReferences: this.formBuilder.array([]),
      Locations: this.formBuilder.array([]),
    });
    if (data) {
      newForm.patchValue(data);
      newForm.get('Code').disable();
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: ContactModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/contact/contact/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  onAfterCreateSubmit(newFormData: ContactModel[]) {
    super.onAfterCreateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }
  onAfterUpdateSubmit(newFormData: ContactModel[]) {
    super.onAfterUpdateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }

  dismiss() {
    this.ref.close();
  }

  /** Details Form */
  makeNewDetailFormGroup(data?: ContactDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Type: [''],
      Detail: [''],
    });

    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  getDetails(formItem: FormGroup) {
    return formItem.get('Details') as FormArray;
  }
  addDetailFormGroup(formItem: FormGroup) {
    const newFormGroup = this.makeNewDetailFormGroup();
    this.getDetails(formItem).push(newFormGroup);
    this.onAddDetailFormGroup(formItem, this.getDetails(formItem).length - 1, newFormGroup);
    return false;
  }
  removeDetailGroup(parentForm: FormGroup, formItem: FormGroup, index: number) {
    this.getDetails(parentForm).removeAt(index);
    this.onRemoveDetailFormGroup(formItem, index);
    return false;
  }
  onAddDetailFormGroup(parentForm: FormGroup, index: number, newFormGroup: FormGroup) {
  }
  onRemoveDetailFormGroup(formItem: FormGroup, index: number) {
  }
  /** End Details Form */

  /** Outside References Form */
  makeNewOutsideReferenceFormGroup(data?: ContactDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Platform: ['', Validators.required],
      AppUid: ['', Validators.required],
      Page: [],
      UserUid: ['', Validators.required],
      State: [''],
    });

    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  getOutsideReferences(formItem: FormGroup) {
    return formItem.get('OutsideReferences') as FormArray;
  }
  addOutsideReferenceFormGroup(formItem: FormGroup) {
    const newFormGroup = this.makeNewOutsideReferenceFormGroup();
    this.getOutsideReferences(formItem).push(newFormGroup);
    this.onAddDetailFormGroup(formItem, this.getOutsideReferences(formItem).length - 1, newFormGroup);
    return false;
  }
  removeOutsideReferenceGroup(parentForm: FormGroup, formItem: FormGroup, index: number) {
    this.getOutsideReferences(parentForm).removeAt(index);
    this.onRemoveOutsideReferenceFormGroup(formItem, index);
    return false;
  }
  onAddOutsideReferenceFormGroup(parentForm: FormGroup, index: number, newFormGroup: FormGroup) {
  }
  onRemoveOutsideReferenceFormGroup(formItem: FormGroup, index: number) {
  }
  /** End Details Form */

  /** Outside References Form */
  makeNewLocationFormGroup(data?: ContactDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Type: ['HOME', Validators.required],
      Province: [''],
      District: [''],
      Ward: [],
      Address: [''],
      State: ['ACTIVE'],
    });

    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  getLocations(formItem: FormGroup) {
    return formItem.get('Locations') as FormArray;
  }
  addLocationFormGroup(formItem: FormGroup) {
    const newFormGroup = this.makeNewLocationFormGroup();
    this.getLocations(formItem).push(newFormGroup);
    this.onAddDetailFormGroup(formItem, this.getLocations(formItem).length - 1, newFormGroup);
    return false;
  }
  removeLocationGroup(parentForm: FormGroup, formItem: FormGroup, index: number) {
    this.getLocations(parentForm).removeAt(index);
    this.onRemoveLocationFormGroup(formItem, index);
    return false;
  }
  onAddLocationFormGroup(parentForm: FormGroup, index: number, newFormGroup: FormGroup) {
  }
  onRemoveLocationFormGroup(formItem: FormGroup, index: number) {
  }
  /** End Details Form */
}

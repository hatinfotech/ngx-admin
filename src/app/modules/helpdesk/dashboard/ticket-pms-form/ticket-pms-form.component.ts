import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogRef, NbToastrService, NbDialogService } from '@nebular/theme';
import { HelpdeskTicketModel } from '../../../../models/helpdesk.model';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ProductUnitConversoinModel } from '../../../../models/product.model';

@Component({
  selector: 'ngx-ticket-pms-form',
  templateUrl: './ticket-pms-form.component.html',
  styleUrls: ['./ticket-pms-form.component.scss'],
})
export class TicketPmsFormComponent extends DataManagerFormComponent<HelpdeskTicketModel> implements OnInit {

  componentName: string = 'TicketPmsFormComponent';
  idKey = 'Code';
  apiPath = '/helpdesk/tickets';
  baseFormUrl = '/helpdesk/ticket-pms/form';

  pmsList: {id?: string, text?: string, [key: string]: any}[] = [
    {
      id: 'ITHELPDESK',
      text: 'Hỗ trợ IT'
    },
    {
      id: 'SALESHELPDESK',
      text: 'Hỗ trợ bán hàng'
    },
    {
      id: 'ITCOORDINATORS',
      text: 'Điều phối IT'
    },
    {
      id: 'SALESCOORDINATORS',
      text: 'Điều phối bán hàng'
    },
    {
      id: 'CUSTOMER',
      text: 'Khách hàng'
    },
    {
      id: 'HELPDESKCREATOR',
      text: 'Người tạo yêu cầu'
    },
  ];

  @Input() inputResource: HelpdeskTicketModel;

  select2OptionForUser = {
    placeholder: 'Chọn người được chia sẻ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/user/users', { includeUnit: true, 'filter_Name': params['term'] });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
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

  select2OptionForGroup = {
    placeholder: 'Chọn nhóm được chia sẻ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/user/groups', { includeUnit: true, 'filter_Name': params['term'] });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Name'] + (item['Description'] ? (': ' + item['Description']) : '');
            return item;
          }),
        };
      },
    },
  };

  select2OptionForPms = {
    placeholder: this.commonService.translateText('Common.choosePms') + '...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  // pmsList: { id: string, text: string, [key: string]: any }[] = [
  //   {
  //     id: 'VIEW',
  //     text: this.commonService.translateText('Common.Pms.view'),
  //   },
  //   {
  //     id: 'EDIT',
  //     text: this.commonService.translateText('Common.Pms.edit'),
  //   },
  //   {
  //     id: 'MANAGE',
  //     text: this.commonService.translateText('Common.Pms.manage'),
  //   },
  // ];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref?: NbDialogRef<TicketPmsFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  async loadCache() { }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback([this.inputResource.Code]);
  }

  async init() {
    await this.loadCache();
    return super.init();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: HelpdeskTicketModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includePermissions'] = true;
    params['sort_Group'] = 'desc';
    params['sort_User'] = 'acc';
    super.executeGet(params, success, error);
  }

  async formLoad(formData: HelpdeskTicketModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: HelpdeskTicketModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Conditions form load
      if (itemFormData.Permissions) {
        itemFormData.Permissions.forEach(permission => {
          const newPermissionFormGroup = this.makeNewPermissionFormGroup(permission);
          this.getPermissions(newForm).push(newPermissionFormGroup);
          const comIndex = this.getPermissions(newForm).length - 1;
          this.onAddPermissionFormGroup(newForm, comIndex, newPermissionFormGroup);
        });
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: HelpdeskTicketModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Description: [{disabled: true, value: ''}],
      Permissions: this.formBuilder.array([]),
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: HelpdeskTicketModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }


  /** Permissions Form */
  makeNewPermissionFormGroup(data?: ProductUnitConversoinModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Group: [''],
      User: [''],
      Roles: [''],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  getPermissions(formItem: FormGroup) {
    return formItem.get('Permissions') as FormArray;
  }
  addPermissionFormGroup(formItem: FormGroup) {
    // this.componentList[formGroupIndex].push([]);
    const newFormGroup = this.makeNewPermissionFormGroup();
    this.getPermissions(formItem).push(newFormGroup);
    this.onAddPermissionFormGroup(formItem, this.getPermissions(formItem).length - 1, newFormGroup);
    return false;
  }
  removePermissionGroup(parentForm: FormGroup, formItem: FormGroup, index: number) {
    this.getPermissions(parentForm).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemovePermissionFormGroup(formItem, index);
    return false;
  }
  onAddPermissionFormGroup(parentForm: FormGroup, index: number, newFormGroup: FormGroup) {
    // this.componentList[mainIndex].push([]);
  }
  onRemovePermissionFormGroup(formItem: FormGroup, index: number) {
    // this.componentList[mainIndex].splice(index, 1);
  }
  /** End Permissions Form */

  // copyFormControlValueToOthers(array: FormArray, i: number, formControlName: string) {
  //   if (formControlName === 'Pictures') {
  //     const currentFormItem = array.controls[i];
  //     const currentValue = currentFormItem.get(formControlName).value;
  //     const featurePicture = currentFormItem.get('FeaturePicture').value;
  //     array.controls.forEach((formItem, index) => {
  //       if (index !== i) {
  //         const picturesFormArray = (formItem.get('Pictures') as FormArray);
  //         picturesFormArray.controls = [];
  //         currentValue.forEach(pic => {
  //           const newPictireForm = this.makeNewPictureFormGroup(pic);
  //           picturesFormArray.controls.push(newPictireForm);
  //         });
  //         formItem.get('FeaturePicture').patchValue(featurePicture);
  //       }
  //     });
  //   } else {
  //     super.copyFormControlValueToOthers(array, i, formControlName);
  //   }
  // }
}

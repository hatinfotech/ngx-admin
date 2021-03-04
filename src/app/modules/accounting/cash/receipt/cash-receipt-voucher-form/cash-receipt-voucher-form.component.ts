import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { DataManagerFormComponent } from '../../../../../lib/data-manager/data-manager-form.component';
import { CashVoucherDetailModel, CashVoucherModel } from '../../../../../models/accounting.model';
import { UserGroupModel } from '../../../../../models/user-group.model';
import { UserModel } from '../../../../../models/user.model';
import { ApiService } from '../../../../../services/api.service';
import { CommonService } from '../../../../../services/common.service';
import { UserGroupFormComponent } from '../../../../users/user-group/user-group-form/user-group-form.component';

@Component({
  selector: 'ngx-cash-receipt-voucher-form',
  templateUrl: './cash-receipt-voucher-form.component.html',
  styleUrls: ['./cash-receipt-voucher-form.component.scss']
})
export class CashReceiptVoucherFormComponent extends DataManagerFormComponent<CashVoucherModel> implements OnInit {

  componentName = 'CashReceiptVoucherFormComponent';
  idKey = 'Code';
  apiPath = '/accounting/cash-vouchers';
  baseFormUrl = '/accouting/cash-receipt-voucher/form';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<CashReceiptVoucherFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  // getRequestId(callback: (id?: string[]) => void) {
  //   if (this.mode === 'page') {
  //     super.getRequestId(callback);
  //   } else {
  //     callback(this.inputId);
  //   }
  // }

  userList: UserModel[];
  select2OptionForContacts = {
    placeholder: 'Chọn liên hệ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: false,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    // ajax: {
    //   url: params => {
    //     return this.apiService.buildApiUrl('/contact/contacts', { select: 'Code=>Code,Name=>Name,id=>Code,text=>Code', filter_Name: params['term'] ? params['term'] : '' });
    //   },
    //   delay: 300,
    //   processResults: (data: any, params: any) => {
    //     // console.info(data, params);
    //     return {
    //       results: data.map(item => {
    //         item['id'] = item['Code'];
    //         item['text'] = item['Name'];
    //         return item;
    //       }),
    //     };
    //   },
    // },
  };

  parentList: UserGroupModel[];
  select2OptionForParent = {
    placeholder: 'Chọn liên hệ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    tags: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/contact/contacts', { filter_Name: params['term'] });
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

  roles: { id: string, text: string }[] = [
    {
      id: 'MANAGER',
      text: 'Manager',
    },
    {
      id: 'MEMBER',
      text: 'Member',
    },
  ];
  select2OptionForRoles = {
    placeholder: 'Chọn nhóm vai trò...',
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


  // resourceList: ResourceModel[][][] = [];
  // select2OptionForResource = {
  //   placeholder: 'Chọn Resource...',
  //   allowClear: true,
  //   width: '100%',
  //   dropdownAutoWidth: true,
  //   minimumInputLength: 0,
  //   keyMap: {
  //     id: 'Name',
  //     text: 'Description',
  //   },
  // };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
    // this.apiService.get<UserGroupModel[]>(
    //   '/user/groups', { limit: 99999 },
    //   list1 => {
    //     list1.unshift({
    //       Code: '',
    //       Description: 'Chọn nhóm cha...',
    //     });
    //     this.parentList = list1.map(item => {
    //       item['id'] = item['Code'];
    //       item['text'] = item['Name'] + ': ' + item['Description'];
    //       return item;
    //     });

    //     this.apiService.get<UserModel[]>('/user/users', { limit: 9999999, isMulti: true, select: 'Code,Name' },
    //       list => {
    //         this.userList = list.filter((item: UserModel) => {
    //           if (item['Code'] && item['Name']) {
    //             // item['User'] = item['Code'];
    //             item['id'] = item['Code'];
    //             item['text'] = item['Name'];
    //             return true;
    //           }
    //           return false;
    //         });
    //         super.ngOnInit();
    //       });

    //   });


  }

  async formLoad(formData: CashVoucherModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: CashVoucherModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Resources form load
      if (itemFormData.Details) {
        itemFormData.Details.forEach(user => {
          const newResourceFormGroup = this.makeNewDetailFormGroup(user);
          this.getDetails(index).push(newResourceFormGroup);
          const comIndex = this.getDetails(index).length - 1;
          this.onAddDetailFormGroup(index, comIndex, newResourceFormGroup);

          // module['Users'].map(item => {
          //   item['id'] = item['Name'];
          //   item['text'] = item['Description'] ? item['Description'] : item['Name'];
          //   return item;
          // });

          // const module = this.moduleList.find((value, i, obj) => {
          //   return resource['Module'] === value['Name'];
          // });
          // if (module && module['Resources']) {
          //   this.resourceList[index][comIndex] = module['Resources'].map(item => {
          //     item['id'] = item['Name'];
          //     item['text'] = item['Description'] ? item['Description'] : item['Name'];
          //     return item;
          //   });

          //   const resourceChooseList = module['Resources'].find((value, i, obj) => {
          //     return value.Name === resource['Resource'];
          //   });
          //   newResourceFormGroup.get('Resource').patchValue(resource['Resource']);


          // }

        });
      }


      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  async init() {
    return super.init().then(rs => {
      this.getRequestId(id => {
        if (!id || id.length === 0) {
          this.addDetailFormGroup(0);
        }
      });
      return rs;
    });
  }

  /** Get form data by id from api */
  getFormData(callback: (data: CashVoucherModel[]) => void) {
    this.apiService.get<CashVoucherModel[]>(this.apiPath, { id: this.id, multi: true, includeUsersInGroup: true },
      data => callback(data),
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  makeNewFormGroup(data?: CashVoucherModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: ['', Validators.required],
      Description: ['', Validators.required],
      RelatedUserName: [''],
      DateOfImplement: [''],
      Object: [''],
      ObjectName: [''],
      ObjectPhone: [''],
      ObjectEmail: [''],
      ObjectAddress: [''],
      ObjectTaxCode: [''],
      Currency: [''],
      RelationVoucher: [''],
      Details: this.formBuilder.array([]),
    });
    if (data) {
      data[this.idKey + '_old'] = data.Code;
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: CashVoucherModel): void {
    super.onAddFormGroup(index, newForm, formData);
    // this.resourceList.push([]);
  }
  onRemoveFormGroup(index: number): void {
    // this.resourceList.splice(index, 1);
  }
  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/accounting/cash-receipt-voucher/list']);
    } else {
      this.ref.close();
      // this.onDialogClose();
      // this.dismiss();
    }
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Execute api get */
  executeGet(params: any, success: (resources: CashVoucherModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsersInGroup'] = true;
    return super.executeGet(params, success, error);
  }

  makeNewDetailFormGroup(data?: CashVoucherDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      AccountingBusiness: [''],
      Description: ['', Validators.required],
      RelateCode: [''],
      Amount: ['', Validators.required],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      newForm.patchValue(data);
    }
    return newForm;
  }

  getDetails(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Details') as FormArray;
  }

  addDetailFormGroup(formGroupIndex: number) {
    // this.resourceList[formGroupIndex].push([]);
    const newFormGroup = this.makeNewDetailFormGroup();
    this.getDetails(formGroupIndex).push(newFormGroup);
    this.onAddDetailFormGroup(formGroupIndex, this.getDetails(formGroupIndex).length - 1, newFormGroup);
    return false;
  }

  onAddDetailFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
    // this.resourceList[mainIndex].push([]);
  }

  removeDetail(formGroupIndex: number, index: number) {
    this.getDetails(formGroupIndex).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemoveDetailFormGroup(formGroupIndex, index);
    return false;
  }

  onRemoveDetailFormGroup(mainIndex: number, index: number) {
    // this.resourceList[mainIndex].splice(index, 1);
  }



  copyResourceFormControlValueToOthers(i: number, ic: number, formControlName: string) {
    const currentFormControl = this.getDetails(i).controls[ic].get(formControlName);
    this.getDetails(i).controls.forEach((formItem, index) => {
      if (index !== i) {
        formItem.get(formControlName).patchValue(currentFormControl.value);
      }
    });
  }

  onModuleChangeForResource(event: { Resources: any[] }, i: number, ir: number) {
    // console.info(event);
    if (event.Resources) {
      event.Resources.unshift({
        Name: '',
        Description: 'Chọn resource',
      });
      // this.resourceList[i][ir] = event.Resources.map(item => {
      //   item['id'] = item['Name'];
      //   item['text'] = item['Description'] ? item['Description'] : item['Name'];
      //   return item;
      // });
    }
  }

  getResourceChooseList(mainFormIndex: number, resourceIndex: number) {
    // if (this.resourceList && this.resourceList[mainFormIndex] && this.resourceList[mainFormIndex][resourceIndex]) {
    //   return this.resourceList[mainFormIndex][resourceIndex];
    // }
    return [];
  }









}

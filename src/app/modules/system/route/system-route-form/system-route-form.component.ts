import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { SystemRouteModel, SystemParamModel, SystemActionModel, SystemRouteConditionModel, SystemRouteActionModel, SystemActionParamModel, SystemRouteActionParameterModel } from '../../../../models/system.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-system-route-form',
  templateUrl: './system-route-form.component.html',
  styleUrls: ['./system-route-form.component.scss'],
})
export class SystemRouteFormComponent extends DataManagerFormComponent<SystemRouteModel> implements OnInit {

  componentName: string = 'SystemRouteFormComponent';
  idKey = 'Code';
  apiPath = '/system/routes';
  baseFormUrl = '/system/route/form';

  select2OptionForProduct = {
    placeholder: 'Chọn sản phẩm...',
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
        return this.apiService.buildApiUrl('/admin-product/products', { 'filter_Name': params['term'] });
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

  select2OptionForRemoteDataSource = {
    placeholder: 'Chọn nhóm sản phẩm...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'ProductGroup',
      text: 'ProductGroupName',
    },
    multiple: true,
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/admin-product/categories', { 'filter_Name': params['term'], select: 'ProductGroup=>Code,ProductGroupName=>Name' });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['ProductGroup'];
            item['text'] = item['ProductGroupName'];
            return item;
          }),
        };
      },
    },
  };

  select2OptionForParam = {
    placeholder: this.commonService.translateText('Common.param'),
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: true,
    keyMap: {
      id: 'Name',
      text: 'Description',
    },
  };

  select2OptionForOperator = {
    placeholder: this.commonService.translateText('Common.param'),
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: false,
    minimumInputLength: 0,
    tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  operatorList = [
    { id: 'EQ', text: '=' },
    { id: 'LT', text: '<' },
    { id: 'LE', text: '<=' },
    { id: 'GT', text: '>' },
    { id: 'GE', text: '=>' },
    { id: 'NE', text: '!=' },
    { id: 'IN', text: 'IN' },
  ];

  getSlect2ForConditionData(param: SystemParamModel) {
    const option = {
      placeholder: this.commonService.translateText('Common.param'),
      allowClear: true,
      width: '100%',
      dropdownAutoWidth: true,
      minimumInputLength: 0,
      tags: true,
      multiple: param.DefaultDataType === 'OBJECTS',
      keyMap: {
        id: 'id',
        text: 'text',
      },
    };

    if (param.RemoteDataSource) {
      option['ajax'] = {
        url: params => {
          return this.apiService.buildApiUrl(param.RemoteDataSource, { 'search': params['term'], includeIdText: true });
        },
        delay: 300,
        processResults: (data: any, params: any) => {
          // console.info(data, params);
          return { results: data };
        },
      };
    }
    return option;
  }

  getSelect2DataListForConditionData(param: SystemParamModel) {
    if (!param.RemoteDataSource && param.Options) {
      return param.Options.map(item => ({ ...item, id: item.Data, text: item.Label }));
    }
    return null;
  }

  paramList: SystemParamModel[];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<SystemRouteFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  async init() {
    this.paramList = (await this.apiService.getPromise<SystemParamModel[]>('/system/params', { includeOptions: true })).map(item => ({ ...item, id: item.Name, text: item.Description }));
    this.actionList = (await this.apiService.getPromise<SystemActionModel[]>('/system/actions', { includeParams: true })).map(item => ({ ...item, id: item.Name, text: item.Description, Params: item.Params.map(param => ({ ...param, id: param.Name, text: param.Description })) }));
    return super.init().then(status => {
      if (this.isDuplicate) {
        this.id = [];
        this.array.controls.forEach((formItem, index) => {
          formItem.get('Code').setValue('');
          this.getConditions(index).controls.forEach(conditonFormGroup => {
            conditonFormGroup.get('Id').setValue('');
          });
          this.getActions(index).controls.forEach(actionFormGroup => {
            actionFormGroup.get('Id').setValue('');
            this.getActionParameters(actionFormGroup as FormGroup).controls.forEach(parameter => {
              parameter.get('Id').setValue('');
            });
          });
        });
        //   const inputSystemRoute = { ...this.inputSystemRoute };
        //   inputSystemRoute.Conditions = { ...inputSystemRoute.Conditions };
        //   inputSystemRoute.Actions = { ...inputSystemRoute.Actions };
        //   inputSystemRoute.Conditions.forEach(condition => {
        //     condition.Id = null;
        //     condition.Route = null;
        //   });
        //   inputSystemRoute.Actions.forEach(action => {
        //     action.Parameters = { ...action.Parameters };
        //     action.Parameters.forEach(parameter => {
        //       parameter.Route = null;
        //       parameter.Action = null;
        //     });
        //     action.Id = null;
        //     action.Route = null;
        //   });

        //   this.array.controls[0].patchValue(inputSystemRoute);
        //   this.onAddFormGroup(this.array.length - 1, this.array.controls[0] as FormGroup, inputSystemRoute);
      }
      return status;
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: SystemRouteModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeConditions'] = true;
    params['includeActions'] = true;
    params['forNgPickDateTime'] = true;
    // params['includeProductGroups'] = true;
    super.executeGet(params, success, error);
  }

  /** Execute api put */
  // executePut(params: any, data: SystemRouteModel[], success: (data: SystemRouteModel[]) => void, error: (e: any) => void) {
  //   super.executePut(params, data, success, error);
  // }

  // /** Execute api post */
  // executePost(params: any, data: SystemRouteModel[], success: (data: SystemRouteModel[]) => void, error: (e: any) => void) {
  //   super.executePost(params, data, success, error);
  // }

  async formLoad(formData: SystemRouteModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: SystemRouteModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Conditions form load
      if (itemFormData.Conditions) {
        for (let c = 0; c < itemFormData.Conditions.length; c++) {
          const condition = itemFormData.Conditions[c];
          // itemFormData.Conditions.forEach(condition => {
          const newConditionFormGroup = this.makeNewConditionFormGroup(condition);
          this.getConditions(index).push(newConditionFormGroup);
          const comIndex = this.getConditions(index).length - 1;
          this.onAddConditionFormGroup(index, comIndex, newConditionFormGroup);
          // });
        }
      }

      // Actions form load
      if (itemFormData.Actions) {
        for (let i = 0; i < itemFormData.Actions.length; i++) {
          const action = itemFormData.Actions[i];
          // itemFormData.Actions.forEach((action, actionIndex) => {
          // action['Parameters'] = [{}];
          const newActionFormGroup = this.makeNewActionFormGroup(action);
          this.getActions(index).push(newActionFormGroup);
          const comIndex = this.getActions(index).length - 1;
          this.onAddActionFormGroup(index, comIndex, newActionFormGroup);


          if (action.Parameters) {
            for (let p = 0; p < action.Parameters.length; p++) {
              const parameter = action.Parameters[p];
              // action.Parameters.forEach((parameter, parameterIndex) => {
              const newActionParameterFormGroup = this.makeNewActionParameterFormGroup(parameter);
              this.getActionParameters(newActionFormGroup, p).push(newActionParameterFormGroup);
              const comIndex2 = this.getActionParameters(newActionFormGroup, p).length - 1;
              this.onAddActionParameterFormGroup(index, comIndex2, newActionParameterFormGroup);
              // });
            }
          }
          // });
        }
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }

      // return;
    });
  }

  makeNewFormGroup(data?: SystemRouteModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [{ disabled: true, value: '' }],
      Type: [{ disabled: true, value: '' }, Validators.required],
      State: [{ disabled: true, value: '' }],
      Enable: [true],
      RouteIndex: [''],
      Name: ['', Validators.required],
      Description: ['', Validators.required],
      Priority: ['999'],
      Conditions: this.formBuilder.array([]),
      Actions: this.formBuilder.array([]),
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: SystemRouteModel): void {
    super.onAddFormGroup(index, newForm, formData);
    // Conditions form load
    // if (formData.Conditions) {
    //   formData.Conditions.forEach(condition => {
    //     const newConditionFormGroup = this.makeNewConditionFormGroup(condition);
    //     this.getConditions(index).push(newConditionFormGroup);
    //     const comIndex = this.getConditions(index).length - 1;
    //     this.onAddConditionFormGroup(index, comIndex, newConditionFormGroup);
    //   });
    // }

    // // Actions form load
    // if (formData.Actions) {
    //   formData.Actions.forEach((action, actionIndex) => {
    //     // action['Parameters'] = [{}];
    //     const newActionFormGroup = this.makeNewActionFormGroup(action);
    //     this.getActions(index).push(newActionFormGroup);
    //     const comIndex = this.getActions(index).length - 1;
    //     this.onAddActionFormGroup(index, comIndex, newActionFormGroup);


    //     if (action.Parameters) {
    //       action.Parameters.forEach((parameter, parameterIndex) => {
    //         const newActionParameterFormGroup = this.makeNewActionParameterFormGroup(parameter);
    //         this.getActionParameters(newActionFormGroup, actionIndex).push(newActionParameterFormGroup);
    //         const comIndex2 = this.getActionParameters(newActionFormGroup, actionIndex).length - 1;
    //         this.onAddActionParameterFormGroup(index, comIndex2, newActionParameterFormGroup);
    //       });
    //     }
    //   });
    // }

    // Direct callback
    // if (formItemLoadCallback) {
    //   formItemLoadCallback(index, newForm, itemFormData);
    // }
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/promotion/promotion/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Condition Form */
  makeNewConditionFormGroup(data?: SystemRouteConditionModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Type: ['INTEGER', Validators.required],
      Cond: ['', Validators.required],
      Operator: ['EQ', Validators.required],
      Data: [''],
      // BreakOnFalse: [''],
    });

    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  getConditions(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Conditions') as FormArray;
  }
  addConditionFormGroup(formGroupIndex: number) {
    // this.componentList[formGroupIndex].push([]);
    const newFormGroup = this.makeNewConditionFormGroup();
    this.getConditions(formGroupIndex).push(newFormGroup);
    this.onAddConditionFormGroup(formGroupIndex, this.getConditions(formGroupIndex).length - 1, newFormGroup);
    return false;
  }
  removeConditionGroup(formGroupIndex: number, index: number) {
    this.getConditions(formGroupIndex).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemoveConditionFormGroup(formGroupIndex, index);
    return false;
  }
  onAddConditionFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
    // this.componentList[mainIndex].push([]);
  }
  onRemoveConditionFormGroup(mainIndex: number, index: number) {
    // this.componentList[mainIndex].splice(index, 1);
  }
  /** End Condition Form */

  /** Action Form */
  actionList: SystemActionModel[];
  select2OptionForAction = {
    placeholder: this.commonService.translateText('Common.param'),
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Name',
      text: 'Description',
    },
  };

  makeNewActionFormGroup(data?: SystemRouteActionModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Type: [''],
      Action: [''],
      // Parameters: [''],
      BreakOnFail: [true],
      Parameters: this.formBuilder.array([]),
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  getActions(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Actions') as FormArray;
  }
  addActionFormGroup(formGroupIndex: number) {
    // this.componentList[formGroupIndex].push([]);
    const newFormGroup = this.makeNewActionFormGroup();
    this.getActions(formGroupIndex).push(newFormGroup);
    this.onAddActionFormGroup(formGroupIndex, this.getActions(formGroupIndex).length - 1, newFormGroup);
    return false;
  }
  removeActionGroup(formGroupIndex: number, index: number) {
    this.getActions(formGroupIndex).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemoveActionFormGroup(formGroupIndex, index);
    return false;
  }
  onAddActionFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
    // this.componentList[mainIndex].push([]);
  }
  onRemoveActionFormGroup(mainIndex: number, index: number) {
    // this.componentList[mainIndex].splice(index, 1);
  }
  /** End Action Form */


  /** Action Parameter Form */
  actionParamList: SystemActionParamModel[];
  actionParamOption = [
    {
      id: 'salesrequest',
      text: 'Tương tác bán hàng',
    },
    {
      id: 'supportrequest',
      text: 'Tương tác hỗ trợ',
    },
    {
      id: 'new',
      text: 'New',
    },
  ];
  makeNewActionParameterFormGroup(data?: SystemRouteActionParameterModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Parameter: [''],
      Data: [''],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      // if(data.Data === null) {
      //   data.Data = ' ';
      // }
      newForm.patchValue(data);
    }
    return newForm;
  }
  getActionParameters(parentFormGroup: FormGroup, formGroupIndex?: number) {
    return parentFormGroup.get('Parameters') as FormArray;
  }
  addActionParameterFormGroup(parentFormGroup: FormGroup, formGroupIndex: number) {
    // this.componentList[formGroupIndex].push([]);
    const newFormGroup = this.makeNewActionParameterFormGroup();
    this.getActionParameters(parentFormGroup, formGroupIndex).push(newFormGroup);
    this.onAddActionParameterFormGroup(formGroupIndex, this.getActions(formGroupIndex).length - 1, newFormGroup);
    // const dataField = newFormGroup.get('Data');
    // // if(dataField.value === null) {
    //   dataField.patchValue('123');
    // // }
    return false;
  }
  removeActionParameterGroup(parentFormGroup: FormGroup, formGroupIndex: number, index: number) {
    this.getActionParameters(parentFormGroup, formGroupIndex).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemoveActionParameterFormGroup(formGroupIndex, index);
    return false;
  }
  onAddActionParameterFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
    // this.componentList[mainIndex].push([]);
    // const dataField = newFormGroup.get('Data');
    // if(dataField.value === null) {
    //   dataField.patchValue('XXXXXX');
    //   setTimeout(() => {
    //     dataField.patchValue('');
    //   }, 3000);
    // }
  }
  onRemoveActionParameterFormGroup(mainIndex: number, index: number) {
    // this.componentList[mainIndex].splice(index, 1);
  }

  getSlect2ForActionParameterData(param: SystemActionParamModel) {
    const option = {
      placeholder: this.commonService.translateText('Common.param'),
      allowClear: true,
      width: '100%',
      dropdownAutoWidth: true,
      minimumInputLength: 0,
      tags: true,
      multiple: param.Type === 'OBJECTS',
      keyMap: {
        id: 'id',
        text: 'text',
      },
    };

    if (param.RemoteDataSource) {
      option['ajax'] = {
        url: params => {
          return this.apiService.buildApiUrl(param.RemoteDataSource, { 'search': params['term'], includeIdText: true });
        },
        delay: 500,
        processResults: (data: any, params: any) => {
          // console.info(data, params);
          return { results: data };
        },
      };
    }
    return option;
  }

  getSelect2DataListForActionParamaterData(param: SystemActionParamModel) {
    if (!param.RemoteDataSource && param.Options) {
      return param.Options.map(item => ({ ...item, id: item.Data, text: item.Label }));
    }
    return null;
  }
  /** End Action Parameter Form */

  getRawFormData() {
    const data = super.getRawFormData();
    console.log(data);
    return data;
  }

  onDateTimeChange(event: { value: Date[] }, field: FormControl) {
    field.setValue(event.value.map(dt => dt.toISOString()).join(' ~ '));
  }

}

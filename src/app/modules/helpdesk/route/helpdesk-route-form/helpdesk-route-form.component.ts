import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { HelpdeskRouteModel, HelpdeskRouteConditionModel, HelpdeskRouteActionModel, HelpdeskParamModel, HelpdeskActionParamModel, HelpdeskActionModel } from '../../../../models/helpdesk.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-helpdesk-route-form',
  templateUrl: './helpdesk-route-form.component.html',
  styleUrls: ['./helpdesk-route-form.component.scss'],
})
export class HelpdeskRouteFormComponent extends DataManagerFormComponent<HelpdeskRouteModel> implements OnInit {

  componentName: string = 'HelpdeskRouteFormComponent';
  idKey = 'Code';
  apiPath = '/helpdesk/routes';
  baseFormUrl = '/helpdesk/route/form';

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
      // url: params => {
      //   return this.apiService.buildApiUrl('/admin-product/products', { 'filter_Name': params['term'] });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/admin-product/products', { 'filter_Name': params['term'] }).then(rs => {
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
      // url: params => {
      //   return this.apiService.buildApiUrl('/admin-product/categories', { 'filter_Name': params['term'], select: 'ProductGroup=>Code,ProductGroupName=>Name' });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/admin-product/categories', { 'filter_Name': params['term'], select: 'ProductGroup=>Code,ProductGroupName=>Name' }).then(rs => {
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
            item['id'] = item['ProductGroup'];
            item['text'] = item['ProductGroupName'];
            return item;
          }),
        };
      },
    },
  };

  select2OptionForParam = {
    placeholder: this.cms.translateText('Common.param'),
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Name',
      text: 'Description',
    },
  };

  getSlect2ForConditionData(param: HelpdeskParamModel) {
    const option = {
      placeholder: this.cms.translateText('Common.param'),
      allowClear: true,
      width: '100%',
      dropdownAutoWidth: true,
      minimumInputLength: 0,
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

  getSelect2DataListForConditionData(param: HelpdeskParamModel) {
    if (!param.RemoteDataSource && param.Options) {
      return param.Options.map(item => ({ ...item, id: item.Data, text: item.Label }));
    }
    return null;
  }

  paramList: HelpdeskParamModel[];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<HelpdeskRouteFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);
  }

  async init() {
    this.paramList = (await this.apiService.getPromise<HelpdeskParamModel[]>('/helpdesk/params', { includeOptions: true })).map(item => ({ ...item, id: item.Name, text: item.Description }));
    this.actionList = (await this.apiService.getPromise<HelpdeskActionModel[]>('/helpdesk/actions', { includeParams: true })).map(item => ({ ...item, id: item.Name, text: item.Description, Params: item.Params.map(param => ({ ...param, id: param.Name, text: param.Description })) }));
    return super.init();
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: HelpdeskRouteModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeConditions'] = true;
    params['includeActions'] = true;
    params['forNgPickDateTime'] = true;
    // params['includeProductGroups'] = true;
    super.executeGet(params, success, error);
  }

  /** Execute api put */
  // executePut(params: any, data: HelpdeskRouteModel[], success: (data: HelpdeskRouteModel[]) => void, error: (e: any) => void) {
  //   super.executePut(params, data, success, error);
  // }

  // /** Execute api post */
  // executePost(params: any, data: HelpdeskRouteModel[], success: (data: HelpdeskRouteModel[]) => void, error: (e: any) => void) {
  //   super.executePost(params, data, success, error);
  // }

  async formLoad(formData: HelpdeskRouteModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: HelpdeskRouteModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Conditions form load
      if (itemFormData.Conditions) {
        const children = this.getConditions(index);
        children.clear();
        itemFormData.Conditions.forEach(condition => {
          const newConditionFormGroup = this.makeNewConditionFormGroup(condition);
          children.push(newConditionFormGroup);
          const comIndex = children.length - 1;
          this.onAddConditionFormGroup(index, comIndex, newConditionFormGroup);
        });
      }

      // Actions form load
      if (itemFormData.Actions) {
        itemFormData.Actions.forEach((action, actionIndex) => {
          // action['Parameters'] = [{}];
          const newActionFormGroup = this.makeNewActionFormGroup(action);
          this.getActions(index).push(newActionFormGroup);
          const comIndex = this.getActions(index).length - 1;
          this.onAddActionFormGroup(index, comIndex, newActionFormGroup);


          if (action.Parameters) {
            action.Parameters.forEach((parameter, parameterIndex) => {
              const newActionParameterFormGroup = this.makeNewActionParameterFormGroup(parameter);
              this.getActionParameters(newActionFormGroup, actionIndex).push(newActionParameterFormGroup);
              const comIndex2 = this.getActionParameters(newActionFormGroup, actionIndex).length - 1;
              this.onAddActionParameterFormGroup(index, comIndex2, newActionParameterFormGroup);
            });
          }
        });
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: HelpdeskRouteModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [{ disabled: true, value: '' }],
      Type: [{ disabled: true, value: '' }, Validators.required],
      State: [{ disabled: true, value: '' }],
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
  onAddFormGroup(index: number, newForm: FormGroup, formData?: HelpdeskRouteModel): void {
    super.onAddFormGroup(index, newForm, formData);
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
  makeNewConditionFormGroup(data?: HelpdeskRouteConditionModel): FormGroup {
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
  actionList: HelpdeskActionModel[];
  select2OptionForAction = {
    placeholder: this.cms.translateText('Common.param'),
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Name',
      text: 'Description',
    },
  };

  makeNewActionFormGroup(data?: HelpdeskRouteActionModel): FormGroup {
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
  actionParamList: HelpdeskActionParamModel[];
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
  makeNewActionParameterFormGroup(data?: HelpdeskRouteActionModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Parameter: [''],
      Data: [''],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  getActionParameters(parentFormGroup: FormGroup, formGroupIndex: number) {
    return parentFormGroup.get('Parameters') as FormArray;
  }
  addActionParameterFormGroup(parentFormGroup: FormGroup, formGroupIndex: number) {
    // this.componentList[formGroupIndex].push([]);
    const newFormGroup = this.makeNewActionParameterFormGroup();
    this.getActionParameters(parentFormGroup, formGroupIndex).push(newFormGroup);
    this.onAddActionParameterFormGroup(formGroupIndex, this.getActions(formGroupIndex).length - 1, newFormGroup);
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
  }
  onRemoveActionParameterFormGroup(mainIndex: number, index: number) {
    // this.componentList[mainIndex].splice(index, 1);
  }

  getSlect2ForActionParameterData(param: HelpdeskActionParamModel) {
    const option = {
      placeholder: this.cms.translateText('Common.param'),
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
        delay: 300,
        processResults: (data: any, params: any) => {
          // console.info(data, params);
          return { results: data };
        },
      };
    }
    return option;
  }

  getSelect2DataListForActionParamaterData(param: HelpdeskActionParamModel) {
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

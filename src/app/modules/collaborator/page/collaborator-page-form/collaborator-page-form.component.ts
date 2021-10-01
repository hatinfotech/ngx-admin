import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ContactDetailModel } from '../../../../models/contact.model';
import { PageModel } from '../../../../models/page.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'ngx-collaborator-page-form',
  templateUrl: './collaborator-page-form.component.html',
  styleUrls: ['./collaborator-page-form.component.scss']
})
export class CollaboratorPageFormComponent extends DataManagerFormComponent<PageModel> implements OnInit {

  componentName: string = 'CollaboratorPageFormComponent';
  idKey = 'Code';
  baseFormUrl = '/collaborator/page/form';
  apiPath = '/collaborator/pages';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<CollaboratorPageFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  select2SalesPriceReportOption = {
    placeholder: 'Chọn bảng giá...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    // tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/sales/master-price-tables', { onlyIdText: true, filter_Title: params['term'] ? params['term'] : '', limit: 20 });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data,
        };
      },
    },
  };

  select2ContactOption = {
    placeholder: 'Chọn liên hệ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    // tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/contact/contacts', { includeIdText: true, filter_Name: params['term'] ? params['term'] : '' });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        return { results: data };
      },
    },
  };

  cycleList: { id: string, text: string }[] = [
    {
      id: 'MONTHLY',
      text: this.commonService.translateText('Common.monthly'),
    },
    {
      id: 'YEARLY',
      text: this.commonService.translateText('Common.yearly'),
    },
  ];
  select2CycleOption = {
    placeholder: this.commonService.translateText('Common.cycle') + '...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    // tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  select2OptionForWeekend = {
    placeholder: this.commonService.translateText('Common.dayOfWeek') + '...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    // tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    data: [
      {
        id: '0',
        text: 'Thứ hai'
      },
      {
        id: '1',
        text: 'Thứ ba'
      },
      {
        id: '2',
        text: 'Thứ tư'
      },
      {
        id: '3',
        text: 'Thứ năm'
      },
      {
        id: '4',
        text: 'Thứ sáu'
      },
      {
        id: '5',
        text: 'Thứ bảy'
      },
      {
        id: '6',
        text: 'Chủ nhật'
      },
    ]
  };

  endOfYearInputMask = {
    alias: 'datetime',
    inputFormat: 'dd/mm',
    // parser: (value: string) => {
    //   const values = value.split('/');
    //   const year = +values[2];
    //   const month = +values[1] - 1;
    //   const date = +values[0];
    //   return new Date(year, month, date);
    // },
  };
  endOfMonthInputMask = {
    alias: 'datetime',
    inputFormat: 'dd',
    // parser: (value: string) => {
    //   const values = value.split('/');
    //   const year = +values[2];
    //   const month = +values[1] - 1;
    //   const date = +values[0];
    //   return new Date(year, month, date);
    // },
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
    // if (this.inputId) {
    //   this.mode = 'dialog';
    // }
  }

  async init(): Promise<boolean> {
    return super.init().then(status => {
      if (this.isDuplicate) {
        // Clear id
        this.id = [];
        this.array.controls.forEach((formItem, index) => {
          formItem.get('Code').setValue('');
          this.getDetails(formItem as FormGroup).controls.forEach(conditonFormGroup => {
            // Clear id
            conditonFormGroup.get('Id').setValue('');
          });
        });
      }
      return status;
    });
  }

  async formLoad(formData: PageModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: PageModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // if (itemFormData.Details) {
      //   itemFormData.Details.forEach(detail => {
      //     const newUnitConversionFormGroup = this.makeNewDetailFormGroup(detail);
      //     this.getDetails(newForm).push(newUnitConversionFormGroup);
      //     const comIndex = this.getDetails(newForm).length - 1;
      //     this.onAddDetailFormGroup(newForm, comIndex, newUnitConversionFormGroup);
      //   });
      // }

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
  executeGet(params: any, success: (resources: PageModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeOrganizations'] = true;
    params['includeGroups'] = true;
    params['includeDetails'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: PageModel): FormGroup {
    const curentUrl = new URL(window.location.href); curentUrl.origin
    const newForm = this.formBuilder.group({
      Code: [''],
      Name: ['', Validators.required],
      TagName: ['', Validators.required],
      Summary: ['', Validators.required],
      Description: ['', Validators.required],
      EventUrl: [''],
      PlatformApiUrl: [''],
      PlatformApiToken: [''],
      PriceTable: [''],
      Logo: [''],
      Banner: [''],
      Weekend: ['6', Validators.required],
      EndOfTheMonth: ['28', Validators.required],
      EndOfTheQuarter: ['28', Validators.required],
      EndOfTheYear: ['24/12', Validators.required],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: PageModel): void {
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

  onAfterCreateSubmit(newFormData: PageModel[]) {
    super.onAfterCreateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }
  onAfterUpdateSubmit(newFormData: PageModel[]) {
    return super.onAfterUpdateSubmit(newFormData);
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
}

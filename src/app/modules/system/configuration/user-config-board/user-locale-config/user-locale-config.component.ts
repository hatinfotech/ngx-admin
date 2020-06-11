import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../../lib/data-manager/data-manager-form.component';
import { LocaleConfigModel } from '../../../../../models/system.model';
import { env } from 'process';
import { environment } from '../../../../../../environments/environment';
import { TaxModel } from '../../../../../models/tax.model';
import { UnitModel } from '../../../../../models/unit.model';
import { constructor } from 'wpapi';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../../services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { Timezone } from '../../system-configuration-board/system-locale-config/system-locale-config.component';
import { HttpErrorResponse } from '@angular/common/http';
import * as timezones from '../../../../../../assets/timezones.json';

@Component({
  selector: 'ngx-user-locale-config',
  templateUrl: './user-locale-config.component.html',
  styleUrls: ['./user-locale-config.component.scss'],
})
export class UserLocaleConfigComponent extends DataManagerFormComponent<LocaleConfigModel> implements OnInit {

  componentName: string = 'UserLocaleConfigComponent';
  idKey = 'Code';
  apiPath = '/system/user-locales';
  baseFormUrl = '/system/user-locale/form';

  env = environment;
  tz: { id: string, text: string, children: { id: string, text: string }[] }[];

  /** Tax list */
  static _taxList: (TaxModel & { id?: string, text?: string })[];
  taxList: (TaxModel & { id?: string, text?: string })[];

  /** Unit list */
  static _unitList: (UnitModel & { id?: string, text?: string })[];
  unitList: (UnitModel & { id?: string, text?: string })[];

  select2OptionTimezone = {
    placeholder: this.translate.instant('Common.selectTimezone'),
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
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
    public translate: TranslateService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
    this.tz = (timezones as any).default.map((timezon: Timezone) => {
      return {
        id: timezon.value,
        text: timezon.text,
        children: timezon.utc.map(utc => {
          return {
            id: utc,
            text: utc,
          };
        }),
      };
    });
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(['CURRENT']);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init(): Promise<boolean> {
    return super.init();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: LocaleConfigModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeConditions'] = true;
    // params['includeProduct'] = true;
    // params['includeContact'] = true;
    // params['includeDetails'] = true;
    // params['useBaseTimezone'] = true;
    super.executeGet(params, success, error);
  }

  formLoad(formData: LocaleConfigModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: LocaleConfigModel) => void) {
    super.formLoad(formData, (index, newForm, itemFormData) => {

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: LocaleConfigModel): FormGroup {
    const newForm = this.formBuilder.group({
      _index: [''],
      Locale: ['', Validators.required],
      Timezone: ['', Validators.required],
    });
    if (data) {
      // data['Name_old'] = data['Name'];
      newForm.patchValue(data);
    } else {
      // this.addDetailFormGroup(newForm);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: LocaleConfigModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      // this.router.navigate(['/promotion/promotion/list']);
    } else {
      // this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}

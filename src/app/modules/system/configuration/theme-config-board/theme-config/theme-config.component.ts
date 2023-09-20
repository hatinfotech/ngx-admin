import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { filter, take } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { DataManagerFormComponent } from '../../../../../lib/data-manager/data-manager-form.component';
import { LocaleConfigModel } from '../../../../../models/system.model';
import { TaxModel } from '../../../../../models/tax.model';
import { UnitModel } from '../../../../../models/unit.model';
import { ApiService } from '../../../../../services/api.service';
import { CommonService } from '../../../../../services/common.service';
import { Timezone } from '../../system-configuration-board/system-locale-config/system-locale-config.component';
import { RootServices } from '../../../../../services/root.services';

@Component({
  selector: 'ngx-theme-config',
  templateUrl: './theme-config.component.html',
  styleUrls: ['./theme-config.component.scss']
})
export class ThemeConfigComponent extends DataManagerFormComponent<LocaleConfigModel> implements OnInit {

  componentName: string = 'UserLocaleConfigComponent';
  idKey = 'Code';
  apiPath = '/system/user-configs';
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
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public translate: TranslateService,
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);

    /** Remove close button */
    this.actionButtonList = this.actionButtonList.filter(btn => btn.name !== 'close');

    this.cms.timezones$.pipe(filter(f => !!f), take(1)).toPromise().then((timezones) => {
      this.tz = (timezones as Timezone[]).map((timezon) => {
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

  async formLoad(formData: LocaleConfigModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: LocaleConfigModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: LocaleConfigModel): FormGroup {
    const newForm = this.formBuilder.group({
      _index: [''],
      // Locale: ['', Validators.required],
      Theme: ['', Validators.required],
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

import { Component, OnInit } from '@angular/core';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PbxModel } from '../../../../models/pbx.model';
import { IvoipService } from '../../ivoip-service';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';

@Component({
  selector: 'ngx-domain-form',
  templateUrl: './domain-form.component.html',
  styleUrls: ['./domain-form.component.scss'],
})
export class DomainFormComponent extends IvoipBaseFormComponent<PbxDomainModel> implements OnInit {

  componentName = 'DomainFormComponent';
  idKey = 'Id';
  apiPath = '/ivoip/domains';
  baseFormUrl = '/ivoip/domains/form';

  // objectValue = '';
  userChooseConfig = {
    placeholder: 'Chọn người dùng...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 1,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      // url: params => {
      //   return this.apiService.buildApiUrl('/user/users', {filter_Name: params['term']});
      //   // return environment.api.baseUrl + '/contact/contacts?token='
      //   //   + localStorage.getItem('api_access_token') + '&filter_Name=' + params['term'];
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/user/users', {filter_Name: params['term']}).then(rs => {
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

  pbxList: { Code: string, Name: string }[] = [];
  select2OptionForPbxList = {
    placeholder: 'Chọn tổng đài...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Description',
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
    public ref: NbDialogRef<DomainFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms, ivoipService, ref);
  }

  ngOnInit() {
    this.restrict();
    this.apiService.get<PbxModel[]>('/ivoip/pbxs', { select: 'Code,Description', limit: 9999 }, list => {
      this.pbxList = this.convertOptionList(list, 'Code', 'Description');
      super.ngOnInit();
    });

  }

  /** Get form data by id from api */
  getFormData(callback: (data: PbxDomainModel[]) => void) {
    this.apiService.get<PbxDomainModel[]>(this.apiPath, { id: this.id, includeDomains: true, includeOwner: true },
      data => callback(data),
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  makeNewFormGroup(data?: PbxDomainModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      DomainId: [''],
      Pbx: [this.ivoipService ? this.ivoipService.getActivePbx() : '', Validators.required],
      DomainName: ['', Validators.required],
      // AdminKey: [''],
      Description: [''],
      Owner: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxDomainModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  // goback(): false {
  //   this.router.navigate(['/ivoip/domains/list']);
  //   return false;
  // }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void {

  }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void {

  }

  onAfterCreateSubmit(newFormData: PbxDomainModel[]) {
    super.onAfterCreateSubmit(newFormData);
    this.ivoipService.clearCache();
  }

  onAfterUpdateSubmit(newFormData: PbxDomainModel[]) {
    super.onAfterUpdateSubmit(newFormData);
    this.ivoipService.clearCache();
  }

}

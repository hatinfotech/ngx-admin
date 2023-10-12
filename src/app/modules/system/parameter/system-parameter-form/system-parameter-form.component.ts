import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { DataManagerFormComponent, MyUploadAdapter } from '../../../../lib/data-manager/data-manager-form.component';
import { SystemParameterModel } from '../../../../models/system.model';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RootServices } from '../../../../services/root.services';
import * as ClassicEditorBuild from '../../../../../vendor/ckeditor/ckeditor5-custom-build/build/ckeditor.js';
import { SystemConfigModel } from '../../../../models/model';

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    // Configure the URL to the upload script in your back-end here!
    const options = editor.config.get('simpleUpload');
    return new MyUploadAdapter(loader, options);
  };
}
@Component({
  selector: 'ngx-system-parameter-form',
  templateUrl: './system-parameter-form.component.html',
  styleUrls: ['./system-parameter-form.component.scss'],
})
export class SystemParameterFormComponent extends DataManagerFormComponent<SystemParameterModel> implements OnInit {

  componentName: string = 'SystemParameterFormComponent';
  idKey = 'Id';
  apiPath = '/system/parameters';
  baseFormUrl = '/system/parameter/form';

  env = environment;

  /** Tax list */
  static _taxList: (TaxModel & { id?: string, text?: string })[];
  taxList: (TaxModel & { id?: string, text?: string })[];

  /** Unit list */
  static _unitList: (UnitModel & { id?: string, text?: string })[];
  unitList: (UnitModel & { id?: string, text?: string })[];

  constructor(
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<SystemParameterFormComponent>,
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);
  }

  public Editor = ClassicEditorBuild;
  public ckEditorConfig = {
    height: '200px',
    // plugins: [ImageResize],
    extraPlugins: [MyCustomUploadAdapterPlugin],
    simpleUpload: {
      uploadUrl: () => {
        // return this.apiService.getPromise<FileStoreModel[]>('/file/file-stores', { filter_Type: 'REMOTE', sort_Weight: 'asc', requestUploadToken: true, weight: 4194304, limit: 1 }).then(fileStores => {
        return this.cms.getAvailableFileStores().then(fileStores => fileStores[0]).then(fileStore => {
          return this.apiService.buildApiUrl(fileStore.Path + '/v1/file/files', { token: fileStore['UploadToken'] });
        });
      },
    },
  };

  typeList = [
    { id: 'string', text: 'String' },
    { id: 'int', text: 'Int' },
    { id: 'float', text: 'Float' },
    { id: 'boolean', text: 'Boolean' },
  ];
  select2optionForType = {
    ...this.cms.select2OptionForTemplate,
  };
  inputTypeList = [
    { id: 'text', text: 'Chữ (text box)' },
    { id: 'textarea', text: 'HTML (text editor)' },
    { id: 'checkbox', text: 'Checkbox' },
    { id: 'option', text: 'Option' },
    { id: 'multioption', text: 'Multi Options' },
  ];
  select2optionForInputType = {
    ...this.cms.select2OptionForTemplate,
  };

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init(): Promise<boolean> {
    return super.init();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: SystemParameterModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeConditions'] = true;
    // params['includeProduct'] = true;
    // params['includeContact'] = true;
    // params['includeDetails'] = true;
    // params['useBaseTimezone'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: SystemParameterModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: SystemParameterModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: SystemParameterModel): FormGroup {
    const newForm = this.formBuilder.group({
      _index: [''],
      Id: [],
      Name: [null, Validators.required],
      Type: [],
      InputType: ['TEXT'],
      Value: [],
      IsApplied: [true],
      Module: [],
      Description: [],
    });
    if (data) {
      data['Name_old'] = data['Name'];
      newForm.patchValue(data);
    } else {
      // this.addDetailFormGroup(newForm);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: SystemParameterModel): void {
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


  /** Form submit event */
  async save(): Promise<SystemParameterModel[]> {
    return super.save().then(rs => {
      this.cms.updateSystemConfigs();
      return rs;
    });
  }
}

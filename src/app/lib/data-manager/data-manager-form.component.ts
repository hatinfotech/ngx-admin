import { OnInit, OnDestroy, Input, AfterViewInit, Component, Injectable, Type } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbGlobalPhysicalPosition, NbDialogService, NbDialogRef } from '@nebular/theme';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { ShowcaseDialogComponent } from '../../modules/dialog/showcase-dialog/showcase-dialog.component';
import { Subject } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { BaseComponent } from '../base-component';
import { ActionControl, ActionControlListOption } from '../custom-element/action-control-list/action-control.interface';
import { Icon } from '../custom-element/card-header/card-header.component';
import { DataManagerPrintComponent } from './data-manager-print.component';

@Component({ template: '' })
export abstract class DataManagerFormComponent<M> extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

  mode: 'dialog' | 'page' | 'inline' = 'page';
  listUrl: string;

  /** Form Structure */
  get formStructures() {
    return {};
  }

  /** Main form */
  form = this.formBuilder.group({
    array: this.formBuilder.array([
      // this.makeNewFormGroup(),
    ]),
  });

  @Input() previewAfterSave = false;
  @Input() previewAfterCreate = false;
  @Input() inputMode: 'dialog' | 'page' | 'inline';
  @Input() inputId: string[];
  @Input() onDialogSave?: (newData: M[]) => void;
  @Input() isDuplicate: boolean;
  @Input() data: M[];

  favicon: Icon = { pack: 'eva', name: 'browser', size: 'medium', status: 'primary' };
  @Input() title?: string;
  @Input() size?: string = 'medium';
  actionButtonList: ActionControl[];
  printDialog: Type<DataManagerPrintComponent<M>>;

  /** Form unique id = current time as milisecond */
  formUniqueId: string;

  /** Past form data, use for undo feature */
  pastFormData: { formData: any, meta: any }[] = [];

  /** Max of past form data for rotation */
  maxOfPastFormDataLength = 10;

  /** Submit status */
  submitted = false;

  submiting = false;

  /** Form loading status */
  isProcessing = false;

  /** resource(s) id for get data */
  id: string[] = [];

  /** base form url */
  abstract baseFormUrl: string;

  /** resource id key */
  abstract idKey: any;

  /** Restful api path use for api service */
  abstract apiPath: string;

  /** Destroy monitoring */
  destroy$: Subject<null> = new Subject<null>();

  /** disable controls list */
  protected disabledControls: AbstractControl[] = [];

  protected queryParam: any;

  protected formDataCache: M[];

  protected silent = false;
  protected autosave = false;


  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref?: NbDialogRef<DataManagerFormComponent<M>>,
  ) {
    super(commonService, router, apiService);
    // this.formLoading = true;
    this.onProcessing();
    this.formUniqueId = Date.now().toString();

  }

  /** Make new form group sctructure */
  abstract makeNewFormGroup(data?: M): FormGroup;

  /** Form init */
  ngOnInit() {
    super.ngOnInit();
  }

  /** Form init */
  async init(): Promise<boolean> {
    await this.commonService.waitForReady();
    this.actionButtonList = [
      {
        name: 'reload',
        status: 'success',
        label: this.commonService.textTransform(this.commonService.translate.instant('Common.reload'), 'head-title'),
        icon: 'refresh',
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.reload'), 'head-title'),
        size: 'medium',
        disabled: () => this.isProcessing,
        hidden: () => false,
        click: () => {
          this.onFormReload();
        },
      },
      {
        name: 'remove',
        status: 'warning',
        label: this.commonService.textTransform(this.commonService.translate.instant('Common.remove'), 'head-title'),
        icon: 'minus-circle',
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.remove'), 'head-title'),
        size: 'medium',
        hidden: () => this.array.controls.length < 2,
        disabled: () => this.isProcessing,
        click: (event, option: ActionControlListOption) => {
          this.removeFormGroup(option.formIndex);
          return false;
        },
      },
      {
        name: 'close',
        status: 'danger',
        label: this.commonService.textTransform(this.commonService.translate.instant('Common.close'), 'head-title'),
        icon: 'close',
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.close'), 'head-title'),
        size: 'medium',
        disabled: () => this.isProcessing,
        click: () => {
          this.goback();
        },
      },
    ];


    await this.loadCache();
    if (this.inputMode) {
      this.mode = this.inputMode;
    }
    this.activeRoute.queryParams.subscribe(queryParams => {
      this.queryParam = queryParams;
    });
    await new Promise<boolean>(resolve => {
      this.getRequestId(id => {
        if (id && id.length > 0) {
          this.id = id;
          this.formLoad().then(async () => {
            // wait for dom loaded
            while (this.array.controls.length === 0) await new Promise(resolve => setTimeout(() => resolve(null), 100));
            resolve(true);
          });
        } else if (this.data) {
          this.formLoad(this.data).then(async () => {
            // wait for dom loaded
            while (this.array.controls.length === 0) await new Promise(resolve => setTimeout(() => resolve(null), 100));
            resolve(true);
          });
        } else {
          this.array.clear();
          this.addFormGroup();
          this.onProcessed();
          resolve(true);
        }
      });
    });
    this.onAfterInit && this.onAfterInit(this);
    return true;
  }

  patchFormGroupValue: (newForm: FormGroup, data: M) => boolean;

  getRequestId(callback: (id?: string[]) => void) {
    if (this.mode === 'page') {
      this.activeRoute.params.subscribe(params => {
        if (params['id']) callback(decodeURIComponent(params['id']).split('&')); else callback();
      });
    } else {
      callback(this.inputId);
    }
  }

  /** Get form data by id from api */
  getFormData(callback: (data: M[]) => void) {
    if (this.id && this.id.length > 0) {
      this.executeGet({ id: this.id }, data => callback(data));
    } else {
      callback([{} as M]);
    }
  }

  /** Get data from api and patch data for form */
  async formLoad(formData?: M[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: M) => Promise<void>) {
    this.onProcessing();

    /** If has formData input, use formData for patch */
    return new Promise<boolean>(resovle => {
      ((callback: (data: M[]) => Promise<void>) => {
        if (formData) {
          callback(formData);
        } else {
          this.getRequestId(id => {
            if (id && id.length > 0) {
              this.getFormData((data: M[]) => {
                callback(data);
              })
            } else {
              callback([null]);
            }
            resovle(true);
          });
        }
      })(async (data: M[]) => {
        if (!this.patchFormGroupValue) {
          this.array.clear();
          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const newForm = this.makeNewFormGroup(item);
            this.array.push(newForm);
            this.onAddFormGroup(this.array.length - 1, newForm, item);
            if (formItemLoadCallback) {
              await formItemLoadCallback(this.array.length - 1, newForm, item);
            }
          }

          resovle(true);
          this.onProcessed();
        } else {

          // this.array.clear();
          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            let formGroup: FormGroup;
            if (!this.array.controls[i]) {
              formGroup = this.makeNewFormGroup(item);
              this.array.push(formGroup);
              this.onAddFormGroup(this.array.length - 1, formGroup, item);
            } else {
              formGroup = this.array.controls[i] as FormGroup;
              this.patchFormGroupValue(formGroup, item);
            }
            if (formItemLoadCallback) {
              await formItemLoadCallback(this.array.length - 1, formGroup, item);
            }
          }

          // remove dirty form group
          if (data.length < this.array.controls.length) {
            this.array.controls.splice(data.length, this.array.controls.length - data.length);
          }

          resovle(true);
          this.onProcessed();
        }
      });
    });
  }

  /** Get main form array */
  get array() {
    return this.form.get('array') as FormArray;
  }

  updateInitialFormPropertiesCache(form: FormGroup) {
    Object.keys(form.controls).forEach(name => {
      const control = form.controls[name];
      if (control.disabled) {
        this.disabledControls.push(form.controls[name]);
      }
    });
  }

  /** Add new main form item */
  addFormGroup(data?: M) {
    const newForm = this.makeNewFormGroup(data);
    this.array.push(newForm);
    // tslint:disable-next-line: forin
    this.onAddFormGroup(this.array.length - 1, newForm, data);
    return false;
  }

  onProcessing() {
    this.isProcessing = true;
    this.form.disable();
  }

  onProcessed() {
    this.isProcessing = false;
    this.form.enable();
    this.disabledControls.forEach(control => control.disable());
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: M): void {
    this.updateInitialFormPropertiesCache(newForm);
  }
  abstract onRemoveFormGroup(index: number): void;

  /** Remove main form item */
  removeFormGroup(index: number) {
    this.array.removeAt(index);
    this.onRemoveFormGroup(index);
    return false;
  }

  /** get main form controls */
  get formControls() { return this.form.controls; }

  /** Goback action, reuire in extended class */
  goback(): false {
    if (this.mode === 'dialog') {
      if (this.onDialogClose) this.onDialogClose();
      this.close();
    } else if (this.listUrl) {
      this.router.navigate([this.listUrl]);
    } else {
      this.commonService.goback();
    }
    return false;
  }

  makeId(item: M) {
    if (Array.isArray(this.idKey)) {
      return this.idKey.map(key => this.encodeId(item[key])).join('-');
    }
    return item[this.idKey];
  }

  /** After main form create event */
  onAfterCreateSubmit(newFormData: M[]) {
    this.formLoad(newFormData);
    if (!this.silent) {
      this.toastrService.show('success', 'Dữ liệu đã được lưu lại', {
        status: 'success',
        hasIcon: true,
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        duration: 3000,
      });
    }
    this.id = newFormData.map(item => this.makeId(item));
    if (this.mode === 'page') {
      this.commonService.location.go(this.generateUrlByIds(this.id));
    }
    if (this.queryParam && this.queryParam['list']) {
      this.commonService.componentChangeSubject.next({ componentName: this.queryParam['list'], state: true });
    }

    if (this.mode === 'dialog' && this.onDialogSave) {
      this.onDialogSave(newFormData);
    }
  }

  /** Affter main form update event */
  onAfterUpdateSubmit(newFormData: M[]) {
    this.formLoad(newFormData);
    if (!this.silent) {
      this.toastrService.show('success', 'Dữ liệu đã được cập nhật', {
        status: 'success',
        hasIcon: true,
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        duration: 3000,
      });
    }
    this.id = newFormData?.map(item => this.makeId(item));
    if (this.mode === 'page') {
      this.commonService.location.go(this.generateUrlByIds(this.id));
    }
    if (this.queryParam && this.queryParam['list']) {
      this.commonService.componentChangeSubject.next({ componentName: this.queryParam['list'], state: true });
    }

    if (this.mode === 'dialog' && this.onDialogSave) {
      this.onDialogSave(newFormData);
    }
  }

  protected generateUrlByIds(ids: string[]) {
    return this.baseFormUrl + '/' + ids.join(encodeURIComponent('&'));
  }

  /** Error event */
  onError(e: HttpErrorResponse) {
    // console.log(e);
    if (e?.status === 500) {
      this.close();
    }
    if (e && e.error && e.error.logs) {
      this.commonService.openDialog(ShowcaseDialogComponent, {
        context: {
          title: 'Form: Thông báo lỗi',
          content: e.error.logs?.length > 1 ? `<ol ><li>${e.error.logs.join('</li><li>')}</li></ol>` : e.error.logs[0],
          // actions: [
          //   {
          //     label: 'Trở về',
          //     icon: 'arrow-ios-back-outline',
          //     status: 'info',
          //   },
          // ],
        },
      });
    }
  }

  onFormReload() {
    this.formLoad();
    return false;
  }

  pushPastFormData(formData: any) {
    // const aPastFormData = { formData: formData, meta: null };
    // this.onUpdatePastFormData(aPastFormData);
    // this.pastFormData.push(aPastFormData);
    // if (this.pastFormData.length > 10) {
    //   this.pastFormData.shift();
    // }
  }

  abstract onUpdatePastFormData(aPastFormData: { formData: any, meta: any }): void;
  abstract onUndoPastFormData(aPastFormData: { formData: any, meta: any }): void;

  onFormUndo() {
    // this.pastFormData.pop();
    // const aPastFormData = this.pastFormData.pop();
    // this.onUndoPastFormData(aPastFormData);
    // // console.info(aPastFormData);
    // if (aPastFormData) {
    //   this.formLoad(aPastFormData.formData);
    // }
    // return false;
  }

  get canUndo(): boolean {
    return this.pastFormData.length > 1;
  }

  onPreview() {
    return false;
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: M[]) => void, error?: (e: HttpErrorResponse) => void) {
    this.apiService.get<M[]>(this.apiPath, params, data => {
      this.formDataCache = data;
      success(data);
    }, e => {
      if (error) error(e); else this.onError(e);
      // this.onError(e);
    });
  }

  /** Execute api put */
  executePut(params: any, data: M[], success: (data: M[]) => void, error: (e: any) => void) {
    // this.prepareDataForSave(data);
    this.apiService.put<M[]>(this.apiPath, params, data, newFormData => {
      this.formDataCache = data;
      success(newFormData);
    }, e => {
      if (error) error(e); else this.onError(e);
      // this.onError(e);
    });
  }

  /** Execute api post */
  executePost(params: any, data: M[], success: (data: M[]) => void, error: (e: any) => void) {
    // this.prepareDataForSave(data);
    this.apiService.post<M[]>(this.apiPath, params, data, newFormData => {
      this.formDataCache = data;
      success(newFormData);
    }, e => {
      if (error) error(e); else this.onError(e);
      // this.onError(e);
    });
  }

  prepareDataForSave(data: M[]) {
    data.forEach(item => {
      Object.keys(item).forEach(k => {
        if (item[k]['id']) {
          delete (item[k]['selected']);
          delete (item[k]['disabled']);
          delete (item[k]['_resultId']);
          delete (item[k]['element']);
        }
      });
    });
  }

  getRawFormData() {
    return this.form.getRawValue();
  }

  /** Form submit event */
  async save(): Promise<M[]> {
    return new Promise<M[]>((resolve, reject) => {

      // this.submitted = true;
      // this.submiting = true;
      this.onProcessing();
      // const data: { array: any } = this.form.getRawValue();
      const data: { array: any } = this.getRawFormData();

      // console.info(data);

      this.form.disable();
      if (this.id.length > 0) {
        // Update
        this.executePut({ id: this.id, silent: true }, data.array, results => {
          this.onAfterUpdateSubmit(results);
          // this.submiting = false;
          // this.form.enable();
          this.onProcessed();
          resolve(results);
        }, e => {
          // this.submiting = false;
          // this.form.enable();
          this.onProcessed();
          this.onError(e);
          reject(e);
        });
      } else {
        // Create
        this.executePost({ silent: true }, data.array, results => {
          this.onAfterCreateSubmit(results);
          this.onProcessed();
          resolve(results);
        }, e => {
          this.onError(e);
          this.onProcessed();
          reject(e);
        });
      }
    });

  }

  onSubmit() {
    this.save();
  }

  saveAndClose() {
    const createMode = !this.isEditMode;
    this.save().then(rs => {
      this.goback();
      if (this.previewAfterSave || (this.previewAfterCreate && createMode)) {
        this.preview(rs, 'list', 'print');
      }
    });
    return false;
  }

  /** Reset form */
  onReset() {
    this.submitted = false;
    this.form.reset();
  }

  formControlValidate(formControl: FormControl, invalidText: string, valideText?: string): string {
    // console.info('Form control validate', formControl);
    if (formControl.touched && formControl.errors && formControl.errors.required) {
      return invalidText;
    }
    return valideText ? valideText : '';
  }

  protected convertOptionList(list: any[], idKey: string, labelKey: string) {
    return this.commonService.convertOptionList(list, idKey, labelKey);
  }

  copyFormControlValueToOthers(array: FormArray, i: number, formControlName: string) {
    const currentValue = array.controls[i].get(formControlName).value;
    array.controls.forEach((formItem, index) => {
      if (index !== i) {
        formItem.get(formControlName).patchValue(currentValue);
      }
    });
  }

  onControlEnter(event: KeyboardEvent) {
    if ((event.target as HTMLElement).nodeName.toLowerCase() !== 'textarea') {
      return false;
    }
    // return event.preventDefault();
    // return true;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    // this.destroy$.next();
    // this.destroy$.complete();
  }

  get isEditMode() {
    return this.id && this.id.length > 0;
  }

  async refresh() {
    // this.array.clear();
    this.formLoad();
  }

  reset() {
    this.id = [];
    this.array.clear();
    this.addFormGroup();
    this.onProcessed();
  }

  /** Form Group function */
  makeNewChildFormGroup<T>(childName: string, data?: T): FormGroup {

    if (!this.formStructures) {
      throw Error('Form structure was not defined');
    }

    const fields = this.formStructures[childName];
    if (!fields) {
      throw Error(`Form structure for ${childName} was not defined`);
    }

    const newForm = this.formBuilder.group(fields);
    if (data) {
      const fieldNames = Object.keys(fields);
      for (let i = 0; i < fieldNames.length; i++) {
        if (/_old$/.test(fieldNames[i])) {
          data[fieldNames[i] + '_old'] = data[fieldNames[i]];
        }
      }
      newForm.patchValue(data);
    }
    return newForm;
  }
  getChildFormArray(childName: string, parenItem: FormGroup) {
    return parenItem.get(childName.split('.').pop()) as FormArray;
  }
  addChildFormGroup<T>(childName: string, parenItem: FormGroup, parentIndex: number, data?: T) {
    const newFormGroup = this.makeNewChildFormGroup(childName, data);
    const childFormArray = this.getChildFormArray(childName, parenItem);
    childFormArray.push(newFormGroup);
    this.onAddChildFormGroup(parentIndex, childFormArray.length - 1, newFormGroup);
    return newFormGroup;
  }
  removeChildFormGroup(childName: string, parenItem: FormGroup, parentIndex: number, index: number) {
    this.getChildFormArray(childName, parenItem).removeAt(index);
    this.onRemoveChildFormGroup(parentIndex, index);
    return false;
  }
  onAddChildFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
  }
  onRemoveChildFormGroup(mainIndex: number, index: number) {
  }
  /** End Form Group function */

  getFieldValue(form: FormGroup, fieldName: string) {
    const value = form.get(fieldName).value;
    return this.commonService.getObjectId(value);
  }

  prepareRestrictedData(formGroup: FormGroup, data: M) {
    for (const propName in data) {
      const prop = data[propName];
      if (prop && prop['restricted']) {
        formGroup.get(propName)['placeholder'] = data[propName]['placeholder']
        delete (data[propName]);
      }
    }
  }

  setNoForArray(details: FormGroup[], condition: (formGroup: FormGroup) => boolean, fieldNo?: string) {
    let no = 1;
    for (const detail of details) {
      if (condition(detail)) {
        detail.get(fieldNo || 'No').patchValue(no++);
      }
    }
  }

  sortablejsInit(sortable: any, details: FormGroup[]) {
    console.log(sortable);
    const parentOnUpdate = sortable.options.onUpdate;
    sortable.options.onUpdate = (event: any) => {
      if (parentOnUpdate) parentOnUpdate(event);
      console.log('sort udpate: ', event);
      this.setNoForArray(details, (detail) => detail.get('Type').value === 'PRODUCT');
    };
  }

  async preview(data: M[] | FormGroup, source?: string, mode?: string) {
    if (!this.printDialog) {
      console.log('Print dialog was not set');
      return false;
    };
    const context = {
      showLoadinng: true,
      title: 'Xem trước',
      // id: data.map(m => this.makeId(m)),
      // sourceOfDialog: 'form',
      mode: mode || 'print',
      closeAfterStateActionConfirm: true,
      idKey: ['Code'],
      // approvedConfirm: true,
      onChange: (data: M) => {
        // if (source == 'list') {
        //   this.refresh();
        // }
        this.onDialogSave([data]);
      },
      onSaveAndClose: () => {
        // this.refresh();
      },
    };
    if (data && typeof data[0] === 'string') {
      context['id'] = data;
      context['sourceOfDialog'] = source || 'list';
    } else {
      context['data'] = data;
      context['sourceOfDialog'] = source || 'form';
    }

    this.commonService.openDialog(this.printDialog, {
      context: context as any,
    });
    return false;
  }

  validateVoucherDate(control: FormControl, label: string) {
    // console.log(control);
    if (control.value instanceof Date) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const controlValue = new Date(control.value.getTime());
      controlValue.setHours(0, 0, 0, 0); 
      if (controlValue.getTime() < currentDate.getTime()) {
        return this.commonService.translateText(label) + ' trước ngày hiện tại';
      }
    }
    return label;
  }

  select2OptionForContact = {
    placeholder: 'Chọn liên hệ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    // tags: false,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    ajax: {
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/contact/contacts', { includeIdText: true, includeGroups: true, search: params['term'] }).then(rs => {
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
            item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
            return item;
          }),
        };
      },
    },
  };

}

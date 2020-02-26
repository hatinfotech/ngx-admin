import { OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbGlobalPhysicalPosition, NbDialogService } from '@nebular/theme';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { ShowcaseDialogComponent } from '../../modules/dialog/showcase-dialog/showcase-dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from '../../services/common.service';
import { BaseComponent } from '../base-component';
import { ActionControl } from '../../interface/action-control.interface';

export abstract class DataManagerFormComponent<M> extends BaseComponent implements OnInit, OnDestroy {

  mode: 'dialog' | 'page' | 'inline' = 'page';

  /** Main form */
  form = this.formBuilder.group({
    array: this.formBuilder.array([
      this.makeNewFormGroup(),
    ]),
  });

  @Input() inputMode: 'dialog' | 'page' | 'inline';
  @Input() inputId: string[];
  @Input() onDialogSave: (newData: M[]) => void;
  @Input() onDialogClose: () => void;

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
  abstract idKey: string;

  /** Restful api path use for api service */
  abstract apiPath: string;

  /** Destroy monitoring */
  destroy$: Subject<null> = new Subject<null>();

  /** disable controls list */
  protected disabledControls: AbstractControl[] = [];

  protected queryParam: any;

  protected formDataCache: any[];

  protected silent = false;
  protected autosave = false;

  actionControlList: ActionControl[] = [

    {
      type: 'button',
      name: 'goback',
      status: 'info',
      label: 'Trở về',
      icon: 'arrow-back',
      title: 'Trở về',
      size: 'tiny',
      disabled: () => {
        return !this.isProcessing;
      },
      click: () => {
        this.goback();
        return false;
      },
    },
    {
      type: 'button',
      name: 'undo',
      status: 'warning',
      label: 'Hoàn tác',
      icon: 'undo',
      title: 'Hoàn tác',
      size: 'tiny',
      disabled: () => {
        return !this.canUndo || this.isProcessing;
      },
      click: () => {
        this.onFormUndo();
        return false;
      },
    },
    {
      type: 'button',
      name: 'reload',
      status: 'success',
      label: 'Tải lại',
      icon: 'refresh',
      title: 'Tải lại',
      size: 'tiny',
      disabled: () => {
        return this.isProcessing;
      },
      click: () => {
        this.formLoad();
        return false;
      },
    },
    {
      type: 'button',
      name: 'remove',
      status: 'danger',
      label: 'Xem',
      icon: 'close-circle',
      title: 'Xem thông tin TICKET',
      size: 'tiny',
      disabled: () => {
        return this.isProcessing;
      },
      click: (event, option: { formIndex: number }) => {
        this.removeFormGroup(option['formIndex']);
        return false;
      },
    },
  ];

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
  ) {
    super(commonService, router, apiService);
    // this.formLoading = true;
    this.onProcessing();
    this.formUniqueId = Date.now().toString();
    // this.form = this.formBuilder.group({
    //   array: this.formBuilder.array([
    //     this.makeNewFormGroup(),
    //   ]),
    // });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(formData => {
      if (!this.isProcessing) {
        this.commonService.takeUntil(this.formUniqueId, 1000, () => {
          this.pushPastFormData(formData.array);
        });
      }
    });

  }

  /** Make new form group sctructure */
  abstract makeNewFormGroup(data?: M): FormGroup;

  /** Form init */
  ngOnInit() {
    super.ngOnInit();
    if (this.inputMode) {
      this.mode = this.inputMode;
    }
    this.activeRoute.queryParams.subscribe(queryParams => {
      this.queryParam = queryParams;
    });
    this.getRequestId(id => {
      if (id) {
        this.id = id;
        if (this.id.length > 0) {
          this.formLoad();
        } else {
          // this.formLoading = false;
          this.onProcessed();
        }
      } else {
        this.array.clear();
        this.addFormGroup();
        // this.formLoading = false;
        this.onProcessed();
      }
    });
    // this.activeRoute.params.subscribe(params => {
    //   // this.id = params['id']; // (+) converts string 'id' to a number
    //   if (params['id']) {
    //     this.id = decodeURIComponent(params['id']).split('&');
    //     if (this.id.length > 0) {
    //       this.formLoad();
    //     } else {
    //       // this.formLoading = false;
    //       this.onProcessed();
    //     }
    //   } else {
    //     this.array.clear();
    //     this.addFormGroup();
    //     // this.formLoading = false;
    //     this.onProcessed();
    //   }
    // });
  }

  getRequestId(callback: (id?: string[]) => void) {
    this.activeRoute.params.subscribe(params => {
      if (params['id']) callback(decodeURIComponent(params['id']).split('&')); else callback();
    });
  }

  /** Get form data by id from api */
  getFormData(callback: (data: M[]) => void) {
    // const ids: { [key: string]: string } = {};
    // this.id.forEach((element, index) => {
    //   ids['id' + index] = element;
    // });
    // this.apiService.get<M[]>(this.apiPath, { id: this.id, multi: true }, data => callback(data), e => this.onError(e));
    this.executeGet({ id: this.id }, data => callback(data));
  }

  /** Get data from api and patch data for form */
  formLoad(formData?: M[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: M) => void) {
    // this.formLoading = true;
    // this.form.disable();
    this.onProcessing();

    /** If has formData input, use formData for patch */
    ((callback: (data: M[]) => void) => {
      if (formData) {
        callback(formData);
      } else {
        this.getFormData(callback);
      }
    })((data: M[]) => {

      this.array.clear();
      data.forEach(item => {
        const newForm = this.makeNewFormGroup(item);
        this.array.push(newForm);
        this.onAddFormGroup(this.array.length - 1, newForm, item);
        if (formItemLoadCallback) {
          formItemLoadCallback(this.array.length - 1, newForm, item);
        }
      });

      setTimeout(() => {
        // this.formLoading = false;
        // const aPastFormData = {formData: this.form.value.array, meta: null};
        // this.onUpdatePastFormData(aPastFormData);
        // this.pastFormData.push(aPastFormData);
        this.pushPastFormData(this.form.value.array);
        this.onProcessed();
      }, 1000);

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
    if (this.mode === 'dialog' && this.onDialogClose) {
      this.onDialogClose();
    }
    return false;
  }

  /** After main form create event */
  onAfterCreateSubmit(newFormData: M[]) {
    this.formLoad(newFormData);
    if (!this.silent) {
      this.toastrService.show('success', 'Dữ liệu đã được lưu lại', {
        status: 'success',
        hasIcon: true,
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
      });
    }
    this.id = newFormData.map(item => item[this.idKey]);
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
      });
    }
    this.id = newFormData.map(item => item[this.idKey]);
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
    if (e && e.error && e.error.logs) {
      this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'Thông báo lỗi',
          content: e.error.logs.join('\n'),
          actions: [
            {
              label: 'Trở về',
              icon: 'back',
              status: 'info',
            },
          ],
        },
      });
    }
  }

  onFormReload() {
    this.formLoad();
    return false;
  }

  pushPastFormData(formData: any) {
    const aPastFormData = { formData: formData, meta: null };
    this.onUpdatePastFormData(aPastFormData);
    this.pastFormData.push(aPastFormData);
    if (this.pastFormData.length > 10) {
      this.pastFormData.shift();
    }
  }

  abstract onUpdatePastFormData(aPastFormData: { formData: any, meta: any }): void;
  abstract onUndoPastFormData(aPastFormData: { formData: any, meta: any }): void;

  onFormUndo() {
    this.pastFormData.pop();
    const aPastFormData = this.pastFormData.pop();
    this.onUndoPastFormData(aPastFormData);
    // console.info(aPastFormData);
    if (aPastFormData) {
      this.formLoad(aPastFormData.formData);
    }
    return false;
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
    this.apiService.post<M[]>(this.apiPath, params, data, newFormData => {
      this.formDataCache = data;
      success(newFormData);
    }, e => {
      if (error) error(e); else this.onError(e);
      // this.onError(e);
    });
  }

  /** Form submit event */
  save() {
    // this.submitted = true;
    // this.submiting = true;
    this.onProcessing();
    const data: { array: any } = this.form.getRawValue();

    // console.info(data);

    this.form.disable();
    if (this.id.length > 0) {
      // Update
      this.executePut({ id: this.id, silent: true }, data.array, results => {
        this.onAfterUpdateSubmit(results);
        // this.submiting = false;
        // this.form.enable();
        this.onProcessed();
      }, e => {
        // this.submiting = false;
        // this.form.enable();
        this.onProcessed();
        this.onError(e);
      });
    } else {
      // Create
      this.executePost({ silent: true }, data.array, results => {
        this.onAfterCreateSubmit(results);
        this.onProcessed();
      }, e => {
        this.onError(e);
        this.onProcessed();
      });
    }

  }

  onSubmit() {
    this.save();
  }

  /** Reset form */
  onReset() {
    this.submitted = false;
    this.form.reset();
  }

  formControlValidate(formControl: FormControl, invalidText: string, valideText?: string): string {
    if (formControl.touched && formControl.errors && formControl.errors.required) {
      return invalidText;
    }
    return valideText ? valideText : '';
  }

  protected convertOptionList(list: any[], idKey: string, labelKey: string) {
    return this.commonService.convertOptionList(list, idKey, labelKey);
    // return list.map(item => {
    //   item['id'] = item[idKey] = item[idKey] ? item[idKey] : 'undefined';
    //   item['text'] = item[labelKey] = item[labelKey] ? item[labelKey] : 'undefined';

    //   return item;
    // });
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
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh() {
    this.array.clear();
    this.formLoad();
  }

}

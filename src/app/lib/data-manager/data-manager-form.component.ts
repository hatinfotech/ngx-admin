import { OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbGlobalPhysicalPosition, NbDialogService } from '@nebular/theme';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { ShowcaseDialogComponent } from '../../modules/dialog/showcase-dialog/showcase-dialog.component';
import { Subject, of } from 'rxjs';
import { takeUntil, delay, concatMap, last } from 'rxjs/operators';
import { CommonService } from '../../services/common.service';

export abstract class DataManagerFormComponent<M> implements OnInit, OnDestroy {

  /** Main form */
  form: FormGroup;

  /** Form unique id = current time as milisecond */
  formUniqueId: string;

  /** Past form data, use for undo feature */
  pastFormData: { formData: any, meta: any }[] = [];

  /** Max of past form data for rotation */
  maxOfPastFormDataLength = 10;

  /** Submit status */
  submitted = false;

  /** Form loading status */
  formLoading = false;

  /** resource(s) id for get data */
  id: string;

  /** resource id key */
  idKey = 'Id';

  /** Restful api path use for api service */
  apiPath: string;

  /** Destroy monitoring */
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
  ) {
    this.formLoading = true;
    this.formUniqueId = Date.now().toString();
    this.form = this.formBuilder.group({
      array: this.formBuilder.array([
        this.makeNewFormGroup(),
      ]),
    });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(formData => {
      if (!this.formLoading) {
        this.commonService.takeUntil(this.formUniqueId, 1000, () => {
          // console.info(formData);
          // const aPastFormData = { formData: formData.array, meta: null };
          // this.onUpdatePastFormData(aPastFormData);
          // this.pastFormData.push(aPastFormData);

          this.pushPastFormData(formData.array);
          // console.info(this.pastFormData);
        });
      }
    });

  }

  /** Make new form group sctructure */
  abstract makeNewFormGroup(data?: M): FormGroup;

  /** Form init */
  ngOnInit() {

    this.activeRoute.params.subscribe(params => {
      this.id = params['id']; // (+) converts string 'id' to a number

      if (this.id) {
        this.formLoad();
      } else {
        this.formLoading = false;
      }
    });
  }

  /** Get form data by id from api */
  getFormData(callback: (data: M[]) => void) {
    this.apiService.get<M[]>(this.apiPath, { id: this.id, multi: true },
      data => callback(data),
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  /** Get data from api and patch data for form */
  formLoad(formData?: M[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: M) => void) {
    this.formLoading = true;

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
        this.formLoading = false;
        // const aPastFormData = {formData: this.form.value.array, meta: null};
        // this.onUpdatePastFormData(aPastFormData);
        // this.pastFormData.push(aPastFormData);
        this.pushPastFormData(this.form.value.array);
      }, 1000);

    });

  }

  /** Get main form array */
  get array() {
    return this.form.get('array') as FormArray;
  }

  /** Add new main form item */
  addFormGroup(data?: M) {
    const newForm = this.makeNewFormGroup(data);
    this.array.push(newForm);
    this.onAddFormGroup(this.array.length - 1, newForm, data);
    return false;
  }

  abstract onAddFormGroup(index: number, newForm: FormGroup, formData?: M): void;
  abstract onRemoveFormGroup(index: number): void;

  /** Remove main form item */
  removeFormGroup(index: number) {
    this.array.removeAt(index);
    this.onRemoveFormGroup(index);
    return false;
  }

  // onModuleChange(item: any, index: number) {
  //   console.info(item);

  //   if (!this.formLoading) {
  //   }
  // }

  /** get main form controls */
  get formControls() { return this.form.controls; }

  /** Goback action, reuire in extended class */
  abstract goback(): void;

  /** After main form create event */
  onAfterCreateSubmit(newFormData: M[]) {
    this.formLoad(newFormData);
    this.toastrService.show('success', 'Dữ liệu đã được lưu lại', {
      status: 'success',
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
    });
  }

  /** Affter main form update event */
  onAfterUpdateSubmit(newFormData: M[]) {
    this.formLoad(newFormData);
    this.toastrService.show('success', 'Dữ liệu đã được cập nhật', {
      status: 'success',
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
    });
  }

  /** Error event */
  onError(e: HttpErrorResponse) {
    if (e && e.error && e.error.logs) {
      this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'Thông báo lỗi',
          content: e.error.logs.join('<br>'),
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
  /** Form submit event */
  onSubmit() {
    this.submitted = true;
    const data: { array: any } = this.form.value;
    // console.info(data);

    if (this.id) {
      // Update
      this.apiService.put<M[]>(this.apiPath, this.id, data.array,
        newFormData => {
          // console.info(newFormData);
          this.onAfterUpdateSubmit(newFormData);
        }, e => {
          this.onError(e);
        });
    } else {
      // Create
      this.apiService.post<M[]>(this.apiPath, data.array,
        newFormData => {
          // console.info(newFormData);
          this.onAfterCreateSubmit(newFormData);
        }, e => {
          this.onError(e);
        });
    }

  }

  /** Reset form */
  onReset() {
    this.submitted = false;
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

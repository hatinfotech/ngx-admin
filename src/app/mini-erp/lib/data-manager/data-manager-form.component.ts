import { OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbGlobalPhysicalPosition, NbDialogService } from '@nebular/theme';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { ShowcaseDialogComponent } from '../../showcase-dialog/showcase-dialog.component';

export abstract class DataManagerFormComponent<M> implements OnInit {

  /** Main form */
  form: FormGroup;

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

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
  ) {
    this.form = this.formBuilder.group({
      array: this.formBuilder.array([
        this.makeNewFormGroup(),
      ]),
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

  /** Form submit event */
  onSubmit() {
    this.submitted = true;
    const data: { array: any } = this.form.value;
    console.info(data);

    if (this.id) {
      // Update
      this.apiService.put<M[]>(this.apiPath, this.id, data.array,
        newFormData => {
          console.info(newFormData);
          this.onAfterUpdateSubmit(newFormData);
        }, e => {
          this.onError(e);
        });
    } else {
      // Create
      this.apiService.post<M[]>(this.apiPath, data.array,
        newFormData => {
          console.info(newFormData);
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

  /** Goback action, reuire in extended class */
  abstract goback(): void;

  /** After main form create event */
  onAfterCreateSubmit(newFormData: M[]) {
    this.toastrService.show('success', 'Dữ liệu đã được lưu lại', {
      status: 'success',
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
    });
  }

  /** Affter main form update event */
  onAfterUpdateSubmit(newFormData: M[]) {
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

}

import { Component, OnInit } from '@angular/core';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';
import { PbxRecordingModel } from '../../../../models/pbx-recording.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { IvoipService } from '../../ivoip-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-recording-form',
  templateUrl: './recording-form.component.html',
  styleUrls: ['./recording-form.component.scss'],
})
export class RecordingFormComponent extends IvoipBaseFormComponent<PbxRecordingModel> implements OnInit {

  componentName: string = 'RecordingFormComponent';
  idKey = 'recording_uuid';
  apiPath = '/ivoip/recordings';
  baseFormUrl = '/ivoip/recordings/form';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ivoipService: IvoipService,
    public ref?: NbDialogRef<RecordingFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms, ivoipService, ref);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: PbxRecordingModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: PbxRecordingModel): FormGroup {
    const newForm = this.formBuilder.group({
      recording_uuid: [''],
      recording_name: ['', Validators.required],
      recording_filename: ['', Validators.required],
      recording_description: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxRecordingModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  // goback(): false {
  //   this.router.navigate(['/ivoip/recordings/list']);
  //   return false;
  // }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}

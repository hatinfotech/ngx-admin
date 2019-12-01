import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PbxModel } from '../../../../models/pbx.model';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';

@Component({
  selector: 'ngx-pbx-form',
  templateUrl: './pbx-form.component.html',
  styleUrls: ['./pbx-form.component.scss'],
})
export class PbxFormComponent extends DataManagerFormComponent<PbxModel> implements OnInit {

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    protected ref: NbDialogRef<ShowcaseDialogComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
    this.apiPath = '/ivoip/pbxs';
    this.idKey = 'Owner';
    // this.form = this.makeNewFormGroup();
  }

  ngOnInit() {
    // super.ngOnInit();
    this.formLoad();
  }

  /** Get form data by id from api */
  getFormData(callback: (data: PbxModel[]) => void) {
    this.apiService.get<PbxModel[]>(this.apiPath, { id: this.id, loadForCurrentUser: true, multi: true },
      data => {

        if (data.length > 0) {
          callback(data);
          this.id = data.map(item => item[this.idKey]).join('-');
        } else {
          callback([{
            // Code: '',
            Name: '',
            Description: '',
            ApiKey: '',
            ApiUrl: '',
          }]);
        }
      },
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  makeNewFormGroup(data?: PbxModel): FormGroup {
    const newForm = this.formBuilder.group({
      Owner_old: [''],
      // Code: [''],
      Name: [''],
      Description: [''],
      ApiUrl: ['', Validators.required],
      ApiKey: ['', Validators.required],
      Owner: [''],
    });
    if (data) {
      data[this.idKey + '_old'] = data.Owner;
      newForm.patchValue(data);
    }
    return newForm;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxModel): void { }
  onRemoveFormGroup(index: number): void { }
  goback(): false {
    // this.router.navigate(['/users/user-manager/list']);
    this.ref.close();
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Affter main form update event */
  onAfterUpdateSubmit(newFormData: PbxModel[]) {
    super.onAfterUpdateSubmit(newFormData);
    this.ref.close();
  }

  /** After main form create event */
  onAfterCreateSubmit(newFormData: PbxModel[]) {
    super.onAfterCreateSubmit(newFormData);
    this.ref.close();
  }
}

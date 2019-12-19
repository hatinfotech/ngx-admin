import { Component, OnInit } from '@angular/core';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';
import { PbxDialplanModel } from '../../../../models/pbx-dialplan.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { IvoipService } from '../../ivoip-service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'ngx-dialplan-form',
  templateUrl: './dialplan-form.component.html',
  styleUrls: ['./dialplan-form.component.scss']
})
export class DialplanFormComponent extends IvoipBaseFormComponent<PbxDialplanModel> implements OnInit {

  idKey = 'dialplan_uuid';
  apiPath = '/ivoip/dialplans';
  baseFormUrl = '/ivoip/dialplans/form';

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    public ivoipService: IvoipService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService, ivoipService);
  }

  blockActions: { id: string, text: string, Code: string, Name: string }[];
  select2OptionForBlockActions = {
    placeholder: 'Chọn kiểu chặn...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  ngOnInit() {
    super.ngOnInit();
    this.blockActions = [
      {
        id: 'Reject',
        text: 'Reject',
        Code: 'Reject',
        Name: 'Reject',
      },
      {
        id: 'Busy',
        text: 'Busy',
        Code: 'Busy',
        Name: 'Busy',
      },
      {
        id: 'Hold',
        text: 'Hold',
        Code: 'Hold',
        Name: 'Hold',
      },
    ];
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: PbxDialplanModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: PbxDialplanModel): FormGroup {
    const newForm = this.formBuilder.group({
      dialplan_uuid: [''],
      dialplan_expression: ['', Validators.required],
      accountcode: ['', Validators.required],
      dialplan_enabled: [true],
      dialplan_description: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxDialplanModel): void { }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/ivoip/dialplans/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}

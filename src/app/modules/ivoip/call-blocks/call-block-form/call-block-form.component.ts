import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PbxCallBlockModel } from '../../../../models/pbx-call-block.model';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';
import { IvoipService } from '../../ivoip-service';

@Component({
  selector: 'ngx-call-block-form',
  templateUrl: './call-block-form.component.html',
  styleUrls: ['./call-block-form.component.scss'],
})
export class CallBlockFormComponent extends IvoipBaseFormComponent<PbxCallBlockModel> implements OnInit {

  componentName: string = 'CallBlockFormComponent';
  idKey = 'call_block_uuid';
  apiPath = '/ivoip/call-blocks';
  baseFormUrl = '/ivoip/call-blocks/form';

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
    this.restrict();
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
  executeGet(params: any, success: (resources: PbxCallBlockModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: PbxCallBlockModel): FormGroup {
    const newForm = this.formBuilder.group({
      call_block_uuid: [''],
      call_block_name: [''],
      call_block_number: ['', Validators.required],
      call_block_action: [''],
      call_block_enabled: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxCallBlockModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/ivoip/call-blocks/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}

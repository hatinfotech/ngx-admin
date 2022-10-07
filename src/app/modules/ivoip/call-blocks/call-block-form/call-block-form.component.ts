import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
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
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ivoipService: IvoipService,
    public ref: NbDialogRef<CallBlockFormComponent>,
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
        text: 'Reject (Chặn)',
        Code: 'Reject',
        Name: 'Reject',
      },
      {
        id: 'Busy',
        text: 'Busy (Báo bận)',
        Code: 'Busy',
        Name: 'Busy',
      },
      {
        id: 'Hold',
        text: 'Hold (Báo chờ)',
        Code: 'Hold',
        Name: 'Hold',
      },
    ];
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: PbxCallBlockModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: PbxCallBlockModel): FormGroup {
    const newForm = this.formBuilder.group({
      call_block_uuid: [''],
      call_block_name: [''],
      call_block_number: ['', Validators.required],
      call_block_action: ['Reject', Validators.required],
      call_block_enabled: [true],
      is_call_out: [''],
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
  // goback(): false {
  //   this.router.navigate(['/ivoip/call-blocks/list']);
  //   return false;
  // }
  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/ivoip/call-blocks/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** For popup */
  // getRequestId(callback: (id?: string[]) => void) {
  //   callback(this.inputId);
  // }

}

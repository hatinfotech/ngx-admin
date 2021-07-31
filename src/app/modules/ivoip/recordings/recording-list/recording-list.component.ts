import { Component, OnInit } from '@angular/core';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';
import { PbxRecordingModel } from '../../../../models/pbx-recording.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipService } from '../../ivoip-service';
import { RecordingFormComponent } from '../recording-form/recording-form.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-recording-list',
  templateUrl: './recording-list.component.html',
  styleUrls: ['./recording-list.component.scss'],
})
export class RecordingListComponent extends IvoipBaseListComponent<PbxRecordingModel> implements OnInit {

  // @ViewChild('chooseFile', {static: false}) chooseFile;

  componentName: string = 'RecordingListComponent';
  formPath = '/ivoip/recordings/form';
  apiPath = '/ivoip/recordings';
  idKey = 'recording_uuid';
  formDialog = RecordingFormComponent;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public ivoipService: IvoipService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ivoipService);
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      mode: 'external',
      selectMode: 'multi',
      actions: {
        position: 'right',
      },
      // add: {
      //   addButtonContent: '<i class="nb-edit"></i> <i class="nb-trash"></i> <i class="nb-plus"></i>',
      //   createButtonContent: '<i class="nb-checkmark"></i>',
      //   cancelButtonContent: '<i class="nb-close"></i>',
      // },
      // edit: {
      //   editButtonContent: '<i class="nb-edit"></i>',
      //   saveButtonContent: '<i class="nb-checkmark"></i>',
      //   cancelButtonContent: '<i class="nb-close"></i>',
      // },
      // delete: {
      //   deleteButtonContent: '<i class="nb-trash"></i>',
      //   confirmDelete: true,
      // },
      // pager: {
      //   display: true,
      //   perPage: 99999,
      // },
      columns: {
        recording_name: {
          title: 'Tên',
          type: 'string',
          width: '30%',
        },
        recording_filename: {
          title: 'Tên tệp',
          type: 'string',
          width: '30%',
        },
        file_size: {
          title: 'Kích thước',
          type: 'string',
          width: '10%',
        },
        recording_description: {
          title: 'Mô tả',
          type: 'string',
          width: '30%',
        },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  chooseUploadFile() {
    // this.chooseFile
    return false;
  }

}

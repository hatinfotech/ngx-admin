import { CommonService } from '../../../../services/common.service';
import { FileModel, FileStoreModel } from '../../../../models/file.model';
import { AfterViewInit, Component, EventEmitter, OnChanges, OnInit, SimpleChanges, Input, ViewChild, ElementRef, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { UploaderOptions, UploadFile, UploadInput, humanizeBytes, UploadOutput, UploadStatus } from '../../../../../vendor/ngx-uploader/src/public_api';
import { ApiService } from '../../../../services/api.service';
import { ImagesViewerComponent } from '../images-viewer/images-viewer.component';
import { DialogFormComponent } from '../../../../modules/dialog/dialog-form/dialog-form.component';
import { Emitter } from 'sip.js/lib/api/emitter';

@Component({
  selector: 'ngx-pagination-control',
  templateUrl: './pagination-control.component.html',
  styleUrls: ['./pagination-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PaginationControlComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PaginationControlComponent),
      multi: true,
    },
  ],
})
export class PaginationControlComponent implements OnChanges, AfterViewInit {

  @Input() total: number;
  @Input() page: number = 0;
  @Input() isProcessing = false;
  @Output() pageChange = new EventEmitter<number>();

  pages: any[] = [];

  constructor(
    public commonService: CommonService,
  ) {


  }

  ngOnInit() {
    console.log(this.page, this.total);
  }

  ngAfterViewInit(): void {
    // const page = this.page;
    // this.page = 0;
    // setTimeout(() => {
    //   this.page = page;
    // }, 500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.total) {
      this.pages = [];
      this.pages = Array.from({ length: this.total }, (v, i) => {
        return i + 1;
      });
      const page = this.page;
      this.page = 0;
      setTimeout(() => {
        this.page = page;
      }, 300);
    }
  }

  change(value: any) {
    // this.page = value;
    // console.log(value);
    const oldPage = this.page;
    if (!this.isProcessing) {
      if (value == 'FIRST') {
        this.page = 1;
      } else if (value == 'LAST') {
        this.page = this.total;
      } else if (value == 'PREVIOUS') {
        this.page = (this.page == 1) && this.page || (this.page - 1);
      } else if (value == 'NEXT') {
        this.page = (this.page == this.total) && this.page || (this.page + 1);
      } else {
        this.page = parseInt(value);
      }
      if (oldPage != this.page) {
        this.pageChange.next(this.page);
      }
    }
  }
}

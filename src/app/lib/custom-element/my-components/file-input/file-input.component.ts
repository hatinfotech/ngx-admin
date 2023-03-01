import { CommonService } from './../../../../services/common.service';
import { FileModel, FileStoreModel } from './../../../../models/file.model';
import { AfterViewInit, Component, EventEmitter, OnChanges, OnInit, SimpleChanges, Input, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { UploaderOptions, UploadFile, UploadInput, humanizeBytes, UploadOutput, UploadStatus } from '../../../../../vendor/ngx-uploader/src/public_api';
import { ApiService } from '../../../../services/api.service';
import { ImagesViewerComponent } from '../images-viewer/images-viewer.component';
import { DialogFormComponent } from '../../../../modules/dialog/dialog-form/dialog-form.component';

@Component({
  selector: 'ngx-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FileInputComponent),
      multi: true,
    },
  ],
})
export class FileInputComponent implements ControlValueAccessor, Validator, OnChanges, AfterViewInit {

  /** ngx-uploader */
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  thumbnail: string;
  value?: FileModel;

  @Input() config?: { style?: any };
  @ViewChild('uploadButton') uploadButton: ElementRef;

  apiPath = '/file/files';
  style?: any = {};
  previewStyle: any = {};

  isProcessing = false;

  onChange: (item: any) => void;

  constructor(
    public apiService: ApiService,
    public commonService: CommonService,
  ) {

    /** ngx-uploader */
    this.options = { concurrency: 3, maxUploads: 0, maxFileSize: 1024 * 1024 * 1024 };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
    /** End ngx-uploader */
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
    this.style = { ...this.style, ...this.config.style };
  }

  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
  }

  validate(control: AbstractControl): ValidationErrors {
    // throw new Error('Method not implemented.');
    return null;
  }

  registerOnValidatorChange?(fn: () => void): void {
    // throw new Error('Method not implemented.');
  }

  writeValue(obj: any): void {
    // throw new Error('Method not implemented.');
    console.log(obj);
    this.value = obj;
    if (this.value && this.value.Thumbnail) {
      // this.thumbnail = this.value.Thumbnail;
      // this.style.backgroundImage = 'url(' + this.value.Thumbnail + ')';
      this.previewStyle.backgroundImage = 'url(' + this.value.Thumbnail + ')';
    }
  }
  registerOnChange(fn: (item: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    // throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    // throw new Error('Method not implemented.');
  }

  /** ngx-uploader */
  onUploadOutput(output: UploadOutput): void {
    // console.log(output);
    // console.log(this.files);
    switch (output.type) {
      case 'allAddedToQueue':
        // uncomment this if you want to auto upload files when added
        // const event: UploadInput = {
        //   type: 'uploadAll',
        //   url: this.apiService.buildApiUrl(this.apiPath),
        //   method: 'POST',
        //   data: { foo: 'bar' },
        // };

        let weight = 0;
        for (const file of this.files) {
          weight += file.size;
        }

        // this.apiService.getPromise<FileStoreModel[]>('/file/file-stores', { filter_Type: 'REMOTE', sort_Weight: 'asc', eq_IsAvailable: true, eq_IsUpload: true, requestUploadToken: true, weight, limit: 1 }).then(fileStores => {
        this.commonService.getAvailableFileStores().then(fileStores => {
          const event: UploadInput = {
            type: 'uploadAll',
            url: this.apiService.buildApiUrl(fileStores[0].Path + '/v1/file/files', { token: fileStores[0]['UploadToken'] }),
            method: 'POST',
            data: { foo: 'bar' },
          };
          this.uploadInput.emit(event);
        });

        // this.uploadInput.emit(event);
        break;
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          this.files.push(output.file);
        }
        break;
      case 'uploading':
        if (typeof output.file !== 'undefined') {
          // update current data in files array for uploading file
          const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
          this.files[index] = output.file;
          console.log(`[${output.file.progress.data.percentage}%] Upload file ${output.file.name}`);
        }
        break;
      case 'removed':
        // remove file from array when removed
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
        break;
      case 'dragOver':
        this.dragOver = true;
        break;
      case 'dragOut':
      case 'drop':
        this.dragOver = false;
        break;
      case 'done':
        // The file is downloaded
        console.log('Upload complete', output);
        const respFile: FileModel = output.file.response[0];
        this.value = respFile;
        // this.style.backgroundImage = 'url(' + this.value.Thumbnail + ')';
        this.previewStyle.backgroundImage = 'url(' + this.value.Thumbnail + ')';

        this.onChange && this.onChange(this.value);

        if (this.files.filter(f => f.progress.status !== UploadStatus.Done).length === 0) {
          setTimeout(() => {
            this.files = [];
          }, 10000);
          // this.refresh();
        }
        break;
    }
  }

  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.apiService.buildApiUrl(this.apiPath),
      method: 'POST',
      data: { foo: 'bar' },
    };

    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): boolean {
    this.uploadInput.emit({ type: 'remove', id: id });
    return false;
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }
  /** End ngx-uploader */

  chooseFile() {
    this.uploadButton.nativeElement.click();
    return false;
  }

  uploadByLink() {
    this.commonService.openDialog(DialogFormComponent, {
      context: {
        title: 'Upload hình bằng link',
        width: '600px',
        onInit: async (form, dialog) => {

          return true;
        },
        controls: [
          {
            name: 'Link',
            label: 'Link hình',
            placeholder: 'Link hình',
            type: 'text',
            // initValue: 0,
          },
        ],
        actions: [
          {
            label: 'Trở về',
            icon: 'back',
            status: 'basic',
            action: async () => { return true; },
          },
          {
            label: 'Upload',
            icon: 'cloud-upload-outline',
            status: 'primary',
            action: async (form: FormGroup) => {

              const link = form.get('Link').value;

              if (link) {
                try {
                  this.isProcessing = true;
                  const file = await this.apiService.uploadFileByLink(link);
                  this.isProcessing = false;
                  if (file) {
                    this.value = file;
                    this.previewStyle.backgroundImage = 'url(' + this.value.Thumbnail + ')';
                    this.onChange && this.onChange(this.value);
                  }
                } catch (err) {
                  console.error(err);
                  this.isProcessing = false;
                }
              }


              return true;
            },
          },
        ],
      },
    });
  }

  preview() {
    // window.open(this.value.OriginImage, '_blank');
    // Open photo browser
    this.commonService.openDialog(ImagesViewerComponent, {
      context: {
        images: [this.value?.OriginImage],
        imageIndex: 0
      }
    });
    return false;
  }

  remove() {
    this.value = null;
    this.onChange(null);
    // delete this.style.backgroundImage;
    delete this.previewStyle.backgroundImage;
    return false;
  }
}

import { delay } from 'rxjs/operators';
import { FileModel, FileStoreModel } from './../../../../models/file.model';
import { AfterViewInit, Component, EventEmitter, OnChanges, OnInit, SimpleChanges, Input, ViewChild, ElementRef, forwardRef, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { UploaderOptions, UploadFile, UploadInput, humanizeBytes, UploadOutput, UploadStatus } from '../../../../../vendor/ngx-uploader/src/public_api';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'ngx-files-input',
  templateUrl: './files-input.component.html',
  styleUrls: ['./files-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilesInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FilesInputComponent),
      multi: true,
    },
  ],
})
export class FilesInputComponent implements ControlValueAccessor, Validator, OnChanges, AfterViewInit {

  /** ngx-uploader */
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  thumbnail: string;
  value?: FileModel[];
  fileStoreList: FileStoreModel[];

  @Input() config?: {
    style?: any,
    thumbnailStype?: any,
    colSize?: number,
    onThumbnailClick?: (file: FileModel) => void,
  };
  @Output() onThumbnailClick = new EventEmitter<FileModel>();
  @ViewChild('uploadButton') uploadButton: ElementRef;

  apiPath = '/file/files';
  style?: any = {};
  thumbnailStyle?: any = {};

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
    this.thumbnailStyle = { ...this.thumbnailStyle, ...this.config.thumbnailStype };
  }

  buildThumbnailStyle(image: FileModel) {
    return { ...this.thumbnailStyle, backgroundImage: 'url(' + (image?.Thumbnail) + ')' }
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
    // console.log(obj);
    this.value = !obj ? null : (obj instanceof Array ? obj.filter(img => !!img) : [obj]);
    // if (this.value && this.value.Thumbnail) {
    // this.thumbnail = this.value.Thumbnail;
    // this.style.backgroundImage = 'url(' + this.value.Thumbnail + ')';
    // }
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
        let weight = 0;
        for (const file of this.files) {
          weight += file.size;
        }
        // this.apiService.getPromise<FileStoreModel[]>('/file/file-stores', { filter_Type: 'REMOTE', sort_Weight: 'asc', eq_IsAvailable: true, eq_IsUpload: true, requestUploadToken: true, weight, limit: 1 }).then(fileStores => {
        this.commonService.getAvailableFileStores().then(fileStores => {
          if (fileStores && fileStores.length > 0) {
            const event: UploadInput = {
              type: 'uploadAll',
              url: this.apiService.buildApiUrl(fileStores[0].Path + '/v1/file/files', { token: fileStores[0]['UploadToken'] }),
              method: 'POST',
              data: { foo: 'bar' },
            };
            this.uploadInput.emit(event);
          } else {
            this.commonService.toastService.show('Không tìm thấy file store nào !', 'File Store', { status: 'warning' });
          }
        });

        break;
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          this.files.push(output.file);
          if(!Array.isArray(this.value)) this.value = [];
          this.value.push({ Thumbnail: 'assets/images/no-image-available.png', progress: { percentage: 0 }, uploading: true, file: output.file });
          // output.file['index'] = this.value.length - 1;
        }
        break;
      case 'uploading':
        if (typeof output.file !== 'undefined') {
          // update current data in files array for uploading file
          const index = this.files.findIndex((file) => typeof output?.file !== 'undefined' && file?.id === output?.file?.id);
          this.files[index] = output.file;
          console.log(`[${output.file.progress.data.percentage}%] Upload file ${output?.file?.name}`);
          this.value.find(f => f.file?.id === output?.file?.id)['progress'] = output?.file?.progress?.data;
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
        const imageIndex = this.value.findIndex(f => f.file?.id === output?.file?.id);
        if (respFile) {
          if (!this.value) this.value = [];
          this.value[imageIndex] = respFile;
        } else {
          this.value.splice(imageIndex, 1);
          this.commonService.toastService.show(output.file.response?.logs?.join(', '), 'Hệ thống không thể upload file', {status: 'danger', duration: 5000});
        }
        // this.style.backgroundImage = 'url(' + this.value.Thumbnail + ')';

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

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }
  /** End ngx-uploader */

  chooseFile() {
    this.uploadButton.nativeElement.click();
    return false;
  }

  onFileClick(file: FileModel) {
    // if(this.config.onThumbnailClick) {
    //   this.config.onThumbnailClick(file);
    //   return;
    // }
    // window.open(file.OriginImage, '_blank');

    // Open photo browser


    this.onThumbnailClick.emit(file);
    return false;
  }

  remove(index: number) {
    this.value && this.value.splice(index, 1);

    this.onChange(this.value);
    // delete this.style.backgroundImage;
  }
}

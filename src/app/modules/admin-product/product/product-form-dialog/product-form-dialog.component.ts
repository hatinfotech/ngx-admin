import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-product-form-dialog',
  templateUrl: './product-form-dialog.component.html',
  styleUrls: ['./product-form-dialog.component.scss']
})
export class ProductFormDialogComponent<M> implements OnInit, AfterViewInit {

  @Input() inputMode: 'dialog' | 'page' | 'inline';
  @Input() inputId: string[];
  @Input() onDialogSave: (newData: M[]) => void;
  @Input() onDialogClose: () => void;

  constructor(
    protected ref?: NbDialogRef<ProductFormDialogComponent<M>>,
  ) { }

  ngOnInit() {
  }

  onSave (newData: M[]) {
    this.onDialogSave(newData);
  }

  onClose () {
    this.onDialogClose();
    this.ref.close();
  }


  ngAfterViewInit(): void {
    // const nativeEle = this;
    if (this['ref']) {
      const dialog: NbDialogRef<ProductFormDialogComponent<M>> = this['ref'];
      const nativeEle = dialog.componentRef.location.nativeElement;
      // tslint:disable-next-line: ban
      $(nativeEle).closest('.cdk-global-overlay-wrapper').addClass('dialog');
    }
  }
}

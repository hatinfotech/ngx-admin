import { Component, Input, ViewChild, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { MytableContent } from '../../../lib/custom-element/my-components/my-table/my-table.component';

export interface DialogActionButton {
  label: string;
  icon?: string;
  status?: string;
  disabled?: boolean;
  action?: (item?: DialogActionButton, dialog?: ShowcaseDialogComponent) => any;
};

@Component({
  selector: 'ngx-showcase-dialog',
  templateUrl: 'showcase-dialog.component.html',
  styleUrls: ['showcase-dialog.component.scss'],
})
export class ShowcaseDialogComponent implements AfterViewInit, OnInit {

  @Input() title: string;
  @Input() content: string;
  @Input() footerContent: string;
  @Input() tableContent: MytableContent;
  @Input() onAfterInit: () => void;
  @Input() actions: DialogActionButton[];
  @ViewChild('dialogWrap', { static: true }) dialogWrap: ElementRef;
  @Input() onClose?: () => void;
  loading = false;

  constructor(public ref: NbDialogRef<ShowcaseDialogComponent>) {

  }

  ngOnInit(): void {
    if (this.actions) {
      for (const element of this.actions) {
        // if (!element.action) {
        // }

        if (typeof element.disabled === 'undefined') {
          element.disabled = false;
        }

        const superAction = element.action;
        element.action = async (item?: DialogActionButton, dialog?: ShowcaseDialogComponent) => {
          superAction && (await superAction(item, dialog));
          this.dismiss();
        };
        if (!element.status) {
          element.status = 'info';
        }
      };
    }
  }

  onButtonClick(item: DialogActionButton) {
    item?.action(item, this);
  }

  setLoading(status: boolean) {
    this.loading = status;
  }


  ngAfterViewInit(): void {
    // $(this.dialogWrap.nativeElement).closest('.cdk-overlay-pane').css({ width: '100%' });
    // $('.cdk-overlay-pane:has(ngx-showcase-dialog)').css({ width: '100%' });
    if (this.ref) {
      const dialog: NbDialogRef<ShowcaseDialogComponent> = this.ref;
      const nativeEle = dialog.componentRef.location.nativeElement;
      // tslint:disable-next-line: ban
      $(nativeEle).closest('.cdk-global-overlay-wrapper').addClass('dialog');
    }
    this.onAfterInit && this.onAfterInit();
  }

  dismiss() {
    this.onClose && this.onClose();
    this.ref.close();
  }
}

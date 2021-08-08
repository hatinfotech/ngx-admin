import { Component, Input, ViewChild, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { MytableContent } from '../../../lib/custom-element/my-components/my-table/my-table.component';

@Component({
  selector: 'ngx-showcase-dialog',
  templateUrl: 'showcase-dialog.component.html',
  styleUrls: ['showcase-dialog.component.scss'],
})
export class ShowcaseDialogComponent implements AfterViewInit , OnInit{

  @Input() title: string;
  @Input() content: string;
  @Input() footerContent: string;
  @Input() tableContent: MytableContent;
  @Input() onAfterInit: () => void;
  @Input() actions: { label: string, icon?: string, status?: string, action?: () => any }[];
  @ViewChild('dialogWrap', { static: true }) dialogWrap: ElementRef;
  @Input() onClose?: () => void;

  constructor(public ref: NbDialogRef<ShowcaseDialogComponent>) {
    
  }

  ngOnInit(): void {
    if (this.actions) {
      for(const element of this.actions){
        // if (!element.action) {
        // }
        const superAction  = element.action;
        element.action = async () => {
          console.log(123);
          superAction && (await superAction());
          this.dismiss();
        };
        if (!element.status) {
          element.status = 'info';
        }
      };
    }
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

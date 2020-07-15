import { Component, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-showcase-dialog',
  templateUrl: 'showcase-dialog.component.html',
  styleUrls: ['showcase-dialog.component.scss'],
})
export class ShowcaseDialogComponent implements AfterViewInit {

  @Input() title: string;
  @Input() content: string;
  @Input() actions: { label: string, icon?: string, status?: string, action?: () => void }[];
  @ViewChild('dialogWrap', { static: true }) dialogWrap: ElementRef;

  constructor(public ref: NbDialogRef<ShowcaseDialogComponent>) {
    if (this.actions) {
      this.actions.forEach(element => {
        if (!element.action) {
          element.action = () => {

          };
        }
        if (!element.status) {
          element.status = 'info';
        }
      });
    }
  }
  ngAfterViewInit(): void {
    // $(this.dialogWrap.nativeElement).closest('.cdk-overlay-pane').css({ width: '100%' });
    // $('.cdk-overlay-pane:has(ngx-showcase-dialog)').css({ width: '100%' });
    if (this['ref']) {
      const dialog: NbDialogRef<ShowcaseDialogComponent> = this['ref'];
      const nativeEle = dialog.componentRef.location.nativeElement;
      // tslint:disable-next-line: ban
      $(nativeEle).closest('.cdk-global-overlay-wrapper').addClass('dialog');
    }
  }

  dismiss() {
    this.ref.close();
  }
}

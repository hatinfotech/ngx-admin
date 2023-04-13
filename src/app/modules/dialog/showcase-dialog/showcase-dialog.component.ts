import { CommonService } from './../../../services/common.service';
import { Component, Input, ViewChild, AfterViewInit, ElementRef, OnInit, HostListener, OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { MytableContent } from '../../../lib/custom-element/my-components/my-table/my-table.component';

export interface DialogActionButton {
  label: string;
  icon?: string;
  status?: string;
  outline?: boolean;
  disabled?: boolean;
  focus?: boolean;
  keyShortcut?: string;
  action?: (item?: DialogActionButton, dialog?: ShowcaseDialogComponent) => any;
};

@Component({
  selector: 'ngx-showcase-dialog',
  templateUrl: 'showcase-dialog.component.html',
  styleUrls: ['showcase-dialog.component.scss'],
})
export class ShowcaseDialogComponent implements AfterViewInit, OnInit, OnDestroy {

  @Input() title: string;
  @Input() content: string;
  @Input() footerContent: string;
  @Input() tableContent: MytableContent;
  @Input() onAfterInit: () => void;
  @Input() actions: DialogActionButton[];
  @ViewChild('dialogWrap', { static: true }) dialogWrap: ElementRef;
  @Input() onClose?: (asCase?: string) => void;
  @Input() onKeyboardEvent?: (event: KeyboardEvent, component: ShowcaseDialogComponent) => void;
  loading = false;
  closeCase?: string = 'default';

  constructor(public ref: NbDialogRef<ShowcaseDialogComponent>, public cms?: CommonService) {

  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.cms.dialogStack[this.cms.dialogStack.length - 1] === this.ref) {
      console.log(event.key + ': listen on show case dialog...');
      const action = this.actions.find(f => f.keyShortcut == event.key);
      if (action) {
        action.action(action, this);
        return false;
      }
      if (this.onKeyboardEvent) {
        return this.onKeyboardEvent(event, this);
      }
    }
    return true;
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
          this.dismiss('action');
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
      $(nativeEle).find('.buttons-row button.is-focus')[0]?.focus();
    }
    this.onAfterInit && this.onAfterInit();
  }

  ngOnDestroy(): void {
    this.onClose && this.onClose(this.closeCase);
  }

  dismiss(asCase?: string) {
    this.closeCase = asCase;
    // this.onClose && this.onClose(asCase);
    this.ref.close();
  }
}

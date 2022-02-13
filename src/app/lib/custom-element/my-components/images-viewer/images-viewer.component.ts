import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { DialogActionButton } from '../../../../modules/dialog/showcase-dialog/showcase-dialog.component';
import { MytableContent } from '../my-table/my-table.component';

@Component({
  selector: 'ngx-images-viewer',
  templateUrl: './images-viewer.component.html',
  styleUrls: ['./images-viewer.component.scss']
})
export class ImagesViewerComponent implements AfterViewInit, OnInit {

  @Input() title: string;
  @Input() content: string;
  @Input() footerContent: string;
  @Input() tableContent: MytableContent;
  @Input() onAfterInit: () => void;
  @Input() images: any[];
  @Input() config: any[];
  @Input() imageIndex: number;
  @Input() actions: DialogActionButton[];
  @ViewChild('dialogWrap', { static: true }) dialogWrap: ElementRef;
  @Input() onClose?: () => void;
  loading = false;
  _config: any = {
    btnContainerClass: '',            // The CSS class(es) to be applied to the button container
    btnClass: 'default',              // The CSS class(es) that will be applied to the buttons e.g. default is needed for FontAwesome icons, while not needed for Material Icons
    btnSubClass: 'material-icons',    // The CSS class(es) that will be applied to span elements inside material buttons (a Elements)
    zoomFactor: 0.1,                  // The amount that the scale will be increased by
    containerBackgroundColor: '#ccc', // The color to use for the background. This can provided in hex, or rgb(a).
    wheelZoom: true,                  // If true, the mouse wheel can be used to zoom in
    allowFullscreen: true,            // If true, the fullscreen button will be shown, allowing the user to enter fullscreen mode
    allowKeyboardNavigation: true,    // If true, the left / right arrow keys can be used for navigation
    btnShow: {                        // Control which icons should be visible                
      zoomIn: true,
      zoomOut: true,
      rotateClockwise: true,
      rotateCounterClockwise: true,
      next: true,
      prev: true,
      reset: true
    },
    btnIcons: {                       // The icon classes that will apply to the buttons. By default, font-awesome is used.
      zoomIn: {
        classes: 'fa fa-plus',        // this property will be used for FontAwesome and other libraries to set the icons via the classes - choose one: classes or text
        text: 'zoom_in'               // this property will be used for Material-Icons and similar libraries to set the icons via the text
      },
      zoomOut: {
        classes: 'fa fa-minus',
        text: 'zoom_out'
      },
      rotateClockwise: {
        classes: 'fa fa-repeat',
        text: 'rotate_right'
      },
      rotateCounterClockwise: {
        classes: 'fa fa-undo',
        text: 'rotate_left'
      },
      next: {
        classes: 'fa fa-arrow-right',
        text: 'arrow_right'
      },
      prev: {
        classes: 'fa fa-arrow-left',
        text: 'arrow_left'
      },
      fullscreen: {
        classes: 'fa fa-arrows-alt',
        text: 'fullscreen'
      },
      reset: {
        classes: 'fa fa-undo',
        text: 'restore'
      }
    }
  };

  constructor(public ref: NbDialogRef<ImagesViewerComponent>) {

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
        element.action = async (item?: DialogActionButton, dialog?: ImagesViewerComponent) => {
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
      const dialog: NbDialogRef<ImagesViewerComponent> = this.ref;
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

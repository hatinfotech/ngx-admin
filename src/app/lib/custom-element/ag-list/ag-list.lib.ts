import { ICellRendererParams } from "@ag-grid-community/all-modules";
import { ICellRendererAngularComp } from "@ag-grid-community/angular";
import { Component, OnDestroy } from "@angular/core";

@Component({
    selector: 'btn-cell-renderer',
    template: `
      <button nbButton [outline]="true" status="danger" (click)="btnClickedHandler($event)" size="small" hero fullWidth>
          <nb-icon pack="eva" icon="minus-circle-outline"></nb-icon>{{'Gở' | translate | headtitlecase}}
      </button>
    `,
})
export class BtnCellRenderer implements ICellRendererAngularComp, OnDestroy {
    refresh(params: ICellRendererParams): boolean {
        throw new Error('Method not implemented.');
    }
    private params: any;

    agInit(params: any): void {
        this.params = params;
    }

    btnClickedHandler(event) {
        this.params.clicked(this.params);
    }

    ngOnDestroy() {
        // no need to remove the button click handler 
        // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
    }
}
import { ICellRendererParams } from "@ag-grid-community/all-modules";
import { ICellRendererAngularComp } from "@ag-grid-community/angular";
import { Component, Input, OnDestroy } from "@angular/core";

@Component({
    selector: 'btn-cell-renderer',
    template: `
      <button nbButton [outline]="true" [status]="params.status || 'basic'" (click)="btnClickedHandler($event)" [size]="params.size || 'small'" hero fullWidth>
          <nb-icon *ngIf="params.icon" pack="eva" [icon]="params.icon"></nb-icon>{{params.label || 'BTN' | translate | headtitlecase}}
      </button>
    `,
})
export class BtnCellRenderer implements ICellRendererAngularComp, OnDestroy {
    status = 'basic';
    refresh(params: ICellRendererParams): boolean {
        throw new Error('Method not implemented.');
    }
    public params: any;

    agInit(params: any): void {
        this.params = params;
        if(this.params?.status) {
            this.status = this.params?.status;
        }
    }

    btnClickedHandler(event) {
        return this.params.clicked(this.params);
    }

    ngOnDestroy() {
        // no need to remove the button click handler 
        // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
    }
}
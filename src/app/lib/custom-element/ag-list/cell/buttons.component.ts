import { ICellRendererAngularComp } from "@ag-grid-community/angular";
import { ICellRendererParams } from "@ag-grid-community/core";
import { Component, OnDestroy } from "@angular/core";

@Component({
    selector: 'ag-buttons-cell-renderer',
    template: `
        <button *ngFor="let item of params.buttons" nbButton ghost [outline]="item.outline === false ? false : true" [status]="item.status || 'basic'" (click)="item.action(params, item) && false" [size]="item.size || 'small'">
            <nb-icon *ngIf="item.icon" pack="eva" [icon]="item.icon"></nb-icon>{{item.label || '' | translate | headtitlecase}}
        </button>
    `,
})
export class AgButtonsCellRenderer implements ICellRendererAngularComp, OnDestroy {
    // status = 'basic';
    refresh(params: ICellRendererParams): boolean {
        // throw new Error('Method not implemented.');
        if (this.params.onRefresh) {
            this.params.onRefresh(params, this);
        }
        return true;
    }
    public params: any;

    agInit(params: any): void {
        this.params = params;
        // if (this.params?.status) {
        //     this.status = this.params?.status;
        // }
        if (params.onInit) {
            params.onInit(params, this);
        }
    }

    btnClickedHandler(button: any) {
        return this.params.clicked(button);
    }

    ngOnDestroy() {
        // no need to remove the button click handler 
        // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
    }
}
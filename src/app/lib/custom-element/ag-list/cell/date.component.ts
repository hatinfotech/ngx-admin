import { ICellRendererAngularComp } from "@ag-grid-community/angular";
import { ICellRendererParams } from "@ag-grid-community/core";
import { Component, OnDestroy } from "@angular/core";

@Component({
    selector: 'ag-date-cell-renderer',
    template: `
      <span>{{params.value | date: 'short'}}</span>
    `,
})
export class AgDateCellRenderer implements ICellRendererAngularComp, OnDestroy {
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

    // btnClickedHandler(event) {
    //     return this.params.clicked(this.params);
    // }

    ngOnDestroy() {
        // no need to remove the button click handler 
        // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
    }
}
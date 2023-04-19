import { ICellRendererAngularComp } from "@ag-grid-community/angular";
import { Component, OnDestroy } from "@angular/core";
import { CommonService } from "../../../../services/common.service";
import { CurrencyPipe } from "@angular/common";
import { ICellRendererParams } from "@ag-grid-community/core";

@Component({
    selector: 'ag-currency-cell-renderer',
    template: `
      <span>{{params.value | currency:'VND'}}</span>
    `,
    providers: [CurrencyPipe]
})
export class AgCurrencyCellRenderer implements ICellRendererAngularComp, OnDestroy {
    constructor(
        public cms: CommonService,
    ) {

    }
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
        if (params.onInit) {
            params.onInit(params, this);
        }
    }
    ngOnDestroy() {
        // no need to remove the button click handler 
        // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
    }
}
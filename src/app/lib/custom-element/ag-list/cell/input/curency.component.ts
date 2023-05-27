import { ICellRendererAngularComp } from "@ag-grid-community/angular";
import { Component, OnDestroy } from "@angular/core";
import { CommonService } from "../../../../../services/common.service";
import { CurrencyPipe, DecimalPipe } from "@angular/common";
import { ICellRendererParams } from "@ag-grid-community/core";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CurrencyMaskConfig } from "ng2-currency-mask";

@Component({
    selector: 'ag-currency-cell-input',
    template: `
      <input type="text" nbInput [status]="params.status || 'basic'" [formControl]="inputControl" fullWidth placeholder="" currencyMask [options]="curencyFormat">
    `,
    providers: [DecimalPipe]
})
export class AgCurrencyCellInput implements ICellRendererAngularComp, OnDestroy {

    towDigitsInputMask = this.cms.createFloatNumberMaskConfig({
        digitsOptional: false,
        digits: 2
    });
    curencyFormat: CurrencyMaskConfig = this.cms.getCurrencyMaskConfig();
    inputControl: FormControl = new FormControl();

    protected destroy$: Subject<void> = new Subject<void>();

    constructor(
        public cms: CommonService,
    ) {

    }
    refresh(params: ICellRendererParams): boolean {
        // throw new Error('Method not implemented.');
        if (this.params.onRefresh) {
            this.params.onRefresh(params, this);
        }
        this.inputControl.setValue(params.value, { emitEvent: false });
        return true;
    }
    public params: any;

    agInit(params: any): void {
        this.params = params;
        if (params.onInit) {
            params.onInit(params, this);
        }
        this.inputControl.setValue(this.params.value);
        this.inputControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
            //     let colId = this.params.column.colId;
            //     this.params.node.setDataValue(colId, value);
            //     this.params.changed(value, this.params);
            this.params.status = 'warning';
            this.cms.takeUntilCallback('ag-currency-stop-typing', 1000, () => {
                this.onChangeHandler(null);
            });
        });
    }

    onChangeHandler(event) {
        let value = this.inputControl.value;
        let colId = this.params.column.colId;
        this.params.node.setDataValue(colId, value);
        return this.params.changed && this.params.changed(value, this.params);
    }

    ngOnDestroy() {
        // no need to remove the button click handler 
        // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
        this.destroy$.next();
        this.destroy$.complete();
    }
}

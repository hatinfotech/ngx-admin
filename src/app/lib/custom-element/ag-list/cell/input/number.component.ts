import { ICellRendererAngularComp } from "@ag-grid-community/angular";
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { CommonService } from "../../../../../services/common.service";
import { CurrencyPipe, DecimalPipe } from "@angular/common";
import { ICellRendererParams, IRowNode } from "@ag-grid-community/core";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'ag-number-cell-input',
    template: `
      <input type="text" nbInput #inputEle [status]="params.status || 'basic'" [formControl]="inputControl" fullWidth placeholder="" [inputMask]="towDigitsInputMask">
    `,
    providers: [DecimalPipe]
})
export class AgNumberCellInput implements ICellRendererAngularComp, OnDestroy, AfterViewInit {

    @ViewChild('inputEle') inputEle: ElementRef;

    towDigitsInputMask = this.cms.createFloatNumberMaskConfig({
        digitsOptional: false,
        digits: 2
    });
    inputControl: FormControl = new FormControl();

    protected destroy$: Subject<void> = new Subject<void>();

    constructor(
        public cms: CommonService,
    ) {
    }

    ngAfterViewInit(): void {
        if (this.params.keyup) {
            $(this.inputEle.nativeElement).keyup(e => {
                let value = this.inputControl.value;
                this.params.keyup(value, this.params);
            });
        }
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

        this.towDigitsInputMask = this.cms.createFloatNumberMaskConfig({
            digitsOptional: false,
            digits: this.params.digits || 2
        });

        if (params.onInit) {
            params.onInit(params, this);
        }
        this.inputControl.setValue(this.params.value);
        // this.inputControl.valueChanges.subscribe(value => {
        //     let colId = this.params.column.colId;
        //     this.params.node.setDataValue(colId, value);
        //     this.params.changed(value, this.params);
        // });
        setTimeout(() => {
            this.inputControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
                //     let colId = this.params.column.colId;
                //     this.params.node.setDataValue(colId, value);
                //     this.params.changed(value, this.params);
                // if (typeof value != 'undefined') {
                this.params.status = 'warning';
                // }
                if (this.params.takeUntilDelay === 0) {
                    this.onChangeHandler(null);
                } else {
                    const nodeId = (this.params.node as IRowNode).id;
                    console.log('node id', nodeId);
                    this.cms.takeUntilCallback('ag-number-stop-typing-' + nodeId, this.params.takeUntilDelay || 1000, () => {
                        this.onChangeHandler(null);
                    });
                }
            });
        }, 500);
    }

    onChangeHandler(event) {
        let value = this.inputControl.value;
        let colId = this.params.column.colId;
        this.params.node.setDataValue(colId, value);
        if (!this.params.changed) {
            this.params.status = 'success';
        }
        return this.params.changed && this.params.changed(value, this.params);
    }

    ngOnDestroy() {
        // no need to remove the button click handler 
        // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
        this.destroy$.next();
        this.destroy$.complete();
    }
}

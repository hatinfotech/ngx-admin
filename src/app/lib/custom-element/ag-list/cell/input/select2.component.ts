import { ICellRendererAngularComp } from "@ag-grid-community/angular";
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { CommonService } from "../../../../../services/common.service";
import { CurrencyPipe, DecimalPipe } from "@angular/common";
import { ICellRendererParams } from "@ag-grid-community/core";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Select2Option } from "../../../select2/select2.component";

@Component({
    selector: 'ag-select2-cell-input',
    template: `
      <ngx-select2 #inputEle [formControl]="inputControl" [select2Option]="select2Option" [data]="list" (selectChange)="onChangeHandler($event)"></ngx-select2>
    `,
    providers: [DecimalPipe]
})
export class AgSelect2CellInput implements ICellRendererAngularComp, OnDestroy, AfterViewInit {

    @ViewChild('inputEle') inputEle: ElementRef;

    list: any[];
    select2Option: Select2Option = {
        ...this.cms.select2OptionForTemplate,
    }
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
        if (this.params['list']) {
            this.list = this.params['list'];
        }
        if (params.onInit) {
            params.onInit(params, this);
        }
        this.inputControl.setValue(this.params.value);
        // this.inputControl.valueChanges.subscribe(value => {
        //     let colId = this.params.column.colId;
        //     this.params.node.setDataValue(colId, value);
        //     this.params.changed(value, this.params);
        // });
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

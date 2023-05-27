import { ICellRendererAngularComp } from "@ag-grid-community/angular";
import { GridApi, ICellRendererParams } from "@ag-grid-community/core";
import { Component, OnDestroy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";

@Component({
    selector: 'ag-checkbox-cell-renderer',
    template: `
      <nb-checkbox [disabled]="params.disabled" [formControl]="checkBoxControl" (change)="onChangeHandler($event)"></nb-checkbox>
    `,
})
export class AgCheckboxCellRenderer implements ICellRendererAngularComp, OnDestroy {
    status = 'basic';
    refresh(params: ICellRendererParams): boolean {
        this.checkBoxControl.setValue(params.value, { emitEvent: false });
        return true;
    }
    public params: { api: GridApi, [key: string]: any };

    checkBoxControl: FormControl = new FormControl();
    protected destroy$: Subject<void> = new Subject<void>();

    agInit(params: any): void {
        this.params = params;
        this.checkBoxControl.setValue(this.params.value);
        if (this.params.disabled) {
            this.checkBoxControl.disable();
        }
    }

    onChangeHandler(event) {
        let checked = event.target.checked;
        let colId = this.params.column.colId;
        this.params.node.setDataValue(colId, checked);
        return this.params.changed(checked, this.params);
    }

    ngOnDestroy() {
        // no need to remove the button click handler 
        // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
        this.destroy$.next();
        this.destroy$.complete();
    }
}
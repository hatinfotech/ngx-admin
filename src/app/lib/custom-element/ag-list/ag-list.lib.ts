import { takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Column, GridApi, ICellRendererParams } from "@ag-grid-community/all-modules";
import { ICellRendererAngularComp } from "@ag-grid-community/angular";
import { Component, Input, OnDestroy } from "@angular/core";
import { Subject } from 'rxjs';

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
        // throw new Error('Method not implemented.');
        return true;
    }
    public params: any;

    agInit(params: any): void {
        this.params = params;
        if (this.params?.status) {
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

@Component({
    selector: 'checkbox-cell-renderer',
    template: `
      <nb-checkbox [formControl]="checkBoxControl" (change)="onChangeHandler($event)"></nb-checkbox>
    `,
})
export class CkbCellRenderer implements ICellRendererAngularComp, OnDestroy {
    status = 'basic';
    refresh(params: ICellRendererParams): boolean {
        // this.checkBoxControl.setValue(params.value, {emitEvent: false});
        return true;
    }
    public params: {api: GridApi, [key: string]: any};

    checkBoxControl: FormControl = new FormControl();
    protected destroy$: Subject<void> = new Subject<void>();

    agInit(params: any): void {
        this.params = params;
        this.checkBoxControl.setValue(this.params.value);
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
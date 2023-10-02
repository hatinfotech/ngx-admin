import { ICellRendererAngularComp } from "@ag-grid-community/angular";
import { Component, OnDestroy } from "@angular/core";
import { CommonService } from "../../../../services/common.service";
import { ICellRendererParams } from "@ag-grid-community/core";

@Component({
    selector: 'ag-text-cell-renderer',
    template: `
        <ng-container *ngIf="params.value; else elseContainer">
            <span [innerHTML]="params.value | objectstext"></span>
        </ng-container>
        <ng-template #elseContainer>
            <button *ngIf="params.coalesceButton" nbButton ghost [outline]="params.coalesceButton.outline" [disabled]="params.coalesceButton?.disabled(params.node.data, params)" [status]="params.coalesceButton.status || 'basic'" (click)="params.coalesceButton.action(params) && false" [size]="params.coalesceButton.size || 'small'">
                <ng-container *ngIf="params.coalesceButton.title; else elseBlock">    
                    <nb-icon *ngIf="params.coalesceButton.icon" pack="eva" [icon]="params.coalesceButton.icon" [nbTooltip]="params.coalesceButton.title"></nb-icon><ng-container *ngIf="item.label">{{params.coalesceButton.label || '' | translate | headtitlecase}}</ng-container>
                </ng-container>
                <ng-template #elseBlock>   
                    <nb-icon *ngIf="params.coalesceButton.icon" pack="eva" [icon]="params.coalesceButton.icon"></nb-icon><ng-container *ngIf="params.coalesceButton.label">{{params.coalesceButton.label || '' | translate | headtitlecase}}</ng-container>
                </ng-template>
            </button>
        </ng-template>
    `,
})
export class AgTextCellRenderer implements ICellRendererAngularComp, OnDestroy {
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

    // btnClickedHandler(event) {
    //     return this.params.clicked(this.params);
    // }

    ngOnDestroy() {
        // no need to remove the button click handler 
        // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
    }
}
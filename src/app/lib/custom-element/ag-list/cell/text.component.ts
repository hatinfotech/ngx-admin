import { ICellRendererAngularComp } from "@ag-grid-community/angular";
import { Component, OnDestroy } from "@angular/core";
import { CommonService } from "../../../../services/common.service";
import { ICellRendererParams } from "@ag-grid-community/core";

@Component({
    selector: 'ag-text-cell-renderer',
    template: `
        <ng-container *ngIf="params.value; else elseContainer">
            <span>{{params.value | objectstext}}</span>
        </ng-container>
        <ng-template #elseContainer>
            <button *ngIf="params.colaseButton" nbButton ghost [outline]="params.colaseButton.outline" [status]="params.colaseButton.status || 'basic'" (click)="params.colaseButton.action(params) && false" [size]="params.colaseButton.size || 'small'">
                <ng-container *ngIf="params.colaseButton.title; else elseBlock">    
                    <nb-icon *ngIf="params.colaseButton.icon" pack="eva" [icon]="params.colaseButton.icon" [nbTooltip]="params.colaseButton.title"></nb-icon><ng-container *ngIf="item.label">{{params.colaseButton.label || '' | translate | headtitlecase}}</ng-container>
                </ng-container>
                <ng-template #elseBlock>   
                    <nb-icon *ngIf="params.colaseButton.icon" pack="eva" [icon]="params.colaseButton.icon"></nb-icon><ng-container *ngIf="params.colaseButton.label">{{params.colaseButton.label || '' | translate | headtitlecase}}</ng-container>
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
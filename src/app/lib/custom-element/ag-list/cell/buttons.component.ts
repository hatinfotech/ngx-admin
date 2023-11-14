import { ICellRendererAngularComp } from "@ag-grid-community/angular";
import { ICellRendererParams } from "@ag-grid-community/core";
import { Component, OnDestroy } from "@angular/core";
import { AgCellButton } from "./button.component";

@Component({
    selector: 'ag-buttons-cell-renderer',
    template: `
        <button *ngFor="let item of params.buttons" nbButton ghost [outline]="item.outline === false ? false : true" [status]="item.status || 'basic'" (click)="itemAction(params, item) && false" [size]="item.size || 'small'" [disabled]="item.processing">
            <ng-container *ngIf="item.title; else elseBlock">    
                <nb-icon *ngIf="item.icon" pack="eva" [icon]="item.icon" [nbTooltip]="item.title"></nb-icon><ng-container *ngIf="item.label">{{item.label || '' | translate | headtitlecase}}</ng-container>
            </ng-container>
            <ng-template #elseBlock>   
                <nb-icon *ngIf="item.icon" pack="eva" [icon]="item.icon"></nb-icon><ng-container *ngIf="item.label">{{item.label || '' | translate | headtitlecase}}</ng-container>
            </ng-template>
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

        if (params.buttons) {
            for (const button of this.params.buttons) {
                if (typeof button.process == 'undefined') {
                    button.processing = false;
                }
            }
        }
    }

    btnClickedHandler(button: any) {
        return this.params.clicked(button);
    }

    ngOnDestroy() {
        // no need to remove the button click handler 
        // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
    }

    async itemAction(params, item: AgCellButton) {
        if (item.action) {
            item.processing = true;
            await item.action(params, item).then(rs => {
                item.processing = false;
                return rs;
            }).catch(err => {
                item.processing = false;
                return Promise.reject(err);
            });
        }
    }
}
import { ICellRendererAngularComp } from "@ag-grid-community/angular";
import { Component, OnDestroy } from "@angular/core";
import { CommonService } from "../../../../services/common.service";
import { ICellRendererParams } from "@ag-grid-community/core";

@Component({
    selector: 'ag-images-cell-renderer',
    template: `
      <div *ngFor="let item of params.value" class="thumbnail" [ngStyle]="{backgroundImage: 'url('+(item?.Thumbnail || item)+')'}" (click)="params?.click(item, params.node.data)"></div>
    `,
    styles: [
        `
        .thumbnail {
            width: 100%;
            height: 100%;
            border-radius: 3px;
            background-repeat: no-repeat;
            background-size: cover;
            cursor: pointer;
        }
        img {
            height: 100%;
            overflow: hidden;
        }        
    `
    ]
})
export class AgImagesCellRenderer implements ICellRendererAngularComp, OnDestroy {
    
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
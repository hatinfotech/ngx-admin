import { ICellRendererAngularComp } from "@ag-grid-community/angular";
import { Component, OnDestroy } from "@angular/core";
import { CommonService } from "../../../../services/common.service";
import { ICellRendererParams } from "@ag-grid-community/core";

export interface AgComponetTagModel {
    id: string;
    text: string;
    tip: string;
    type?: string;
    icon?: string;
    iconPack?: string;
    status?: string;
    [key: string]: any;
}
@Component({
    selector: 'ag-tags-cell-renderer',
    template: `
    <!-- <nb-tag-list>
        <nb-tag *ngFor="let tag of params.tags" [text]="tag.label" (click)="tag.action(params, tag)" appearance="outline" size="tiny" [status]="tag.status || 'basic'" [size]="tag.size || 'small'" style="cursor: pointer"></nb-tag>
    </nb-tag-list> -->
    <div>
        <a  (click)="tag.action(params, tag)" *ngFor="let tag of params.tags" class="tag nowrap" [ngStyle]="{'background-color': tag?.status == 'primary' ? '#3366ff' : (tag?.status == 'danger' ? '#ff708d' : (tag?.status == 'warning' ? '#b86e00' : false))}" [ngClass]="{'nowrap': nowrap}" nbTooltip="{{renderToolTip(tag)}}"><nb-icon icon="{{tag.icon || 'pricetags'}}" pack="{{tag.iconPack || 'eva'}}"></nb-icon> {{labelAsText(tag) || tag.id}}</a>
    </div>
    `,
    styles: [
        `
        a.tag {
            line-height: 1rem;
            cursor: pointer;
        }
        `
    ]
})
export class AgTagsCellRenderer implements ICellRendererAngularComp, OnDestroy {

    public params: any;
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

    labelAsText(tag: AgComponetTagModel) {
        return (this.cms.voucherTypeMap[tag.type]?.symbol || tag.type) + ':' + tag.id;
    };

    renderToolTip(tag: AgComponetTagModel) {
        return (tag.type ? `${this.cms.voucherTypeMap[tag.type]?.text || tag.type}: ` : '') + tag.text;
    }

    agInit(params: any): void {
        this.params = params;
        // if (this.params?.status) {
        //     this.status = this.params?.status;
        // }
        if (params.onInit) {
            params.onInit(params, this);
        }
    }

    btnClickedHandler(button: any) {
        return this.params.clicked(button);
    }

    ngOnDestroy() {
        // no need to remove the button click handler 
        // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
    }
}
import { ICellRendererAngularComp } from "@ag-grid-community/angular";
import { Component, OnDestroy } from "@angular/core";
import { CommonService } from "../../../../../services/common.service";
import { ICellRendererParams } from "@ag-grid-community/core";

export interface AgComponetTagModel {
    id: string;
    text: string;
    toolTip?: string;
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
    <div>
        <!-- <a  (click)="tagClickedHandler(tag)" *ngFor="let tag of tags" class="tag nowrap" [ngStyle]="{'background-color': tag?.status == 'primary' ? '#3366ff' : (tag?.status == 'danger' ? '#ff708d' : (tag?.status == 'warning' ? '#b86e00' : false))}" [ngClass]="{'nowrap': nowrap}" nbTooltip="{{tag.toolTip}}"><nb-icon *ngIf="tag.icon" icon="{{tag.icon}}" pack="{{tag.iconPack || 'eva'}}"></nb-icon> {{tag.label}}</a> -->
        <a  (click)="tagClickedHandler(tag)" *ngFor="let tag of tags" class="tag nowrap text-color-{{tag.status}}-default" [ngClass]="{'nowrap': nowrap}" nbTooltip="{{tag.toolTip}}">
            <nb-icon icon="{{tag.icon || 'pricetags-outline'}}" pack="{{tag.iconPack || 'eva'}}"></nb-icon> {{tag.label}}
        </a>
        <!-- <ngx-tag *ngFor="let tag of tags" [status]="tag?.status" [icon]="tag.icon" [iconPack]="tag.iconPack" [label]="tag.label" [nowrap]="nowrap" [toolTip]="tag.toolTip"></ngx-tag> -->
    </div>
    `,
    // styles: [
        
    // ],
    styleUrls: ['./tags.component.scss'],
})
export class AgTagsCellRenderer implements ICellRendererAngularComp, OnDestroy {

    public params: any;
    public tags = [];
    constructor(
        public cms: CommonService,
    ) {

    }
    refresh(params: ICellRendererParams): boolean {
        // throw new Error('Method not implemented.');
        if (this.params.onRefresh) {
            this.params.onRefresh(params, this);
            this.preapraeTags(params?.value);
        }
        return true;
    }

    labelAsText(tag: AgComponetTagModel) {
        if (tag.label) return tag.label;
        // if (tag.text) return tag.text;
        let voucherType = this.cms.voucherTypeMap[tag.type];
        let type = '';
        if (!voucherType) {
            const prefix = tag.id?.substring(0, 3);
            const matched = Object.keys(this.cms.voucherTypeMap).find(f => this.cms.voucherTypeMap[f].prefix == prefix);
            if (matched) {
                voucherType = this.cms.voucherTypeMap[matched];
            }
        }
        type = `${voucherType?.symbol || tag.type || ''}`;
        return (type ? `${type}:` : '') + tag.id;
    };

    renderToolTip(tag: AgComponetTagModel) {
        if (tag.toolTip) return tag.toolTip;
        let voucherType = this.cms.voucherTypeMap[tag.type];
        let type = '';
        if (!voucherType) {
            const prefix = tag.id?.substring(0, 3);
            const matched = Object.keys(this.cms.voucherTypeMap).find(f => this.cms.voucherTypeMap[f].prefix == prefix);
            if (matched) {
                voucherType = this.cms.voucherTypeMap[matched];
            }
        }
        type = `${voucherType?.text || tag.type || ''}`;
        return (type ? `[${type}]: ` : '') + tag.text;
    }

    preapraeTags(tags: any[]) {
        const renderTags = [];
        if (Array.isArray(tags)) {
            for (const inputTag of tags) {
                let tag = null;
                if (typeof inputTag == 'string') {
                    tag = {
                        id: inputTag,
                        text: inputTag,
                        type: '',
                    };
                } else {
                    let voucherType = this.cms.voucherTypeMap[inputTag.type];
                    tag = {
                        ...inputTag,
                        toolTip: this.renderToolTip(inputTag),
                        label: this.labelAsText(inputTag),
                        status: voucherType?.status
                    };
                }
                renderTags.push(tag);
            }
        }
        this.tags = renderTags;
    }

    agInit(params: any): void {
        this.params = params;
        // if (this.params?.status) {
        //     this.status = this.params?.status;
        // }
        if (params.onInit) {
            this.preapraeTags(params?.value);
            params.onInit(params, this);
        }
    }

    tagClickedHandler(tag: any) {
        return this.params.onClick && this.params.onClick(tag);
    }

    ngOnDestroy() {
        // no need to remove the button click handler 
        // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
    }
}
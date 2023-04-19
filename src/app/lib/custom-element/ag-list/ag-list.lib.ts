import { takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Column, GridApi, IHeaderParams } from "@ag-grid-community/core";
import { ICellRendererAngularComp, IHeaderAngularComp } from "@ag-grid-community/angular";
import { Component, ElementRef, Input, OnDestroy, ViewChild } from "@angular/core";
import { Subject } from 'rxjs';
import { ICellRendererParams } from '@ag-grid-community/core';
import { CommonService } from '../../../services/common.service';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'ag-text-cell-renderer',
    template: `
      <span>{{params.value | objectstext}}</span>
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
@Component({
    selector: 'ag-id-cell-renderer',
    template: `
      <span>{{params.value | objectsid}}</span>
    `,
})
export class AgIdCellRenderer implements ICellRendererAngularComp, OnDestroy {
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
@Component({
    selector: 'ag-currency-cell-renderer',
    template: `
      <span>{{params.value | currency:'VND'}}</span>
    `,
    providers: [CurrencyPipe]
})
export class AgCurrencyCellRenderer implements ICellRendererAngularComp, OnDestroy {
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
    ngOnDestroy() {
        // no need to remove the button click handler 
        // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
    }
}

@Component({
    selector: 'ag-button-cell-renderer',
    template: `
      <button nbButton [outline]="params.outline === false && false || true" [status]="params.status || 'basic'" (click)="btnClickedHandler($event)" [size]="params.size || 'small'" hero fullWidth>
          <nb-icon pack="eva" [icon]="params.icon || 'external-link-outline'"></nb-icon>{{params.label || '' | translate | headtitlecase}}
      </button>
    `,
})
export class AgButtonCellRenderer implements ICellRendererAngularComp, OnDestroy {
    status = 'basic';
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
        if (this.params?.status) {
            this.status = this.params?.status;
        }
        if (params.onInit) {
            params.onInit(params, this);
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
    selector: 'ag-buttons-cell-renderer',
    template: `
    <nb-button-group ghost>
        <button *ngFor="let item of params.buttons" nbButton [outline]="item.outline === false && false || true" [status]="item.status || 'basic'" (click)="item.action(params, item)" [size]="item.size || 'small'" hero>
            <nb-icon *ngIf="item.icon" pack="eva" [icon]="item.icon"></nb-icon>{{item.label || '' | translate | headtitlecase}}
        </button>
    </nb-button-group>
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
    }

    btnClickedHandler(button: any) {
        return this.params.clicked(button);
    }

    ngOnDestroy() {
        // no need to remove the button click handler 
        // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
    }
}

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

@Component({
    selector: 'ag-date-cell-renderer',
    template: `
      <span>{{params.value | date: 'short'}}</span>
    `,
})
export class AgDateCellRenderer implements ICellRendererAngularComp, OnDestroy {
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
    }

    // btnClickedHandler(event) {
    //     return this.params.clicked(this.params);
    // }

    ngOnDestroy() {
        // no need to remove the button click handler 
        // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
    }
}

@Component({
    selector: 'ag-checkbox-cell-renderer',
    template: `
      <nb-checkbox [formControl]="checkBoxControl" (change)="onChangeHandler($event)"></nb-checkbox>
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

export interface ICustomHeaderParams {
    menuIcon: string;
    enabledCheckbox: boolean;
}

@Component({
    selector: 'app-custom-header',
    template: `
      <div>
        <div style="display: flex; flex-direcrtion: row">
            <div *ngIf="params.enabledCheckbox">
                <nb-checkbox [formControl]="checkBoxControl" (change)="onSelectAllChange($event)"></nb-checkbox>
            </div>
            <div style="flex: 1; display: flex; align-items: center;">
                <div  *ngIf="params.enableMenu" #menuButton class="customHeaderMenuButton" (click)="onMenuClicked($event)">
                    <i class="fa {{ params.menuIcon }}"></i>
                </div>
                <div class="customHeaderLabel">{{ params.displayName }}</div>
                <div *ngIf="params.enableSorting" (click)="onSortRequested('asc', $event)" [ngClass]="ascSort" class="customSortDownLabel">
                    <i class="fa fa-long-arrow-alt-down"></i>
                </div>
                <div *ngIf="params.enableSorting" (click)="onSortRequested('desc', $event)" [ngClass]="descSort" class="customSortUpLabel">
                    <i class="fa fa-long-arrow-alt-up"></i>
                </div>
                <div *ngIf="params.enableSorting" (click)="onSortRequested('', $event)" [ngClass]="noSort" class="customSortRemoveLabel">
                    <i class="fa fa-times"></i>
                </div>
        
            </div>
        </div>
      </div>
    `,
    styles: [
        `
        .customHeaderMenuButton,
        .customHeaderLabel,
        .customSortDownLabel,
        .customSortUpLabel,
        .customSortRemoveLabel {
          float: left;
          margin: 0 0 0 3px;
        }
  
        .customSortUpLabel {
          margin: 0;
        }
  
        .customSortRemoveLabel {
          font-size: 11px;
        }
  
        .active {
          color: cornflowerblue;
        }
      `,
    ],
})
export class CustomHeader implements IHeaderAngularComp {
    public params!: IHeaderParams & ICustomHeaderParams;

    public ascSort = 'inactive';
    public descSort = 'inactive';
    public noSort = 'inactive';

    public checkBoxControl: FormControl = new FormControl();

    @ViewChild('menuButton', { read: ElementRef }) public menuButton!: ElementRef;

    agInit(params: IHeaderParams & ICustomHeaderParams): void {
        this.params = params;
        // this.params.enableMenu = true;
        params.column.addEventListener(
            'sortChanged',
            this.onSortChanged.bind(this)
        );
        // params.column.addEventListener(
        //     'filterChanged',
        //     this.onFilterChanged.bind(this)
        // );

        this.onSortChanged();
    }

    onMenuClicked() {
        this.params.showColumnMenu(this.menuButton.nativeElement);
    }

    onSortChanged() {
        this.ascSort = this.descSort = this.noSort = 'inactive';
        if (this.params.column.isSortAscending()) {
            this.ascSort = 'active';
        } else if (this.params.column.isSortDescending()) {
            this.descSort = 'active';
        } else {
            this.noSort = 'active';
        }
    }
    // onFilterChanged() {
    //     this.checkBoxControl.patchValue(false);
    // }

    onSortRequested(order: 'asc' | 'desc' | null, event: any) {
        this.params.setSort(order, event.shiftKey);
    }

    refresh(params: IHeaderParams) {
        return false;
    }

    onSelectAllChange(event) {
        let checked = event.target.checked;
        console.log('Select all: ', checked);
        this.params.api.forEachNodeAfterFilter((node, index) => {
            node.setDataValue(this.params.column.getColId(), checked);
        });
    }


    // New commonents


}
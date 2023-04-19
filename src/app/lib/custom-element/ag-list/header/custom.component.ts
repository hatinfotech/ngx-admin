import { IHeaderAngularComp } from "@ag-grid-community/angular";
import { IHeaderParams } from "@ag-grid-community/core";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";

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
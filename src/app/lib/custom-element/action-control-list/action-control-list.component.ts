import { Component, Input } from '@angular/core';
import { ActionControl } from '../../../interface/action-control.interface';

@Component({
  selector: 'ngx-action-control-list',
  template: `
    <div class="action-list">
      <ng-template ngFor let-actionBtn [ngForOf]="list" let-i="index">
        <button class="action-list-item" *ngIf="actionBtn.type == 'button'" nbButton
        [status]="actionBtn.status" hero [size]="actionBtn.size"
          [disabled]="actionBtn.disabled()" [title]="actionBtn.title" (click)="actionBtn.click($event, option)">
          <nb-icon *ngIf="!hideIcon" pack="eva" [icon]="actionBtn.icon"></nb-icon>
          <span *ngIf="!!actionBtn.label && !hideLabel">{{actionBtn.label}}</span>
        </button>
        <input class="action-list-item" *ngIf="actionBtn.type == 'text'" nbInput type="text" [fieldSize]="actionBtn.size"
          [status]="actionBtn.status" [disabled]="actionBtn.disabled()" [placeholder]="actionBtn.title"
          (change)="actionBtn.change($event, option)">
      </ng-template>
    </div>
  `,
})
export class ActionControlListComponent {
  @Input() list: ActionControl[];
  @Input() hideLabel: boolean = false;
  @Input() hideIcon: boolean = false;
  @Input() option: any;
}

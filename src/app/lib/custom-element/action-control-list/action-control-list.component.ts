import { takeUntil, filter } from 'rxjs/operators';
import { Component, Input, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActionControl, ActionControlListOption } from './action-control.interface';
import { CommonService } from '../../../services/common.service';
import { NbLayoutScrollService } from '@nebular/theme';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-action-control-list',
  templateUrl: './action-control-list.component.html',
  styleUrls: ['./action-control-list.component.scss'],
})
export class ActionControlListComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() list: ActionControl[];
  @Input() hideLabel: boolean = false;
  @Input() hideIcon: boolean = false;
  @Input() option: ActionControlListOption;

  @ViewChild('actionList') actionListEle: ElementRef;
  protected destroy$: Subject<void> = new Subject<void>();

  constructor(
    public cms: CommonService,
    public layoutScrollService: NbLayoutScrollService,
  ) {
    console.log('constructor');
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    // tslint:disable-next-line: ban
    const helpdeskHeaderEle = $(this.actionListEle.nativeElement);

    let checkpoint = null;
    this.layoutScrollService.onScroll().pipe(takeUntil(this.destroy$), filter(position => this.actionListEle.nativeElement.offsetParent != null)).subscribe(position => {
      // console.log(helpdeskHeaderEle.is(':visible'));
      const helpdeskHeaderOffset = helpdeskHeaderEle.offset();
      if (!checkpoint && helpdeskHeaderOffset.top < 50) {
        checkpoint = helpdeskHeaderOffset.top;
        this.cms.pushHeaderActionControlList(this.list);
      }

      if (checkpoint && helpdeskHeaderOffset.top > checkpoint) {
        this.cms.popHeaderActionControlList();
        checkpoint = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.cms.pushHeaderActionControlList([]);
    this.destroy$.next();
    this.destroy$.complete();
  }
}

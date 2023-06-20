import { CommonService } from '../../../../services/common.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ngx-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent {

  id: string;
  text: string;
  @Input() label?: string;
  @Input() toolTip?: string;
  @Input() tip: string;
  @Input() type?: string;
  @Input() icon?: string;
  @Input() iconPack?: string;
  @Input() status?: string;
  @Input() nowrap?: boolean = false;

  @Output() click = new EventEmitter<any>();

  constructor(
    public cms: CommonService,
  ) {

  }

  onClick(event: any) {
    this.click.emit(this);
  }
}

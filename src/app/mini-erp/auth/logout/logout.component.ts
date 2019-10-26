import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../showcase-dialog/showcase-dialog.component';

@Component({
  selector: 'ngx-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private dialogService: NbDialogService) { }

  ngOnInit() {
    this.dialogService.open(ShowcaseDialogComponent, {
      context: {
        title: 'Logout',
        content: 'Logout',
      },
    });
  }

}

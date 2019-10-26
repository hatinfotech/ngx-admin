import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../showcase-dialog/showcase-dialog.component';
import { DataServiceService } from '../../services/data-service.service';

@Component({
  selector: 'ngx-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private dialogService: NbDialogService, private dataService: DataServiceService) { }

  ngOnInit() {

    this.dataService.logout(resp => {
      this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'Logout',
          content: 'Logout success',
        },
      });
    }, error => {
      this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'Logout',
          content: 'Logout error',
        },
      });
    });

  }

}

import { Component, OnInit } from '@angular/core';
import { NbAuthComponent, NbAuthService } from '@nebular/auth';
import { Location } from '@angular/common';

@Component({
  selector: 'ngx-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent extends NbAuthComponent implements OnInit {

  constructor(
    auth: NbAuthService,
    location: Location,
  ) {
    super(auth, location);
  }

  ngOnInit() {
  }

}

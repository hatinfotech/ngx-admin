import { OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';

export class BaseComponent implements OnInit {

  constructor(
    protected commonService: CommonService,
    protected router: Router,
  ) {

  }

  ngOnInit(): void {

  }

}

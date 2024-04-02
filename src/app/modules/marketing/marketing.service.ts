import { take, filter } from 'rxjs/operators';
import { CommonService } from '../../services/common.service';
import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NbAuthService } from '@nebular/auth';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PageModel } from '../../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class MarketingService {

  constructor(
    public cms: CommonService,
    public apiService: ApiService,
    public authService: NbAuthService,
  ) {

    

  }
}

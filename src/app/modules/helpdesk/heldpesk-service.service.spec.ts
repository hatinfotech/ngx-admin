import { TestBed } from '@angular/core/testing';

import { HeldpeskServiceService } from './heldpesk-service.service';

describe('HeldpeskServiceService', () => {
  let service: HeldpeskServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeldpeskServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

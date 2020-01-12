import { TestBed } from '@angular/core/testing';

import { MinierpService } from './minierp-service.service';

describe('MinierpServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MinierpService = TestBed.get(MinierpService);
    expect(service).toBeTruthy();
  });
});

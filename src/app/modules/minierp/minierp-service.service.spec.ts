import { TestBed } from '@angular/core/testing';

import { MinierpServiceService } from './minierp-service.service';

describe('MinierpServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MinierpServiceService = TestBed.get(MinierpServiceService);
    expect(service).toBeTruthy();
  });
});

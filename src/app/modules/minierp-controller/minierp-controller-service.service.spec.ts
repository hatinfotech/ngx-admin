import { TestBed } from '@angular/core/testing';

import { MinierpControllerServiceService } from './minierp-controller-service.service';

describe('MinierpControllerServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MinierpControllerServiceService = TestBed.get(MinierpControllerServiceService);
    expect(service).toBeTruthy();
  });
});

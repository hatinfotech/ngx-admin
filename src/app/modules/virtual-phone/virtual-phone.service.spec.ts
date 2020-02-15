import { TestBed } from '@angular/core/testing';

import { VirtualPhoneService } from './virtual-phone.service';

describe('VirtualPhoneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VirtualPhoneService = TestBed.get(VirtualPhoneService);
    expect(service).toBeTruthy();
  });
});

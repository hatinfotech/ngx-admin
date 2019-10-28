import { TestBed } from '@angular/core/testing';

import { PriceTableService } from './price-table.service';

describe('PriceTableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PriceTableService = TestBed.get(PriceTableService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { PriceReportService } from './price-report.service';

describe('PriceReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PriceReportService = TestBed.get(PriceReportService);
    expect(service).toBeTruthy();
  });
});

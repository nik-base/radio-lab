import { TestBed } from '@angular/core/testing';
import { mockProvider } from '@ngneat/spectator/jest';

import { ReportDataService } from './report-data.service';

describe('ReportDataService', () => {
  let service: ReportDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [mockProvider(ReportDataService)],
    });
    service = TestBed.inject(ReportDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { mockProvider } from '@ngneat/spectator/jest';

import { ReportManagerService } from './report-manager.service';

describe('ReportManagerService', () => {
  let service: ReportManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [mockProvider(ReportManagerService)],
    });
    service = TestBed.inject(ReportManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

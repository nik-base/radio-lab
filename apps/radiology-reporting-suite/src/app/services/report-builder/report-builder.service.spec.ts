import { TestBed } from '@angular/core/testing';
import { mockProvider } from '@ngneat/spectator/vitest';

import { ReportBuilderService } from './report-builder.service';

describe('ReportBuilderService', () => {
  let service: ReportBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [mockProvider(ReportBuilderService)],
    });
    service = TestBed.inject(ReportBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

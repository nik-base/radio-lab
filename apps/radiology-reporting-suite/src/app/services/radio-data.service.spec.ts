import { TestBed } from '@angular/core/testing';
import { mockProvider } from '@ngneat/spectator/jest';

import { RadioDataService } from './radio-data.service';

describe('RadioDataService', () => {
  let service: RadioDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [mockProvider(RadioDataService)],
    });
    service = TestBed.inject(RadioDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

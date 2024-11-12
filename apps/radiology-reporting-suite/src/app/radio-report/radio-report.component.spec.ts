import { ComponentFixture, TestBed } from '@angular/core/testing';
import { mockProvider } from '@ngneat/spectator/jest';

import { ReportBuilderService } from '../services/report-builder/report-builder.service';

import { RadioReportComponent } from './radio-report.component';

describe('RadioReportComponent', () => {
  let component: RadioReportComponent;
  let fixture: ComponentFixture<RadioReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioReportComponent],
      providers: [mockProvider(ReportBuilderService)],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

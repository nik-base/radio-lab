import { ComponentFixture, TestBed } from '@angular/core/testing';
import { mockProvider } from '@ngneat/spectator/jest';
import { MessageService } from 'primeng/api';

import { ReportBuilderService } from '../services/report-builder/report-builder.service';

import { ReportBuilderComponent } from './report-builder.component';

describe('ReportBuilderComponent', () => {
  let component: ReportBuilderComponent;
  let fixture: ComponentFixture<ReportBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportBuilderComponent],
      providers: [
        mockProvider(ReportBuilderService),
        mockProvider(MessageService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

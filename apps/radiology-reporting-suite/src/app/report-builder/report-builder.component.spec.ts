import { ComponentFixture, TestBed } from '@angular/core/testing';
import { mockProvider } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

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
        provideMockStore({
          selectors: [{ selector: 'selectOrderedTemplates', value: [] }],
        }),
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

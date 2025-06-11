import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
  SpectatorFactory,
} from '@ngneat/spectator/vitest';
import { MockComponents } from 'ng-mocks';
import { BlockUI } from 'primeng/blockui';

import { TemplateManagerComponent } from '@app/components/template-manager/template-manager.component';
import { ClassifierStore } from '@app/store/report-manager/classifier.store';
import { FindingStore } from '@app/store/report-manager/finding.store';
import { GroupStore } from '@app/store/report-manager/group.store';
import { ScopeStore } from '@app/store/report-manager/scope.store';
import { TemplateStore } from '@app/store/report-manager/template.store';
import { VariableStore } from '@app/store/report-manager/variable-store';
import { VariableValueStore } from '@app/store/report-manager/variable-value.store';

import { ReportManagerComponent } from './report-manager.component';

describe('ReportManagerComponent', () => {
  let spectator: Spectator<ReportManagerComponent>;

  const createComponent: SpectatorFactory<ReportManagerComponent> =
    createComponentFactory({
      component: ReportManagerComponent,
      componentProviders: [
        mockProvider(TemplateStore, {
          fetchAll: vi.fn(),
          isLoading: vi.fn(),
          isFetching: vi.fn(),
          orderedList: vi.fn(),
          current: vi.fn(),
        }),
        mockProvider(ScopeStore, {
          isLoading: vi.fn(),
          orderedList: vi.fn(),
          current: vi.fn(),
        }),
        mockProvider(GroupStore, {
          isLoading: vi.fn(),
          orderedList: vi.fn(),
          current: vi.fn(),
        }),
        mockProvider(ClassifierStore, {
          isLoading: vi.fn(),
          orderedList: vi.fn(),
          current: vi.fn(),
        }),
        mockProvider(FindingStore, {
          isLoading: vi.fn(),
          orderedList: vi.fn(),
          current: vi.fn(),
        }),
        mockProvider(VariableStore, {
          isLoading: vi.fn(),
        }),
        mockProvider(VariableValueStore, {
          isLoading: vi.fn(),
        }),
      ],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

  beforeEach(() => {
    TestBed.overrideComponent(ReportManagerComponent, {
      set: {
        imports: [MockComponents(TemplateManagerComponent, BlockUI)],
      },
    });

    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeDefined();
  });
});

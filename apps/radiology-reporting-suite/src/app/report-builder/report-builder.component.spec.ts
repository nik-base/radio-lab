import {
  createComponentFactory,
  mockProvider,
  Spectator,
  SpectatorFactory,
} from '@ngneat/spectator/vitest';
import { ConfirmationService } from 'primeng/api';

import { ReportBuilderEditorStore } from '@app/store/report-builder/report-builder-editor.store';
import { ReportBuilderTemplateDataStore } from '@app/store/report-builder/report-builder-template-data.store';
import { ReportBuilderTemplateStore } from '@app/store/report-builder/report-builder-templates-store';
import { ReportBuilderVariableValueStore } from '@app/store/report-builder/report-builder-variable-value.store';

import { ReportBuilderComponent } from './report-builder.component';

describe('ReportBuilderComponent', () => {
  let spectator: Spectator<ReportBuilderComponent>;

  const createComponent: SpectatorFactory<ReportBuilderComponent> =
    createComponentFactory({
      component: ReportBuilderComponent,
      componentProviders: [
        ConfirmationService,
        mockProvider(ReportBuilderTemplateStore, {
          fetchAll: vi.fn(),
          templates: vi.fn(),
          isLoading: vi.fn(),
        }),
        mockProvider(ReportBuilderTemplateDataStore, {
          isLoading: vi.fn(),
        }),
        mockProvider(ReportBuilderVariableValueStore, {
          isLoading: vi.fn(),
        }),
        mockProvider(ReportBuilderEditorStore, {
          isDirty: vi.fn(),
        }),
      ],
    });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeDefined();
  });
});

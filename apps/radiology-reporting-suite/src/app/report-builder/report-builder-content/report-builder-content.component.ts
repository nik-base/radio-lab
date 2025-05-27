import {
  Component,
  computed,
  effect,
  input,
  InputSignal,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { Splitter } from 'primeng/splitter';

import { FindingGroupedListComponent } from '@app/components/finding-grouped-list/finding-grouped-list.component';
import { ScopeListComponent } from '@app/components/scope-list/scope-list.component';
import { FindingGroupData, ScopeData, TemplateData } from '@app/models/domain';

import { ReportBuilderEditorComponent } from '../report-builder-editor/report-builder-editor.component';

@Component({
  selector: 'radio-report-builder-content',
  standalone: true,
  imports: [
    ScopeListComponent,
    FindingGroupedListComponent,
    PanelModule,
    Splitter,
    ReportBuilderEditorComponent,
  ],
  templateUrl: './report-builder-content.component.html',
  styleUrl: './report-builder-content.component.scss',
})
export class ReportBuilderContentComponent {
  readonly templateData: InputSignal<TemplateData | null> =
    input.required<TemplateData | null>();

  readonly isLoading: InputSignal<boolean> = input<boolean>(true);

  protected readonly selectedScope: WritableSignal<ScopeData | null> =
    signal<ScopeData | null>(null);

  protected readonly groupedFindings: Signal<FindingGroupData[]> = computed(
    () => [...(this.selectedScope()?.groups ?? [])]
  );

  protected readonly reportEditor: Signal<ReportBuilderEditorComponent> =
    viewChild.required<ReportBuilderEditorComponent>('reportEditor');

  constructor() {
    this.effectTemplateDataChange();
  }

  onScopeChange(scope: ScopeData): void {
    this.selectedScope.set(scope);
  }

  resetEditor(): void {
    this.reportEditor().reset();
  }

  private effectTemplateDataChange(): void {
    effect(() => {
      if (this.templateData()) {
        this.selectedScope.set(null);
      } else {
        this.selectedScope.set(null);
      }
    });
  }
}

import {
  AfterViewInit,
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
import {
  FindingData,
  FindingGroupData,
  ScopeData,
  Template,
  TemplateData,
} from '@app/models/domain';

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
export class ReportBuilderContentComponent implements AfterViewInit {
  readonly templateData: InputSignal<TemplateData | null> =
    input.required<TemplateData | null>();

  readonly template: InputSignal<Template> = input.required<Template>();

  readonly isLoading: InputSignal<boolean> = input<boolean>(true);

  protected readonly selectedScope: WritableSignal<ScopeData | null> =
    signal<ScopeData | null>(null);

  protected readonly groupedFindings: Signal<FindingGroupData[]> = computed(
    () => [...(this.selectedScope()?.groups ?? [])]
  );

  protected readonly reportEditor: Signal<ReportBuilderEditorComponent> =
    viewChild.required<ReportBuilderEditorComponent>('reportEditor');

  private hasComponentLoaded: boolean = false;

  constructor() {
    this.effectTemplateChange();

    this.effectTemplateDataChange();
  }

  ngAfterViewInit(): void {
    this.hasComponentLoaded = true;

    this.applyChangeToEditorOnTemplateChange(this.template());
  }

  onScopeChange(scope: ScopeData): void {
    this.selectedScope.set(scope);
  }

  onFindingSelection(finding: FindingData): void {
    const scope: ScopeData | null = this.selectedScope();

    if (!scope) {
      return;
    }

    this.reportEditor().insertReportFinding({
      scope,
      finding,
      scopeIndex: scope.sortOrder,
    });
  }

  private insertReportProtocol(template: Template): void {
    this.reportEditor().insertReportProtocol(template);
  }

  private resetEditor(): void {
    this.reportEditor().reset();
  }

  private effectTemplateChange(): void {
    effect(() => {
      const template: Template = this.template();

      if (!this.hasComponentLoaded) {
        return;
      }

      this.applyChangeToEditorOnTemplateChange(template);
    });
  }

  private applyChangeToEditorOnTemplateChange(template: Template) {
    this.resetEditor();

    this.insertReportProtocol(template);
  }

  private effectTemplateDataChange(): void {
    effect(() => {
      this.templateData();

      this.selectedScope.set(null);
    });
  }
}

import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { BlockUI } from 'primeng/blockui';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';

import { Template, TemplateData } from '@app/models/domain';
import { ReportBuilderEditorStore } from '@app/store/report-builder/report-builder-editor.store';
import { ReportBuilderTemplateDataStore } from '@app/store/report-builder/report-builder-template-data.store';
import { ReportBuilderTemplateStore } from '@app/store/report-builder/report-builder-templates-store';
import { ReportBuilderVariableValueStore } from '@app/store/report-builder/report-builder-variable-value.store';

import { TemplateManagerListComponent } from '../components/template-selector/template-selector.component';

import { ReportBuilderContentComponent } from './report-builder-content/report-builder-content.component';

@Component({
  selector: 'radio-report-builder',
  standalone: true,
  imports: [
    CommonModule,
    TemplateManagerListComponent,
    BlockUI,
    ProgressSpinner,
    Button,
    ReportBuilderContentComponent,
  ],
  providers: [
    ReportBuilderTemplateStore,
    ReportBuilderTemplateDataStore,
    ReportBuilderVariableValueStore,
    ReportBuilderEditorStore,
  ],
  templateUrl: './report-builder.component.html',
  styleUrl: './report-builder.component.scss',
})
export class ReportBuilderComponent implements OnInit {
  protected readonly templateStore$: InstanceType<
    typeof ReportBuilderTemplateStore
  > = inject(ReportBuilderTemplateStore);

  protected readonly templateDataStore$: InstanceType<
    typeof ReportBuilderTemplateDataStore
  > = inject(ReportBuilderTemplateDataStore);

  protected readonly variableValueStore$: InstanceType<
    typeof ReportBuilderVariableValueStore
  > = inject(ReportBuilderVariableValueStore);

  protected readonly editorStore$: InstanceType<
    typeof ReportBuilderEditorStore
  > = inject(ReportBuilderEditorStore);

  protected readonly isLoading: Signal<boolean> = computed(() => {
    return (
      this.templateStore$.isLoading() ||
      this.templateDataStore$.isLoading() ||
      this.variableValueStore$.isLoading()
    );
  });

  protected readonly templateData: Signal<TemplateData | null> = computed(
    () => {
      const template: Template | null = this.selectedTemplate();

      if (!template) {
        return null;
      }

      return this.templateDataStore$.templateData()(template.id)();
    }
  );

  protected readonly selectedTemplate: WritableSignal<Template | null> =
    signal<Template | null>(null);

  protected readonly templateChangeConfirmationMessage: string =
    'All changes to your report will be lost. Are you sure you want to discard changes to current report and switch template?';

  ngOnInit(): void {
    this.templateStore$.fetchAll();
  }

  onSelectTemplate(template: Template | null): void {
    this.selectedTemplate.set(template);

    if (!template) {
      return;
    }

    const templateData: TemplateData | null =
      this.templateDataStore$.templateData()(template.id)();

    if (!templateData) {
      this.templateDataStore$.fetchData(template);
    }
  }
}

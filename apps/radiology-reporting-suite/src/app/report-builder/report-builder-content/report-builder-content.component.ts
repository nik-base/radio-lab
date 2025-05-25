import {
  Component,
  input,
  InputSignal,
  signal,
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

  protected readonly groupedFindings: WritableSignal<FindingGroupData[]> =
    signal<FindingGroupData[]>([]);

  onScopeChange(scope: ScopeData): void {
    this.groupedFindings.set([...scope.groups]);
  }
}

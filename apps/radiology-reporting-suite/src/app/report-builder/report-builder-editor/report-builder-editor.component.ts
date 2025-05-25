import { Component, input, InputSignal } from '@angular/core';

import { EditorComponent } from '@app/editor/editor.component';

@Component({
  selector: 'radio-report-builder-editor',
  standalone: true,
  imports: [EditorComponent],
  templateUrl: './report-builder-editor.component.html',
})
export class ReportBuilderEditorComponent {
  readonly isLoading: InputSignal<boolean> = input<boolean>(true);
}

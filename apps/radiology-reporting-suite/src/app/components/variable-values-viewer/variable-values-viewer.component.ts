import { Component, input, InputSignal } from '@angular/core';
import { TableModule } from 'primeng/table';

import { VariableValue } from '@app/models/domain';

@Component({
  selector: 'radio-variable-values-viewer',
  standalone: true,
  imports: [TableModule],
  templateUrl: './variable-values-viewer.component.html',
})
export class VariableValuesViewerComponent {
  readonly values: InputSignal<VariableValue[]> =
    input.required<VariableValue[]>();
}

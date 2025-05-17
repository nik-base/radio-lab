import { Component, input, InputSignal } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

import { VariableValue } from '@app/models/domain';

@Component({
  selector: 'radio-variable-values-viewer',
  standalone: true,
  imports: [TableModule, SkeletonModule],
  templateUrl: './variable-values-viewer.component.html',
  styleUrls: ['./variable-values-viewer.component.scss'],
})
export class VariableValuesViewerComponent {
  readonly values: InputSignal<VariableValue[]> =
    input.required<VariableValue[]>();

  readonly isLoading: InputSignal<boolean> = input<boolean>(true);
}

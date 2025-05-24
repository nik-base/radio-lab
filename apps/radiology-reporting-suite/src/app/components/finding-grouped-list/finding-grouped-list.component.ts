import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';

import { Finding } from '@app/models/domain';
import { FindingGrouped } from '@app/models/ui';

@Component({
  selector: 'radio-finding-grouped-list',
  standalone: true,
  imports: [CommonModule, AccordionModule, TooltipModule, ChipModule],
  templateUrl: './finding-grouped-list.component.html',
})
export class FindingGroupedListComponent {
  readonly groupedFindings: InputSignal<FindingGrouped[]> =
    input.required<FindingGrouped[]>();

  readonly selection: OutputEmitterRef<Finding> = output<Finding>();

  onClick(finding: Finding): void {
    this.selection.emit(finding);
  }
}

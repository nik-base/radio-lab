import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { OrderListModule } from 'primeng/orderlist';
import { TooltipModule } from 'primeng/tooltip';

import { Finding } from '@app/models/domain';
import { EventData } from '@app/models/ui';

@Component({
  selector: 'radio-finding-manager-list',
  standalone: true,
  imports: [CommonModule, OrderListModule, TooltipModule, ButtonModule],
  templateUrl: './finding-manager-list.component.html',
})
export class FindingManagerListComponent {
  readonly findings: InputSignal<Finding[]> = input.required<Finding[]>();

  readonly edit: OutputEmitterRef<Finding> = output<Finding>();

  readonly delete: OutputEmitterRef<EventData<Finding>> =
    output<EventData<Finding>>();

  readonly clone: OutputEmitterRef<Finding> = output<Finding>();

  readonly reorder: OutputEmitterRef<ReadonlyArray<Finding>> =
    output<ReadonlyArray<Finding>>();

  onEdit(finding: Finding): void {
    this.edit.emit(finding);
  }

  onDelete(event: Event, finding: Finding): void {
    this.delete.emit({
      event,
      data: finding,
    });
  }

  onClone(finding: Finding): void {
    this.clone.emit(finding);
  }

  onReorder(): void {
    this.reorder.emit(this.findings());
  }
}

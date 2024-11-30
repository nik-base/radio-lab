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

import { Scope } from '@app/models/domain';
import { EventData } from '@app/models/ui';

@Component({
  selector: 'radio-scope-manager-list',
  standalone: true,
  imports: [CommonModule, OrderListModule, TooltipModule, ButtonModule],
  templateUrl: './scope-manager-list.component.html',
})
export class ScopeManagerListComponent {
  readonly scopes: InputSignal<Scope[]> = input.required<Scope[]>();

  readonly changed: OutputEmitterRef<Scope> = output<Scope>();

  readonly edit: OutputEmitterRef<Scope> = output<Scope>();

  readonly delete: OutputEmitterRef<EventData<Scope>> =
    output<EventData<Scope>>();

  readonly clone: OutputEmitterRef<Scope> = output<Scope>();

  readonly reorder: OutputEmitterRef<ReadonlyArray<Scope>> =
    output<ReadonlyArray<Scope>>();

  onConfigure(scope: Scope): void {
    this.changed.emit(scope);
  }

  onEdit(scope: Scope): void {
    this.edit.emit(scope);
  }

  onDelete(event: Event, scope: Scope): void {
    this.delete.emit({
      event,
      data: scope,
    });
  }

  onClone(scope: Scope): void {
    this.clone.emit(scope);
  }

  onReorder(): void {
    this.reorder.emit(this.scopes());
  }
}

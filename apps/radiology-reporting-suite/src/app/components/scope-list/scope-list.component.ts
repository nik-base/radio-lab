import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ListboxChangeEvent, ListboxModule } from 'primeng/listbox';
import { TooltipModule } from 'primeng/tooltip';

import { Scope } from '@app/models/domain';

@Component({
  selector: 'radio-scope-list',
  standalone: true,
  imports: [CommonModule, ListboxModule, TooltipModule, ButtonModule],
  templateUrl: './scope-list.component.html',
})
export class ScopeListComponent {
  readonly scopes: InputSignal<ReadonlyArray<Scope>> =
    input.required<ReadonlyArray<Scope>>();

  readonly changed: OutputEmitterRef<Scope> = output<Scope>();

  readonly normal: OutputEmitterRef<Scope> = output<Scope>();

  readonly scopeList: Signal<Scope[]> = computed(() => [...this.scopes()]);

  onChange($event: ListboxChangeEvent): void {
    this.changed.emit($event.value as Scope);
  }

  onNormal(scope: Scope): void {
    this.normal.emit(scope);
  }
}

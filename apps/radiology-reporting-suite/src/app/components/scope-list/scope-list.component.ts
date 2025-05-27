import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isNil } from 'lodash-es';
import { TooltipOptions } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ListboxChangeEvent, ListboxModule } from 'primeng/listbox';
import { Skeleton } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';

import { APP_TOOLTIP_OPTIONS } from '@app/constants';
import { ScopeData } from '@app/models/domain';

@Component({
  selector: 'radio-scope-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ListboxModule,
    TooltipModule,
    ButtonModule,
    Skeleton,
  ],
  templateUrl: './scope-list.component.html',
  styleUrls: ['./scope-list.component.scss'],
})
export class ScopeListComponent {
  readonly scopes: InputSignal<ScopeData[] | ReadonlyArray<ScopeData>> =
    input.required<ScopeData[] | ReadonlyArray<ScopeData>>();

  readonly isLoading: InputSignal<boolean> = input<boolean>(true);

  readonly changed: OutputEmitterRef<ScopeData> = output<ScopeData>();

  readonly normal: OutputEmitterRef<ScopeData> = output<ScopeData>();

  protected scopeList: Signal<ScopeData[]> = computed(() => [...this.scopes()]);

  protected selectedScope: ModelSignal<ScopeData | null> =
    model<ScopeData | null>(null);

  private previousSelectedScope: ScopeData | null = null;

  protected readonly mockScopes: ScopeData[] = Array<ScopeData>(5).fill({
    id: '',
    name: '',
    sortOrder: 0,
    templateId: '',
    groups: [],
  });

  protected readonly tooltipOptions: TooltipOptions = APP_TOOLTIP_OPTIONS;

  onChange($event: ListboxChangeEvent): void {
    const scopeData: ScopeData | null = $event.value as ScopeData | null;

    if (isNil(scopeData)) {
      setTimeout(() => this.selectedScope.set(this.previousSelectedScope), 0);
      return;
    }

    this.previousSelectedScope = scopeData;

    this.changed.emit(scopeData);
  }

  onNormal(event: Event, scope: ScopeData): void {
    event.preventDefault();

    event.stopPropagation();

    this.normal.emit(scope);
  }
}

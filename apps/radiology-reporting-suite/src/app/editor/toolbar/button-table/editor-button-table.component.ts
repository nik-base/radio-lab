import { CommonModule } from '@angular/common';
import { Component, inject, Signal, viewChild } from '@angular/core';
import { Popover, PopoverModule } from 'primeng/popover';

import { EditorTableDirective } from '@app/editor/directives/editor-table.directive';
import { EditorTableGridOutput } from '@app/editor/models';

import { EditorButtonBaseComponent } from '../button-base/editor-button-base.component';
import { EditorTableGridSelectorComponent } from '../table-grid-selector/editor-table-grid-selector.component';

@Component({
  selector: 'radio-editor-button-table',
  standalone: true,
  imports: [
    CommonModule,
    EditorButtonBaseComponent,
    EditorTableGridSelectorComponent,
    PopoverModule,
  ],
  hostDirectives: [
    {
      directive: EditorTableDirective,
      inputs: ['context'],
      outputs: ['clicked'],
    },
  ],
  templateUrl: './editor-button-table.component.html',
})
export class EditorButtonTableComponent {
  readonly hostDirective: EditorTableDirective = inject(EditorTableDirective, {
    host: true,
  });

  protected readonly popOver: Signal<Popover> =
    viewChild.required<Popover>('popOver');

  protected readonly rows: number = 5;

  protected readonly columns: number = 5;

  onClick(event: Event): void {
    this.popOver().show(event, event.target);
  }

  onSelected(event: EditorTableGridOutput): void {
    this.hostDirective.run(event);

    this.popOver().hide();
  }

  onHide(): void {
    this.popOver().hide();
  }
}

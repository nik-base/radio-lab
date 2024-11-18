import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { EditorUndoDirective } from '@app/editor/directives/editor-undo.directive';

import { EditorButtonBaseComponent } from '../button-base/editor-button-base.component';

@Component({
  selector: 'radio-editor-button-undo',
  standalone: true,
  imports: [CommonModule, EditorButtonBaseComponent],
  hostDirectives: [
    {
      directive: EditorUndoDirective,
      inputs: ['context'],
      outputs: ['clicked'],
    },
  ],
  templateUrl: './editor-button-undo.component.html',
})
export class EditorButtonUndoComponent {
  readonly hostDirective: EditorUndoDirective = inject(EditorUndoDirective, {
    host: true,
  });
}

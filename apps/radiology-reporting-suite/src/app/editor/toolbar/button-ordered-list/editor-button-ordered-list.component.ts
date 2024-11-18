import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { EditorOrderedListDirective } from '@app/editor/directives/editor-ordered-list.directive';

import { EditorButtonBaseComponent } from '../button-base/editor-button-base.component';

@Component({
  selector: 'radio-editor-button-ordered-list',
  standalone: true,
  imports: [CommonModule, EditorButtonBaseComponent],
  hostDirectives: [
    {
      directive: EditorOrderedListDirective,
      inputs: ['context'],
      outputs: ['clicked'],
    },
  ],
  templateUrl: './editor-button-ordered-list.component.html',
})
export class EditorButtonOrderedListComponent {
  readonly hostDirective: EditorOrderedListDirective = inject(
    EditorOrderedListDirective,
    {
      host: true,
    }
  );
}

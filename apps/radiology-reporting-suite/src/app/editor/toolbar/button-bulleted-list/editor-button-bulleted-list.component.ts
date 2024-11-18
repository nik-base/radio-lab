import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { EditorBulletedListDirective } from '@app/editor/directives/editor-bulleted-list.directive';

import { EditorButtonBaseComponent } from '../button-base/editor-button-base.component';

@Component({
  selector: 'radio-editor-button-bulleted-list',
  standalone: true,
  imports: [CommonModule, EditorButtonBaseComponent],
  hostDirectives: [
    {
      directive: EditorBulletedListDirective,
      inputs: ['context'],
      outputs: ['clicked'],
    },
  ],
  templateUrl: './editor-button-bulleted-list.component.html',
})
export class EditorButtonBulletedListComponent {
  readonly hostDirective: EditorBulletedListDirective = inject(
    EditorBulletedListDirective,
    {
      host: true,
    }
  );
}

import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  Component,
  input,
  InputSignal,
  InputSignalWithTransform,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'radio-editor-button-base',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: './editor-button-base.component.html',
})
export class EditorButtonBaseComponent {
  readonly name: InputSignal<string> = input.required<string>();

  readonly icon: InputSignal<string> = input.required<string>();

  readonly disabled: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, {
    transform: booleanAttribute,
  });

  readonly isActive: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, {
    transform: booleanAttribute,
  });

  readonly clicked: OutputEmitterRef<Event> = output<Event>();

  onClick(event: Event): void {
    this.clicked.emit(event);
  }
}

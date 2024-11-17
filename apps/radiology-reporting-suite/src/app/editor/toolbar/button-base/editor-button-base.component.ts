import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'radio-editor-button-base',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: './editor-button-base.component.html',
  styleUrls: ['./editor-button-base.component.scss'],
})
export class EditorButtonBaseComponent {
  @Input({ required: true }) name: string = '';

  @Input({ required: true }) icon: string = '';

  @Input({ transform: booleanAttribute }) disabled: boolean = false;

  @Input({ transform: booleanAttribute }) isActive: boolean = false;

  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  onClick(): void {
    this.clicked.emit();
  }
}

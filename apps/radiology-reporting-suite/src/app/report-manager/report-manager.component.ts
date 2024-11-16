import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'radio-report-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-manager.component.html',
  styleUrl: './report-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportManagerComponent {}

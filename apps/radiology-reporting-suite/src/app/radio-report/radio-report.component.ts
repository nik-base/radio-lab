import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RadioTemplateDto } from '../models/data';
import { ReportDataService } from '../services/admin/report-data.service';

@Component({
  selector: 'radio-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radio-report.component.html',
  styleUrl: './radio-report.component.scss',
})
export class RadioReportComponent {
  private readonly radioDataService: ReportDataService =
    inject(ReportDataService);

  templates$: Observable<RadioTemplateDto[]> =
    this.radioDataService.fetchTemplates$();
}

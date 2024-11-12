import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { TemplateDto } from '../models/data';
import { ReportBuilderService } from '../services/report-builder/report-builder.service';

@Component({
  selector: 'radio-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radio-report.component.html',
  styleUrl: './radio-report.component.scss',
})
export class RadioReportComponent {
  private readonly reportBuilderService: ReportBuilderService =
    inject(ReportBuilderService);

  templates$: Observable<TemplateDto[]> =
    this.reportBuilderService.fetchTemplates$();
}

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PushPipe } from '@ngrx/component';
import { Observable } from 'rxjs';

import { TemplateDto } from '../models/data';
import { ReportBuilderService } from '../services/report-builder/report-builder.service';

@Component({
  selector: 'radio-report',
  standalone: true,
  imports: [CommonModule, PushPipe],
  templateUrl: './report-builder.component.html',
  styleUrl: './report-builder.component.scss',
})
export class ReportBuilderComponent {
  private readonly reportBuilderService: ReportBuilderService =
    inject(ReportBuilderService);

  templates$: Observable<TemplateDto[]> =
    this.reportBuilderService.fetchTemplates$();
}

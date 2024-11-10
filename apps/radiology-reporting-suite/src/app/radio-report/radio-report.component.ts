import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RadioTemplateDto } from '../models/data';
import { RadioDataService } from '../services/radio-data.service';

@Component({
  selector: 'radio-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radio-report.component.html',
  styleUrl: './radio-report.component.scss',
})
export class RadioReportComponent {
  private readonly radioDataService: RadioDataService =
    inject(RadioDataService);

  templates$: Observable<RadioTemplateDto[]> =
    this.radioDataService.fetchTemplates$();
}

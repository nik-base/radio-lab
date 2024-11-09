import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { RadioDBModule } from '../db/radio-db.module';
import { RadioDBService } from '../db/radio-db.service';
import { RadioTemplateDto } from '../models/data';
import { RadioDataService } from '../services/radio-data.service';

@Component({
  selector: 'radio-report',
  standalone: true,
  imports: [CommonModule, RadioDBModule],
  providers: [RadioDataService, RadioDBService],
  templateUrl: './radio-report.component.html',
  styleUrl: './radio-report.component.scss',
})
export class RadioReportComponent {
  private readonly radioDataService: RadioDataService =
    inject(RadioDataService);

  templates$: Observable<RadioTemplateDto[]> = this.radioDataService
    .fetchTemplates$()
    .pipe(tap((templates: RadioTemplateDto[]) => console.log(templates)));
}

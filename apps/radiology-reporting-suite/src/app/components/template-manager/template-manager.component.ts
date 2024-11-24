import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Observable } from 'rxjs';

import { Template } from '@app/models/domain';
import { selectOrderedTemplates } from '@app/store/report-manager/domain/report-manager.feature';

import { TemplateManagerListComponent } from '../template-manager-list/template-manager-list.component';

@Component({
  selector: 'radio-template-manager',
  standalone: true,
  imports: [
    CommonModule,
    PushPipe,
    TooltipModule,
    ButtonModule,
    TemplateManagerListComponent,
  ],
  templateUrl: './template-manager.component.html',
})
export class TemplateManagerComponent {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly store$: Store = inject(Store);

  readonly templates$: Observable<Template[]> = this.store$.select(
    selectOrderedTemplates
  );
}

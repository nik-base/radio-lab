import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { TemplateManagerComponent } from '@app/components/template-manager/template-manager.component';
import { ReportManagerUIActions } from '@app/store/report-manager/ui/actions/report-manager-ui.actions';

@Component({
  selector: 'radio-report-manager',
  standalone: true,
  imports: [CommonModule, TemplateManagerComponent],
  templateUrl: './report-manager.component.html',
  styleUrl: './report-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportManagerComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly store$: Store = inject(Store);

  ngOnInit(): void {
    this.store$.dispatch(ReportManagerUIActions.load());
  }
}

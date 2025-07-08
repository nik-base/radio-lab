import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  Signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { isNil } from 'lodash-es';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';

import { Scope } from '@app/models/domain';
import { GroupCloneDialogData, GroupCloneDialogOutput } from '@app/models/ui';
import { ScopeStore } from '@app/store/report-manager/scope.store';

import { DialogLayoutComponent } from '../dialog-layout/dialog-layout.component';
import { DynamicTemplateRendererComponent } from '../dialog-template-renderer/dialog-template-renderer.component';

@Component({
  selector: 'radio-group-clone-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TooltipModule,
    ButtonModule,
    MessageModule,
    FloatLabel,
    AutoCompleteModule,
    DialogLayoutComponent,
  ],
  templateUrl: './group-clone-dialog.component.html',
})
export class GroupCloneDialogComponent implements AfterViewInit {
  protected readonly scopeStore$: InstanceType<typeof ScopeStore> =
    inject(ScopeStore);

  private readonly dynamicDialogRef: DynamicDialogRef =
    inject(DynamicDialogRef);

  private readonly dynamicDialogConfig: DynamicDialogConfig<GroupCloneDialogData> =
    inject(DynamicDialogConfig) as DynamicDialogConfig<GroupCloneDialogData>;

  protected readonly footer: Signal<TemplateRef<unknown>> =
    viewChild.required<TemplateRef<unknown>>('footer');

  formGroup!: FormGroup;

  protected filteredScopes: Scope[] = [];

  readonly data!: GroupCloneDialogData;

  constructor() {
    const data: GroupCloneDialogData = this.dynamicDialogConfig
      .data as GroupCloneDialogData;

    this.data = data;

    this.formGroup = this.createFormGroup(data);
  }

  ngAfterViewInit(): void {
    if (isNil(this.dynamicDialogConfig.data)) {
      return;
    }

    // Defer the assignment of 'templateToRender' to the next microtask
    // to prevent ExpressionChangedAfterItHasBeenCheckedError.
    queueMicrotask(() => {
      this.dynamicDialogConfig.templates = {
        footer: DynamicTemplateRendererComponent,
      };

      if (this.dynamicDialogConfig.data) {
        this.dynamicDialogConfig.data.templateToRender = this.footer();
      }
    });
  }

  close(): void {
    this.dynamicDialogRef.close();
  }

  clone(): void {
    this.dynamicDialogRef.close({
      group: this.data.group,
      scope: this.formGroup.get('scope')?.value as Scope,
    } satisfies GroupCloneDialogOutput);
  }

  filterScopes(event: AutoCompleteCompleteEvent): void {
    this.filteredScopes = this.scopeStore$
      .orderedList()
      .filter((scope: Scope): boolean =>
        scope.name.toLowerCase().includes(event.query.toLowerCase())
      );
  }

  private createFormGroup(data: GroupCloneDialogData): FormGroup {
    const formGroup: FormGroup = new FormGroup({
      scope: new FormControl<Scope>(data.scope, {
        nonNullable: true,
        validators: [Validators.required.bind(this)],
      }),
    });

    return formGroup;
  }
}

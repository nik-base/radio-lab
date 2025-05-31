import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  inject,
  Signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { isNil } from 'lodash-es';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { Message } from 'primeng/message';

import { FindingClassifier, FindingGroup } from '@app/models/domain';
import {
  FindingCloneDialogData,
  FindingCloneDialogOutput,
} from '@app/models/ui';
import { ClassifierStore } from '@app/store/report-manager/classifier.store';
import { GroupStore } from '@app/store/report-manager/group.store';

import { DialogLayoutComponent } from '../dialog-layout/dialog-layout.component';
import { DynamicTemplateRendererComponent } from '../dialog-template-renderer/dialog-template-renderer.component';

@Component({
  selector: 'radio-finding-clone-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    Message,
    DialogLayoutComponent,
    AutoCompleteModule,
    FloatLabel,
  ],
  templateUrl: './finding-clone-dialog.component.html',
})
export class FindingCloneDialogComponent implements AfterViewInit {
  private readonly groupStore$: InstanceType<typeof GroupStore> =
    inject(GroupStore);

  private readonly classifierStore$: InstanceType<typeof ClassifierStore> =
    inject(ClassifierStore);

  private readonly dynamicDialogRef: DynamicDialogRef =
    inject(DynamicDialogRef);

  private readonly dynamicDialogConfig: DynamicDialogConfig<FindingCloneDialogData> =
    inject(DynamicDialogConfig) as DynamicDialogConfig<FindingCloneDialogData>;

  protected readonly footer: Signal<TemplateRef<unknown>> =
    viewChild.required<TemplateRef<unknown>>('footer');

  protected readonly groups: Signal<FindingGroup[]> = computed(
    () => this.groupStore$.additionalData?.()?.groupsByScopeId ?? []
  );

  protected readonly classifiers: Signal<FindingClassifier[]> = computed(
    () => this.classifierStore$.additionalData?.()?.classifiersByGroupId ?? []
  );

  formGroup!: FormGroup;

  readonly data!: FindingCloneDialogData;

  protected filteredGroups: FindingGroup[] = [];

  protected filteredClassifiers: FindingClassifier[] = [];

  constructor() {
    const data: FindingCloneDialogData = this.dynamicDialogConfig
      .data as FindingCloneDialogData;

    this.data = data;

    this.formGroup = this.createFormGroup(data);

    this.groupStore$.fetchByScopeId(data.scope);

    this.classifierStore$.fetchByGroupId({
      scope: data.scope,
      group: data.group,
    });
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

  onGroupSelect(group: AutoCompleteSelectEvent): void {
    this.classifierStore$.fetchByGroupId({
      scope: this.data.scope,
      group: group.value as FindingGroup,
    });

    const classifierControl: AbstractControl =
      this.formGroup.controls['classifier'];

    classifierControl.reset();

    classifierControl.markAsDirty();
  }

  close(): void {
    this.dynamicDialogRef.close();
  }

  clone(): void {
    this.dynamicDialogRef.close({
      finding: this.data.finding,
      group: this.formGroup.get('group')?.value as FindingGroup,
      classifier: this.formGroup.get('classifier')?.value as FindingClassifier,
    } satisfies FindingCloneDialogOutput);
  }

  filterGroups(event: AutoCompleteCompleteEvent): void {
    this.filteredGroups = this.groups().filter((group: FindingGroup): boolean =>
      group.name.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  filterClassifiers(event: AutoCompleteCompleteEvent): void {
    this.filteredClassifiers = this.classifiers().filter(
      (classifier: FindingClassifier): boolean =>
        classifier.name.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  private createFormGroup(data: FindingCloneDialogData): FormGroup {
    const formGroup: FormGroup = new FormGroup({
      group: new FormControl<FindingGroup>(data.group, {
        validators: [Validators.required.bind(this)],
      }),
      classifier: new FormControl<FindingClassifier>(data.classifier, {
        validators: [Validators.required.bind(this)],
      }),
    });

    return formGroup;
  }
}

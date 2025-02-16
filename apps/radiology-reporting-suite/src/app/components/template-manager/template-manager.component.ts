import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  InputSignal,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { take, tap } from 'rxjs';

import { CHANGE_MODE } from '@app/constants';
import { LegacyTemplateImportMapperService } from '@app/mapper/legacy-template-import-mapper.service';
import { Template, TemplateImport } from '@app/models/domain';
import {
  EventData,
  LegacyTemplateImport,
  TemplateManagerDialogData,
} from '@app/models/ui';
import { TemplateUIActions } from '@app/store/report-manager/ui/actions/template-ui.actions';
import { JsonService } from '@app/utils/services/json.service';

import { TemplateManagerDialogComponent } from '../template-manager-dialog/template-manager-dialog.component';
import { TemplateManagerListComponent } from '../template-manager-list/template-manager-list.component';

@Component({
  selector: 'radio-template-manager',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    ButtonModule,
    ConfirmPopupModule,
    FileUploadModule,
    TemplateManagerListComponent,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './template-manager.component.html',
})
export class TemplateManagerComponent {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly store$: Store = inject(Store);

  private readonly jsonService: JsonService = inject(JsonService);

  private readonly dialogService: DialogService = inject(DialogService);

  private readonly confirmationService: ConfirmationService =
    inject(ConfirmationService);

  private readonly legacyTemplateImportMapper: LegacyTemplateImportMapperService =
    inject(LegacyTemplateImportMapperService);

  readonly templates: InputSignal<Template[]> = input.required<Template[]>();

  @ViewChild('import') importRef: FileUpload | undefined;

  onChange(template: Template): void {
    this.store$.dispatch(TemplateUIActions.change({ template }));
  }

  onCreate(): void {
    const dialogRef: DynamicDialogRef = this.openDialog('Create New Template', {
      mode: CHANGE_MODE.Create,
    });

    dialogRef.onClose
      .pipe(
        tap((template: Template | null | undefined): void => {
          if (!template) {
            return;
          }

          this.store$.dispatch(TemplateUIActions.create({ template }));
        }),
        take(1)
      )
      .subscribe();
  }

  onEdit(template: Template): void {
    const dialogRef: DynamicDialogRef = this.openDialog('Edit Template', {
      mode: CHANGE_MODE.Update,
      template,
    });

    dialogRef.onClose
      .pipe(
        tap((updatedTemplate: Template | null | undefined): void => {
          if (!updatedTemplate) {
            return;
          }

          this.store$.dispatch(
            TemplateUIActions.update({
              template: { ...updatedTemplate, id: template.id },
            })
          );
        }),
        take(1)
      )
      .subscribe();
  }

  onDelete(eventData: EventData<Template>): void {
    this.confirmationService.confirm({
      target: eventData.event.target as EventTarget,
      message:
        'Do you want to delete this template and all its scopes and findings?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.store$.dispatch(
          TemplateUIActions.delete({ template: eventData.data })
        );
      },
    });
  }

  onExport(template: Template): void {
    this.store$.dispatch(TemplateUIActions.export({ template }));
  }

  onImport(event: FileSelectEvent): void {
    const uploadedFile: File = event.currentFiles[0];

    if (!uploadedFile) {
      return;
    }

    const reader: FileReader = new FileReader();

    reader.onload = (progressEvent: ProgressEvent<FileReader>): void => {
      this.import(progressEvent.target);

      this.importRef?.clear();
    };

    reader.readAsText(uploadedFile);
  }

  private import(eventTarget: FileReader | null): void {
    const fileContent: string | ArrayBufferLike | null | undefined =
      eventTarget?.result;

    if (!fileContent) {
      this.store$.dispatch(
        TemplateUIActions.importFailure({
          message: 'Cannot import empty template data',
        })
      );

      return;
    }

    const template: TemplateImport = this.parseImportedTemplate(
      fileContent as string
    );

    if (!template) {
      this.store$.dispatch(
        TemplateUIActions.importFailure({
          message: 'Cannot parse invalid template data',
        })
      );

      return;
    }

    this.store$.dispatch(TemplateUIActions.import({ template }));
  }

  private parseImportedTemplate(content: string): TemplateImport {
    const importObject: LegacyTemplateImport =
      this.jsonService.parseSafe<LegacyTemplateImport>(content);

    if ('template' in importObject) {
      return this.legacyTemplateImportMapper.mapFromLegacy(importObject);
    }

    return this.jsonService.parseSafe<TemplateImport>(content);
  }

  private openDialog(
    header: string,
    data: TemplateManagerDialogData
  ): DynamicDialogRef {
    return this.dialogService.open(TemplateManagerDialogComponent, {
      header,
      width: '70rem',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 3000,
      position: 'top',
      data,
    });
  }
}

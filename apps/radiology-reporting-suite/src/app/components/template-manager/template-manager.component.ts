import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  InputSignal,
  ViewChild,
} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  FileSelectEvent,
  FileUpload,
  FileUploadModule,
} from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { filter, take, tap } from 'rxjs';

import { CHANGE_MODE } from '@app/constants';
import { LegacyTemplateImportMapperService } from '@app/mapper/legacy-template-import-mapper.service';
import {
  SortOrderItem,
  SortOrderUpdate,
  Template,
  TemplateImport,
} from '@app/models/domain';
import {
  EventData,
  LegacyTemplateImport,
  TemplateManagerDialogData,
} from '@app/models/ui';
import { TemplateStore } from '@app/store/report-manager/template.store';
import { isNotNil } from '@app/utils/functions/common.functions';
import { findNextSortOrder } from '@app/utils/functions/order.functions';
import { JsonService } from '@app/utils/services/json.service';

import { SortableListManagerLayoutComponent } from '../sortable-list-manager-layout/sortable-list-manager-layout.component';
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
    SortableListManagerLayoutComponent,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './template-manager.component.html',
  styleUrls: ['./template-manager.component.scss'],
})
export class TemplateManagerComponent {
  protected readonly templateStore$: InstanceType<typeof TemplateStore> =
    inject(TemplateStore);

  private readonly jsonService: JsonService = inject(JsonService);

  private readonly dialogService: DialogService = inject(DialogService);

  private readonly confirmationService: ConfirmationService =
    inject(ConfirmationService);

  private readonly legacyTemplateImportMapper: LegacyTemplateImportMapperService =
    inject(LegacyTemplateImportMapperService);

  readonly templates: InputSignal<Template[]> = input.required<Template[]>();

  @ViewChild('import') importRef: FileUpload | undefined;

  onChange(template: Template | null): void {
    this.templateStore$.change(template);
  }

  onCreate(): void {
    const dialogRef: DynamicDialogRef = this.openDialog('Create New Template', {
      mode: CHANGE_MODE.Create,
    });

    dialogRef.onClose
      .pipe(
        filter<Template>(isNotNil),
        tap((template: Template): void => {
          const nextSortOrder: number = findNextSortOrder(this.templates());

          this.templateStore$.create({
            ...template,
            sortOrder: nextSortOrder,
          });
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
        filter<Template>(isNotNil),
        tap((updatedTemplate: Template): void => {
          this.templateStore$.update({
            ...updatedTemplate,
            id: template.id,
            sortOrder: template.sortOrder,
          });
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
        this.templateStore$.delete(eventData.data);
      },
    });
  }

  onExport(template: Template): void {
    this.templateStore$.export(template);
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

  onReorder(templates: ReadonlyArray<Template>): void {
    const sortOrders: SortOrderUpdate = {
      sortOrdersMap: templates.map(
        (template: Template, index: number): SortOrderItem => ({
          id: template.id,
          sortOrder: index,
        })
      ),
    };

    this.templateStore$.reorder(sortOrders);
  }

  private import(eventTarget: FileReader | null): void {
    const fileContent: string | ArrayBufferLike | null | undefined =
      eventTarget?.result;

    if (!fileContent) {
      this.templateStore$.showError('Cannot import empty template');

      return;
    }

    const template: TemplateImport | { error: unknown } =
      this.parseImportedTemplate(fileContent as string);

    if (!template || 'error' in template) {
      this.templateStore$.showError('Cannot parse file. Invalid template');

      return;
    }

    this.templateStore$.import(template);
  }

  private parseImportedTemplate(
    content: string
  ): TemplateImport | { error: unknown } {
    try {
      const importObject: LegacyTemplateImport =
        this.jsonService.parseSafe<LegacyTemplateImport>(content);

      if ('template' in importObject) {
        return this.legacyTemplateImportMapper.mapFromLegacy(importObject);
      }

      return this.jsonService.parseSafe<TemplateImport>(content);
    } catch (error: unknown) {
      return { error };
    }
  }

  private openDialog(
    header: string,
    data: TemplateManagerDialogData
  ): DynamicDialogRef {
    return this.dialogService.open(TemplateManagerDialogComponent, {
      header,
      modal: true,
      closable: true,
      width: '70rem',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 3000,
      position: 'top',
      data,
    });
  }
}

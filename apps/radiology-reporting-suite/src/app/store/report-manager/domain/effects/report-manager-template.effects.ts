import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { ApplicationErrorMapperService } from '@app/mapper/application-error-mapper.service';
import { TemplateMapperService } from '@app/mapper/template-mapper.service';
import {
  TemplateCreateDto,
  TemplateDto,
  TemplateImportDto,
  TemplateUpdateDto,
} from '@app/models/data';
import { Template } from '@app/models/domain';

import { ReportManagerTemplateDataActions } from '../../data/actions/report-manager-template-data.actions';
import { ReportManagerTemplateActions } from '../actions/report-manager-template.actions';

@Injectable()
export class ReportManagerTemplateEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  private readonly templateMapper: TemplateMapperService = inject(
    TemplateMapperService
  );

  private readonly errorMapper: ApplicationErrorMapperService = inject(
    ApplicationErrorMapperService
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateActions.fetch),
      map(() => ReportManagerTemplateDataActions.fetch())
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateDataActions.fetchFailure),
      map(
        ({
          error,
        }: ReturnType<
          typeof ReportManagerTemplateDataActions.fetchFailure
        >) => {
          return ReportManagerTemplateActions.fetchFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to fetch templates'
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateDataActions.fetchSuccess),
      map(
        ({
          templates,
        }: ReturnType<
          typeof ReportManagerTemplateDataActions.fetchSuccess
        >) => {
          return ReportManagerTemplateActions.fetchSuccess({
            templates: templates.map(
              (template: TemplateDto): Template =>
                this.templateMapper.mapFromDto(template)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateActions.create),
      map(
        ({
          template,
        }: ReturnType<typeof ReportManagerTemplateActions.create>) => {
          const dto: TemplateCreateDto =
            this.templateMapper.mapToCreateDto(template);

          return ReportManagerTemplateDataActions.create({
            template: dto,
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly createFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateDataActions.createFailure),
      map(
        ({
          error,
        }: ReturnType<
          typeof ReportManagerTemplateDataActions.createFailure
        >) => {
          return ReportManagerTemplateActions.createFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to create template',
              this.templateMapper.mapFromCreateDto.bind(error.data)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly createSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateDataActions.createSuccess),
      map(
        ({
          template,
        }: ReturnType<typeof ReportManagerTemplateDataActions.createSuccess>) =>
          ReportManagerTemplateActions.createSuccess({
            template: this.templateMapper.mapFromDto(template),
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateActions.update),
      map(
        ({
          template,
        }: ReturnType<typeof ReportManagerTemplateActions.update>) => {
          const dto: TemplateUpdateDto =
            this.templateMapper.mapToUpdateDto(template);

          return ReportManagerTemplateDataActions.update({
            template: dto,
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly updateFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateDataActions.updateFailure),
      map(
        ({
          error,
        }: ReturnType<
          typeof ReportManagerTemplateDataActions.updateFailure
        >) => {
          return ReportManagerTemplateActions.updateFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to update template',
              this.templateMapper.mapFromUpdateDto.bind(error.data)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly updateSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateDataActions.updateSuccess),
      map(
        ({
          template,
        }: ReturnType<typeof ReportManagerTemplateDataActions.updateSuccess>) =>
          ReportManagerTemplateActions.updateSuccess({
            template: this.templateMapper.mapFromDto(template),
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateActions.delete),
      map(
        ({
          template,
        }: ReturnType<typeof ReportManagerTemplateActions.delete>) => {
          const dto: TemplateDto = this.templateMapper.mapToDto(template);

          return ReportManagerTemplateDataActions.delete({
            template: dto,
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly deleteFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateDataActions.deleteFailure),
      map(
        ({
          error,
        }: ReturnType<
          typeof ReportManagerTemplateDataActions.deleteFailure
        >) => {
          return ReportManagerTemplateActions.deleteFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to delete template',
              this.templateMapper.mapFromDto.bind(error.data)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly deleteSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateDataActions.deleteSuccess),
      map(
        ({
          template,
        }: ReturnType<typeof ReportManagerTemplateDataActions.deleteSuccess>) =>
          ReportManagerTemplateActions.deleteSuccess({
            template: this.templateMapper.mapFromDto(template),
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly export$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateActions.export),
      map(
        ({
          template,
        }: ReturnType<typeof ReportManagerTemplateActions.export>) => {
          const dto: TemplateDto = this.templateMapper.mapToDto(template);

          return ReportManagerTemplateDataActions.export({
            template: dto,
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly exportFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateDataActions.exportFailure),
      map(
        ({
          error,
        }: ReturnType<
          typeof ReportManagerTemplateDataActions.exportFailure
        >) => {
          return ReportManagerTemplateActions.exportFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to export template',
              this.templateMapper.mapFromDto.bind(error.data)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly exportSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateDataActions.exportSuccess),
      map(
        ({
          template,
        }: ReturnType<typeof ReportManagerTemplateDataActions.exportSuccess>) =>
          ReportManagerTemplateActions.exportSuccess({
            template: this.templateMapper.mapFromDto(template),
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly import$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateActions.import),
      map(
        ({
          template,
        }: ReturnType<typeof ReportManagerTemplateActions.import>) => {
          const dto: TemplateImportDto =
            this.templateMapper.mapToImportDto(template);

          return ReportManagerTemplateDataActions.import({
            template: dto,
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly importFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateDataActions.importFailure),
      map(
        ({
          error,
        }: ReturnType<
          typeof ReportManagerTemplateDataActions.importFailure
        >) => {
          return ReportManagerTemplateActions.importFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to import template',
              this.templateMapper.mapFromImportDto.bind(error.data)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly importSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateDataActions.importSuccess),
      map(
        ({
          template,
        }: ReturnType<typeof ReportManagerTemplateDataActions.importSuccess>) =>
          ReportManagerTemplateActions.importSuccess({
            template: this.templateMapper.mapFromDto(template),
          })
      )
    );
  });
}

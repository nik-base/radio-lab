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
import { ApplicationActions } from '@app/store/actions/application.actions';

import { TemplateDataActions } from '../../data/actions/template-data.actions';
import { ScopeActions } from '../actions/scope.actions';
import { TemplateActions } from '../actions/template.actions';

@Injectable()
export class TemplateEffects {
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
      ofType(TemplateActions.fetch),
      map(() => TemplateDataActions.fetch())
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateDataActions.fetchFailure),
      map(({ error }: ReturnType<typeof TemplateDataActions.fetchFailure>) => {
        return TemplateActions.fetchFailure({
          error: this.errorMapper.mapFromDto(
            error,
            'Failed to fetch templates'
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateDataActions.fetchSuccess),
      map(
        ({
          templates,
        }: ReturnType<typeof TemplateDataActions.fetchSuccess>) => {
          return TemplateActions.fetchSuccess({
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
      ofType(TemplateActions.create),
      map(({ template }: ReturnType<typeof TemplateActions.create>) => {
        const dto: TemplateCreateDto =
          this.templateMapper.mapToCreateDto(template);

        return TemplateDataActions.create({
          template: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly createFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateDataActions.createFailure),
      map(({ error }: ReturnType<typeof TemplateDataActions.createFailure>) => {
        return TemplateActions.createFailure({
          error: this.errorMapper.mapFromDto(
            error,
            `Failed to create template: '${error.data?.name}'`,
            this.templateMapper.mapFromCreateDto.bind(error.data)
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly createSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateDataActions.createSuccess),
      map(
        ({ template }: ReturnType<typeof TemplateDataActions.createSuccess>) =>
          TemplateActions.createSuccess({
            template: this.templateMapper.mapFromDto(template),
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateActions.update),
      map(({ template }: ReturnType<typeof TemplateActions.update>) => {
        const dto: TemplateUpdateDto =
          this.templateMapper.mapToUpdateDto(template);

        return TemplateDataActions.update({
          template: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly updateFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateDataActions.updateFailure),
      map(({ error }: ReturnType<typeof TemplateDataActions.updateFailure>) => {
        return TemplateActions.updateFailure({
          error: this.errorMapper.mapFromDto(
            error,
            `Failed to update template: '${error.data?.name}'`,
            this.templateMapper.mapFromUpdateDto.bind(error.data)
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly updateSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateDataActions.updateSuccess),
      map(
        ({ template }: ReturnType<typeof TemplateDataActions.updateSuccess>) =>
          TemplateActions.updateSuccess({
            template: this.templateMapper.mapFromDto(template),
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateActions.delete),
      map(({ template }: ReturnType<typeof TemplateActions.delete>) => {
        const dto: TemplateDto = this.templateMapper.mapToDto(template);

        return TemplateDataActions.delete({
          template: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly deleteFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateDataActions.deleteFailure),
      map(({ error }: ReturnType<typeof TemplateDataActions.deleteFailure>) => {
        return TemplateActions.deleteFailure({
          error: this.errorMapper.mapFromDto(
            error,
            `Failed to delete template: '${error.data?.name}'`,
            this.templateMapper.mapFromDto.bind(error.data)
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly deleteSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateDataActions.deleteSuccess),
      map(
        ({ template }: ReturnType<typeof TemplateDataActions.deleteSuccess>) =>
          TemplateActions.deleteSuccess({
            template: this.templateMapper.mapFromDto(template),
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly export$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateActions.export),
      map(({ template }: ReturnType<typeof TemplateActions.export>) => {
        const dto: TemplateDto = this.templateMapper.mapToDto(template);

        return TemplateDataActions.export({
          template: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly exportFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateDataActions.exportFailure),
      map(({ error }: ReturnType<typeof TemplateDataActions.exportFailure>) => {
        return TemplateActions.exportFailure({
          error: this.errorMapper.mapFromDto(
            error,
            `Failed to export template: '${error.data?.name}'`,
            this.templateMapper.mapFromDto.bind(error.data)
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly exportSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateDataActions.exportSuccess),
      map(
        ({ template }: ReturnType<typeof TemplateDataActions.exportSuccess>) =>
          TemplateActions.exportSuccess({
            template: this.templateMapper.mapFromDto(template),
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly import$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateActions.import),
      map(({ template }: ReturnType<typeof TemplateActions.import>) => {
        const dto: TemplateImportDto =
          this.templateMapper.mapToImportDto(template);

        return TemplateDataActions.import({
          template: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly importFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateDataActions.importFailure),
      map(({ error }: ReturnType<typeof TemplateDataActions.importFailure>) => {
        return TemplateActions.importFailure({
          error: this.errorMapper.mapFromDto(
            error,
            `Failed to import template: '${error.data?.name}'`,
            this.templateMapper.mapFromImportDto.bind(error.data)
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateActions.reset),
      map(() => ScopeActions.reset())
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly importSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateDataActions.importSuccess),
      map(
        ({ template }: ReturnType<typeof TemplateDataActions.importSuccess>) =>
          TemplateActions.importSuccess({
            template: this.templateMapper.mapFromDto(template),
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly failure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        TemplateActions.fetchFailure,
        TemplateActions.createFailure,
        TemplateActions.updateFailure,
        TemplateActions.deleteFailure,
        TemplateActions.exportFailure,
        TemplateActions.importFailure
      ),
      map(
        ({
          error,
        }:
          | ReturnType<typeof TemplateActions.fetchFailure>
          | ReturnType<typeof TemplateActions.createFailure>
          | ReturnType<typeof TemplateActions.updateFailure>
          | ReturnType<typeof TemplateActions.deleteFailure>
          | ReturnType<typeof TemplateActions.exportFailure>
          | ReturnType<typeof TemplateActions.importFailure>) =>
          ApplicationActions.error({ error })
      )
    );
  });
}

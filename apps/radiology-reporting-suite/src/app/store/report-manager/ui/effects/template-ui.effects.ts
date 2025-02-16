import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs';

import { APP_NOTIFICATION_TYPE } from '@app/constants';
import { ApplicationUIActions } from '@app/store/actions/application-ui.actions';
import { FileService } from '@app/utils/services/file.service';

import { TemplateActions } from '../../domain/actions/template.actions';
import { ScopeUIActions } from '../actions/scope-ui.actions';
import { TemplateUIActions } from '../actions/template-ui.actions';

@Injectable()
export class TemplateUIEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  private readonly fileService: FileService = inject(FileService);

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateUIActions.fetch),
      map(() => TemplateActions.fetch())
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateUIActions.create),
      map(({ template }: ReturnType<typeof TemplateUIActions.create>) =>
        TemplateActions.create({
          template,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateUIActions.update),
      map(({ template }: ReturnType<typeof TemplateUIActions.update>) =>
        TemplateActions.update({
          template,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateUIActions.delete),
      map(({ template }: ReturnType<typeof TemplateUIActions.delete>) =>
        TemplateActions.delete({
          template,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly export$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateUIActions.export),
      map(({ template }: ReturnType<typeof TemplateUIActions.export>) =>
        TemplateActions.export({
          template,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly download$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TemplateUIActions.download),
        map(({ template }: ReturnType<typeof TemplateUIActions.download>) => {
          try {
            this.fileService.downloadJSONObject(template, template.name, 2);

            return TemplateUIActions.downloadSuccess({ template });
          } catch (error: unknown) {
            return TemplateUIActions.downloadFailure({
              error: {
                error: error,
                message: `Failed to download template: '${template.name}'`,
                data: template,
              },
            });
          }
        })
      );
    },
    { dispatch: false }
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly import$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateUIActions.import),
      map(({ template }: ReturnType<typeof TemplateUIActions.import>) =>
        TemplateActions.import({
          template,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly importFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateUIActions.importFailure),
      map(({ message }: ReturnType<typeof TemplateUIActions.importFailure>) =>
        ApplicationUIActions.notify({
          notification: {
            type: APP_NOTIFICATION_TYPE.Error,
            title: 'Failed to import template',
            message,
          },
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly change$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateUIActions.change),
      // eslint-disable-next-line @ngrx/no-multiple-actions-in-effects
      mergeMap(({ template }: ReturnType<typeof TemplateUIActions.change>) => [
        TemplateActions.setSelected({ template }),
        ScopeUIActions.reset(),
        ScopeUIActions.fetch({ templateId: template.id }),
      ])
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateUIActions.reset),
      map(() => TemplateActions.reset())
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
          ApplicationUIActions.notify({
            notification: {
              title: 'Error',
              message: error.message,
              type: APP_NOTIFICATION_TYPE.Error,
            },
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly success$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        TemplateActions.createSuccess,
        TemplateActions.updateSuccess,
        TemplateActions.deleteSuccess,
        TemplateActions.exportSuccess,
        TemplateActions.importSuccess,
        TemplateUIActions.downloadSuccess
      ),
      map(
        (
          action:
            | ReturnType<typeof TemplateActions.createSuccess>
            | ReturnType<typeof TemplateActions.updateSuccess>
            | ReturnType<typeof TemplateActions.deleteSuccess>
            | ReturnType<typeof TemplateActions.exportSuccess>
            | ReturnType<typeof TemplateActions.importSuccess>
            | ReturnType<typeof TemplateUIActions.downloadSuccess>
        ) =>
          ApplicationUIActions.notify({
            notification: {
              title: 'Success',
              message: `Template '${action.template.name}' ${this.getActionType(action)} successfully`,
              type: APP_NOTIFICATION_TYPE.Success,
            },
          })
      )
    );
  });

  private getActionType(
    action:
      | ReturnType<typeof TemplateActions.createSuccess>
      | ReturnType<typeof TemplateActions.updateSuccess>
      | ReturnType<typeof TemplateActions.deleteSuccess>
      | ReturnType<typeof TemplateActions.exportSuccess>
      | ReturnType<typeof TemplateActions.importSuccess>
      | ReturnType<typeof TemplateUIActions.downloadSuccess>
  ): string {
    switch (action.type) {
      case TemplateActions.createSuccess.type:
        return 'created';
      case TemplateActions.updateSuccess.type:
        return 'updated';
      case TemplateActions.deleteSuccess.type:
        return 'deleted';
      case TemplateActions.exportSuccess.type:
        return 'exported';
      case TemplateActions.importSuccess.type:
        return 'imported';
      case TemplateUIActions.downloadSuccess.type:
        return 'downloaded';
    }
  }
}

import { Injectable } from '@angular/core';
import { isNil } from 'lodash-es';

import { ApplicationErrorDto } from '@app/models/data';
import { ApplicationError } from '@app/models/domain';

@Injectable({ providedIn: 'root' })
export class ApplicationErrorMapperService {
  mapFromDto<TDto, T>(
    error: ApplicationErrorDto<TDto>,
    message?: string,
    mapper?: (_: TDto) => T
  ): ApplicationError<T> {
    return {
      message: error.message || message || 'An error occurred',
      error: error.error,
      data:
        isNil(error.data) || isNil(mapper) || typeof mapper !== 'function'
          ? undefined
          : mapper(error.data),
    };
  }
}

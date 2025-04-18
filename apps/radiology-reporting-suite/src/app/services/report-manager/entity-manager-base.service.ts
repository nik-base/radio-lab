import { Observable } from 'rxjs';

import { SortOrderUpdateDto } from '../../models/data';

export abstract class EntityManagerBaseService<
  TDto,
  TCreateDto,
  TTUpdateDto,
  TFetchAll = { id: string },
> {
  abstract fetchAll$(params?: TFetchAll): Observable<TDto[]>;

  abstract create$(entity: TCreateDto): Observable<TDto>;

  abstract update$(entity: TTUpdateDto): Observable<TDto>;

  abstract delete$(id: string): Observable<void>;

  abstract reorder$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void>;
}

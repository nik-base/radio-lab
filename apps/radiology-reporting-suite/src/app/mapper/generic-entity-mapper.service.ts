import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GenericEntityMapperService {
  mapFromDto<TEntity, TDto>(dto: TDto): TEntity {
    return {
      ...dto,
    } as unknown as TEntity;
  }

  mapFromDtoList<TEntity, TDto>(dto: TDto[]): TEntity[] {
    return dto.map(
      (item: TDto): TEntity => this.mapFromDto<TEntity, TDto>(item)
    );
  }

  mapToDto<TEntity, TDto>(entity: TEntity): TDto {
    return {
      ...entity,
    } as unknown as TDto;
  }

  mapToDtoList<TEntity, TDto>(entities: TEntity[]): TDto[] {
    return entities.map(
      (item: TEntity): TDto => this.mapToDto<TEntity, TDto>(item)
    );
  }
}

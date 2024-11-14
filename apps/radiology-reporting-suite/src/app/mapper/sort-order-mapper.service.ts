import { Injectable } from '@angular/core';

import { SortOrderItemDto, SortOrderUpdateDto } from '@app/models/data';
import { SortOrderItem, SortOrderUpdate } from '@app/models/domain';

@Injectable({ providedIn: 'root' })
export class SortOrderMapperService {
  mapToDto(sortOrders: SortOrderUpdate): SortOrderUpdateDto {
    return {
      sortOrdersMap: sortOrders.sortOrdersMap.map(
        (item: SortOrderItem): SortOrderItemDto => this.mapItemToDto(item)
      ),
    };
  }

  mapItemToDto(item: SortOrderItem): SortOrderItemDto {
    return {
      id: item.id,
      sortOrder: item.sortOrder,
    };
  }
}

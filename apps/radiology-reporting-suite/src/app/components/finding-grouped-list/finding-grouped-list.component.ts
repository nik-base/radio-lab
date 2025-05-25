import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';

import {
  Finding,
  FindingClassifierData,
  FindingData,
  FindingGroupData,
} from '@app/models/domain';
import { ConcatTwoArraysPipe } from '@app/pipes/concat-two-arrays/concat-two-arrays.pipe';
import { FilterArrayPipe } from '@app/pipes/filter-array/filter-array.pipe';
import { FindInArrayPipe } from '@app/pipes/find-in-array/find-in-array.pipe';
import { SortArrayPipe } from '@app/pipes/sort-array/sort-array.pipe';

@Component({
  selector: 'radio-finding-grouped-list',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    TooltipModule,
    ButtonModule,
    Skeleton,
    FilterArrayPipe,
    FindInArrayPipe,
    ConcatTwoArraysPipe,
    SortArrayPipe,
  ],
  templateUrl: './finding-grouped-list.component.html',
})
export class FindingGroupedListComponent {
  readonly findingGroups: InputSignal<FindingGroupData[]> =
    input.required<FindingGroupData[]>();

  readonly isLoading: InputSignal<boolean> = input<boolean>(true);

  readonly selection: OutputEmitterRef<Finding> = output<Finding>();

  protected mockFindingGroups: FindingGroupData[] = Array<FindingGroupData>(
    5
  ).fill({
    id: '',
    name: '',
    isDefault: false,
    scopeId: '',
    sortOrder: 0,
    classifiers: Array<FindingClassifierData>(5).fill({
      id: '',
      name: '',
      isDefault: false,
      sortOrder: 0,
      groupId: '',
      scopeId: '',
      findings: Array<Finding>(5).fill({
        id: '',
        name: '',
        isNormal: false,
        sortOrder: 0,
        classifierId: '',
        groupId: '',
        scopeId: '',
        description: {
          html: '',
          json: null,
          text: '',
        },
        impression: null,
        recommendation: null,
      }),
    }),
  });

  onClick(finding: FindingData | FindingClassifierData): void {
    //this.selection.emit(finding);
  }
}

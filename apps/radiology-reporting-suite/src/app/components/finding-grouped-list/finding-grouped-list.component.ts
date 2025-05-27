import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { SplitButton } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';

import {
  FindingClassifierData,
  FindingData,
  FindingGroupData,
} from '@app/models/domain';
import { CastToTypePipe } from '@app/pipes/case-to-type/cast-to-type.pipe';
import { ClassifierToMenuItemsPipe } from '@app/pipes/classifier-to-menu-items/classifier-to-menu-items.pipe';
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
    SplitButton,
    Skeleton,
    FilterArrayPipe,
    FindInArrayPipe,
    ConcatTwoArraysPipe,
    SortArrayPipe,
    CastToTypePipe,
    ClassifierToMenuItemsPipe,
  ],
  templateUrl: './finding-grouped-list.component.html',
})
export class FindingGroupedListComponent {
  readonly findingGroups: InputSignal<FindingGroupData[]> =
    input.required<FindingGroupData[]>();

  readonly isLoading: InputSignal<boolean> = input<boolean>(true);

  readonly selection: OutputEmitterRef<FindingData> = output<FindingData>();

  protected readonly findingGroupList: Signal<FindingGroupData[]> = computed(
    () => {
      return this.findingGroups().filter(
        (item: FindingGroupData) =>
          item.classifiers.flatMap(
            (classifier: FindingClassifierData): ReadonlyArray<FindingData> =>
              classifier.findings
          ).length > 0
      );
    }
  );

  protected readonly Object: typeof Object = Object;

  protected readonly findingType: FindingData = {} as FindingData;

  protected readonly classifierType: FindingClassifierData =
    {} as FindingClassifierData;

  protected mockFindingGroups: FindingGroupData[] = Array.from(
    { length: 5 },
    (_: unknown, groupIndex: number) => ({
      id: `group-${groupIndex}`,
      name: '',
      isDefault: false,
      scopeId: '',
      sortOrder: 0,
      classifiers: Array.from(
        { length: 5 },
        (_: unknown, classifierIndex: number) => ({
          id: `classifier-${classifierIndex}`,
          name: '',
          isDefault: false,
          sortOrder: 0,
          groupId: '',
          scopeId: '',
          findings: Array.from(
            { length: 5 },
            (_: unknown, findingIndex: number) => ({
              id: `finding-${findingIndex}`,
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
            })
          ),
        })
      ),
    })
  );

  onFindingClick(finding: FindingData): void {
    this.selection.emit(finding);
  }

  onFindingInClassifierClick(finding: FindingData): void {
    this.selection.emit(finding);
  }

  onClassifierClick(event: MouseEvent, splitButton: SplitButton) {
    event.preventDefault();

    setTimeout(() => splitButton.onDropdownButtonClick(event));
  }
}

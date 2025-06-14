import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { isNil } from 'lodash-es';
import { AccordionModule } from 'primeng/accordion';
import { TooltipOptions } from 'primeng/api';
import { Button } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';
import { SplitButton } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';

import { APP_TOOLTIP_OPTIONS } from '@app/constants';
import {
  EditorContent,
  Finding,
  FindingClassifierData,
  FindingData,
  FindingGroupData,
} from '@app/models/domain';
import { InfoDialogData } from '@app/models/ui';
import { CastToTypePipe } from '@app/pipes/case-to-type/cast-to-type.pipe';
import { ClassifierToMenuItemsPipe } from '@app/pipes/classifier-to-menu-items/classifier-to-menu-items.pipe';
import { ConcatTwoArraysPipe } from '@app/pipes/concat-two-arrays/concat-two-arrays.pipe';
import { EditorHasValuePipe } from '@app/pipes/editor-has-value/editor-has-value.pipe';
import { FilterArrayPipe } from '@app/pipes/filter-array/filter-array.pipe';
import { FindInArrayPipe } from '@app/pipes/find-in-array/find-in-array.pipe';
import { SortArrayPipe } from '@app/pipes/sort-array/sort-array.pipe';

import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

@Component({
  selector: 'radio-finding-grouped-list',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    TooltipModule,
    Button,
    ButtonGroup,
    SplitButton,
    Skeleton,
    FilterArrayPipe,
    FindInArrayPipe,
    ConcatTwoArraysPipe,
    SortArrayPipe,
    CastToTypePipe,
    ClassifierToMenuItemsPipe,
    EditorHasValuePipe,
  ],
  providers: [DialogService],
  templateUrl: './finding-grouped-list.component.html',
  styleUrls: ['./finding-grouped-list.component.scss'],
})
export class FindingGroupedListComponent {
  private readonly dialogService: DialogService = inject(DialogService);

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

  protected readonly tooltipOptions: TooltipOptions = APP_TOOLTIP_OPTIONS;

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
      info: null,
      classifiers: Array.from(
        { length: 5 },
        (_: unknown, classifierIndex: number) => ({
          id: `classifier-${classifierIndex}`,
          name: '',
          isDefault: false,
          sortOrder: 0,
          groupId: '',
          scopeId: '',
          info: null,
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
              info: null,
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

  onGroupInfoClick(event: Event, group: FindingGroupData): void {
    event.preventDefault();

    event.stopPropagation();

    this.showInfoDialog(group.name, group.info);
  }

  onFindingInfoClick(finding: Finding): void {
    this.showInfoDialog(finding.name, finding.info);
  }

  onClassifierInfoClick(classifier: FindingClassifierData): void {
    this.showInfoDialog(classifier.name, classifier.info);
  }

  private showInfoDialog(
    name: string,
    info: EditorContent | null
  ): DynamicDialogRef | null {
    if (isNil(info)) {
      return null;
    }

    return this.openInfoDialog(`Info: ${name}`, {
      name,
      info,
    });
  }

  private openInfoDialog(
    header: string,
    data: InfoDialogData
  ): DynamicDialogRef {
    return this.dialogService.open(InfoDialogComponent, {
      header,
      modal: false,
      closable: true,
      resizable: true,
      draggable: true,
      width: '40%',
      height: '100%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 3000,
      position: 'left',
      data,
    });
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { FindingClassifierData, FindingData } from '@app/models/domain';

@Pipe({
  name: 'classifierToMenuItems',
})
export class ClassifierToMenuItemsPipe implements PipeTransform {
  transform<T>(
    classifier: FindingClassifierData | null | undefined,
    commandFunction: (finding: FindingData) => void,
    thisContext: T
  ): MenuItem[] {
    if (!classifier?.findings?.length) {
      return [];
    }

    return classifier.findings.map(
      (finding: FindingData): MenuItem => ({
        label: finding.name,
        command: () => {
          commandFunction.call(thisContext, finding);
        },
      })
    );
  }
}

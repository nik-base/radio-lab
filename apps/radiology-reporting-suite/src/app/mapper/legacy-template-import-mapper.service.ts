import { inject, Injectable } from '@angular/core';

import { ScopeImport, TemplateImport } from '@app/models/domain';
import { LegacyTemplateImport } from '@app/models/ui';
import { LegacyScopeImport } from '@app/models/ui/legacy-template-import.interface';
import { JsonService } from '@app/utils/services/json.service';

@Injectable({ providedIn: 'root' })
export class LegacyTemplateImportMapperService {
  private readonly jsonService: JsonService = inject(JsonService);

  mapFromLegacy(legacy: LegacyTemplateImport): TemplateImport {
    return {
      name: legacy.template?.name,
      sortOrder: 0,
      protocol: {
        html: legacy.template?.decriptionHTML ?? '',
        json: legacy.template?.decriptionJSON
          ? this.jsonService.parseSafe(legacy.template?.decriptionJSON)
          : null,
        text: legacy.template?.description ?? '',
      },
      patientInfo: {
        html: legacy.template?.patientInfoHTML ?? '',
        json: legacy.template?.patientInfoJSON
          ? this.jsonService.parseSafe(legacy.template?.patientInfoJSON)
          : null,
        text: legacy.template?.patientInfo ?? '',
      },
      scopes:
        legacy.protocols?.map(
          (scope: LegacyScopeImport): ScopeImport => ({
            name: scope.protocol?.name ?? '',
            sortOrder: scope.protocol?.order ?? 0,
            groups: [],
            // findings:
            //   scope.findings?.map(
            //     (finding: LegacyFindingImport): FindingBase => ({
            //       name: finding.title ?? '',
            //       sortOrder: finding.order ?? 0,
            //       isNormal: finding.isNormal ?? false,
            //       description: {
            //         html: finding.decriptionHTML ?? '',
            //         json: finding.decriptionJSON
            //           ? this.jsonService.parseSafe(finding.decriptionJSON)
            //           : null,
            //         text: finding.description ?? '',
            //       },
            //       impression: {
            //         html: finding.impressionHTML ?? '',
            //         json: finding.impressionJSON
            //           ? this.jsonService.parseSafe(finding.impressionJSON)
            //           : null,
            //         text: finding.impression ?? '',
            //       },
            //       recommendation: {
            //         html: finding.recommendationHTML ?? '',
            //         json: finding.recommendationJSON
            //           ? this.jsonService.parseSafe(finding.recommendationJSON)
            //           : null,
            //         text: finding.recommendation ?? '',
            //       },
            //     })
            //   ) ?? [],
          })
        ) ?? [],
    };
  }
}

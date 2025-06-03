import { inject, Injectable } from '@angular/core';
import { JSONContent } from '@tiptap/core';

import {
  RADIO_DEFAULT_CLASSIFIER,
  RADIO_DEFAULT_GROUP,
  VARIABLE_SOURCE,
  VARIABLE_TYPE,
} from '@app/constants';
import {
  EditorContent,
  FindingClassifierImport,
  FindingGroupImport,
  FindingImport,
  ScopeImport,
  TemplateImport,
  VariableImport,
  VariableValueImport,
} from '@app/models/domain';
import { LegacyTemplateImport } from '@app/models/ui';
import {
  LegacyFindingImport,
  LegacyScopeImport,
  LegacyVariableImport,
  LegacyVariableValueImport,
} from '@app/models/ui/legacy-template-import.interface';
import { isNilOrEmpty } from '@app/utils/functions/common.functions';
import { JsonService } from '@app/utils/services/json.service';

import { EditorLegacyVariableMigratorService } from './editor-legacy-variable-migrator.service';

interface MappedClassifierData {
  name: string; // Actual name (default or trimmed)
  isDefault: boolean;
  findings: LegacyFindingImport[]; // Legacy findings to be mapped later
  minOrder: number;
}

interface MappedGroupData {
  name: string; // Actual name (default or trimmed)
  isDefault: boolean;
  classifiers: Map<string, MappedClassifierData>; // Key is actualClassifierName
  minOrder: number;
}

@Injectable({ providedIn: 'root' })
export class LegacyTemplateImportMapperService {
  private readonly jsonService: JsonService = inject(JsonService);

  private readonly editorLegacyVariableMigratorService: EditorLegacyVariableMigratorService =
    inject(EditorLegacyVariableMigratorService);

  mapFromLegacy(legacy: LegacyTemplateImport): TemplateImport {
    return {
      name: legacy.template.name,
      sortOrder: 0,
      protocol: {
        html: legacy.template.decriptionHTML ?? '', // Typo "decription" is from legacy model
        json: legacy.template.decriptionJSON // Typo "decription" is from legacy model
          ? this.jsonService.parseSafe(legacy.template.decriptionJSON) // Typo "decription" is from legacy model
          : null,
        text: legacy.template.description ?? '',
      },
      patientInfo: isNilOrEmpty(legacy.template.patientInfo?.trim())
        ? null
        : {
            html: legacy.template.patientInfoHTML ?? '',
            json: legacy.template.patientInfoJSON
              ? this.jsonService.parseSafe(legacy.template.patientInfoJSON)
              : null,
            text: legacy.template.patientInfo ?? '',
          },
      scopes:
        legacy.protocols?.map((legacyScope: LegacyScopeImport): ScopeImport => {
          const groupedData: Map<string, MappedGroupData> = new Map<
            string,
            MappedGroupData
          >();

          const legacyFindingImportList: LegacyFindingImport[] =
            legacyScope.findings ?? [];

          for (const _lfi of legacyFindingImportList) {
            let lfi: LegacyFindingImport = _lfi;

            if (!lfi.finding) {
              lfi = {
                finding: _lfi as unknown as typeof lfi.finding,
                variables: [],
              };
            }

            const legacyGroupName: string | undefined = lfi.finding.group;

            const legacyClassifierName: string | undefined =
              lfi.finding.classifier;

            const currentFindingOrder: number = lfi.finding.order ?? 0;

            const trimmedLegacyGroupName: string =
              legacyGroupName?.trim() ?? '';

            const isDefaultGroup: boolean = isNilOrEmpty(
              trimmedLegacyGroupName
            );

            const actualGroupName: string = isDefaultGroup
              ? RADIO_DEFAULT_GROUP.name
              : trimmedLegacyGroupName;

            const trimmedLegacyClassifierName: string =
              legacyClassifierName?.trim() ?? '';

            const isDefaultClassifier: boolean = isNilOrEmpty(
              trimmedLegacyClassifierName
            );

            const actualClassifierName: string = isDefaultClassifier
              ? RADIO_DEFAULT_CLASSIFIER.name
              : trimmedLegacyClassifierName;

            if (!groupedData.has(actualGroupName)) {
              groupedData.set(actualGroupName, {
                name: actualGroupName,
                isDefault: isDefaultGroup,
                classifiers: new Map<string, MappedClassifierData>(),
                minOrder: Infinity,
              });
            }

            const groupEntry: MappedGroupData =
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              groupedData.get(actualGroupName)!;

            groupEntry.minOrder = Math.min(
              groupEntry.minOrder,
              currentFindingOrder
            );

            if (!groupEntry.classifiers.has(actualClassifierName)) {
              groupEntry.classifiers.set(actualClassifierName, {
                name: actualClassifierName,
                isDefault: isDefaultClassifier,
                findings: [],
                minOrder: Infinity,
              });
            }

            const classifierEntry: MappedClassifierData =
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              groupEntry.classifiers.get(actualClassifierName)!;

            classifierEntry.findings.push(lfi);

            classifierEntry.minOrder = Math.min(
              classifierEntry.minOrder,
              currentFindingOrder
            );
          }

          const groupImports: FindingGroupImport[] = [];

          for (const groupEntry of Array.from(groupedData.values())) {
            const classifierImports: FindingClassifierImport[] = [];

            for (const classifierEntry of Array.from(
              groupEntry.classifiers.values()
            )) {
              const findingImports: FindingImport[] =
                classifierEntry.findings.map(
                  (lfi: LegacyFindingImport): FindingImport =>
                    this.mapLegacyFindingToFindingImport(lfi)
                );

              classifierImports.push({
                name: classifierEntry.name,
                sortOrder:
                  classifierEntry.minOrder === Infinity
                    ? 0
                    : classifierEntry.minOrder,
                isDefault: classifierEntry.isDefault,
                findings: findingImports,
              });
            }

            groupImports.push({
              name: groupEntry.name,
              sortOrder:
                groupEntry.minOrder === Infinity ? 0 : groupEntry.minOrder,
              isDefault: groupEntry.isDefault,
              classifiers: classifierImports,
            });
          }

          return {
            name: legacyScope.protocol.name,
            sortOrder: legacyScope.protocol.order,
            groups: groupImports,
          };
        }) ?? [],
    };
  }

  private mapLegacyFindingToFindingImport(
    lfi: LegacyFindingImport
  ): FindingImport {
    const findingBase: typeof lfi.finding = lfi.finding;

    const hasImpression: boolean = !isNilOrEmpty(
      findingBase.impression?.trim()
    );

    const impressionJSON: JSONContent | null =
      this.editorLegacyVariableMigratorService.migrateJson(
        findingBase.impressionJSON
      );

    const impression: EditorContent | null = hasImpression
      ? {
          html:
            this.editorLegacyVariableMigratorService.migrateHtml(
              findingBase.impressionHTML
            ) ?? '',
          json: impressionJSON,
          text: findingBase.impression ?? '',
        }
      : null;

    const hasRecommendation: boolean = !isNilOrEmpty(
      findingBase.recommendation?.trim()
    );

    const recommendationJSON: JSONContent | null =
      this.editorLegacyVariableMigratorService.migrateJson(
        findingBase.recommendationJSON
      );

    const recommendation: EditorContent | null = hasRecommendation
      ? {
          html:
            this.editorLegacyVariableMigratorService.migrateHtml(
              findingBase.recommendationHTML
            ) ?? '',
          json: recommendationJSON,
          text: findingBase.recommendation ?? '',
        }
      : null;

    const descriptionJSON: JSONContent | null =
      this.editorLegacyVariableMigratorService.migrateJson(
        findingBase.decriptionJSON // Typo "decription" is from legacy model
      );

    return {
      name: findingBase.title,
      sortOrder: findingBase.order ?? 0,
      isNormal: findingBase.isNormal ?? false,
      description: {
        html:
          this.editorLegacyVariableMigratorService.migrateHtml(
            findingBase.decriptionHTML
          ) ?? '', // Typo "decription" is from legacy model
        json: descriptionJSON,
        text: findingBase.description ?? '',
      },
      impression,
      recommendation,
      variables: (lfi.variables ?? []).map(
        (legacyVar: LegacyVariableImport): VariableImport =>
          this.mapLegacyVariableToVariableImport(legacyVar)
      ),
    };
  }

  private mapLegacyVariableToVariableImport(
    lvi: LegacyVariableImport
  ): VariableImport {
    // eslint-disable-next-line @typescript-eslint/typedef
    const variableBase = lvi.variable;

    return {
      id: variableBase.id,
      name: variableBase.name,
      sortOrder: variableBase.sortOrder ?? 0,
      type: VARIABLE_TYPE.MultiSelect,
      source: VARIABLE_SOURCE.Finding, // Defaulting source for legacy variables
      variableValues: (lvi.values ?? []).map(
        (legacyVal: LegacyVariableValueImport): VariableValueImport =>
          this.mapLegacyVariableValueToVariableValueImport(legacyVal)
      ),
    };
  }

  private mapLegacyVariableValueToVariableValueImport(
    lvvi: LegacyVariableValueImport
  ): VariableValueImport {
    return {
      name: lvvi.value,
      sortOrder: lvvi.sortOrder ?? 0,
    };
  }
}

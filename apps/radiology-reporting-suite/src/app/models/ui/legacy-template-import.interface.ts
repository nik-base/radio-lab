export interface LegacyTemplateImport {
  readonly template: {
    readonly id: string;
    readonly name: string;
    readonly description?: string;
    readonly decriptionHTML?: string;
    readonly decriptionJSON?: string;
    readonly patientInfo?: string;
    readonly patientInfoHTML?: string;
    readonly patientInfoJSON?: string;
  };
  readonly protocols: LegacyScopeImport[];
}

export interface LegacyScopeImport {
  readonly protocol: {
    readonly id: string;
    readonly name: string;
    readonly order: number;
    readonly templateId: string;
  };
  readonly findings: LegacyFindingImport[];
}

export interface LegacyFindingImport {
  readonly finding: {
    readonly id: string;
    readonly title: string;
    readonly order?: number;
    readonly group?: string;
    readonly classifier?: string;
    readonly description?: string;
    readonly impression?: string;
    readonly tags?: string[];
    readonly protocolId: string;
    readonly decriptionHTML?: string;
    readonly decriptionJSON?: string;
    readonly impressionHTML?: string;
    readonly impressionJSON?: string;
    readonly recommendation?: string;
    readonly recommendationHTML?: string;
    readonly recommendationJSON?: string;
    readonly isNormal?: boolean;
  };
  readonly variables: LegacyVariableImport[];
}

export interface LegacyVariableImport {
  readonly variable: {
    readonly id: string;
    readonly name: string;
    readonly type: string;
    readonly source: string;
    readonly entityId: string;
    readonly sortOrder?: number;
  };
  readonly values: LegacyVariableValueImport[];
}

export interface LegacyVariableValueImport {
  readonly id: string;
  readonly variableId: string;
  readonly value: string;
  readonly type: string;
  readonly sortOrder?: number;
}

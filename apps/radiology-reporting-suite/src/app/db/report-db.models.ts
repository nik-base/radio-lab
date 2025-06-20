export interface TemplateDBModel {
  readonly id: string;
  readonly name: string;
  readonly sortOrder: number;
  readonly description?: string;
  readonly descriptionHTML?: string;
  readonly descriptionJSON?: string | null;
  readonly patientInfo?: string;
  readonly patientInfoHTML?: string;
  readonly patientInfoJSON?: string | null;
}

export interface ScopeDBModel {
  readonly id: string;
  readonly name: string;
  readonly sortOrder: number;
  readonly templateId: string;
}

export interface FindingGroupDBModel {
  readonly id: string;
  readonly name: string;
  readonly sortOrder: number;
  readonly scopeId: string;
  readonly isDefault: boolean;
}

export interface FindingClassifierDBModel {
  readonly id: string;
  readonly name: string;
  readonly sortOrder: number;
  readonly scopeId: string;
  readonly groupId: string;
  readonly isDefault: boolean;
}

export interface FindingDBModel {
  readonly id: string;
  readonly name: string;
  readonly isNormal?: boolean;
  readonly sortOrder?: number;
  readonly description?: string;
  readonly descriptionHTML?: string;
  readonly descriptionJSON?: string | null;
  readonly impression?: string;
  readonly impressionHTML?: string;
  readonly impressionJSON?: string | null;
  readonly tags?: string[];
  readonly recommendation?: string;
  readonly recommendationHTML?: string;
  readonly recommendationJSON?: string | null;
  readonly scopeId: string;
  readonly groupId: string;
  readonly classifierId: string;
}

export interface VariableDBModel {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly source: string;
  readonly entityId: string;
  readonly sortOrder: number;
}

export interface VariableValueDBModel {
  readonly id: string;
  readonly name: string;
  readonly variableId: string;
  readonly sortOrder: number;
}

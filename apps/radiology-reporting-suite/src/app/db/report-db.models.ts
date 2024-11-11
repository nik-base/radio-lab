export interface TemplateDBModel {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly descriptionHTML?: string;
  readonly descriptionJSON?: string;
  readonly patientInfo?: string;
  readonly patientInfoHTML?: string;
  readonly patientInfoJSON?: string;
}

export interface ScopeDBModel {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly templateId: string;
}

export interface FindingDBModel {
  readonly id: string;
  readonly title: string;
  readonly group?: string;
  readonly isNormal?: boolean;
  readonly order?: number;
  readonly description?: string;
  readonly descriptionHTML?: string;
  readonly descriptionJSON?: string;
  readonly impression?: string;
  readonly impressionHTML?: string;
  readonly impressionJSON?: string;
  readonly tags?: string[];
  readonly recommendation?: string;
  readonly recommendationHTML?: string;
  readonly recommendationJSON?: string;
  readonly protocolId: string;
}

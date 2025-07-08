/* eslint-disable @typescript-eslint/typedef */
export const EDITOR_TOOLBAR_ITEM_TYPE = {
  Bold: 'bold',
  Italic: 'italic',
  Underline: 'underline',
  AlignLeft: 'align-left',
  AlignCenter: 'align-center',
  AlignRight: 'align-right',
  BulletedList: 'bulleted-list',
  OrderedList: 'ordered-list',
  FontFamily: 'font-family',
  FontSize: 'font-size',
  Table: 'table',
  Undo: 'undo',
  Redo: 'redo',
  Separator: '|',
} as const;

export const EDITOR_DEFAULT_FONT_FAMILY = 'Default' as const;

export const EDITOR_DEFAULT_FONT_SIZE = 12 as const;

export const EDITOR_DEFAULT_MIN_FONT_SIZE = 6 as const;

export const EDITOR_DEFAULT_MAX_FONT_SIZE = 32 as const;

export const EDITOR_REPORT_ATTRIBUTE_NAMES = {
  RadioItem: 'radioitem',
  FindingScopeIndex: 'radiofindingscopeindex',
  ImpressionScopeIndex: 'radioimpressionscopeindex',
  RecommendationScopeIndex: 'radiorecommendationscopeindex',
  FindingIndex: 'radiofindingindex',
  ImpressionIndex: 'radioimpressionindex',
  RecommendationIndex: 'radiorecommendationindex',
  ScopeId: 'radioscopeid',
  GroupId: 'radiogroupid',
  FindingId: 'radiofindingid',
  ImpressionId: 'radioimpressionid',
  RecommendationId: 'radiorecommendationid',
  ImpressionGroupId: 'radioimpressiongroupid',
  RecommendationGroupId: 'radiorecommendationgroupid',
  IsNormalFinding: 'radioisnormalfinding',
} as const;

export const EDITOR_REPORT_ATTRIBUTE_VALUES = {
  ProtocolSection: 'protocol-section',
  ProtocolTitle: 'protocol-title',
  FindingsSection: 'findings-section',
  ImpressionsSection: 'impressions-section',
  RecommendationsSection: 'recommendations-section',
  Scope: 'scope',
  Group: 'group',
  Finding: 'finding',
  Impression: 'impression',
  Recommendation: 'recommendation',
} as const;

export const EDITOR_REPORT_ID = {
  RadioReportProtocol: 'radio-report-protocol',
  RadioReportFindings: 'radio-report-findings',
  RadioReportImpressions: 'radio-report-impressions',
  RadioReportRecommendations: 'radio-report-recommendations',
  RadioReportImpressionsList: 'radio-report-impressions-list',
  RadioReportRecommendationsList: 'radio-report-recommendations-list',
} as const;

export const EDITOR_REPORT_EXTENSION_NODE_NAME = 'radioReportDiv' as const;

export const EDITOR_REPORT_EXTENSION_LIST_ITEM_NODE_NAME = 'listItem' as const;

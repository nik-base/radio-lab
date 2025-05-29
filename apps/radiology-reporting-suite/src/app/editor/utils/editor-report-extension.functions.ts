import { ChainedCommands, Editor, NodePos } from '@tiptap/core';
import DOMPurify from 'dompurify';
import { escape, isNil } from 'lodash-es';

import { FindingData, Template } from '@app/models/domain';
import { EditorFindingData } from '@app/models/ui';

import {
  EDITOR_REPORT_ATTRIBUTE_NAMES,
  EDITOR_REPORT_ATTRIBUTE_VALUES,
  EDITOR_REPORT_EXTENSION_NODE_NAME,
  EDITOR_REPORT_ID,
} from '../constants';

export function insertProtocolInEditor(
  editor: Editor,
  chain: () => ChainedCommands,
  template: Template
): boolean {
  const html: string = generateProtocolHTML(template);

  const findingsSection: NodePos | null = editor.$doc.querySelector(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      id: EDITOR_REPORT_ID.RadioReportFindings,
    }
  );

  if (!findingsSection) {
    // editor empty
    return chain().insertContentAt(0, html).run();
  }

  // editor has findings
  return chain()
    .insertContentAt(findingsSection.pos - 1, html)
    .run();
}

export function insertFindingInEditor(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData
): boolean {
  return insertFinding(editor, chain, findingData).run();
}

function insertFinding(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData
): ChainedCommands {
  const existingScopeSection: NodePos | null = editor.$doc.querySelector(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      [`data-${EDITOR_REPORT_ATTRIBUTE_NAMES.ScopeIndex}`]:
        findingData.scopeIndex,
    }
  );

  if (existingScopeSection) {
    // Scope section already exists
    return insertFindingInExistingScope(
      chain,
      findingData,
      existingScopeSection
    );
  }

  const scopeIndices: number[] = findScopeIndices(editor);

  if (!scopeIndices.length) {
    // First finding in report
    return insertFirstFindingInReport(editor, chain, findingData);
  }

  // first finding in scope
  return insertFirstFindingInScope(editor, chain, findingData, scopeIndices);
}

function insertFirstFindingInScope(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData,
  scopeIndices: number[]
): ChainedCommands {
  const closestIndex: number = findClosest(
    scopeIndices,
    findingData.scopeIndex
  );

  const html: string = generateFirstFindingInScopeHTML(findingData);

  const closestScopeDiv: NodePos = editor.$doc.querySelector(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      [`data-${EDITOR_REPORT_ATTRIBUTE_NAMES.ScopeIndex}`]: closestIndex,
    }
  ) as NodePos;

  if (findingData.scopeIndex < closestIndex) {
    // insert finding before closest scope
    return chain().insertContentAt(closestScopeDiv.pos - 1, html);
  } else {
    // insert finding after closest scope
    return chain().insertContentAt(
      closestScopeDiv.pos + closestScopeDiv.size - 1,
      html
    );
  }
}

function insertFirstFindingInReport(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData
): ChainedCommands {
  const html: string = generateFirstFindingInReportHTML(findingData);

  const protocolSection: NodePos | null = editor.$doc.querySelector(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      id: EDITOR_REPORT_ATTRIBUTE_VALUES.ProtocolSection,
    }
  );

  if (protocolSection) {
    // Insert after protocol seciton
    return chain().insertContentAt(
      protocolSection.pos + protocolSection.size - 1,
      html
    );
  }

  const firstEditorChild: NodePos | null = editor.$doc.firstChild;

  if (firstEditorChild) {
    // insert at first child of editor
    return chain().insertContentAt(firstEditorChild, html);
  }

  // editor empty
  return chain().insertContentAt(0, html);
}

function findClosest(array: number[], num: number): number {
  return array.reduce((prev: number, curr: number): number => {
    return Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev;
  });
}

function findScopeIndices(editor: Editor): number[] {
  const indices: number[] = [];

  editor.$doc
    .querySelectorAll(EDITOR_REPORT_EXTENSION_NODE_NAME, {
      [`data-${EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem}`]:
        EDITOR_REPORT_ATTRIBUTE_VALUES.Scope,
    })
    .forEach((scope: NodePos): void => {
      const scopeIndex: string = scope.attributes[
        `data-${EDITOR_REPORT_ATTRIBUTE_NAMES.ScopeIndex}`
      ] as string;

      const index: number = parseInt(scopeIndex, 10);

      indices.push(index);
    });

  return indices;
}

function insertFindingInExistingScope(
  chain: () => ChainedCommands,
  findingData: EditorFindingData,
  existingScopeSection: NodePos
): ChainedCommands {
  const html: string = generateFindingHTML(findingData.finding);

  const lastChild: NodePos | null = existingScopeSection.lastChild;

  if (lastChild) {
    // Add finding as the last item in the scope section
    return chain().insertContentAt(lastChild.pos + lastChild.size - 1, html);
  }

  // Add finding as the first item in the scope section
  return chain().insertContentAt(existingScopeSection.pos, html);
}

function generateProtocolHTML(template: Template): string {
  return `<div data-${EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem}="${EDITOR_REPORT_ATTRIBUTE_VALUES.ProtocolSection}" id="${EDITOR_REPORT_ID.RadioReportProtocol}"><p data-${EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem}="${EDITOR_REPORT_ATTRIBUTE_VALUES.ProtocolTitle}"><u><b>${escapeAndSanitizeHTML(template.name)}</b></u></p><p><b>Protocol:</b></p>${sanitizeHTML(template.protocol.html)}<p><b>Clinical Profile:</b></p><p><b>Comparison:</b></p></div>`;
}

function generateFirstFindingInReportHTML(
  findingData: EditorFindingData
): string {
  return `<div data-${EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem}="${EDITOR_REPORT_ATTRIBUTE_VALUES.FindingsSection}" id="${EDITOR_REPORT_ID.RadioReportFindings}"><p><u><b>Findings:</b></u></p>${generateFirstFindingInScopeHTML(findingData)}</div>`;
}

function generateFirstFindingInScopeHTML(
  findingData: EditorFindingData
): string {
  return `<div data-${EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem}="${EDITOR_REPORT_ATTRIBUTE_VALUES.Scope}" data-${EDITOR_REPORT_ATTRIBUTE_NAMES.ScopeIndex}="${findingData.scopeIndex}" id="${findingData.scope.id}"><p><b>${escapeAndSanitizeHTML(findingData.scope.name)}</b></p>${generateFindingHTML(findingData.finding)}</div>`;
}

function generateFindingHTML(finding: FindingData): string {
  return `<div data-${EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem}="${EDITOR_REPORT_ATTRIBUTE_VALUES.Finding}" id="${finding.id}">${sanitizeHTML(finding.description.html)}</div>`;
}

function sanitizeHTML(html: string | null | undefined): string {
  if (isNil(html)) {
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}

function escapeHTML(html: string | null | undefined): string {
  return escape(html ?? undefined);
}

function escapeAndSanitizeHTML(html: string | null | undefined): string {
  return sanitizeHTML(escapeHTML(html));
}

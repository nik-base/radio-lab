import { ChainedCommands, Editor, NodePos } from '@tiptap/core';

import { Template } from '@app/models/domain';

import {
  EDITOR_REPORT_ATTRIBUTE_NAMES,
  EDITOR_REPORT_ATTRIBUTE_VALUES,
  EDITOR_REPORT_EXTENSION_NODE_NAME,
  EDITOR_REPORT_ID,
} from '../constants';

import {
  escapeAndSanitizeHTML,
  generateEditorDataAttribute,
  sanitizeHTML,
} from './editor-report-common-extension.functions';

export function insertRadioProtocolInEditor(
  editor: Editor,
  chain: () => ChainedCommands,
  template: Template
): ChainedCommands {
  const html: string = generateProtocolHTML(template);

  const findingsSection: NodePos | null = editor.$doc.querySelector(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      id: EDITOR_REPORT_ID.RadioReportFindings,
    }
  );

  if (!findingsSection) {
    // editor empty
    return chain().insertContentAt(0, html);
  }

  // editor has findings
  return chain().insertContentAt(findingsSection.pos - 1, html);
}

function generateProtocolHTML(template: Template): string {
  const radioItem: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem,
    EDITOR_REPORT_ATTRIBUTE_VALUES.ProtocolSection
  );

  const sectionId: string = EDITOR_REPORT_ID.RadioReportProtocol;

  const protocolTitle: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem,
    EDITOR_REPORT_ATTRIBUTE_VALUES.ProtocolTitle
  );

  return (
    `<div ${radioItem} id="${sectionId}">` +
    `<p ${protocolTitle}><u><b>${escapeAndSanitizeHTML(template.name)}</b></u></p>` +
    `<p><b>Protocol:</b></p>` +
    sanitizeHTML(template.protocol.html) +
    `<p><b>Clinical Profile:</b></p>` +
    `<p><b>Comparison:</b></p>` +
    `</div>`
  );
}

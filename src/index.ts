/* eslint-disable import/no-extraneous-dependencies */
import { editor } from 'monaco-editor';
import { ipcRenderer } from 'electron';

import './index.css';

const mEditor = editor.create(document.getElementById('container'), {
  value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
  language: 'javascript',
});

const model = mEditor.getModel();

/*
interface LintMessage {
  column: number;
  line: number;
  endColumn?: number | undefined;
  endLine?: number | undefined;
  ruleId: string | null;
  message: string;
  messageId?: string | undefined;
  nodeType?: string | undefined;
  fatal?: true | undefined;
  severity: Severity;
  fix?: Rule.Fix | undefined;
  source?: string | null | undefined;
  suggestions?: LintSuggestion[] | undefined;
}

export interface IMarkerData {
  code?: string | {
    value: string;
    target: Uri;
  };
  severity: MarkerSeverity;
  message: string;
  source?: string;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  relatedInformation?: IRelatedInformation[];
  tags?: MarkerTag[];
}
*/

const main = async () => {
  const r = await ipcRenderer.invoke('lint', model.getValue());
  console.log(r[0].messages);
  editor.setModelMarkers(model, 'eslint', r[0].messages.map((m) => ({
    severity: m.severity * 4,
    message: m.message,
    startLineNumber: m.line,
    startColumn: m.column,
    endLineNumber: m.endLine,
    endColumn: m.endColumn,
  })));
};
main();

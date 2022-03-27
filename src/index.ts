/* eslint-disable import/no-extraneous-dependencies */
import {
  editor, languages, Range,
} from 'monaco-editor';
import { ipcRenderer } from 'electron';
import { debounce } from 'lodash';

import './index.css';

const mEditor = editor.create(document.getElementById('container'), {
  value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
  language: 'typescript',
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
const actions: languages.CodeAction[] = [];
const lint = async (fix = false) => {
  const r = await ipcRenderer.invoke('lint', model.getValue(), fix);
  if (r.output) {
    mEditor.executeEdits('eslint', [{
      range: model.getFullModelRange(), text: r.output,
    }]);
  }
  const markers: editor.IMarkerData[] = [];
  actions.length = 0;
  r.messages.forEach((m) => {
    const marker = {
      severity: m.severity * 4,
      message: m.message,
      startLineNumber: m.line,
      startColumn: m.column,
      endLineNumber: m.endLine ?? m.line,
      endColumn: m.endColumn ?? m.column,
    };
    markers.push(marker);
    if (m.fix) {
      const action = {
        title: `Fix '${m.message}'`,
        diagnostics: [marker],
        kind: 'quickfix',
        isPreferred: true, // show a blue balloon instead of a yellow balloon
        edit: {
          edits: [
            {
              resource: model.uri,
              edit: {
                range: marker,
                text: m.fix.text,
              },
            },
          ],
        },
      };
      actions.push(action);
    }
  });
  editor.setModelMarkers(model, 'eslint', markers);
};
const dLint = debounce(lint, 100, { leading: false, trailing: true });

lint();
model.onDidChangeContent(() => {
  dLint();
});

ipcRenderer.on('message', (event, message) => {
  if (message.command === 'save') {
    lint(true);
  }
});

const codeActionProvider: languages.CodeActionProvider = {
  provideCodeActions: (_model: editor.ITextModel, range: Range) => {
    const fActions = actions.filter((a) => {
      const {
        startLineNumber, startColumn, endLineNumber, endColumn,
      } = a.diagnostics[0];
      const tempRange = new Range(startLineNumber, startColumn, endLineNumber, endColumn);
      return tempRange.containsRange(range);
    });
    return {
      actions: fActions,
      dispose: () => {},
    };
  },
};
languages.registerCodeActionProvider('typescript', codeActionProvider);

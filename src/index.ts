/* eslint-disable import/no-extraneous-dependencies */
import * as monaco from 'monaco-editor';

import './index.css';

monaco.editor.create(document.getElementById('container'), {
  value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
  language: 'javascript',
});

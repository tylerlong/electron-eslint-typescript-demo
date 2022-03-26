/* eslint-disable import/no-extraneous-dependencies */
import * as monaco from 'monaco-editor';
import { ipcRenderer } from 'electron';

import './index.css';

monaco.editor.create(document.getElementById('container'), {
  value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
  language: 'javascript',
});

const main = async () => {
  const r = await ipcRenderer.invoke('lint', 'var a = 1');
  console.log(r);
};
main();

// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow } from 'electron';
import { ESLint } from 'eslint';
import log from 'electron-log';
import * as path from 'path';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
  mainWindow.loadFile('src/index.html');
  mainWindow.webContents.openDevTools();
  const eslint = new ESLint({ cwd: path.join(__dirname, '..') });
  setTimeout(async () => {
    try {
      const r = await eslint.lintText('var a = 1', { filePath: 'src/main.ts' });
      mainWindow.webContents.executeJavaScript(`console.log(\`${JSON.stringify(r, null, 2)}\`);`);
    } catch (e) {
      log.error(e);
    }
  }, 1000);
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

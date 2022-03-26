// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow } from 'electron';
import { ESLint } from 'eslint';
import log from 'electron-log';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
  mainWindow.loadFile('src/index.html');
  mainWindow.webContents.openDevTools();
  log.info('start');
  try {
    const eslint = new ESLint();
    eslint.lintText('var a = 1', { filePath: 'src/main.ts' }).then((r) => {
      log.info(JSON.stringify(r, null, 2));
    });
  } catch (e) {
    log.info(e);
  } finally {
    log.info('finally');
  }
  log.info('end');
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

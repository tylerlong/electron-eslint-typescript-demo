// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow, ipcMain } from 'electron';
import { ESLint } from 'eslint';
import log from 'electron-log';
import { join } from 'path';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile('src/index.html');
  mainWindow.webContents.openDevTools();
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

const eslint = new ESLint({ cwd: join(__dirname, '..').replace('app.asar', 'app.asar.unpacked') });
ipcMain.handle('lint', async (event, code) => {
  try {
    const r = await eslint.lintText(code, { filePath: 'src/temp.ts' });
    return r;
  } catch (e) {
    log.error(e);
    throw e;
  }
});

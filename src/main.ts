// eslint-disable-next-line import/no-extraneous-dependencies
import {
  app, BrowserWindow, ipcMain, Menu, MenuItemConstructorOptions,
} from 'electron';
import { ESLint } from 'eslint';
import log from 'electron-log';
import { join } from 'path';
import { newTemplate } from 'electron-application-menu-template';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
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

const linter1 = new ESLint({ cwd: join(__dirname, '..').replace('app.asar', 'app.asar.unpacked') });
const linter2 = new ESLint({ cwd: join(__dirname, '..').replace('app.asar', 'app.asar.unpacked'), fix: true });
ipcMain.handle('lint', async (event, code, fix) => {
  const linter = fix ? linter2 : linter1;
  try {
    const r = await linter.lintText(code, { filePath: 'src/temp.ts' });
    return r[0];
  } catch (e) {
    log.error(e);
    throw e;
  }
});

const template = newTemplate();
const fileMenu = template.find((item) => item.label === 'File')!;
(fileMenu.submenu! as MenuItemConstructorOptions[]).unshift(
  {
    label: 'Save',
    accelerator: 'CmdOrCtrl+S',
    async click(menuItem, window) {
      window.webContents.send('message', { command: 'save' });
    },
  },
  {
    type: 'separator',
  },
);

app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
});

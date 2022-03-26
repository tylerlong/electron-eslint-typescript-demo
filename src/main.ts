import { app, BrowserWindow } from 'electron';
import { ESLint } from 'eslint';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
  mainWindow.loadFile('src/index.html');
  const eslint = new ESLint();
  eslint.lintText('var a = 1', { filePath: 'src/main.ts' }).then((r) => {
    console.log(JSON.stringify(r, null, 2));
  });
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

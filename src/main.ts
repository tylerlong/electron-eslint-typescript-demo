import { app, BrowserWindow } from 'electron';
import { ESLint } from 'eslint';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
  mainWindow.loadFile('src/index.html');
  mainWindow.webContents.openDevTools();
  const eslint = new ESLint();
  setTimeout(() => {
    eslint.lintText('var a = 1', { filePath: 'src/main.ts' }).then((r) => {
      mainWindow.webContents.executeJavaScript(`console.log(\`${JSON.stringify(r, null, 2)}\`);`);
    });
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

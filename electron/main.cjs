const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Allow local files and disable unnecessary security blocks for local assets
app.commandLine.appendSwitch('allow-file-access-from-files');
app.commandLine.appendSwitch('disable-web-security');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1040,
    minHeight: 650,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    icon: path.join(__dirname, '../public/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
    },
  });

  if (typeof mainWindow.setBackgroundMaterial === 'function') {
    try {
      mainWindow.setBackgroundMaterial('acrylic');
    } catch {}
  }
  if (typeof mainWindow.setVibrancy === 'function') {
    try {
      mainWindow.setVibrancy('under-window');
    } catch {}
  }

  const indexPath = path.join(__dirname, '../dist/index.html');
  mainWindow.loadFile(indexPath);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Window Controls
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

ipcMain.handle('window-set-always-on-top', (event, flag) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(!!flag);
    return true;
  }
  return false;
});

ipcMain.on('window-set-theme-mode', (event, { isTransparent }) => {
  if (mainWindow) {
    if (typeof mainWindow.setBackgroundMaterial === 'function') {
      try {
        mainWindow.setBackgroundMaterial(isTransparent ? 'acrylic' : 'none');
      } catch {}
    }
    if (typeof mainWindow.setVibrancy === 'function') {
      try {
        mainWindow.setVibrancy(isTransparent ? 'under-window' : null);
      } catch {}
    }
  }
});

// Native File Dialogs
ipcMain.handle('dialog-open-file', async () => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Scripts', extensions: ['lua', 'py', 'js', 'ts', 'html', 'json', 'txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  const filePath = result.filePaths[0];
  const content = fs.readFileSync(filePath, 'utf-8');
  return {
    name: path.basename(filePath),
    path: filePath,
    content
  };
});

ipcMain.handle('dialog-save-file', async (event, { name, content }) => {
  if (!mainWindow) return false;
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: name || 'script.lua',
    filters: [
      { name: 'Scripts', extensions: ['lua', 'py', 'js', 'ts', 'html', 'json', 'txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  if (result.canceled || !result.filePath) return false;
  fs.writeFileSync(result.filePath, content, 'utf-8');
  return { success: true, filePath: result.filePath };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

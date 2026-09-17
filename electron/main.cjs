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

// Native Folder Dialog & Directory Reading
ipcMain.handle('dialog-open-folder', async () => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  const folderPath = result.filePaths[0];

  function readDirRecursive(dir, depth = 0) {
    if (depth > 4) return [];
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      entries.sort((a, b) => {
        if (a.isDirectory() === b.isDirectory()) {
          return a.name.localeCompare(b.name);
        }
        return a.isDirectory() ? -1 : 1;
      });

      const nodes = [];
      for (const entry of entries) {
        if (
          entry.name.startsWith('.') || 
          entry.name === 'node_modules' || 
          entry.name === '__pycache__' || 
          entry.name === 'dist' ||
          entry.name === 'build' ||
          entry.name === '.git'
        ) {
          continue;
        }
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          nodes.push({
            id: 'folder-' + fullPath,
            name: entry.name,
            type: 'folder',
            path: fullPath,
            children: readDirRecursive(fullPath, depth + 1)
          });
        } else {
          const ext = path.extname(entry.name).toLowerCase();
          let lang = 'plaintext';
          if (ext === '.py') lang = 'python';
          else if (ext === '.ts' || ext === '.tsx') lang = 'typescript';
          else if (ext === '.js' || ext === '.jsx') lang = 'javascript';
          else if (ext === '.lua' || ext === '.luau') lang = 'lua';
          else if (ext === '.html' || ext === '.htm') lang = 'html';
          else if (ext === '.css') lang = 'css';
          else if (ext === '.json') lang = 'json';
          else if (ext === '.cpp' || ext === '.c' || ext === '.h' || ext === '.hpp') lang = 'cpp';
          else if (ext === '.rs') lang = 'rust';
          else if (ext === '.go') lang = 'go';
          else if (ext === '.md') lang = 'markdown';

          nodes.push({
            id: 'file-' + fullPath,
            name: entry.name,
            type: 'file',
            path: fullPath,
            language: lang
          });
        }
      }
      return nodes;
    } catch {
      return [];
    }
  }

  return {
    folderName: path.basename(folderPath),
    folderPath: folderPath,
    tree: readDirRecursive(folderPath)
  };
});

ipcMain.handle('dialog-read-file', async (event, filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return { success: true, content, name: path.basename(filePath), path: filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
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

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,

  // Window Controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  setAlwaysOnTop: (flag) => ipcRenderer.invoke('window-set-always-on-top', flag),
  setThemeMode: (opts) => ipcRenderer.send('window-set-theme-mode', opts),

  // Native File & Folder Dialogs
  openFileDialog: () => ipcRenderer.invoke('dialog-open-file'),
  saveFileDialog: (data) => ipcRenderer.invoke('dialog-save-file', data),
  openFolderDialog: () => ipcRenderer.invoke('dialog-open-folder'),
  readFile: (filePath) => ipcRenderer.invoke('dialog-read-file', filePath),

  // Direct Filesystem CRUD
  writeFile: (filePath, content) => ipcRenderer.invoke('file-write-direct', { filePath, content }),
  createFile: (targetPath, content) => ipcRenderer.invoke('file-create', { targetPath, content }),
  deleteFile: (targetPath) => ipcRenderer.invoke('file-delete', targetPath),
  renameFile: (oldPath, newPath) => ipcRenderer.invoke('file-rename', { oldPath, newPath }),
  createFolder: (dirPath) => ipcRenderer.invoke('folder-create', dirPath),

  // Real Multi-Language Process Execution Engine
  runProcess: (opts) => ipcRenderer.invoke('process-run', opts),
  killProcess: () => ipcRenderer.invoke('process-kill'),
  writeStdin: (text) => ipcRenderer.invoke('process-stdin', text),

  // Process Output Stream Listener (stdout, stderr, exit)
  onProcessOutput: (callback) => {
    const onStdout = (event, data) => callback({ type: 'stdout', text: data.text, pid: data.pid });
    const onStderr = (event, data) => callback({ type: 'stderr', text: data.text, pid: data.pid });
    const onExit = (event, data) => callback({ type: 'exit', code: data.code, elapsedMs: data.elapsedMs, pid: data.pid });

    ipcRenderer.on('process-stdout', onStdout);
    ipcRenderer.on('process-stderr', onStderr);
    ipcRenderer.on('process-exit', onExit);

    // Return cleanup unsubscriber
    return () => {
      ipcRenderer.removeListener('process-stdout', onStdout);
      ipcRenderer.removeListener('process-stderr', onStderr);
      ipcRenderer.removeListener('process-exit', onExit);
    };
  },

  // System Environment & Compiler Detection
  detectRuntimes: () => ipcRenderer.invoke('system-detect-runtimes'),
});

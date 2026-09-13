const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  openFileDialog: () => ipcRenderer.invoke('dialog-open-file'),
  saveFileDialog: (data) => ipcRenderer.invoke('dialog-save-file', data),
  setAlwaysOnTop: (flag) => ipcRenderer.invoke('window-set-always-on-top', flag),
  setThemeMode: (opts) => ipcRenderer.send('window-set-theme-mode', opts),
});


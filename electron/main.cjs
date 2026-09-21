const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn, execSync, exec } = require('child_process');

// Allow local files and disable unnecessary security blocks for local assets
app.commandLine.appendSwitch('allow-file-access-from-files');
app.commandLine.appendSwitch('disable-web-security');

let mainWindow = null;
let activeProcess = null;
let activeProcessStartTime = 0;

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
    if (activeProcess) {
      try {
        if (process.platform === 'win32') {
          execSync(`taskkill /F /T /PID ${activeProcess.pid}`);
        } else {
          activeProcess.kill();
        }
      } catch {}
      activeProcess = null;
    }
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

// ============================================================================
// Real Multi-Language Process Execution Backend
// ============================================================================

ipcMain.handle('process-run', async (event, { code, language, filePath, cwd, args }) => {
  if (activeProcess) {
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /F /T /PID ${activeProcess.pid}`);
      } else {
        activeProcess.kill();
      }
    } catch {}
    activeProcess = null;
  }

  let execFile = filePath;
  let isTemp = false;

  // If unsaved code or no file on disk, create temporary execution script
  if (!execFile || !fs.existsSync(execFile) || code !== undefined) {
    const extMap = {
      python: '.py',
      javascript: '.js',
      typescript: '.ts',
      lua: '.lua',
      c: '.c',
      cpp: '.cpp',
      rust: '.rs',
      csharp: '.cs',
      java: '.java',
      go: '.go',
      php: '.php',
      ruby: '.rb',
      kotlin: '.kt',
      swift: '.swift',
      dart: '.dart',
      r: '.r',
      julia: '.jl',
      perl: '.pl',
      scala: '.scala',
      zig: '.zig',
      haskell: '.hs',
      shell: '.bat',
      powershell: '.ps1',
      json: '.json',
      markdown: '.md',
      html: '.html',
      css: '.css',
      plaintext: '.txt'
    };
    const ext = extMap[language] || '.txt';
    const tempDir = path.join(os.tmpdir(), 'crystall_ide_runs');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    execFile = path.join(tempDir, `run_${Date.now()}${ext}`);
    fs.writeFileSync(execFile, code !== undefined ? code : '', 'utf-8');
    isTemp = true;
  }

  const workingDir = cwd || (filePath && fs.existsSync(filePath) ? path.dirname(filePath) : path.dirname(execFile));

  // Determine command and arguments based on language
  let cmd = '';
  let cmdArgs = [];
  const lang = (language || '').toLowerCase();

  if (lang === 'python' || lang === 'py') {
    cmd = process.platform === 'win32' ? 'python' : 'python3';
    cmdArgs = ['-u', execFile, ...(args || [])];
  } else if (lang === 'javascript' || lang === 'js') {
    cmd = 'node';
    cmdArgs = [execFile, ...(args || [])];
  } else if (lang === 'typescript' || lang === 'ts' || lang === 'tsx') {
    cmd = 'node';
    cmdArgs = ['--experimental-strip-types', execFile, ...(args || [])];
  } else if (lang === 'lua') {
    cmd = 'lua';
    cmdArgs = [execFile, ...(args || [])];
  } else if (lang === 'java') {
    cmd = 'java';
    cmdArgs = [execFile, ...(args || [])];
  } else if (lang === 'rust' || lang === 'rs') {
    const exeOut = execFile.replace(/\.rs$/i, process.platform === 'win32' ? '.exe' : '');
    cmd = `rustc -O "${execFile}" -o "${exeOut}" && "${exeOut}"`;
    cmdArgs = args || [];
  } else if (lang === 'cpp' || lang === 'c++') {
    const exeOut = execFile.replace(/\.(cpp|cc|cxx)$/i, process.platform === 'win32' ? '.exe' : '');
    cmd = `g++ -O2 -std=c++17 "${execFile}" -o "${exeOut}" && "${exeOut}"`;
    cmdArgs = args || [];
  } else if (lang === 'c') {
    const exeOut = execFile.replace(/\.c$/i, process.platform === 'win32' ? '.exe' : '');
    cmd = `gcc -O2 "${execFile}" -o "${exeOut}" && "${exeOut}"`;
    cmdArgs = args || [];
  } else if (lang === 'csharp' || lang === 'cs' || lang === 'c#') {
    const exeOut = execFile.replace(/\.cs$/i, '.exe');
    cmd = `csc -nologo -out:"${exeOut}" "${execFile}" && "${exeOut}"`;
    cmdArgs = args || [];
  } else if (lang === 'go') {
    cmd = 'go';
    cmdArgs = ['run', execFile, ...(args || [])];
  } else if (lang === 'php') {
    cmd = 'php';
    cmdArgs = [execFile, ...(args || [])];
  } else if (lang === 'ruby' || lang === 'rb') {
    cmd = 'ruby';
    cmdArgs = [execFile, ...(args || [])];
  } else if (lang === 'kotlin' || lang === 'kt') {
    cmd = 'kotlinc';
    cmdArgs = ['-script', execFile, ...(args || [])];
  } else if (lang === 'swift') {
    cmd = 'swift';
    cmdArgs = [execFile, ...(args || [])];
  } else if (lang === 'dart') {
    cmd = 'dart';
    cmdArgs = ['run', execFile, ...(args || [])];
  } else if (lang === 'r') {
    cmd = 'Rscript';
    cmdArgs = [execFile, ...(args || [])];
  } else if (lang === 'julia' || lang === 'jl') {
    cmd = 'julia';
    cmdArgs = [execFile, ...(args || [])];
  } else if (lang === 'perl' || lang === 'pl') {
    cmd = 'perl';
    cmdArgs = [execFile, ...(args || [])];
  } else if (lang === 'scala') {
    cmd = 'scala';
    cmdArgs = [execFile, ...(args || [])];
  } else if (lang === 'zig') {
    cmd = 'zig';
    cmdArgs = ['run', execFile, ...(args || [])];
  } else if (lang === 'haskell' || lang === 'hs') {
    cmd = 'runghc';
    cmdArgs = [execFile, ...(args || [])];
  } else if (lang === 'powershell' || lang === 'ps1') {
    cmd = 'powershell.exe';
    cmdArgs = ['-ExecutionPolicy', 'Bypass', '-File', execFile, ...(args || [])];
  } else if (lang === 'shell' || lang === 'bat' || lang === 'cmd') {
    cmd = 'cmd.exe';
    cmdArgs = ['/c', execFile, ...(args || [])];
  } else {
    cmd = execFile;
    cmdArgs = args || [];
  }

  activeProcessStartTime = Date.now();

  try {
    const child = spawn(cmd, cmdArgs, {
      cwd: workingDir,
      env: { ...process.env, PYTHONUNBUFFERED: '1', NODE_ENV: 'development' },
      shell: true
    });

    activeProcess = child;

    child.stdout.on('data', (data) => {
      const text = data.toString();
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('process-stdout', { text, pid: child.pid });
      }
    });

    child.stderr.on('data', (data) => {
      const text = data.toString();
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('process-stderr', { text, pid: child.pid });
      }
    });

    child.on('error', (err) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('process-stderr', { text: `[Process Spawn Error] ${err.message}\n`, pid: child.pid });
      }
    });

    child.on('close', (code) => {
      const elapsed = Date.now() - activeProcessStartTime;
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('process-exit', { code, elapsedMs: elapsed, pid: child.pid });
      }
      activeProcess = null;
      if (isTemp) {
        try { fs.unlinkSync(execFile); } catch {}
        try {
          const exeOut = execFile.replace(/\.(c|cpp|cc|cxx|rs|cs)$/i, process.platform === 'win32' ? '.exe' : '');
          if (fs.existsSync(exeOut)) fs.unlinkSync(exeOut);
        } catch {}
      }
    });

    return { success: true, pid: child.pid, command: `${cmd} ${cmdArgs.join(' ')}`, workingDir };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Kill Active Process
ipcMain.handle('process-kill', () => {
  if (activeProcess) {
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /F /T /PID ${activeProcess.pid}`);
      } else {
        activeProcess.kill();
      }
      activeProcess = null;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  return { success: false, error: 'No active process' };
});

// Write to Process Stdin
ipcMain.handle('process-stdin', (event, text) => {
  if (activeProcess && activeProcess.stdin && !activeProcess.stdin.destroyed) {
    try {
      activeProcess.stdin.write(text + '\n');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  return { success: false, error: 'Process stdin unavailable' };
});

// ============================================================================
// System Runtime Auto-Detection
// ============================================================================

ipcMain.handle('system-detect-runtimes', async () => {
  const checkCmd = (cmd) => {
    return new Promise((resolve) => {
      exec(cmd, { timeout: 1800 }, (error, stdout, stderr) => {
        if (error) {
          resolve(null);
        } else {
          resolve((stdout || stderr || '').trim().split('\n')[0]);
        }
      });
    });
  };

  const [
    python, node, git, rustc, go, gcc, gxx, java, dotnet, php, ruby, kotlinc, swift, dart, zig, julia, rscript, perl, scala, ghc
  ] = await Promise.all([
    checkCmd('python --version'),
    checkCmd('node -v'),
    checkCmd('git --version'),
    checkCmd('rustc --version'),
    checkCmd('go version'),
    checkCmd('gcc --version'),
    checkCmd('g++ --version'),
    checkCmd('java -version'),
    checkCmd('dotnet --version'),
    checkCmd('php -v'),
    checkCmd('ruby -v'),
    checkCmd('kotlinc -version'),
    checkCmd('swift --version'),
    checkCmd('dart --version'),
    checkCmd('zig version'),
    checkCmd('julia --version'),
    checkCmd('Rscript --version'),
    checkCmd('perl -v'),
    checkCmd('scala -version'),
    checkCmd('ghc --version')
  ]);

  return {
    python: python || null,
    node: node || null,
    git: git || null,
    rustc: rustc || null,
    go: go || null,
    gcc: gcc || null,
    gxx: gxx || null,
    java: java || null,
    dotnet: dotnet || null,
    php: php || null,
    ruby: ruby || null,
    kotlinc: kotlinc || null,
    swift: swift || null,
    dart: dart || null,
    zig: zig || null,
    julia: julia || null,
    rscript: rscript || null,
    perl: perl || null,
    scala: scala || null,
    ghc: ghc || null,
    os: `${os.type()} ${os.release()} (${os.arch()})`,
    cpus: os.cpus().length,
    totalMemoryGb: Math.round(os.totalmem() / (1024 * 1024 * 1024)),
    freeMemoryGb: Math.round(os.freemem() / (1024 * 1024 * 1024))
  };
});

// ============================================================================
// Direct Native Filesystem Operations
// ============================================================================

ipcMain.handle('file-write-direct', async (event, { filePath, content }) => {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('file-create', async (event, { targetPath, content }) => {
  try {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(targetPath, content || '', 'utf-8');
    return { success: true, targetPath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('file-delete', async (event, targetPath) => {
  try {
    if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('file-rename', async (event, { oldPath, newPath }) => {
  try {
    fs.renameSync(oldPath, newPath);
    return { success: true, oldPath, newPath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('folder-create', async (event, dirPath) => {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
    return { success: true, dirPath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// ============================================================================
// Native File & Folder Dialogs
// ============================================================================

ipcMain.handle('dialog-open-file', async () => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Supported Languages', extensions: ['py', 'js', 'ts', 'tsx', 'jsx', 'lua', 'c', 'cpp', 'h', 'hpp', 'rs', 'cs', 'java', 'go', 'php', 'rb', 'kt', 'kts', 'swift', 'dart', 'r', 'jl', 'pl', 'scala', 'zig', 'hs', 'html', 'css', 'json', 'md', 'bat', 'cmd', 'ps1', 'sh', 'txt'] },
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
    defaultPath: name || 'script.py',
    filters: [
      { name: 'Supported Languages', extensions: ['py', 'js', 'ts', 'tsx', 'jsx', 'lua', 'c', 'cpp', 'h', 'hpp', 'rs', 'cs', 'java', 'go', 'php', 'rb', 'kt', 'kts', 'swift', 'dart', 'r', 'jl', 'pl', 'scala', 'zig', 'hs', 'html', 'css', 'json', 'md', 'bat', 'cmd', 'ps1', 'sh', 'txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  if (result.canceled || !result.filePath) return false;
  fs.writeFileSync(result.filePath, content, 'utf-8');
  return { success: true, filePath: result.filePath };
});

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
          else if (ext === '.c' || ext === '.h') lang = 'c';
          else if (ext === '.cpp' || ext === '.cc' || ext === '.cxx' || ext === '.hpp') lang = 'cpp';
          else if (ext === '.rs') lang = 'rust';
          else if (ext === '.cs') lang = 'csharp';
          else if (ext === '.java') lang = 'java';
          else if (ext === '.go') lang = 'go';
          else if (ext === '.php') lang = 'php';
          else if (ext === '.rb') lang = 'ruby';
          else if (ext === '.kt' || ext === '.kts') lang = 'kotlin';
          else if (ext === '.swift') lang = 'swift';
          else if (ext === '.dart') lang = 'dart';
          else if (ext === '.r') lang = 'r';
          else if (ext === '.jl') lang = 'julia';
          else if (ext === '.pl' || ext === '.pm') lang = 'perl';
          else if (ext === '.scala') lang = 'scala';
          else if (ext === '.zig') lang = 'zig';
          else if (ext === '.hs') lang = 'haskell';
          else if (ext === '.md') lang = 'markdown';
          else if (ext === '.bat' || ext === '.cmd' || ext === '.sh') lang = 'shell';
          else if (ext === '.ps1') lang = 'powershell';

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

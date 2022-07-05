import { app, BrowserWindow, Menu, ipcMain, shell, dialog } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
const fs = require('fs');
const os = require('os');
const url = require('url');
import { download } from 'electron-dl';
// const { setup: setupPushReceiver } = require('electron-push-receiver');

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: 'customButtonsOnHover',
    frame: false,
    transparent: true,
    width: 380,
    height: 850,
    title: 'MOLI',
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
      webSecurity: false,
      preload: path.join(app.getAppPath(), '/preload.js'), // 빌드시 /build/preload.js 로 변경 필요
    },
  });

  let indexPath;

  indexPath = url.format({
    protocol: 'file:',
    pathname: path.join(app.getAppPath(), '/index.html'), // 빌드시 /build/index.html 로 변경 필요
    slashes: true,
  });

  app.allowRendererProcessReuse = false;

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools(); // 개발자 툴 오픈
  } else {
    mainWindow.loadURL(indexPath);
  }
  // setupPushReceiver(mainWindow.webContents);

  // 기본 메뉴 숨기기
  mainWindow.setMenuBarVisibility(false);

  // 렌더러 내부 href링크 외부 브라우저로 열리게 처리
  const handleRedirect = (e: any, url: string) => {
    if (url != mainWindow.webContents.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  };

  mainWindow.webContents.on('will-navigate', handleRedirect);
  mainWindow.webContents.on('new-window', handleRedirect);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 브라우저 메뉴창 없애기
Menu.setApplicationMenu(null);

// 리사이징 기능
ipcMain.on('frameMin', (event, data) => {
  mainWindow.setSize(380, 250, true);
  event.sender.send('isFrameMin', true);
  // event.sender.send('isFrameWide', false);
});

ipcMain.on('frameWide', (event, data) => {
  mainWindow.setSize(380, 850, true);
  event.sender.send('isFrameWide', true);
  // event.sender.send('isFrameMin', false);
});

// 창 닫기
ipcMain.on('windowClose', (event, data) => {
  console.log('app quit?', data);
  app.exit();
});

// 창 내리기
ipcMain.on('windowMinimize', (event, data) => {
  mainWindow.minimize();
});

// 토큰 가져오기
let fcmToken = '';
ipcMain.on('fcmToken', (event, data) => {
  console.log('electron token data', data);
  fcmToken = data;
  event.sender.send('electronToken', data);
});

ipcMain.on('callToken', (event, data) => {
  event.sender.send('electronToken', fcmToken);
});

// 사운드 카운트 받기
ipcMain.on('sound_count', (event, data) => {
  event.sender.send('get_sound_count', data);
});

// 사운드 VOLUMNE 설정
ipcMain.on('sound_volume', (event, data) => {
  event.sender.send('get_sound_vol', data);
});

// 메인프로세서 종료
ipcMain.on('closeWindow', (event, data) => {
  mainWindow = null;
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('lang', (event, data) => {
  event.sender.send('lang', app.getLocale());
});

if (process.platform === 'win32') {
  app.setAppUserModelId('MOLI');
}

ipcMain.handle('quit-app', () => {
  app.quit();
});

app.on('ready', createWindow);

app.on('open-url', (event, url) => {
  // dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`);
  shell.openExternal(url);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// 파일 다운로드(url 이미지)
ipcMain.on('download', async (event, { url }) => {
  const win = BrowserWindow.getFocusedWindow();
  // console.log(await download(win, url));
  await download(win, url, {
    saveAs: true,
    openFolderWhenDone: true,
  });
});

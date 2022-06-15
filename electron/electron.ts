import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import * as path from 'path';
const fs = require('fs');
const os = require('os');
const url = require('url');
// const { setup: setupPushReceiver } = require('electron-push-receiver');

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: 'customButtonsOnHover',
    width: 380,
    height: 850,
    title: 'MOLI',
    frame: false,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(app.getAppPath(), 'preload.js'), // 빌드시 /build/preload.js 로 변경 필요
    },
  });

  let indexPath;

  indexPath = url.format({
    protocol: 'file:',
    pathname: path.join(app.getAppPath(), 'index.html'), // 빌드시 /build/index.html 로 변경 필요
    slashes: true,
  });
  mainWindow.loadURL(indexPath);
  // setupPushReceiver(mainWindow.webContents);

  // 기본 메뉴 숨기기
  mainWindow.setMenuBarVisibility(false);

  // 개발자 툴 오픈
  mainWindow.webContents.openDevTools(); // 빌드시 해제 필요

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 브라우저 메뉴창 없애기
Menu.setApplicationMenu(null);

// 리사이징 기능
ipcMain.on('re-size', (event, data) => {
  console.log('ipcMain re-size event', event);
  console.log('ipcMain re-size data', data);

  mainWindow.setSize(380, 300, true);
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

if (process.platform === 'win32') {
  app.setAppUserModelId('MOLI');
}

ipcMain.handle('quit-app', () => {
  app.quit();
});

app.on('ready', createWindow);

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

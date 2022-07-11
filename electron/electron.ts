import {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  shell,
  dialog,
  screen,
} from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
const fs = require('fs');
const os = require('os');
const url = require('url');
import { download } from 'electron-dl';
// const Env = JSON.parse(fs.readFileSync(`${__dirname}/env.json`));
// const { setup: setupPushReceiver } = require('electron-push-receiver');

// const display = screen.getPrimaryDisplay();
// const dimensions = display.workAreaSize;

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: 'customButtonsOnHover',
    frame: false,
    transparent: true,
    width: 380,
    height: 850,
    title: 'MOLI-Listener',
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

// SNS Kakao
ipcMain.on('kakaoLogin', (event, args) => {
  let loginWindow = new BrowserWindow({
    width: 380,
    height: 500,
    show: false,
    parent: mainWindow,
    // webPreferences: {
    //   nodeIntegration: false,
    // },
  });

  const restAPIKey = '6fde81df196e383578c4a91e894b0741';
  const callBackURI = 'http://localhost:3000/auth/kakao/callback';

  loginWindow.webContents.loadURL(
    `https://kauth.kakao.com/oauth/authorize?client_id=${restAPIKey}&redirect_uri=${callBackURI}&response_type=code`
  );

  loginWindow.on('ready-to-show', () => {
    loginWindow.show();
  });

  let kakaoCode = '';

  loginWindow.webContents.on(
    'will-redirect',
    (event: any, oldUrl: any, newUrl: any) => {
      console.log('kakao event ??', event);
      console.log('kakao oldUrl ??', oldUrl);
      console.log('kakao newUrl ??', newUrl);

      const url = new URL(oldUrl);
      const urlParams = url.searchParams;
      kakaoCode = urlParams.get('code');
    }
  );

  loginWindow.webContents.on('did-finish-load', () => {
    console.log('did-finish-load kakaoCode ??', kakaoCode);
    if (kakaoCode) {
      event.sender.send('kakaoLoginCode', kakaoCode);
      loginWindow.close();
    }
  });
});

// SNS Naver
ipcMain.on('naverLogin', (event, args) => {
  let loginWindow = new BrowserWindow({
    width: 380,
    height: 500,
    show: true,
    parent: mainWindow,
  });

  const clientId = 'ZIi4Wpw4nc4fgcRrWh7k';
  const callBackURI = 'http://localhost:3000/auth/kakao/callback';

  loginWindow.webContents.loadURL(
    `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${callBackURI}&state=naver`
  );

  loginWindow.show();
});

// SNS Google
ipcMain.on('googleLogin', (event, args) => {
  let loginWindow = new BrowserWindow({
    width: 380,
    height: 500,
    show: true,
    parent: mainWindow,
  });

  const clientId =
    '759277572836-jj5c320hk1io87gvj1o4n5ggemh21jpk.apps.googleusercontent.com';
  const callBackURI = 'http://localhost:3000/auth/kakao/callback';
  // const callBackURI = 'https://change-all.com/listen/google_callback.php';
  const scope =
    'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
  loginWindow.webContents.loadURL(
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${callBackURI}&scope=${scope}&response_type=code`
  );

  loginWindow.show();
});

// SNS facebook
ipcMain.on('fbLogin', (event, args) => {
  let loginWindow = new BrowserWindow({
    width: 380,
    height: 500,
    show: false,
    // modal: true,
    parent: mainWindow,
    webPreferences: {
      webSecurity: false,
      plugins: true,
    },
  });

  const clientId = '438180334454176';
  // const callBackURI = 'http://localhost:3000/auth/kakao/callback';
  const scopes = 'public_profile';
  const callBackURI = 'https://www.facebook.com/connect/login_success.html';

  // loginWindow.webContents.loadURL(
  //   `https://www.facebook.com/v3.3/dialog/oauth?client_id=${clientId}&redirect_uri=${callBackURI}&state=f11&resource_type=token`
  // );
  loginWindow.webContents.loadURL(
    `https://www.facebook.com/v2.8/dialog/oauth?client_id=${clientId}&redirect_uri=${callBackURI}&response_type=token,granted_scopes&scope=${scopes}&display=popup`
  );

  loginWindow.on('ready-to-show', () => {
    loginWindow.show();
  });

  loginWindow.webContents.on(
    'will-redirect',
    (event: any, oldUrl: any, newUrl: any) => {
      let raw_code = /access_token=([^&]*)/.exec(newUrl) || null;
      let access_token = raw_code && raw_code.length > 1 ? raw_code[1] : null;
      let error = /\?error=(.+)$/.exec(newUrl);

      console.log('FB access_token ??', access_token);

      // if (access_token) {
      //   FB.setAccessToken(access_token);
      //   FB.api(
      //     '/me',
      //     { fields: ['id', 'name', 'picture.width(800).height(800)'] },
      //     function (res) {
      //       console.log('response is:', res);
      //     }
      //   );
      //   loginWindow.close();
      // }
    }
  );
});

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

ipcMain.on('kakao_login', (event, args) => {
  let authWindow = new BrowserWindow({
    width: 380,
    height: 600,
    show: false,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  // console.log(
  //   'electron ENV REACT_APP_KAKAO_CLIENT_ID :::::',
  //   Env.REACT_APP_KAKAO_CLIENT_ID
  // );

  // const REDIRECT_URI = 'http://localhost:3000/auth/kakao/callback';
  // const REDIRECT_URI = `file://${path.join(
  //   __dirname,
  //   '/build/index.html#/auth/kakao/callback'
  // )}`;
  // const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Env.REACT_APP_KAKAO_CLIENT_ID_REST}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  // authWindow.loadURL(kakaoAuthURL);
  // authWindow.webContents.on('did-finish-load', () => {
  //   authWindow.show();
  // });

  // authWindow.webContents.on('will-navigate', (event, url) => {
  //   console.log('will-navigate event', event);
  //   console.log('will-navigate url', url);
  // });
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

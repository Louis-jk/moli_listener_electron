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

let mainWindow: Electron.BrowserWindow | null;
const REDIRECT_URL = 'https://change-all.com/listen_auth_callback';
const USER_AGENT = { userAgent: 'Chrome' };

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
      preload: path.join(
        app.getAppPath(),
        isDev ? '/preload.js' : '/build/preload.js'
      ),
    },
  });

  let indexPath;

  indexPath = url.format({
    protocol: 'file:',
    pathname: path.join(
      app.getAppPath(),
      isDev ? '/index.html' : '/build/index.html'
    ),
    slashes: true,
  });

  app.allowRendererProcessReuse = false;

  // mainWindow.loadURL(renderPath);
  // console.log('electron isDev ?', isDev);
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.loadURL(indexPath);
    mainWindow.webContents.openDevTools(); // 개발자 툴 오픈
  } else {
    mainWindow.loadURL('https://change-all.com/listen_desk');
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
    webPreferences: {
      nodeIntegration: false,
    },
  });

  let restAPIKey = '6fde81df196e383578c4a91e894b0741';
  let apiUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${restAPIKey}&redirect_uri=${REDIRECT_URL}&response_type=code`;

  loginWindow.webContents.loadURL(apiUrl, USER_AGENT);

  // 카카오 앱 내 실행시 loginWindow.webContents.userAgent =
  //   'Mozilla/5.0 (Android; Mobile; rv:13.0) Gecko/13.0 Firefox/13.0 KAKAOTALK';

  loginWindow.on('ready-to-show', () => {
    loginWindow.show();
  });

  let kakaoCode = '';

  loginWindow.webContents.on(
    'will-redirect',
    (event: any, oldUrl: any, newUrl: any) => {
      const url = new URL(oldUrl);
      const urlParams = url.searchParams;
      kakaoCode = urlParams.get('code');
    }
  );

  loginWindow.webContents.on('did-finish-load', () => {
    console.log('did-finish-load kakaoCode ??', kakaoCode);
    if (kakaoCode) {
      console.log('electron kakaoCode :', kakaoCode);

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
    show: false,
    parent: mainWindow,
  });

  let clientId = 'ZIi4Wpw4nc4fgcRrWh7k';
  let clientSecret = 'NXykZyW6Ib';
  let state = 'naver';
  let apiUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&display=popup&redirect_uri=${REDIRECT_URL}&state=${state}&scope=basic_profile`;

  loginWindow.webContents.loadURL(apiUrl, USER_AGENT);

  // 네이버 앱 내 실행시 loginWindow.webContents.userAgent =
  //   'Mozilla/5.0 (iPhone; CPU iPhone OS like Mac OS X) AppleWebKit/605.1.15 NAVER(inapp; search; 620; 10.10.2; XR)';

  loginWindow.on('ready-to-show', () => {
    loginWindow.show();
  });

  let naverOauthCode = '';

  loginWindow.webContents.on('will-navigate', (event, newUrl) => {
    console.log('naver will navigate New Url ::', newUrl);

    const url = new URL(newUrl);
    const urlParams = url.searchParams;
    naverOauthCode = urlParams.get('oauth_token');
  });

  loginWindow.webContents.on('did-finish-load', () => {
    console.log('did-finish-load naverOauthCode ??', naverOauthCode);
    if (naverOauthCode) {
      event.sender.send('naverLoginCode', naverOauthCode);
      loginWindow.close();
    }
  });
});

// SNS Google
ipcMain.on('googleLogin', (event, args) => {
  let loginWindow = new BrowserWindow({
    width: 380,
    height: 500,
    show: true,
    parent: mainWindow,
  });

  let clientId =
    '759277572836-jj5c320hk1io87gvj1o4n5ggemh21jpk.apps.googleusercontent.com';
  let scope =
    'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';

  let apiUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${REDIRECT_URL}&scope=${scope}&response_type=code`;

  loginWindow.webContents.loadURL(apiUrl, {
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:70.0) Gecko/20100101 Firefox/70.0',
  });

  // loginWindow.webContents.userAgent =
  //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:70.0) Gecko/20100101 Firefox/70.0';

  loginWindow.on('ready-to-show', () => {
    loginWindow.show();
  });

  let googleCode: string = '';

  // loginWindow.webContents.on(
  //   'will-redirect',
  //   (event: any, oldUrl: any, newUrl: any) => {
  //     console.log('googleLogin oldUrl ??', oldUrl);

  //     const url = new URL(oldUrl);
  //     const urlParams = url.searchParams;
  //     googleCode = urlParams.get('code');
  //   }
  // );

  // loginWindow.webContents.on('will-navigate', (event, newUrl) => {
  //   const url = new URL(newUrl);
  //   const urlParams = url.searchParams;
  //   googleCode = urlParams.get('code');
  // });

  loginWindow.webContents.on('did-navigate', (event, newUrl) => {
    console.log('google did navigate New Url ::', newUrl);

    const url = new URL(newUrl);
    const urlParams = url.searchParams;
    googleCode = urlParams.get('code');
  });

  loginWindow.webContents.on('did-finish-load', () => {
    if (googleCode) {
      event.sender.send('googleLoginCode', googleCode);
      loginWindow.close();
    }
  });
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

  let clientId = '438180334454176';
  let apiUrl = `https://www.facebook.com/v14.0/dialog/oauth?client_id=${clientId}&redirect_uri=${REDIRECT_URL}&state=f11&resource_type=token&scope=public_profile,email`;

  loginWindow.webContents.loadURL(apiUrl, USER_AGENT);

  loginWindow.on('ready-to-show', () => {
    loginWindow.show();
  });

  let facebookCode: string = '';
  loginWindow.webContents.on(
    'will-redirect',
    (event: any, oldUrl: any, newUrl: any) => {
      const url = new URL(oldUrl);
      const urlParams = url.searchParams;
      facebookCode = urlParams.get('code');
    }
  );

  loginWindow.webContents.on('did-finish-load', () => {
    if (facebookCode) {
      event.sender.send('fbLoginCode', facebookCode);
      loginWindow.close();
    }
  });
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

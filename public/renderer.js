const AgoraRtcEngine = require('agora-electron-sdk').default;
const os = require('os');
const path = require('path');

// Pass your App ID here.
const APPID = '6c3b0d235036476d8fb9b49668821541';
// Pass your token here.
const token =
  '0066c3b0d235036476d8fb9b49668821541IADK9yJ9xEMWtXXsUN4X1LlFjnIp7j55wNIPtGslkfC4I9q269sAAAAAEABEuAAAwmKMYgEAAQDCYoxi';

const sdkLogPath = path.resolve(os.homedir(), './test.log');

const rtcEngine = new AgoraRtcEngine();
// Initialize AgoraRtcEngine.
rtcEngine.initialize(APPID);

rtcEngine.on('error', (err, msg) => {
  console.log('Error!');
});

// The video module is enabled by default. For a voice call, you need to call disableVideo to disable the video module
rtcEngine.disableVideo();

rtcEngine.setLogFile(sdkLogPath);

// Pass your channel name here, which must be the same as the channel name you filled in to generate the temporary token.
// Join the channel.
rtcEngine.joinChannel(token, null, 123456);

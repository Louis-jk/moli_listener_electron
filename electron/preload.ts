const { contextBridge, ipcRenderer } = require('electron');

ipcRenderer.on('re-size', (event, data) => {
  console.log('re-size ?', data);
});

// preload와 electron 브릿지 ()
contextBridge.exposeInMainWorld('appRuntime', {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel: string, data: any) => {
    ipcRenderer.on(channel, data);
  },
});

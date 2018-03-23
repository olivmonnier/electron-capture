import { desktopCapturer, ipcRenderer } from 'electron';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';
import settingsDefault from './settingsDefault';
const Store = require('electron-store');
const store = new Store({ defaults: settingsDefault })
const socket = io(store.get('signalServer'))

ipcRenderer.on('sources', function () {
  desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
    if (error) throw error;

    ipcRenderer.send('sources', sources)
  })
})

ipcRenderer.on('token', function() {
  ipcRenderer.send('token', socket.id)
})
/*desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
  if (error) throw error
  for (let i = 0; i < sources.length; ++i) {
    if (sources[i].name === 'Electron') {
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sources[i].id,
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720
          }
        }
      })
        .then((stream) => handleStream(stream))
        .catch((e) => handleError(e))
    }
  }
})

function handleStream(stream) {
  const video = document.querySelector('video')
  video.srcObject = stream
  video.onloadedmetadata = (e) => video.play()
}

function handleError(e) {
  console.log(e)
}*/
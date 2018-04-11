import { desktopCapturer } from 'electron';
import settingsDefault from './settingsDefault';
const Store = require('electron-store');
const store = new Store({ defaults: settingsDefault });

export function getSources() {
  return new Promise((resolve, reject) => {
    desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
      if (error) throw reject(error);
      resolve(sources)
    })
  })
}

export function getUserMedia(config = {}) {
  const { source } = config;
  const { audio, video } = store.get('media');
  let { mandatory } = video;

  if (source) {
    mandatory['chromeMediaSourceId'] = source;
  }

  return navigator.mediaDevices.getUserMedia({ 
    audio, 
    video: {
      mandatory
    }
  })
}
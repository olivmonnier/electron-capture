import { desktopCapturer } from 'electron';
import settingsDefault from './settingsDefault';
const Store = require('electron-store');
const store = new Store({ defaults: settingsDefault });
const rtcConfig = store.get('rtc');

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
  const video = getVideoConfig();
  let { mandatory } = video;

  if (source && source !== "vr") {
    mandatory['chromeMediaSourceId'] = source;
  }

  return navigator.mediaDevices.getUserMedia({ 
    audio: rtcConfig.audio, 
    video: {
      mandatory
    }
  })
}

function getVideoConfig() {
  const { maxWidth, maxHeight, minWidth, minHeight, maxFrameRate } = rtcConfig

  return {
    mandatory: {
      chromeMediaSource: 'desktop',
      maxWidth, maxHeight, minWidth, minHeight, maxFrameRate
    }
  }
}
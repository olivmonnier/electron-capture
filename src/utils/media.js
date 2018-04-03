import { desktopCapturer } from 'electron';

const MAX_WIDTH = 1980;
const MAX_HEIGHT = 1200;
const MIN_WIDTH = 320;
const MIN_HEIGHT = 180;
const MAX_FRAMERATE = 60;
const audio = false;

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

function getVideoConfig() {
  return {
    mandatory: {
      chromeMediaSource: 'desktop',
      maxWidth: MAX_WIDTH,
      maxHeight: MAX_HEIGHT,
      minWidth: MIN_WIDTH,
      minHeight: MIN_HEIGHT,
      maxFrameRate: MAX_FRAMERATE
    }
  }
}
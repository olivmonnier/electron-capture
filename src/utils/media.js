import { desktopCapturer } from 'electron';

const MAX_WIDTH = 1980;
const MAX_HEIGHT = 1200;
const MIN_WIDTH = 320;
const MIN_HEIGHT = 180;
const MAX_FRAMERATE = 60;
const audio = false;
const videoConfig = {
  mandatory: {
    chromeMediaSource: 'desktop',
    maxWidth: MAX_WIDTH,
    maxHeight: MAX_HEIGHT,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    maxFrameRate: MAX_FRAMERATE
  }
}

export function getSources() {
  return new Promise((resolve, reject) => {
    desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
      if (error) throw reject(error);
      resolve(sources)
    })
  })
}

export function getUserMedia(config = {}) {
  const { source, width, height, framerate } = config;
  const video = Object.create(videoConfig)
  let { mandatory } = video;

  if (source) mandatory['chromeMediaSourceId'] = source;

  mandatory['maxWidth'] = (width) ? parseInt(width, 10) : MAX_WIDTH;

  mandatory['maxHeight'] = (height) ? parseInt(height, 10) : MAX_HEIGHT;

  mandatory['maxFrameRate'] = (framerate) ? parseInt(framerate, 10) : MAX_FRAMERATE;

  return navigator.mediaDevices.getUserMedia({ 
    audio, 
    video: {
      mandatory
    }
  })
}
import { desktopCapturer } from 'electron';

const audio = false;
const videoConfig = {
  mandatory: {
    chromeMediaSource: 'desktop',
    maxWidth: 1980,
    maxHeight: 1200,
    minWidth: 320,
    minHeight: 180,
    maxFrameRate: 60
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

  if (width) mandatory['maxWidth'] = width;

  if (height) mandatory['maxHeight'] = height;

  if (framerate) mandatory['maxFrameRate'] = framerate

  return navigator.mediaDevices.getUserMedia({ 
    audio, 
    video: {
      mandatory
    }
  })
}
import { desktopCapturer } from 'electron';

let audio = false;
let video = {
  mandatory: {
    chromeMediaSource: 'desktop'
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
  const { width, height, source } = config;
  
  if (width) {
    video.mandatory = Object.assign(video.mandatory, {
      minWidth: width,
      maxWidth: width
    })
  }

  if (height) {
    video.mandatory = Object.assign(video.mandatory, {
      minHeight: height,
      maxHeight: height
    })
  }

  if (source) {
    video.mandatory = Object.assign(video.mandatory, {
      chromeMediaSourceId: source
    })
  }

  return navigator.mediaDevices.getUserMedia({ audio, video })
}
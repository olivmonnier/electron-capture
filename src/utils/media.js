import { desktopCapturer } from 'electron';

const audio = false;
const videoConfig = {
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
  const { source } = config;
  const video = Object.create(videoConfig)

  if (source) {
    video.mandatory = Object.assign({}, video.mandatory, {
      chromeMediaSourceId: source
    })
  }

  return navigator.mediaDevices.getUserMedia({ audio, video  })
}
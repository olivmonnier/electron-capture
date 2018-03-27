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
  if (config) {
    video.mandatory = Object.assign(video.mandatory, config)
  }

  return navigator.mediaDevices.getUserMedia({ audio, video })
}
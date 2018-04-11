export default {
  debugMod: false,
  media: {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        maxHeight: 1200,
        maxWidth: 1980,
        minHeight: 180,
        minWidth: 320,
        maxFrameRate: 60
      }
    }
  },
  server: {
    host: 'http://127.0.0.1:8080'
  },
  channel: 'my room'
}
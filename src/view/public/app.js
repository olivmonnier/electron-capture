import Peer from 'simple-peer';
import { queryParameters } from '../../utils/url';

const ws = new WebSocket(`wss://${window.location.host}`);
let peer;

ws.addEventListener('open', onOpen)
ws.addEventListener('message', onMessage)

function onOpen() {
  const parameters = getParameters();

  peer = new Peer();
  handlerPeer(peer, ws);
  ws.send(JSON.stringify(parameters));
}

function onMessage(data) {
  console.log('data', data)

  const { state, signal } = JSON.parse(data.data)

  if (state === 'connect') {
    if (peer && peer.destroyed) {
      peer = new Peer()
      handlerPeer(peer, ws)
    }
    peer.signal(signal)
  }
}

function handlerPeer(peer, socket) {
  peer.on('signal', signal => {
    socket.send(JSON.stringify({
      state: 'connect',
      signal
    }))
  })
  peer.on('stream', function (stream) {
    const video = document.querySelector('#remoteVideos')
    video.src = window.URL.createObjectURL(stream)
    video.play()
  })
  peer.on('close', () => {
    peer.destroy()
  })
}

function getParameters() {
  let parameters;
  const source = window.SOURCE || null;
  const params = queryParameters();

  parameters = {
    state: 'ready',
    params
  }

  if (source) parameters = Object.assign(parameters, { source });

  return parameters;
}

function launchFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}
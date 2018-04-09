import { ipcRenderer } from 'electron';
import SimplePeer from 'simple-peer';
import { getSources, getUserMedia } from './utils/media';
import settingsDefault from './utils/settingsDefault';
const Store = require('electron-store');
const store = new Store({ defaults: settingsDefault });
const ws = new WebSocket(store.get('server').host);

let stream, peer;

// setInterval(function() {
//   getSources()
//     .then(sources => ipcRenderer.send('sources', sources));
// }, 3000)

ws.addEventListener('open', onOpen);
ws.addEventListener('message', onMessage);

function onOpen() {
  ws.send(JSON.stringify({
    state: 'join',
    room: store.get('channel')
  }));
}

function onMessage(data) {
  console.log(data)
  const { state, signal, params, source } = JSON.parse(data.data);

  if (state === 'ready') {
    getUserMedia({ source, params })
      .then(stream => {
        if (peer && !peer.destroyed) {
          peer.destroy();
        }
        peer = new SimplePeer({ initiator: true, stream });
        handlerPeer(peer, ws);
      })
  } else if (state === 'connect') {
    peer.signal(signal)
  }
}

function handlerPeer(peer, socket) {
  peer.on('signal', signal => socket.send(JSON.stringify({
    state: 'connect',
    signal
  })))

  peer.on('close', () => {
    peer.destroy()
  })
}
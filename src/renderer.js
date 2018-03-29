import { ipcRenderer } from 'electron';
import SimplePeer from 'simple-peer';
import { getSources, getUserMedia } from './utils/media';
import settingsDefault from './settingsDefault';
const Store = require('electron-store');
const store = new Store({ defaults: settingsDefault });
const ws = new WebSocket(`ws://127.0.0.1:${store.get('server').port}`);

let stream, peer;

getSources()
  .then(sources => ipcRenderer.send('sources', sources));

ws.addEventListener('message', onMessage);

function onMessage(data) {
  console.log(data)
  const { state, signal, params } = JSON.parse(data.data);

  if (state === 'ready') {
    getUserMedia(params)
      .then(stream => {
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
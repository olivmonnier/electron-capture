import SimplePeer from 'simple-peer';
import io from 'socket.io-client';
import { getSources, getUserMedia } from './utils/media';
import settingsDefault from './utils/settingsDefault';
const Store = require('electron-store');
const store = new Store({ defaults: settingsDefault });
const socket = io(store.get('server').host, {
  query: {
    token: store.get('channel')
  }
});

let stream, peer;

socket.on('connect', onConnect);
socket.on('message', onMessage);

function onConnect() {
  setInterval(function() {
    getSources()
      .then(sources => 
        socket.emit('message', JSON.stringify({
          state: 'sources',
          sources
        })));
  }, 3000);
}

function onMessage(data) {
  console.log(data)
  const { state, signal, params, source } = JSON.parse(data);

  if (state === 'ready') {
    getUserMedia({ source, params })
      .then(stream => {
        if (peer && !peer.destroyed) {
          peer.destroy();
        }
        peer = new SimplePeer({ initiator: true, stream });
        handlerPeer(peer, socket);
      })
  } else if (state === 'connect') {
    peer.signal(signal)
  }
}

function handlerPeer(peer, socket) {
  peer.on('signal', signal => socket.emit('message', JSON.stringify({
    state: 'connect',
    signal
  })))

  peer.on('close', () => {
    peer.destroy()
  })
}
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

let peers = {};
let stream;

socket.on('message', onMessage);

function onMessage(data) {
  console.log(data)
  const { state, signal, source, peerId } = JSON.parse(data);

  if (state === 'ready') {
    getUserMedia({ source })
      .then(stream => {
        peers[peerId] = new SimplePeer({ initiator: true, stream });
        handlerPeer(peers[peerId], socket);
      })
  } else if (state === 'connect') {
    peers[peerId].signal(signal);
  } else if (state === 'sources') {
    sendSources(peerId);
  }
}

function sendSources(peerId) {
  getSources()
    .then(sources =>
      socket.emit('message', JSON.stringify({
        state: 'sources',
        peerId,
        sources
      })));
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
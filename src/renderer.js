import { ipcRenderer } from 'electron';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';
import { getSources, getUserMedia } from './utils/media';
import settingsDefault from './settingsDefault';
const Store = require('electron-store');
const store = new Store({ defaults: settingsDefault });
const socket = io(store.get('signalServer'));

let stream, peer;

getSources()
  .then(sources => ipcRenderer.send('sources', sources));

socket.on('connect', function() {
  ipcRenderer.send('token', socket.id)
})

socket.on('message', function(data) {
  const { state, signal } = JSON.parse(data);

  if (state === 'ready') {
    getUserMedia()
      .then(stream => {
        peer = new SimplePeer({ initiator: true, stream });

        peer.on('signal', signal => socket.emit('message', JSON.stringify({
          state: 'connect',
          signal
        })))

        peer.on('close', () => {
          peer.destroy()
        })
      })
  } else if (state === 'connect') {
    peer.signal(signal)
  }
})
import Peer from 'simple-peer';
const ws = new WebSocket(`ws://127.0.0.1:8080`);
let peer;

console.log('data')

ws.addEventListener('message', onMessage)

ws.addEventListener('open', function() {
  ws.send('test');
})

function onMessage(data) {
  console.log('data', data)

  const { state, signal } = JSON.parse(data.data)

  if (state === 'ready') {
    if (peer && !peer.destroyed) {
      peer.destroy()
    }
    peer = new Peer()
    handlerPeer(peer, ws)
  }
  else if (state === 'connect') {
    if (peer && peer.destroyed) {
      peer = new Peer()
      handlerPeer(peer, ws)
    }
    peer.signal(signal)
  }
}

function handlerPeer(peer, socket) {
  peer.on('signal', function (signal) {
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
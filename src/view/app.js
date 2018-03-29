import Peer from 'simple-peer';
const ws = new WebSocket(`ws://${window.location.host}`);
const params = queryParameters();
let peer;

ws.addEventListener('open', onOpen)
ws.addEventListener('message', onMessage)

function onOpen() {
  peer = new Peer()
  handlerPeer(peer, ws)
  ws.send(JSON.stringify({
    state: 'ready',
    params
  }))
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

function queryParameters(str) {
  return (str || document.location.search).replace(/(^\?)/, '').split("&").map(function (n) { return n = n.split("="), this[n[0]] = n[1], this }.bind({}))[0];
}
import settingsDefault from './utils/settingsDefault';
import { ipcMain } from 'electron';
const Store = require('electron-store');
const http = require('http');
const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const store = new Store({ defaults: settingsDefault });

module.exports = function() {
  let sources;
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server, clientTracking: true });
  const { port } = store.get('server');

  ipcMain.on('sources', (event, arg) => sources = arg);

  app.use(express.static(__dirname + '/view'));

  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/view/view.html'))
  });

  app.get('/sources', function(req, res) {
    res.send({ sources });
  });

  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };

  wss.on('connection', function(ws) {
    if (wss.clients.size > 2) {
      ws.terminate();
      return;
    }

    if (wss.clients.size <= 2) {
      ws.on('message', function(data) {
        wss.clients.forEach(function(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data)
          }
        })
      })
    }
  })

  server.listen(port, function() {
    console.log(`Server run on port ${port}`)
  });
}
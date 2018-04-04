import settingsDefault from './utils/settingsDefault';
import { ipcMain } from 'electron';
const Store = require('electron-store');
const ejs = require('ejs');
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

  app.engine('html', ejs.renderFile);
  app.use(express.static(__dirname + '/view/public'));

  app.get('/', function(req, res) {
    res.render(path.join(__dirname + '/view/index.html'), { source: '' })
  });

  app.get('/sources', function (req, res) {
    res.send({ sources });
  });

  app.get('/vr', function(req, res) {
    res.render(path.join(__dirname + '/view/vr.html'), { source: '' })
  })

  app.get('/vr/:source', function (req, res) {
    res.render(path.join(__dirname + '/view/vr.html'), {
      source: req.params.source
    })
  })

  app.get('/:source', function (req, res) {
    res.render(path.join(__dirname + '/view/index.html'), {
      source: req.params.source
    })
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
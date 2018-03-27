import settingsDefault from './settingsDefault';
import { ipcMain } from 'electron';
const Store = require('electron-store');
const express = require('express')
const store = new Store({ defaults: settingsDefault });

module.exports = function() {
  let sources, token;
  const app = express();
  const { port } = store.get('server');

  ipcMain.on('sources', (event, arg) => sources = arg);
  ipcMain.on('token', (event, arg) => token = arg);

  app.get('/', function(req, res) {
    res.send('Hello World')
  });

  app.get('/sources', function(req, res) {
    res.send({ sources });
  });

  app.get('/token', function(req, res) {
    res.send({ token });
  })

  app.listen(port, function() {
    console.log(`Server run on port ${port}`)
  });
}